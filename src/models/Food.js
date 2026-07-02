// Базовый класс для всех видов еды
export class Food 
{
  constructor(x, y, energy, type = 'food') 
  {
    this.x = x;
    this.y = y;
    this.energy = energy;
    this.type = type; 
  }

  // Отрисовка обычной еды
  draw(ctx) 
  {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#2ecc71';
    ctx.fill();
  }
}