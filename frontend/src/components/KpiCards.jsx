import React from 'react';

const KpiCards = ({ data }) => {
  return (
    <div className="kpi-cards">
      <div className="kpi-card">
        <span className="label">Zonas Monitoreadas</span>
        <span className="value">{data.monitoredZones}</span>
      </div>
      <div className="kpi-card">
        <span className="label">Alertas Críticas / Altas</span>
        <span className="value">{data.criticalAlerts}</span>
      </div>
      <div className="kpi-card precision">
        <span className="label">Precisión de la IA</span>
        <span className="value">{data.modelPrecision}%</span>
      </div>
    </div>
  );
};

export default KpiCards;