import React, { useState } from 'react';

export default function GenealogyTree({ creature, allCreatures, onClose }) 
{
  // ID развёрнутых узлов
  const [expandedIds, setExpandedIds] = useState(new Set());

  if (!creature) 
    return null;

  // Найти всех детей по parentId
  const getChildren = (parentId) => {
    return allCreatures.filter(c => c.parentId === parentId);
  };

  // Цвет кружка по геному
  const getColor = (genome) => {
    const r = Math.min(255, (genome.speed / 3.5) * 255);
    const g = Math.min(255, (genome.vision / 200) * 255);
    const b = Math.min(255, (genome.efficiency / 1.8) * 255);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const renderBranch = (currentCreature, depth = 0) => {
    const children = getChildren(currentCreature.id);
    const isExpanded = expandedIds.has(currentCreature.id);

    return (
      <div key={currentCreature.id} style={{ marginLeft: depth * 20, marginBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {/* Цветной кружок генотипа */}
          <span
            style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: getColor(currentCreature.genome),
            }}
          />
          {/* ID */}
          <span style={{ fontWeight: 500, color: '#333' }}>
            {currentCreature.id.slice(0, 6)}
          </span>

          {/* Кнопка-стрелка с поворотом */}
          {children.length > 0 && (
            <button
              onClick={() => {
                const newSet = new Set(expandedIds);
                if (isExpanded) newSet.delete(currentCreature.id);
                else newSet.add(currentCreature.id);
                setExpandedIds(newSet);
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'transform 0.2s',
                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                color: '#3b82f6',
                padding: '0 4px',
              }}
            >
              ▶
            </button>
          )}

          {/* Гены с иконками */}
          <span style={{ fontSize: 11, color: '#555', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span>📅 {Math.floor(currentCreature.age / 15)} лет</span>
            <span>🏃 {currentCreature.genome.speed.toFixed(1)}</span>
            <span>👁️ {currentCreature.genome.vision.toFixed(0)}</span>
            <span>⚡ {currentCreature.genome.efficiency.toFixed(2)}</span>
          </span>
        </div>
        {isExpanded && children.map(child => renderBranch(child, depth + 1))}
      </div>
    );
  };

  // Найти корневого предка
  const findRoot = (creature) => {
    if (!creature.parentId) return creature;
    const parent = allCreatures.find(c => c.id === creature.parentId);
    return parent ? findRoot(parent) : creature;
  };

  const root = findRoot(creature);
  const children = getChildren(root.id);

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
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: 24,
          maxWidth: 600,
          maxHeight: '80vh',
          overflowY: 'auto',
          width: '90%',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, color: '#000000' }}>🌳 Генеалогическое дерево</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer',
              color: '#64748b',
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ fontSize: 13, color: '#555', marginBottom: 12 }}>
          Корень: {root.id.slice(0, 6)} (потомков: {children.length})
        </div>
        <div style={{ borderLeft: '2px solid #e2e8f0', paddingLeft: 16 }}>
          {renderBranch(root)}
        </div>
        {children.length === 0 && (
          <div style={{ textAlign: 'center', color: '#999', padding: 20 }}>
            У этого существа нет потомков.
          </div>
        )}
      </div>
    </div>
  );
}

