import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useEvolution } from '../hooks/useEvolution';
import SettingsModal from './SettingsModal';
import RightPanel from './RightPanel';

// Размеры холста
const WIDTH = 900;
const HEIGHT = 600;

// Главный компонент симуляции
export default function Simulation() {
  const canvasRef = useRef(null);
  const [selectedCreature, setSelectedCreature] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [treeCreature, setTreeCreature] = useState(null);

  // Настройки 
  const [config, setConfig] = useState({
    creatureCount: 20,
    reproduceThreshold: 120,
    mutationFactor: 0.15,
    baseCost: 0.35,
    minFood: 65,
  });

  // Обновление одного параметра конфигурации
  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  // Получение данных и методов из хука useEvolution
  const {
    creatures,
    foods,
    stats,
    populationHistory,
    start,
    togglePause,
    getCreatureColor,
    isRunning,
    speed,
    setSpeed,
    champion,
    championHoldTime,
    message,
  } = useEvolution(WIDTH, HEIGHT, config);

  // Рисование холста
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) 
        return;
    ctx.clearRect(0, 0, WIDTH, HEIGHT); // Очистка
 
    for (let f of foods) {
      if (f.draw && typeof f.draw === 'function') {
        f.draw(ctx);
      } else {
        ctx.beginPath();
        ctx.arc(f.x, f.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#2ecc71';
        ctx.fill();
      }
    }

    for (let c of creatures) {
      if (champion && c.id === champion.id) {
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(c.x, c.y, 12, 0, Math.PI * 2);
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      ctx.beginPath();
      ctx.arc(c.x, c.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = getCreatureColor(c.genome);
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(Math.floor(c.energy), c.x, c.y - 10);
    }

    if (message) {
      ctx.fillStyle = 'rgba(0,0,0,0.75)';
      ctx.fillRect(10, HEIGHT - 40, 300, 30);
      ctx.fillStyle = '#fff';
      ctx.font = '16px Arial';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(message, 20, HEIGHT - 25);
    }

    if (creatures.length === 0 && foods.length > 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = '18px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Нажмите "Старт", чтобы запустить симуляцию', WIDTH / 2, HEIGHT / 2);
    }
  }, [creatures, foods, getCreatureColor, champion, message]);

  // График популяции
  const drawChart = useCallback(() => {
    const canvas = document.getElementById('popChart');
    if (!canvas) 
        return;

    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    // Если данных недостаточно – выводим сообщение
    if (populationHistory.length < 2) {
      ctx.fillStyle = '#999';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Нет данных', w / 2, h / 2);
      return;
    }

    const padding = { top: 20, bottom: 25, left: 42, right: 18 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    const maxData = Math.max(...populationHistory.map(p => p.count), 1);
    let maxCount;
    if (maxData <= 200) 
    {
      maxCount = 200;
    } 
    else {
      maxCount = Math.ceil(maxData / 50) * 50;
    }
    const step = 50;

    // Горизонтальные линии сетки
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#333';
    ctx.font = '9px Arial';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    const steps = maxCount / step;
    for (let i = 0; i <= steps; i++) 
    {
      const yVal = i * step;
      const y = padding.top + chartH - (yVal / maxCount) * chartH;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();
      ctx.fillStyle = '#333';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(yVal, padding.left - 5, y);
    }

    // Подпись оси Y
    ctx.save();
    ctx.translate(8, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#333';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Численность', 0, 0);
    ctx.restore();

    // Рисуем линию графика
    ctx.beginPath();
    ctx.strokeStyle = '#d32f2f';
    ctx.lineWidth = 2;
    for (let i = 0; i < populationHistory.length; i++) 
    {
      const x = padding.left + (i / (populationHistory.length - 1)) * chartW;
      const y = padding.top + chartH - (populationHistory[i].count / maxCount) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Подпись оси X
    ctx.fillStyle = '#333';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('Время (шаги)', w / 2, h - 13);

    // Отображаем последнее значение
    const last = populationHistory[populationHistory.length - 1];
    const lastX = padding.left + chartW;
    const lastY = padding.top + chartH - (last.count / maxCount) * chartH;
    ctx.fillStyle = '#d32f2f';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText(last.count, lastX - 4, lastY - 2);

    // Заголовок графика
    ctx.fillStyle = '#222';
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('Динамика популяции', w / 2, padding.top - 2);
  }, [populationHistory]);

  // Перерисовка графика при изменении истории
  useEffect(() => {
    drawChart();
  }, [populationHistory, drawChart]);

  // Клик по холсту 
  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    let found = null;
    for (let c of creatures) {
      const dx = c.x - x;
      const dy = c.y - y;
      if (Math.hypot(dx, dy) < 8) {
        found = c;
        break;
      }
    }
    setSelectedCreature(found);
  };

  // Рендер 
  return (
    <div style={{
      display: 'flex',
      gap: '24px',
      padding: '24px',
      fontFamily: 'Segoe UI, Arial, sans-serif',
      background: '#f4f6f9',
      minHeight: '100vh',
    }}>
      {/* Левая колонка – холст и управление */}
      <div style={{ flex: 1 }}>
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          style={{
            border: '2px solid #2c3e50',
            borderRadius: '12px',
            backgroundColor: '#1e2a2e',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            cursor: 'pointer',
          }}
          onClick={handleCanvasClick}
        />
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={start}
            style={{
              padding: '10px 24px',
              background: '#3b82f6',
              border: 'none',
              borderRadius: '30px',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(59,130,246,0.4)',
              transition: '0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>🚀</span> Старт
          </button>
          <button
            onClick={togglePause}
            style={{
              padding: '10px 24px',
              background: isRunning ? '#f59e0b' : '#10b981',
              border: 'none',
              borderRadius: '30px',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              transition: '0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {isRunning ? '⏸ Пауза' : '▶ Продолжить'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginLeft: '12px' }}>
            <span style={{ fontWeight: '500', color: '#333', fontSize: '15px' }}>Скорость:</span>
            {[0.15, 0.25, 0.5, 1].map(s => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '25px',
                  border: 'none',
                  background: speed === s ? '#f59e0b' : '#e2e8f0',
                  color: speed === s ? '#fff' : '#333',
                  fontWeight: speed === s ? '700' : '500',
                  cursor: 'pointer',
                  transition: '0.2s',
                  fontSize: '13px',
                  minWidth: '48px',
                  marginTop: '6px',
                  marginLeft: s === 0.3 ? 0 : '2px',
                }}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Кнопка открытия настроек */}
          <button
            onClick={() => setSettingsOpen(true)}
            style={{
              marginLeft: '125px',
              background: '#2c3e50',
              border: 'none',
              borderRadius: '30px',
              padding: '8px 16px',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              transition: '0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <span style={{ fontSize: '20px' }}>⚙️</span> Настройки
          </button>
        </div>
      </div>

      {/* Правая панель */}
      <RightPanel
        stats={stats}
        champion={champion}
        championHoldTime={championHoldTime}
        selectedCreature={selectedCreature}
        setTreeCreature={setTreeCreature}
        message={message}
        treeCreature={treeCreature}
        creatures={creatures}
      />

      {/* Модальное окно настроек */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        config={config}
        updateConfig={updateConfig}
      />
    </div>
  );
}
