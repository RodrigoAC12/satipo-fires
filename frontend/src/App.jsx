import { useCallback, useEffect, useMemo, useState } from 'react';
import { Activity, MapPinned, ShieldCheck } from 'lucide-react';
import RiskForm from './components/RiskForm';
import ResultCard from './components/ResultCard';
import MapPanel from './components/MapPanel';
import HistoryTable from './components/HistoryTable';
import { fetchEnvironmentalData } from './services/apiService';
import { generatePDFReport } from './utils/pdfGenerator';
import './index.css';

const DEFAULT_API_BASE_URL = import.meta.env.PROD
  ? 'https://satipo-fires.onrender.com'
  : 'http://localhost:8000';
const API_BASE_URL = (import.meta.env.VITE_API_URL || DEFAULT_API_BASE_URL).replace(/\/+$/, '');

function App() {
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [autoFormData, setAutoFormData] = useState(null);
  const [targetMapCenter, setTargetMapCenter] = useState(null);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/history`);
      if (!res.ok) {
        throw new Error(`Error ${res.status} cargando historial`);
      }

      const data = await res.json();
      setHistory(data);
    } catch (error) {
      console.error('Error cargando historial', error);
    }
  }, []);

  useEffect(() => {
    // Initial history load comes from the backend; state updates happen after the request resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchHistory();
  }, [fetchHistory]);

  const handleMapClick = async (lat, lon) => {
    setLoading(true);
    try {
      const data = await fetchEnvironmentalData(lat, lon);
      setAutoFormData(data);
    } catch (error) {
      console.error('Error obteniendo datos ambientales', error);
      alert('No se pudieron obtener datos ambientales para ese punto');
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async (formData) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        let detail = `Error ${res.status} evaluando riesgo`;
        try {
          const errorData = await res.json();
          detail = errorData.detail || detail;
        } catch {
          // El backend puede devolver una respuesta sin cuerpo JSON.
        }
        throw new Error(Array.isArray(detail) ? 'Hay campos fuera de rango' : detail);
      }

      const data = await res.json();
      setResult({ ...data, formData });
      await fetchHistory();
    } catch (error) {
      console.error('Error conectando con el servidor', error);
      alert(error.message || 'Error conectando con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryRowClick = (item) => {
    setTargetMapCenter([item.latitude, item.longitude]);
    setAutoFormData(item);
  };

  const handleDownloadPDF = (data) => {
    if (!data) return;
    const formattedData = data.formData ? data : { ...data, formData: data };
    generatePDFReport(formattedData);
  };

  const sortedHistory = useMemo(
    () => [...history].sort((a, b) => new Date(b.created_at || b.fecha || 0) - new Date(a.created_at || a.fecha || 0)),
    [history],
  );
  const latestAssessment = sortedHistory[0];
  const latestRisk = latestAssessment?.risk_level || latestAssessment?.riesgo || 'Sin registros';

  return (
    <div className="app-wrapper">
      <nav className="top-nav">
        <div className="app-brand">
          <span className="brand-mark" aria-hidden="true">
            <ShieldCheck size={22} />
          </span>
          <div className="brand-copy">
            <h1>Satipo FireGuard AI</h1>
            <p>Monitoreo operativo de riesgo forestal</p>
          </div>
        </div>
        <div className="nav-metrics" aria-label="Resumen del monitoreo">
          <span className="nav-stat">
            <Activity size={16} />
            {sortedHistory.length} registros
          </span>
          <span className="nav-divider" aria-hidden="true" />
          <span className="nav-stat">
            Ultimo riesgo: <strong>{latestRisk}</strong>
          </span>
        </div>
      </nav>

      <div className="dashboard-main">
        <aside className="sidebar">
          <RiskForm onEvaluate={handleEvaluate} loading={loading} initialData={autoFormData} />
          <ResultCard result={result} onDownloadPDF={() => handleDownloadPDF(result)} />
        </aside>

        <main className="right-panel">
          <section className="panel map-card">
            <div className="panel-header">
              <div>
                <h2 className="panel-title">Mapa operativo</h2>
                <p className="panel-kicker">Selecciona un punto para evaluar riesgo en Satipo</p>
              </div>
              <span className="metric-chip">
                <MapPinned size={15} />
                Riesgo actual: {latestRisk}
              </span>
            </div>
            <div className="map-container-wrapper">
              <MapPanel
                history={sortedHistory}
                onMapClick={handleMapClick}
                targetCenter={targetMapCenter}
                selectedData={autoFormData}
              />
            </div>
          </section>

          <section className="panel history-section">
            <div className="panel-header">
              <div>
                <h2 className="panel-title">Historial de monitoreo</h2>
                <p className="panel-kicker">Registros ordenados del mas reciente al mas antiguo</p>
              </div>
              <div className="history-meta">
                <span className="metric-chip">
                  <Activity size={15} />
                  {sortedHistory.length} evaluaciones
                </span>
              </div>
            </div>
            <HistoryTable
              history={sortedHistory}
              onRowClick={handleHistoryRowClick}
              onDownloadPDF={handleDownloadPDF}
            />
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
