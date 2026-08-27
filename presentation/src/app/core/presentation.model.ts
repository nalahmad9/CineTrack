export type ActId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type { CodeSnippet } from './snippets';
import type { CodeSnippet } from './snippets';

export type StageKind =
  | 'intro'
  | 'goals'
  | 'boot'
  | 'plugins'
  | 'modules'
  | 'layers'
  | 'request'
  | 'concepts'
  | 'repos'
  | 'overview'
  | 'compare';

export type CodeSide = 'left' | 'right' | 'bottom';

export interface CameraPose {
  x: number;
  y: number;
  scale: number;
}

export interface DetailPoint {
  title: string;
  body: string;
}

export interface Beat {
  id: string;
  act: ActId;
  label: string;
  headline: string;
  body: string;
  points?: DetailPoint[];
  stage: StageKind;
  highlight?: number;
  snippet?: CodeSnippet;
  codeSide?: CodeSide;
  camera: CameraPose;
  corePower?: number;
  sound?: 'boot' | 'connect' | 'type' | 'whoosh' | 'pulse';
}

export interface ActMeta {
  id: ActId;
  title: string;
  short: string;
}

export const ACTS: ActMeta[] = [
  { id: 1, title: 'The Challenge', short: 'Challenge' },
  { id: 2, title: 'Boot Sequence', short: 'Boot' },
  { id: 3, title: 'Infrastructure', short: 'Plugins' },
  { id: 4, title: 'Feature Modules', short: 'Modules' },
  { id: 5, title: 'Inside Auth', short: 'Layers' },
  { id: 6, title: 'Request Journey', short: 'Request' },
  { id: 7, title: 'Fastify Concepts', short: 'Concepts' },
  { id: 8, title: 'Repositories', short: 'Repos' },
  { id: 9, title: 'Full Picture', short: 'Overview' },
  { id: 10, title: 'Why Fastify', short: 'Why' },
];

export const PLUGINS = [
  { id: 'error-handler', label: 'Errors', role: 'Uniform AppError + 404' },
  { id: 'cors', label: 'CORS', role: 'Credentialed origins' },
  { id: 'helmet', label: 'Helmet', role: 'Hardens headers' },
  { id: 'compress', label: 'Compress', role: 'gzip / br' },
  { id: 'rate-limit', label: 'Rate Limit', role: 'Opt-in per route' },
  { id: 'cookie', label: 'Cookie', role: 'httpOnly token' },
  { id: 'jwt', label: 'JWT', role: 'Sign & verify' },
  { id: 'swagger', label: 'Swagger', role: 'Docs at /docs' },
] as const;

export const MODULES = [
  { id: 'auth', label: 'Auth', path: '/auth' },
  { id: 'users', label: 'Users', path: '/users' },
  { id: 'tmdb', label: 'TMDb', path: '/tmdb' },
  { id: 'watchlist', label: 'Watchlist', path: '/watchlist' },
  { id: 'favorites', label: 'Favorites', path: '/favorites' },
  { id: 'ratings', label: 'Ratings', path: '/ratings' },
  { id: 'journal', label: 'Journal', path: '/journal' },
  { id: 'collections', label: 'Collections', path: '/collections' },
  { id: 'statistics', label: 'Statistics', path: '/statistics' },
  { id: 'recommendations', label: 'Recs', path: '/recommendations' },
] as const;

export const AUTH_LAYERS = [
  { id: 'routes', label: 'Routes', file: 'auth.routes.ts', detail: 'HTTP contract & rate limits' },
  { id: 'controller', label: 'Controller', file: 'auth.controller.ts', detail: 'Zod · jwtSign · cookies' },
  { id: 'service', label: 'Service', file: 'auth.service.ts', detail: 'Business rules · bcrypt' },
  { id: 'repository', label: 'UsersRepository', file: 'users.repository.ts', detail: 'Persistence delegated' },
  { id: 'database', label: 'MongoDB', file: 'User model', detail: 'User documents' },
] as const;

export const REQUEST_STOPS = [
  { label: 'Browser', detail: 'POST /api/v1/auth/login' },
  { label: 'Fastify', detail: 'Enters the instance' },
  { label: 'Plugins', detail: 'CORS · Helmet · Rate · Cookie' },
  { label: 'Route', detail: 'auth.routes match' },
  { label: 'Controller', detail: 'parseOrThrow(loginSchema)' },
  { label: 'Service', detail: 'verifyPassword' },
  { label: 'Repository', detail: 'findByEmailWithPassword' },
  { label: 'MongoDB', detail: 'Document returned' },
] as const;

export const CONCEPTS = [
  { label: 'Fastify()', detail: 'Root instance · logger · AJV' },
  { label: 'register()', detail: 'Dock plugins into encapsulation' },
  { label: 'Encapsulation', detail: 'Context stays local unless shared' },
  { label: 'Hooks', detail: 'onRequest · preHandler · onSend' },
  { label: 'Decorators', detail: 'Extend instance safely' },
  { label: 'Schemas + AJV', detail: 'Compiled validators' },
  { label: 'Swagger', detail: 'Docs from the same schemas' },
] as const;

export const REPO_PATTERNS = [
  { label: 'MongoDB CRUD', detail: 'Users · Watchlist · Favorites', tone: '#3dffe0' },
  { label: 'External API', detail: 'TMDb discovery & search', tone: '#ff4d6d' },
  { label: 'Aggregation', detail: 'Statistics pipelines', tone: '#ffd60a' },
  { label: 'Composition', detail: 'Recommendations assemble sources', tone: '#c4b5fd' },
] as const;

export const DEFAULT_CAMERA: CameraPose = { x: 0, y: 0, scale: 1 };
