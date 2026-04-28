import React, { useState, useEffect } from 'react';
import RiskForm from './components/RiskForm';
import ResultCard from './components/ResultCard';
import MapPanel from './components/MapPanel';
import HistoryTable from './components/HistoryTable';
import { fetchEnvironmentalData } from './services/apiService';
import './index.css'; // Aseguramos que cargue los estilos

function App() {
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [autoFormData, setAutoFormData] = useState(null);

  const fetchHistory = async () => {
    try {
      // 🚀 CAMBIO A URL DE RENDER
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
      // 🚀 CAMBIO A URL DE RENDER
      const res = await fetch('https://satipo-fires.onrender.com/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResult(data);
      fetchHistory();
    } catch (e) { 
      alert("Error conectando con el servidor"); 
    }
    setLoading(false);
  };

  return (
    <div className="app-wrapper">
      <nav className="top-nav">
        <h1>SATIPO FIREGUARD AI 🛰️</h1>
        <div style={{fontSize: '0.9rem'}}>● Sistema Operativo - Satipo, Perú</div>
      </nav>

      <div className="dashboard-main">
        {/* LADO IZQUIERDO: Panel de Control (420px fijos) */}
        <aside className="sidebar">
          <RiskForm onEvaluate={handleEvaluate} loading={loading} initialData={autoFormData} />
          <ResultCard result={result} />
        </aside>

        {/* LADO DERECHO: Mapa arriba, Tabla abajo */}
        <main className="right-panel">
          <div className="map-container-wrapper">
            <MapPanel 
                history={history} 
                onMapClick={handleMapClick} 
                selectedData={autoFormData} 
            />
          </div>
          
          <div className="history-section">
            <h3 style={{marginTop: 0, color: '#1b5e20', fontSize: '1.1rem'}}>📜 Historial de Monitoreo</h3>
            <HistoryTable history={history} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;