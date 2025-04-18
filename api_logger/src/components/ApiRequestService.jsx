import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ApiRequestForm from './ApiRequestForm';
import ResultSummary from './ResultSummary';
import Charts from './Charts';
import IterationResults from './IterationResults';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

function ApiRequestService() {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [body, setBody] = useState('');
  const [iterations, setIterations] = useState(1);
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState(null);
  const [requestsPerBatch, setRequestsPerBatch] = useState(1);
  const [batchDelay, setBatchDelay] = useState(1000);
  const [successCount, setSuccessCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [networkErrorCount, setNetworkErrorCount] = useState(0);
  const [http4xxErrorCount, setHttp4xxErrorCount] = useState(0);
  const [http5xxErrorCount, setHttp5xxErrorCount] = useState(0);
  const [http2xxSuccessCount, setHttp2xxSuccessCount] = useState(0);
  const [responseTimes, setResponseTimes] = useState([]);
  const [scriptNames, setScriptNames] = useState('');
  const [scripts, setScripts] = useState({});
  const [sendAllAtOnce, setSendAllAtOnce] = useState(false);

  useEffect(() => {
    const loadScripts = async () => {
      const scriptList = scriptNames.split(',').map((scriptName) => scriptName.trim());
      const loadedScripts = {};
      for (const script of scriptList) {
        try {
          const scriptModule = await import(`../middleware/${script}.js`);
          loadedScripts[script] = scriptModule;
        } catch (err) {
          console.warn(`Erreur de chargement du script "${script}"`, err);
        }
      }
      setScripts(loadedScripts);
    };

    if (scriptNames) {
      loadScripts();
    }
  }, [scriptNames]);

  const processRequest = async (e) => {
    e.preventDefault();
    setError(null);
    setResponses([]);
    setNetworkErrorCount(0);
    setHttp4xxErrorCount(0);
    setHttp5xxErrorCount(0);
    setHttp2xxSuccessCount(0);
    setResponseTimes([]);

    const startTime = performance.now();

    try {
      let successCount = 0;
      let errorCount = 0;

      const runSingleRequest = async (iterationIndex) => {
        const startRequestTime = performance.now();

        let requestData = {};
        try {
          requestData = body && ['POST', 'PUT'].includes(method) ? JSON.parse(body) : {};
        } catch (jsonErr) {
          setError("Le corps de la requête n'est pas un JSON valide.");
          return null;
        }

        if (scripts) {
          for (const [name, module] of Object.entries(scripts)) {
            try {
              const func = module.default || module[name] || module.main;
              if (typeof func === 'function') {
                const result = await func(requestData);
                requestData = { ...requestData, ...result };
              }
            } catch (scriptError) {
              console.warn(`Erreur dans le script "${name}"`, scriptError);
            }
          }
        }

        const config = {
          method: method.toLowerCase(),
          url,
          ...(Object.keys(requestData).length > 0 ? { data: requestData } : {}),
        };

        try {
          const response = await axios(config);
          const requestTime = performance.now() - startRequestTime;

          setHttp2xxSuccessCount((prev) => prev + 1);
          setResponseTimes((prev) => [...prev, requestTime]);

          return {
            iteration: iterationIndex + 1,
            data: response.data,
            error: null,
            time: requestTime,
            statusCode: response.status,
            success: true,
          };
        } catch (err) {
          const requestTime = performance.now() - startRequestTime;
          const status = err.response?.status;

          if (status >= 400 && status < 500) setHttp4xxErrorCount((prev) => prev + 1);
          else if (status >= 500) setHttp5xxErrorCount((prev) => prev + 1);
          else setNetworkErrorCount((prev) => prev + 1);

          return {
            iteration: iterationIndex + 1,
            data: null,
            error: err.message || 'Une erreur est survenue',
            time: requestTime,
            statusCode: status || 'N/A',
            success: false,
          };
        }
      };

      if (requestsPerBatch >= iterations) {
        const promises = Array.from({ length: iterations }, (_, i) => runSingleRequest(i));
        const results = await Promise.all(promises);
        const filtered = results.filter(Boolean);

        const successes = filtered.filter((r) => r.success);
        const failures = filtered.length - successes.length;

        setResponses(filtered);
        setSuccessCount(successes.length);
        setErrorCount(failures);
      } else {
        const batches = Math.ceil(iterations / requestsPerBatch);

        for (let batch = 0; batch < batches; batch++) {
          const batchResults = [];

          for (let i = 0; i < requestsPerBatch && (batch * requestsPerBatch + i) < iterations; i++) {
            const iterationIndex = batch * requestsPerBatch + i;
            const result = await runSingleRequest(iterationIndex);
            if (result) {
              batchResults.push(result);
              result.success ? successCount++ : errorCount++;
            }
          }

          setResponses((prev) => [...prev, ...batchResults]);

          if (batch < batches - 1) {
            await new Promise((resolve) => setTimeout(resolve, batchDelay));
          }
        }

        setSuccessCount(successCount);
        setErrorCount(errorCount);
      }

      const totalTime = performance.now() - startTime;
      setTotalTime(totalTime);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
    }
  };

  const totalRequests = successCount + errorCount;
  const successRate = totalRequests > 0 ? (successCount / totalRequests) * 100 : 0;
  const avgResponseTime =
    responseTimes.length > 0
      ? responseTimes.reduce((acc, time) => acc + time, 0) / responseTimes.length
      : 0;
  const minResponseTime = responseTimes.length > 0 ? Math.min(...responseTimes) : 0;
  const maxResponseTime = responseTimes.length > 0 ? Math.max(...responseTimes) : 0;

  const successRateChartData = {
    labels: ['Succès', 'Échecs'],
    datasets: [
      {
        data: [successCount, errorCount],
        backgroundColor: ['#4caf50', '#f44336'],
      },
    ],
  };

  const errorRateChartData = {
    labels: ['Erreur réseau', 'Erreur 4xx', 'Erreur 5xx'],
    datasets: [
      {
        data: [networkErrorCount, http4xxErrorCount, http5xxErrorCount],
        backgroundColor: ['#FF9800', '#FF5722', '#D32F2F'],
      },
    ],
  };

  const responseTimeChartData = {
    labels: ['Temps minimum', 'Temps moyen', 'Temps maximum'],
    datasets: [
      {
        data: [minResponseTime, avgResponseTime, maxResponseTime],
        backgroundColor: ['#2196F3', '#FFC107', '#FF5722'],
      },
    ],
  };

  return (
    <div className="container-fluid h-80 d-flex">
      <div className="row flex-column w-50 p-3 bg-light">
        <h2 className="text-center text-primary mb-4">Effectuer une requête API avec itérations</h2>

        <ApiRequestForm
          method={method}
          setMethod={setMethod}
          url={url}
          setUrl={setUrl}
          body={body}
          setBody={setBody}
          iterations={iterations}
          setIterations={setIterations}
          scriptNames={scriptNames}
          setScriptNames={setScriptNames}
          requestsPerBatch={requestsPerBatch}
          setRequestsPerBatch={setRequestsPerBatch}
          batchDelay={batchDelay}
          setBatchDelay={setBatchDelay}
          sendAllAtOnce={sendAllAtOnce}
          setSendAllAtOnce={setSendAllAtOnce}
          onSubmit={processRequest}
        />

        <ResultSummary
          totalRequests={totalRequests}
          successCount={successCount}
          errorCount={errorCount}
          http2xxSuccessCount={http2xxSuccessCount}
          networkErrorCount={networkErrorCount}
          http4xxErrorCount={http4xxErrorCount}
          http5xxErrorCount={http5xxErrorCount}
          avgResponseTime={avgResponseTime}
          minResponseTime={minResponseTime}
          maxResponseTime={maxResponseTime}
          successRate={successRate}
        />

        <IterationResults responses={responses} />
      </div>

      <Charts
        successRateChartData={successRateChartData}
        errorRateChartData={errorRateChartData}
        responseTimeChartData={responseTimeChartData}
      />
    </div>
  );
}

export default ApiRequestService;
