import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  inject,
} from '@angular/core';

import { CodeViewerComponent } from './code-viewer/code-viewer.component';
import { CinemaStageComponent } from './cinema-stage/cinema-stage.component';
import { ExplorerService } from './explorer.service';
import { MODULE_BRIEFS } from './explorer.model';
import { TypewriterComponent } from './typewriter.component';

@Component({
  selector: 'app-explorer',
  standalone: true,
  imports: [CinemaStageComponent, CodeViewerComponent, TypewriterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="deck" [class.cover-mode]="isCover()">
      <div class="deck-glow" aria-hidden="true"></div>

      <header class="deck-bar">
        <div class="brand">
          <img src="/brand/logo-mark.png" width="26" height="26" alt="" />
          <span>CineTrack</span>
        </div>
        <div class="parts" aria-label="Parts">
          @for (s of explorer.toc; track s.act) {
            <button
              type="button"
              class="part"
              [class.on]="scene().act === s.act && !isCover()"
              [title]="s.hint"
              (click)="explorer.jumpAct(s.act)"
            >
              {{ chapterNum(s.act) }}
            </button>
          }
        </div>
        <div class="slide-count">{{ explorer.slideLabel() }}</div>
      </header>

      <div class="rail" aria-hidden="true">
        <div class="rail-fill" [style.width.%]="percent()"></div>
      </div>

      <div class="viewport">
        <button
          type="button"
          class="nav-fab prev"
          [disabled]="explorer.isFirst()"
          (click)="explorer.prev()"
          aria-label="Previous slide"
        >
          <span aria-hidden="true">‹</span>
        </button>

        <article
          class="slide"
          [attr.data-dir]="explorer.slideDirection()"
          [attr.data-tick]="explorer.slideTick()"
          [class.cover]="isCover()"
          [class.requesting]="scene().stage === 'request'"
          [class.opener]="isOpener()"
        >
          @if (!isCover()) {
            <header class="slide-head">
              <p class="kicker">
                <span class="badge">{{ scene().actTitle }}</span>
                <span class="sep">·</span>
                <span>{{ scene().sceneLabel }}</span>
              </p>
              <h1>
                <app-typewriter [text]="scene().title" [html]="true" [speedMs]="14" [startDelayMs]="0" />
              </h1>
              @if (line()) {
                <p class="line">
                  <app-typewriter [text]="line()" [html]="true" [speedMs]="11" [startDelayMs]="60" />
                </p>
              }
              @if (scene().takeaway) {
                <p class="takeaway">{{ scene().takeaway }}</p>
              }
            </header>
          }

          <div class="slide-body" [class.wide]="!scene().snippet || isHero()" [class.hero]="isHero()">
            <section class="viz">
              <app-cinema-stage
                [scene]="scene()"
                [peek]="explorer.activePeek()"
                (moduleSelect)="explorer.selectModule($event)"
                (dive)="explorer.diveIntoAuth()"
              />
            </section>
            @if (scene().snippet && !isHero()) {
              <section class="code">
                <app-code-viewer
                  [snippet]="scene().snippet"
                  [focusLines]="scene().focusLines"
                  [treePath]="scene().treePath ?? []"
                />
              </section>
            }
          </div>
        </article>

        <button
          type="button"
          class="nav-fab next"
          [disabled]="explorer.isLast()"
          (click)="explorer.next()"
          aria-label="Next slide"
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      .deck {
        position: relative;
        height: 100%;
        max-height: 100dvh;
        display: grid;
        grid-template-rows: auto 3px minmax(0, 1fr);
        background: #070605;
        color: var(--ct-text);
        font-family: var(--font-body);
        overflow: hidden;
      }
      .deck-glow {
        pointer-events: none;
        position: absolute;
        inset: 0;
        background:
          radial-gradient(ellipse 70% 45% at 50% -10%, rgba(245, 197, 24, 0.14), transparent 55%),
          radial-gradient(ellipse 60% 40% at 80% 100%, rgba(255, 107, 74, 0.08), transparent 50%),
          radial-gradient(ellipse 50% 35% at 10% 90%, rgba(245, 197, 24, 0.05), transparent 45%);
        z-index: 0;
      }
      .deck > *:not(.deck-glow) {
        position: relative;
        z-index: 1;
      }

      .deck-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 0.65rem 1.25rem;
        border-bottom: 1px solid rgba(247, 241, 232, 0.08);
        background: rgba(7, 6, 5, 0.55);
        backdrop-filter: blur(12px);
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 0.45rem;
        font-family: var(--font-display);
        font-size: 1.25rem;
        letter-spacing: 0.06em;
      }
      .brand img {
        border-radius: 6px;
      }
      .parts {
        display: flex;
        gap: 0.35rem;
      }
      .part {
        width: 2rem;
        height: 2rem;
        border-radius: 999px;
        border: 1px solid rgba(247, 241, 232, 0.12);
        background: rgba(20, 18, 16, 0.8);
        color: var(--ct-mute);
        font-family: var(--font-mono);
        font-size: 0.68rem;
        font-weight: 700;
        cursor: pointer;
        transition:
          background 0.2s var(--ct-ease),
          border-color 0.2s var(--ct-ease),
          color 0.2s var(--ct-ease),
          transform 0.2s var(--ct-ease);
      }
      .part:hover {
        color: var(--ct-text);
        border-color: rgba(245, 197, 24, 0.35);
        transform: translateY(-1px);
      }
      .part.on {
        background: var(--ct-primary);
        border-color: var(--ct-primary);
        color: #1a1408;
      }
      .slide-count {
        font-family: var(--font-mono);
        font-size: 0.72rem;
        color: var(--ct-mute);
        letter-spacing: 0.06em;
        min-width: 4.5rem;
        text-align: right;
      }

      .rail {
        background: rgba(255, 255, 255, 0.06);
      }
      .rail-fill {
        height: 100%;
        background: linear-gradient(90deg, #f5c518, #ff8a5b);
        transition: width 0.45s var(--ct-ease);
        box-shadow: 0 0 16px rgba(245, 197, 24, 0.35);
      }

      .viewport {
        min-height: 0;
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: stretch;
        gap: 0.35rem;
        padding: 0.55rem 0.45rem;
      }

      .nav-fab {
        align-self: center;
        width: 3rem;
        height: 3rem;
        border-radius: 999px;
        border: 1px solid rgba(247, 241, 232, 0.14);
        background: rgba(20, 18, 16, 0.88);
        color: var(--ct-text);
        font-size: 1.85rem;
        line-height: 1;
        cursor: pointer;
        display: grid;
        place-items: center;
        transition:
          background 0.2s var(--ct-ease),
          border-color 0.2s var(--ct-ease),
          transform 0.2s var(--ct-ease),
          box-shadow 0.2s var(--ct-ease),
          opacity 0.2s var(--ct-ease);
        box-shadow: 0 10px 28px -16px rgba(0, 0, 0, 0.8);
      }
      .nav-fab span {
        display: block;
        margin-top: -0.1rem;
      }
      .nav-fab:hover:not(:disabled) {
        border-color: rgba(245, 197, 24, 0.45);
        background: rgba(40, 34, 26, 0.95);
        transform: scale(1.06);
        box-shadow: 0 0 24px rgba(245, 197, 24, 0.18);
      }
      .nav-fab.next:hover:not(:disabled) {
        background: var(--ct-primary);
        color: #1a1408;
        border-color: var(--ct-primary);
      }
      .nav-fab:disabled {
        opacity: 0.25;
        cursor: default;
      }

      .slide {
        min-height: 0;
        height: 100%;
        display: grid;
        grid-template-rows: auto minmax(0, 1fr);
        gap: 0.55rem;
        padding: 1rem 1.35rem 0.85rem;
        border-radius: 18px;
        border: 1px solid rgba(247, 241, 232, 0.1);
        background:
          linear-gradient(180deg, rgba(28, 25, 22, 0.55) 0%, rgba(14, 12, 10, 0.92) 100%);
        box-shadow:
          0 30px 70px -40px rgba(0, 0, 0, 0.9),
          inset 0 1px 0 rgba(255, 255, 255, 0.04);
        overflow: hidden;
        animation: slide-in-next 0.48s var(--ct-ease) both;
      }
      .slide[data-dir='prev'] {
        animation-name: slide-in-prev;
      }
      .slide[data-dir='none'] {
        animation: slide-fade 0.45s var(--ct-ease) both;
      }
      .slide.cover {
        grid-template-rows: minmax(0, 1fr);
        padding: 0;
        border: 0;
        background: transparent;
        box-shadow: none;
      }
      .slide.requesting {
        gap: 0.35rem;
        padding-top: 0.75rem;
      }
      .slide.opener:not(.cover) .slide-head {
        text-align: center;
        align-items: center;
      }

      .slide-head {
        display: flex;
        flex-direction: column;
        gap: 0.28rem;
        animation: head-rise 0.5s 0.05s var(--ct-ease) both;
      }
      .kicker {
        margin: 0;
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        font-size: 0.7rem;
        font-weight: 600;
        color: var(--ct-mute);
      }
      .badge {
        display: inline-flex;
        padding: 0.14rem 0.45rem;
        border-radius: 4px;
        background: rgba(245, 197, 24, 0.12);
        border: 1px solid rgba(245, 197, 24, 0.25);
        color: var(--ct-primary);
        font-family: var(--font-mono);
        font-size: 0.62rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-weight: 700;
      }
      .sep {
        opacity: 0.45;
      }
      h1 {
        margin: 0;
        max-width: 28ch;
        font-family: var(--font-display);
        font-size: clamp(1.9rem, 3.8vw, 2.9rem);
        font-weight: 400;
        letter-spacing: 0.03em;
        line-height: 1.05;
      }
      .slide.opener:not(.cover) h1 {
        max-width: 18ch;
        font-size: clamp(2.2rem, 5vw, 3.5rem);
        text-shadow: 0 0 40px rgba(255, 236, 179, 0.2);
      }
      .line {
        margin: 0;
        max-width: 64ch;
        font-size: clamp(0.95rem, 1.35vw, 1.08rem);
        line-height: 1.45;
        color: var(--ct-secondary);
        font-weight: 500;
        min-height: 1.4em;
      }
      .takeaway {
        margin: 0.1rem 0 0;
        font-family: var(--font-mono);
        font-size: 0.7rem;
        letter-spacing: 0.04em;
        color: var(--ct-primary);
        opacity: 0.9;
      }

      .slide-body {
        min-height: 0;
        display: grid;
        grid-template-columns: 1.15fr 0.85fr;
        gap: 0.75rem;
        overflow: hidden;
        animation: body-rise 0.55s 0.1s var(--ct-ease) both;
      }
      .slide-body.wide,
      .slide-body.hero {
        grid-template-columns: minmax(0, 1fr);
      }
      .slide.cover .slide-body {
        height: 100%;
        animation: cover-rise 0.7s var(--ct-ease) both;
      }
      section {
        min-height: 0;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      section > app-cinema-stage,
      section > app-code-viewer {
        flex: 1 1 0;
        min-height: 0;
      }

      @keyframes slide-in-next {
        from {
          opacity: 0;
          transform: translateX(2.2rem) scale(0.985);
        }
        to {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
      }
      @keyframes slide-in-prev {
        from {
          opacity: 0;
          transform: translateX(-2.2rem) scale(0.985);
        }
        to {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
      }
      @keyframes slide-fade {
        from {
          opacity: 0;
          transform: translateY(0.6rem);
        }
        to {
          opacity: 1;
          transform: none;
        }
      }
      @keyframes head-rise {
        from {
          opacity: 0;
          transform: translateY(0.55rem);
        }
        to {
          opacity: 1;
          transform: none;
        }
      }
      @keyframes body-rise {
        from {
          opacity: 0;
          transform: translateY(0.85rem);
        }
        to {
          opacity: 1;
          transform: none;
        }
      }
      @keyframes cover-rise {
        from {
          opacity: 0;
          transform: scale(1.02);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      @media (max-width: 900px) {
        .viewport {
          grid-template-columns: 1fr;
          padding: 0.35rem;
        }
        .nav-fab {
          display: none;
        }
        .slide-body {
          grid-template-columns: 1fr;
        }
        .parts {
          display: none;
        }
      }
    `,
  ],
})
export class ExplorerComponent {
  readonly explorer = inject(ExplorerService);

  readonly scene = computed(() => this.explorer.scene());
  readonly percent = computed(() => Math.round(this.explorer.progress() * 100));

  readonly line = computed(() => {
    const peek = this.explorer.activePeek();
    if (peek && this.scene().stage === 'modules' && !this.scene().moduleSpot) {
      return MODULE_BRIEFS[peek.name] ?? peek.blurb;
    }
    return this.scene().narration;
  });

  isCover(): boolean {
    return this.scene().stage === 'cover';
  }

  isHero(): boolean {
    return ['title', 'cover', 'engine', 'finale', 'request'].includes(this.scene().stage);
  }

  isOpener(): boolean {
    return ['title', 'cover', 'engine', 'finale'].includes(this.scene().stage);
  }

  chapterNum(act: number): string {
    return String(act).padStart(2, '0');
  }

  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    const t = e.target as HTMLElement | null;
    if (t && ['INPUT', 'TEXTAREA'].includes(t.tagName)) return;
    if (e.key === 'ArrowRight' || e.code === 'Space' || e.key === 'PageDown') {
      e.preventDefault();
      this.explorer.next();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      this.explorer.prev();
    }
  }
}
