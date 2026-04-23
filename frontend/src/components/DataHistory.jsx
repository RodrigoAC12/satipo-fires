import React from 'react';

const DataHistory = () => {
  // Datos simulados para la tabla
  const zones = [
    { id: 1, sector: "Mazamari Centro", risk: "Alto", temp: 35.5, hum: 20, ndvi: 0.15, slope: 30 },
    { id: 2, sector: "Pampa Hermosa", risk: "Bajo", temp: 25.0, hum: 60, ndvi: 0.65, slope: 10 },
    { id: 3, sector: "Rio Tambo Norte", risk: "Alto", temp: 34.0, hum: 22, ndvi: 0.20, slope: 35 },
    { id: 4, sector: "Satipo Sur", risk: "Bajo", temp: 24.5, hum: 65, ndvi: 0.70, slope: 12 },
  ];

  return (
    <div className="table-wrapper">
      <table className="modern-table">
        <thead>
          <tr>
            <th>Sector</th>
            <th>Nivel de Riesgo</th>
            <th>Temp.</th>
            <th>Hum.</th>
            <th>NDVI</th>
            <th>Pendiente</th>
          </tr>
        </thead>
        <tbody>
          {zones.map((zone) => (
            <tr key={zone.id}>
              <td>{zone.sector}</td>
              <td><span className={`tag ${zone.risk}`}>{zone.risk}</span></td>
              <td>{zone.temp}°C</td>
              <td>{zone.hum}%</td>
              <td>{zone.ndvi}</td>
              <td>{zone.slope}°</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataHistory;