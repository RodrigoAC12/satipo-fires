import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Icono para el marcador de selección actual
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function ClickHandler({ onClick }) {
    useMapEvents({
        click(e) { onClick(e.latlng.lat, e.latlng.lng); },
    });
    return null;
}

export default function MapPanel({ onMapClick, selectedData, history }) {
    const center = [-11.2528, -74.6337];

    // Función para definir el color según el nivel de riesgo
    // Función segura para definir el color
    const getRiskColor = (risk) => {
        // 1. Si no hay dato de riesgo, devolvemos gris para no romper la app
        if (!risk) return '#9e9e9e'; 
        
        // 2. Convertimos a string de forma segura por si llega un número
        const r = String(risk).toLowerCase();
        
        if (r.includes('alto')) return '#d32f2f';   // Rojo
        if (r.includes('medio')) return '#ff9100';  // Naranja
        return '#2e7d32';                           // Verde
    };

    return (
        <MapContainer center={center} zoom={10} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
            />
            
            <ClickHandler onClick={onMapClick} />

            {/* 1. CAPA DE PUNTOS DE CALOR (HISTORIAL) */}
            {history && history.map((report, idx) => {
                // Hacemos un fallback seguro para evitar errores en el Popup
                const nivelRiesgo = report.riesgo || report.risk || report.resultado || 'DESCONOCIDO';

                return (
                    <CircleMarker 
                        key={idx}
                        center={[report.latitude, report.longitude]}
                        pathOptions={{ 
                            color: getRiskColor(nivelRiesgo), 
                            fillColor: getRiskColor(nivelRiesgo),
                            fillOpacity: 0.6 
                        }}
                        radius={8}
                    >
                        <Popup>
                            <div style={{ textAlign: 'center' }}>
                                <strong style={{ color: getRiskColor(nivelRiesgo) }}>
                                    RIESGO {String(nivelRiesgo).toUpperCase()}
                                </strong>
                                <br />
                                <span>📅 {report.fecha ? new Date(report.fecha).toLocaleDateString() : 'Sin fecha'}</span>
                                <br />
                                <span>🔥 Temp: {report.temperature}°C</span>
                            </div>
                        </Popup>
                    </CircleMarker>
                );
            })}

            {/* 2. MARCADOR DE SELECCIÓN ACTUAL */}
            {selectedData && (
                <Marker position={[selectedData.latitude, selectedData.longitude]}>
                    <Popup>
                        <strong>📍 Nueva Evaluación</strong><br/>
                        Lat: {selectedData.latitude.toFixed(4)}<br/>
                        Lon: {selectedData.longitude.toFixed(4)}
                    </Popup>
                </Marker>
            )}
        </MapContainer>
    );
}