import React from 'react';
import GaugeComponent from 'react-gauge-component';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // <-- CAMBIO 1: Importación moderna

export default function ResultCard({ result }) {
  if (!result) return <div className="card" style={{ padding: '20px', textAlign: 'center' }}><h2>Veredicto y Acción</h2><p>Esperando evaluación...</p></div>;

  const risk = result.riesgo || result.risk_level || 'Desconocido';
  const rawProb = result.probabilidad || result.probability || 0;
  const probPercent = rawProb < 1 ? (rawProb * 100).toFixed(1) : parseFloat(rawProb).toFixed(1);
  const formData = result.formData || {};

  const getGaugeValue = (level) => {
    if (!level) return 0;
    const r = level.toLowerCase();
    if (r.includes('bajo')) return 12.5;
    if (r.includes('medio')) return 37.5;
    if (r.includes('alto')) return 62.5;
    if (r.includes('crítico') || r.includes('critico')) return 87.5;
    return 0;
  };

  const getRiskColor = (level) => {
    if (!level) return '#333';
    const r = level.toLowerCase();
    if (r.includes('bajo')) return '#28a745';
    if (r.includes('medio')) return '#ffc107';
    if (r.includes('alto')) return '#fd7e14';
    if (r.includes('crítico') || r.includes('critico')) return '#dc3545';
    return '#333';
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const now = new Date();

    // Cabecera Oficial
    doc.setFontSize(20);
    doc.setTextColor(180, 0, 0);
    doc.text("ALERTA DE RIESGO DE INCENDIO", 105, 20, null, null, "center");
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text("SISTEMA DE MONITOREO SATIPO FIREGUARD AI", 105, 28, null, null, "center");
    doc.setLineWidth(0.5);
    doc.line(20, 32, 190, 32);

    // Fecha y Ubicación
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Fecha de emisión: ${now.toLocaleDateString('es-PE')}`, 20, 40);
    doc.text(`Hora de emisión: ${now.toLocaleTimeString('es-PE')}`, 140, 40);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("1. DATOS DE GEOLOCALIZACIÓN", 20, 55);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Latitud:  ${formData.latitude || 'N/A'}`, 25, 63);
    doc.text(`Longitud: ${formData.longitude || 'N/A'}`, 100, 63);

    // Tabla de Variables Ambientales
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("2. CONDICIONES AMBIENTALES REGISTRADAS", 20, 78);
    
    // <-- CAMBIO 2: Pasamos 'doc' como primer parámetro
    autoTable(doc, {
      startY: 83,
      head: [['Variable Ambiental', 'Valor']],
      body: [
        ['Temperatura', `${formData.temperature || 'N/A'} °C`],
        ['Humedad Relativa', `${formData.humidity || 'N/A'} %`],
        ['Velocidad del Viento', `${formData.wind || 'N/A'} km/h`],
        ['Pendiente del Terreno', `${formData.slope || 'N/A'} °`],
        ['Índice NDVI (Vegetación)', `${formData.ndvi || 'N/A'}`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [27, 94, 32], halign: 'center' },
      columnStyles: { 1: { halign: 'center', fontStyle: 'bold' } }
    });

    // Resultado final en el PDF
    // En la nueva versión, la posición final Y se lee así:
    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 150;
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("3. RESULTADO DEL MODELO PREDICTIVO", 20, finalY);
    
    let color = getRiskColor(risk);
    doc.setFontSize(16);
    doc.setTextColor(color);
    doc.text(`NIVEL DE RIESGO: ${risk.toUpperCase()}`, 25, finalY + 12);
    doc.setTextColor(0,0,0);
    doc.text(`Probabilidad de Certeza: ${probPercent}%`, 25, finalY + 22);
    
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.text("Documento generado automáticamente por IA. Debe ser validado por personal de campo.", 105, 280, null, null, "center");
    
    doc.save(`Alerta_Satipo_${now.getTime()}.pdf`);
  };

  return (
    <div className="card" style={{ textAlign: 'center', padding: '20px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ color: '#1b5e20', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Veredicto y Acción</h2>
      
      <div style={{ width: '80%', margin: '0 auto', paddingBottom: '20px', paddingTop: '10px' }}>
        <GaugeComponent
          arc={{
            nbSubArcs: 4,
            colorArray: ['#28a745', '#ffc107', '#fd7e14', '#dc3545'],
            width: 0.2,
            padding: 0.02
          }}
          labels={{
            valueLabel: { 
              formatTextValue: () => `${probPercent}% Certeza`,
              style: { fill: '#333', textShadow: 'none', fontSize: '30px' }
            },
            tickLabels: { hideMinMax: true }
          }}
          value={getGaugeValue(risk)}
        />
      </div>
      
      <h1 style={{ color: getRiskColor(risk), margin: '5px 0 25px 0', textTransform: 'uppercase' }}>
        Riesgo: {risk}
      </h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', justifyContent: 'center' }}>
        <button onClick={generatePDF} className="btn" style={{ background: '#6c757d', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}>
          📄 Generar Reporte PDF
        </button>
        <button onClick={() => alert(`¡Alerta de nivel ${risk.toUpperCase()} enviada con éxito a Defensa Civil y Bomberos de Satipo!`)} className="btn" style={{ background: '#dc3545', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}>
          🚨 Emitir Alerta Institucional
        </button>
      </div>
    </div>
  );
}