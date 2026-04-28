import React, { useState, useEffect } from 'react';

export default function RiskForm({ onEvaluate, loading, initialData }) {
  const [formData, setFormData] = useState({
    temperature: '', humidity: '', wind: '', slope: '', ndvi: '', latitude: '', longitude: ''
  });

  // Sincronización segura: Solo actualizamos si initialData realmente cambió y es distinto al estado actual
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convertir a número antes de enviar al backend
    const numericData = Object.keys(formData).reduce((acc, key) => {
      acc[key] = parseFloat(formData[key]);
      return acc;
    }, {});
    onEvaluate(numericData);
  };

  return (
    <div className="card">
      <h2>Parámetros Ambientales (Satipo)</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        
        <div className="form-group">
          <label>Latitud</label>
          <input type="number" step="0.000001" name="latitude" value={formData.latitude} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Longitud</label>
          <input type="number" step="0.000001" name="longitude" value={formData.longitude} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Temperatura (°C)</label>
          <input type="number" step="0.1" name="temperature" value={formData.temperature} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Humedad (%)</label>
          <input type="number" step="0.1" name="humidity" value={formData.humidity} onChange={handleChange} required />
        </div>
        
        <div className="form-group">
          <label>Viento (km/h)</label>
          <input type="number" step="0.1" name="wind" value={formData.wind} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Pendiente (°)</label>
          <input type="number" step="0.1" name="slope" value={formData.slope} onChange={handleChange} required />
        </div>

        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label>Índice de Vegetación (NDVI)</label>
          <input type="number" step="0.01" name="ndvi" value={formData.ndvi} onChange={handleChange} required />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Evaluando...' : 'Evaluar Riesgo'}
          </button>
        </div>
      </form>
    </div>
  );
}