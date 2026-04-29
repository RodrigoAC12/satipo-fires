import React from 'react';

const HistoryTable = ({ history, onRowClick, onDownloadPDF }) => {
  // Separador de Fecha y Hora [cite: 1, 2]
  const formatDateTime = (dateString) => {
    const d = new Date(dateString);
    return {
      date: d.toLocaleDateString('es-PE'),
      time: d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
    };
  };

  // Colores para el nivel de riesgo según los requerimientos [cite: 3, 4, 5]
  const getRiskColor = (risk) => {
    if (!risk) return 'inherit';
    const r = risk.toLowerCase();
    if (r.includes('bajo')) return '#2e7d32'; // Verde
    if (r.includes('medio')) return '#e65100'; // Naranja
    if (r.includes('alto') || r.includes('crítico') || r.includes('critico')) return '#c62828'; // Rojo
    return 'inherit';
  };

  return (
    <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '350px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <table style={{ width: '100%', minWidth: '1050px', borderCollapse: 'collapse', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
        <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f1f8e9', zIndex: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <tr style={{ textAlign: 'left' }}>
            <th style={{ padding: '10px' }}>ID</th>
            <th style={{ padding: '10px' }}>Fecha</th>
            <th style={{ padding: '10px' }}>Hora</th>
            <th style={{ padding: '10px' }}>Coordenadas</th>
            <th style={{ padding: '10px' }}>Temp (°C)</th>
            <th style={{ padding: '10px' }}>Hum (%)</th>
            <th style={{ padding: '10px' }}>Viento</th>
            <th style={{ padding: '10px' }}>Pend.</th>
            <th style={{ padding: '10px' }}>NDVI</th>
            <th style={{ padding: '10px' }}>Riesgo</th>
            <th style={{ padding: '10px', textAlign: 'center' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {history && history.length > 0 ? (
            history.map((item, idx) => {
              const { date, time } = formatDateTime(item.created_at || item.fecha);
              const risk = item.risk_level || item.riesgo || 'N/A';
              
              return (
                <tr 
                  key={idx} 
                  onClick={() => onRowClick(item)} 
                  style={{ cursor: 'pointer', borderBottom: '1px solid #eee', transition: 'background 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '10px', fontWeight: 'bold', color: '#666' }}>
                    {item.id || idx + 1}
                  </td>
                  <td style={{ padding: '10px' }}>{date}</td>
                  <td style={{ padding: '10px', fontWeight: '500' }}>{time}</td>
                  <td style={{ padding: '10px', color: '#555' }}>
                    {item.latitude?.toFixed(4)}, {item.longitude?.toFixed(4)}
                  </td>
                  <td style={{ padding: '10px' }}>{item.temperature ?? '-'}</td>
                  <td style={{ padding: '10px' }}>{item.humidity ?? '-'}</td>
                  <td style={{ padding: '10px' }}>{item.wind ?? '-'}</td>
                  <td style={{ padding: '10px' }}>{item.slope ?? '-'}</td>
                  <td style={{ padding: '10px' }}>{item.ndvi ?? '-'}</td>
                  <td style={{ padding: '10px', fontWeight: 'bold', color: getRiskColor(risk) }}>
                    {risk.toUpperCase()}
                  </td>
                  <td style={{ padding: '5px', textAlign: 'center' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if(onDownloadPDF) onDownloadPDF(item);
                      }}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#fff',
                        border: '1px solid #2e7d32',
                        borderRadius: '4px',
                        color: '#2e7d32',
                        cursor: 'pointer',
                        fontSize: '0.75rem'
                      }}
                    >
                      📄 PDF
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="11" style={{ textAlign: 'center', padding: '20px' }}>Cargando registros...</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryTable;