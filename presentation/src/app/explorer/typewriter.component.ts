import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  signal,
} from '@angular/core';

import { highlightFastifySyntax } from './explorer.model';

/** Types text out character-by-character, like a live talk. */
@Component({
  selector: 'app-typewriter',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="tw" [class.done]="done()">
      <span [innerHTML]="shown()"></span>
      <span class="caret" [class.hide]="done()" aria-hidden="true"></span>
    </span>
  `,
  styles: [
    `
      :host {
        display: inline;
      }
      .caret {
        display: inline-block;
        width: 0.08em;
        height: 1.05em;
        margin-left: 0.08em;
        vertical-align: -0.12em;
        background: var(--ct-primary);
        border-radius: 1px;
        animation: caret-blink 0.9s steps(1) infinite;
      }
      .caret.hide {
        opacity: 0;
        animation: none;
      }
      @keyframes caret-blink {
        50% {
          opacity: 0;
        }
      }
    `,
  ],
})
export class TypewriterComponent {
  readonly text = input.required<string>();
  readonly html = input(false);
  readonly speedMs = input(22);
  readonly startDelayMs = input(120);

  readonly shown = signal('');
  readonly done = signal(false);

  private timer: ReturnType<typeof setInterval> | null = null;
  private delay: ReturnType<typeof setTimeout> | null = null;
  private token = 0;

  constructor() {
    effect((onCleanup) => {
      const raw = this.text();
      const asHtml = this.html();
      const speed = this.speedMs();
      const delayMs = this.startDelayMs();
      const my = ++this.token;

      this.clearTimers();
      this.shown.set('');
      this.done.set(false);

      const plain = asHtml ? stripTags(raw) : raw;
      const chars = [...plain];
      let i = 0;

      this.delay = setTimeout(() => {
        if (my !== this.token) return;
        if (!chars.length) {
          this.shown.set(asHtml ? softMark(raw) : '');
          this.done.set(true);
          return;
        }
        // Short titles appear instantly — denser decks stay snappy
        if (chars.length <= 36 && delayMs === 0) {
          this.shown.set(asHtml ? softMark(plain) : plain);
          this.done.set(true);
          return;
        }
        this.timer = setInterval(() => {
          if (my !== this.token) {
            this.clearTimers();
            return;
          }
          i += 1;
          const slice = chars.slice(0, i).join('');
          this.shown.set(asHtml ? softMark(slice) : slice);
          if (i >= chars.length) {
            this.done.set(true);
            this.clearTimers();
          }
        }, speed);
      }, delayMs);

      onCleanup(() => this.clearTimers());
    });
  }

  private clearTimers(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.delay) {
      clearTimeout(this.delay);
      this.delay = null;
    }
  }
}

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, '');
}

function softMark(plain: string): string {
  const escaped = plain
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return highlightFastifySyntax(escaped);
}
