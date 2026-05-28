import { useCallback, useEffect, useState } from 'react';
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

  return (
    <div className="app-wrapper">
      <nav className="top-nav">
        <h1>SATIPO FIREGUARD AI</h1>
        <div style={{ fontSize: '0.9rem' }}>Sistema Operativo - Satipo, Peru</div>
      </nav>

      <div className="dashboard-main">
        <aside className="sidebar">
          <RiskForm onEvaluate={handleEvaluate} loading={loading} initialData={autoFormData} />
          <ResultCard result={result} onDownloadPDF={() => handleDownloadPDF(result)} />
        </aside>

        <main className="right-panel">
          <div className="map-container-wrapper">
            <MapPanel
              history={history}
              onMapClick={handleMapClick}
              targetCenter={targetMapCenter}
              selectedData={autoFormData}
            />
          </div>

          <div className="history-section">
            <h3 style={{ marginTop: 0, color: '#1b5e20', fontSize: '1.1rem' }}>Historial de Monitoreo</h3>
            <HistoryTable
              history={history}
              onRowClick={handleHistoryRowClick}
              onDownloadPDF={handleDownloadPDF}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
