import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { PresentationService } from '../../core/presentation.service';

@Component({
  selector: 'app-comparison-stage',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dual" [style.--p]="progress()">
      <div class="col express">
        <div class="brand">Express</div>
        <div class="beat">Middleware</div>
        <div class="beat">Manual organization</div>
        <div class="beat soft">Ad-hoc structure</div>
      </div>
      <div class="vs">vs</div>
      <div class="col fastify">
        <div class="brand">Fastify</div>
        <div class="beat">Plugins</div>
        <div class="beat">Encapsulation</div>
        <div class="beat">Built-in validation</div>
        <div class="beat">Swagger</div>
        <div class="beat">Performance</div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        pointer-events: none;
      }

      .dual {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        gap: 1rem;
        width: min(820px, 100%);
        margin: 0 auto;
        align-items: start;
      }

      .col {
        padding: 1rem;
        border: 1px solid rgba(240, 164, 58, 0.2);
        background: rgba(18, 16, 14, 0.88);
      }

      .fastify {
        border-color: rgba(62, 207, 190, 0.4);
        opacity: calc(0.65 + var(--p) * 0.35);
      }

      .express {
        opacity: calc(0.55 + var(--p) * 0.15);
      }

      .brand {
        font-family: var(--font-display);
        font-size: 1.6rem;
        letter-spacing: 0.06em;
        margin-bottom: 0.75rem;
      }

      .fastify .brand {
        color: var(--color-teal);
      }

      .beat {
        padding: 0.45rem 0;
        border-top: 1px solid rgba(243, 234, 215, 0.08);
        font-size: 0.88rem;
      }

      .soft {
        color: var(--color-muted);
      }

      .vs {
        align-self: center;
        font-family: var(--font-mono);
        font-size: 0.62rem;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--color-muted);
        padding-top: 2rem;
      }
    `,
  ],
})
export class ComparisonStageComponent {
  private readonly presentation = inject(PresentationService);
  readonly progress = computed(() => this.presentation.world().comparisonProgress);
}
