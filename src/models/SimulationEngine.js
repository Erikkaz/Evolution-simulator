import { Creature } from './Creature';
import { Genome } from './Genome';
import { Apple } from './Apple';
import { Lemon } from './Lemon';
import { Orange } from './Orange';

export class SimulationEngine 
{
  constructor(config) 
  {
    this.config = config; // объект с параметрами симуляции
    this.MARGIN = 20;  // Отступ от краёв поля
  }

  // метод мутации одного гена
  static mutate(value, min, max, factor) 
  {
    const delta = (Math.random() - 0.5) * factor * value;
    let newVal = value + delta;
    return Math.min(max, Math.max(min, newVal));
  }

  // метод генерации случайного генома
  static randomGenome() 
  {
    return new Genome(
      1 + Math.random() * 2.5,
      50 + Math.random() * 100,
      0.6 + Math.random() * 0.8
    );
  }

  // метод размножения
  static reproduce(parent, mutationFactor, reproduceEnergyShare) 
  {
    // Создаём геном потомка с мутациями каждого гена
    const childGenome = new Genome(
      SimulationEngine.mutate(parent.genome.speed, 0.5, 3.5, mutationFactor),
      SimulationEngine.mutate(parent.genome.vision, 30, 200, mutationFactor),
      SimulationEngine.mutate(parent.genome.efficiency, 0.5, 1.8, mutationFactor)
    );

    const angle = Math.random() * Math.PI * 2;  // Случайный угол
    const radius = 25;  // Расстояние от родителя

    // Создаём существо
    return new Creature(
      crypto.randomUUID(),
      parent.x + Math.cos(angle) * radius,
      parent.y + Math.sin(angle) * radius,
      parent.energy * reproduceEnergyShare,
      childGenome,
      0,
      parent.id 
    );
  }

  // метод поиска ближайшей еды
  static findNearestFood(creature, foods) 
  {
    let minDist = Infinity;
    let nearest = null;

    // Проходим по всем объектам еды
    for (let f of foods) 
    {
      const dx = creature.x - f.x;
      const dy = creature.y - f.y;
      const dist = Math.hypot(dx, dy);

      // Если еда в пределах зрения и расстояние меньше текущего минимального
      if (dist < creature.genome.vision && dist < minDist)
      {
        minDist = dist;
        nearest = f;
      }
    }
    return nearest;
  }

  // метод создания случайного типа еды
  createRandomFood(x, y) 
  {
    const rand = Math.random();
    if (rand < 0.33) 
      return new Apple(x, y);

    if (rand < 0.66) 
      return new Lemon(x, y);

    return new Orange(x, y);
  }

  // Инициализация симуляции
  init(width, height) 
  {
    const { creatureCount, minFood, initialEnergyMin, initialEnergyMax } = this.config;
    const creatures = []; // массив существ

    for (let i = 0; i < creatureCount; i++) 
    {
      const energy = initialEnergyMin + Math.random() * (initialEnergyMax - initialEnergyMin);
      const genome = SimulationEngine.randomGenome();
      const x = this.MARGIN + Math.random() * (width - 2 * this.MARGIN);
      const y = this.MARGIN + Math.random() * (height - 2 * this.MARGIN);
      creatures.push(new Creature(crypto.randomUUID(), x, y, energy, genome, 0));
    }

    const foods = []; // массив еды
    for (let i = 0; i < minFood; i++) 
    {
      const x = this.MARGIN + Math.random() * (width - 2 * this.MARGIN);
      const y = this.MARGIN + Math.random() * (height - 2 * this.MARGIN);
      foods.push(this.createRandomFood(x, y));
    }

    return { creatures, foods };
  }

}