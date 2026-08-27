import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
} from '@angular/core';
import gsap from 'gsap';

import { CodeSide, CodeSnippet } from '../../core/presentation.model';

@Component({
  selector: 'app-floating-code',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (snippet(); as s) {
      <aside class="card" [class]="side()">
        <header>
          <span class="file">{{ s.file }}</span>
          <span class="title">{{ s.title }}</span>
        </header>
        <div class="body">
          @for (line of s.lines; track $index; let i = $index) {
            <div class="row">
              <span class="ln">{{ i + 1 }}</span>
              <span class="tx" [innerHTML]="tint(line)"></span>
            </div>
          }
        </div>
      </aside>
    }
  `,
  styles: [
    `
      :host {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 30;
      }

      .card {
        position: absolute;
        width: min(420px, 42vw);
        max-height: min(52vh, 480px);
        display: flex;
        flex-direction: column;
        border-radius: 16px;
        border: 1px solid rgba(61, 255, 224, 0.22);
        background: rgba(10, 12, 18, 0.88);
        backdrop-filter: blur(18px);
        box-shadow:
          0 0 0 1px rgba(255, 77, 109, 0.08),
          0 30px 80px rgba(0, 0, 0, 0.55);
        overflow: hidden;
        opacity: 0;
      }

      .card.right {
        top: 18%;
        right: 4%;
      }

      .card.left {
        top: 18%;
        left: 4%;
      }

      .card.bottom {
        left: 50%;
        bottom: 12%;
        width: min(720px, 88vw);
        max-height: 28vh;
        transform: translateX(-50%);
      }

      header {
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
        padding: 0.7rem 0.9rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        background: rgba(255, 255, 255, 0.02);
      }

      .file {
        font-family: var(--font-mono);
        font-size: 0.65rem;
        color: var(--color-mint);
      }

      .title {
        font-size: 0.72rem;
        color: var(--color-mute);
      }

      .body {
        overflow: auto;
        padding: 0.55rem 0;
        font-family: var(--font-mono);
        font-size: 0.68rem;
        line-height: 1.5;
      }

      .row {
        display: grid;
        grid-template-columns: 2rem 1fr;
        padding: 0 0.55rem;
      }

      .ln {
        color: #4a4a5c;
        text-align: right;
        padding-right: 0.65rem;
        user-select: none;
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
      :host ::ng-deep .c {
        color: #6b6b80;
        font-style: italic;
      }
      :host ::ng-deep .p {
        color: #ffd60a;
      }

      @media (max-width: 900px) {
        .card.left,
        .card.right,
        .card.bottom {
          left: 4%;
          right: 4%;
          top: auto;
          bottom: 11%;
          width: auto;
          max-height: 26vh;
          transform: none;
        }
      }
    `,
  ],
})
export class FloatingCodeComponent {
  readonly snippet = input<CodeSnippet | undefined>();
  readonly side = input<CodeSide>('right');

  constructor() {
    effect(() => {
      const s = this.snippet();
      const side = this.side();
      queueMicrotask(() => this.animateIn(!!s, side));
    });
  }

  private animateIn(has: boolean, _side: CodeSide): void {
    const el = document.querySelector('app-floating-code .card') as HTMLElement | null;
    if (!el || !has) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 18, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'power3.out' },
    );
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
      .replace(/\b(Fastify|UnauthorizedError|ConflictError|AuthService)\b/g, '<span class="p">$1</span>');
  }
}
