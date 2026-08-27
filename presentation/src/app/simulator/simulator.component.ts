import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  inject,
} from '@angular/core';

import { AudioService } from '../core/audio.service';
import { SimPhase } from '../core/simulator.model';
import { SimulatorService } from '../core/simulator.service';
import { SimWorldComponent } from './sim-world.component';

@Component({
  selector: 'app-simulator',
  standalone: true,
  imports: [SimWorldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sim">
      <app-sim-world />

      <header class="top">
        <div class="brand">
          <span class="pulse"></span>
          <div>
            <div class="name">CineTrack</div>
            <div class="mode">Backend Architecture Simulator</div>
          </div>
        </div>
        <div class="cmd">
          <span class="cmd-label">{{ phase().command }}</span>
          <button type="button" (click)="audio.toggle()">{{ audio.enabled() ? 'AUD' : 'MUT' }}</button>
          <button type="button" (click)="sim.back()" [disabled]="sim.isFirst()">UNDO</button>
          <button type="button" class="exec" (click)="sim.command()">EXECUTE</button>
          <button type="button" (click)="sim.restart()">R</button>
        </div>
      </header>

      <aside class="terminal">
        <div class="term-title">SYS · CONSOLE</div>
        @for (line of sim.logs(); track $index) {
          <div class="line">{{ line }}</div>
        }
      </aside>

      <section class="focus-card">
        <div class="phase-title">{{ phase().title }}</div>
        <h1>{{ focus().label }}</h1>
        <p>{{ focus().detail }}</p>
        <div class="hint">{{ phase().hint }}</div>
      </section>

      @if (focus().snippet; as snippet) {
        <aside class="code">
          <div class="code-bar">
            <span>{{ snippet.file }}</span>
            <span>{{ snippet.title }}</span>
          </div>
          <div class="code-body">
            @for (line of snippet.lines; track $index; let i = $index) {
              <div class="row">
                <span class="ln">{{ i + 1 }}</span>
                <span class="tx" [innerHTML]="tint(line)"></span>
              </div>
            }
          </div>
        </aside>
      }

      <nav class="phases">
        @for (p of sim.phases; track p.id) {
          <button
            type="button"
            class="pip"
            [class.active]="phase().id === p.id"
            [title]="p.title"
            (click)="jump(p.id)"
          ></button>
        }
      </nav>

      <footer class="hud-foot">
        <div class="meter">
          <span>CORE {{ powerPct() }}%</span>
          <div class="track"><div class="fill" [style.width.%]="powerPct()"></div></div>
        </div>
        <div class="keys">
          <kbd>Space</kbd> execute
          <kbd>Drag</kbd> orbit
          <kbd>Scroll</kbd> zoom
          <kbd>Click</kbd> module
        </div>
      </footer>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }

      .sim {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: #050508;
        color: #e8e8f0;
        font-family: var(--font-body);
      }

      .top {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        z-index: 20;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.25rem;
        pointer-events: none;
      }

      .top > * {
        pointer-events: auto;
      }

      .brand {
        display: flex;
        gap: 0.7rem;
        align-items: center;
      }

      .pulse {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #ff4d6d;
        box-shadow: 0 0 16px #ff4d6d;
        animation: pulse-soft 2s ease-in-out infinite;
      }

      .name {
        font-weight: 700;
        letter-spacing: -0.02em;
      }

      .mode {
        font-size: 0.68rem;
        color: #8b8ba0;
        font-family: var(--font-mono);
      }

      .cmd {
        display: flex;
        gap: 0.4rem;
        align-items: center;
      }

      .cmd-label {
        font-family: var(--font-mono);
        font-size: 0.68rem;
        color: #3dffe0;
        margin-right: 0.35rem;
        letter-spacing: 0.08em;
      }

      button {
        font-family: var(--font-mono);
        font-size: 0.68rem;
        border: 1px solid rgba(255, 255, 255, 0.12);
        background: rgba(12, 12, 18, 0.75);
        color: #e8e8f0;
        border-radius: 6px;
        padding: 0.45rem 0.7rem;
        cursor: pointer;
        backdrop-filter: blur(10px);
      }

      button:disabled {
        opacity: 0.35;
      }

      button.exec {
        background: #ff4d6d;
        border-color: #ff4d6d;
        color: #1a050a;
        font-weight: 700;
      }

      .terminal {
        position: absolute;
        left: 1rem;
        bottom: 4.5rem;
        z-index: 20;
        width: min(340px, 40vw);
        max-height: 180px;
        overflow: auto;
        padding: 0.75rem 0.85rem;
        border-radius: 12px;
        border: 1px solid rgba(61, 255, 224, 0.2);
        background: rgba(6, 8, 12, 0.82);
        backdrop-filter: blur(14px);
        font-family: var(--font-mono);
        font-size: 0.68rem;
        line-height: 1.45;
      }

      .term-title {
        color: #3dffe0;
        margin-bottom: 0.4rem;
        letter-spacing: 0.12em;
        font-size: 0.6rem;
      }

      .line {
        color: #a8a8bc;
      }

      .focus-card {
        position: absolute;
        top: 5rem;
        left: 50%;
        translate: -50% 0;
        z-index: 20;
        text-align: center;
        max-width: 28rem;
        pointer-events: none;
      }

      .phase-title {
        font-family: var(--font-mono);
        font-size: 0.62rem;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: #3dffe0;
        margin-bottom: 0.4rem;
      }

      .focus-card h1 {
        margin: 0;
        font-family: var(--font-display);
        font-size: clamp(1.6rem, 3.5vw, 2.6rem);
        line-height: 1.05;
      }

      .focus-card p {
        margin: 0.45rem 0 0;
        color: #8b8ba0;
        font-size: 0.9rem;
      }

      .hint {
        margin-top: 0.55rem;
        font-family: var(--font-mono);
        font-size: 0.65rem;
        color: #ff4d6d;
      }

      .code {
        position: absolute;
        right: 1rem;
        top: 5rem;
        z-index: 20;
        width: min(400px, 38vw);
        max-height: min(48vh, 420px);
        display: flex;
        flex-direction: column;
        border-radius: 12px;
        border: 1px solid rgba(255, 77, 109, 0.25);
        background: rgba(6, 8, 12, 0.88);
        backdrop-filter: blur(16px);
        overflow: hidden;
      }

      .code-bar {
        display: flex;
        flex-direction: column;
        gap: 0.1rem;
        padding: 0.65rem 0.8rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        font-family: var(--font-mono);
        font-size: 0.62rem;
      }

      .code-bar span:first-child {
        color: #3dffe0;
      }

      .code-bar span:last-child {
        color: #8b8ba0;
      }

      .code-body {
        overflow: auto;
        padding: 0.5rem 0;
        font-family: var(--font-mono);
        font-size: 0.66rem;
        line-height: 1.5;
      }

      .row {
        display: grid;
        grid-template-columns: 2rem 1fr;
        padding: 0 0.5rem;
      }

      .ln {
        color: #4a4a5c;
        text-align: right;
        padding-right: 0.6rem;
      }

      .tx {
        color: #d8d8e6;
        white-space: pre-wrap;
        word-break: break-word;
      }

      :host ::ng-deep .k {
        color: #ff4d6d;
      }
      :host ::ng-deep .s {
        color: #3dffe0;
      }
      :host ::ng-deep .p {
        color: #ffd60a;
      }

      .phases {
        position: absolute;
        left: 50%;
        bottom: 4.6rem;
        translate: -50% 0;
        z-index: 20;
        display: flex;
        gap: 0.4rem;
      }

      .pip {
        width: 10px;
        height: 10px;
        padding: 0;
        border-radius: 50%;
        border: 1px solid rgba(255, 255, 255, 0.25);
        background: transparent;
      }

      .pip.active {
        background: #ff4d6d;
        border-color: #ff4d6d;
        box-shadow: 0 0 10px #ff4d6d;
      }

      .hud-foot {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 20;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        padding: 0.85rem 1.25rem;
        background: linear-gradient(0deg, rgba(5, 5, 8, 0.95), transparent);
      }

      .meter {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        font-family: var(--font-mono);
        font-size: 0.65rem;
        color: #8b8ba0;
        min-width: 160px;
      }

      .track {
        width: 90px;
        height: 3px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.08);
        overflow: hidden;
      }

      .fill {
        height: 100%;
        background: linear-gradient(90deg, #ff4d6d, #3dffe0);
        transition: width 0.4s ease;
      }

      .keys {
        display: flex;
        gap: 0.45rem;
        align-items: center;
        font-size: 0.68rem;
        color: #8b8ba0;
      }

      kbd {
        font-family: var(--font-mono);
        font-size: 0.6rem;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 4px;
        padding: 0.1rem 0.3rem;
      }

      @media (max-width: 900px) {
        .code,
        .terminal,
        .keys {
          display: none;
        }
      }
    `,
  ],
})
export class SimulatorComponent {
  readonly sim = inject(SimulatorService);
  readonly audio = inject(AudioService);

  readonly phase = computed(() => this.sim.phaseMeta());
  readonly focus = computed(() => this.sim.focus());
  readonly powerPct = computed(() => Math.round(this.sim.corePower() * 100));

  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    if (e.code === 'Space') {
      e.preventDefault();
      this.sim.command();
      this.audio.play('pulse');
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      this.sim.back();
    } else if (e.key === 'r' || e.key === 'R') {
      this.sim.restart();
    }
  }

  jump(id: SimPhase): void {
    this.sim.jumpTo(id);
  }

  tint(line: string): string {
    const e = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    if (e.trim().startsWith('//')) return `<span class="c">${e}</span>`;
    return e
      .replace(
        /\b(async|await|function|const|let|return|new|throw|import|export|from|type|of|if)\b/g,
        '<span class="k">$1</span>',
      )
      .replace(/'([^']*)'/g, '<span class="s">\'$1\'</span>')
      .replace(/"([^"]*)"/g, '<span class="s">"$1"</span>')
      .replace(/\b(Fastify|UnauthorizedError|AuthService)\b/g, '<span class="p">$1</span>');
  }
}
