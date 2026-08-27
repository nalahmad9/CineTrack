import { Injectable, computed, signal } from '@angular/core';

import {
  CINEMA_SCENES,
  CinemaScene,
  MODULE_DETAILS,
  TOC_SECTIONS,
} from './explorer.model';

export interface ModulePeek {
  name: string;
  color: string;
  blurb: string;
  files: string;
  routes: string;
  points: string[];
  dive?: boolean;
}

export type SlideDirection = 'next' | 'prev' | 'none';

@Injectable({ providedIn: 'root' })
export class ExplorerService {
  readonly scenes = CINEMA_SCENES;
  readonly toc = TOC_SECTIONS;

  private readonly index = signal(0);
  private readonly modulePeek = signal<ModulePeek | null>(null);
  private readonly direction = signal<SlideDirection>('none');
  private readonly animTick = signal(0);

  readonly currentIndex = this.index.asReadonly();
  readonly slideDirection = this.direction.asReadonly();
  readonly slideTick = this.animTick.asReadonly();
  readonly scene = computed<CinemaScene>(() => this.scenes[this.index()]);
  readonly progress = computed(() => (this.index() + 1) / this.scenes.length);
  readonly isFirst = computed(() => this.index() === 0);
  readonly isLast = computed(() => this.index() === this.scenes.length - 1);
  readonly slideLabel = computed(
    () => `${this.index() + 1} / ${this.scenes.length}`,
  );
  readonly actTitle = computed(() => this.scene().actTitle);
  readonly activePeek = computed<ModulePeek | null>(() => {
    const manual = this.modulePeek();
    if (manual) return manual;
    const spot = this.scene().moduleSpot;
    if (spot && MODULE_DETAILS[spot]) {
      return { name: spot, ...MODULE_DETAILS[spot] };
    }
    return null;
  });

  next(): void {
    if (this.isLast()) return;
    this.modulePeek.set(null);
    this.direction.set('next');
    this.animTick.update((n) => n + 1);
    this.index.update((i) => i + 1);
  }

  prev(): void {
    if (this.isFirst()) return;
    this.modulePeek.set(null);
    this.direction.set('prev');
    this.animTick.update((n) => n + 1);
    this.index.update((i) => i - 1);
  }

  goTo(i: number): void {
    const clamped = Math.max(0, Math.min(this.scenes.length - 1, i));
    const cur = this.index();
    if (clamped === cur) return;
    this.modulePeek.set(null);
    this.direction.set(clamped > cur ? 'next' : 'prev');
    this.animTick.update((n) => n + 1);
    this.index.set(clamped);
  }

  jumpAct(act: number): void {
    const i = this.scenes.findIndex((s) => s.act === act);
    if (i >= 0) this.goTo(i);
  }

  jumpToSceneId(id: string): void {
    const i = this.scenes.findIndex((s) => s.id === id);
    if (i >= 0) this.goTo(i);
  }

  selectModule(name: string): void {
    const detail = MODULE_DETAILS[name];
    if (!detail) return;
    this.modulePeek.set({ name, ...detail });
  }

  diveIntoAuth(): void {
    this.modulePeek.set(null);
    const auth = this.scenes.findIndex((s) => s.id === 'auth-layers');
    if (auth >= 0) this.goTo(auth);
  }
}
