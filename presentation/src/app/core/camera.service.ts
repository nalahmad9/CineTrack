import { Injectable, inject } from '@angular/core';
import gsap from 'gsap';

import { CameraPose } from './presentation.model';
import { PresentationService } from './presentation.service';

@Injectable({ providedIn: 'root' })
export class CameraService {
  private readonly presentation = inject(PresentationService);
  private worldEl: HTMLElement | null = null;
  private tween: gsap.core.Tween | null = null;

  attach(worldEl: HTMLElement): void {
    if (this.worldEl === worldEl) return;
    this.worldEl = worldEl;
    this.snap(this.presentation.camera());
  }

  detach(): void {
    this.tween?.kill();
    this.worldEl = null;
  }

  animateTo(pose: CameraPose, duration = 1.35): Promise<void> {
    const el = this.worldEl;
    if (!el) {
      this.snap(pose);
      return Promise.resolve();
    }

    this.presentation.setTransitioning(true);
    this.tween?.kill();

    return new Promise((resolve) => {
      const state = {
        x: this.readNumber(el, '--cam-x'),
        y: this.readNumber(el, '--cam-y'),
        z: this.readNumber(el, '--cam-z'),
        scale: this.readNumber(el, '--cam-scale') || 1,
        rotateX: this.readNumber(el, '--cam-rx'),
        rotateY: this.readNumber(el, '--cam-ry'),
      };

      this.tween = gsap.to(state, {
        x: pose.x,
        y: pose.y,
        z: pose.z,
        scale: pose.scale,
        rotateX: pose.rotateX,
        rotateY: pose.rotateY,
        duration,
        ease: 'power3.inOut',
        onUpdate: () => this.apply(el, state),
        onComplete: () => {
          this.presentation.setTransitioning(false);
          resolve();
        },
      });
    });
  }

  snap(pose: CameraPose): void {
    if (!this.worldEl) return;
    this.apply(this.worldEl, pose);
  }

  private apply(
    el: HTMLElement,
    pose: {
      x: number;
      y: number;
      z: number;
      scale: number;
      rotateX: number;
      rotateY: number;
    },
  ): void {
    el.style.setProperty('--cam-x', `${pose.x}px`);
    el.style.setProperty('--cam-y', `${pose.y}px`);
    el.style.setProperty('--cam-z', `${pose.z}px`);
    el.style.setProperty('--cam-scale', `${pose.scale}`);
    el.style.setProperty('--cam-rx', `${pose.rotateX}deg`);
    el.style.setProperty('--cam-ry', `${pose.rotateY}deg`);
  }

  private readNumber(el: HTMLElement, prop: string): number {
    const raw = getComputedStyle(el).getPropertyValue(prop).trim();
    const n = parseFloat(raw);
    return Number.isFinite(n) ? n : 0;
  }
}
