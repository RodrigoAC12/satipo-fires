import React from 'react';

const Sidebar = ({ activeView, setActiveView }) => {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="logo">🔥</span>
        <div className="logo-text">
          <span className="title">SATIPO-IA</span>
          <span className="subtitle">MONITOREO FORESTAL</span>
        </div>
      </div>

      <nav className="nav-menu">
        <button 
          className={activeView === 'mapa' ? 'active' : ''} 
          onClick={() => setActiveView('mapa')}
        >
          🗺️ <span className="text">Mapa de Riesgo</span>
        </button>
        <button 
          className={activeView === 'historial' ? 'active' : ''} 
          onClick={() => setActiveView('historial')}
        >
          📊 <span className="text">Historial de Datos</span>
        </button>
        <button 
          className={activeView === 'registro' ? 'active' : ''} 
          onClick={() => setActiveView('registro')}
        >
          📝 <span className="text">Registrar Zona</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;