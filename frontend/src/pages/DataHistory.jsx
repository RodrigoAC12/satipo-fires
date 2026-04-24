import React, { useState, useEffect } from 'react';
import { obtenerZonas } from '../services/api';

const DataHistory = () => {
  // 1. Estado para almacenar las zonas que vienen de la Base de Datos
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Función para traer los datos del Backend
  useEffect(() => {
    const fetchZonas = async () => {
      try {
        const data = await obtenerZonas();
        setZones(data);
        setLoading(false);
      } catch (error) {
        console.error("Error al traer el historial:", error);
        setLoading(false);
      }
    };

    fetchZonas();
  }, []);

  if (loading) return <p style={{ textAlign: 'center', padding: '20px' }}>Cargando historial...</p>;

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
          {/* 3. Renderizado de datos REALES */}
          {zones.length > 0 ? (
            zones.map((zone) => (
              <tr key={zone.id}>
                {/* Usamos los nombres de campos que vienen de FastAPI */}
                <td>{zone.nombre_sector}</td>
                <td>
                  <span className={`tag ${zone.nivel_riesgo?.toLowerCase()}`}>
                    {zone.nivel_riesgo}
                  </span>
                </td>
                <td>{zone.temperatura}°C</td>
                <td>{zone.humedad}%</td>
                <td>{zone.ndvi}</td>
                <td>{zone.pendiente}°</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>No hay datos registrados aún.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataHistory;
