import React, { useState } from 'react';
import { crearZona, obtenerClimaAutomatico } from '../services/api';

const RegisterZone = () => {
  // CORRECCIÓN: Cambiamos 'nombre' por 'nombre_sector' para que coincida con FastAPI
  const [formData, setFormData] = useState({
    nombre_sector: '', 
    latitud: '-11.325',
    longitud: '-74.531',
    temperatura: '',
    humedad: '',
    ndvi: '',
    pendiente: ''
  });

  const [loading, setLoading] = useState(false);

  // Manejador genérico para actualizar el estado al escribir
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Función para obtener clima automático
  const handleObtenerClima = async () => {
    if (!formData.latitud || !formData.longitud) {
      alert("Por favor, ingresa primero la latitud y longitud.");
      return;
    }

    setLoading(true);
    try {
      const clima = await obtenerClimaAutomatico(formData.latitud, formData.longitud);
      setFormData(prev => ({
        ...prev,
        temperatura: clima.temperatura,
        humedad: clima.humedad
      }));
      alert("✅ Clima obtenido vía API exitosamente");
    } catch (error) {
      console.error("Error al obtener el clima:", error);
      alert("Error de conexión. Verifica tu API KEY o ingresa los datos manualmente.");
    } finally {
      setLoading(false);
    }
  };

  // Manejador del envío final al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await crearZona(formData);
      alert("Zona registrada y analizada correctamente.");
      // CORRECCIÓN: Limpiar formulario usando 'nombre_sector'
      setFormData({ nombre_sector: '', latitud: '', longitud: '', temperatura: '', humedad: '', ndvi: '', pendiente: '' });
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al guardar la zona.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-wrapper">
      <h2 className="view-title">Registrar Nueva Zona</h2>
      <p className="view-subtitle">Los datos ingresados serán evaluados en tiempo real por el modelo Random Forest.</p>
      
      <form className="modern-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Nombre del Sector</label>
          {/* CORRECCIÓN: name="nombre_sector" y value={formData.nombre_sector} */}
          <input type="text" name="nombre_sector" value={formData.nombre_sector} onChange={handleChange} placeholder="Ej. Mazamari Sur" required />
        </div>
        
        <div className="form-row">
          <label>Latitud</label>
          <input type="text" name="latitud" value={formData.latitud} onChange={handleChange} required />
        </div>
        
        <div className="form-row">
          <label>Longitud</label>
          <input type="text" name="longitud" value={formData.longitud} onChange={handleChange} required />
        </div>

        {/* Botón para llamar a la API del Clima */}
        <div className="form-row" style={{ justifyContent: 'flex-end', marginTop: '-10px', marginBottom: '10px' }}>
          <button 
            type="button" 
            onClick={handleObtenerClima}
            disabled={loading}
            style={{ padding: '8px 12px', background: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', color: '#1e293b', fontWeight: 'bold' }}
          >
            ☁️ Obtener Clima Automático
          </button>
        </div>
        
        <div className="form-row">
          <label>Temperatura (°C)</label>
          <input type="number" step="0.1" name="temperatura" value={formData.temperatura} onChange={handleChange} placeholder="Ej. 35.5" required />
        </div>
        
        <div className="form-row">
          <label>Humedad (%)</label>
          <input type="number" step="0.1" name="humedad" value={formData.humedad} onChange={handleChange} placeholder="Ej. 20.0" required />
        </div>
        
        <div className="form-row">
          <label>NDVI (0 a 1)</label>
          <input type="number" step="0.01" name="ndvi" value={formData.ndvi} onChange={handleChange} placeholder="Ej. 0.15" required />
        </div>
        
        <div className="form-row">
          <label>Pendiente (° Inclinación)</label>
          <input type="number" step="0.1" name="pendiente" value={formData.pendiente} onChange={handleChange} placeholder="Ej. 30.0" required />
        </div>
        
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Procesando...' : 'Analizar Riesgo y Guardar'}
        </button>
      </form>
    </div>
  );
};

export default RegisterZone;
