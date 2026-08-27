import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-architecture-stack',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rail">
      @for (item of items; track item; let last = $last) {
        <div class="item">{{ item }}</div>
        @if (!last) {
          <div class="arrow">↓</div>
        }
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        pointer-events: none;
      }

      .rail {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 0.35rem 0.45rem;
        max-width: 760px;
      }

      .item {
        padding: 0.45rem 0.7rem;
        border: 1px solid rgba(240, 164, 58, 0.25);
        background: rgba(18, 16, 14, 0.85);
        font-family: var(--font-display);
        font-size: 0.95rem;
        letter-spacing: 0.04em;
      }

      .arrow {
        color: var(--color-muted);
        font-size: 0.75rem;
      }
    `,
  ],
})
export class ArchitectureStackComponent {
  readonly items = [
    'Browser',
    'Fastify',
    'Infrastructure',
    'Modules',
    'Controllers',
    'Services',
    'Repositories',
    'MongoDB',
    'TMDb',
  ];
}
