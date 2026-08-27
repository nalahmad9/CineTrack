import { Injectable, computed, signal } from '@angular/core';

import { BEATS } from './beats';
import { ACTS, ActId, Beat } from './presentation.model';

@Injectable({ providedIn: 'root' })
export class PresentationService {
  readonly beats = BEATS;
  readonly acts = ACTS;

  private readonly index = signal(0);

  readonly currentIndex = this.index.asReadonly();
  readonly beat = computed<Beat>(() => this.beats[this.index()]);
  readonly actId = computed<ActId>(() => this.beat().act);
  readonly actMeta = computed(() => this.acts.find((a) => a.id === this.actId())!);
  readonly progress = computed(() => (this.index() + 1) / Math.max(this.beats.length, 1));
  readonly isFirst = computed(() => this.index() === 0);
  readonly isLast = computed(() => this.index() === this.beats.length - 1);

  next(): boolean {
    if (this.isLast()) return false;
    this.goTo(this.index() + 1);
    return true;
  }

  prev(): boolean {
    if (this.isFirst()) return false;
    this.goTo(this.index() - 1);
    return true;
  }

  goTo(target: number): void {
    const clamped = Math.max(0, Math.min(this.beats.length - 1, target));
    if (clamped === this.index()) return;
    this.index.set(clamped);
  }

  jumpToAct(act: ActId): void {
    const idx = this.beats.findIndex((b) => b.act === act);
    if (idx >= 0) this.goTo(idx);
  }
}
