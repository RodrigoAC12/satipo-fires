import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import KpiCards from './components/KpiCards';
import MapRisks from './components/MapRisks';
import DataHistory from './components/DataHistory';
import RegisterZone from './components/RegisterZone';

const App = () => {
  // Estado para la vista actual: 'mapa', 'historial', 'registro'
  const [activeView, setActiveView] = useState('mapa');

  // Datos simulados para los KPIs
  const kpiData = {
    monitoredZones: 15,
    criticalAlerts: 3,
    modelPrecision: 92.5
  };

  return (
    <div className="app-layout">
      {/* Barra lateral fija y profesional */}
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      {/* Contenido principal flexible */}
      <main className="main-viewport">
        <Header />
        
        <div className="dashboard-content">
          <KpiCards data={kpiData} />
          
          <div className="view-container">
            {activeView === 'mapa' && <MapRisks />}
            {activeView === 'historial' && <DataHistory />}
            {activeView === 'registro' && <RegisterZone />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;