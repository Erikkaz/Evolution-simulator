import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { SimulationEngine } from '../models/SimulationEngine';

// Хук управления симуляцией
export function useEvolution(width, height, config = {}) 
{
  // Конфигурация по умолчанию
  const defaultConfig = 
  {
    creatureCount: 20, // начальное кол-во существ
    initialEnergyMin: 80, // min начальная энергия
    initialEnergyMax: 120,  // max начальная энергия
    baseCost: 0.35,  // Базовый расход энергии за шаг
    speedCost: 0.1,  // Доп. расход энергии за скорость

    reproduceThreshold: 120, // Порог энергии для размножения
    reproduceEnergyShare: 0.5, // Доля энергии, передаваемая потомку
    minFood: 60,  // min кол-во еды на поле
    maxFood: 90,  // max кол-во еды на поле                
    foodRegenMin: 3, // min кол-во создаваемой еды
    foodRegenMax: 5, // max кол-во создаваемой еды
    
    mutationFactor: 0.15,  // Коэффициент мутации генов
    maxAge: 1500,  // max возраст существа в шагах
    championThreshold: 1.2,  // Коэффициент смены чемпиона
    maxPopulation: 200,  // max численность популяции         
  };

  // Пользовательские настройки переопределяют стандартные
  const settings = { ...defaultConfig, ...config };

  // Создаём экземпляр движка один раз при изменении настроек
  const engine = useMemo(() => new SimulationEngine(settings), [settings]);

  const [creatures, setCreatures] = useState([]); // список существ
  const [foods, setFoods] = useState([]);  // список еды
  const [stats, setStats] = useState({    // текущая статистика
    alive: 0,
    avgSpeed: 0,
    avgVision: 0,
    avgEfficiency: 0,
  });

  const [populationHistory, setPopulationHistory] = useState([]); // история численности 
  const [speed, setSpeed] = useState(1);  // скорость симуляции
  const [isRunning, setIsRunning] = useState(false);  // флаг запуска

  const [champion, setChampion] = useState(null);  // текущий чемпион
  const [championRating, setChampionRating] = useState(0);  // рейтинг чемпиона
  const [championHoldTime, setChampionHoldTime] = useState(0);  // сколько шагов чемпион удерживает титул
  const [message, setMessage] = useState('');   // системное сообщение

  const accumulatorRef = useRef(0);  // накопленное время для шагов симуляции
  const runningRef = useRef(false);  // актуальное состояние запуска
  const frameRef = useRef();  // идентификатор requestAnimationFrame
 
  // расчёт рейтинга существа
  const calculateRating = (creature) => {
    const geneScore = (creature.genome.speed / 3.5 + creature.genome.vision / 200 + creature.genome.efficiency / 1.8) / 3;
    return creature.energy * 0.6 + geneScore * 100 * 0.4;
  };

  // Инициализация симуляции 
  const initSimulation = useCallback(() => {
    const { creatures: newCreatures, foods: newFoods } = engine.init(width, height);
    setCreatures(newCreatures);
    setFoods(newFoods);
    setPopulationHistory([]);
    setChampion(null);
    setChampionRating(0);
    setChampionHoldTime(0);
    setMessage('');
  }, [engine, width, height]);

  // Обновление статистики и чемпиона
  const updateStats = useCallback((creaturesList) => {
    // Получаем средние показатели от движка
    const newStats = engine.calculateStats(creaturesList);
    setStats(newStats);

    // Добавляем точку в историю численности 
    setPopulationHistory(prev => {
      const newHist = [...prev, { time: Date.now(), count: newStats.alive }];
      if (newHist.length > 100) newHist.shift();
      return newHist;
    });

    // Определение чемпиона
    if (creaturesList.length) 
    {
      // Находим существо с максимальным рейтингом
      let bestCandidate = null;
      let bestRating = -Infinity;
      for (const c of creaturesList) {
        const rating = calculateRating(c);
        if (rating > bestRating) {
          bestRating = rating;
          bestCandidate = c;
        }
      }

      // Проверяем, жив ли текущий чемпион
      const isChampionAlive = champion && creaturesList.some(c => c.id === champion.id);

      if (!isChampionAlive) 
      {
        setChampion(bestCandidate);
        setChampionRating(bestRating);
        setChampionHoldTime(0);
      } 
      else 
      {
        if (bestRating > championRating * settings.championThreshold) 
        {
          setChampion(bestCandidate);
          setChampionRating(bestRating);
          setChampionHoldTime(0);
        } 
        else {
          setChampionHoldTime(prev => prev + 1);
        }
      }
    } 
    else 
    {
      setChampion(null);
      setChampionRating(0);
      setChampionHoldTime(0);
    }

    // Если популяция вымерла
    if (creaturesList.length === 0) {
      setMessage('💀 Популяция вымерла!');
    } else {
      setMessage('');
    }
  }, [champion, championRating, settings.championThreshold, engine]);

  const step = useCallback(() => {
    if (!runningRef.current) return;
    setCreatures(prevCreatures => {
      const result = engine.step(prevCreatures, foods, width, height);
      if (result.stats) {
        updateStats(result.creatures);
      }
      setFoods(result.foods);
      return result.creatures;
    });
  }, [engine, foods, width, height, updateStats]);

// Игровой цикл 
useEffect(() => {
    const gameLoop = () => {
      if (runningRef.current) {
        accumulatorRef.current += speed;
        while (accumulatorRef.current >= 1) {
          step();
          accumulatorRef.current -= 1;
        }
      }
      frameRef.current = requestAnimationFrame(gameLoop);
    };
    frameRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [step, speed]);

  // Запуск симуляции
  const start = useCallback(() => {
    initSimulation();
    runningRef.current = true;
    setIsRunning(true);
    accumulatorRef.current = 0;
  }, [initSimulation]);

  // Переключение паузы
  const togglePause = useCallback(() => {
    runningRef.current = !runningRef.current;
    setIsRunning(runningRef.current);
  }, []);

  // цвет существа по геному
  const getCreatureColor = useCallback((genome) => {
    const r = Math.min(255, (genome.speed / 3.5) * 255);
    const g = Math.min(255, (genome.vision / 200) * 255);
    const b = Math.min(255, (genome.efficiency / 1.8) * 255);
    return `rgb(${r}, ${g}, ${b})`;
  }, []);

  // Возвращаем API хука 
  return {
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
  };
}
