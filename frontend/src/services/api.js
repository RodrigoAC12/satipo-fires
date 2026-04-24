import axios from 'axios';

// Obtener la URL base de la API desde variables de entorno o usar localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

console.log('🌐 API Base URL:', API_BASE_URL);

// Cliente HTTP centralizado
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para manejar errores globales
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Error con respuesta del servidor
      console.error('❌ Error del servidor:', error.response.status, error.response.data);
    } else if (error.request) {
      // Error sin respuesta (conexión rechazada, timeout, etc)
      console.error('❌ Error de conexión:', error.request);
      console.error('📌 ¿Backend corriendo en', API_BASE_URL, '?');
    } else {
      console.error('❌ Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// ============ ZONA RIESGO ENDPOINTS ============

/**
 * Crea una nueva zona de riesgo
 */
export const crearZona = async (zonaData) => {
  try {
    console.log('📤 Enviando zona:', zonaData);
    const response = await apiClient.post('/zonas/', zonaData);
    console.log('✅ Zona creada:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al crear zona:', error.message);
    throw error;
  }
};

/**
 * Obtiene todas las zonas registradas
 */
export const obtenerZonas = async () => {
  try {
    console.log('📥 Obteniendo zonas...');
    const response = await apiClient.get('/zonas/');
    console.log('✅ Zonas obtenidas:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener zonas:', error.message);
    throw error;
  }
};

/**
 * Obtiene estadísticas del dashboard
 */
export const obtenerEstadisticas = async () => {
  try {
    console.log('📊 Obteniendo estadísticas...');
    const response = await apiClient.get('/stats/');
    console.log('✅ Estadísticas obtenidas:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error.message);
    throw error;
  }
};
    console.error('Error al obtener estadísticas:', error);
    throw error;
  }
};

// ============ DATOS EXTERNOS (NASA, Clima) ============

/**
 * Obtiene puntos de calor desde NASA
 */
export const obtenerPuntosNASA = async () => {
  try {
    const response = await apiClient.get('/nasa-hotspots/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener puntos NASA:', error);
    throw error;
  }
};

/**
 * Obtiene clima automático desde OpenWeatherMap
 */
export const obtenerClimaAutomatico = async (latitud, longitud) => {
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || "fa7d867d836ee4e030089e68680a7812";
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitud}&lon=${longitud}&units=metric&appid=${API_KEY}`;
  
  try {
    const response = await axios.get(url);
    return {
      temperatura: response.data.main.temp,
      humedad: response.data.main.humidity
    };
  } catch (error) {
    console.error('Error al obtener clima:', error);
    throw error;
  }
};

export default apiClient;
