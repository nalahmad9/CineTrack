import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { MODULES } from '../../core/presentation.model';
import { PresentationService } from '../../core/presentation.service';

@Component({
  selector: 'app-module-ring',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="board">
      <div class="label">Feature modules · /api/v1</div>
      <div class="grid">
        @for (m of modules; track m.id; let i = $index) {
          <button
            type="button"
            class="slate"
            [class.expanded]="expanded() === m.id"
            [class.dim]="expanded() && expanded() !== m.id"
            [style.--tone]="m.color"
            (click)="expand(m.id); $event.stopPropagation()"
          >
            <span class="code">{{ pad(i + 1) }}</span>
            <span class="name">{{ m.label }}</span>
          </button>
        }
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        pointer-events: auto;
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
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: 0.5rem;
      }

      .slate {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.3rem;
        padding: 0.75rem 0.7rem;
        border: 1px solid color-mix(in oklab, var(--tone) 40%, #3a332a);
        background: color-mix(in oklab, var(--tone) 12%, #141210);
        color: var(--color-cream);
        cursor: pointer;
        text-align: left;
        border-radius: 2px;
        transition:
          opacity 0.25s ease,
          transform 0.25s ease;
      }

      .slate:hover,
      .slate.expanded {
        transform: translateY(-3px);
      }

      .slate.dim {
        opacity: 0.3;
      }

      .code {
        font-family: var(--font-mono);
        font-size: 0.55rem;
        letter-spacing: 0.12em;
        color: var(--tone);
      }

      .name {
        font-family: var(--font-display);
        font-size: 1.05rem;
        letter-spacing: 0.04em;
      }

      @media (max-width: 800px) {
        .grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
    `,
  ],
})
export class ModuleRingComponent {
  readonly modules = MODULES;
  private readonly presentation = inject(PresentationService);
  readonly expanded = computed(() => this.presentation.world().expandedModule);

  expand(id: string): void {
    this.presentation.world.update((w) => ({
      ...w,
      expandedModule: w.expandedModule === id ? null : id,
    }));
  }

  pad(n: number): string {
    return n.toString().padStart(2, '0');
  }
}
