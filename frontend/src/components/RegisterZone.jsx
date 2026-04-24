import React, { useState } from 'react';
import axios from 'axios';
import { crearZona } from '../services/api';

const RegisterZone = () => {
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
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  // Manejador genérico para actualizar el estado al escribir
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Función para consumir la API de OpenWeatherMap
  const obtenerClimaAutomatico = async () => {
    if (!formData.latitud || !formData.longitud) {
      setMensaje({ tipo: 'error', texto: 'Por favor, ingresa primero la latitud y longitud.' });
      return;
    }

    // API Key de OpenWeatherMap
    const API_KEY = "fa7d867d836ee4e030089e68680a7812"; 
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${formData.latitud}&lon=${formData.longitud}&units=metric&appid=${API_KEY}`;
    
    try {
      setLoading(true);
      const respuesta = await axios.get(url);
      setFormData(prev => ({
        ...prev,
        temperatura: respuesta.data.main.temp,
        humedad: respuesta.data.main.humidity
      }));
      setMensaje({ tipo: 'exito', texto: '✅ Clima obtenido automáticamente' });
      setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);
    } catch (error) {
      console.error("Error al obtener el clima:", error);
      setMensaje({ tipo: 'error', texto: '❌ Error al obtener clima. Ingresa manualmente.' });
    } finally {
      setLoading(false);
    }
  };

  // Manejador del envío final al backend - USANDO SERVICIO CENTRALIZADO
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setMensaje({ tipo: '', texto: '' });
      
      console.log('📤 Enviando datos:', formData);
      
      // Validar que todos los campos numéricos sean válidos
      if (!formData.nombre_sector) {
        setMensaje({ tipo: 'error', texto: 'El nombre del sector es obligatorio' });
        setLoading(false);
        return;
      }

      const temperaturaNum = parseFloat(formData.temperatura);
      const humedadNum = parseFloat(formData.humedad);
      const ndviNum = parseFloat(formData.ndvi);
      const pendienteNum = parseFloat(formData.pendiente);

      if (isNaN(temperaturaNum) || isNaN(humedadNum) || isNaN(ndviNum) || isNaN(pendienteNum)) {
        setMensaje({ tipo: 'error', texto: 'Todos los campos numéricos son obligatorios' });
        setLoading(false);
        return;
      }

      // Usar el servicio centralizado
      await crearZona(formData);
      
      setMensaje({ tipo: 'exito', texto: '✅ Zona registrada y analizada correctamente' });
      
      // Limpiar formulario
      setFormData({ 
        nombre_sector: '', 
        latitud: '-11.325', 
        longitud: '-74.531', 
        temperatura: '', 
        humedad: '', 
        ndvi: '', 
        pendiente: '' 
      });
      
      setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);
      
    } catch (error) {
      console.error("❌ Error completo:", error);
      
      // Mostrar error detallado
      let mensajeError = 'Error al guardar la zona';
      
      if (error.response?.status === 500) {
        mensajeError = `❌ Error en el servidor: ${error.response.data?.detail || 'Error desconocido'}`;
      } else if (error.response?.status === 422) {
        mensajeError = `❌ Datos inválidos: ${error.response.data?.detail?.[0]?.msg || 'Revisa los campos'}`;
      } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        mensajeError = '❌ Error de conexión: ¿Backend corre en localhost:8000?';
      } else if (error.message?.includes('timeout')) {
        mensajeError = '❌ Timeout: Backend tardó demasiado en responder';
      } else {
        mensajeError = `❌ ${error.message || 'Error desconocido'}`;
      }
      
      setMensaje({ tipo: 'error', texto: mensajeError });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-wrapper">
      <h2 className="view-title">Registrar Nueva Zona</h2>
      <p className="view-subtitle">Los datos ingresados serán evaluados en tiempo real por el modelo Random Forest.</p>
      
      {/* Mostrar mensajes */}
      {mensaje.texto && (
        <div style={{
          padding: '12px',
          marginBottom: '15px',
          borderRadius: '6px',
          backgroundColor: mensaje.tipo === 'error' ? '#fee2e2' : '#dcfce7',
          color: mensaje.tipo === 'error' ? '#991b1b' : '#15803d',
          border: `1px solid ${mensaje.tipo === 'error' ? '#fca5a5' : '#86efac'}`,
          fontSize: '0.9rem'
        }}>
          {mensaje.texto}
        </div>
      )}
      
      <form className="modern-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Nombre del Sector</label>
          <input 
            type="text" 
            name="nombre_sector" 
            value={formData.nombre_sector} 
            onChange={handleChange} 
            placeholder="Ej. Mazamari Sur" 
            required 
            disabled={loading}
          />
        </div>
        
        <div className="form-row">
          <label>Latitud</label>
          <input 
            type="text" 
            name="latitud" 
            value={formData.latitud} 
            onChange={handleChange} 
            required 
            disabled={loading}
          />
        </div>
        
        <div className="form-row">
          <label>Longitud</label>
          <input 
            type="text" 
            name="longitud" 
            value={formData.longitud} 
            onChange={handleChange} 
            required 
            disabled={loading}
          />
        </div>

        {/* Botón para llamar a la API del Clima */}
        <div className="form-row" style={{ justifyContent: 'flex-end', marginTop: '-10px', marginBottom: '10px' }}>
          <button 
            type="button" 
            onClick={obtenerClimaAutomatico}
            disabled={loading}
            style={{ 
              padding: '8px 12px', 
              background: loading ? '#ccc' : '#e2e8f0', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              fontSize: '0.85rem', 
              color: '#1e293b', 
              fontWeight: 'bold',
              opacity: loading ? 0.6 : 1
            }}
          >
            ☁️ {loading ? 'Obteniendo...' : 'Obtener Clima Automático'}
          </button>
        </div>
        
        <div className="form-row">
          <label>Temperatura (°C)</label>
          <input 
            type="number" 
            step="0.1" 
            name="temperatura" 
            value={formData.temperatura} 
            onChange={handleChange} 
            placeholder="Ej. 35.5" 
            required 
            disabled={loading}
          />
        </div>
        
        <div className="form-row">
          <label>Humedad (%)</label>
          <input 
            type="number" 
            step="0.1" 
            name="humedad" 
            value={formData.humedad} 
            onChange={handleChange} 
            placeholder="Ej. 20.0" 
            required 
            disabled={loading}
          />
        </div>
        
        <div className="form-row">
          <label>NDVI (0 a 1)</label>
          <input 
            type="number" 
            step="0.01" 
            name="ndvi" 
            value={formData.ndvi} 
            onChange={handleChange} 
            placeholder="Ej. 0.15" 
            required 
            disabled={loading}
          />
        </div>
        
        <div className="form-row">
          <label>Pendiente (° Inclinación)</label>
          <input 
            type="number" 
            step="0.1" 
            name="pendiente" 
            value={formData.pendiente} 
            onChange={handleChange} 
            placeholder="Ej. 30.0" 
            required 
            disabled={loading}
          />
        </div>
        
        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading}
          style={{
            opacity: loading ? 0.6 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '⏳ Analizando...' : 'Analizar Riesgo y Guardar'}
        </button>
      </form>
    </div>
  );
};

export default RegisterZone;
        
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
        
        <button type="submit" className="submit-btn">Analizar Riesgo y Guardar</button>
      </form>
    </div>
  );
};

export default RegisterZone;