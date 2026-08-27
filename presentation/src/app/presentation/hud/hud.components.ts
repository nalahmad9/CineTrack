import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { ActId } from '../../core/presentation.model';
import { PresentationService } from '../../core/presentation.service';

@Component({
  selector: 'app-film-strip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="strip" role="progressbar" [attr.aria-valuenow]="percent()">
      <div class="sprocket left"></div>
      <div class="frames">
        <div class="fill" [style.width.%]="percent()"></div>
        <div class="meta">
          <span>FRAME {{ current() }} / {{ total() }}</span>
          <span>{{ beatLabel() }}</span>
        </div>
      </div>
      <div class="sprocket right"></div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: min(440px, 42vw);
      }

      .strip {
        display: grid;
        grid-template-columns: 14px 1fr 14px;
        align-items: stretch;
        background: #161310;
        border: 1px solid rgba(240, 164, 58, 0.28);
      }

      .sprocket {
        background:
          repeating-linear-gradient(
            180deg,
            transparent 0 8px,
            #0a0908 8px 14px,
            transparent 14px 24px
          ),
          #2a241c;
        animation: sprocket 1.2s linear infinite;
      }

      .frames {
        position: relative;
        padding: 0.45rem 0.7rem 0.35rem;
        overflow: hidden;
      }

      .fill {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        background: linear-gradient(90deg, rgba(240, 164, 58, 0.2), rgba(62, 207, 190, 0.25));
        transition: width 0.55s cubic-bezier(0.22, 1, 0.36, 1);
      }

      .meta {
        position: relative;
        display: flex;
        justify-content: space-between;
        font-family: var(--font-mono);
        font-size: 0.58rem;
        letter-spacing: 0.12em;
        color: var(--color-cream);
      }
    `,
  ],
})
export class FilmStripComponent {
  private readonly presentation = inject(PresentationService);

  readonly percent = computed(() => Math.round(this.presentation.progress() * 100));
  readonly current = computed(() => this.presentation.currentIndex() + 1);
  readonly total = computed(() => this.presentation.beats.length);
  readonly beatLabel = computed(() => this.presentation.beat().label.toUpperCase());
}

@Component({
  selector: 'app-scene-dock',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="scenes" aria-label="Scenes">
      @for (act of acts; track act.id) {
        <button
          type="button"
          class="scene"
          [class.active]="current() === act.id"
          [class.done]="current() > act.id"
          (click)="jump(act.id)"
        >
          <span class="num">{{ pad(act.id) }}</span>
          <span class="name">{{ act.short }}</span>
        </button>
      }
    </nav>
  `,
  styles: [
    `
      .scenes {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
      }

      .scene {
        display: grid;
        grid-template-columns: 1.4rem 1fr;
        gap: 0.4rem;
        align-items: center;
        padding: 0.4rem 0.35rem;
        border: 1px solid transparent;
        border-left: 2px solid transparent;
        background: transparent;
        color: var(--color-muted);
        cursor: pointer;
        text-align: left;
        font-family: var(--font-body);
      }

      .scene:hover {
        color: var(--color-cream);
        background: rgba(240, 164, 58, 0.06);
      }

      .scene.active {
        color: var(--color-cream);
        border-left-color: var(--color-amber);
        background: rgba(240, 164, 58, 0.1);
      }

      .scene.done .num {
        color: var(--color-teal);
      }

      .num {
        font-family: var(--font-mono);
        font-size: 0.62rem;
        color: var(--color-amber);
      }

      .name {
        font-size: 0.72rem;
        letter-spacing: 0.02em;
      }
    `,
  ],
})
export class SceneDockComponent {
  private readonly presentation = inject(PresentationService);
  readonly acts = this.presentation.acts;
  readonly current = computed(() => this.presentation.actId());

  jump(act: ActId): void {
    this.presentation.jumpToAct(act);
  }

  pad(n: number): string {
    return n.toString().padStart(2, '0');
  }
}
