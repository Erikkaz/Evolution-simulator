import React from 'react';

// Компонент строки настройки в модальном окне
export default function SettingRow({ label, value, onChange, min, max, step, isFloat }) 
{
  // Обработчик изменения ползунка: парсит число
  const handleChange = (e) => {
    const val = isFloat ? parseFloat(e.target.value) : parseInt(e.target.value, 10);
    if (!isNaN(val)) 
      onChange(val);
  };

  return (
    <div>
      <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '500', color: '#334155' }}>
        <span>{label}</span>
        <span style={{ color: '#3b82f6', fontWeight: '700' }}>{value}</span>
      </label>
      
      {/* Ползунок */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        style={{
          width: '100%',
          accentColor: '#3b82f6',
          marginTop: '4px',
          cursor: 'pointer',
        }}
      />
    </div>
  );
}
