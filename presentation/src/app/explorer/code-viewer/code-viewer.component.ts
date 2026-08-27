import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  input,
  signal,
} from '@angular/core';

import { CodeSnippet } from '../../core/snippets';

@Component({
  selector: 'app-code-viewer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="viewer" (click)="open()" role="button" tabindex="0" (keydown.enter)="open()" [attr.title]="'Click to enlarge'">
      <div class="titlebar">
        <div class="crumbs">
          @for (c of treePath(); track c; let last = $last) {
            <span [class.file]="last">{{ c }}</span>
            @if (!last) {
              <span class="sep">/</span>
            }
          }
          @if (!treePath().length) {
            <span class="file">{{ snippet()?.file || 'explorer' }}</span>
          }
        </div>
      </div>
      <div class="meta">{{ snippet()?.title || 'Relevant source' }}</div>
      <div class="body">
        @for (row of rows(); track row.n) {
          <div class="line" [class.focus]="row.focus">
            <span class="ln">{{ row.n }}</span>
            <span class="tx" [innerHTML]="row.html"></span>
          </div>
        }
      </div>
    </div>

    @if (enlarged()) {
      <div class="overlay" (click)="close()" role="presentation">
        <div class="modal" (click)="$event.stopPropagation()" role="dialog" aria-modal="true">
          <header class="modal-head">
            <div>
              <strong>{{ snippet()?.file || 'code' }}</strong>
              <small>{{ snippet()?.title }}</small>
            </div>
            <button type="button" class="close" (click)="close()">Close</button>
          </header>
          <div class="modal-body">
            @for (row of rows(); track row.n) {
              <div class="line" [class.focus]="row.focus">
                <span class="ln">{{ row.n }}</span>
                <span class="tx" [innerHTML]="row.html"></span>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
        min-height: 0;
        position: relative;
      }
      .viewer {
        height: 100%;
        display: flex;
        flex-direction: column;
        border: 1px solid rgba(247, 241, 232, 0.1);
        border-radius: var(--ct-radius);
        background: var(--ct-code-bg);
        overflow: hidden;
        box-shadow:
          var(--ct-shadow-lift),
          0 0 0 1px rgba(255, 255, 255, 0.04) inset;
        animation: none;
        cursor: zoom-in;
      }
      .viewer:focus-visible {
        outline: 2px solid rgba(245, 197, 24, 0.55);
        outline-offset: 2px;
      }
      .titlebar {
        display: flex;
        align-items: center;
        gap: 0.65rem;
        padding: 0.55rem 0.85rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        background: rgba(255, 255, 255, 0.03);
      }
      .crumbs {
        display: flex;
        flex-wrap: wrap;
        gap: 0.28rem;
        font-family: var(--font-mono);
        font-size: 0.72rem;
        color: #a89888;
        min-width: 0;
        flex: 1;
      }
      .crumbs .file {
        color: #f5c518;
        font-weight: 600;
      }
      .sep {
        opacity: 0.45;
      }
      .expand-hint {
        display: none;
      }
      .meta {
        padding: 0.35rem 0.85rem 0.5rem;
        font-size: 0.75rem;
        color: #c4a574;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        background: rgba(255, 255, 255, 0.02);
        font-weight: 500;
      }
      .body {
        flex: 1;
        overflow: auto;
        padding: 0.55rem 0;
        font-family: var(--font-mono);
        font-size: 0.8rem;
        line-height: 1.6;
      }
      .line {
        display: grid;
        grid-template-columns: 2.5rem 1fr;
        padding: 0 0.75rem 0 0;
      }
      .line.focus {
        background: rgba(245, 197, 24, 0.1);
        box-shadow: inset 2px 0 #f5c518;
      }
      .ln {
        color: #64748b;
        text-align: right;
        padding-right: 0.9rem;
        user-select: none;
      }
      .tx {
        color: #e2e8f0;
        white-space: pre-wrap;
        word-break: break-word;
      }
      :host ::ng-deep .tok-k {
        color: #e8b86d;
      }
      :host ::ng-deep .tok-s {
        color: #9dcea0;
      }
      :host ::ng-deep .tok-c {
        color: #7a6f64;
        font-style: italic;
      }
      :host ::ng-deep .tok-p {
        color: #f5c518;
      }

      .overlay {
        position: fixed;
        inset: 0;
        z-index: 80;
        background: rgba(0, 0, 0, 0.72);
        backdrop-filter: blur(8px);
        display: grid;
        place-items: center;
        padding: 1.25rem;
        animation: ct-fade-in 0.2s var(--ct-ease);
        cursor: zoom-out;
      }
      .modal {
        width: min(960px, 96vw);
        max-height: min(82vh, 820px);
        display: flex;
        flex-direction: column;
        border-radius: 18px;
        border: 1px solid rgba(247, 241, 232, 0.12);
        background: #0c0b0a;
        box-shadow: 0 32px 80px -24px rgba(0, 0, 0, 0.9);
        overflow: hidden;
        cursor: default;
        animation: ct-scale-in 0.25s var(--ct-ease);
      }
      .modal-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 1rem 1.15rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(255, 255, 255, 0.03);
      }
      .modal-head strong {
        display: block;
        font-family: var(--font-mono);
        font-size: 0.95rem;
        color: #f5c518;
      }
      .modal-head small {
        display: block;
        margin-top: 0.2rem;
        color: #b7a99a;
        font-size: 0.82rem;
      }
      .close {
        border: 1px solid rgba(247, 241, 232, 0.16);
        background: rgba(42, 36, 31, 0.9);
        color: #f7f1e8;
        border-radius: 10px;
        padding: 0.5rem 0.9rem;
        font: inherit;
        font-weight: 600;
        font-size: 0.85rem;
        cursor: pointer;
      }
      .close:hover {
        border-color: rgba(245, 197, 24, 0.4);
      }
      .modal-body {
        flex: 1;
        overflow: auto;
        padding: 1rem 0 1.25rem;
        font-family: var(--font-mono);
        font-size: 1.05rem;
        line-height: 1.75;
      }
      .modal-body .line {
        grid-template-columns: 3.2rem 1fr;
        padding-right: 1.1rem;
        animation: none;
      }
      .modal-body .ln {
        padding-right: 1.1rem;
        font-size: 0.9rem;
      }
    `,
  ],
})
export class CodeViewerComponent {
  readonly snippet = input<CodeSnippet | undefined>();
  readonly focusLines = input<number[] | undefined>();
  readonly treePath = input<string[]>([]);

  readonly enlarged = signal(false);

  readonly rows = computed(() => {
    const snip = this.snippet();
    const focus = new Set(this.focusLines() ?? []);
    const lines = snip?.lines ?? [
      '// Explore the architecture.',
      '// Real CineTrack source appears when this step maps to a file.',
    ];
    return lines.map((line, i) => ({
      n: i + 1,
      focus: focus.has(i + 1),
      html: tint(line),
    }));
  });

  open(): void {
    this.enlarged.set(true);
  }

  close(): void {
    this.enlarged.set(false);
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.enlarged()) this.close();
  }
}

/** Syntax tint without corrupting HTML attributes (hold tokens first). */
function tint(line: string): string {
  let e = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const held: string[] = [];
  const hold = (html: string) => {
    held.push(html);
    return `\u0000${held.length - 1}\u0000`;
  };

  if (e.trim().startsWith('//')) {
    return `<span class="tok-c">${e}</span>`;
  }

  e = e.replace(/'([^']*)'/g, (_, s) => hold(`<span class="tok-s">'${s}'</span>`));
  e = e.replace(/"([^"]*)"/g, (_, s) => hold(`<span class="tok-s">"${s}"</span>`));
  e = e.replace(
    /\b(async|await|function|const|let|return|new|throw|import|export|from|type|of|if)\b/g,
    (m) => hold(`<span class="tok-k">${m}</span>`),
  );
  e = e.replace(
    /\b(Fastify|FastifyInstance|UnauthorizedError|AuthService|ConflictError)\b/g,
    (m) => hold(`<span class="tok-p">${m}</span>`),
  );

  return e.replace(/\u0000(\d+)\u0000/g, (_, i) => held[Number(i)] ?? '');
}
