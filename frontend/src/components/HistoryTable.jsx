import React from 'react';

export default function HistoryTable({ history }) {
  return (
    <div className="card full-width">
      <h2>Historial de Evaluaciones</h2>
      <div style={{ overflowX: 'auto' }}>
        <table className="history-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Temp</th>
              <th>Hum</th>
              <th>Viento</th>
              <th>Pendiente</th>
              <th>NDVI</th>
              <th>Lat / Lon</th>
              <th>Riesgo</th>
              <th>Certeza</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{new Date(item.created_at).toLocaleString()}</td>
                <td>{item.temperature}°C</td>
                <td>{item.humidity}%</td>
                <td>{item.wind} km/h</td>
                <td>{item.slope}°</td>
                <td>{item.ndvi}</td>
                <td>{item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}</td>
                <td>
                  <span className="badge" style={{ backgroundColor: item.color }}>
                    {item.risk_level}
                  </span>
                </td>
                <td>{item.probability}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}