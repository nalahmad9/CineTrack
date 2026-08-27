import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CodeSnippet } from '../../core/presentation.model';

@Component({
  selector: 'app-code-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (snippet(); as s) {
      <section class="code anim-rise">
        <header class="bar">
          <div class="dots" aria-hidden="true">
            <span></span><span></span><span></span>
          </div>
          <div class="meta">
            <span class="file">{{ s.file }}</span>
            <span class="title">{{ s.title }}</span>
          </div>
        </header>
        <div class="scroll">
          @for (line of s.lines; track $index; let i = $index) {
            <div class="row">
              <span class="ln">{{ pad(i + 1) }}</span>
              <span class="tx" [innerHTML]="colorize(line)"></span>
            </div>
          }
        </div>
      </section>
    } @else {
      <section class="code empty">
        <p>Architecture view — advance to reveal source from the CineTrack repo.</p>
      </section>
    }
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
        min-height: 0;
      }

      .code {
        height: 100%;
        display: flex;
        flex-direction: column;
        border: 1px solid var(--color-border);
        border-radius: 12px;
        background: var(--color-code-bg);
        overflow: hidden;
      }

      .code.empty {
        align-items: center;
        justify-content: center;
        color: var(--color-faint);
        font-size: 0.85rem;
        padding: 2rem;
        text-align: center;
      }

      .bar {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.7rem 0.9rem;
        border-bottom: 1px solid var(--color-border);
        background: var(--color-panel);
      }

      .dots {
        display: flex;
        gap: 0.35rem;
      }

      .dots span {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #3f3f46;
      }

      .dots span:nth-child(1) {
        background: #fb7185;
      }
      .dots span:nth-child(2) {
        background: #fbbf24;
      }
      .dots span:nth-child(3) {
        background: #34d399;
      }

      .meta {
        display: flex;
        flex-direction: column;
        gap: 0.1rem;
        min-width: 0;
      }

      .file {
        font-family: var(--font-mono);
        font-size: 0.68rem;
        color: var(--color-accent);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .title {
        font-size: 0.72rem;
        color: var(--color-muted);
      }

      .scroll {
        margin: 0;
        padding: 0.75rem 0;
        overflow: auto;
        flex: 1;
        font-family: var(--font-mono);
        font-size: 0.72rem;
        line-height: 1.55;
      }

      .row {
        display: grid;
        grid-template-columns: 2.6rem 1fr;
        padding: 0 0.5rem 0 0;
      }

      .ln {
        text-align: right;
        padding-right: 0.85rem;
        color: #52525b;
        user-select: none;
      }

      .tx {
        color: #e4e4e7;
        white-space: pre-wrap;
        word-break: break-word;
      }

      :host ::ng-deep .k {
        color: #c084fc;
      }
      :host ::ng-deep .s {
        color: #86efac;
      }
      :host ::ng-deep .c {
        color: #71717a;
        font-style: italic;
      }
      :host ::ng-deep .n {
        color: #7c9cff;
      }
      :host ::ng-deep .p {
        color: #fbbf24;
      }
    `,
  ],
})
export class CodePanelComponent {
  readonly snippet = input<CodeSnippet | undefined>();

  pad(n: number): string {
    return n.toString().padStart(2, ' ');
  }

  colorize(line: string): string {
    const escaped = line
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    if (escaped.trim().startsWith('//')) {
      return `<span class="c">${escaped}</span>`;
    }

    return escaped
      .replace(
        /\b(async|await|function|const|let|return|new|throw|import|export|from|type|of|if)\b/g,
        '<span class="k">$1</span>',
      )
      .replace(/'([^']*)'/g, '<span class="s">\'$1\'</span>')
      .replace(/"([^"]*)"/g, '<span class="s">"$1"</span>')
      .replace(/\b(\d+)\b/g, '<span class="n">$1</span>')
      .replace(
        /\b(Fastify|UnauthorizedError|ConflictError|AuthService|FastifyPluginAsync)\b/g,
        '<span class="p">$1</span>',
      );
  }
}
