import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePDFReport = (data) => {
  if (!data) return;
  
  const doc = new jsPDF();
  // Normalizamos: si viene de historial usa 'data', si viene de evaluación nueva usa 'formData' [cite: 38, 39]
  const form = data.formData || data; 

  // --- ENCABEZADO ---
  doc.setFontSize(18);
  doc.setTextColor(46, 125, 50); 
  doc.text("SATIPO FIREGUARD AI - REPORTE OFICIAL", 14, 22);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Fecha de reporte: ${new Date().toLocaleString('es-PE')}`, 14, 30);
  doc.text(`ID de Alerta: #SFG-${data.id || "NUEVO"}`, 14, 35);
  doc.line(14, 40, 196, 40); 

  // --- TABLA DE PARÁMETROS ---
  autoTable(doc, {
    startY: 45,
    head: [['Parámetro Técnico', 'Valor Detectado']],
    body: [
      ['Coordenadas (Lat, Lon)', `${form.latitude?.toFixed(6) || '-'}, ${form.longitude?.toFixed(6) || '-'}`],
      ['Temperatura Ambiente', `${form.temperature || form.temp || '-'} °C`],
      ['Humedad Relativa', `${form.humidity || form.humedad || '-'} %`],
      ['Velocidad del Viento', `${form.wind || '-'} km/h`],
      ['Pendiente del Terreno', `${form.slope || '-'}°`],
      ['Índice NDVI (Vegetación)', form.ndvi || '-'],
    ],
    theme: 'striped',
    headStyles: { fillColor: [46, 125, 50], fontSize: 11 },
    styles: { fontSize: 10, cellPadding: 5 },
    // Capturamos la posición final de forma segura 
    didDrawPage: (dataArg) => {
      doc.lastTableY = dataArg.cursor.y;
    }
  });

  // --- SECCIÓN DE RIESGO ---
  // Usamos una posición fija o calculada de forma segura para evitar el error de 'undefined' 
  const finalY = doc.lastTableY ? doc.lastTableY + 15 : 150; 
  
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text("DIAGNÓSTICO DEL SISTEMA:", 14, finalY);
  
  const riesgo = (data.risk_level || data.riesgo || "BAJO").toUpperCase();
  
  if (riesgo.includes("ALTO") || riesgo.includes("CRÍTICO")) {
    doc.setTextColor(198, 40, 40); 
  } else if (riesgo.includes("MEDIO")) {
    doc.setTextColor(230, 81, 0); 
  } else {
    doc.setTextColor(46, 125, 50); 
  }

  doc.setFontSize(22);
  doc.text(`RIESGO: ${riesgo}`, 14, finalY + 12);

  // --- PIE DE PÁGINA ---
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text("Este reporte tiene carácter informativo basado en modelos de IA y datos satelitales.", 14, 285);

  doc.save(`Reporte_Alerta_Satipo_${data.id || "Actual"}.pdf`);
};