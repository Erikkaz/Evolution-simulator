import React from 'react';

// Компонент для отображения одного показателя
export default function StatCard({ label, value, color, small }) 
{
  return (
    <div style={{
      background: '#f8fafc',
      borderRadius: '10px',
      padding: small ? '8px 10px' : '12px',
      borderLeft: `4px solid ${color}`, // цветная полоска слева
    }}>

      {/* Название показателя */}
      <div style={{ fontSize: small ? '11px' : '12px', color: '#64748b', fontWeight: '500' }}>
        {label}
      </div>

      {/* Значение */}
      <div style={{ fontSize: small ? '16px' : '20px', fontWeight: '700', color: '#1e293b' }}>
        {value}
      </div>
      
    </div>
  );
}

