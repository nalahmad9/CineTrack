import fs from 'fs';

const path = 'presentation/src/app/explorer/explorer.model.ts';
let s = fs.readFileSync(path, 'utf8');

// Professional tone for ANGULAR_IDEAS
const ideasStart = s.indexOf('export const ANGULAR_IDEAS = {');
const ideasEnd = s.indexOf('export const MODULE_CAST = [');
if (ideasStart < 0 || ideasEnd < 0) {
  console.error('ideas markers missing');
  process.exit(1);
}

const ideas = `export const ANGULAR_IDEAS = {
  pillars: [
    {
      name: 'Components',
      plain: 'Reusable view units — template, styles, and a TypeScript class.',
    },
    {
      name: 'Services',
      plain: 'Shared logic (Auth, TMDb, Watchlist) injected wherever needed.',
    },
    {
      name: 'Routing',
      plain: 'URL maps to a page component — no full browser reload.',
    },
    {
      name: 'RxJS',
      plain: 'Async work as streams — HTTP replies, search input, errors.',
    },
  ],
  component: [
    { name: 'Template', plain: 'HTML bound to component data.' },
    { name: 'Styles', plain: 'CSS scoped to that component.' },
    { name: 'Logic', plain: 'TypeScript class for state and actions.' },
  ],
  routing: [
    { name: 'Router', plain: 'Matches /watchlist or /movie/:id to a component.' },
    { name: 'Lazy load', plain: 'loadComponent fetches a page only when visited.' },
    { name: 'Guards', plain: 'authGuard / guestGuard decide who may enter a route.' },
  ],
  connect: [
    { name: 'Navigate', plain: 'Sidebar → /watchlist → lazy-loaded page.' },
    { name: 'Guard', plain: 'authGuard confirms the session first.' },
    { name: 'Load', plain: 'WatchlistService.getAll() → Observable → signal.' },
    { name: 'Render', plain: 'Shared MovieCardComponent fills the grid.' },
  ],
};

`;

s = s.slice(0, ideasStart) + ideas + s.slice(ideasEnd);

const part4Start = s.indexOf("  // ─── Part 4 · Angular client");
const part4End = s.lastIndexOf('];');
if (part4Start < 0 || part4End < 0) {
  console.error('part4 markers', part4Start, part4End);
  process.exit(1);
}

const part4 = `  // ─── Part 4 · Angular client ──────────────────────────────────
  {
    id: 'ch4',
    act: 4,
    actTitle: 'Part 4',
    sceneLabel: 'Overview',
    title: 'What is Angular?',
    narration:
      'A structured framework for app-like UIs — instant updates without a full page reload.',
    takeaway: 'Components · Services · Routing · RxJS',
    stage: 'ui',
    uiMock: 'overview',
    example:
      'In CineTrack, navigating Discover or Watchlist swaps the main panel only — the shell stays mounted.',
    ideas: ANGULAR_IDEAS.pillars,
  },
  {
    id: 'ng-component',
    act: 4,
    actTitle: 'Part 4',
    sceneLabel: 'Components',
    title: 'Components',
    narration: 'Template, styles, and logic — written once, reused across screens.',
    takeaway: 'MovieCard is shared everywhere',
    stage: 'ui',
    uiMock: 'component',
    example:
      'MovieCardComponent powers Discover, Watchlist, Favorites, and dashboard rows.',
    ideas: ANGULAR_IDEAS.component,
    snippet: SNIPPETS.ngMovieCard,
    focusLines: [1, 2, 3],
    treePath: ['client', 'src', 'app', 'shared', 'components', 'movie-card'],
  },
  {
    id: 'ng-signals',
    act: 4,
    actTitle: 'Part 4',
    sceneLabel: 'Signals',
    title: 'Signals',
    narration: 'A watched value — when it changes, every consumer updates automatically.',
    takeaway: 'signal() · computed()',
    stage: 'ui',
    uiMock: 'signals',
    example:
      'Watchlist items live in a signal — the grid re-renders when getAll() completes.',
    bullets: [
      'Hold state with signal()',
      'Expose read-only views',
      'Derive values with computed()',
    ],
    snippet: SNIPPETS.ngSignals,
    focusLines: [1, 2, 4, 5],
    treePath: ['client', 'src', 'app', 'core', 'services', 'auth.service.ts'],
  },
  {
    id: 'ng-routing',
    act: 4,
    actTitle: 'Part 4',
    sceneLabel: 'Routing',
    title: 'Routing & guards',
    narration: 'The URL selects the page. Guards enforce access before it renders.',
    takeaway: 'URL ↔ component · protected routes',
    stage: 'ui',
    uiMock: 'routing',
    example:
      '/watchlist loads WatchlistComponent lazily. Without a session, authGuard redirects to /login.',
    ideas: ANGULAR_IDEAS.routing,
    snippet: SNIPPETS.ngRoutes,
    focusLines: [1, 2, 3, 4, 5],
    treePath: ['client', 'src', 'app', 'app.routes.ts'],
  },
  {
    id: 'ng-rxjs',
    act: 4,
    actTitle: 'Part 4',
    sceneLabel: 'RxJS',
    title: 'RxJS',
    narration: 'HTTP and user input are streams — the UI stays responsive while work completes.',
    takeaway: 'Observables, not freezes',
    stage: 'ui',
    uiMock: 'rxjs',
    example:
      'Discover search waits briefly after typing, then issues one TMDb request — not one per keystroke.',
    bullets: [
      'API calls return Observables',
      'subscribe() handles success and error',
      'Failures surface as toasts',
    ],
    snippet: SNIPPETS.ngWatchlistLoad,
    focusLines: [4, 5, 6, 7, 8],
    treePath: ['client', 'src', 'app', 'features', 'watchlist'],
  },
  {
    id: 'ng-services',
    act: 4,
    actTitle: 'Part 4',
    sceneLabel: 'Services',
    title: 'Services & DI',
    narration: 'Components request shared services; Angular injects them. Interceptors attach the JWT.',
    takeaway: 'Logic once · inject everywhere',
    stage: 'ui',
    uiMock: 'services',
    example:
      'WatchlistService is shared by details and list pages; authInterceptor adds Authorization on every call.',
    bullets: [
      'Services own reusable logic',
      'inject() provides dependencies',
      'Interceptors attach the token',
    ],
    snippet: SNIPPETS.ngInterceptor,
    focusLines: [1, 2, 3, 4, 5, 6],
    treePath: ['client', 'src', 'app', 'core', 'interceptors'],
  },
  {
    id: 'ng-folders',
    act: 4,
    actTitle: 'Part 4',
    sceneLabel: 'Layout',
    title: 'Client folder layout',
    narration: 'core = engine, shared = reusable UI, features = pages.',
    takeaway: 'Predictable structure',
    stage: 'folder',
    folderTree: 'client',
    folderVisible: [
      'client',
      'src',
      'app',
      'app.routes.ts',
      'core',
      'core/models',
      'core/services',
      'core/guards',
      'core/interceptors',
      'shared',
      'shared/components',
      'shared/pipes',
      'features',
      'features/auth',
      'features/watchlist',
      'features/discover',
    ],
    folderSpot: 'features',
    example:
      'Login lives in features/auth. MovieCard in shared/components. JWT attach in core/interceptors.',
  },
  {
    id: 'ng-connect',
    act: 4,
    actTitle: 'Part 4',
    sceneLabel: 'Connect',
    title: 'Client path: Watchlist',
    narration:
      'Navigate → guard → service → Observable → signal → shared MovieCard — then add from details.',
    takeaway: 'One path through the client',
    stage: 'ui',
    uiMock: 'watchlist',
    example:
      'Watchlist loads via WatchlistService.getAll(). From /movie/693134, add() hits the same Fastify POST you traced earlier.',
    ideas: ANGULAR_IDEAS.connect,
    snippet: SNIPPETS.ngWatchlistLoad,
    focusLines: [1, 4, 5, 6, 7],
    treePath: ['client', 'src', 'app', 'features', 'watchlist'],
  },
  {
    id: 'ng-add',
    act: 4,
    actTitle: 'Part 4',
    sceneLabel: 'Action',
    title: 'Add from details',
    narration: 'MovieDetailsComponent calls WatchlistService.add() — client action to Fastify route.',
    takeaway: 'UI action → API',
    stage: 'ui',
    uiMock: 'details',
    example:
      'On Dune: Part Two, + Watchlist runs add() and shows a success toast on completion.',
    bullets: [
      'Details page owns the action',
      'Service owns the HTTP call',
      'Toast reports the outcome',
    ],
    snippet: SNIPPETS.ngWatchlistAdd,
    focusLines: [1, 4, 5, 6, 7],
    treePath: ['client', 'src', 'app', 'features', 'movie-details'],
  },
  {
    id: 'finale',
    act: 4,
    actTitle: 'Part 4',
    sceneLabel: 'Done',
    title: 'Server + client',
    narration: 'Fastify composes the API. Angular composes the UI. One watchlist path ties them together.',
    takeaway: 'API · UI · one request',
    stage: 'finale',
  },
];
`;

s = s.slice(0, part4Start) + part4 + '\n';

// Shorter TOC labels
s = s.replace(
  `export const TOC_SECTIONS: TocSection[] = [
  { act: 1, title: 'Bootstrap & infrastructure', hint: 'Boot · plugins · shared rules' },
  { act: 2, title: 'Feature modules', hint: 'Domain plugins' },
  { act: 3, title: 'One request', hint: 'Watchlist end-to-end' },
  { act: 4, title: 'Angular client', hint: 'Components · routing · RxJS' },
];`,
  `export const TOC_SECTIONS: TocSection[] = [
  { act: 1, title: 'Bootstrap', hint: 'Boot · plugins · shared rules' },
  { act: 2, title: 'Modules', hint: 'Domain plugins' },
  { act: 3, title: 'One request', hint: 'Watchlist end-to-end' },
  { act: 4, title: 'Angular', hint: 'Client architecture' },
];`,
);

fs.writeFileSync(path, s);
console.log('model polished');
