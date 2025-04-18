import React from 'react';

function IterationResults({ responses }) {
  return (
    <div className="mt-5" style={{ maxHeight: '30vh', overflowY: 'auto' }}>
      <h4 className="text-center text-success">Résultats des itérations</h4>
      <table className="table table-bordered table-striped mt-3">
        <thead>
          <tr>
            <th>Itération</th>
            <th>Réponse</th>
            <th>Erreur</th>
            <th>Temps (ms)</th>
            <th>Code</th>
          </tr>
        </thead>
        <tbody>
          {responses.map((res, i) => (
            <tr key={i}>
              <td>{res.iteration}</td>
              <td><pre className="bg-light p-2 rounded">{JSON.stringify(res.data, null, 2)}</pre></td>
              <td>{res.error || 'Aucune'}</td>
              <td>{res.time}</td>
              <td>{res.statusCode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default IterationResults;
