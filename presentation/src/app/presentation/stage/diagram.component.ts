import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import {
  AUTH_LAYERS,
  CONCEPTS,
  MODULES,
  PLUGINS,
  REPO_PATTERNS,
  REQUEST_STOPS,
  StageKind,
} from '../../core/presentation.model';

@Component({
  selector: 'app-diagram',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="diagram anim-rise" [attr.data-kind]="kind()">
      @switch (kind()) {
        @case ('intro') {
          <div class="hero-card">
            <div class="eyebrow">CineTrack API</div>
            <div class="hero-title">Fastify · MongoDB · TMDb</div>
            <div class="flow">
              <span>Client</span><i></i><span>Fastify</span><i></i><span>Modules</span><i></i><span>Data</span>
            </div>
          </div>
        }
        @case ('goals') {
          <div class="goal-grid">
            @for (g of goals; track g; let i = $index) {
              <div class="goal" [class.on]="true">
                <span class="num">0{{ i + 1 }}</span>
                <span>{{ g }}</span>
              </div>
            }
          </div>
        }
        @case ('boot') {
          <div class="boot">
            @for (s of bootSteps; track s; let i = $index) {
              <div class="boot-step" [class.on]="(highlight() ?? 0) >= i" [class.current]="highlight() === i">
                <span class="orb"></span>
                <span>{{ s }}</span>
              </div>
              @if (i < bootSteps.length - 1) {
                <div class="boot-line" [class.on]="(highlight() ?? 0) > i"></div>
              }
            }
          </div>
        }
        @case ('plugins') {
          <div class="cards">
            @for (p of plugins; track p.id; let i = $index) {
              <div
                class="card"
                [class.active]="highlight() === i"
                [class.dim]="highlight() != null && highlight()! >= 0 && highlight() !== i"
              >
                <div class="card-title">{{ p.label }}</div>
                <div class="card-body">{{ p.role }}</div>
              </div>
            }
          </div>
        }
        @case ('modules') {
          <div class="mod-grid">
            @for (m of modules; track m.id; let i = $index) {
              <div class="mod" [class.active]="highlight() === i || highlight() === -1">
                <div class="mod-name">{{ m.label }}</div>
                <div class="mod-path">{{ m.path }}</div>
              </div>
            }
          </div>
        }
        @case ('layers') {
          <div class="layers">
            @for (l of layers; track l.id; let i = $index) {
              <div class="layer" [class.on]="(highlight() ?? 0) >= i" [class.current]="highlight() === i">
                <div class="layer-idx">{{ i + 1 }}</div>
                <div>
                  <div class="layer-title">{{ l.label }}</div>
                  <div class="layer-file">{{ l.file }}</div>
                  <div class="layer-detail">{{ l.detail }}</div>
                </div>
              </div>
            }
          </div>
        }
        @case ('request') {
          <div class="req">
            @for (s of stops; track s.label; let i = $index) {
              <div class="stop" [class.on]="(highlight() ?? 0) >= i" [class.current]="highlight() === i">
                <div class="stop-dot"></div>
                <div class="stop-label">{{ s.label }}</div>
                <div class="stop-detail">{{ s.detail }}</div>
              </div>
            }
          </div>
        }
        @case ('concepts') {
          <div class="concepts">
            @for (c of concepts; track c.label; let i = $index) {
              <div class="concept" [class.active]="highlight() === i">
                <div class="concept-label">{{ c.label }}</div>
                <div class="concept-detail">{{ c.detail }}</div>
              </div>
            }
          </div>
        }
        @case ('repos') {
          <div class="repo-grid">
            @for (r of repos; track r.label; let i = $index) {
              <div class="repo" [class.active]="highlight() === i || highlight() === -1" [style.--tone]="r.tone">
                <div class="repo-title">{{ r.label }}</div>
                <div class="repo-detail">{{ r.detail }}</div>
              </div>
            }
          </div>
        }
        @case ('overview') {
          <div class="overview">
            @for (item of overview; track item; let last = $last) {
              <div class="ov-item">{{ item }}</div>
              @if (!last) {
                <div class="ov-arrow">→</div>
              }
            }
          </div>
        }
        @case ('compare') {
          <div class="compare">
            <div class="col">
              <h3>Express</h3>
              <p>Middleware chains</p>
              <p>Manual organization</p>
              <p class="soft">Docs bolted on later</p>
            </div>
            <div class="vs">vs</div>
            <div class="col accent">
              <h3>Fastify</h3>
              <p>Plugins + encapsulation</p>
              <p>Built-in schema validation</p>
              <p>Swagger from the same schemas</p>
              <p>Performance by default</p>
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
        min-height: 0;
      }

      .diagram {
        height: 100%;
        border: 1px solid var(--color-border);
        border-radius: 12px;
        background:
          radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124, 156, 255, 0.08), transparent 55%),
          var(--color-panel);
        padding: 1.25rem;
        overflow: auto;
      }

      .hero-card {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 1rem;
        padding: 1rem;
      }

      .eyebrow {
        font-family: var(--font-mono);
        font-size: 0.7rem;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--color-accent);
      }

      .hero-title {
        font-size: clamp(1.6rem, 3vw, 2.2rem);
        font-weight: 600;
        letter-spacing: -0.03em;
      }

      .flow {
        display: flex;
        align-items: center;
        gap: 0.55rem;
        flex-wrap: wrap;
        color: var(--color-muted);
        font-size: 0.85rem;
      }

      .flow span {
        padding: 0.35rem 0.65rem;
        border-radius: 8px;
        border: 1px solid var(--color-border);
        background: var(--color-panel-2);
        color: var(--color-text);
      }

      .flow i {
        width: 18px;
        height: 1px;
        background: var(--color-border-strong);
      }

      .goal-grid,
      .cards,
      .mod-grid,
      .repo-grid {
        display: grid;
        gap: 0.55rem;
      }

      .goal-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .goal,
      .card,
      .mod,
      .repo,
      .concept,
      .layer,
      .stop {
        border: 1px solid var(--color-border);
        background: var(--color-panel-2);
        border-radius: 10px;
        padding: 0.8rem 0.9rem;
        transition:
          border-color 0.25s ease,
          opacity 0.25s ease,
          transform 0.25s ease;
      }

      .goal {
        display: flex;
        align-items: center;
        gap: 0.65rem;
        font-weight: 500;
      }

      .num {
        font-family: var(--font-mono);
        font-size: 0.7rem;
        color: var(--color-accent);
      }

      .cards {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .card.active,
      .mod.active,
      .repo.active,
      .concept.active,
      .layer.current,
      .stop.current,
      .boot-step.current {
        border-color: var(--color-accent);
        box-shadow: 0 0 0 1px rgba(124, 156, 255, 0.25);
      }

      .card.dim {
        opacity: 0.4;
      }

      .card-title,
      .mod-name,
      .repo-title,
      .concept-label,
      .layer-title,
      .stop-label {
        font-weight: 600;
        font-size: 0.92rem;
      }

      .card-body,
      .mod-path,
      .repo-detail,
      .concept-detail,
      .layer-detail,
      .stop-detail,
      .layer-file {
        margin-top: 0.25rem;
        font-size: 0.75rem;
        color: var(--color-muted);
        line-height: 1.4;
      }

      .layer-file {
        font-family: var(--font-mono);
        color: var(--color-accent-2);
      }

      .mod-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .boot {
        display: flex;
        flex-direction: column;
        gap: 0;
        justify-content: center;
        height: 100%;
        max-width: 420px;
        margin: 0 auto;
      }

      .boot-step {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.65rem 0.75rem;
        border-radius: 10px;
        border: 1px solid transparent;
        opacity: 0.35;
      }

      .boot-step.on {
        opacity: 1;
      }

      .orb {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--color-border-strong);
      }

      .boot-step.on .orb {
        background: var(--color-accent);
        box-shadow: 0 0 12px rgba(124, 156, 255, 0.5);
      }

      .boot-line {
        width: 2px;
        height: 14px;
        margin-left: 1.15rem;
        background: var(--color-border);
      }

      .boot-line.on {
        background: var(--color-accent);
      }

      .layers,
      .concepts {
        display: flex;
        flex-direction: column;
        gap: 0.45rem;
      }

      .layer {
        display: grid;
        grid-template-columns: 1.6rem 1fr;
        gap: 0.7rem;
        opacity: 0.3;
      }

      .layer.on {
        opacity: 1;
      }

      .layer-idx {
        font-family: var(--font-mono);
        color: var(--color-accent);
        padding-top: 0.1rem;
      }

      .req {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.5rem;
      }

      .stop {
        opacity: 0.35;
      }

      .stop.on {
        opacity: 1;
      }

      .stop-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--color-border-strong);
        margin-bottom: 0.4rem;
      }

      .stop.on .stop-dot {
        background: var(--color-accent);
      }

      .stop.current .stop-dot {
        background: var(--color-accent-2);
        box-shadow: 0 0 10px rgba(94, 234, 212, 0.5);
      }

      .repo-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .repo {
        border-color: color-mix(in oklab, var(--tone) 45%, var(--color-border));
      }

      .overview {
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 0.4rem 0.35rem;
        align-content: center;
      }

      .ov-item {
        padding: 0.55rem 0.8rem;
        border-radius: 999px;
        border: 1px solid var(--color-border);
        background: var(--color-panel-2);
        font-size: 0.8rem;
        font-weight: 500;
      }

      .ov-arrow {
        color: var(--color-faint);
        font-size: 0.8rem;
      }

      .compare {
        height: 100%;
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        gap: 1rem;
        align-items: stretch;
      }

      .col {
        padding: 1rem;
        border-radius: 12px;
        border: 1px solid var(--color-border);
        background: var(--color-panel-2);
      }

      .col.accent {
        border-color: rgba(124, 156, 255, 0.45);
        background: rgba(124, 156, 255, 0.06);
      }

      .col h3 {
        margin: 0 0 0.75rem;
        font-size: 1.15rem;
      }

      .col p {
        margin: 0;
        padding: 0.45rem 0;
        border-top: 1px solid var(--color-border);
        font-size: 0.85rem;
      }

      .col p.soft {
        color: var(--color-muted);
      }

      .vs {
        align-self: center;
        font-family: var(--font-mono);
        font-size: 0.7rem;
        color: var(--color-faint);
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      @media (max-width: 700px) {
        .goal-grid,
        .cards,
        .mod-grid,
        .repo-grid,
        .req,
        .compare {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class DiagramComponent {
  readonly kind = input.required<StageKind>();
  readonly highlight = input<number | undefined>();

  readonly plugins = PLUGINS;
  readonly modules = MODULES;
  readonly layers = AUTH_LAYERS;
  readonly stops = REQUEST_STOPS;
  readonly concepts = CONCEPTS;
  readonly repos = REPO_PATTERNS;
  readonly goals = ['Fast', 'Secure', 'Modular', 'Maintainable', 'Documented', 'Scalable'];
  readonly bootSteps = ['buildApp()', 'registerPlugins()', 'registerModules()', 'connectDatabase()', 'listen()'];
  readonly overview = [
    'Browser',
    'Fastify',
    'Plugins',
    'Modules',
    'Controllers',
    'Services',
    'Repositories',
    'MongoDB',
    'TMDb',
  ];
}
