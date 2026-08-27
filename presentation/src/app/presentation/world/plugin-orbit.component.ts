import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { PLUGINS } from '../../core/presentation.model';
import { PresentationService } from '../../core/presentation.service';

@Component({
  selector: 'app-plugin-orbit',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rack">
      <div class="label">Infrastructure plugins</div>
      <div class="grid">
        @for (p of plugins; track p.id) {
          <div
            class="item film-panel"
            [class.active]="active() === p.id"
            [class.dim]="active() && active() !== p.id"
          >
            <span class="name">{{ p.label }}</span>
            @if (active() === p.id) {
              <span class="role">{{ p.role }}</span>
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

      .rack {
        width: 100%;
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

      .grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 0.55rem;
      }

      .item {
        padding: 0.75rem 0.6rem;
        border-radius: 2px;
        text-align: center;
        transition:
          opacity 0.3s ease,
          border-color 0.3s ease,
          transform 0.3s ease;
      }

      .item.active {
        border-color: var(--color-amber);
        transform: translateY(-2px);
      }

      .item.dim {
        opacity: 0.35;
      }

      .name {
        display: block;
        font-family: var(--font-display);
        font-size: 1rem;
        letter-spacing: 0.04em;
      }

      .role {
        display: block;
        margin-top: 0.3rem;
        font-size: 0.68rem;
        color: var(--color-muted);
        line-height: 1.3;
      }

      @media (max-width: 700px) {
        .grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
    `,
  ],
})
export class PluginOrbitComponent {
  readonly plugins = PLUGINS;
  private readonly presentation = inject(PresentationService);
  readonly active = computed(() => this.presentation.world().activePlugin);
}
