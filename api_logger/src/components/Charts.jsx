import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';

function Charts({
  successRateChartData, errorRateChartData, responseTimeChartData
}) {
  return (
    <div className="col-6 p-3" style={{ maxHeight: '100vh', overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
      <div className="text-center mt-4">
        <h5>Temps de réponse</h5>
        <Bar data={responseTimeChartData} height={200} />
      </div>

      <div className="text-center mt-4">
        <h5>Répartition des erreurs</h5>
        <Pie data={errorRateChartData} height={200} />
      </div>

      <div className="text-center mt-4">
        <h5>Taux de réussite</h5>
        <Pie data={successRateChartData} height={200} />
      </div>
    </div>
  );
}

export default Charts;
