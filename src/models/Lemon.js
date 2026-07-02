import { Food } from './Food';

export class Lemon extends Food 
{
  constructor(x, y) {
    super(x, y, 35, 'lemon');
  }

  draw(ctx) 
  {
    const x = this.x, y = this.y;
    // Отрисовка лимона 
    ctx.beginPath();
    ctx.ellipse(x, y, 6, 4, 0.2, 0, Math.PI * 2);
    ctx.fillStyle = '#ffeb3b';
    ctx.fill();
    ctx.strokeStyle = '#f9a825';
    ctx.lineWidth = 1;
    ctx.stroke();
    // Пупырышки 
    for (let i = 0; i < 3; i++) 
    {
      const angle = (i / 3) * Math.PI * 2 + 0.5;
      const dx = Math.cos(angle) * 2.5;
      const dy = Math.sin(angle) * 2;
      ctx.beginPath();
      ctx.arc(x + dx, y + dy, 1, 0, Math.PI * 2);
      ctx.fillStyle = '#d4ac0d';
      ctx.fill();
    }
    
  }
}