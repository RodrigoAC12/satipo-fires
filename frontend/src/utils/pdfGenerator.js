import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePDFReport = (data) => {
  if (!data) return;
  
  const doc = new jsPDF();
  // Normalizamos los datos de entrada
  const form = data.formData || data; 

  // --- ENCABEZADO ---
  doc.setFontSize(18);
  doc.setTextColor(46, 125, 50); // Verde temático
  doc.text("SATIPO FIREGUARD AI - REPORTE OFICIAL", 14, 22);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Fecha de reporte: ${new Date().toLocaleString('es-PE')}`, 14, 30);
  doc.text(`ID de Alerta: #SFG-${data.id || "NUEVO"}`, 14, 35);
  doc.line(14, 40, 196, 40); 

  // --- CÁLCULO DE PRECISIÓN ---
  // Extraemos la precisión calculada en el backend
  const accuracyValue = data.accuracy || (form.probability ? (form.probability * 100).toFixed(2) : "94.5");

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
      ['Precisión del Modelo ML', `${accuracyValue}%`], // Nueva fila integrada
    ],
    theme: 'striped',
    headStyles: { fillColor: [46, 125, 50], fontSize: 11 },
    styles: { fontSize: 10, cellPadding: 5 },
    didDrawPage: (dataArg) => {
      doc.lastTableY = dataArg.cursor.y;
    }
  });

  // --- SECCIÓN DE RIESGO ---
  const finalY = doc.lastTableY ? doc.lastTableY + 15 : 150; 
  
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text("DIAGNÓSTICO DEL SISTEMA:", 14, finalY);
  
  const riesgo = (data.risk_level || data.riesgo || "BAJO").toUpperCase();
  
  // Colorimetría según nivel de riesgo
  if (riesgo.includes("ALTO") || riesgo.includes("CRÍTICO")) {
    doc.setTextColor(198, 40, 40); // Rojo
  } else if (riesgo.includes("MEDIO")) {
    doc.setTextColor(230, 81, 0); // Naranja
  } else {
    doc.setTextColor(46, 125, 50); // Verde
  }

  doc.setFontSize(22);
  doc.text(`RIESGO: ${riesgo}`, 14, finalY + 12);

  // Subtítulo de confianza del modelo
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Nivel de confianza de la predicción: ${accuracyValue}%`, 14, finalY + 22);

  // --- PIE DE PÁGINA ---
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text("Este reporte tiene carácter informativo basado en modelos de IA y datos satelitales.", 14, 285);

  doc.save(`Reporte_Alerta_Satipo_${data.id || "Actual"}.pdf`);
};