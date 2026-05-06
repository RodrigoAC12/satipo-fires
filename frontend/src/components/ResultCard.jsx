import React from 'react';
import GaugeComponent from 'react-gauge-component';

const normalizeRisk = (risk) => String(risk).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function ResultCard({ result, onDownloadPDF }) {
  if (!result) {
    return (
      <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Veredicto y Accion</h2>
        <p>Esperando evaluacion...</p>
      </div>
    );
  }

  const risk = result.riesgo || result.risk_level || 'Desconocido';
  const rawProb = result.probabilidad ?? result.probability ?? 0;
  const numericProb = Number(rawProb);
  const probPercent = Number.isFinite(numericProb) ? numericProb.toFixed(1) : '0.0';

  const getGaugeValue = (level) => {
    if (!level) return 0;
    const r = normalizeRisk(level);
    if (r.includes('bajo')) return 12.5;
    if (r.includes('medio')) return 37.5;
    if (r.includes('alto')) return 62.5;
    if (r.includes('critico')) return 87.5;
    return 0;
  };

  const getRiskColor = (level) => {
    if (!level) return '#333';
    const r = normalizeRisk(level);
    if (r.includes('bajo')) return '#28a745';
    if (r.includes('medio')) return '#ffc107';
    if (r.includes('alto')) return '#fd7e14';
    if (r.includes('critico')) return '#dc3545';
    return '#333';
  };

  return (
    <div className="card" style={{ textAlign: 'center', padding: '20px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ color: '#1b5e20', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Veredicto y Accion</h2>

      <div style={{ width: '80%', margin: '0 auto', paddingBottom: '20px', paddingTop: '10px' }}>
        <GaugeComponent
          arc={{
            nbSubArcs: 4,
            colorArray: ['#28a745', '#ffc107', '#fd7e14', '#dc3545'],
            width: 0.2,
            padding: 0.02,
          }}
          labels={{
            valueLabel: {
              formatTextValue: () => `${probPercent}% Certeza`,
              style: { fill: '#333', textShadow: 'none', fontSize: '30px' },
            },
            tickLabels: { hideMinMax: true },
          }}
          value={getGaugeValue(risk)}
        />
      </div>

      <h1 style={{ color: getRiskColor(risk), margin: '5px 0 25px 0', textTransform: 'uppercase' }}>
        Riesgo: {risk}
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', justifyContent: 'center' }}>
        <button onClick={onDownloadPDF} className="btn" style={{ background: '#6c757d', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}>
          Generar Reporte PDF
        </button>
        <button onClick={() => alert(`Alerta de nivel ${risk.toUpperCase()} enviada con exito a Defensa Civil y Bomberos de Satipo!`)} className="btn" style={{ background: '#dc3545', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}>
          Emitir Alerta Institucional
        </button>
      </div>
    </div>
  );
}
