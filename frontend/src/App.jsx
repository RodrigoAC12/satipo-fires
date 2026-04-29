import React, { useState, useEffect } from 'react';
import RiskForm from './components/RiskForm';
import ResultCard from './components/ResultCard';
import MapPanel from './components/MapPanel';
import HistoryTable from './components/HistoryTable';
import { fetchEnvironmentalData } from './services/apiService';
import { generatePDFReport } from './utils/pdfGenerator'; // Importar generador [cite: 27]
import './index.css'; 

function App() {
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [autoFormData, setAutoFormData] = useState(null);
  const [targetMapCenter, setTargetMapCenter] = useState(null);

  // Carga inicial del historial desde Render [cite: 29]
  const fetchHistory = async () => {
    try {
      const res = await fetch('https://satipo-fires.onrender.com/history');
      const data = await res.json();
      setHistory(data);
    } catch (e) {
      console.error("Error cargando historial");
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleMapClick = async (lat, lon) => {
    setLoading(true);
    const data = await fetchEnvironmentalData(lat, lon);
    setAutoFormData(data);
    setLoading(false);
  };

  const handleEvaluate = async (formData) => {
    setLoading(true);
    try {
      const res = await fetch('https://satipo-fires.onrender.com/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResult({ ...data, formData }); 
      fetchHistory();
    } catch (e) { 
      alert("Error conectando con el servidor"); 
    }
    setLoading(false);
  };

  // Punto 4: Vuelo al punto al hacer clic en la tabla [cite: 36]
  const handleHistoryRowClick = (item) => {
    setTargetMapCenter([item.latitude, item.longitude]);
    setAutoFormData(item);
  };

  // Punto 5: Lógica para generar PDF desde el historial o resultado nuevo [cite: 37, 38]
  const handleDownloadPDF = (data) => {
  if (!data) return;
  // Normalizamos el objeto para que el generador siempre reciba la misma estructura [cite: 38]
  const formattedData = data.formData ? data : { ...data, formData: data };
  generatePDFReport(formattedData);
};

  return (
    <div className="app-wrapper">
      <nav className="top-nav">
        <h1>SATIPO FIREGUARD AI 🛰️</h1>
        <div style={{fontSize: '0.9rem'}}>● Sistema Operativo - Satipo, Perú</div>
      </nav>

      <div className="dashboard-main">
        <aside className="sidebar">
          <RiskForm onEvaluate={handleEvaluate} loading={loading} initialData={autoFormData} />
          {/* Descarga desde la tarjeta de resultado actual [cite: 40] */}
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
            <h3 style={{marginTop: 0, color: '#1b5e20', fontSize: '1.1rem'}}>📜 Historial de Monitoreo</h3>
            {/* Conexión de descarga con la tabla [cite: 42] */}
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