import axios from 'axios';

// Obtener la URL base de la API desde variables de entorno
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Cliente HTTP centralizado
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// ============ ZONA RIESGO ENDPOINTS ============

/**
 * Crea una nueva zona de riesgo
 */
export const crearZona = async (zonaData) => {
  try {
    const response = await apiClient.post('/zonas/', zonaData);
    return response.data;
  } catch (error) {
    console.error('Error al crear zona:', error);
    throw error;
  }
};

/**
 * Obtiene todas las zonas registradas
 */
export const obtenerZonas = async () => {
  try {
    const response = await apiClient.get('/zonas/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener zonas:', error);
    throw error;
  }
};

/**
 * Obtiene estadísticas del dashboard
 */
export const obtenerEstadisticas = async () => {
  try {
    const response = await apiClient.get('/stats/');
    return response.data;
  } catch (error) {
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
