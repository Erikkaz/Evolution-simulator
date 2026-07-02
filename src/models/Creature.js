export class Creature
 {
  constructor(id, x, y, energy, genome, age = 0, parentId = null) 
  {
    this.id = id;
    this.x = x;
    this.y = y;
    this.energy = energy;  // запас энергии
    this.age = age;  // возраст
    this.genome = genome;  // геном
    this.parentId = parentId; // ID родителя 
  }

  // метод проверяет живо ли существо
  isAlive(maxAge) {
    return this.energy > 0 && this.age <= maxAge;
  }
}