import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

// Solución obligatoria para que los íconos de Leaflet no se rompan en Vite
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});

const MapRisks = () => {
  // Coordenadas aproximadas de Satipo, Perú
  const position = [-11.2522, -74.6383];
  
  // Estado para almacenar los puntos que vienen de la API
  const [firePoints, setFirePoints] = useState([]);

  // Llamada a la API al cargar el componente
  useEffect(() => {
    const obtenerPuntos = async () => {
      try {
        // Petición al backend (conectado a tu base de datos y FastAPI)
        const response = await axios.get("http://localhost:8000/zonas/");
        setFirePoints(response.data);
      } catch (error) {
        console.error("Error al conectar con la API del Backend:", error);
        // Salvavidas: Si el backend falla, mostramos un punto simulado con el formato CORRECTO
        setFirePoints([
          { 
            id: 999, 
            nombre_sector: "Sector Simulado (Fallo API)", 
            latitud: -11.26, 
            longitud: -74.65, 
            nivel_riesgo: "Alto",
            temperatura: 35
          }
        ]);
      }
    };

    obtenerPuntos();
  }, []);

  return (
    <div style={{ width: '100%', height: '550px', borderRadius: '12px', overflow: 'hidden' }}>
      <MapContainer 
        center={position} 
        zoom={12} 
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Renderizado dinámico de las Zonas de Riesgo desde tu Base de Datos */}
        {firePoints.map((point, index) => {
          // Validación de seguridad: Solo dibuja el punto si tiene latitud y longitud válidas
          if (point.latitud && point.longitud) {
            return (
              <CircleMarker 
                key={point.id || index} 
                center={[point.latitud, point.longitud]} 
                pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.7 }}
                radius={10}
              >
                <Popup>
                  <strong>🔥 Zona Evaluada</strong><br />
                  <strong>Sector:</strong> {point.nombre_sector || 'Desconocido'}<br />
                  <strong>Riesgo:</strong> {point.nivel_riesgo || 'No calculado'}<br />
                  <strong>Temp:</strong> {point.temperatura}°C
                </Popup>
              </CircleMarker>
            );
          }
          // Si el punto no tiene coordenadas, no hace nada para evitar que se caiga la página
          return null;
        })}
        
        {/* Marcador Azul Principal */}
        <Marker position={position}>
          <Popup>Centro de Monitoreo - Satipo</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapRisks;