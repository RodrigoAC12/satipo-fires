import React, { useEffect, useState } from 'react';

const FIELD_NAMES = ['temperature', 'humidity', 'wind', 'slope', 'ndvi', 'latitude', 'longitude'];

const createEmptyForm = () => ({
  temperature: '',
  humidity: '',
  wind: '',
  slope: '',
  ndvi: '',
  latitude: '',
  longitude: '',
});

const sanitizeFormData = (data = {}) => FIELD_NAMES.reduce((acc, key) => {
  acc[key] = data[key] ?? '';
  return acc;
}, createEmptyForm());

export default function RiskForm({ onEvaluate, loading, initialData }) {
  const [formData, setFormData] = useState(createEmptyForm);

  useEffect(() => {
    if (initialData) {
      setFormData(sanitizeFormData(initialData));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const numericData = FIELD_NAMES.reduce((acc, key) => {
      const rawValue = formData[key];
      const normalizedValue = typeof rawValue === 'string' ? rawValue.trim() : rawValue;
      const value = normalizedValue === '' ? NaN : Number(normalizedValue);
      acc[key] = value;
      return acc;
    }, {});

    const hasInvalidValue = FIELD_NAMES.some((key) => !Number.isFinite(numericData[key]));
    if (hasInvalidValue) {
      alert('Todos los campos deben tener numeros validos.');
      return;
    }

    onEvaluate(numericData);
  };

  return (
    <div className="card">
      <h2>Parametros Ambientales (Satipo)</h2>
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
          <label>Temperatura (C)</label>
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
          <label>Pendiente (grados)</label>
          <input type="number" step="0.1" name="slope" value={formData.slope} onChange={handleChange} required />
        </div>

        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label>Indice de Vegetacion (NDVI)</label>
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
