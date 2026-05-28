import GaugeComponent from 'react-gauge-component';
import { Bell, Download, ShieldAlert } from 'lucide-react';

const normalizeRisk = (risk) => String(risk).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

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
  if (!level) return '#475467';
  const r = normalizeRisk(level);
  if (r.includes('bajo')) return '#126a4a';
  if (r.includes('medio')) return '#b7791f';
  if (r.includes('alto')) return '#c05621';
  if (r.includes('critico')) return '#b42318';
  return '#475467';
};

export default function ResultCard({ result, onDownloadPDF }) {
  if (!result) {
    return (
      <div className="card result-empty">
        <div>
          <span className="empty-icon" aria-hidden="true">
            <ShieldAlert size={22} />
          </span>
          <h2 className="card-title">Veredicto y accion</h2>
          <p className="card-kicker">Esperando evaluacion.</p>
        </div>
      </div>
    );
  }

  const risk = result.riesgo || result.risk_level || 'Desconocido';
  const rawProb = result.probabilidad ?? result.probability ?? 0;
  const numericProb = Number(rawProb);
  const probPercent = Number.isFinite(numericProb) ? numericProb.toFixed(1) : '0.0';
  const riskColor = getRiskColor(risk);

  return (
    <div className="card result-card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Veredicto y accion</h2>
          <p className="card-kicker">Resultado del modelo de riesgo</p>
        </div>
      </div>

      <div className="gauge-wrap">
        <GaugeComponent
          arc={{
            nbSubArcs: 4,
            colorArray: ['#126a4a', '#b7791f', '#c05621', '#b42318'],
            width: 0.2,
            padding: 0.02,
          }}
          labels={{
            valueLabel: {
              formatTextValue: () => `${probPercent}%`,
              style: { fill: '#17201c', textShadow: 'none', fontSize: '30px' },
            },
            tickLabels: { hideMinMax: true },
          }}
          value={getGaugeValue(risk)}
        />
      </div>

      <div className="risk-summary">
        <div>
          <p className="risk-label">Nivel de riesgo</p>
          <p className="risk-value" style={{ color: riskColor }}>{risk}</p>
        </div>
        <div className="risk-probability">{probPercent}%</div>
      </div>

      <div className="result-actions">
        <button type="button" onClick={onDownloadPDF} className="btn btn-secondary">
          <Download size={17} />
          Generar reporte PDF
        </button>
        <button
          type="button"
          onClick={() => alert(`Alerta de nivel ${risk.toUpperCase()} enviada con exito a Defensa Civil y Bomberos de Satipo.`)}
          className="btn btn-danger"
        >
          <Bell size={17} />
          Emitir alerta institucional
        </button>
      </div>
    </div>
  );
}
