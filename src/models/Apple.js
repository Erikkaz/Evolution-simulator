import { Food } from './Food';

export class Apple extends Food 
{
  constructor(x, y) {
    super(x, y, 25, 'apple');
  }

  draw(ctx) 
  {
    const x = this.x, y = this.y;
    // Отрисовка яблока
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#e74c3c';
    ctx.fill();
    ctx.strokeStyle = '#c0392b';
    ctx.lineWidth = 1;
    ctx.stroke();
    // Хвостик
    ctx.beginPath();
    ctx.moveTo(x + 3, y - 4);
    ctx.lineTo(x + 6, y - 7);
    ctx.strokeStyle = '#27ae60';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Листик
    ctx.beginPath();
    ctx.ellipse(x + 5, y - 6, 2, 1.5, 0.5, 0, Math.PI * 2);
    ctx.fillStyle = '#2ecc71';
    ctx.fill();
  }
}