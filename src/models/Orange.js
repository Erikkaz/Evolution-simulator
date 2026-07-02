import { Food } from './Food';

export class Orange extends Food 
{
  constructor(x, y) {
    super(x, y, 30, 'orange');
  }

  draw(ctx) 
  {
    const x = this.x, y = this.y;
    // Отрисовка апельсина
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#ff8c00';
    ctx.fill();
    ctx.strokeStyle = '#e65c00';
    ctx.lineWidth = 1;
    ctx.stroke();
    // Точки для текстуры
    for (let i = 0; i < 4; i++) 
    {
      const angle = (i / 4) * Math.PI * 2 + 0.3;
      const dx = Math.cos(angle) * 3;
      const dy = Math.sin(angle) * 3;
      ctx.beginPath();
      ctx.arc(x + dx, y + dy, 1, 0, Math.PI * 2);
      ctx.fillStyle = '#d35400';
      ctx.fill();
    }
  }
}
