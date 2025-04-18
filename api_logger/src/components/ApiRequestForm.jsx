import React from 'react';

function ApiRequestForm({
    method, setMethod,
    url, setUrl,
    body, setBody,
    iterations, setIterations,
    scriptNames, setScriptNames,
    requestsPerBatch, setRequestsPerBatch,
    batchDelay, setBatchDelay,
    sendAllAtOnce, setSendAllAtOnce,
    onSubmit
}) {
    return (
        <form onSubmit={onSubmit} className="bg-white p-4 rounded shadow-sm">
            <div className="form-group">
                <label>Méthode HTTP :</label>
                <select value={method} onChange={(e) => setMethod(e.target.value)} className="form-control">
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                </select>
            </div>

            <div className="form-group">
                <label>URL :</label>
                <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} required className="form-control" placeholder="https://example.com/api" />
            </div>

            {['POST', 'PUT'].includes(method) && (
                <div className="form-group">
                    <label>Corps de la requête (JSON) :</label>
                    <textarea value={body} onChange={(e) => setBody(e.target.value)} className="form-control" rows="4" placeholder='Exemple : {"key": "value"}' />
                </div>
            )}

            <div className="form-group">
                <label>Nombre d'itérations :</label>
                <input type="number" value={iterations} onChange={(e) => setIterations(Math.max(1, parseInt(e.target.value)))} className="form-control" />
            </div>

            <div className="form-group">
                <label>Scripts à charger (séparés par des virgules) :</label>
                <input type="text" value={scriptNames} onChange={(e) => setScriptNames(e.target.value)} className="form-control" placeholder="payload,proofOfWork" />
            </div>

            <div className="form-group">
                <label>Nombre de requêtes par salve :</label>
                <input type="number" value={requestsPerBatch} onChange={(e) => setRequestsPerBatch(Math.max(1, parseInt(e.target.value)))} className="form-control" />
            </div>

            <div className="form-group">
                <label>Délai entre les salves (ms) :</label>
                <input type="number" value={batchDelay} onChange={(e) => setBatchDelay(Math.max(0, parseInt(e.target.value)))} className="form-control" />
            </div>

            <div className="form-group form-check mt-3">
                <input
                    type="checkbox"
                    className="form-check-input"
                    id="sendAllAtOnce"
                    checked={sendAllAtOnce}
                    onChange={(e) => setSendAllAtOnce(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="sendAllAtOnce">
                    Envoyer toutes les requêtes d'un coup
                </label>
            </div>

            <button type="submit" className="btn btn-primary w-100">Envoyer</button>
        </form>
    );
}

export default ApiRequestForm;
