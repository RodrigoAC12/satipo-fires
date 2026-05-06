import React, { useEffect, useState } from 'react';
import RiskForm from './components/RiskForm';
import ResultCard from './components/ResultCard';
import MapPanel from './components/MapPanel';
import HistoryTable from './components/HistoryTable';
import { fetchEnvironmentalData } from './services/apiService';
import { generatePDFReport } from './utils/pdfGenerator';
import './index.css';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '');

function App() {
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [autoFormData, setAutoFormData] = useState(null);
  const [targetMapCenter, setTargetMapCenter] = useState(null);

  const fetchHistory = async () => {
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
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleMapClick = async (lat, lon) => {
    setLoading(true);
    const data = await fetchEnvironmentalData(lat, lon);
    setAutoFormData(data);
    setLoading(false);
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
        throw new Error(`Error ${res.status} evaluando riesgo`);
      }

      const data = await res.json();
      setResult({ ...data, formData });
      await fetchHistory();
    } catch (error) {
      console.error('Error conectando con el servidor', error);
      alert('Error conectando con el servidor');
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
