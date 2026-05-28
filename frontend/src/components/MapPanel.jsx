import { useCallback, useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, ZoomControl, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Icono estandar compatible con todos los navegadores.
const bulletproofIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapController({ targetCenter }) {
  const map = useMap();
  useEffect(() => {
    if (targetCenter) {
      map.flyTo(targetCenter, 14, { animate: true, duration: 1.5 });
    }
  }, [targetCenter, map]);
  return null;
}

function MapInteraction({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

const getPositionFromData = (data) => {
  const lat = Number(data?.latitude ?? data?.lat);
  const lng = Number(data?.longitude ?? data?.lng);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  return { lat, lng };
};

const getPositionKey = (position) => (position ? `${position.lat}:${position.lng}` : '');

const normalizeRisk = (risk) => String(risk).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const getRiskColor = (risk) => {
  if (!risk) return '#8a9691';
  const r = normalizeRisk(risk);
  if (r.includes('bajo')) return '#126a4a';
  if (r.includes('medio')) return '#b7791f';
  if (r.includes('alto')) return '#c05621';
  if (r.includes('critico')) return '#b42318';
  return '#2563eb';
};

const MapPanel = ({ history, onMapClick, targetCenter, selectedData }) => {
  const defaultCenter = [-11.2522, -74.6383];
  const selectedPosition = useMemo(() => getPositionFromData(selectedData), [selectedData]);
  const selectedPositionKey = getPositionKey(selectedPosition);
  const [clickState, setClickState] = useState({ selectedKey: '', position: null });

  const instantClickPos = clickState.selectedKey === selectedPositionKey && clickState.position
    ? clickState.position
    : selectedPosition;

  const handleMapSelect = useCallback((position) => {
    setClickState({ selectedKey: selectedPositionKey, position });
    onMapClick?.(position.lat, position.lng);
  }, [onMapClick, selectedPositionKey]);

  return (
    <MapContainer
      center={defaultCenter}
      zoom={10}
      className="leaflet-map"
      zoomControl={false}
      tap
    >
      <ZoomControl position="bottomright" />
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapInteraction onSelect={handleMapSelect} />
      <MapController targetCenter={targetCenter} />

      {instantClickPos && (
        <Marker position={[instantClickPos.lat, instantClickPos.lng]} icon={bulletproofIcon}>
          <Popup>
            <div className="map-popup">
              <h4 className="map-popup-title">Punto seleccionado</h4>
              <p className="map-popup-line"><strong>Lat:</strong> {instantClickPos.lat.toFixed(4)}</p>
              <p className="map-popup-line"><strong>Lon:</strong> {instantClickPos.lng.toFixed(4)}</p>

              {(selectedData?.temperature !== undefined || selectedData?.temp !== undefined) ? (
                <div className="map-popup-data">
                  <p className="map-popup-line"><strong>{selectedData.temperature ?? selectedData.temp} C</strong></p>
                  <p className="map-popup-line">Humedad: {selectedData.humidity ?? selectedData.humedad ?? '-'}%</p>
                </div>
              ) : (
                <p className="map-popup-line">Obteniendo datos...</p>
              )}
            </div>
          </Popup>
        </Marker>
      )}

      {history && history.map((item, index) => (
        <CircleMarker
          key={item.id || index}
          center={[item.latitude, item.longitude]}
          pathOptions={{
            color: getRiskColor(item.risk_level || item.riesgo),
            fillColor: getRiskColor(item.risk_level || item.riesgo),
            fillOpacity: 0.66,
          }}
          radius={8}
        >
          <Popup>
            <div className="map-popup">
              <h4 className="map-popup-title" style={{ color: getRiskColor(item.risk_level || item.riesgo) }}>
                {(item.risk_level || item.riesgo || 'N/A').toUpperCase()}
              </h4>
              <p className="map-popup-line">
                {new Date(item.created_at || item.fecha).toLocaleString('es-PE')}
              </p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

export default MapPanel;
