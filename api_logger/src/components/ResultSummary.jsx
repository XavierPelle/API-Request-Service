import React from 'react';

function ResultSummary({
  totalRequests, successCount, errorCount, 
  http2xxSuccessCount, networkErrorCount, 
  http4xxErrorCount, http5xxErrorCount, 
  avgResponseTime, minResponseTime, maxResponseTime, 
  successRate
}) {
  return (
    <div className="mt-5">
      <h4 className="text-center text-success">Résumé des résultats</h4>
      <table className="table table-bordered table-striped mt-3">
        <thead>
          <tr>
            <th>Nombre total</th>
            <th>Succès 2xx</th>
            <th>Réseau</th>
            <th>HTTP 4xx</th>
            <th>HTTP 5xx</th>
            <th>Moyenne (ms)</th>
            <th>Min (ms)</th>
            <th>Max (ms)</th>
            <th>Taux (%)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{totalRequests}</td>
            <td>{http2xxSuccessCount}</td>
            <td>{networkErrorCount}</td>
            <td>{http4xxErrorCount}</td>
            <td>{http5xxErrorCount}</td>
            <td>{avgResponseTime.toFixed(2)}</td>
            <td>{minResponseTime}</td>
            <td>{maxResponseTime}</td>
            <td>{successRate.toFixed(2)}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ResultSummary;
