import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { CONCEPTS } from '../../core/presentation.model';
import { PresentationService } from '../../core/presentation.service';

@Component({
  selector: 'app-narrative-overlay',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="banner">
      <div class="act">Act {{ roman() }} · {{ actTitle() }}</div>
      @if (narrative()) {
        <h1 class="headline">{{ narrative() }}</h1>
      }
      @if (subtitle()) {
        <p class="subtitle">{{ subtitle() }}</p>
      }
      @if (concept()) {
        <p class="concept">{{ concept()!.label }} — {{ concept()!.place }}</p>
      }
    </div>
  `,
  styles: [
    `
      :host {
        position: absolute;
        left: 0;
        right: 0;
        top: 4.75rem;
        z-index: 40;
        pointer-events: none;
        display: flex;
        justify-content: center;
        padding: 0 1.5rem;
      }

      .banner {
        width: min(720px, 100%);
        text-align: center;
      }

      .act {
        font-family: var(--font-mono);
        font-size: 0.62rem;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--color-amber);
        margin-bottom: 0.45rem;
      }

      .headline {
        margin: 0;
        font-family: var(--font-display);
        font-weight: 400;
        font-size: clamp(1.5rem, 3.2vw, 2.35rem);
        line-height: 1.05;
        letter-spacing: 0.04em;
        color: var(--color-cream);
        text-transform: uppercase;
      }

      .subtitle {
        margin: 0.45rem auto 0;
        max-width: 36rem;
        font-size: 0.92rem;
        color: #b7ad9a;
        line-height: 1.45;
      }

      .concept {
        margin: 0.55rem auto 0;
        font-family: var(--font-mono);
        font-size: 0.72rem;
        letter-spacing: 0.04em;
        color: var(--color-teal);
      }
    `,
  ],
})
export class NarrativeOverlayComponent {
  private readonly presentation = inject(PresentationService);
  private readonly romans = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

  readonly actTitle = computed(() => this.presentation.actMeta().title);
  readonly narrative = computed(() => this.presentation.beat().narrative);
  readonly subtitle = computed(() => this.presentation.beat().subtitle);
  readonly roman = computed(() => this.romans[this.presentation.actId() - 1] ?? '?');

  readonly concept = computed(() => {
    const w = this.presentation.world();
    if (!w.showConcepts || w.conceptIndex < 0) return null;
    return CONCEPTS[w.conceptIndex] ?? null;
  });
}
