import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

import {
  AUTH_LAYERS,
  BOOT_CAST,
  CinemaScene,
  CLIENT_FOLDER_BRIEFS,
  CLIENT_FOLDER_COLORS,
  CLIENT_FOLDER_TREE,
  FOLDER_TREE,
  MAIN_FOLDER_COLORS,
  MODULE_CAST,
  MODULE_DETAILS,
  MODULE_FOLDER,
  FOLDER_BRIEFS,
  PLUGIN_CAST,
  REQUEST_HOPS,
  UiMockKind,
  markFastify,
} from '../explorer.model';
import { ModulePeek } from '../explorer.service';

const UI_SHOTS: Record<UiMockKind, { src: string; url: string; caption: string }> = {
  overview: {
    src: '/ui/dashboard.png',
    url: 'cinetrack.app/dashboard',
    caption: 'Dashboard',
  },
  pillars: {
    src: '/ui/dashboard.png',
    url: 'cinetrack.app/dashboard',
    caption: 'Application shell',
  },
  component: {
    src: '/ui/discover.png',
    url: 'cinetrack.app/discover',
    caption: 'Discover',
  },
  signals: {
    src: '/ui/watchlist.png',
    url: 'cinetrack.app/watchlist',
    caption: 'Watchlist',
  },
  routing: {
    src: '/ui/routing-shell.png',
    url: 'cinetrack.app/watchlist',
    caption: 'Watchlist route',
  },
  guards: {
    src: '/ui/login.png',
    url: 'cinetrack.app/login',
    caption: 'Login',
  },
  rxjs: {
    src: '/ui/discover-search.png',
    url: 'cinetrack.app/discover',
    caption: 'Discover search',
  },
  services: {
    src: '/ui/favorites.png',
    url: 'cinetrack.app/favorites',
    caption: 'Favorites',
  },
  watchlist: {
    src: '/ui/watchlist.png',
    url: 'cinetrack.app/watchlist',
    caption: 'Watchlist',
  },
  details: {
    src: '/ui/movie-details.png',
    url: 'cinetrack.app/movie/693134',
    caption: 'Movie details',
  },
};

@Component({
  selector: 'app-cinema-stage',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stage" [attr.data-kind]="scene().stage">
      @switch (scene().stage) {
        @case ('cover') {
          <div class="box cover-slide">
            <div class="cover-collage" aria-hidden="true">
              <figure class="tile t1"><img src="/ui/dashboard.png" alt="" /></figure>
              <figure class="tile t2"><img src="/ui/discover.png" alt="" /></figure>
              <figure class="tile t3"><img src="/ui/watchlist.png" alt="" /></figure>
              <figure class="tile t4"><img src="/ui/movie-details.png" alt="" /></figure>
              <figure class="tile t5"><img src="/ui/login.png" alt="" /></figure>
              <figure class="tile t6"><img src="/ui/favorites.png" alt="" /></figure>
            </div>
            <div class="cover-veil"></div>
            <div class="cover-copy">
              <img class="cover-logo" src="/brand/logo-wordmark.png" width="160" height="160" alt="CineTrack" />
              <p class="cover-kicker">Architecture walkthrough</p>
              <h2 class="cover-title">Fastify <span>&</span> Angular</h2>
              <p class="cover-sub">From API bootstrap to the real CineTrack client — one request at a time.</p>
              <div class="cover-pages">
                <span>Dashboard</span>
                <span>Discover</span>
                <span>Watchlist</span>
                <span>Details</span>
                <span>Login</span>
                <span>Favorites</span>
              </div>
              <p class="cover-cta">Press <strong>Next</strong> to begin</p>
            </div>
          </div>
        }

        @case ('title') {
          <div class="box center intro">
            <img class="logo" src="/brand/logo-wordmark.png" width="180" height="180" alt="CineTrack" />
            <p class="muted big" [innerHTML]="mark('Told through the real CineTrack Fastify API.')"></p>
          </div>
        }

        @case ('engine') {
          <div class="box fastify-assembly">
            <div class="assembly-heading">
              <span>APPLICATION COMPOSITION</span>
              <strong>Small parts. One Fastify app.</strong>
            </div>

            <div class="assembly-map">
              <svg class="assembly-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <marker id="attach-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z"></path>
                  </marker>
                </defs>
                <line x1="17" y1="18" x2="43" y2="43"></line>
                <line x1="83" y1="18" x2="57" y2="43"></line>
                <line x1="14" y1="70" x2="42" y2="56"></line>
                <line x1="50" y1="88" x2="50" y2="62"></line>
                <line x1="86" y1="70" x2="58" y2="56"></line>
              </svg>

              <div class="assembly-node config">
                <i>01</i><strong>Config</strong><small>validated env</small>
              </div>
              <div class="assembly-node plugins">
                <i>02</i><strong>Plugins</strong><small>shared capabilities</small>
              </div>
              <div class="assembly-node common">
                <i>03</i><strong>Common</strong><small>errors & helpers</small>
              </div>
              <div class="assembly-node database">
                <i>04</i><strong>Database</strong><small>MongoDB connection</small>
              </div>
              <div class="assembly-node modules">
                <i>05</i><strong>Modules</strong><small>feature domains</small>
              </div>

              <div class="assembly-core">
                <span class="core-orbit one"></span>
                <span class="core-orbit two"></span>
                <div class="core-disc">
                  <em>Central app</em>
                  <strong>Fastify</strong>
                  <code>const app = Fastify()</code>
                </div>
              </div>
            </div>

            <p class="assembly-summary">
              We attach each focused part to <strong>one central application.</strong>
            </p>
          </div>
        }

        @case ('ideas') {
          <div class="box credits ideas">
            <div class="credits-banner">
              <span>CONCEPTS</span>
              <strong [innerHTML]="mark(scene().title)"></strong>
            </div>
            <div class="idea-grid" [attr.data-count]="(scene().ideas ?? []).length">
              @for (idea of scene().ideas ?? []; track idea.name; let i = $index) {
                <div class="idea-card" [style.animation-delay.ms]="80 + i * 90">
                  <em>{{ bayNo(i) }}</em>
                  <strong [innerHTML]="mark(idea.name)"></strong>
                  <p [innerHTML]="mark(idea.plain)"></p>
                </div>
              }
            </div>
          </div>
        }

        @case ('bullets') {
          <div class="box center bullets">
            <div class="spot-mini" aria-hidden="true"></div>
            <ul>
              @for (b of scene().bullets ?? []; track b; let i = $index) {
                <li [style.animation-delay.ms]="i * 140" [innerHTML]="mark(b)"></li>
              }
            </ul>
          </div>
        }

        @case ('folder') {
          <div class="box folder storyboard">
            <div class="bp-head">
              <div class="box-title">{{ folderRootLabel() }}</div>
              <span class="bp-stamp">TREE</span>
            </div>
            <div class="folder-layout">
              @if (!nodes().length) {
                <p class="empty">Empty</p>
              } @else {
                <ul class="tree">
                  @for (n of nodes(); track n.id) {
                    <li
                      [style.paddingLeft.rem]="0.25 + n.depth * 0.9"
                      [style.--tone]="folderTone(n.id)"
                      [class.main]="isMain(n.id)"
                      [class.on]="scene().folderSpot === n.id"
                      [class.past]="isPast(n.id)"
                      [class.dir]="n.kind === 'dir'"
                      [class.file]="n.kind === 'file'"
                    >
                      {{ n.label }}
                    </li>
                  }
                </ul>
              }
              @if (folderBrief(); as brief) {
                <aside class="folder-brief" [style.--tone]="folderTone(scene().folderSpot || '')">
                  <em>{{ folderBriefLabel() }}</em>
                  <p [innerHTML]="mark(brief)"></p>
                  @if (scene().example; as ex) {
                    <div class="folder-example">
                      <strong>Example</strong>
                      <span [innerHTML]="mark(ex)"></span>
                    </div>
                  }
                </aside>
              }
            </div>
          </div>
        }

        @case ('boot') {
          <div class="box cue-sheet">
            <div class="rx-head">
              <div class="box-title">Bootstrap sequence</div>
              <span class="rx-live"><i></i> LIVE</span>
            </div>
            <div class="rx-track">
              @for (b of boot; track b.id; let i = $index) {
                <div
                  class="rx-step"
                  [class.on]="scene().bootSpot === b.id || scene().bootSpot === 'all'"
                  [class.past]="isBootPast(b.id)"
                  [class.pulse]="scene().bootSpot === b.id"
                >
                  <div class="rx-node">
                    <span>{{ i + 1 }}</span>
                    @if (scene().bootSpot === b.id) {
                      <i class="rx-ping" aria-hidden="true"></i>
                    }
                  </div>
                  <div class="rx-label">
                    <strong [innerHTML]="mark(b.label)"></strong>
                    <small>{{ bootHint(b.id) }}</small>
                  </div>
                  @if (i < boot.length - 1) {
                    <div class="rx-pipe" [class.lit]="isBootPast(b.id) || scene().bootSpot === 'all'"></div>
                  }
                </div>
              }
            </div>
          </div>
        }

        @case ('plugins') {
          <div class="box credits">
            <div class="credits-banner">
              <span>PLUGINS</span>
              <strong [innerHTML]="mark('Fastify plugins')"></strong>
            </div>
            <div class="rack-grid" [class.overview]="scene().pluginSpot === 'overview'">
              @for (p of plugins; track p.name; let i = $index) {
                <div
                  class="rack-bay"
                  [class.on]="isPluginOn(i)"
                  [class.past]="isPluginPast(i)"
                  [class.focus]="scene().pluginSpot === i"
                  [style.animation-delay.ms]="i * 60"
                >
                  <em>{{ bayNo(i) }}</em>
                  <strong>{{ p.name }}</strong>
                  <p [innerHTML]="mark(p.plain)"></p>
                </div>
              }
            </div>
          </div>
        }

        @case ('globals') {
          <div class="box vaults">
            <div
              class="vault"
              [class.on]="scene().globalSpot === 'errors' || scene().globalSpot === 'both'"
              [class.past]="scene().globalSpot === 'responses'"
            >
              <div class="vault-tag">ERRORS</div>
              <strong>Errors</strong>
              <p>AppError · UnauthorizedError · ConflictError</p>
              <div class="vault-bar" aria-hidden="true"></div>
            </div>
            <div
              class="vault"
              [class.on]="scene().globalSpot === 'responses' || scene().globalSpot === 'both'"
              [class.past]="scene().globalSpot === 'errors'"
            >
              <div class="vault-tag">RESPONSES</div>
              <strong>Responses</strong>
              <p>success() · failure()</p>
              <div class="vault-bar ok" aria-hidden="true"></div>
            </div>
          </div>
        }

        @case ('modules') {
          <div class="box modules">
            <div class="module-head">
              <div class="box-title">Feature modules</div>
              <span>Choose a module to inspect its Fastify structure</span>
            </div>
            <div class="module-workspace" [class.has-detail]="!!peek()">
              <div class="mod-grid">
                @for (m of modules; track m) {
                  <button
                    type="button"
                    class="mod-btn"
                    [style.--m]="details[m].color"
                    [class.on]="peek()?.name === m || scene().moduleSpot === m"
                    (click)="moduleSelect.emit(m)"
                  >
                    {{ m }}
                  </button>
                }
              </div>

              @if (peek(); as p) {
                <aside class="mod-detail" [style.--m]="p.color">
                  <header class="mod-detail-head">
                    <div>
                      <em>server/src/modules/{{ moduleFolder(p.name) }}/</em>
                      <strong>{{ p.name }}</strong>
                    </div>
                    <span>Fastify plugin</span>
                  </header>
                  <p class="blurb">{{ p.blurb }}</p>

                  <div class="mod-inspector">
                    <section class="mod-tree-panel">
                      <h4>Folder structure</h4>
                      <ul class="mod-tree">
                        <li class="root">▾ {{ moduleFolder(p.name) }}/</li>
                        @for (file of moduleFiles(p.name); track file) {
                          <li>├─ {{ file }}</li>
                        }
                      </ul>
                    </section>

                    <section class="mod-notes-panel">
                      <h4>Routes</h4>
                      <p class="route-list">{{ p.routes }}</p>
                      <h4>Important Fastify notes</h4>
                      <ul class="points">
                        @for (point of p.points; track point) {
                          <li [innerHTML]="mark(point)"></li>
                        }
                      </ul>
                    </section>
                  </div>

                  @if (p.dive) {
                    <button type="button" class="dive" (click)="dive.emit()">Open Auth layer stack →</button>
                  }
                </aside>
              } @else {
                <aside class="mod-empty">
                  <span>01</span>
                  <strong>Select a module</strong>
                  <p>Its folder tree, routes, and Fastify implementation notes will appear here.</p>
                </aside>
              }
            </div>
          </div>
        }

        @case ('auth') {
          <div class="box">
            <div class="box-title">Auth module layers</div>
            <ol class="list auth-layers">
              @for (l of layers; track l.name; let i = $index) {
                <li
                  [class.on]="scene().authSpot === i"
                  [class.past]="scene().authSpot != null && scene().authSpot! > i"
                  [class.live]="scene().authSpot == null || scene().authSpot! >= i"
                >
                  <span>{{ i + 1 }}</span>
                  <div class="layer-copy">
                    <strong>{{ l.name }}</strong>
                    <p [innerHTML]="mark(l.plain)"></p>
                  </div>
                </li>
              }
            </ol>
          </div>
        }

        @case ('request') {
          <div class="box request-flow full">
            <div class="rf-top">
              <div class="box-title">POST /api/v1/watchlist</div>
              <div class="rf-bar">
                <div [style.width.%]="requestProgress()"></div>
              </div>
            </div>

            <div class="rf-layout">
              <aside
                class="rf-action"
                [class.pulse]="scene().requestSpot === 0"
                [class.done]="(scene().requestSpot ?? -1) >= hops.length - 1"
              >
                <div class="rf-movie">
                  <div class="rf-poster" style="background-image: url('/brand/Cinetrack-poster.svg')"></div>
                  <div class="rf-movie-meta">
                    <small>MOVIE</small>
                    <strong>Dune: Part Two</strong>
                    <span>Sci-Fi · 2024</span>
                  </div>
                </div>
                <button type="button" class="rf-btn" [class.loading]="scene().requestSpot === 0">
                  @if (scene().requestSpot === 0) {
                    <span class="rf-spin" aria-hidden="true"></span>
                    Sending…
                  } @else if ((scene().requestSpot ?? -1) >= hops.length - 1) {
                    On watchlist ✓
                  } @else {
                    + Add to Watchlist
                  }
                </button>
                <div class="rf-packet" [class.away]="(scene().requestSpot ?? 0) > 0">
                  <em>POST</em> /api/v1/watchlist
                </div>
              </aside>

              <div class="rf-journey">
                <div class="rf-rail seven">
                  @for (h of hops; track h.label; let i = $index) {
                    <div
                      class="rf-hop"
                      [class.on]="scene().requestSpot === i"
                      [class.past]="scene().requestSpot != null && scene().requestSpot! > i"
                      [class.next]="scene().requestSpot != null && scene().requestSpot! + 1 === i"
                    >
                      <div class="rf-node">
                        <span>{{ i + 1 }}</span>
                        @if (scene().requestSpot === i) {
                          <i class="rf-ping" aria-hidden="true"></i>
                        }
                      </div>
                      <div class="rf-meta">
                        <small>{{ h.tag }}</small>
                        <strong [innerHTML]="mark(h.label)"></strong>
                      </div>
                    </div>
                  }
                </div>

                @if (activeHop(); as hop) {
                  @if (hop.detail) {
                    <div class="rf-toast" [attr.data-step]="scene().requestSpot">
                      <div class="rf-toast-rail"></div>
                      <div>
                        <div class="rf-toast-kicker">Step {{ (scene().requestSpot ?? 0) + 1 }} / {{ hops.length }}</div>
                        <p [innerHTML]="mark(hop.detail)"></p>
                      </div>
                    </div>
                  }
                }
              </div>
            </div>
          </div>
        }

        @case ('tmdb') {
          <div class="box external-api" [class.client-mode]="scene().id === 'tmdb-client'">
            <div class="api-flow">
              <div class="api-node angular-node">
                <span class="api-icon">A</span>
                <strong>Angular client</strong>
                <small>TmdbService</small>
              </div>
              <div class="api-link">
                <span>GET /api/v1/tmdb/*</span>
                <i></i>
              </div>
              <div class="api-node fastify-node">
                <span class="api-icon">F</span>
                <strong>Fastify proxy</strong>
                <small>routes → service → repository</small>
                <em>API key stays here</em>
              </div>
              <div class="api-link outbound">
                <span>HTTPS + api_key</span>
                <i></i>
              </div>
              <div class="api-node tmdb-node">
                <span class="tmdb-mark">TMDB</span>
                <strong>External API</strong>
                <small>movies · TV · people · images</small>
              </div>
            </div>

            @if (scene().id === 'tmdb-client') {
              <div class="tmdb-screens">
                <figure><img src="/ui/dashboard.png" alt="CineTrack dashboard" /><figcaption>Trending</figcaption></figure>
                <figure><img src="/ui/discover-search.png" alt="CineTrack Discover search" /><figcaption>Search</figcaption></figure>
                <figure><img src="/ui/movie-details.png" alt="CineTrack movie details" /><figcaption>Details</figcaption></figure>
              </div>
            } @else {
              <div class="api-rules">
                <div><strong>Secure</strong><span>TMDB_API_KEY never reaches the browser</span></div>
                <div><strong>Decoupled</strong><span>Angular only knows CineTrack endpoints</span></div>
                <div><strong>Resilient</strong><span>Upstream failures become 404 / 502 / 503</span></div>
                <div><strong>Lean</strong><span>No MongoDB copy of the catalog</span></div>
              </div>
            }
          </div>
        }

        @case ('compare') {
          <div class="box framework-compare" [class.fit-mode]="scene().id === 'compare-fit'">
            <div class="compare-head">
              <div class="framework react">
                <div class="framework-logo">⚛</div>
                <div><strong>React</strong><small>UI library</small></div>
              </div>
              <div class="versus">VS</div>
              <div class="framework angular">
                <div class="framework-logo">A</div>
                <div><strong>Angular</strong><small>Application framework</small></div>
              </div>
            </div>

            <div class="compare-grid">
              <div class="compare-col react-col">
                <span class="col-label">Choose your stack</span>
                <div class="compare-row"><b>View</b><span>JSX + components</span></div>
                <div class="compare-row"><b>State</b><span>Hooks + chosen library</span></div>
                <div class="compare-row"><b>Routing</b><span>Add React Router / framework</span></div>
                <div class="compare-row"><b>DI</b><span>Context or libraries</span></div>
                <div class="compare-row"><b>Style</b><span>Flexible, team-defined</span></div>
              </div>
              <div class="compare-col angular-col">
                <span class="col-label">Integrated defaults</span>
                <div class="compare-row"><b>View</b><span>Templates + components</span></div>
                <div class="compare-row"><b>State</b><span>Signals + RxJS</span></div>
                <div class="compare-row"><b>Routing</b><span>First-party Router</span></div>
                <div class="compare-row"><b>DI</b><span>Built-in dependency injection</span></div>
                <div class="compare-row"><b>Style</b><span>Structured conventions</span></div>
              </div>
            </div>

            @if (scene().id === 'compare-fit') {
              <div class="fit-banner">
                <span>CineTrack needs</span>
                <strong>many routes</strong><i>+</i>
                <strong>shared services</strong><i>+</i>
                <strong>guards</strong><i>+</i>
                <strong>consistent features</strong>
                <em>→ Angular is a natural fit</em>
              </div>
            } @else {
              <p class="compare-note">React optimizes for flexibility. Angular optimizes for consistency at application scale.</p>
            }
          </div>
        }

        @case ('demo') {
          <div class="box demo-stage">
            <div class="demo-player">
              <video
                controls
                autoplay
                muted
                loop
                playsinline
                poster="/ui/dashboard.png"
                aria-label="Recorded CineTrack application demo"
              >
                <source src="/demo/cinetrack-demo.webm" type="video/webm" />
              </video>
              <div class="demo-badge"><i></i> Recorded from the working CineTrack app</div>
            </div>
            <div class="demo-chapters">
              <span><b>00</b> Login</span>
              <span><b>01</b> Dashboard</span>
              <span><b>02</b> Discover</span>
              <span><b>03</b> Watchlist</span>
              <span><b>04</b> Favorites</span>
              <span><b>05</b> Movie details</span>
            </div>
          </div>
        }

        @case ('ui') {
          <div class="box ui-lesson">
            <div class="ui-split">
              <div class="ui-frame shot">
                <div class="ui-browser">
                  <div class="ui-dots" aria-hidden="true"><i></i><i></i><i></i></div>
                  <div class="ui-url">{{ uiMeta().url }}</div>
                  <span class="ui-cap">{{ uiMeta().caption }}</span>
                </div>
                <div class="ui-shot">
                  <img [src]="uiMeta().src" [alt]="uiMeta().caption" />
                </div>
              </div>

              <aside class="ui-aside">
                @if (scene().example; as ex) {
                  <div class="ui-example">
                    <em>Example</em>
                    <p [innerHTML]="mark(ex)"></p>
                  </div>
                }
                @if (scene().ideas?.length) {
                  <div class="ui-points">
                    @for (idea of scene().ideas!; track idea.name; let i = $index) {
                      <div class="ui-point" [style.animation-delay.ms]="60 + i * 70">
                        <strong [innerHTML]="mark(idea.name)"></strong>
                        <p [innerHTML]="mark(idea.plain)"></p>
                        @if (idea.example) {
                          <small [innerHTML]="mark(idea.example)"></small>
                        }
                      </div>
                    }
                  </div>
                } @else if (scene().bullets?.length) {
                  <ul class="ui-bullets">
                    @for (b of scene().bullets!; track b; let i = $index) {
                      <li [style.animation-delay.ms]="60 + i * 80" [innerHTML]="mark(b)"></li>
                    }
                  </ul>
                }
              </aside>
            </div>
          </div>
        }

        @case ('finale') {
          <div class="box center finale-spot">
            <div class="spot-mini" aria-hidden="true"></div>
            <img class="logo sm" src="/brand/logo-mark.png" width="72" height="72" alt="" />
            <p class="spot-kicker">SUMMARY</p>
            <p class="flow" [innerHTML]="mark('Fastify API → Angular UI → one watchlist path')"></p>
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
      .stage {
        height: 100%;
        min-height: 280px;
        border: 1px solid var(--ct-line);
        border-radius: var(--ct-radius);
        background:
          radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255, 220, 140, 0.1), transparent 55%),
          radial-gradient(ellipse 70% 50% at 50% 110%, rgba(0, 0, 0, 0.45), transparent 55%),
          var(--ct-panel);
        box-shadow: var(--ct-shadow);
        overflow: auto;
      }
      .stage[data-kind='cover'] {
        overflow: hidden;
        border: 0;
        background: #050403;
      }
      .box.cover-slide {
        position: relative;
        padding: 0;
        min-height: 100%;
        height: 100%;
        overflow: hidden;
        display: grid;
        place-items: center;
        animation: none;
      }
      .cover-collage {
        position: absolute;
        inset: -2% 0;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: 1fr 1fr;
        gap: 0.65rem;
        padding: 0.85rem 1rem;
        transform: rotate(-1deg) scale(1.02);
      }
      .cover-collage .tile {
        margin: 0;
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid rgba(247, 241, 232, 0.12);
        box-shadow: 0 18px 40px -18px rgba(0, 0, 0, 0.85);
        background: #111;
        animation: tile-float 7s ease-in-out infinite;
      }
      .cover-collage .tile img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: top center;
        filter: brightness(1.08) contrast(1.04) saturate(1.08);
      }
      .tile.t1 {
        animation-delay: 0s;
      }
      .tile.t2 {
        animation-delay: 0.35s;
      }
      .tile.t3 {
        animation-delay: 0.7s;
      }
      .tile.t4 {
        animation-delay: 1s;
      }
      .tile.t5 {
        animation-delay: 1.3s;
      }
      .tile.t6 {
        animation-delay: 1.6s;
      }
      .cover-veil {
        position: absolute;
        inset: 0;
        background:
          linear-gradient(90deg, rgba(5, 4, 3, 0.52) 0%, rgba(5, 4, 3, 0.1) 50%, rgba(5, 4, 3, 0.2) 100%),
          linear-gradient(180deg, rgba(5, 4, 3, 0.04) 0%, rgba(5, 4, 3, 0.3) 100%);
        pointer-events: none;
      }
      .cover-copy {
        position: relative;
        z-index: 2;
        max-width: 34rem;
        padding: 1.5rem;
        text-align: left;
        background: rgba(5, 4, 3, 0.62);
        border: 1px solid rgba(247, 241, 232, 0.12);
        border-radius: 18px;
        box-shadow: 0 24px 60px -30px rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(8px);
        animation: cover-copy-in 0.8s var(--ct-ease) both;
      }
      .cover-logo {
        display: block;
        width: 120px;
        height: auto;
        margin-bottom: 0.85rem;
        filter: drop-shadow(0 12px 28px rgba(0, 0, 0, 0.55));
      }
      .cover-kicker {
        margin: 0 0 0.35rem;
        font-family: var(--font-mono);
        font-size: 0.72rem;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--ct-primary);
        font-weight: 700;
      }
      .cover-title {
        margin: 0;
        font-family: var(--font-display);
        font-size: clamp(2.8rem, 6vw, 4.4rem);
        font-weight: 400;
        letter-spacing: 0.03em;
        line-height: 0.95;
        text-shadow: 0 0 40px rgba(255, 236, 179, 0.2);
      }
      .cover-title span {
        color: var(--ct-primary);
      }
      .cover-sub {
        margin: 0.85rem 0 0;
        max-width: 28rem;
        font-size: 1.05rem;
        line-height: 1.5;
        color: var(--ct-secondary);
        font-weight: 500;
      }
      .cover-pages {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
        margin-top: 1.15rem;
      }
      .cover-pages span {
        font-size: 0.68rem;
        font-weight: 650;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: #1a1408;
        background: rgba(245, 197, 24, 0.92);
        padding: 0.28rem 0.55rem;
        border-radius: 999px;
        animation: chip-pop 0.45s var(--ct-ease) both;
      }
      .cover-pages span:nth-child(2) {
        animation-delay: 0.08s;
      }
      .cover-pages span:nth-child(3) {
        animation-delay: 0.16s;
      }
      .cover-pages span:nth-child(4) {
        animation-delay: 0.24s;
      }
      .cover-pages span:nth-child(5) {
        animation-delay: 0.32s;
      }
      .cover-pages span:nth-child(6) {
        animation-delay: 0.4s;
      }
      .cover-cta {
        margin: 1.35rem 0 0;
        font-family: var(--font-mono);
        font-size: 0.78rem;
        color: var(--ct-mute);
        letter-spacing: 0.04em;
      }
      .cover-cta strong {
        color: var(--ct-primary);
      }
      @keyframes tile-float {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-6px);
        }
      }
      @keyframes cover-copy-in {
        from {
          opacity: 0;
          transform: translateX(-1rem);
        }
        to {
          opacity: 1;
          transform: none;
        }
      }
      @keyframes chip-pop {
        from {
          opacity: 0;
          transform: translateY(0.4rem) scale(0.96);
        }
        to {
          opacity: 1;
          transform: none;
        }
      }
      @media (max-width: 900px) {
        .cover-collage {
          grid-template-columns: 1fr 1fr;
          grid-template-rows: repeat(3, 1fr);
          transform: none;
          inset: 0;
          opacity: 0.78;
        }
        .cover-copy {
          text-align: center;
          max-width: 100%;
        }
        .cover-logo {
          margin-inline: auto;
        }
        .cover-pages {
          justify-content: center;
        }
      }

      .box {
        padding: 1.35rem 1.4rem;
        min-height: 100%;
        animation: ct-fade-up 0.5s var(--ct-ease);
      }
      .box.cinema-open {
        padding: 0.5rem 0.75rem 0.65rem;
        min-height: 0;
        height: 100%;
        box-sizing: border-box;
      }
      .box.folder .tree {
        max-height: min(42vh, 380px);
        overflow-y: auto;
        overflow-x: hidden;
        padding-right: 0.4rem;
        margin: 0;
        -webkit-overflow-scrolling: touch;
        flex: 1 1 auto;
        min-width: 0;
      }
      .folder-layout {
        display: grid;
        grid-template-columns: minmax(0, 1.05fr) minmax(180px, 0.95fr);
        gap: 0.85rem;
        align-items: start;
        min-height: 0;
      }
      .folder-brief {
        padding: 0.95rem 1rem;
        border-radius: 14px;
        background: rgba(28, 25, 22, 0.9);
        border: 1px solid color-mix(in srgb, var(--tone, #f5c518) 35%, rgba(247, 241, 232, 0.1));
        box-shadow:
          inset 3px 0 var(--tone, #f5c518),
          0 16px 40px -24px rgba(0, 0, 0, 0.75);
        animation: ct-fade-up 0.4s var(--ct-ease);
      }
      .folder-brief em {
        display: block;
        font-style: normal;
        font-family: var(--font-mono);
        font-size: 0.68rem;
        letter-spacing: 0.1em;
        color: var(--tone, #f5c518);
        margin-bottom: 0.4rem;
      }
      .folder-brief p {
        margin: 0;
        font-size: 0.95rem;
        line-height: 1.45;
        color: var(--ct-text);
        font-weight: 500;
      }
      .folder-example {
        margin-top: 0.75rem;
        padding-top: 0.7rem;
        border-top: 1px solid rgba(247, 241, 232, 0.1);
        display: grid;
        gap: 0.25rem;
      }
      .folder-example strong {
        font-size: 0.68rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #f5c518;
      }
      .folder-example span {
        font-size: 0.82rem;
        line-height: 1.4;
        color: var(--ct-secondary);
        font-weight: 500;
      }
      @media (max-width: 700px) {
        .folder-layout {
          grid-template-columns: 1fr;
        }
      }
      .box.center {
        display: grid;
        place-content: center;
        justify-items: center;
        text-align: center;
        gap: 0.7rem;
      }
      .intro h2 {
        background: var(--ct-gradient);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }
      .logo {
        object-fit: contain;
        filter: drop-shadow(0 12px 28px rgba(245, 197, 24, 0.22));
        margin-bottom: 0.2rem;
        animation: ct-scale-in 0.65s var(--ct-ease);
      }
      .logo.sm {
        margin-bottom: 0.55rem;
        border-radius: 16px;
        background: transparent;
        box-shadow: none;
      }
      .box-title {
        font-size: 0.8rem;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--ct-mute);
        margin-bottom: 1rem;
      }
      .request-flow .box-title {
        font-size: 0.9rem;
        color: var(--ct-secondary);
      }
      h2 {
        margin: 0;
        font-family: var(--font-display);
        font-size: clamp(2rem, 3.6vw, 2.85rem);
        font-weight: 800;
        color: var(--ct-text);
        letter-spacing: -0.035em;
        line-height: 1.1;
      }
      .stage[data-kind='cover'],
      .stage[data-kind='engine'],
      .stage[data-kind='boot'],
      .stage[data-kind='plugins'],
      .stage[data-kind='globals'],
      .stage[data-kind='folder'],
      .stage[data-kind='bullets'],
      .stage[data-kind='ideas'],
      .stage[data-kind='ui'],
      .stage[data-kind='tmdb'],
      .stage[data-kind='compare'],
      .stage[data-kind='demo'],
      .stage[data-kind='modules'],
      .stage[data-kind='auth'],
      .stage[data-kind='finale'],
      .stage[data-kind='title'],
      .stage[data-kind='request'] {
        background:
          radial-gradient(ellipse 55% 45% at 50% 0%, rgba(255, 220, 140, 0.14), transparent 55%),
          radial-gradient(ellipse 80% 60% at 50% 100%, rgba(0, 0, 0, 0.55), transparent 60%),
          linear-gradient(180deg, #161310 0%, #0a0908 100%);
        border-color: rgba(247, 241, 232, 0.1);
        color: var(--ct-text);
        position: relative;
        overflow: auto;
      }
      .stage[data-kind='request'] {
        overflow: hidden;
      }
      .stage[data-kind='engine']::before,
      .stage[data-kind='boot']::before,
      .stage[data-kind='plugins']::before,
      .stage[data-kind='globals']::before {
        content: '';
        position: absolute;
        inset: -20% 20% auto;
        height: 70%;
        background: radial-gradient(ellipse at center top, rgba(255, 236, 179, 0.22), transparent 68%);
        pointer-events: none;
        animation: spot-breathe 4.5s ease-in-out infinite;
      }

      .fastify-assembly {
        height: 100%;
        min-height: 0;
        padding: 0.7rem 0.9rem 0.55rem;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        overflow: hidden;
      }
      .assembly-heading {
        display: grid;
        justify-items: center;
        gap: 0.15rem;
        position: relative;
        z-index: 3;
      }
      .assembly-heading span {
        color: #f5c518;
        font-family: var(--font-mono);
        font-size: 0.58rem;
        letter-spacing: 0.18em;
      }
      .assembly-heading strong {
        color: var(--ct-text);
        font-family: var(--font-display);
        font-size: clamp(1.1rem, 2.1vw, 1.55rem);
        letter-spacing: 0.015em;
      }
      .assembly-map {
        position: relative;
        flex: 1;
        width: min(100%, 670px);
        min-height: 255px;
        margin: 0 auto;
      }
      .assembly-links {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        overflow: visible;
        z-index: 0;
      }
      .assembly-links line {
        vector-effect: non-scaling-stroke;
        stroke: rgba(245, 197, 24, 0.5);
        stroke-width: 1.4;
        stroke-dasharray: 5 8;
        marker-end: url(#attach-arrow);
        animation: attach-flow 1.25s linear infinite;
      }
      .assembly-links line:nth-of-type(2) { animation-delay: -0.25s; }
      .assembly-links line:nth-of-type(3) { animation-delay: -0.5s; }
      .assembly-links line:nth-of-type(4) { animation-delay: -0.75s; }
      .assembly-links line:nth-of-type(5) { animation-delay: -1s; }
      .assembly-links path {
        fill: #f5c518;
      }
      .assembly-node {
        position: absolute;
        z-index: 2;
        width: 118px;
        padding: 0.48rem 0.55rem;
        transform: translate(-50%, -50%);
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 0.06rem 0.42rem;
        align-items: center;
        border: 1px solid rgba(247, 241, 232, 0.13);
        border-radius: 10px;
        background: rgba(25, 22, 18, 0.94);
        box-shadow: 0 14px 34px -20px rgba(0, 0, 0, 0.9);
        animation: attach-arrive 0.65s var(--ct-ease) both;
      }
      .assembly-node i {
        grid-row: 1 / 3;
        width: 1.35rem;
        height: 1.35rem;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background: rgba(245, 197, 24, 0.11);
        color: #f5c518;
        font: normal 0.52rem var(--font-mono);
      }
      .assembly-node strong {
        color: var(--ct-text);
        font-size: 0.73rem;
        line-height: 1.1;
      }
      .assembly-node small {
        color: var(--ct-mute);
        font-size: 0.51rem;
        line-height: 1.15;
      }
      .assembly-node.config { left: 17%; top: 18%; animation-delay: 0.1s; }
      .assembly-node.plugins { left: 83%; top: 18%; animation-delay: 0.2s; }
      .assembly-node.common { left: 14%; top: 70%; animation-delay: 0.3s; }
      .assembly-node.database { left: 50%; top: 88%; animation-delay: 0.4s; }
      .assembly-node.modules { left: 86%; top: 70%; animation-delay: 0.5s; }
      .assembly-core {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 142px;
        height: 142px;
        transform: translate(-50%, -50%);
        display: grid;
        place-items: center;
        z-index: 2;
      }
      .core-orbit {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        border: 1px solid rgba(245, 197, 24, 0.28);
        animation: core-pulse 2.5s ease-out infinite;
      }
      .core-orbit.two {
        inset: 10px;
        animation-delay: 1.2s;
      }
      .core-disc {
        width: 112px;
        height: 112px;
        border-radius: 50%;
        display: grid;
        place-content: center;
        justify-items: center;
        background:
          radial-gradient(circle at 38% 30%, rgba(255, 237, 168, 0.2), transparent 35%),
          linear-gradient(145deg, #292318, #12100d);
        border: 2px solid #f5c518;
        box-shadow:
          0 0 0 7px rgba(245, 197, 24, 0.08),
          0 0 42px rgba(245, 197, 24, 0.25);
      }
      .core-disc em {
        color: var(--ct-mute);
        font: normal 0.5rem var(--font-mono);
        text-transform: uppercase;
        letter-spacing: 0.1em;
      }
      .core-disc strong {
        margin: 0.08rem 0 0.12rem;
        color: #fff;
        font-family: var(--font-display);
        font-size: 1.35rem;
        letter-spacing: 0.04em;
      }
      .core-disc code {
        color: #f5c518;
        font-size: 0.46rem;
      }
      .assembly-summary {
        position: relative;
        z-index: 3;
        margin: 0.2rem auto 0;
        color: var(--ct-secondary);
        font-size: 0.7rem;
        text-align: center;
      }
      .assembly-summary strong {
        color: #f5c518;
      }
      @keyframes attach-flow {
        to { stroke-dashoffset: -26; }
      }
      @keyframes attach-arrive {
        from { opacity: 0; transform: translate(-50%, -50%) scale(0.78); }
        to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      }
      @keyframes core-pulse {
        0% { opacity: 0.7; transform: scale(0.78); }
        75%, 100% { opacity: 0; transform: scale(1.18); }
      }
      @media (max-width: 700px) {
        .assembly-node {
          width: 94px;
          padding: 0.4rem;
        }
        .assembly-node small {
          display: none;
        }
        .assembly-node i {
          grid-row: auto;
        }
        .assembly-core {
          width: 120px;
          height: 120px;
        }
        .core-disc {
          width: 96px;
          height: 96px;
        }
      }
      .spot-mini {
        width: 120px;
        height: 80px;
        margin: 0 auto 0.75rem;
        background: radial-gradient(ellipse at center top, rgba(255, 236, 179, 0.35), transparent 70%);
        clip-path: polygon(35% 0, 65% 0, 100% 100%, 0 100%);
        animation: spot-breathe 3.5s ease-in-out infinite;
      }
      .bullets li {
        background: rgba(28, 25, 22, 0.85);
        border-color: rgba(245, 197, 24, 0.16);
        color: var(--ct-text);
        box-shadow: 0 0 0 1px rgba(255, 236, 179, 0.04), var(--ct-shadow);
      }
      .storyboard .tree li {
        color: rgba(247, 241, 232, 0.28);
      }
      .storyboard .tree li.past {
        color: rgba(247, 241, 232, 0.5);
      }
      .storyboard .tree li.on {
        color: #fff !important;
        background: rgba(245, 197, 24, 0.14);
        box-shadow: inset 3px 0 #f5c518;
      }
      .bp-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.5rem;
      }
      .bp-head .box-title {
        margin: 0;
      }
      .bp-stamp {
        font-family: var(--font-mono);
        font-size: 0.62rem;
        letter-spacing: 0.1em;
        color: #f5c518;
        border: 1px dashed rgba(245, 197, 24, 0.4);
        padding: 0.2rem 0.45rem;
        border-radius: 6px;
      }
      .cue-sheet,
      .credits,
      .vaults {
        color: var(--ct-text);
      }
      .rx-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.85rem;
      }
      .rx-head .box-title {
        margin: 0;
      }
      .rx-live {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        font-family: var(--font-mono);
        font-size: 0.68rem;
        letter-spacing: 0.12em;
        color: #f5c518;
      }
      .rx-live i {
        width: 0.4rem;
        height: 0.4rem;
        border-radius: 50%;
        background: #f5c518;
        box-shadow: 0 0 8px #f5c518;
        animation: eng-blink 1.2s ease-in-out infinite;
      }
      .rx-track {
        display: flex;
        flex-direction: column;
      }
      .rx-step {
        position: relative;
        display: grid;
        grid-template-columns: 2.4rem 1fr;
        gap: 0.75rem;
        align-items: start;
        padding: 0.55rem 0.35rem;
        opacity: 0.28;
        filter: grayscale(0.35);
        transition: opacity 0.45s var(--ct-ease), transform 0.45s var(--ct-ease), filter 0.45s var(--ct-ease);
      }
      .rx-step.past {
        opacity: 0.55;
        filter: none;
      }
      .rx-step.on {
        opacity: 1;
        filter: none;
      }
      .rx-step.pulse {
        transform: translateX(4px);
      }
      .rx-step.on .rx-label {
        text-shadow: 0 0 24px rgba(255, 236, 179, 0.25);
      }
      .rx-node {
        position: relative;
        width: 2.2rem;
        height: 2.2rem;
        border-radius: 50%;
        display: grid;
        place-items: center;
        font-family: var(--font-mono);
        font-size: 0.75rem;
        font-weight: 700;
        color: #f5c518;
        background: rgba(245, 197, 24, 0.1);
        border: 2px solid rgba(245, 197, 24, 0.28);
        z-index: 1;
      }
      .rx-step.past .rx-node {
        background: rgba(245, 197, 24, 0.2);
        border-color: transparent;
        color: #ffe08a;
      }
      .rx-step.on .rx-node {
        background: var(--ct-gradient);
        border-color: transparent;
        color: #1a1408;
        box-shadow: 0 0 28px rgba(245, 197, 24, 0.55);
      }
      .rx-ping {
        position: absolute;
        inset: -6px;
        border-radius: 50%;
        border: 2px solid rgba(255, 236, 179, 0.55);
        animation: rf-ping 1.4s ease-out infinite;
      }
      .rx-label strong {
        display: block;
        font-size: 1rem;
        font-weight: 700;
        letter-spacing: -0.02em;
      }
      .rx-label small {
        display: block;
        margin-top: 0.15rem;
        font-size: 0.75rem;
        color: var(--ct-secondary);
      }
      .rx-pipe {
        position: absolute;
        left: 1.3rem;
        top: 2.5rem;
        bottom: -0.55rem;
        width: 2px;
        background: rgba(247, 241, 232, 0.12);
      }
      .rx-pipe.lit {
        background: linear-gradient(180deg, #f5c518, #ff8a5b);
        box-shadow: 0 0 10px rgba(245, 197, 24, 0.45);
      }
      .credits-banner {
        text-align: center;
        margin-bottom: 0.85rem;
      }
      .credits-banner span {
        display: block;
        font-family: var(--font-mono);
        font-size: 0.65rem;
        letter-spacing: 0.16em;
        color: #f5c518;
        margin-bottom: 0.25rem;
      }
      .credits-banner strong {
        font-size: 1.15rem;
        font-weight: 800;
        letter-spacing: -0.02em;
      }
      .rack-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 0.5rem;
      }
      .rack-grid.overview {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.55rem;
      }
      .rack-bay {
        padding: 0.7rem 0.6rem;
        border-radius: 14px;
        background: rgba(20, 18, 16, 0.85);
        border: 1px solid rgba(247, 241, 232, 0.1);
        text-align: left;
        opacity: 0.28;
        filter: brightness(0.55);
        transition: opacity 0.35s var(--ct-ease), transform 0.35s var(--ct-ease), border-color 0.35s var(--ct-ease), box-shadow 0.35s var(--ct-ease), filter 0.35s var(--ct-ease);
        animation: ct-fade-up 0.4s var(--ct-ease) both;
      }
      .rack-grid.overview .rack-bay {
        opacity: 1;
        filter: none;
        padding: 0.75rem 0.85rem;
        border-color: rgba(245, 197, 24, 0.16);
        background: rgba(28, 25, 22, 0.88);
      }
      .rack-bay.on {
        opacity: 0.75;
        filter: none;
      }
      .rack-bay.past {
        opacity: 0.5;
        filter: none;
      }
      .rack-bay.focus {
        opacity: 1;
        filter: none;
        transform: translateY(-3px) scale(1.02);
        border-color: rgba(245, 197, 24, 0.55);
        box-shadow: 0 0 32px rgba(245, 197, 24, 0.28);
        background: rgba(40, 34, 26, 0.95);
      }
      .rack-bay em {
        display: block;
        font-style: normal;
        font-family: var(--font-mono);
        font-size: 0.62rem;
        color: #f5c518;
        margin-bottom: 0.2rem;
      }
      .rack-bay strong {
        display: block;
        font-size: 0.88rem;
        font-weight: 700;
        letter-spacing: -0.01em;
      }
      .rack-bay p {
        margin: 0.35rem 0 0;
        font-size: 0.78rem;
        color: var(--ct-secondary);
        line-height: 1.4;
      }
      .rack-grid.overview .rack-bay p {
        display: block;
      }
      .idea-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.55rem;
      }
      .idea-grid[data-count='3'] {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
      .idea-grid[data-count='5'],
      .idea-grid[data-count='6'] {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
      .idea-card {
        padding: 0.8rem 0.85rem;
        border-radius: 14px;
        background: rgba(28, 25, 22, 0.88);
        border: 1px solid rgba(245, 197, 24, 0.16);
        text-align: left;
        animation: ct-fade-up 0.45s var(--ct-ease) both;
      }
      .idea-card em {
        display: block;
        font-style: normal;
        font-family: var(--font-mono);
        font-size: 0.62rem;
        color: #f5c518;
        margin-bottom: 0.2rem;
      }
      .idea-card strong {
        display: block;
        font-size: 0.95rem;
        font-weight: 700;
        letter-spacing: -0.01em;
      }
      .idea-card p {
        margin: 0.35rem 0 0;
        font-size: 0.8rem;
        color: var(--ct-secondary);
        line-height: 1.4;
      }

      /* External TMDb integration */
      .external-api {
        height: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 1rem;
        padding: 1rem;
      }
      .api-flow {
        display: grid;
        grid-template-columns: minmax(120px, 1fr) minmax(95px, 0.65fr) minmax(145px, 1.15fr) minmax(95px, 0.65fr) minmax(125px, 1fr);
        align-items: center;
        gap: 0.5rem;
      }
      .api-node {
        min-height: 125px;
        padding: 0.8rem;
        border-radius: 12px;
        border: 1px solid rgba(247, 241, 232, 0.12);
        background: rgba(20, 18, 16, 0.92);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 0.25rem;
        animation: ct-fade-up 0.45s var(--ct-ease) both;
      }
      .api-node strong {
        font-size: 0.9rem;
      }
      .api-node small {
        font-size: 0.7rem;
        color: var(--ct-secondary);
        line-height: 1.35;
      }
      .api-node em {
        margin-top: 0.25rem;
        padding: 0.15rem 0.4rem;
        border-radius: 999px;
        background: rgba(245, 197, 24, 0.12);
        color: var(--ct-primary);
        font-size: 0.62rem;
        font-style: normal;
        font-family: var(--font-mono);
      }
      .api-icon,
      .tmdb-mark {
        min-width: 2.25rem;
        height: 2.25rem;
        padding-inline: 0.4rem;
        display: grid;
        place-items: center;
        border-radius: 8px;
        font-family: var(--font-mono);
        font-weight: 800;
        margin-bottom: 0.2rem;
      }
      .angular-node .api-icon {
        background: #dd0031;
        color: white;
      }
      .fastify-node {
        border-color: rgba(245, 197, 24, 0.38);
        box-shadow: 0 0 25px rgba(245, 197, 24, 0.1);
      }
      .fastify-node .api-icon {
        background: var(--ct-primary);
        color: #1a1408;
      }
      .tmdb-node {
        border-color: rgba(1, 180, 228, 0.35);
      }
      .tmdb-mark {
        background: linear-gradient(90deg, #90cea1, #01b4e4);
        color: #032541;
        font-size: 0.67rem;
        letter-spacing: 0.03em;
      }
      .api-link {
        display: grid;
        gap: 0.35rem;
        text-align: center;
        font-family: var(--font-mono);
        font-size: 0.6rem;
        color: var(--ct-secondary);
      }
      .api-link i {
        height: 2px;
        position: relative;
        background: linear-gradient(90deg, rgba(245, 197, 24, 0.2), var(--ct-primary));
      }
      .api-link i::after {
        content: '';
        position: absolute;
        right: -1px;
        top: 50%;
        width: 7px;
        height: 7px;
        border-top: 2px solid var(--ct-primary);
        border-right: 2px solid var(--ct-primary);
        transform: translateY(-50%) rotate(45deg);
      }
      .api-link.outbound i {
        background: linear-gradient(90deg, rgba(1, 180, 228, 0.2), #01b4e4);
      }
      .api-link.outbound i::after {
        border-color: #01b4e4;
      }
      .api-rules {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 0.5rem;
      }
      .api-rules > div {
        padding: 0.6rem 0.65rem;
        border-radius: 9px;
        background: rgba(255, 255, 255, 0.035);
        border: 1px solid rgba(247, 241, 232, 0.08);
      }
      .api-rules strong,
      .api-rules span {
        display: block;
      }
      .api-rules strong {
        font-size: 0.75rem;
        color: var(--ct-primary);
      }
      .api-rules span {
        margin-top: 0.18rem;
        font-size: 0.67rem;
        color: var(--ct-secondary);
        line-height: 1.3;
      }
      .tmdb-screens {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0.5rem;
        min-height: 0;
      }
      .tmdb-screens figure {
        position: relative;
        margin: 0;
        height: 105px;
        overflow: hidden;
        border-radius: 9px;
        border: 1px solid rgba(247, 241, 232, 0.12);
      }
      .tmdb-screens img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: top center;
      }
      .tmdb-screens figcaption {
        position: absolute;
        left: 0.4rem;
        bottom: 0.4rem;
        padding: 0.16rem 0.38rem;
        border-radius: 999px;
        background: rgba(5, 4, 3, 0.86);
        color: var(--ct-primary);
        font-size: 0.62rem;
        font-weight: 700;
      }

      /* React vs Angular */
      .framework-compare {
        height: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 0.65rem;
        padding: 0.85rem 1rem;
      }
      .compare-head {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        gap: 0.75rem;
      }
      .framework {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.55rem;
        padding: 0.55rem;
        border-radius: 10px;
        border: 1px solid rgba(247, 241, 232, 0.1);
        background: rgba(20, 18, 16, 0.9);
      }
      .framework-logo {
        width: 2.2rem;
        height: 2.2rem;
        display: grid;
        place-items: center;
        border-radius: 9px;
        font-size: 1.2rem;
        font-weight: 800;
      }
      .framework.react .framework-logo {
        color: #61dafb;
        background: rgba(97, 218, 251, 0.12);
      }
      .framework.angular .framework-logo {
        color: white;
        background: #dd0031;
      }
      .framework strong,
      .framework small {
        display: block;
      }
      .framework strong {
        font-size: 0.95rem;
      }
      .framework small {
        color: var(--ct-secondary);
        font-size: 0.65rem;
      }
      .versus {
        font-family: var(--font-mono);
        color: var(--ct-mute);
        font-size: 0.68rem;
        font-weight: 800;
      }
      .compare-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.65rem;
      }
      .compare-col {
        display: grid;
        gap: 0.3rem;
        padding: 0.65rem;
        border-radius: 11px;
        border: 1px solid rgba(247, 241, 232, 0.1);
        background: rgba(14, 12, 10, 0.78);
      }
      .react-col {
        border-top: 2px solid #61dafb;
      }
      .angular-col {
        border-top: 2px solid #dd0031;
      }
      .col-label {
        font-family: var(--font-mono);
        font-size: 0.62rem;
        color: var(--ct-secondary);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin-bottom: 0.15rem;
      }
      .compare-row {
        display: grid;
        grid-template-columns: 4.2rem 1fr;
        gap: 0.45rem;
        padding: 0.32rem 0.4rem;
        border-radius: 7px;
        background: rgba(255, 255, 255, 0.025);
        font-size: 0.7rem;
      }
      .compare-row b {
        color: var(--ct-text);
      }
      .compare-row span {
        color: var(--ct-secondary);
      }
      .compare-note {
        margin: 0;
        text-align: center;
        color: var(--ct-secondary);
        font-size: 0.75rem;
      }
      .fit-banner {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 0.35rem;
        padding: 0.55rem 0.7rem;
        border-radius: 10px;
        border: 1px solid rgba(245, 197, 24, 0.24);
        background: rgba(245, 197, 24, 0.07);
        font-size: 0.68rem;
      }
      .fit-banner span {
        color: var(--ct-secondary);
      }
      .fit-banner i {
        color: var(--ct-mute);
        font-style: normal;
      }
      .fit-banner em {
        color: var(--ct-primary);
        font-style: normal;
        font-weight: 700;
        margin-left: 0.3rem;
      }

      /* Recorded product demo */
      .demo-stage {
        height: 100%;
        box-sizing: border-box;
        display: grid;
        grid-template-rows: minmax(0, 1fr) auto;
        gap: 0.6rem;
        padding: 0.7rem;
      }
      .demo-player {
        position: relative;
        min-height: 0;
        overflow: hidden;
        border-radius: 12px;
        border: 1px solid rgba(247, 241, 232, 0.12);
        background: #050505;
        box-shadow: 0 24px 50px -28px rgba(0, 0, 0, 0.9);
      }
      .demo-player video {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
        background: #050505;
      }
      .demo-badge {
        position: absolute;
        top: 0.55rem;
        left: 0.55rem;
        display: flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.25rem 0.5rem;
        border-radius: 999px;
        background: rgba(5, 4, 3, 0.82);
        backdrop-filter: blur(8px);
        font-size: 0.62rem;
        color: var(--ct-text);
      }
      .demo-badge i {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #ef4444;
        box-shadow: 0 0 8px rgba(239, 68, 68, 0.7);
      }
      .demo-chapters {
        display: grid;
        grid-template-columns: repeat(6, minmax(0, 1fr));
        gap: 0.4rem;
      }
      .demo-chapters span {
        padding: 0.38rem 0.5rem;
        border-radius: 8px;
        border: 1px solid rgba(247, 241, 232, 0.08);
        background: rgba(28, 25, 22, 0.8);
        font-size: 0.68rem;
        color: var(--ct-secondary);
      }
      .demo-chapters b {
        color: var(--ct-primary);
        font-family: var(--font-mono);
        margin-right: 0.25rem;
      }

      /* Angular UI lesson mocks */
      .ui-lesson {
        padding: 0.85rem 0.95rem;
        height: 100%;
        box-sizing: border-box;
      }
      .ui-split {
        display: grid;
        grid-template-columns: minmax(0, 1.45fr) minmax(190px, 0.75fr);
        gap: 0.85rem;
        height: 100%;
        min-height: 0;
        align-items: stretch;
      }
      .ui-frame {
        min-height: min(52vh, 420px);
      }
      .ui-frame {
        border-radius: 12px;
        background: #0e0c0a;
        border: 1px solid rgba(247, 241, 232, 0.12);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        min-height: 0;
        box-shadow: 0 16px 36px -22px rgba(0, 0, 0, 0.7);
      }
      .ui-frame.shot {
        background: #050505;
      }
      .ui-shot {
        position: relative;
        flex: 1;
        min-height: 0;
        overflow: hidden;
        background: #0a0a0a;
        display: grid;
        place-items: center;
      }
      .ui-shot img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: top center;
      }
      .ui-shot-tag {
        display: none;
      }
      .ui-browser {
        display: flex;
        align-items: center;
        gap: 0.65rem;
        padding: 0.45rem 0.7rem;
        background: #1a1714;
        border-bottom: 1px solid rgba(247, 241, 232, 0.08);
      }
      .ui-dots {
        display: flex;
        gap: 0.28rem;
      }
      .ui-dots i {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #5a534a;
        display: block;
      }
      .ui-dots i:first-child {
        background: #ff5f57;
      }
      .ui-dots i:nth-child(2) {
        background: #febc2e;
      }
      .ui-dots i:nth-child(3) {
        background: #28c840;
      }
      .ui-url {
        flex: 1;
        font-family: var(--font-mono);
        font-size: 0.68rem;
        color: var(--ct-secondary);
        background: rgba(0, 0, 0, 0.35);
        border-radius: 999px;
        padding: 0.22rem 0.7rem;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .ui-cap {
        flex-shrink: 0;
        font-size: 0.62rem;
        font-weight: 600;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--ct-mute);
        font-family: var(--font-mono);
      }
      .mock-app {
        display: grid;
        grid-template-columns: 118px 1fr;
        flex: 1;
        min-height: 210px;
      }
      .mock-side {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        padding: 0.7rem 0.55rem;
        background: #14110e;
        border-right: 1px solid rgba(247, 241, 232, 0.08);
        font-size: 0.72rem;
        color: #9a9288;
      }
      .mock-brand {
        color: #f5c518;
        font-family: var(--font-display);
        font-size: 0.95rem;
        letter-spacing: 0.04em;
        margin-bottom: 0.35rem;
      }
      .mock-side span {
        padding: 0.28rem 0.4rem;
        border-radius: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.35rem;
      }
      .mock-side span.on {
        background: rgba(245, 197, 24, 0.14);
        color: #f7f1e8;
      }
      .mock-side b {
        font-size: 0.62rem;
        background: #f5c518;
        color: #1a1408;
        border-radius: 999px;
        min-width: 1.1rem;
        text-align: center;
        padding: 0.05rem 0.28rem;
      }
      .mock-side .pulse-badge b.bump {
        animation: badge-pop 1.2s ease-in-out infinite;
      }
      @keyframes badge-pop {
        0%,
        100% {
          transform: scale(1);
        }
        40% {
          transform: scale(1.2);
        }
      }
      .mock-main {
        padding: 0.7rem 0.75rem;
        display: flex;
        flex-direction: column;
        gap: 0.55rem;
        min-width: 0;
      }
      .mock-main header {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 0.5rem;
      }
      .mock-main header em {
        font-style: normal;
        font-weight: 700;
        font-size: 0.95rem;
      }
      .mock-main header small,
      .mock-main header code {
        font-size: 0.68rem;
        color: #f5c518;
        font-family: var(--font-mono);
      }
      .mock-row {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0.45rem;
      }
      .mock-row.tight {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        max-width: 280px;
      }
      .mock-card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(247, 241, 232, 0.08);
        border-radius: 10px;
        overflow: hidden;
        animation: ct-fade-up 0.45s var(--ct-ease) both;
      }
      .mock-card .ph {
        aspect-ratio: 2 / 3;
        background:
          linear-gradient(180deg, transparent 40%, rgba(0, 0, 0, 0.55)),
          center / cover no-repeat #2a241c;
      }
      .mock-card .ph.alt {
        background: linear-gradient(145deg, #3a2f1f, #1a1612 60%);
      }
      .mock-card .ph.soft {
        background: linear-gradient(145deg, #2a3340, #12151a 60%);
      }
      .mock-card p {
        margin: 0;
        padding: 0.35rem 0.4rem 0.45rem;
        font-size: 0.68rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.3rem;
      }
      .mock-card p i {
        font-style: normal;
        font-size: 0.58rem;
        color: #f5c518;
        border: 1px solid rgba(245, 197, 24, 0.4);
        border-radius: 999px;
        padding: 0.05rem 0.3rem;
      }
      .mock-card .badge {
        display: inline-block;
        margin: 0 0.4rem 0.45rem;
        font-size: 0.58rem;
        padding: 0.12rem 0.35rem;
        border-radius: 999px;
        font-weight: 700;
      }
      .badge.plan {
        background: rgba(96, 165, 250, 0.18);
        color: #93c5fd;
      }
      .badge.watch {
        background: rgba(245, 197, 24, 0.18);
        color: #f5c518;
      }
      .badge.done {
        background: rgba(52, 211, 153, 0.18);
        color: #6ee7b7;
      }
      .mock-pillars {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.55rem;
        padding: 0.85rem;
        flex: 1;
      }
      .pillar {
        padding: 0.75rem 0.8rem;
        border-radius: 12px;
        background: rgba(28, 25, 22, 0.9);
        border: 1px solid rgba(245, 197, 24, 0.16);
        animation: ct-fade-up 0.4s var(--ct-ease) both;
      }
      .pillar em {
        display: block;
        font-style: normal;
        font-family: var(--font-mono);
        font-size: 0.62rem;
        color: #f5c518;
      }
      .pillar strong {
        display: block;
        margin-top: 0.2rem;
        font-size: 0.92rem;
      }
      .pillar span {
        display: block;
        margin-top: 0.25rem;
        font-size: 0.72rem;
        color: var(--ct-secondary);
      }
      .mock-reuse {
        padding: 0.75rem;
        display: flex;
        flex-direction: column;
        gap: 0.65rem;
        flex: 1;
      }
      .reuse-tabs {
        display: flex;
        gap: 0.35rem;
        flex-wrap: wrap;
      }
      .reuse-tabs span {
        font-size: 0.68rem;
        padding: 0.25rem 0.5rem;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.04);
        color: #9a9288;
      }
      .reuse-tabs span.on {
        background: rgba(245, 197, 24, 0.18);
        color: #f5c518;
      }
      .reuse-stage {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .mock-card.hero {
        display: grid;
        grid-template-columns: 72px 1fr;
        gap: 0.65rem;
        padding: 0.55rem;
        flex: 1;
        align-items: center;
      }
      .mock-card.hero .ph {
        aspect-ratio: 2 / 3;
        border-radius: 8px;
      }
      .mock-card.hero small {
        font-size: 0.62rem;
        color: #f5c518;
        font-family: var(--font-mono);
      }
      .mock-card.hero strong {
        display: block;
        font-size: 0.9rem;
        margin: 0.15rem 0;
      }
      .mock-card.hero p {
        padding: 0;
        color: var(--ct-secondary);
        font-weight: 500;
      }
      .reuse-arrows {
        font-size: 0.72rem;
        color: #f5c518;
        white-space: nowrap;
      }
      .signal-flow {
        display: flex;
        align-items: center;
        gap: 0.45rem;
      }
      .sig-box {
        font-family: var(--font-mono);
        font-size: 0.68rem;
        padding: 0.4rem 0.55rem;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(247, 241, 232, 0.1);
      }
      .sig-box.live {
        border-color: rgba(245, 197, 24, 0.45);
        color: #f5c518;
        box-shadow: 0 0 18px rgba(245, 197, 24, 0.18);
      }
      .sig-arrow {
        color: #f5c518;
      }
      .route-note {
        margin: 0;
        font-size: 0.75rem;
        color: var(--ct-secondary);
      }
      .mock-guard {
        display: grid;
        grid-template-columns: 1.1fr 0.9fr;
        gap: 0.7rem;
        padding: 0.85rem;
        flex: 1;
        align-items: center;
      }
      .guard-login {
        padding: 0.85rem;
        border-radius: 12px;
        background: rgba(28, 25, 22, 0.95);
        border: 1px solid rgba(247, 241, 232, 0.1);
        display: grid;
        gap: 0.45rem;
      }
      .guard-login em {
        font-style: normal;
        font-weight: 700;
      }
      .guard-login .field {
        font-size: 0.72rem;
        padding: 0.4rem 0.5rem;
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.35);
        color: var(--ct-secondary);
      }
      .guard-login button {
        margin-top: 0.2rem;
        border: 0;
        border-radius: 8px;
        padding: 0.45rem;
        background: #f5c518;
        color: #1a1408;
        font-weight: 700;
        font-size: 0.78rem;
      }
      .guard-lock {
        padding: 0.9rem;
        border-radius: 12px;
        border: 1px dashed rgba(255, 107, 74, 0.45);
        background: rgba(255, 107, 74, 0.08);
        text-align: center;
      }
      .guard-lock strong {
        display: block;
        color: #ff8a5b;
        font-family: var(--font-mono);
        font-size: 0.85rem;
      }
      .guard-lock p {
        margin: 0.35rem 0;
        font-size: 0.78rem;
      }
      .guard-lock span {
        font-size: 0.72rem;
        color: var(--ct-secondary);
      }
      .mock-search {
        padding: 0.85rem;
        display: flex;
        flex-direction: column;
        gap: 0.55rem;
        flex: 1;
      }
      .search-bar {
        display: flex;
        justify-content: space-between;
        padding: 0.55rem 0.7rem;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(245, 197, 24, 0.28);
        font-size: 0.78rem;
      }
      .search-bar strong {
        color: #f5c518;
        font-family: var(--font-mono);
        font-weight: 600;
      }
      .debounce-rail {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        font-size: 0.68rem;
        color: var(--ct-secondary);
      }
      .debounce-rail i {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #3a342c;
        display: block;
      }
      .debounce-rail i.on {
        background: #f5c518;
        box-shadow: 0 0 10px rgba(245, 197, 24, 0.5);
      }
      .net-row {
        display: flex;
        align-items: center;
        gap: 0.55rem;
      }
      .net-pill {
        font-family: var(--font-mono);
        font-size: 0.68rem;
        padding: 0.35rem 0.55rem;
        border-radius: 999px;
        background: rgba(96, 165, 250, 0.12);
        color: #93c5fd;
      }
      .net-spin {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: 2px solid rgba(245, 197, 24, 0.25);
        border-top-color: #f5c518;
        animation: rf-spin 0.8s linear infinite;
      }
      .mock-di {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.65rem;
        flex: 1;
      }
      .di-services,
      .di-pages {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
        justify-content: center;
      }
      .di-svc,
      .di-pages span {
        padding: 0.45rem 0.65rem;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(247, 241, 232, 0.1);
        font-size: 0.75rem;
        font-weight: 600;
      }
      .di-svc.on {
        border-color: rgba(245, 197, 24, 0.5);
        color: #f5c518;
        box-shadow: 0 0 20px rgba(245, 197, 24, 0.15);
      }
      .di-arrow {
        font-family: var(--font-mono);
        font-size: 0.78rem;
        color: #f5c518;
      }
      .mock-details {
        display: grid;
        grid-template-columns: 110px 1fr;
        gap: 0.85rem;
        padding: 0.9rem;
        flex: 1;
        align-items: center;
      }
      .det-poster {
        aspect-ratio: 2 / 3;
        border-radius: 10px;
        background: center / cover no-repeat #2a241c;
        box-shadow: 0 12px 28px -12px rgba(0, 0, 0, 0.8);
      }
      .det-copy small {
        font-size: 0.62rem;
        letter-spacing: 0.08em;
        color: var(--ct-secondary);
      }
      .det-copy strong {
        display: block;
        font-size: 1.15rem;
        margin: 0.2rem 0;
      }
      .det-copy p {
        margin: 0 0 0.65rem;
        font-family: var(--font-mono);
        font-size: 0.68rem;
        color: #f5c518;
      }
      .det-btn {
        border: 0;
        border-radius: 10px;
        padding: 0.5rem 0.75rem;
        background: #f5c518;
        color: #1a1408;
        font-weight: 700;
        font-size: 0.78rem;
      }
      .det-toast {
        margin-top: 0.55rem;
        font-size: 0.72rem;
        color: #6ee7b7;
        animation: ct-fade-up 0.5s var(--ct-ease);
      }
      .ui-aside {
        display: flex;
        flex-direction: column;
        gap: 0.65rem;
        min-height: 0;
        overflow: auto;
      }
      .ui-example {
        padding: 0.7rem 0.75rem;
        border-radius: 10px;
        background: rgba(28, 25, 22, 0.9);
        border: 1px solid rgba(247, 241, 232, 0.1);
        border-left: 3px solid rgba(245, 197, 24, 0.65);
      }
      .ui-example em {
        display: block;
        font-style: normal;
        font-size: 0.62rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--ct-primary);
        margin-bottom: 0.3rem;
        font-weight: 700;
        font-family: var(--font-mono);
      }
      .ui-example p {
        margin: 0;
        font-size: 0.82rem;
        line-height: 1.45;
        color: var(--ct-text);
        font-weight: 500;
      }
      .ui-points {
        display: grid;
        gap: 0.35rem;
      }
      .ui-point {
        padding: 0.5rem 0.6rem;
        border-radius: 8px;
        background: rgba(28, 25, 22, 0.75);
        border: 1px solid rgba(247, 241, 232, 0.08);
      }
      .ui-point strong {
        display: block;
        font-size: 0.78rem;
      }
      .ui-point p {
        margin: 0.15rem 0 0;
        font-size: 0.72rem;
        color: var(--ct-secondary);
        line-height: 1.35;
      }
      .ui-point small {
        display: none;
      }
      .ui-bullets {
        margin: 0;
        padding: 0;
        list-style: none;
        display: grid;
        gap: 0.4rem;
      }
      .ui-bullets li {
        padding: 0.55rem 0.7rem;
        border-radius: 10px;
        background: rgba(28, 25, 22, 0.85);
        border: 1px solid rgba(247, 241, 232, 0.08);
        font-size: 0.84rem;
        font-weight: 500;
        animation: ct-fade-up 0.4s var(--ct-ease) both;
      }

      .vaults {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
        min-height: 100%;
        align-content: center;
      }
      .vault {
        position: relative;
        padding: 1.2rem 1.1rem 1.1rem;
        border-radius: 18px;
        background: rgba(20, 18, 16, 0.85);
        border: 1px solid rgba(247, 241, 232, 0.1);
        overflow: hidden;
        opacity: 0.32;
        filter: brightness(0.6);
        transition: opacity 0.35s var(--ct-ease), transform 0.35s var(--ct-ease), box-shadow 0.35s var(--ct-ease), filter 0.35s var(--ct-ease);
      }
      .vault.on {
        opacity: 1;
        filter: none;
        transform: translateY(-2px);
        box-shadow: 0 0 40px rgba(245, 197, 24, 0.18);
        border-color: rgba(245, 197, 24, 0.28);
      }
      .vault.past {
        opacity: 0.5;
        filter: none;
      }
      .vault-tag {
        font-family: var(--font-mono);
        font-size: 0.62rem;
        letter-spacing: 0.12em;
        color: #f5c518;
        margin-bottom: 0.55rem;
      }
      .vault strong {
        display: block;
        font-size: 1.25rem;
        font-weight: 800;
        letter-spacing: -0.03em;
        margin-bottom: 0.35rem;
      }
      .vault p {
        margin: 0;
        color: var(--ct-secondary);
        font-size: 0.88rem;
        line-height: 1.4;
      }
      .vault-bar {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 4px;
        background: linear-gradient(90deg, #ff6b4a, #f5c518);
      }
      .vault-bar.ok {
        background: linear-gradient(90deg, #f5c518, #ffe08a);
      }
      @keyframes eng-blink {
        50% {
          opacity: 0.35;
        }
      }

      .muted {
        margin: 0;
        color: var(--ct-secondary);
        font-size: 1.1rem;
        max-width: 38ch;
        line-height: 1.55;
        font-weight: 500;
      }
      .muted.big {
        font-size: 1.2rem;
        max-width: 28ch;
      }
      .bullets ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 0.75rem;
        width: min(420px, 100%);
      }
      .bullets li {
        padding: 1rem 1.15rem;
        border-radius: 16px;
        background: rgba(28, 25, 22, 0.85);
        border: 1px solid rgba(245, 197, 24, 0.16);
        box-shadow: 0 0 0 1px rgba(255, 236, 179, 0.04), var(--ct-shadow);
        font-size: 1.15rem;
        font-weight: 600;
        letter-spacing: -0.02em;
        color: var(--ct-text);
        text-align: left;
        animation: ct-fade-up 0.45s var(--ct-ease) both;
      }
            .empty {
        color: var(--ct-mute);
        font-family: var(--font-mono);
        text-align: center;
        padding: 2.5rem 0;
      }
      .tree {
        list-style: none;
        margin: 0;
        padding: 0;
        font-family: var(--font-mono);
        font-size: 0.88rem;
        line-height: 1.65;
      }
      .tree li {
        color: rgba(247, 241, 232, 0.28);
        border-radius: 8px;
        padding-top: 0.14rem;
        padding-bottom: 0.14rem;
        padding-right: 0.45rem;
        transition:
          color 0.35s var(--ct-ease),
          background 0.35s var(--ct-ease),
          box-shadow 0.35s var(--ct-ease),
          transform 0.35s var(--ct-ease);
      }
      .tree li.past {
        color: rgba(247, 241, 232, 0.5);
      }
      .tree li.main {
        font-weight: 700;
        color: var(--tone, var(--ct-primary));
      }
      .tree li.main.past {
        opacity: 0.8;
      }
      .tree li.file {
        font-weight: 500;
      }
      .tree li.on {
        color: var(--ct-text) !important;
        background: rgba(245, 197, 24, 0.14);
        box-shadow: inset 3px 0 var(--tone, var(--ct-primary));
        font-weight: 700;
        transform: translateX(2px);
      }
      .list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .list li {
        display: flex;
        gap: 0.85rem;
        align-items: flex-start;
        padding: 0.85rem 1rem;
        border-radius: 16px;
        border: 1px solid var(--ct-line);
        color: rgba(247, 241, 232, 0.32);
        font-size: 1.02rem;
        font-weight: 500;
        background: var(--ct-card);
        box-shadow: 0 1px 2px rgba(17, 24, 39, 0.03);
        transition:
          color 0.35s var(--ct-ease),
          border-color 0.35s var(--ct-ease),
          background 0.35s var(--ct-ease),
          box-shadow 0.35s var(--ct-ease),
          transform 0.35s var(--ct-ease);
      }
      .list li span {
        display: inline-grid;
        place-items: center;
        width: 1.55rem;
        height: 1.55rem;
        border-radius: 999px;
        font-family: var(--font-mono);
        font-size: 0.72rem;
        color: var(--ct-primary);
        background: rgba(245, 197, 24, 0.12);
        min-width: 1.55rem;
        font-weight: 600;
        margin-top: 0.05rem;
      }
      .list li.past {
        color: rgba(247, 241, 232, 0.55);
      }
      .list li.on {
        color: var(--ct-text);
        border-color: rgba(245, 197, 24, 0.35);
        background: rgba(40, 34, 26, 0.95);
        box-shadow:
          0 12px 32px -16px var(--ct-glow),
          0 0 0 3px rgba(245, 197, 24, 0.1);
        transform: translateY(-1px) scale(1.01);
      }
      .list li.on span {
        background: var(--ct-gradient);
        color: #1a1408;
      }
      .list.compact li p {
        margin: 0.25rem 0 0;
        font-size: 0.92rem;
        font-weight: 500;
        color: var(--ct-secondary);
        line-height: 1.45;
        animation: ct-fade-in 0.35s var(--ct-ease);
      }
      .auth-layers li {
        color: var(--ct-text);
        opacity: 1;
        align-items: flex-start;
      }
      .auth-layers li.live {
        color: var(--ct-text);
        background: rgba(28, 25, 22, 0.88);
        border-color: rgba(247, 241, 232, 0.1);
      }
      .auth-layers li.past {
        opacity: 0.72;
      }
      .auth-layers li.on {
        opacity: 1;
        border-color: rgba(245, 197, 24, 0.4);
        background: rgba(40, 34, 26, 0.95);
        box-shadow:
          0 12px 32px -16px var(--ct-glow),
          0 0 0 3px rgba(245, 197, 24, 0.1);
      }
      .auth-layers .layer-copy {
        display: grid;
        gap: 0.2rem;
        min-width: 0;
        text-align: left;
      }
      .auth-layers .layer-copy strong {
        font-size: 1rem;
        font-weight: 700;
        letter-spacing: -0.02em;
      }
      .auth-layers .layer-copy p {
        margin: 0;
        font-size: 0.84rem;
        line-height: 1.4;
        color: var(--ct-secondary);
        font-weight: 500;
      }
      .auth-layers li.on .layer-copy p {
        color: rgba(247, 241, 232, 0.82);
      }
      :host ::ng-deep .kw-fastify {
        background: #f5c518;
        color: #1a1408 !important;
        font-weight: 700;
        padding: 0.05em 0.28em;
        border-radius: 6px;
      }
      .grid {
        display: grid;
        gap: 0.6rem;
      }
      .grid.two {
        grid-template-columns: 1fr 1fr;
      }
      .cell {
        padding: 1.05rem 0.95rem;
        border-radius: 16px;
        border: 1px solid var(--ct-line);
        color: rgba(247, 241, 232, 0.32);
        font-size: 0.98rem;
        text-align: center;
        background: var(--ct-card);
        box-shadow: 0 1px 2px rgba(17, 24, 39, 0.03);
        transition:
          color 0.35s var(--ct-ease),
          border-color 0.35s var(--ct-ease),
          background 0.35s var(--ct-ease),
          box-shadow 0.35s var(--ct-ease),
          transform 0.35s var(--ct-ease);
      }
      .cell strong {
        display: block;
        font-weight: 700;
        letter-spacing: -0.02em;
      }
      .cell p {
        margin: 0.4rem 0 0;
        font-size: 0.88rem;
        color: var(--ct-secondary);
        font-weight: 500;
      }
      .cell.past {
        color: rgba(247, 241, 232, 0.55);
      }
      .cell.on {
        color: var(--ct-text);
        border-color: rgba(245, 197, 24, 0.35);
        background: rgba(40, 34, 26, 0.95);
        box-shadow:
          0 14px 34px -16px var(--ct-glow),
          0 0 0 3px rgba(245, 197, 24, 0.12);
        transform: translateY(-2px);
      }
      .box.modules {
        height: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        padding: 0.8rem;
      }
      .module-head {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 1rem;
      }
      .module-head .box-title {
        margin: 0;
      }
      .module-head > span {
        font-size: 0.68rem;
        color: var(--ct-mute);
        font-family: var(--font-mono);
      }
      .module-workspace {
        min-height: 0;
        flex: 1;
        display: grid;
        grid-template-columns: minmax(175px, 0.42fr) minmax(0, 1.58fr);
        gap: 0.65rem;
      }
      .mod-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        align-content: start;
        gap: 0.4rem;
        min-height: 0;
      }
      .mod-btn {
        padding: 0.58rem 0.4rem;
        border-radius: 9px;
        border: 1px solid color-mix(in srgb, var(--m) 28%, var(--ct-line));
        background: rgba(28, 25, 22, 0.9);
        color: var(--m);
        font-family: var(--font-body);
        font-size: 0.72rem;
        font-weight: 700;
        cursor: pointer;
        transition:
          transform 0.22s var(--ct-ease),
          box-shadow 0.22s var(--ct-ease),
          background 0.22s var(--ct-ease),
          color 0.22s var(--ct-ease);
      }
      .mod-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 14px 28px -14px color-mix(in srgb, var(--m) 45%, transparent);
      }
      .mod-btn.on {
        background: var(--m);
        border-color: transparent;
        box-shadow: 0 16px 32px -14px color-mix(in srgb, var(--m) 55%, transparent);
        color: #0a0908;
      }
      .mod-detail {
        padding: 0.75rem 0.8rem;
        border-radius: 11px;
        border: 1px solid color-mix(in srgb, var(--m) 22%, var(--ct-line));
        background: color-mix(in srgb, var(--m) 8%, #161310);
        text-align: left;
        min-height: 0;
        overflow: auto;
        animation: ct-fade-up 0.4s var(--ct-ease);
      }
      .mod-detail-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.6rem;
      }
      .mod-detail-head em {
        display: block;
        margin-bottom: 0.15rem;
        color: var(--ct-mute);
        font-family: var(--font-mono);
        font-size: 0.6rem;
        font-style: normal;
      }
      .mod-detail-head strong {
        display: block;
        color: var(--m);
        font-family: var(--font-display);
        font-size: 1.25rem;
        letter-spacing: 0.03em;
      }
      .mod-detail-head > span {
        padding: 0.17rem 0.4rem;
        border-radius: 999px;
        color: var(--m);
        background: color-mix(in srgb, var(--m) 12%, transparent);
        border: 1px solid color-mix(in srgb, var(--m) 25%, transparent);
        font-size: 0.58rem;
        font-family: var(--font-mono);
      }
      .mod-detail .blurb {
        margin: 0.4rem 0 0.55rem;
        color: var(--ct-text);
        font-size: 0.75rem;
        line-height: 1.4;
        font-weight: 500;
      }
      .mod-inspector {
        display: grid;
        grid-template-columns: minmax(150px, 0.72fr) minmax(0, 1.28fr);
        gap: 0.55rem;
      }
      .mod-tree-panel,
      .mod-notes-panel {
        min-width: 0;
        padding: 0.55rem;
        border-radius: 9px;
        background: rgba(5, 4, 3, 0.35);
        border: 1px solid rgba(247, 241, 232, 0.08);
      }
      .mod-inspector h4 {
        margin: 0 0 0.35rem;
        color: var(--ct-secondary);
        font-family: var(--font-mono);
        font-size: 0.58rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .mod-tree {
        margin: 0;
        padding: 0;
        list-style: none;
        display: grid;
        gap: 0.16rem;
        font-family: var(--font-mono);
        font-size: 0.62rem;
        line-height: 1.35;
        color: var(--ct-secondary);
      }
      .mod-tree li:not(.root) {
        padding-left: 0.55rem;
      }
      .mod-tree .root {
        color: var(--m);
        font-weight: 700;
        margin-bottom: 0.12rem;
      }
      .route-list {
        margin: 0 0 0.5rem;
        color: var(--m);
        font-family: var(--font-mono);
        font-size: 0.6rem;
        line-height: 1.35;
      }
      .mod-detail .points {
        margin: 0;
        padding: 0;
        list-style: none;
        display: grid;
        gap: 0.24rem;
      }
      .mod-detail .points li {
        color: var(--ct-secondary);
        font-size: 0.64rem;
        line-height: 1.35;
        font-weight: 500;
        padding-left: 0.75rem;
        position: relative;
      }
      .mod-detail .points li::before {
        content: '•';
        position: absolute;
        left: 0;
        color: var(--m);
      }
      .mod-empty {
        min-height: 0;
        display: grid;
        place-content: center;
        justify-items: center;
        text-align: center;
        padding: 1rem;
        border-radius: 11px;
        border: 1px dashed rgba(247, 241, 232, 0.14);
        background: rgba(14, 12, 10, 0.4);
      }
      .mod-empty span {
        width: 2rem;
        height: 2rem;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background: rgba(245, 197, 24, 0.1);
        color: var(--ct-primary);
        font-family: var(--font-mono);
        font-size: 0.65rem;
      }
      .mod-empty strong {
        margin-top: 0.45rem;
        font-size: 0.85rem;
      }
      .mod-empty p {
        margin: 0.25rem 0 0;
        max-width: 30ch;
        color: var(--ct-secondary);
        font-size: 0.7rem;
        line-height: 1.4;
      }
      .dive {
        margin-top: 0.55rem;
        border: none;
        border-radius: 8px;
        padding: 0.42rem 0.65rem;
        background: var(--ct-gradient);
        color: #1a1408;
        font-weight: 600;
        font-size: 0.68rem;
        cursor: pointer;
        box-shadow: 0 10px 26px -12px var(--ct-glow);
        transition:
          transform 0.2s var(--ct-ease),
          box-shadow 0.2s var(--ct-ease);
      }
      .dive:hover {
        transform: translateY(-1px);
        box-shadow: 0 14px 30px -12px var(--ct-glow);
      }
      .flow {
        margin: 0;
        font-size: 1.15rem;
        color: var(--ct-secondary);
        line-height: 1.7;
        font-weight: 500;
        max-width: 36ch;
      }

      /* Request journey — CineTrack login mock + animated rail */
      .box.request-flow {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding-bottom: 1rem;
      }
      .box.request-flow.full {
        height: 100%;
        min-height: 0;
        justify-content: stretch;
        padding: 0.65rem 1rem 0.85rem;
        overflow: hidden;
      }
      .box.request-flow.full .rf-layout {
        flex: 1;
        min-height: 0;
        display: grid;
        grid-template-columns: minmax(300px, 1fr) minmax(0, 1.35fr);
        gap: 1.25rem;
        align-items: stretch;
        overflow: hidden;
      }
      .box.request-flow.full .rf-action {
        justify-content: center;
        padding: 1.25rem;
        gap: 1.1rem;
      }
      .box.request-flow.full .rf-movie {
        grid-template-columns: 120px 1fr;
        gap: 1rem;
      }
      .box.request-flow.full .rf-poster {
        width: 120px;
        height: 178px;
        border-radius: 14px;
      }
      .box.request-flow.full .rf-movie-meta strong {
        font-size: 1.45rem;
      }
      .box.request-flow.full .rf-movie-meta span {
        font-size: 1rem;
      }
      .box.request-flow.full .rf-btn {
        padding: 1.15rem 1.1rem;
        font-size: 1.2rem;
        border-radius: 16px;
      }
      .box.request-flow.full .rf-packet {
        font-size: 0.95rem;
        padding: 0.6rem 1rem;
      }
      .box.request-flow.full .rf-journey {
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 0.9rem;
        overflow: hidden;
      }
      .box.request-flow.full .rf-rail {
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 0.65rem;
        padding: 1.1rem 0.9rem;
      }
      .box.request-flow.full .rf-rail.seven {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
      .box.request-flow.full .rf-node {
        width: 2.85rem;
        height: 2.85rem;
        font-size: 0.95rem;
      }
      .box.request-flow.full .rf-meta strong {
        font-size: 0.95rem;
      }
      .box.request-flow.full .rf-meta small {
        font-size: 0.7rem;
      }
      .box.request-flow.full .rf-toast {
        padding: 1.15rem 1.25rem;
        flex-shrink: 0;
      }
      .box.request-flow.full .rf-toast p {
        font-size: 1.12rem;
        line-height: 1.45;
        max-width: 48ch;
      }
      .box.request-flow.full .rf-bar {
        max-width: 320px;
        height: 8px;
      }
      @media (max-width: 900px) {
        .box.request-flow.full .rf-layout {
          grid-template-columns: 1fr;
        }
        .box.request-flow.full .rf-rail,
        .box.request-flow.full .rf-rail.seven {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      .rf-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
      }
      .rf-top .box-title {
        margin: 0;
      }
      .rf-bar {
        flex: 1;
        max-width: 220px;
        height: 6px;
        border-radius: 999px;
        background: rgba(255, 193, 7, 0.15);
        overflow: hidden;
      }
      .rf-bar > div {
        height: 100%;
        border-radius: inherit;
        background: linear-gradient(90deg, #ffc107, #d4a017);
        box-shadow: 0 0 12px rgba(255, 193, 7, 0.45);
        transition: width 0.45s var(--ct-ease);
      }
      .rf-layout {
        display: grid;
        grid-template-columns: minmax(240px, 0.95fr) minmax(0, 1.35fr);
        gap: 1rem;
        min-height: 0;
        flex: 1;
      }
      .rf-action {
        display: flex;
        flex-direction: column;
        gap: 0.85rem;
        padding: 1rem;
        border-radius: 22px;
        background: #121212;
        color: #fff;
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow:
          0 18px 40px -20px rgba(0, 0, 0, 0.45),
          inset 0 1px 0 rgba(255, 255, 255, 0.04);
        position: relative;
        overflow: hidden;
        transition: box-shadow 0.35s var(--ct-ease);
      }
      .rf-action.pulse {
        box-shadow:
          0 0 0 3px rgba(255, 193, 7, 0.28),
          0 22px 48px -18px rgba(255, 193, 7, 0.4);
      }
      .rf-action.done {
        box-shadow:
          0 0 0 3px rgba(34, 197, 94, 0.25),
          0 22px 48px -18px rgba(34, 197, 94, 0.3);
      }
      .rf-movie {
        display: grid;
        grid-template-columns: 96px 1fr;
        gap: 0.85rem;
        align-items: end;
      }
      .rf-poster {
        width: 96px;
        height: 140px;
        border-radius: 12px;
        background-size: cover;
        background-position: center;
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 12px 28px -14px rgba(0, 0, 0, 0.8);
      }
      .rf-movie-meta small {
        display: block;
        font-family: var(--font-mono);
        font-size: 0.68rem;
        letter-spacing: 0.14em;
        color: #f5c518;
        margin-bottom: 0.35rem;
      }
      .rf-movie-meta strong {
        display: block;
        font-size: 1.25rem;
        font-weight: 800;
        letter-spacing: -0.03em;
        line-height: 1.15;
        margin-bottom: 0.3rem;
      }
      .rf-movie-meta span {
        display: block;
        font-size: 0.88rem;
        color: #a1a1aa;
      }
      .rf-btn {
        border: none;
        border-radius: 14px;
        padding: 0.95rem 1rem;
        background: #f5c518;
        color: #121212;
        font-weight: 800;
        font-size: 1.05rem;
        letter-spacing: -0.01em;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        box-shadow: 0 12px 28px -10px rgba(245, 197, 24, 0.6);
        cursor: default;
        width: 100%;
      }
      .rf-btn.loading {
        background: #d4a017;
      }
      .rf-spin {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 2px solid rgba(18, 18, 18, 0.25);
        border-top-color: #121212;
        animation: rf-spin 0.7s linear infinite;
      }
      .rf-packet {
        align-self: start;
        padding: 0.5rem 0.85rem;
        border-radius: 999px;
        background: rgba(255, 193, 7, 0.12);
        border: 1px solid rgba(255, 193, 7, 0.35);
        color: #ffc107;
        font-family: var(--font-mono);
        font-size: 0.82rem;
        transition:
          transform 0.55s var(--ct-ease),
          opacity 0.55s var(--ct-ease);
      }
      .rf-packet em {
        font-style: normal;
        font-weight: 700;
        color: #fff;
        margin-right: 0.3rem;
      }
      .rf-packet.away {
        transform: translateX(18px);
        opacity: 0.35;
      }
      .rf-journey {
        display: flex;
        flex-direction: column;
        gap: 0.85rem;
        min-width: 0;
        min-height: 0;
      }
      .rf-rail {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 0.65rem 0.55rem;
        padding: 1rem;
        border-radius: 18px;
        background: rgba(20, 18, 16, 0.9);
        border: 1px solid rgba(247, 241, 232, 0.1);
        box-shadow: var(--ct-shadow);
        position: relative;
      }
      .rf-rail.eight,
      .rf-rail.ten,
      .rf-rail.six,
      .rf-rail.seven {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
      .rf-hop {
        position: relative;
        display: grid;
        justify-items: center;
        gap: 0.4rem;
        text-align: center;
        padding: 0.55rem 0.3rem 0.6rem;
        border-radius: 14px;
        transition:
          background 0.3s var(--ct-ease),
          transform 0.3s var(--ct-ease);
      }
      .rf-hop.on {
        background: rgba(245, 197, 24, 0.14);
        transform: translateY(-2px);
      }
      .rf-hop.past .rf-node {
        background: #22c55e;
        color: #fff;
        border-color: transparent;
      }
      .rf-hop.next .rf-node {
        border-color: rgba(245, 197, 24, 0.55);
      }
      .rf-node {
        position: relative;
        width: 2.55rem;
        height: 2.55rem;
        border-radius: 999px;
        display: grid;
        place-items: center;
        font-family: var(--font-mono);
        font-size: 0.88rem;
        font-weight: 700;
        color: var(--ct-primary);
        background: rgba(245, 197, 24, 0.1);
        border: 2px solid rgba(245, 197, 24, 0.28);
        z-index: 1;
      }
      .rf-hop.on .rf-node {
        background: var(--ct-gradient);
        color: #1a1408;
        border-color: transparent;
        box-shadow: 0 10px 22px -10px var(--ct-glow);
      }
      .rf-ping {
        position: absolute;
        inset: -5px;
        border-radius: 999px;
        border: 2px solid rgba(245, 197, 24, 0.55);
        animation: rf-ping 1.4s ease-out infinite;
      }
      .rf-meta {
        display: grid;
        gap: 0.15rem;
        min-width: 0;
      }
      .rf-meta small {
        font-size: 0.68rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--ct-mute);
        font-weight: 700;
      }
      .rf-meta strong {
        font-size: 0.9rem;
        font-weight: 700;
        color: var(--ct-secondary);
        letter-spacing: -0.01em;
        line-height: 1.25;
      }
      .rf-hop.on .rf-meta strong {
        color: var(--ct-text);
      }
      .rf-hop.past .rf-meta strong {
        color: #16a34a;
      }
      .rf-wire {
        display: none;
      }
      .rf-toast {
        display: grid;
        grid-template-columns: 5px 1fr;
        gap: 0.95rem;
        padding: 1.1rem 1.15rem;
        border-radius: 16px;
        background: rgba(28, 25, 22, 0.95);
        border: 1px solid rgba(245, 197, 24, 0.22);
        box-shadow: var(--ct-shadow-lift);
        animation: ct-fade-up 0.4s var(--ct-ease);
      }
      .rf-toast-rail {
        border-radius: 999px;
        background: linear-gradient(180deg, #f5c518, #ff6b4a);
      }
      .rf-toast-kicker {
        font-size: 0.78rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--ct-primary);
        margin-bottom: 0.35rem;
      }
      .rf-toast p {
        margin: 0;
        font-size: 1.08rem;
        line-height: 1.45;
        color: var(--ct-text);
        font-weight: 500;
      }
      @keyframes rf-spin {
        to {
          transform: rotate(360deg);
        }
      }
      @keyframes rf-ping {
        0% {
          transform: scale(0.85);
          opacity: 0.9;
        }
        100% {
          transform: scale(1.45);
          opacity: 0;
        }
      }

      @media (max-width: 700px) {
        .module-workspace,
        .mod-inspector {
          grid-template-columns: 1fr;
        }
        .module-head > span {
          display: none;
        }
        .grid.two,
        .mod-grid,
        .rack-grid,
        .idea-grid,
        .idea-grid[data-count='3'],
        .idea-grid[data-count='5'],
        .idea-grid[data-count='6'],
        .vaults {
          grid-template-columns: 1fr 1fr;
        }
        .ui-split,
        .mock-app,
        .mock-guard,
        .mock-details {
          grid-template-columns: 1fr;
        }
        .rf-layout {
          grid-template-columns: 1fr;
        }
        .rf-rail,
        .rf-rail.eight,
        .rf-rail.seven,
        .rf-rail.ten {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
    `,
  ],
})
export class CinemaStageComponent {
  readonly scene = input.required<CinemaScene>();
  readonly peek = input<ModulePeek | null>(null);

  readonly moduleSelect = output<string>();
  readonly dive = output<void>();

  readonly boot = BOOT_CAST;
  readonly plugins = PLUGIN_CAST;
  readonly modules = MODULE_CAST;
  readonly layers = AUTH_LAYERS;
  readonly hops = REQUEST_HOPS;
  readonly details = MODULE_DETAILS;
  readonly folderBriefs = FOLDER_BRIEFS;

  readonly uiMeta = computed(() => {
    const kind = this.scene().uiMock ?? 'overview';
    return UI_SHOTS[kind] ?? UI_SHOTS.overview;
  });

  moduleFolder(name: string): string {
    return MODULE_FOLDER[name] ?? name.toLowerCase();
  }

  moduleFiles(name: string): string[] {
    const slug = this.moduleFolder(name);
    const files = [
      'index.ts',
      `${slug}.routes.ts`,
      `${slug}.controller.ts`,
      `${slug}.service.ts`,
      `${slug}.repository.ts`,
      `${slug}.model.ts`,
      `${slug}.schema.ts`,
      `${slug}.types.ts`,
    ];
    if (name === 'Auth') files.push(`${slug}.password.ts`);
    return files;
  }

  private activeTree() {
    return this.scene().folderTree === 'client' ? CLIENT_FOLDER_TREE : FOLDER_TREE;
  }

  private activeBriefs() {
    return this.scene().folderTree === 'client' ? CLIENT_FOLDER_BRIEFS : FOLDER_BRIEFS;
  }

  folderRootLabel(): string {
    return this.scene().folderTree === 'client' ? 'client/src/app' : 'server/src';
  }

  readonly nodes = computed(() => {
    const s = this.scene();
    const tree = s.folderTree === 'client' ? CLIENT_FOLDER_TREE : FOLDER_TREE;
    if (s.folderFull) return tree;
    const ids = new Set(s.folderVisible ?? []);
    return tree.filter((n) => ids.has(n.id));
  });

  readonly folderBrief = computed(() => {
    const id = this.scene().folderSpot;
    if (!id) return null;
    return this.activeBriefs()[id] ?? null;
  });

  folderBriefLabel(): string {
    const id = this.scene().folderSpot;
    if (!id) return '';
    const node = this.activeTree().find((n) => n.id === id);
    return node?.label ?? id;
  }

  isMain(id: string): boolean {
    if (this.scene().folderTree === 'client') {
      return id in CLIENT_FOLDER_COLORS;
    }
    if (id in MAIN_FOLDER_COLORS) return true;
    // Feature module folders under modules/ (auth, users, …)
    return /^modules\/[^/]+$/.test(id);
  }

  folderTone(id: string): string {
    if (this.scene().folderTree === 'client') {
      return CLIENT_FOLDER_COLORS[id] ?? CLIENT_FOLDER_COLORS[id.split('/')[0]] ?? '#9CA3AF';
    }
    if (MAIN_FOLDER_COLORS[id]) return MAIN_FOLDER_COLORS[id];
    if (/^modules\/[^/]+$/.test(id)) return '#2563EB';
    const root = id.split('/')[0];
    return MAIN_FOLDER_COLORS[root] ?? '#9CA3AF';
  }

  mark(text: string): string {
    return markFastify(text);
  }

  bayNo(i: number): string {
    return String(i + 1).padStart(2, '0');
  }

  bootHint(id: string): string {
    switch (id) {
      case 'env':
        return 'validate config';
      case 'fastify':
        return 'create the app';
      case 'plugins':
        return 'register infrastructure';
      case 'modules':
        return 'register features';
      case 'health':
        return 'ready check';
      default:
        return '';
    }
  }

  readonly activeHop = computed(() => {
    const i = this.scene().requestSpot;
    if (i == null || i < 0 || i >= this.hops.length) return null;
    return this.hops[i];
  });

  requestProgress(): number {
    const i = this.scene().requestSpot;
    if (i == null) return 0;
    return ((i + 1) / this.hops.length) * 100;
  }

  isPast(id: string): boolean {
    const s = this.scene();
    const spot = s.folderSpot;
    const visible = s.folderVisible ?? [];
    if (!spot) return false;
    const i = visible.indexOf(id);
    const spotI = visible.indexOf(spot);
    return i >= 0 && spotI >= 0 && i < spotI;
  }

  isBootPast(id: string): boolean {
    const spot = this.scene().bootSpot;
    if (!spot || spot === 'all') return false;
    const order = BOOT_CAST.map((b) => b.id);
    return order.indexOf(id as (typeof BOOT_CAST)[number]['id']) < order.indexOf(spot);
  }

  isPluginOn(i: number): boolean {
    const spot = this.scene().pluginSpot;
    return spot === 'overview' || spot === i;
  }

  isPluginPast(i: number): boolean {
    const spot = this.scene().pluginSpot;
    if (spot === 'overview' || typeof spot !== 'number') return false;
    return i < spot;
  }
}
