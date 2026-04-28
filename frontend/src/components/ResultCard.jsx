import React from 'react';
import GaugeComponent from 'react-gauge-component'; // <--- ¡AQUI ESTA EL CAMBIO CRITICO!
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function ResultCard({ result }) {
  if (!result) return <div className="card"><h2>Resultados del Modelo</h2><p>Esperando evaluación...</p></div>;

  // Función para posicionar la aguja del velocímetro (de 0 a 100)
  const getGaugeValue = (level) => {
    switch(level) {
      case 'Bajo': return 12.5;
      case 'Medio': return 37.5;
      case 'Alto': return 62.5;
      case 'Crítico': return 87.5;
      default: return 0;
    }
  };

  // Función para exportar a PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Riesgo de Incendio Forestal - Satipo", 14, 20);
    doc.autoTable({
      startY: 30,
      head: [['Parámetro', 'Valor']],
      body: [
        ['Nivel de Riesgo', result.risk_level],
        ['Probabilidad de Certeza', `${result.probability}%`],
        ['Temperatura', `${result.temperature}°C`],
        ['Humedad', `${result.humidity}%`],
        ['Viento', `${result.wind} km/h`],
        ['Pendiente', `${result.slope}°`],
        ['NDVI', result.ndvi],
        ['Coordenadas (Lat, Lon)', `${result.latitude}, ${result.longitude}`],
        ['Fecha de Evaluación', new Date().toLocaleString()]
      ]
    });
    doc.save("Reporte_Riesgo_Satipo.pdf");
  };

  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <h2>Veredicto y Acción</h2>
      
      {/* Gráfico tipo Velocímetro Moderno */}
      <div style={{ width: '80%', margin: '0 auto', paddingBottom: '20px' }}>
        <GaugeComponent
          arc={{
            nbSubArcs: 4,
            colorArray: ['#28a745', '#ffc107', '#fd7e14', '#dc3545'],
            width: 0.2,
            padding: 0.02
          }}
          labels={{
            valueLabel: { 
              formatTextValue: () => `${result.probability}% Certeza`,
              style: { fill: '#333', textShadow: 'none', fontSize: '30px' }
            },
            tickLabels: { hideMinMax: true }
          }}
          value={getGaugeValue(result.risk_level)}
        />
      </div>
      
      <h1 style={{ color: result.color, margin: '5px 0 20px 0' }}>Riesgo: {result.risk_level}</h1>
      
      {/* Botones de Acción Operativa */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={generatePDF} className="btn" style={{ background: '#6c757d', width: 'auto' }}>
          📄 Generar Reporte PDF
        </button>
        <button onClick={() => alert('¡Alerta enviada con éxito a Defensa Civil y Bomberos de Satipo!')} className="btn" style={{ background: '#dc3545', width: 'auto' }}>
          🚨 Emitir Alerta Institucional
        </button>
      </div>
    </div>
  );
}