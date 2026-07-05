import React from 'react';
import StatCard from './StatCard';
import GenealogyTree from './GenealogyTree';

// Правая панель статистики
export default function RightPanel({
  stats,
  champion,
  championHoldTime,
  selectedCreature,
  setTreeCreature,       
  message,
  treeCreature,
  creatures,
}) {
  return (
    <div style={{
      width: 320,
      background: '#ffffff',
      borderRadius: '16px',
      padding: '16px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
      maxHeight: 'calc(100vh - 48px)',
      overflowY: 'auto',
    }}>
      {/* Заголовок панели */}
      <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', color: '#1e293b' }}>
        📊 Статистика
      </h3>

      {/* 4 карточки с ключевыми показателями */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px',
        marginBottom: '16px',
      }}>
        <StatCard label="Живых" value={stats.alive} color="#3b82f6" small />
        <StatCard label="Скорость" value={stats.avgSpeed.toFixed(2)} color="#8b5cf6" small />
        <StatCard label="Зрение" value={stats.avgVision.toFixed(0)} color="#ec4899" small />
        <StatCard label="Эффективность" value={stats.avgEfficiency.toFixed(2)} color="#f59e0b" small />
      </div>

      <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', color: '#475569' }}>📈 Популяция</h4>
      <canvas id="popChart" width="350" height="140" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', width: '100%' }} />

      {/* Блок чемпиона */}
      {champion && (
        <div style={{
          marginTop: '14px',
          background: 'linear-gradient(135deg, #fff8e1, #ffecb3)',
          padding: '12px',
          borderRadius: '10px',
          borderLeft: '4px solid #ffd700',
          color: '#0f172a',
        }}>
          <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', color: '#0f172a' }}>
            🏆 Чемпион (держит титул {championHoldTime} шагов)
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 10px', fontSize: '13px' }}>
            <span><strong>Энергия:</strong> {champion.energy.toFixed(1)}</span>
            <span><strong>Скорость:</strong> {champion.genome.speed.toFixed(2)}</span>
            <span><strong>Зрение:</strong> {champion.genome.vision.toFixed(0)}</span>
            <span><strong>Эффект:</strong> {champion.genome.efficiency.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Блок выбранного существа */}
      {selectedCreature && (
        <div style={{
          marginTop: '14px',
          background: '#f1f5f9',
          padding: '12px',
          borderRadius: '10px',
          borderLeft: '4px solid #3b82f6',
          color: '#0f172a'
        }}>
          <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', color: '#1e293b' }}>🔍 Выбранное</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 10px', fontSize: '13px' }}>
            <span><strong>ID:</strong> {selectedCreature.id.slice(0, 6)}</span>
            <span><strong>Энергия:</strong> {selectedCreature.energy.toFixed(1)}</span>
            <span><strong>Возраст:</strong> {Math.floor(selectedCreature.age / 15)} лет</span>
            <span><strong>Скорость:</strong> {selectedCreature.genome.speed.toFixed(2)}</span>
            <span><strong>Зрение:</strong> {selectedCreature.genome.vision.toFixed(0)}</span>
            <span><strong>Эффект:</strong> {selectedCreature.genome.efficiency.toFixed(2)}</span>
          </div>

          <button
            onClick={() => setTreeCreature(selectedCreature)}
            style={{
              marginTop: 10,
              padding: '6px 16px',
              background: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 13,
              width: '100%',
            }}
          >
            🌳 Показать дерево
          </button>
        </div>
      )}

      {message && (
        <div style={{
          marginTop: '10px',
          padding: '10px',
          borderRadius: '8px',
          background: message.includes('вымерла') ? '#f44336' : '#ff9800',
          color: '#fff',
          fontWeight: 'bold',
          textAlign: 'center',
        }}>
          {message}
        </div>
      )}

      <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '12px' }}>
        🔴 быстрый &nbsp; 🔵 дальнозоркий &nbsp; 🟢 эффективный
      </p>

      {/* Модальное окно дерева */}
      {treeCreature && (
        <GenealogyTree
          creature={treeCreature}
          allCreatures={creatures}
          onClose={() => setTreeCreature(null)}
        />
      )}
    </div>
  );
}
