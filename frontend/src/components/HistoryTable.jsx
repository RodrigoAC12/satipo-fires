import React from 'react';

const HistoryTable = ({ history, onRowClick, onDownloadPDF }) => {
  // Separador de Fecha y Hora
  const formatDateTime = (dateString) => {
    if (!dateString) return { date: '-', time: '-' };
    const d = new Date(dateString);
    return {
      date: d.toLocaleDateString('es-PE'),
      time: d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
    };
  };

  // Colores para el nivel de riesgo
  const getRiskColor = (risk) => {
    if (!risk) return 'inherit';
    const r = risk.toLowerCase();
    if (r.includes('bajo')) return '#2e7d32'; // Verde
    if (r.includes('medio')) return '#e65100'; // Naranja
    if (r.includes('alto') || r.includes('crítico') || r.includes('critico')) return '#c62828'; // Rojo
    return 'inherit';
  };

  return (
    /* CONTENEDOR RESPONSIVO: Habilita el scroll horizontal en celulares */
    <div style={{ 
      width: '100%',
      overflowX: 'auto', 
      overflowY: 'auto', 
      maxHeight: '400px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      backgroundColor: '#fff',
      WebkitOverflowScrolling: 'touch' // Scroll suave en iOS
    }}>
      <table style={{ 
        width: '100%', 
        minWidth: '900px', // Forzamos ancho mínimo para que los datos no se amontonen en móvil
        borderCollapse: 'collapse', 
        fontSize: '0.85rem', 
        whiteSpace: 'nowrap' 
      }}>
        <thead style={{ 
          position: 'sticky', 
          top: 0, 
          backgroundColor: '#f1f8e9', 
          zIndex: 10, 
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)' 
        }}>
          <tr style={{ textAlign: 'left' }}>
            <th style={{ padding: '12px 10px' }}>ID</th>
            <th style={{ padding: '12px 10px' }}>Fecha</th>
            <th style={{ padding: '12px 10px' }}>Hora</th>
            <th style={{ padding: '12px 10px' }}>Coordenadas</th>
            <th style={{ padding: '12px 10px' }}>Temp (°C)</th>
            <th style={{ padding: '12px 10px' }}>Hum (%)</th>
            <th style={{ padding: '12px 10px' }}>Viento</th>
            <th style={{ padding: '12px 10px' }}>Pend.</th>
            <th style={{ padding: '12px 10px' }}>NDVI</th>
            <th style={{ padding: '12px 10px' }}>Riesgo</th>
            <th style={{ padding: '12px 10px', textAlign: 'center' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {history && history.length > 0 ? (
            history.map((item, idx) => {
              const { date, time } = formatDateTime(item.created_at || item.fecha);
              const risk = item.risk_level || item.riesgo || 'N/A';
              
              return (
                <tr 
                  key={item.id || idx} 
                  onClick={() => onRowClick(item)} 
                  style={{ 
                    cursor: 'pointer', 
                    borderBottom: '1px solid #eee', 
                    transition: 'background 0.2s' 
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '12px 10px', fontWeight: 'bold', color: '#666' }}>
                    {item.id || idx + 1}
                  </td>
                  <td style={{ padding: '12px 10px' }}>{date}</td>
                  <td style={{ padding: '12px 10px', fontWeight: '500' }}>{time}</td>
                  <td style={{ padding: '12px 10px', color: '#555', fontSize: '0.75rem' }}>
                    {item.latitude?.toFixed(4)}, {item.longitude?.toFixed(4)}
                  </td>
                  <td style={{ padding: '12px 10px' }}>{item.temperature ?? '-'}</td>
                  <td style={{ padding: '12px 10px' }}>{item.humidity ?? '-'}</td>
                  <td style={{ padding: '12px 10px' }}>{item.wind ?? '-'}</td>
                  <td style={{ padding: '12px 10px' }}>{item.slope ?? '-'}</td>
                  <td style={{ padding: '12px 10px' }}>{item.ndvi ?? '-'}</td>
                  <td style={{ padding: '12px 10px', fontWeight: 'bold', color: getRiskColor(risk) }}>
                    {risk.toUpperCase()}
                  </td>
                  <td style={{ padding: '8px', textAlign: 'center' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Evita que se mueva el mapa al dar clic en PDF
                        if(onDownloadPDF) onDownloadPDF(item);
                      }}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#fff',
                        border: '1px solid #2e7d32',
                        borderRadius: '4px',
                        color: '#2e7d32',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: '600'
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
              <td colSpan="11" style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
                No hay registros disponibles en el historial.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryTable;