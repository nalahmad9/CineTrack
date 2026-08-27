import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  computed,
  effect,
  inject,
  viewChild,
} from '@angular/core';

import { CameraDirectorService } from '../../core/camera-director.service';
import {
  AUTH_LAYERS,
  CONCEPTS,
  MODULES,
  PLUGINS,
  REPO_PATTERNS,
  REQUEST_STOPS,
} from '../../core/presentation.model';
import { PresentationService } from '../../core/presentation.service';
import { FloatingCodeComponent } from './floating-code.component';

@Component({
  selector: 'app-world-stage',
  standalone: true,
  imports: [FloatingCodeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="viewport">
      <div class="atmosphere"></div>
      <div class="grid"></div>

      <div #world class="world">
        @switch (stage()) {
          @case ('intro') {
            <div class="scene intro">
              <div class="brand-mark">CineTrack</div>
              <p class="lede">{{ body() }}</p>
              @if (points().length) {
                <div class="chips">
                  @for (p of points(); track p.title) {
                    <div class="chip">
                      <strong>{{ p.title }}</strong>
                      <span>{{ p.body }}</span>
                    </div>
                  }
                </div>
              }
            </div>
          }
          @case ('goals') {
            <div class="scene goals">
              <div class="constellation">
                @for (g of goals; track g; let i = $index) {
                  <div class="node" [style.--i]="i">
                    <span class="orb"></span>
                    <span class="label">{{ g }}</span>
                  </div>
                }
                <div class="core-ghost" [style.--power]="power()"></div>
              </div>
            </div>
          }
          @case ('boot') {
            <div class="scene boot">
              <div class="server" [style.--power]="power()">
                <div class="ring"></div>
                <div class="lamp"></div>
                <div class="name">CineTrack</div>
                <div class="status">{{ bootLabel() }}</div>
              </div>
              <div class="boot-rail">
                @for (s of bootSteps; track s; let i = $index) {
                  <div class="boot-item" [class.on]="(highlight() ?? 0) >= i" [class.now]="highlight() === i">
                    {{ s }}
                  </div>
                }
              </div>
            </div>
          }
          @case ('plugins') {
            <div class="scene plugins">
              <div class="halo-core" [style.--power]="power()">
                <span>Fastify</span>
              </div>
              <div class="halo">
                @for (p of plugins; track p.id; let i = $index) {
                  <div
                    class="plug"
                    [style.--i]="i"
                    [style.--n]="plugins.length"
                    [class.active]="highlight() === i"
                    [class.dim]="highlight() != null && highlight()! >= 0 && highlight() !== i"
                  >
                    <strong>{{ p.label }}</strong>
                    <span>{{ p.role }}</span>
                  </div>
                }
              </div>
            </div>
          }
          @case ('modules') {
            <div class="scene modules">
              <div class="skyline">
                @for (m of modules; track m.id; let i = $index) {
                  <div
                    class="tower"
                    [style.--h]="40 + ((i * 17) % 50)"
                    [class.active]="highlight() === i || highlight() === -1"
                    [class.focus]="highlight() === i"
                  >
                    <div class="tower-body"></div>
                    <div class="tower-label">{{ m.label }}</div>
                    <div class="tower-path">{{ m.path }}</div>
                  </div>
                }
              </div>
            </div>
          }
          @case ('layers') {
            <div class="scene layers">
              <div class="shaft">
                @for (l of layers; track l.id; let i = $index) {
                  <div class="floor" [class.on]="(highlight() ?? 0) >= i" [class.now]="highlight() === i">
                    <div class="floor-idx">0{{ i + 1 }}</div>
                    <div>
                      <div class="floor-title">{{ l.label }}</div>
                      <div class="floor-file">{{ l.file }}</div>
                      <div class="floor-detail">{{ l.detail }}</div>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
          @case ('request') {
            <div class="scene request">
              <svg class="path-svg" viewBox="0 0 800 220" preserveAspectRatio="none">
                <path
                  class="track"
                  d="M40 110 C 140 110, 160 40, 260 40 S 380 180, 480 180 S 620 40, 760 110"
                  fill="none"
                />
                <circle
                  class="hero"
                  r="10"
                  [attr.cx]="heroX()"
                  [attr.cy]="heroY()"
                />
              </svg>
              <div class="stops">
                @for (s of stops; track s.label; let i = $index) {
                  <div class="stop" [class.on]="(highlight() ?? 0) >= i" [class.now]="highlight() === i">
                    <strong>{{ s.label }}</strong>
                    <span>{{ s.detail }}</span>
                  </div>
                }
              </div>
            </div>
          }
          @case ('concepts') {
            <div class="scene concepts">
              @for (c of concepts; track c.label; let i = $index) {
                <div class="concept" [class.active]="highlight() === i" [style.--i]="i">
                  <strong>{{ c.label }}</strong>
                  <span>{{ c.detail }}</span>
                </div>
              }
            </div>
          }
          @case ('repos') {
            <div class="scene repos">
              @for (r of repos; track r.label; let i = $index) {
                <div
                  class="port"
                  [style.--tone]="r.tone"
                  [class.active]="highlight() === i || highlight() === -1"
                  [class.focus]="highlight() === i"
                >
                  <div class="port-glow"></div>
                  <strong>{{ r.label }}</strong>
                  <span>{{ r.detail }}</span>
                </div>
              }
            </div>
          }
          @case ('overview') {
            <div class="scene overview">
              <div class="map">
                @for (item of overview; track item; let last = $last) {
                  <div class="map-node">{{ item }}</div>
                  @if (!last) {
                    <div class="map-link"></div>
                  }
                }
              </div>
              @if (points().length) {
                <div class="chips compact">
                  @for (p of points(); track p.title) {
                    <div class="chip">
                      <strong>{{ p.title }}</strong>
                      <span>{{ p.body }}</span>
                    </div>
                  }
                </div>
              }
            </div>
          }
          @case ('compare') {
            <div class="scene compare">
              <div class="duel express">
                <h3>Express</h3>
                <p>Middleware chains</p>
                <p>Manual organization</p>
                <p class="soft">Docs bolted on</p>
              </div>
              <div class="versus">vs</div>
              <div class="duel fastify">
                <h3>Fastify</h3>
                <p>Plugins + encapsulation</p>
                <p>Built-in schema validation</p>
                <p>Swagger from schemas</p>
                <p>Performance by default</p>
              </div>
            </div>
          }
        }
      </div>

      <app-floating-code [snippet]="snippet()" [side]="codeSide()" />
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        position: absolute;
        inset: 0;
        overflow: hidden;
      }

      .viewport {
        position: absolute;
        inset: 0;
        perspective: 1600px;
      }

      .atmosphere {
        position: absolute;
        inset: 0;
        background:
          radial-gradient(ellipse 70% 50% at 50% 40%, rgba(255, 77, 109, 0.12), transparent 55%),
          radial-gradient(ellipse 50% 40% at 80% 80%, rgba(61, 255, 224, 0.08), transparent 50%),
          linear-gradient(180deg, #0a0a10 0%, #07070a 100%);
      }

      .grid {
        position: absolute;
        inset: 0;
        background-image:
          linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
        background-size: 64px 64px;
        mask-image: radial-gradient(ellipse at center, black 20%, transparent 75%);
        opacity: 0.5;
        pointer-events: none;
      }

      .world {
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        transform: translate3d(var(--cam-x, 0px), var(--cam-y, 0px), 0)
          scale(var(--cam-scale, 1));
        transform-origin: 50% 45%;
        will-change: transform;
        --cam-x: 0px;
        --cam-y: 0px;
        --cam-scale: 1;
        padding: 6rem 2rem 7rem;
      }

      .scene {
        width: min(980px, 94vw);
        position: relative;
      }

      .intro .brand-mark {
        font-family: var(--font-display);
        font-size: clamp(1rem, 2vw, 1.2rem);
        letter-spacing: 0.35em;
        text-transform: uppercase;
        color: var(--color-coral);
        margin-bottom: 1rem;
      }

      .lede {
        margin: 0;
        max-width: 36rem;
        color: var(--color-mute);
        font-size: 1.05rem;
        line-height: 1.55;
      }

      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 0.65rem;
        margin-top: 1.5rem;
      }

      .chips.compact {
        justify-content: center;
        margin-top: 2rem;
      }

      .chip {
        max-width: 220px;
        padding: 0.75rem 0.9rem;
        border-radius: 14px;
        border: 1px solid var(--color-line);
        background: rgba(255, 255, 255, 0.03);
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        animation: floaty 5s ease-in-out infinite;
      }

      .chip strong {
        font-size: 0.78rem;
        color: var(--color-mint);
      }

      .chip span {
        font-size: 0.75rem;
        color: var(--color-mute);
        line-height: 1.35;
      }

      .constellation {
        position: relative;
        width: min(520px, 80vw);
        height: min(520px, 80vw);
        margin: 0 auto;
      }

      .node {
        position: absolute;
        left: 50%;
        top: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.35rem;
        transform: rotate(calc(var(--i) * 60deg)) translateY(-190px)
          rotate(calc(var(--i) * -60deg)) translate(-50%, -50%);
      }

      .orb {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: var(--color-coral);
        box-shadow: 0 0 18px rgba(255, 77, 109, 0.65);
      }

      .node .label {
        font-family: var(--font-display);
        font-size: 1.15rem;
        font-weight: 600;
      }

      .core-ghost {
        position: absolute;
        inset: 35%;
        border-radius: 50%;
        border: 1px dashed rgba(61, 255, 224, 0.35);
        opacity: calc(0.3 + var(--power) * 0.7);
      }

      .boot {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2.5rem;
        align-items: center;
      }

      .server {
        width: 220px;
        height: 220px;
        margin: 0 auto;
        border-radius: 50%;
        border: 1px solid rgba(61, 255, 224, calc(0.2 + var(--power) * 0.5));
        display: grid;
        place-items: center;
        position: relative;
        background: rgba(14, 14, 20, 0.9);
        box-shadow: 0 0 60px rgba(255, 77, 109, calc(var(--power) * 0.35));
      }

      .ring {
        position: absolute;
        inset: -12px;
        border-radius: 50%;
        border: 1px dashed rgba(255, 77, 109, 0.35);
        animation: pulse-soft 3s ease-in-out infinite;
      }

      .lamp {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        background: radial-gradient(circle at 35% 30%, #fff, var(--color-coral) 45%, #3a1018 100%);
        opacity: calc(0.2 + var(--power) * 0.8);
        box-shadow: 0 0 40px rgba(255, 77, 109, calc(var(--power) * 0.6));
      }

      .name {
        position: absolute;
        bottom: 42px;
        font-family: var(--font-display);
        font-size: 1.1rem;
      }

      .status {
        position: absolute;
        bottom: 22px;
        font-family: var(--font-mono);
        font-size: 0.58rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--color-mint);
      }

      .boot-rail {
        display: flex;
        flex-direction: column;
        gap: 0.45rem;
      }

      .boot-item {
        padding: 0.7rem 0.9rem;
        border-radius: 12px;
        border: 1px solid var(--color-line);
        color: var(--color-mute);
        opacity: 0.35;
        font-family: var(--font-mono);
        font-size: 0.8rem;
      }

      .boot-item.on {
        opacity: 1;
        color: var(--color-fog);
      }

      .boot-item.now {
        border-color: var(--color-coral);
        background: rgba(255, 77, 109, 0.08);
      }

      .plugins {
        min-height: 460px;
      }

      .halo-core {
        position: absolute;
        left: 50%;
        top: 50%;
        translate: -50% -50%;
        width: 110px;
        height: 110px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        border: 1px solid rgba(61, 255, 224, 0.4);
        background: rgba(10, 12, 18, 0.95);
        box-shadow: 0 0 40px rgba(61, 255, 224, calc(var(--power) * 0.35));
        font-family: var(--font-display);
        font-size: 1.05rem;
        z-index: 2;
      }

      .halo {
        position: relative;
        width: 100%;
        height: 460px;
      }

      .plug {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 120px;
        padding: 0.65rem 0.55rem;
        border-radius: 14px;
        border: 1px solid var(--color-line);
        background: rgba(14, 14, 22, 0.92);
        text-align: center;
        transform: rotate(calc(var(--i) * (360deg / var(--n)))) translate(190px)
          rotate(calc(var(--i) * (-360deg / var(--n)))) translate(-50%, -50%);
        transition:
          opacity 0.35s ease,
          border-color 0.35s ease,
          transform 0.45s ease;
      }

      .plug strong {
        display: block;
        font-size: 0.82rem;
      }

      .plug span {
        display: block;
        margin-top: 0.2rem;
        font-size: 0.65rem;
        color: var(--color-mute);
        line-height: 1.3;
      }

      .plug.active {
        border-color: var(--color-coral);
        box-shadow: 0 0 24px rgba(255, 77, 109, 0.3);
        transform: rotate(calc(var(--i) * (360deg / var(--n)))) translate(190px)
          rotate(calc(var(--i) * (-360deg / var(--n)))) translate(-50%, -50%) scale(1.08);
      }

      .plug.dim {
        opacity: 0.3;
      }

      .skyline {
        display: flex;
        align-items: flex-end;
        justify-content: center;
        gap: 0.45rem;
        min-height: 320px;
        padding-top: 2rem;
      }

      .tower {
        width: 78px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.35rem;
        opacity: 0.35;
        transition:
          opacity 0.3s ease,
          transform 0.35s ease;
      }

      .tower.active {
        opacity: 1;
      }

      .tower.focus {
        transform: translateY(-10px);
      }

      .tower-body {
        width: 100%;
        height: calc(var(--h) * 1px + 120px);
        border-radius: 10px 10px 4px 4px;
        border: 1px solid rgba(61, 255, 224, 0.25);
        background: linear-gradient(180deg, rgba(255, 77, 109, 0.2), rgba(14, 14, 22, 0.95));
        box-shadow: inset 0 0 20px rgba(61, 255, 224, 0.08);
      }

      .tower.focus .tower-body {
        border-color: var(--color-coral);
        box-shadow: 0 0 28px rgba(255, 77, 109, 0.35);
      }

      .tower-label {
        font-family: var(--font-display);
        font-size: 0.85rem;
      }

      .tower-path {
        font-family: var(--font-mono);
        font-size: 0.55rem;
        color: var(--color-mute);
      }

      .shaft {
        display: flex;
        flex-direction: column;
        gap: 0.45rem;
        max-width: 460px;
        margin: 0 auto;
      }

      .floor {
        display: grid;
        grid-template-columns: 2.2rem 1fr;
        gap: 0.85rem;
        padding: 0.85rem 1rem;
        border-radius: 14px;
        border: 1px solid var(--color-line);
        background: rgba(14, 14, 22, 0.85);
        opacity: 0.25;
        transform: translateX(-12px);
        transition:
          opacity 0.35s ease,
          transform 0.35s ease,
          border-color 0.3s ease;
      }

      .floor.on {
        opacity: 1;
        transform: none;
      }

      .floor.now {
        border-color: var(--color-mint);
        box-shadow: 0 0 24px rgba(61, 255, 224, 0.15);
      }

      .floor-idx {
        font-family: var(--font-mono);
        color: var(--color-coral);
        padding-top: 0.15rem;
      }

      .floor-title {
        font-family: var(--font-display);
        font-size: 1.2rem;
      }

      .floor-file {
        font-family: var(--font-mono);
        font-size: 0.68rem;
        color: var(--color-mint);
        margin-top: 0.15rem;
      }

      .floor-detail {
        font-size: 0.75rem;
        color: var(--color-mute);
        margin-top: 0.2rem;
      }

      .request {
        width: min(900px, 94vw);
      }

      .path-svg {
        width: 100%;
        height: 140px;
        overflow: visible;
      }

      .track {
        stroke: rgba(61, 255, 224, 0.35);
        stroke-width: 2;
        stroke-dasharray: 8 8;
        animation: dash-move 1s linear infinite;
      }

      .hero {
        fill: var(--color-coral);
        filter: drop-shadow(0 0 10px rgba(255, 77, 109, 0.8));
        transition: cx 0.7s cubic-bezier(0.22, 1, 0.36, 1), cy 0.7s cubic-bezier(0.22, 1, 0.36, 1);
      }

      .stops {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 0.5rem;
        margin-top: 0.5rem;
      }

      .stop {
        padding: 0.65rem 0.7rem;
        border-radius: 12px;
        border: 1px solid var(--color-line);
        background: rgba(14, 14, 22, 0.8);
        opacity: 0.3;
      }

      .stop.on {
        opacity: 1;
      }

      .stop.now {
        border-color: var(--color-coral);
      }

      .stop strong {
        display: block;
        font-size: 0.82rem;
      }

      .stop span {
        display: block;
        margin-top: 0.2rem;
        font-size: 0.68rem;
        color: var(--color-mute);
        line-height: 1.3;
      }

      .concepts {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.55rem;
      }

      .concept {
        padding: 0.85rem 0.95rem;
        border-radius: 14px;
        border: 1px solid var(--color-line);
        background: rgba(14, 14, 22, 0.85);
        opacity: 0.45;
        transition:
          opacity 0.3s ease,
          border-color 0.3s ease,
          transform 0.3s ease;
      }

      .concept.active {
        opacity: 1;
        border-color: var(--color-mint);
        transform: translateY(-3px);
      }

      .concept strong {
        display: block;
        font-family: var(--font-mono);
        font-size: 0.85rem;
        color: var(--color-mint);
      }

      .concept span {
        display: block;
        margin-top: 0.3rem;
        font-size: 0.75rem;
        color: var(--color-mute);
      }

      .repos {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.75rem;
      }

      .port {
        position: relative;
        overflow: hidden;
        padding: 1.1rem 1.15rem;
        border-radius: 16px;
        border: 1px solid color-mix(in oklab, var(--tone) 45%, transparent);
        background: rgba(14, 14, 22, 0.9);
        opacity: 0.4;
      }

      .port.active {
        opacity: 1;
      }

      .port.focus {
        transform: scale(1.02);
        box-shadow: 0 0 30px color-mix(in oklab, var(--tone) 30%, transparent);
      }

      .port-glow {
        position: absolute;
        inset: auto 0 0 0;
        height: 2px;
        background: var(--tone);
      }

      .port strong {
        display: block;
        font-family: var(--font-display);
        font-size: 1.25rem;
      }

      .port span {
        display: block;
        margin-top: 0.35rem;
        color: var(--color-mute);
        font-size: 0.8rem;
      }

      .overview .map {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 0.35rem;
      }

      .map-node {
        padding: 0.55rem 0.85rem;
        border-radius: 999px;
        border: 1px solid rgba(61, 255, 224, 0.3);
        background: rgba(14, 14, 22, 0.9);
        font-size: 0.82rem;
        font-weight: 500;
      }

      .map-link {
        width: 18px;
        height: 2px;
        background: linear-gradient(90deg, var(--color-coral), var(--color-mint));
      }

      .compare {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        gap: 1.25rem;
        align-items: stretch;
      }

      .duel {
        padding: 1.25rem;
        border-radius: 18px;
        border: 1px solid var(--color-line);
        background: rgba(14, 14, 22, 0.9);
      }

      .duel.fastify {
        border-color: rgba(61, 255, 224, 0.4);
        box-shadow: 0 0 40px rgba(61, 255, 224, 0.08);
      }

      .duel h3 {
        margin: 0 0 0.85rem;
        font-family: var(--font-display);
        font-size: 1.6rem;
      }

      .duel.fastify h3 {
        color: var(--color-mint);
      }

      .duel p {
        margin: 0;
        padding: 0.5rem 0;
        border-top: 1px solid var(--color-line);
        font-size: 0.9rem;
      }

      .duel p.soft {
        color: var(--color-mute);
      }

      .versus {
        align-self: center;
        font-family: var(--font-mono);
        font-size: 0.7rem;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: var(--color-mute);
      }

      @media (max-width: 900px) {
        .boot,
        .compare,
        .stops,
        .concepts,
        .repos {
          grid-template-columns: 1fr;
        }

        .skyline {
          flex-wrap: wrap;
          min-height: auto;
        }

        .plug {
          position: relative;
          left: auto;
          top: auto;
          transform: none !important;
          width: auto;
          margin-bottom: 0.4rem;
        }

        .halo {
          height: auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.4rem;
          padding-top: 5rem;
        }

        .halo-core {
          top: 0;
          translate: -50% 0;
        }
      }
    `,
  ],
})
export class WorldStageComponent implements AfterViewInit, OnDestroy {
  private readonly presentation = inject(PresentationService);
  private readonly camera = inject(CameraDirectorService);
  private readonly worldRef = viewChild.required<ElementRef<HTMLElement>>('world');

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
    'Repos',
    'MongoDB',
    'TMDb',
  ];

  readonly stage = computed(() => this.presentation.beat().stage);
  readonly highlight = computed(() => this.presentation.beat().highlight);
  readonly body = computed(() => this.presentation.beat().body);
  readonly points = computed(() => this.presentation.beat().points ?? []);
  readonly snippet = computed(() => this.presentation.beat().snippet);
  readonly codeSide = computed(() => this.presentation.beat().codeSide ?? 'right');
  readonly power = computed(() => this.presentation.beat().corePower ?? 0);

  readonly bootLabel = computed(() => {
    const h = this.highlight() ?? 0;
    return this.bootSteps[Math.min(h, this.bootSteps.length - 1)] ?? 'Booting';
  });

  /** Approximate positions along the SVG curve for the request hero. */
  readonly heroX = computed(() => {
    const xs = [40, 150, 260, 370, 480, 590, 680, 760];
    return xs[Math.max(0, Math.min(7, this.highlight() ?? 0))];
  });

  readonly heroY = computed(() => {
    const ys = [110, 80, 40, 110, 180, 140, 70, 110];
    return ys[Math.max(0, Math.min(7, this.highlight() ?? 0))];
  });

  constructor() {
    effect(() => {
      const pose = this.presentation.beat().camera;
      this.camera.moveTo(pose);
    });
  }

  ngAfterViewInit(): void {
    this.camera.attach(this.worldRef().nativeElement);
    this.camera.moveTo(this.presentation.beat().camera, 0);
  }

  ngOnDestroy(): void {
    this.camera.detach();
  }
}
