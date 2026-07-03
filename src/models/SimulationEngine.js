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

   // Один шаг симуляции 
   step(creatures, foods, width, height) 
   {
    // Если существ нет
    if (!creatures.length) 
      return { creatures: [], foods, stats: null };

    // Копируем сущности
    let newCreatures = creatures.map(c => new Creature(c.id, c.x, c.y, c.energy, c.genome, c.age, c.parentId));
    let newFoods = foods.map(f => {
      if (f.constructor && f.constructor.name !== 'Food')
      {
        const Cls = f.constructor;
        return new Cls(f.x, f.y);
      }
      return { x: f.x, y: f.y, energy: f.energy };
    });

    // Будущие потомки
    const toAddChildren = [];

     // Параметры конфигурации
    const {
      baseCost, speedCost, reproduceThreshold, reproduceEnergyShare,
      maxFood, minFood, foodRegenMin, foodRegenMax, maxAge, mutationFactor,
      maxPopulation  
    } = this.config;

    // Движение существ 
    for (let i = 0; i < newCreatures.length; i++) {
      const c = newCreatures[i];

      // Мёртвое существо пропускаем
      if (c.energy <= 0) 
        continue;

      // Поиск ближайшей еды
      const nearest = SimulationEngine.findNearestFood(c, newFoods);
      if (nearest)
      {
        // Если еда есть — двигаемся к ней
        const dx = nearest.x - c.x;
        const dy = nearest.y - c.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 0.5) 
        {
          const stepSize = Math.min(c.genome.speed, dist);
          const normX = dx / dist;
          const normY = dy / dist;
          let newX = c.x + normX * stepSize;
          let newY = c.y + normY * stepSize;
          let canMoveX = true, canMoveY = true;

          // Проверка выхода за границы
          if (newX < this.MARGIN || newX > width - this.MARGIN) 
            canMoveX = false;
          if (newY < this.MARGIN || newY > height - this.MARGIN) 
            canMoveY = false;

          // Обработка столкновения со стеной
          if (!canMoveX && !canMoveY) 
          {
            // Если застряли в углу — случайное уклонение
            const escapeAngle = Math.random() * Math.PI * 2;
            const escapeStep = c.genome.speed * 0.5;
            let ex = c.x + Math.cos(escapeAngle) * escapeStep;
            let ey = c.y + Math.sin(escapeAngle) * escapeStep;
            c.x = Math.min(Math.max(ex, this.MARGIN), width - this.MARGIN);
            c.y = Math.min(Math.max(ey, this.MARGIN), height - this.MARGIN);
          } 
          else if (!canMoveX) 
          {
            // Двигаемся только по Y
            c.y += normY * stepSize;
            c.y = Math.min(height - this.MARGIN, Math.max(this.MARGIN, c.y));
          } 
          else if (!canMoveY) 
          {
            // Двигаемся только по X
            c.x += normX * stepSize;
            c.x = Math.min(width - this.MARGIN, Math.max(this.MARGIN, c.x));
          } 
          else 
          {
            // Свободное движение
            c.x = newX;
            c.y = newY;
          }

        } 
        
        else 
        {
          // Еда достигнута — поглощение
          c.energy += nearest.energy * c.genome.efficiency;
          newFoods = newFoods.filter(f => f !== nearest);
        }

      } 
      
      else 
      {
         // Еды нет — случайное блуждание
        const angle = Math.random() * Math.PI * 2;
        const stepSize = c.genome.speed * 0.5;
        let dx = Math.cos(angle) * stepSize;
        let dy = Math.sin(angle) * stepSize;
        let newX = c.x + dx;
        let newY = c.y + dy;

        if (newX < this.MARGIN) 
        {
          newX = this.MARGIN + (this.MARGIN - newX);
          dx = -dx;
        } 
        else if (newX > width - this.MARGIN)
        {
          newX = width - this.MARGIN - (newX - (width - this.MARGIN));
          dx = -dx;
        }

        if (newY < this.MARGIN) 
        {
          newY = this.MARGIN + (this.MARGIN - newY);
          dy = -dy;
        } 
        else if (newY > height - this.MARGIN) 
        {
          newY = height - this.MARGIN - (newY - (height - this.MARGIN));
          dy = -dy;
        }

        c.x = Math.min(Math.max(newX, this.MARGIN), width - this.MARGIN);
        c.y = Math.min(Math.max(newY, this.MARGIN), height - this.MARGIN);
      }

      // Расход энергии за шаг 
      c.energy -= baseCost + c.genome.speed * speedCost;
      c.age++; // Увеличиваем возраст
    }
  }
}