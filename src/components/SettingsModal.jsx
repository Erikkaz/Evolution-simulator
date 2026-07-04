import React from 'react';
import SettingRow from './SettingRow';

// Модальное окно с настройками симуляции
export default function SettingsModal({ isOpen, onClose, config, updateConfig }) 
{
  // Если окно закрыто – ничего не рендерим
  if (!isOpen) 
    return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        animation: 'fadeIn 0.3s ease',
      }}
      onClick={onClose}  // клик вне = закрыть
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '32px 40px',
          maxWidth: '440px',
          width: '90%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          animation: 'slideUp 0.3s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок с кнопкой закрытия */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '26px', fontWeight: '700', color: '#1e293b' }}>⚙️ Настройки</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '26px',
              cursor: 'pointer',
              color: '#64748b',
              transition: '0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#1e293b'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
          >
            ✕
          </button>
        </div>

        {/* Список настроек*/}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <SettingRow
            label="Количество существ"
            value={config.creatureCount}
            onChange={(v) => updateConfig('creatureCount', v)}
            min={10}
            max={100}
            step={1}
          />
          <SettingRow
            label="Количество еды"
            value={config.minFood}
            onChange={(v) => updateConfig('minFood', v)}
            min={60}
            max={90}
            step={1}
          />
          <SettingRow
            label="Порог размножения"
            value={config.reproduceThreshold}
            onChange={(v) => updateConfig('reproduceThreshold', v)}
            min={100}
            max={300}
            step={5}
          />
          <SettingRow
            label="Фактор мутации"
            value={config.mutationFactor}
            onChange={(v) => updateConfig('mutationFactor', v)}
            min={0.1}
            max={0.4}
            step={0.01}
            isFloat
          />
          <SettingRow
            label="Затраты энергии"
            value={config.baseCost}
            onChange={(v) => updateConfig('baseCost', v)}
            min={0.3}
            max={1.0}
            step={0.05}
            isFloat
          />
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 40px',
              background: '#3b82f6',
              border: 'none',
              borderRadius: '30px',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: '0.2s',
              boxShadow: '0 4px 12px rgba(59,130,246,0.4)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Применить
          </button>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '10px' }}>
            Изменения применяются при следующем запуске «Старт»
          </p>
        </div>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}
