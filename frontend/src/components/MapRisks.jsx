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
    const obtenerPuntosNASA = async () => {
      try {
        // Petición al backend (ajusta la ruta '/puntos-calor' según tu FastAPI)
        const response = await axios.get('http://localhost:8000/puntos-calor');
        setFirePoints(response.data);
      } catch (error) {
        console.error("Error al conectar con la API del Backend:", error);
        // Salvavidas para el PMV: Si el backend falla, mostramos un punto simulado
        setFirePoints([
          { id: 999, lat: -11.26, lon: -74.65, confidence: "Alta", satellite: "VIIRS (Simulado)" }
        ]);
      }
    };

    obtenerPuntosNASA();
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
        
        {/* Renderizado dinámico de los Puntos de la NASA */}
        {firePoints.map((point) => (
          <CircleMarker 
            key={point.id} 
            center={[point.lat, point.lon]} 
            pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.7 }}
            radius={10}
          >
            <Popup>
              <strong>🔥 Fuego detectado</strong><br />
              Satelite: {point.satellite}<br />
              Confianza: {point.confidence}
            </Popup>
          </CircleMarker>
        ))}
        
        {/* Marcador Azul Principal */}
        <Marker position={position}>
          <Popup>Centro de Monitoreo - Satipo</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapRisks;