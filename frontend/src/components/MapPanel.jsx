import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Icono estándar compatible con todos los navegadores
const bulletproofIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Controlador para mover la cámara suavemente
function MapController({ targetCenter }) {
  const map = useMap();
  useEffect(() => {
    if (targetCenter) {
      map.flyTo(targetCenter, 14, { animate: true, duration: 1.5 });
    }
  }, [targetCenter, map]);
  return null;
}

const MapPanel = ({ history, onMapClick, targetCenter, selectedData }) => {
  const defaultCenter = [-11.2522, -74.6383];
  const [instantClickPos, setInstantClickPos] = useState(null);

  // Sincronizar posición cuando se selecciona una fila del historial
  useEffect(() => {
    if (selectedData && (selectedData.latitude || selectedData.lat)) {
      setInstantClickPos({
        lat: selectedData.latitude ?? selectedData.lat,
        lng: selectedData.longitude ?? selectedData.lng
      });
    }
  }, [selectedData]);

  // Manejador de clics en el mapa
  function MapInteraction() {
    useMapEvents({
      click(e) {
        // En móviles, esto permite poner el marcador con un toque
        setInstantClickPos({ lat: e.latlng.lat, lng: e.latlng.lng });
        if (onMapClick) onMapClick(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  }

  const getRiskColor = (risk) => {
    if (!risk) return '#9e9e9e'; 
    const r = risk.toLowerCase();
    if (r.includes('bajo')) return '#4caf50'; 
    if (r.includes('medio')) return '#ff9800'; 
    if (r.includes('alto') || r.includes('crítico') || r.includes('critico')) return '#f44336'; 
    return '#2196f3'; 
  };

  return (
    <MapContainer 
      center={defaultCenter} 
      zoom={10} 
      style={{ height: '100%', width: '100%', borderRadius: '8px' }}
      tap={true} // Habilita soporte para clics en Safari iOS
    >
      <TileLayer 
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
      />
      
      <MapInteraction />
      <MapController targetCenter={targetCenter} />

      {/* Marcador del punto actual seleccionado */}
      {instantClickPos && (
        <Marker position={[instantClickPos.lat, instantClickPos.lng]} icon={bulletproofIcon}>
          <Popup>
            <div style={{ minWidth: '160px', padding: '5px' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#1b5e20', borderBottom: '1px solid #eee' }}>📍 Punto Seleccionado</h4>
              <p style={{ margin: '4px 0' }}><strong>Lat:</strong> {instantClickPos.lat.toFixed(4)}</p>
              <p style={{ margin: '4px 0' }}><strong>Lon:</strong> {instantClickPos.lng.toFixed(4)}</p>
              
              {(selectedData?.temperature !== undefined || selectedData?.temp !== undefined) ? (
                <div style={{ marginTop: '8px', background: '#f9f9f9', padding: '8px', borderRadius: '4px' }}>
                  <p style={{ margin: '0', fontSize: '1.1rem', textAlign: 'center' }}>
                    🌡️ <strong>{selectedData.temperature ?? selectedData.temp}°C</strong>
                  </p>
                  <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '0.85rem', textAlign: 'center' }}>
                    💧 Humedad: {selectedData.humidity ?? selectedData.humedad ?? '-'}%
                  </p>
                </div>
              ) : (
                <p style={{ margin: '8px 0 0 0', color: '#e65100', fontSize: '0.9rem', textAlign: 'center' }}>⏳ Obteniendo clima...</p>
              )}
            </div>
          </Popup>
        </Marker>
      )}

      {/* Círculos del historial de alertas */}
      {history && history.map((item, index) => (
        <CircleMarker
          key={item.id || index}
          center={[item.latitude, item.longitude]}
          pathOptions={{
            color: getRiskColor(item.risk_level || item.riesgo),
            fillColor: getRiskColor(item.risk_level || item.riesgo),
            fillOpacity: 0.6
          }}
          radius={8}
        >
          <Popup>
            <div style={{ textAlign: 'center', padding: '5px' }}>
              <h4 style={{ margin: '0', color: getRiskColor(item.risk_level || item.riesgo) }}>
                {(item.risk_level || item.riesgo || 'N/A').toUpperCase()}
              </h4>
              <p style={{ fontSize: '0.75rem', margin: '8px 0 0 0', color: '#666' }}>
                📅 {new Date(item.created_at || item.fecha).toLocaleString('es-PE')}
              </p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

export default MapPanel;