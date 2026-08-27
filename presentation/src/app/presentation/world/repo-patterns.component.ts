import { ChangeDetectionStrategy, Component } from '@angular/core';

import { REPO_PATTERNS } from '../../core/presentation.model';

@Component({
  selector: 'app-repo-patterns',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="board">
      <div class="label">Repository patterns</div>
      <div class="grid">
        @for (p of patterns; track p.id) {
          <div class="card film-panel" [style.--tone]="p.tone">
            <div class="title">{{ p.label }}</div>
            <div class="detail">{{ p.detail }}</div>
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
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--color-muted);
        text-align: center;
        margin-bottom: 0.85rem;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.75rem;
      }

      .card {
        padding: 1rem 1.1rem;
        border-radius: 2px;
        border-color: color-mix(in oklab, var(--tone) 35%, rgba(240, 164, 58, 0.25));
      }

      .title {
        font-family: var(--font-display);
        font-size: 1.25rem;
        letter-spacing: 0.04em;
      }

      .detail {
        margin-top: 0.35rem;
        font-size: 0.8rem;
        color: var(--color-muted);
        line-height: 1.4;
      }
    `,
  ],
})
export class RepoPatternsComponent {
  readonly patterns = REPO_PATTERNS;
}
