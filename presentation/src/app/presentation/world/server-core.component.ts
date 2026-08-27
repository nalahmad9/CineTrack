import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { PresentationService } from '../../core/presentation.service';

@Component({
  selector: 'app-server-core',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="core" [class.compact]="compact()" [style.--power]="power()">
      <div class="iris">
        <div class="lamp"></div>
      </div>
      <div class="meta">
        <span class="brand">CineTrack</span>
        <span class="status">{{ label() }}</span>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        pointer-events: none;
      }

      .core {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.85rem;
      }

      .iris {
        width: 160px;
        height: 160px;
        border-radius: 50%;
        border: 2px solid rgba(240, 164, 58, calc(0.25 + var(--power) * 0.55));
        display: grid;
        place-items: center;
        background: rgba(18, 16, 14, 0.9);
        box-shadow: 0 0 40px rgba(240, 164, 58, calc(var(--power) * 0.28));
      }

      .compact .iris {
        width: 88px;
        height: 88px;
      }

      .lamp {
        width: 54%;
        height: 54%;
        border-radius: 50%;
        background: radial-gradient(circle at 40% 35%, #fff6d8, #f0a43a 50%, #5c3a12 100%);
        opacity: calc(0.2 + var(--power) * 0.8);
      }

      .meta {
        text-align: center;
      }

      .brand {
        display: block;
        font-family: var(--font-display);
        font-size: 1.5rem;
        letter-spacing: 0.1em;
        color: var(--color-cream);
      }

      .compact .brand {
        font-size: 1.05rem;
      }

      .status {
        display: block;
        margin-top: 0.2rem;
        font-family: var(--font-mono);
        font-size: 0.62rem;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--color-amber);
      }
    `,
  ],
})
export class ServerCoreComponent {
  readonly compact = input(false);
  private readonly presentation = inject(PresentationService);

  readonly power = computed(() => this.presentation.world().corePower);

  readonly label = computed(() => {
    const w = this.presentation.world();
    if (w.bootStage >= 6) return 'Listening';
    if (w.bootStage >= 5) return 'MongoDB connected';
    if (w.bootStage >= 4) return 'Modules registered';
    if (w.bootStage >= 3) return 'Plugins registered';
    if (w.bootStage >= 2) return 'Fastify created';
    if (w.bootStage >= 1) return 'Environment loaded';
    if (w.requirementsMerged) return 'Blueprint ready';
    return 'Dormant';
  });
}
