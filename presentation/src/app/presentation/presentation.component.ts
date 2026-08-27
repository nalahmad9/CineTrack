import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  effect,
  inject,
} from '@angular/core';

import { AudioService } from '../core/audio.service';
import { PresentationService } from '../core/presentation.service';
import { WorldStageComponent } from './world/world-stage.component';

@Component({
  selector: 'app-presentation',
  standalone: true,
  imports: [WorldStageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="reel" (click)="onClick($event)">
      <header class="top">
        <div class="identity">
          <span class="dot"></span>
          <span class="word">CineTrack</span>
          <span class="sep">/</span>
          <span class="tag">Architecture Reels</span>
        </div>
        <div class="controls">
          <button type="button" (click)="audio.toggle(); $event.stopPropagation()">
            {{ audio.enabled() ? 'Sound' : 'Mute' }}
          </button>
          <button
            type="button"
            [disabled]="presentation.isFirst()"
            (click)="presentation.prev(); $event.stopPropagation()"
          >
            Back
          </button>
          <button
            type="button"
            class="next"
            [disabled]="presentation.isLast()"
            (click)="presentation.next(); $event.stopPropagation()"
          >
            Next
          </button>
        </div>
      </header>

      <div class="headline-block">
        <div class="act-line">Act {{ actId() }} · {{ actTitle() }} · {{ label() }}</div>
        <h1>{{ headline() }}</h1>
      </div>

      <app-world-stage />

      <footer class="bar">
        <nav class="acts" aria-label="Acts">
          @for (a of presentation.acts; track a.id) {
            <button
              type="button"
              class="act-dot"
              [class.active]="actId() === a.id"
              [class.done]="actId() > a.id"
              [title]="a.title"
              (click)="presentation.jumpToAct(a.id); $event.stopPropagation()"
            >
              {{ a.id }}
            </button>
          }
        </nav>
        <div class="scrub">
          <div class="fill" [style.width.%]="percent()"></div>
        </div>
        <div class="frame">{{ frame() }} / {{ total() }}</div>
        <div class="hint"><kbd>Space</kbd> advance</div>
      </footer>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }

      .reel {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: #07070a;
        user-select: none;
      }

      .top {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        z-index: 40;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.35rem;
        pointer-events: none;
      }

      .top > * {
        pointer-events: auto;
      }

      .identity {
        display: flex;
        align-items: center;
        gap: 0.55rem;
        font-size: 0.8rem;
      }

      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: linear-gradient(135deg, #ff4d6d, #3dffe0);
        box-shadow: 0 0 12px rgba(255, 77, 109, 0.6);
      }

      .word {
        font-weight: 700;
        letter-spacing: -0.02em;
      }

      .sep {
        color: #4a4a5c;
      }

      .tag {
        color: var(--color-mute);
        font-size: 0.72rem;
      }

      .controls {
        display: flex;
        gap: 0.4rem;
      }

      button {
        font-family: var(--font-body);
        font-size: 0.75rem;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(14, 14, 22, 0.75);
        color: var(--color-fog);
        padding: 0.45rem 0.85rem;
        cursor: pointer;
        backdrop-filter: blur(10px);
      }

      button:disabled {
        opacity: 0.35;
        cursor: default;
      }

      button.next {
        background: var(--color-coral);
        border-color: var(--color-coral);
        color: #1a050a;
        font-weight: 650;
      }

      .headline-block {
        position: absolute;
        top: 4.5rem;
        left: 0;
        right: 0;
        z-index: 35;
        text-align: center;
        padding: 0 1.5rem;
        pointer-events: none;
      }

      .act-line {
        font-family: var(--font-mono);
        font-size: 0.65rem;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--color-mint);
        margin-bottom: 0.55rem;
      }

      h1 {
        margin: 0 auto;
        max-width: 18ch;
        font-family: var(--font-display);
        font-weight: 700;
        font-size: clamp(2rem, 5.5vw, 3.6rem);
        line-height: 1.05;
        letter-spacing: -0.03em;
        color: var(--color-fog);
      }

      .bar {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 40;
        display: grid;
        grid-template-columns: auto 1fr auto auto;
        gap: 0.85rem;
        align-items: center;
        padding: 0.85rem 1.25rem 1rem;
        background: linear-gradient(0deg, rgba(7, 7, 10, 0.95), transparent);
      }

      .acts {
        display: flex;
        gap: 0.3rem;
      }

      .act-dot {
        width: 1.55rem;
        height: 1.55rem;
        padding: 0;
        display: grid;
        place-items: center;
        border-radius: 50%;
        font-family: var(--font-mono);
        font-size: 0.62rem;
        color: var(--color-mute);
      }

      .act-dot.active {
        background: rgba(255, 77, 109, 0.2);
        border-color: var(--color-coral);
        color: var(--color-fog);
      }

      .act-dot.done {
        color: var(--color-mint);
      }

      .scrub {
        height: 3px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.08);
        overflow: hidden;
      }

      .fill {
        height: 100%;
        background: linear-gradient(90deg, #ff4d6d, #3dffe0);
        transition: width 0.45s ease;
      }

      .frame {
        font-family: var(--font-mono);
        font-size: 0.65rem;
        color: var(--color-mute);
      }

      .hint {
        font-size: 0.68rem;
        color: var(--color-mute);
        display: flex;
        align-items: center;
        gap: 0.35rem;
      }

      kbd {
        font-family: var(--font-mono);
        font-size: 0.6rem;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 4px;
        padding: 0.1rem 0.3rem;
      }

      @media (max-width: 800px) {
        .hint,
        .tag,
        .sep {
          display: none;
        }

        h1 {
          max-width: 100%;
        }
      }
    `,
  ],
})
export class PresentationComponent {
  readonly presentation = inject(PresentationService);
  readonly audio = inject(AudioService);

  readonly actId = computed(() => this.presentation.actId());
  readonly actTitle = computed(() => this.presentation.actMeta().title);
  readonly label = computed(() => this.presentation.beat().label);
  readonly headline = computed(() => this.presentation.beat().headline);
  readonly frame = computed(() => this.presentation.currentIndex() + 1);
  readonly total = computed(() => this.presentation.beats.length);
  readonly percent = computed(() => Math.round(this.presentation.progress() * 100));

  constructor() {
    effect(() => {
      const beat = this.presentation.beat();
      this.audio.play(beat.sound);
    });
  }

  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    const t = e.target as HTMLElement | null;
    if (t && ['INPUT', 'TEXTAREA'].includes(t.tagName)) return;
    if (e.code === 'Space' || e.key === 'ArrowRight' || e.key === 'PageDown') {
      e.preventDefault();
      this.presentation.next();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      this.presentation.prev();
    } else if (e.key === 'Home') {
      e.preventDefault();
      this.presentation.goTo(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      this.presentation.goTo(this.presentation.beats.length - 1);
    }
  }

  onClick(e: MouseEvent): void {
    const el = e.target as HTMLElement;
    if (el.closest('button, a, nav, aside, .card')) return;
    this.presentation.next();
  }
}
