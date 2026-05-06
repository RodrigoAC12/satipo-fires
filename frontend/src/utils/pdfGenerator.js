import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const formatPercent = (value) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue.toFixed(2) : "-";
};

const formatNumber = (value, decimals = 6) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue.toFixed(decimals) : "-";
};

const fallbackValue = (...values) => {
  const value = values.find((item) => item !== undefined && item !== null && item !== "");
  return value ?? "-";
};

const normalizeRisk = (risk) => String(risk).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();

export const generatePDFReport = (data) => {
  if (!data) return;

  const doc = new jsPDF();
  const form = data.formData || data;
  const probabilityValue = data.probability ?? data.probabilidad ?? form.probability ?? form.probabilidad;
  const probabilityPercent = formatPercent(probabilityValue);
  const probabilityText = probabilityPercent === "-" ? "-" : `${probabilityPercent}%`;

  doc.setFontSize(18);
  doc.setTextColor(46, 125, 50);
  doc.text("SATIPO FIREGUARD AI - REPORTE OFICIAL", 14, 22);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Fecha de reporte: ${new Date().toLocaleString('es-PE')}`, 14, 30);
  doc.text(`ID de Alerta: #SFG-${data.id || "NUEVO"}`, 14, 35);
  doc.line(14, 40, 196, 40);

  autoTable(doc, {
    startY: 45,
    head: [['Parametro Tecnico', 'Valor Detectado']],
    body: [
      ['Coordenadas (Lat, Lon)', `${formatNumber(form.latitude)}, ${formatNumber(form.longitude)}`],
      ['Temperatura Ambiente', `${fallbackValue(form.temperature, form.temp)} C`],
      ['Humedad Relativa', `${fallbackValue(form.humidity, form.humedad)} %`],
      ['Velocidad del Viento', `${fallbackValue(form.wind)} km/h`],
      ['Pendiente del Terreno', `${fallbackValue(form.slope)} grados`],
      ['Indice NDVI (Vegetacion)', fallbackValue(form.ndvi)],
      ['Precision del Modelo ML', probabilityText],
    ],
    theme: 'striped',
    headStyles: { fillColor: [46, 125, 50], fontSize: 11 },
    styles: { fontSize: 10, cellPadding: 5 },
    didDrawPage: (dataArg) => {
      doc.lastTableY = dataArg.cursor.y;
    },
  });

  const finalY = doc.lastTableY ? doc.lastTableY + 15 : 150;

  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text("DIAGNOSTICO DEL SISTEMA:", 14, finalY);

  const riesgo = normalizeRisk(data.risk_level || data.riesgo || "BAJO");

  if (riesgo.includes("ALTO") || riesgo.includes("CRITICO")) {
    doc.setTextColor(198, 40, 40);
  } else if (riesgo.includes("MEDIO")) {
    doc.setTextColor(230, 81, 0);
  } else {
    doc.setTextColor(46, 125, 50);
  }

  doc.setFontSize(22);
  doc.text(`RIESGO: ${riesgo}`, 14, finalY + 12);

  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Nivel de confianza de la prediccion: ${probabilityText}`, 14, finalY + 22);

  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text("Este reporte tiene caracter informativo basado en modelos de IA y datos satelitales.", 14, 285);

  doc.save(`Reporte_Alerta_Satipo_${data.id || "Actual"}.pdf`);
};
