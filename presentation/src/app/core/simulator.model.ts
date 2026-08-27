import { CodeSnippet } from './snippets';

export type SimPhase =
  | 'void'
  | 'boot'
  | 'infrastructure'
  | 'modules'
  | 'inspect'
  | 'request'
  | 'xray'
  | 'failure'
  | 'concepts'
  | 'observatory';

export interface PhaseMeta {
  id: SimPhase;
  command: string;
  title: string;
  hint: string;
}

export const PHASES: PhaseMeta[] = [
  { id: 'void', command: 'STANDBY', title: 'Runtime dormant', hint: 'Space — initiate boot' },
  { id: 'boot', command: 'BOOT', title: 'Boot sequence', hint: 'Space — assemble infrastructure' },
  { id: 'infrastructure', command: 'DOCK_PLUGINS', title: 'Infrastructure assembly', hint: 'Space — dock feature modules' },
  { id: 'modules', command: 'DOCK_MODULES', title: 'Module bay', hint: 'Click a module · Space — open dependency graph' },
  { id: 'inspect', command: 'GRAPH', title: 'Living dependency graph', hint: 'Space — launch request flight' },
  { id: 'request', command: 'FLIGHT', title: 'Request flight', hint: 'Space — enable X-Ray mode' },
  { id: 'xray', command: 'XRAY', title: 'X-Ray execution', hint: 'Space — simulate failure' },
  { id: 'failure', command: 'FAULT', title: 'Failure mode', hint: 'Space — reveal Fastify concepts' },
  { id: 'concepts', command: 'CONCEPTS', title: 'Fastify superpowers', hint: 'Space — observatory pullback' },
  { id: 'observatory', command: 'OBSERVE', title: 'Architecture observatory', hint: 'Orbit with mouse · R restart' },
];

export const SIM_PLUGINS = [
  { id: 'helmet', label: 'Helmet', effect: 'Shield lattice' },
  { id: 'cors', label: 'CORS', effect: 'Origin gate' },
  { id: 'compress', label: 'Compress', effect: 'Velocity boost' },
  { id: 'cookie', label: 'Cookie', effect: 'Session channel' },
  { id: 'jwt', label: 'JWT', effect: 'Identity ring' },
  { id: 'swagger', label: 'Swagger', effect: 'Holo docs' },
  { id: 'rate-limit', label: 'Rate Limit', effect: 'Security grid' },
  { id: 'error-handler', label: 'Errors', effect: 'Fault surface' },
] as const;

export const SIM_MODULES = [
  { id: 'auth', label: 'Auth' },
  { id: 'users', label: 'Users' },
  { id: 'tmdb', label: 'TMDb' },
  { id: 'watchlist', label: 'Watchlist' },
  { id: 'favorites', label: 'Favorites' },
  { id: 'ratings', label: 'Ratings' },
  { id: 'journal', label: 'Journal' },
  { id: 'collections', label: 'Collections' },
  { id: 'statistics', label: 'Statistics' },
  { id: 'recommendations', label: 'Recs' },
] as const;

export const AUTH_LAYERS = [
  'Routes',
  'Controller',
  'Service',
  'Repository',
  'Schema',
  'Model',
] as const;

export const BOOT_LINES = [
  'Loading Environment...',
  'Reading Configuration...',
  'Validating Variables...',
  'Creating Fastify Instance...',
  'Connecting Logger (Pino)...',
  'AJV compiler ready.',
];

export const REQUEST_PATH = [
  'Browser',
  'Fastify',
  'Plugins',
  'Validation',
  'Route',
  'Controller',
  'Service',
  'Repository',
  'MongoDB',
  'JWT + Cookie',
  'Response',
] as const;

export interface SimFocus {
  kind: 'none' | 'plugin' | 'module' | 'layer' | 'request-stop';
  id: string;
  label: string;
  detail: string;
  snippet?: CodeSnippet;
}
