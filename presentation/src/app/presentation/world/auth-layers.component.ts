import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { AUTH_LAYERS } from '../../core/presentation.model';
import { PresentationService } from '../../core/presentation.service';

@Component({
  selector: 'app-auth-layers',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stack">
      <div class="label">Inside Auth</div>
      @for (layer of layers; track layer.id; let i = $index) {
        <div
          class="layer film-panel"
          [class.on]="depth() > i"
          [class.current]="depth() === i + 1"
        >
          <span class="idx">{{ i + 1 }}</span>
          <div>
            <div class="title">{{ layer.label }}</div>
            <div class="detail">{{ layer.detail }}</div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: min(420px, 100%);
        pointer-events: none;
      }

      .label {
        font-family: var(--font-mono);
        font-size: 0.62rem;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--color-muted);
        text-align: center;
        margin-bottom: 0.85rem;
      }

      .stack {
        display: flex;
        flex-direction: column;
        gap: 0.45rem;
      }

      .layer {
        display: grid;
        grid-template-columns: 1.5rem 1fr;
        gap: 0.75rem;
        align-items: center;
        padding: 0.75rem 0.9rem;
        border-radius: 2px;
        opacity: 0.18;
        transform: translateY(6px);
        transition:
          opacity 0.35s ease,
          transform 0.35s ease,
          border-color 0.3s ease;
      }

      .layer.on {
        opacity: 1;
        transform: translateY(0);
      }

      .layer.current {
        border-color: var(--color-amber);
      }

      .idx {
        font-family: var(--font-mono);
        font-size: 0.7rem;
        color: var(--color-teal);
      }

      .title {
        font-family: var(--font-display);
        font-size: 1.2rem;
        letter-spacing: 0.04em;
      }

      .detail {
        margin-top: 0.1rem;
        font-size: 0.75rem;
        color: var(--color-muted);
      }
    `,
  ],
})
export class AuthLayersComponent {
  readonly layers = AUTH_LAYERS;
  private readonly presentation = inject(PresentationService);
  readonly depth = computed(() => this.presentation.world().layerDepth);
}
