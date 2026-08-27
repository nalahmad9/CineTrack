import fs from 'fs';

const path = 'presentation/src/app/explorer/explorer.model.ts';
let s = fs.readFileSync(path, 'utf8');

s = s.replace(
  `export type StageKind =
  | 'title'
  | 'bullets'
  | 'engine'
  | 'folder'
  | 'boot'
  | 'plugins'
  | 'globals'
  | 'modules'
  | 'auth'
  | 'request'
  | 'finale';`,
  `export type StageKind =
  | 'title'
  | 'bullets'
  | 'engine'
  | 'folder'
  | 'boot'
  | 'plugins'
  | 'globals'
  | 'modules'
  | 'auth'
  | 'request'
  | 'ideas'
  | 'finale';`,
);

s = s.replace(
  `  treePath?: string[];
}`,
  `  treePath?: string[];
  /** Which folder tree to render */
  folderTree?: 'server' | 'client';
  /** Spotlight opener brand (defaults to Fastify) */
  engineBrand?: string;
  engineSubtitle?: string;
  /** Concept cards for ideas stage */
  ideas?: { name: string; plain: string }[];
}`,
);

s = s.replace(
  `export const TOC_SECTIONS: TocSection[] = [
  { act: 1, title: 'Bootstrap & infrastructure', hint: 'Boot · plugins · shared rules' },
  { act: 2, title: 'Feature modules', hint: 'Domain plugins' },
  { act: 3, title: 'One request', hint: 'Watchlist end-to-end' },
];`,
  `export const TOC_SECTIONS: TocSection[] = [
  { act: 1, title: 'Bootstrap & infrastructure', hint: 'Boot · plugins · shared rules' },
  { act: 2, title: 'Feature modules', hint: 'Domain plugins' },
  { act: 3, title: 'One request', hint: 'Watchlist end-to-end' },
  { act: 4, title: 'Angular client', hint: 'Components · routing · RxJS' },
];`,
);

s = s.replace(
  `    [/\bFastify\b/g, () => hold('<span class="kw-fastify">Fastify</span>')],
    [/\bfastify\b/g, () => hold('<span class="kw-fastify">fastify</span>')],
  ];`,
  `    [/\bFastify\b/g, () => hold('<span class="kw-fastify">Fastify</span>')],
    [/\bfastify\b/g, () => hold('<span class="kw-fastify">fastify</span>')],
    [/\bAngular\b/g, () => hold('<span class="kw-fastify">Angular</span>')],
    [/\bTypeScript\b/g, () => hold('<span class="kw-fastify">TypeScript</span>')],
    [/\bRxJS\b/g, () => hold('<span class="kw-fastify">RxJS</span>')],
    [/\bObservable\b/g, () => hold('<span class="kw-fastify">Observable</span>')],
    [/\bsignal\(/g, () => hold('<span class="kw-fastify">signal(</span>')],
    [/\bcomputed\(/g, () => hold('<span class="kw-fastify">computed(</span>')],
    [/\binject\(/g, () => hold('<span class="kw-fastify">inject(</span>')],
    [/\bauthGuard\b/g, () => hold('<span class="kw-fastify">authGuard</span>')],
    [/\bguestGuard\b/g, () => hold('<span class="kw-fastify">guestGuard</span>')],
    [/\bloadComponent\b/g, () => hold('<span class="kw-fastify">loadComponent</span>')],
  ];`,
);

const clientExtras = `
/** Client app tree for Part 4 */
export const CLIENT_FOLDER_TREE: FolderNode[] = [
  { id: 'client', label: 'client/', depth: 0, kind: 'dir' },
  { id: 'src', label: 'src/', depth: 1, kind: 'dir', parent: 'client' },
  { id: 'app', label: 'app/', depth: 2, kind: 'dir', parent: 'src' },
  { id: 'app.routes.ts', label: 'app.routes.ts', depth: 3, kind: 'file', parent: 'app' },
  { id: 'core', label: 'core/', depth: 3, kind: 'dir', parent: 'app' },
  { id: 'core/models', label: 'models/', depth: 4, kind: 'dir', parent: 'core' },
  { id: 'core/services', label: 'services/', depth: 4, kind: 'dir', parent: 'core' },
  { id: 'core/guards', label: 'guards/', depth: 4, kind: 'dir', parent: 'core' },
  { id: 'core/interceptors', label: 'interceptors/', depth: 4, kind: 'dir', parent: 'core' },
  { id: 'shared', label: 'shared/', depth: 3, kind: 'dir', parent: 'app' },
  { id: 'shared/components', label: 'components/', depth: 4, kind: 'dir', parent: 'shared' },
  { id: 'shared/pipes', label: 'pipes/', depth: 4, kind: 'dir', parent: 'shared' },
  { id: 'features', label: 'features/', depth: 3, kind: 'dir', parent: 'app' },
  { id: 'features/auth', label: 'auth/', depth: 4, kind: 'dir', parent: 'features' },
  { id: 'features/watchlist', label: 'watchlist/', depth: 4, kind: 'dir', parent: 'features' },
  { id: 'features/discover', label: 'discover/', depth: 4, kind: 'dir', parent: 'features' },
];

export const CLIENT_FOLDER_COLORS: Record<string, string> = {
  client: '#f5c518',
  src: '#f5c518',
  app: '#ff8a5b',
  'app.routes.ts': '#e8a317',
  core: '#60a5fa',
  'core/models': '#93c5fd',
  'core/services': '#93c5fd',
  'core/guards': '#93c5fd',
  'core/interceptors': '#93c5fd',
  shared: '#a78bfa',
  'shared/components': '#c4b5fd',
  'shared/pipes': '#c4b5fd',
  features: '#34d399',
  'features/auth': '#6ee7b7',
  'features/watchlist': '#6ee7b7',
  'features/discover': '#6ee7b7',
};

export const CLIENT_FOLDER_BRIEFS: Record<string, string> = {
  client: 'Angular app package — the CineTrack UI.',
  src: 'Source root for the Angular client.',
  app: 'Application shell, routes, and feature folders.',
  'app.routes.ts': 'URL table — lazy loadComponent + authGuard / guestGuard.',
  core: 'Engine room — models, services, guards, interceptors.',
  'core/models': 'TypeScript blueprints for Movie, User, API shapes.',
  'core/services': 'Reusable logic — AuthService, WatchlistService, TmdbService.',
  'core/guards': 'Route bouncers — authGuard and guestGuard.',
  'core/interceptors': 'Attach JWT on every HTTP call; catch 401 globally.',
  shared: 'Reusable UI used on many pages.',
  'shared/components': 'MovieCard, sidebar, toast, rating stars, and more.',
  'shared/pipes': 'Display helpers like truncate text.',
  features: 'One folder per screen — self-contained pages.',
  'features/auth': 'Login and register screens.',
  'features/watchlist': 'Watchlist page — signals + WatchlistService.',
  'features/discover': 'Discover / search experience.',
};

export const ANGULAR_IDEAS = {
  pillars: [
    { name: 'Components', plain: 'Visual LEGO blocks — template + styles + TypeScript logic.' },
    { name: 'Services', plain: 'Reusable logic not tied to one screen (Auth, TMDb, Watchlist).' },
    { name: 'Routing', plain: 'Swap pages instantly from the URL — no full reload.' },
    { name: 'RxJS', plain: 'Handle work over time — server replies, typing, errors.' },
  ],
  component: [
    { name: 'Template', plain: 'What the user sees — HTML bound to component data.' },
    { name: 'Styles', plain: 'How it looks — CSS scoped to that component.' },
    { name: 'Logic', plain: 'What it does — TypeScript class holding state and actions.' },
  ],
  routing: [
    { name: 'Router', plain: 'Matches /watchlist or /movie/550 to a component.' },
    { name: 'Lazy load', plain: 'loadComponent downloads a page only when visited.' },
    { name: 'authGuard', plain: 'Blocks private pages unless the user is signed in.' },
    { name: 'guestGuard', plain: 'Keeps signed-in users off Login / Register.' },
    { name: 'Dynamic :id', plain: 'One MovieDetailsComponent serves every /movie/:id.' },
  ],
  connect: [
    { name: 'Navigate', plain: 'Sidebar click → router matches /watchlist → lazy load.' },
    { name: 'Guard', plain: 'authGuard checks login before the page renders.' },
    { name: 'Service', plain: 'WatchlistService.getAll() returns an Observable.' },
    { name: 'Subscribe', plain: 'Component waits for the HTTP reply without freezing UI.' },
    { name: 'Signal', plain: 'items.set(data) — template re-renders movie cards.' },
    { name: 'Reuse', plain: 'Shared MovieCardComponent renders each title.' },
  ],
};
`;

if (!s.includes('CLIENT_FOLDER_TREE')) {
  s = s.replace(
    'export const MODULE_CAST = [',
    clientExtras + '\nexport const MODULE_CAST = [',
  );
}

const part4 = `  // ─── Part 4 · Angular client ──────────────────────────────────
  {
    id: 'ch4',
    act: 4,
    actTitle: 'Part 4',
    sceneLabel: 'Overview',
    title: 'What is Angular?',
    narration: 'A Google-backed framework for app-like websites — instant updates, no full page reload.',
    takeaway: 'Components · Services · Routing · RxJS',
    stage: 'engine',
    engineBrand: 'Angular',
    engineSubtitle: 'explained simply',
    bullets: [
      'Reusable components (LEGO UI)',
      'TypeScript for safer code',
      'Structure for long-lived apps',
    ],
  },
  {
    id: 'ng-pillars',
    act: 4,
    actTitle: 'Part 4',
    sceneLabel: 'Core ideas',
    title: 'Four pillars',
    narration: 'Everything in Angular revolves around these building blocks.',
    takeaway: 'Learn these four first',
    stage: 'ideas',
    ideas: ANGULAR_IDEAS.pillars,
  },
  {
    id: 'ng-component',
    act: 4,
    actTitle: 'Part 4',
    sceneLabel: 'Components',
    title: 'How a component works',
    narration: 'Template + styles + TypeScript logic — data changes, the screen updates itself.',
    takeaway: 'Write once, reuse everywhere',
    stage: 'ideas',
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
    title: 'Signals — watched values',
    narration: 'A signal is a value the screen watches. When it changes, every reader updates automatically.',
    takeaway: 'signal() + computed()',
    stage: 'bullets',
    bullets: [
      'Hold state in signal()',
      'Expose read-only views',
      'computed() derives values',
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
    title: 'Routing connects pages',
    narration: 'Click Watchlist → URL changes → Angular swaps the page — no full browser reload.',
    takeaway: 'URL ↔ component',
    stage: 'ideas',
    ideas: ANGULAR_IDEAS.routing,
    snippet: SNIPPETS.ngRoutes,
    focusLines: [1, 2, 3, 4, 5],
    treePath: ['client', 'src', 'app', 'app.routes.ts'],
  },
  {
    id: 'ng-guards',
    act: 4,
    actTitle: 'Part 4',
    sceneLabel: 'Guards',
    title: 'Route guards',
    narration: 'authGuard protects private pages. guestGuard keeps logged-in users off Login.',
    takeaway: 'Bouncers for routes',
    stage: 'bullets',
    bullets: [
      'authGuard → must be signed in',
      'guestGuard → already signed in? leave Login',
      'Return true or redirect with UrlTree',
    ],
    snippet: SNIPPETS.ngAuthGuard,
    focusLines: [1, 2, 3, 4, 5],
    treePath: ['client', 'src', 'app', 'core', 'guards', 'auth.guard.ts'],
  },
  {
    id: 'ng-rxjs',
    act: 4,
    actTitle: 'Part 4',
    sceneLabel: 'RxJS',
    title: 'RxJS — work over time',
    narration: 'API calls return an Observable. Subscribe when the answer arrives — the UI stays responsive.',
    takeaway: 'Streams, not freezes',
    stage: 'bullets',
    bullets: [
      'HTTP calls return Observables',
      'subscribe() reacts when data arrives',
      'Errors become toasts, not crashes',
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
    narration: 'Components ask for AuthService or WatchlistService — Angular injects them automatically.',
    takeaway: 'Logic once, use everywhere',
    stage: 'bullets',
    bullets: [
      'Services hold reusable logic',
      'Dependency Injection provides them',
      'Interceptors attach the JWT token',
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
    title: 'client/src/app layout',
    narration: 'core = engine, shared = reusable UI, features = pages.',
    takeaway: 'Find any file in seconds',
    stage: 'folder',
    folderTree: 'client',
    folderVisible: ['client', 'src', 'app'],
    folderSpot: 'app',
  },
  {
    id: 'ng-folder-core',
    act: 4,
    actTitle: 'Part 4',
    sceneLabel: 'Layout',
    title: 'core/',
    narration: 'Models, services, guards, and interceptors — non-visual power behind every page.',
    takeaway: 'Engine room',
    stage: 'folder',
    folderTree: 'client',
    folderVisible: ['client', 'src', 'app', 'app.routes.ts', 'core', 'core/models', 'core/services', 'core/guards', 'core/interceptors'],
    folderSpot: 'core',
  },
  {
    id: 'ng-folder-shared',
    act: 4,
    actTitle: 'Part 4',
    sceneLabel: 'Layout',
    title: 'shared/',
    narration: 'Reusable visuals — MovieCard, sidebar, toasts — written once, used on many pages.',
    takeaway: 'Reusable UI',
    stage: 'folder',
    folderTree: 'client',
    folderVisible: [
      'client', 'src', 'app', 'app.routes.ts', 'core', 'core/models', 'core/services', 'core/guards', 'core/interceptors',
      'shared', 'shared/components', 'shared/pipes',
    ],
    folderSpot: 'shared',
  },
  {
    id: 'ng-folder-features',
    act: 4,
    actTitle: 'Part 4',
    sceneLabel: 'Layout',
    title: 'features/',
    narration: 'One folder per screen. Add a feature without risking the rest of the app.',
    takeaway: 'Pages live here',
    stage: 'folder',
    folderTree: 'client',
    folderVisible: [
      'client', 'src', 'app', 'app.routes.ts', 'core', 'core/models', 'core/services', 'core/guards', 'core/interceptors',
      'shared', 'shared/components', 'shared/pipes',
      'features', 'features/auth', 'features/watchlist', 'features/discover',
    ],
    folderSpot: 'features',
  },
  {
    id: 'ng-connect',
    act: 4,
    actTitle: 'Part 4',
    sceneLabel: 'Connect',
    title: 'How pieces connect',
    narration: 'Watchlist page — router, guard, service, Observable, signal, shared MovieCard.',
    takeaway: 'One real path through the client',
    stage: 'ideas',
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
    title: 'Add from movie details',
    narration: 'MovieDetailsComponent calls WatchlistService.add() — same POST /api/v1/watchlist you traced on the server.',
    takeaway: 'Client action → Fastify route',
    stage: 'bullets',
    bullets: [
      'Details page owns the button',
      'Service owns the HTTP call',
      'Toast reports success or failure',
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
    narration: 'Fastify composes the API. Angular composes the UI. One watchlist request ties them together.',
    takeaway: 'Boot the API. Guard the routes. Follow one request.',
    stage: 'finale',
  },
];
`;

// Match curly apostrophe in "That's"
const finaleRe =
  /  \{\r?\n    id: 'finale',\r?\n    act: 3,\r?\n    actTitle: 'Part 3',\r?\n    sceneLabel: 'Done',\r?\n    title: 'That.s the path',\r?\n    narration: 'Bootstrap → modules → one watchlist request\. Fastify stays composed\.',\r?\n    takeaway: 'Boot\. Register\. Follow one request\.',\r?\n    stage: 'finale',\r?\n  \},\r?\n\];/;

if (!finaleRe.test(s)) {
  // Try exact characters from file
  const idx = s.lastIndexOf("id: 'finale'");
  console.log('finale idx', idx);
  console.log(JSON.stringify(s.slice(idx - 20, idx + 280)));
  process.exit(1);
}

s = s.replace(finaleRe, part4.trimEnd() + '\n');

fs.writeFileSync(path, s);
console.log('ok scenes', (s.match(/^\s+id: '/gm) || []).length);
