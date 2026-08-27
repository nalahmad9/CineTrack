import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { REQUEST_STOPS } from '../../core/presentation.model';
import { PresentationService } from '../../core/presentation.service';

@Component({
  selector: 'app-request-path',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="path" [class.back]="direction() === 'back'">
      <div class="label">
        {{ direction() === 'back' ? 'Response returning' : 'POST /api/v1/auth/login' }}
      </div>
      <div class="steps">
        @for (s of stops; track s.id; let i = $index) {
          <div class="step" [class.on]="stop() === i" [class.passed]="stop() > i">
            <div class="dot"></div>
            <div class="title">{{ s.label }}</div>
            @if (stop() === i) {
              <div class="detail">{{ s.detail }}</div>
            }
          </div>
        }
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

      .label {
        font-family: var(--font-mono);
        font-size: 0.62rem;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--color-amber);
        text-align: center;
        margin-bottom: 1rem;
      }

      .path.back .label {
        color: var(--color-teal);
      }

      .steps {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 0.75rem;
      }

      .step {
        padding: 0.7rem;
        border: 1px solid rgba(240, 164, 58, 0.18);
        background: rgba(18, 16, 14, 0.75);
        opacity: 0.35;
        transition: opacity 0.3s ease, border-color 0.3s ease;
      }

      .step.on,
      .step.passed {
        opacity: 1;
      }

      .step.on {
        border-color: var(--color-amber);
      }

      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgba(240, 164, 58, 0.35);
        margin-bottom: 0.45rem;
      }

      .step.on .dot {
        background: var(--color-amber);
        box-shadow: 0 0 10px rgba(240, 164, 58, 0.55);
      }

      .step.passed .dot {
        background: var(--color-teal);
      }

      .title {
        font-family: var(--font-display);
        font-size: 1rem;
        letter-spacing: 0.04em;
      }

      .detail {
        margin-top: 0.35rem;
        font-size: 0.7rem;
        color: var(--color-muted);
        line-height: 1.35;
      }

      @media (max-width: 700px) {
        .steps {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
    `,
  ],
})
export class RequestPathComponent {
  readonly stops = REQUEST_STOPS;
  private readonly presentation = inject(PresentationService);
  readonly stop = computed(() => Math.max(0, this.presentation.world().requestStop));
  readonly direction = computed(() => this.presentation.world().requestDirection);
}
