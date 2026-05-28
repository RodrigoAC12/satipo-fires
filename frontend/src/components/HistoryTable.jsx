import { useMemo } from 'react';
import { CalendarDays, Droplets, FileText, Gauge, MapPin, Mountain, Thermometer, Wind } from 'lucide-react';

const formatPercent = (value) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue.toFixed(1) : '-';
};

const formatNumber = (value, decimals = 1) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue.toFixed(decimals) : '-';
};

const normalizeRisk = (risk) => String(risk).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const getRiskMeta = (risk) => {
  const normalized = normalizeRisk(risk);
  if (normalized.includes('bajo')) return { label: 'Bajo', className: 'risk-bajo' };
  if (normalized.includes('medio')) return { label: 'Medio', className: 'risk-medio' };
  if (normalized.includes('alto')) return { label: 'Alto', className: 'risk-alto' };
  if (normalized.includes('critico')) return { label: 'Critico', className: 'risk-critico' };
  return { label: risk || 'N/A', className: 'risk-neutral' };
};

const formatDateTime = (dateString) => {
  if (!dateString) return { date: '-', time: '-' };
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return { date: '-', time: '-' };
  return {
    date: d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
  };
};

const clampPercent = (value) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return 0;
  return Math.min(100, Math.max(0, numericValue));
};

const HistoryTable = ({ history, onRowClick, onDownloadPDF }) => {
  const sortedHistory = useMemo(
    () => [...(history || [])].sort((a, b) => new Date(b.created_at || b.fecha || 0) - new Date(a.created_at || a.fecha || 0)),
    [history],
  );

  return (
    <div className="table-scroll">
      <table className="history-table">
        <thead>
          <tr>
            <th>Registro</th>
            <th>Riesgo</th>
            <th>Ubicacion</th>
            <th>Ambiente</th>
            <th>Terreno</th>
            <th>Confianza</th>
            <th>Accion</th>
          </tr>
        </thead>
        <tbody>
          {sortedHistory.length > 0 ? (
            sortedHistory.map((item, idx) => {
              const { date, time } = formatDateTime(item.created_at || item.fecha);
              const risk = item.risk_level || item.riesgo || 'N/A';
              const riskMeta = getRiskMeta(risk);
              const probability = item.probability ?? item.probabilidad;
              const probabilityLabel = formatPercent(probability);
              const probabilityWidth = clampPercent(probability);
              const rowId = item.id ? `#${item.id}` : `#${idx + 1}`;

              return (
                <tr
                  key={item.id || `${item.created_at}-${idx}`}
                  onClick={() => onRowClick?.(item)}
                >
                  <td>
                    <span className="cell-main">{rowId}</span>
                    <span className="cell-sub">
                      <CalendarDays size={13} /> {date} - {time}
                    </span>
                  </td>
                  <td>
                    <span className={`risk-badge ${riskMeta.className}`}>{riskMeta.label}</span>
                  </td>
                  <td>
                    <span className="cell-main">
                      <MapPin size={14} /> {formatNumber(item.latitude, 4)}, {formatNumber(item.longitude, 4)}
                    </span>
                    <span className="cell-sub">Coordenadas WGS84</span>
                  </td>
                  <td>
                    <div className="data-stack">
                      <span className="data-row">
                        <Thermometer size={14} /> {formatNumber(item.temperature)} C
                      </span>
                      <span className="data-row">
                        <Droplets size={14} /> {formatNumber(item.humidity)}%
                      </span>
                      <span className="data-row">
                        <Wind size={14} /> {formatNumber(item.wind)} km/h
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="data-stack">
                      <span className="data-row">
                        <Mountain size={14} /> {formatNumber(item.slope)} grados
                      </span>
                      <span className="data-row">
                        <Gauge size={14} /> NDVI {formatNumber(item.ndvi, 2)}
                      </span>
                    </div>
                  </td>
                  <td className="precision-cell">
                    <div className="precision-head">
                      <span className="cell-main">Prediccion ML</span>
                      <span className="precision-value">{probabilityLabel === '-' ? '-' : `${probabilityLabel}%`}</span>
                    </div>
                    <div className="precision-track" aria-hidden="true">
                      <div className="precision-fill" style={{ width: `${probabilityWidth}%` }} />
                    </div>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownloadPDF?.(item);
                      }}
                      title="Generar PDF"
                    >
                      <FileText size={15} />
                      PDF
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="7" className="empty-state">
                No hay registros disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryTable;
