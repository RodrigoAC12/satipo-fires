import React from 'react';

const HistoryTable = ({ history, onRowClick, onDownloadPDF }) => {
  const formatDateTime = (dateString) => {
    if (!dateString) return { date: '-', time: '-' };
    const d = new Date(dateString);
    return {
      date: d.toLocaleDateString('es-PE'),
      time: d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getRiskColor = (risk) => {
    if (!risk) return 'inherit';
    const r = risk.toLowerCase();
    if (r.includes('bajo')) return '#2e7d32'; 
    if (r.includes('medio')) return '#e65100';
    if (r.includes('alto') || r.includes('crítico') || r.includes('critico')) return '#c62828';
    return 'inherit';
  };

  return (
    <div style={{ 
      width: '100%',
      overflowX: 'auto', 
      overflowY: 'auto', 
      maxHeight: '400px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      backgroundColor: '#fff',
      WebkitOverflowScrolling: 'touch'
    }}>
      <table style={{ 
        width: '100%', 
        minWidth: '1000px', 
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
            <th style={{ padding: '12px 10px' }}>Fecha</th>
            <th style={{ padding: '12px 10px' }}>Hora</th>
            <th style={{ padding: '12px 10px' }}>Coordenadas</th>
            <th style={{ padding: '12px 10px' }}>Riesgo</th>
            <th style={{ padding: '12px 10px' }}>Precisión ML</th>
            <th style={{ padding: '12px 10px' }}>Temp</th>
            <th style={{ padding: '12px 10px' }}>Hum</th>
            <th style={{ padding: '12px 10px' }}>Viento</th>
            <th style={{ padding: '12px 10px', textAlign: 'center' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {history && history.length > 0 ? (
            history.map((item, idx) => {
              const { date, time } = formatDateTime(item.created_at || item.fecha);
              const risk = item.risk_level || item.riesgo || 'N/A';
              const accuracy = item.accuracy || (item.probability ? (item.probability * 100).toFixed(2) : '-');

              return (
                <tr 
                  key={item.id || idx} 
                  onClick={() => onRowClick(item)} 
                  style={{ cursor: 'pointer', borderBottom: '1px solid #eee' }}
                >
                  <td style={{ padding: '12px 10px' }}>{date}</td>
                  <td style={{ padding: '12px 10px' }}>{time}</td>
                  <td style={{ padding: '12px 10px', fontSize: '0.75rem' }}>
                    {item.latitude?.toFixed(4)}, {item.longitude?.toFixed(4)}
                  </td>
                  <td style={{ padding: '12px 10px', fontWeight: 'bold', color: getRiskColor(risk) }}>
                    {risk.toUpperCase()}
                  </td>
                  <td style={{ padding: '12px 10px', fontWeight: 'bold', color: '#1b5e20' }}>
                    {accuracy}%
                  </td>
                  <td style={{ padding: '12px 10px' }}>{item.temperature ?? '-'}°</td>
                  <td style={{ padding: '12px 10px' }}>{item.humidity ?? '-'}%</td>
                  <td style={{ padding: '12px 10px' }}>{item.wind ?? '-'} km/h</td>
                  <td style={{ padding: '8px', textAlign: 'center' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if(onDownloadPDF) onDownloadPDF(item);
                      }}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#fff',
                        border: '1px solid #2e7d32',
                        borderRadius: '4px',
                        color: '#2e7d32',
                        fontWeight: '600',
                        cursor: 'pointer'
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
              <td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>
                Cargando registros...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryTable;