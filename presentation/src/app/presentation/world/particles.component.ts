import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-particles',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas #canvas class="dust"></canvas>`,
  styles: [
    `
      .dust {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        opacity: 0.4;
        pointer-events: none;
      }
    `,
  ],
})
export class ParticlesComponent implements AfterViewInit, OnDestroy {
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private raf = 0;
  private resizeObs?: ResizeObserver;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef().nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const motes = Array.from({ length: 55 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.4 + Math.random() * 1.6,
      vx: (Math.random() - 0.5) * 0.00018,
      vy: -0.00005 - Math.random() * 0.0002,
      warm: Math.random() > 0.55,
    }));

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth * devicePixelRatio;
      canvas.height = parent.clientHeight * devicePixelRatio;
    };
    resize();
    this.resizeObs = new ResizeObserver(resize);
    this.resizeObs.observe(canvas.parentElement!);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      for (const p of motes) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < 0) p.y = 1;
        if (p.x < 0 || p.x > 1) p.vx *= -1;

        const x = p.x * w;
        const y = p.y * h;
        ctx.beginPath();
        ctx.fillStyle = p.warm
          ? `rgba(240, 164, 58, ${0.15 + Math.random() * 0.2})`
          : `rgba(243, 234, 215, ${0.08 + Math.random() * 0.15})`;
        ctx.arc(x, y, p.r * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
      }

      this.raf = requestAnimationFrame(draw);
    };
    this.raf = requestAnimationFrame(draw);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
    this.resizeObs?.disconnect();
  }
}
