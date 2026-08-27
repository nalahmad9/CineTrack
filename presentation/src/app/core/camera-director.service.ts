import { Injectable } from '@angular/core';
import gsap from 'gsap';

import { CameraPose } from './presentation.model';

@Injectable({ providedIn: 'root' })
export class CameraDirectorService {
  private worldEl: HTMLElement | null = null;
  private tween: gsap.core.Tween | null = null;

  attach(el: HTMLElement): void {
    this.worldEl = el;
  }

  detach(): void {
    this.tween?.kill();
    this.worldEl = null;
  }

  moveTo(pose: CameraPose, duration = 1.1): void {
    const el = this.worldEl;
    if (!el) return;

    this.tween?.kill();
    const state = {
      x: this.read(el, '--cam-x'),
      y: this.read(el, '--cam-y'),
      scale: this.read(el, '--cam-scale') || 1,
    };

    this.tween = gsap.to(state, {
      x: pose.x,
      y: pose.y,
      scale: pose.scale,
      duration,
      ease: 'power3.inOut',
      onUpdate: () => {
        el.style.setProperty('--cam-x', `${state.x}px`);
        el.style.setProperty('--cam-y', `${state.y}px`);
        el.style.setProperty('--cam-scale', `${state.scale}`);
      },
    });
  }

  private read(el: HTMLElement, prop: string): number {
    const n = parseFloat(getComputedStyle(el).getPropertyValue(prop));
    return Number.isFinite(n) ? n : 0;
  }
}
