import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { PresentationService } from '../../core/presentation.service';

const REQUIREMENTS = ['Fast', 'Secure', 'Modular', 'Maintainable', 'Documented', 'Scalable'];

@Component({
  selector: 'app-requirements-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="field" [class.merged]="merged()">
      <div class="row">
        @for (req of requirements; track req; let i = $index) {
          <div class="chip" [class.on]="revealedCount() > i">
            <span class="n">{{ i + 1 }}</span>
            <span>{{ req }}</span>
          </div>
        }
      </div>
      @if (merged()) {
        <div class="locked film-panel">Architecture Blueprint</div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        pointer-events: none;
      }

      .field {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.25rem;
      }

      .row {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.55rem;
        max-width: 720px;
      }

      .chip {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        padding: 0.65rem 0.9rem;
        border: 1px solid rgba(240, 164, 58, 0.25);
        background: rgba(18, 16, 14, 0.85);
        font-family: var(--font-display);
        font-size: 1.05rem;
        letter-spacing: 0.05em;
        color: var(--color-cream);
        opacity: 0.2;
        transform: translateY(8px);
        transition:
          opacity 0.35s ease,
          transform 0.35s ease,
          border-color 0.35s ease;
      }

      .chip.on {
        opacity: 1;
        transform: translateY(0);
      }

      .n {
        font-family: var(--font-mono);
        font-size: 0.62rem;
        color: var(--color-amber);
      }

      .merged .chip.on {
        opacity: 0.35;
      }

      .locked {
        padding: 0.75rem 1.2rem;
        font-family: var(--font-mono);
        font-size: 0.72rem;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--color-projector);
      }
    `,
  ],
})
export class RequirementsFieldComponent {
  private readonly presentation = inject(PresentationService);
  readonly requirements = REQUIREMENTS;

  readonly merged = computed(() => this.presentation.world().requirementsMerged);

  readonly revealedCount = computed(() => {
    const beat = this.presentation.beat();
    if (this.merged()) return REQUIREMENTS.length;
    const map: Record<string, number> = {
      'a1-fast': 1,
      'a1-secure': 2,
      'a1-modular': 3,
      'a1-maintainable': 4,
      'a1-documented': 5,
      'a1-scalable': 6,
      'a1-blueprint': 6,
    };
    return map[beat.id] ?? 0;
  });
}
