import { CodeSnippet, SNIPPETS } from '../core/snippets';

export type StageKind =
  | 'title'
  | 'cover'
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
  | 'ui'
  | 'tmdb'
  | 'compare'
  | 'demo'
  | 'finale';

/** Mini CineTrack UI mock shown in Part 4 */
export type UiMockKind =
  | 'overview'
  | 'pillars'
  | 'component'
  | 'signals'
  | 'routing'
  | 'guards'
  | 'rxjs'
  | 'services'
  | 'watchlist'
  | 'details';

export interface FolderNode {
  id: string;
  label: string;
  depth: number;
  kind: 'dir' | 'file';
  /** Parent id for progressive reveal */
  parent?: string;
}

export interface CinemaScene {
  id: string;
  act: number;
  actTitle: string;
  sceneLabel: string;
  title: string;
  /** One short line — typed on screen */
  narration: string;
  takeaway: string;
  stage: StageKind;
  bullets?: string[];
  /** Show full tree (all nodes) */
  folderFull?: boolean;
  /** Ids visible when not full; empty = empty folder */
  folderVisible?: string[];
  folderSpot?: string;
  bootSpot?: 'env' | 'fastify' | 'plugins' | 'modules' | 'health' | 'all';
  pluginSpot?: number | 'overview';
  globalSpot?: 'errors' | 'responses' | 'both';
  moduleSpot?: string;
  authSpot?: number;
  requestSpot?: number;
  snippet?: CodeSnippet;
  focusLines?: number[];
  treePath?: string[];
  /** Which folder tree to render */
  folderTree?: 'server' | 'client';
  /** Spotlight opener brand (defaults to Fastify) */
  engineBrand?: string;
  engineSubtitle?: string;
  /** Concept cards for ideas stage */
  ideas?: { name: string; plain: string; example?: string }[];
  /** Mini app UI mock for Angular teaching */
  uiMock?: UiMockKind;
  /** Concrete CineTrack example under the mock */
  example?: string;
}

/** Complete server tree — matches the real CineTrack backend */
export const FOLDER_TREE: FolderNode[] = [
  { id: 'server', label: 'server/', depth: 0, kind: 'dir' },
  { id: 'src', label: 'src/', depth: 1, kind: 'dir', parent: 'server' },

  { id: 'app.ts', label: 'app.ts', depth: 2, kind: 'file', parent: 'src' },
  { id: 'server.ts', label: 'server.ts', depth: 2, kind: 'file', parent: 'src' },

  { id: 'config', label: 'config/', depth: 2, kind: 'dir', parent: 'src' },
  { id: 'config/env.ts', label: 'env.ts', depth: 3, kind: 'file', parent: 'config' },
  { id: 'config/env.schema.ts', label: 'env.schema.ts', depth: 3, kind: 'file', parent: 'config' },
  { id: 'config/index.ts', label: 'index.ts', depth: 3, kind: 'file', parent: 'config' },

  { id: 'database', label: 'database/', depth: 2, kind: 'dir', parent: 'src' },
  { id: 'database/connection.ts', label: 'connection.ts', depth: 3, kind: 'file', parent: 'database' },
  { id: 'database/index.ts', label: 'index.ts', depth: 3, kind: 'file', parent: 'database' },

  { id: 'plugins', label: 'plugins/', depth: 2, kind: 'dir', parent: 'src' },
  { id: 'plugins/index.ts', label: 'index.ts', depth: 3, kind: 'file', parent: 'plugins' },
  { id: 'plugins/error-handler.ts', label: 'error-handler.ts', depth: 3, kind: 'file', parent: 'plugins' },
  { id: 'plugins/cors.ts', label: 'cors.ts', depth: 3, kind: 'file', parent: 'plugins' },
  { id: 'plugins/helmet.ts', label: 'helmet.ts', depth: 3, kind: 'file', parent: 'plugins' },
  { id: 'plugins/compress.ts', label: 'compress.ts', depth: 3, kind: 'file', parent: 'plugins' },
  { id: 'plugins/rate-limit.ts', label: 'rate-limit.ts', depth: 3, kind: 'file', parent: 'plugins' },
  { id: 'plugins/cookie.ts', label: 'cookie.ts', depth: 3, kind: 'file', parent: 'plugins' },
  { id: 'plugins/jwt.ts', label: 'jwt.ts', depth: 3, kind: 'file', parent: 'plugins' },
  { id: 'plugins/swagger.ts', label: 'swagger.ts', depth: 3, kind: 'file', parent: 'plugins' },

  { id: 'common', label: 'common/', depth: 2, kind: 'dir', parent: 'src' },
  { id: 'common/index.ts', label: 'index.ts', depth: 3, kind: 'file', parent: 'common' },
  { id: 'common/constants', label: 'constants/', depth: 3, kind: 'dir', parent: 'common' },
  { id: 'common/constants/app.ts', label: 'app.ts', depth: 4, kind: 'file', parent: 'common/constants' },
  { id: 'common/constants/enums.ts', label: 'enums.ts', depth: 4, kind: 'file', parent: 'common/constants' },
  { id: 'common/constants/http.ts', label: 'http.ts', depth: 4, kind: 'file', parent: 'common/constants' },
  { id: 'common/constants/index.ts', label: 'index.ts', depth: 4, kind: 'file', parent: 'common/constants' },
  { id: 'common/errors', label: 'errors/', depth: 3, kind: 'dir', parent: 'common' },
  { id: 'common/errors/app-error.ts', label: 'app-error.ts', depth: 4, kind: 'file', parent: 'common/errors' },
  { id: 'common/errors/error-codes.ts', label: 'error-codes.ts', depth: 4, kind: 'file', parent: 'common/errors' },
  { id: 'common/errors/index.ts', label: 'index.ts', depth: 4, kind: 'file', parent: 'common/errors' },
  { id: 'common/middleware', label: 'middleware/', depth: 3, kind: 'dir', parent: 'common' },
  { id: 'common/middleware/authenticate.ts', label: 'authenticate.ts', depth: 4, kind: 'file', parent: 'common/middleware' },
  { id: 'common/middleware/index.ts', label: 'index.ts', depth: 4, kind: 'file', parent: 'common/middleware' },
  { id: 'common/types', label: 'types/', depth: 3, kind: 'dir', parent: 'common' },
  { id: 'common/types/api.ts', label: 'api.ts', depth: 4, kind: 'file', parent: 'common/types' },
  { id: 'common/types/auth.ts', label: 'auth.ts', depth: 4, kind: 'file', parent: 'common/types' },
  { id: 'common/types/media.ts', label: 'media.ts', depth: 4, kind: 'file', parent: 'common/types' },
  { id: 'common/types/fastify-jwt.d.ts', label: 'fastify-jwt.d.ts', depth: 4, kind: 'file', parent: 'common/types' },
  { id: 'common/types/index.ts', label: 'index.ts', depth: 4, kind: 'file', parent: 'common/types' },
  { id: 'common/utils', label: 'utils/', depth: 3, kind: 'dir', parent: 'common' },
  { id: 'common/utils/response.ts', label: 'response.ts', depth: 4, kind: 'file', parent: 'common/utils' },
  { id: 'common/utils/logger.ts', label: 'logger.ts', depth: 4, kind: 'file', parent: 'common/utils' },
  { id: 'common/utils/helpers.ts', label: 'helpers.ts', depth: 4, kind: 'file', parent: 'common/utils' },
  { id: 'common/utils/mongoose.ts', label: 'mongoose.ts', depth: 4, kind: 'file', parent: 'common/utils' },
  { id: 'common/utils/index.ts', label: 'index.ts', depth: 4, kind: 'file', parent: 'common/utils' },
  { id: 'common/validators', label: 'validators/', depth: 3, kind: 'dir', parent: 'common' },
  { id: 'common/validators/schemas.ts', label: 'schemas.ts', depth: 4, kind: 'file', parent: 'common/validators' },
  { id: 'common/validators/helpers.ts', label: 'helpers.ts', depth: 4, kind: 'file', parent: 'common/validators' },
  { id: 'common/validators/index.ts', label: 'index.ts', depth: 4, kind: 'file', parent: 'common/validators' },

  { id: 'modules', label: 'modules/', depth: 2, kind: 'dir', parent: 'src' },
  { id: 'modules/index.ts', label: 'index.ts', depth: 3, kind: 'file', parent: 'modules' },

  { id: 'modules/auth', label: 'auth/', depth: 3, kind: 'dir', parent: 'modules' },
  { id: 'modules/auth/index.ts', label: 'index.ts', depth: 4, kind: 'file', parent: 'modules/auth' },
  { id: 'modules/auth/auth.routes.ts', label: 'auth.routes.ts', depth: 4, kind: 'file', parent: 'modules/auth' },
  { id: 'modules/auth/auth.controller.ts', label: 'auth.controller.ts', depth: 4, kind: 'file', parent: 'modules/auth' },
  { id: 'modules/auth/auth.service.ts', label: 'auth.service.ts', depth: 4, kind: 'file', parent: 'modules/auth' },
  { id: 'modules/auth/auth.repository.ts', label: 'auth.repository.ts', depth: 4, kind: 'file', parent: 'modules/auth' },
  { id: 'modules/auth/auth.schema.ts', label: 'auth.schema.ts', depth: 4, kind: 'file', parent: 'modules/auth' },
  { id: 'modules/auth/auth.password.ts', label: 'auth.password.ts', depth: 4, kind: 'file', parent: 'modules/auth' },
  { id: 'modules/auth/auth.model.ts', label: 'auth.model.ts', depth: 4, kind: 'file', parent: 'modules/auth' },
  { id: 'modules/auth/auth.types.ts', label: 'auth.types.ts', depth: 4, kind: 'file', parent: 'modules/auth' },

  { id: 'modules/users', label: 'users/', depth: 3, kind: 'dir', parent: 'modules' },
  { id: 'modules/users/index.ts', label: 'index.ts', depth: 4, kind: 'file', parent: 'modules/users' },
  { id: 'modules/users/users.routes.ts', label: 'users.routes.ts', depth: 4, kind: 'file', parent: 'modules/users' },
  { id: 'modules/users/users.controller.ts', label: 'users.controller.ts', depth: 4, kind: 'file', parent: 'modules/users' },
  { id: 'modules/users/users.service.ts', label: 'users.service.ts', depth: 4, kind: 'file', parent: 'modules/users' },
  { id: 'modules/users/users.repository.ts', label: 'users.repository.ts', depth: 4, kind: 'file', parent: 'modules/users' },
  { id: 'modules/users/users.model.ts', label: 'users.model.ts', depth: 4, kind: 'file', parent: 'modules/users' },
  { id: 'modules/users/users.schema.ts', label: 'users.schema.ts', depth: 4, kind: 'file', parent: 'modules/users' },
  { id: 'modules/users/users.types.ts', label: 'users.types.ts', depth: 4, kind: 'file', parent: 'modules/users' },

  { id: 'modules/tmdb', label: 'tmdb/', depth: 3, kind: 'dir', parent: 'modules' },
  { id: 'modules/tmdb/index.ts', label: 'index.ts', depth: 4, kind: 'file', parent: 'modules/tmdb' },
  { id: 'modules/tmdb/tmdb.routes.ts', label: 'tmdb.routes.ts', depth: 4, kind: 'file', parent: 'modules/tmdb' },
  { id: 'modules/tmdb/tmdb.controller.ts', label: 'tmdb.controller.ts', depth: 4, kind: 'file', parent: 'modules/tmdb' },
  { id: 'modules/tmdb/tmdb.service.ts', label: 'tmdb.service.ts', depth: 4, kind: 'file', parent: 'modules/tmdb' },
  { id: 'modules/tmdb/tmdb.repository.ts', label: 'tmdb.repository.ts', depth: 4, kind: 'file', parent: 'modules/tmdb' },
  { id: 'modules/tmdb/tmdb.model.ts', label: 'tmdb.model.ts', depth: 4, kind: 'file', parent: 'modules/tmdb' },
  { id: 'modules/tmdb/tmdb.schema.ts', label: 'tmdb.schema.ts', depth: 4, kind: 'file', parent: 'modules/tmdb' },
  { id: 'modules/tmdb/tmdb.types.ts', label: 'tmdb.types.ts', depth: 4, kind: 'file', parent: 'modules/tmdb' },

  { id: 'modules/watchlist', label: 'watchlist/', depth: 3, kind: 'dir', parent: 'modules' },
  { id: 'modules/watchlist/index.ts', label: 'index.ts', depth: 4, kind: 'file', parent: 'modules/watchlist' },
  { id: 'modules/watchlist/watchlist.routes.ts', label: 'watchlist.routes.ts', depth: 4, kind: 'file', parent: 'modules/watchlist' },
  { id: 'modules/watchlist/watchlist.controller.ts', label: 'watchlist.controller.ts', depth: 4, kind: 'file', parent: 'modules/watchlist' },
  { id: 'modules/watchlist/watchlist.service.ts', label: 'watchlist.service.ts', depth: 4, kind: 'file', parent: 'modules/watchlist' },
  { id: 'modules/watchlist/watchlist.repository.ts', label: 'watchlist.repository.ts', depth: 4, kind: 'file', parent: 'modules/watchlist' },
  { id: 'modules/watchlist/watchlist.model.ts', label: 'watchlist.model.ts', depth: 4, kind: 'file', parent: 'modules/watchlist' },
  { id: 'modules/watchlist/watchlist.schema.ts', label: 'watchlist.schema.ts', depth: 4, kind: 'file', parent: 'modules/watchlist' },
  { id: 'modules/watchlist/watchlist.types.ts', label: 'watchlist.types.ts', depth: 4, kind: 'file', parent: 'modules/watchlist' },

  { id: 'modules/favorites', label: 'favorites/', depth: 3, kind: 'dir', parent: 'modules' },
  { id: 'modules/favorites/index.ts', label: 'index.ts', depth: 4, kind: 'file', parent: 'modules/favorites' },
  { id: 'modules/favorites/favorites.routes.ts', label: 'favorites.routes.ts', depth: 4, kind: 'file', parent: 'modules/favorites' },
  { id: 'modules/favorites/favorites.controller.ts', label: 'favorites.controller.ts', depth: 4, kind: 'file', parent: 'modules/favorites' },
  { id: 'modules/favorites/favorites.service.ts', label: 'favorites.service.ts', depth: 4, kind: 'file', parent: 'modules/favorites' },
  { id: 'modules/favorites/favorites.repository.ts', label: 'favorites.repository.ts', depth: 4, kind: 'file', parent: 'modules/favorites' },
  { id: 'modules/favorites/favorites.model.ts', label: 'favorites.model.ts', depth: 4, kind: 'file', parent: 'modules/favorites' },
  { id: 'modules/favorites/favorites.schema.ts', label: 'favorites.schema.ts', depth: 4, kind: 'file', parent: 'modules/favorites' },
  { id: 'modules/favorites/favorites.types.ts', label: 'favorites.types.ts', depth: 4, kind: 'file', parent: 'modules/favorites' },

  { id: 'modules/ratings', label: 'ratings/', depth: 3, kind: 'dir', parent: 'modules' },
  { id: 'modules/ratings/index.ts', label: 'index.ts', depth: 4, kind: 'file', parent: 'modules/ratings' },
  { id: 'modules/ratings/ratings.routes.ts', label: 'ratings.routes.ts', depth: 4, kind: 'file', parent: 'modules/ratings' },
  { id: 'modules/ratings/ratings.controller.ts', label: 'ratings.controller.ts', depth: 4, kind: 'file', parent: 'modules/ratings' },
  { id: 'modules/ratings/ratings.service.ts', label: 'ratings.service.ts', depth: 4, kind: 'file', parent: 'modules/ratings' },
  { id: 'modules/ratings/ratings.repository.ts', label: 'ratings.repository.ts', depth: 4, kind: 'file', parent: 'modules/ratings' },
  { id: 'modules/ratings/ratings.model.ts', label: 'ratings.model.ts', depth: 4, kind: 'file', parent: 'modules/ratings' },
  { id: 'modules/ratings/ratings.schema.ts', label: 'ratings.schema.ts', depth: 4, kind: 'file', parent: 'modules/ratings' },
  { id: 'modules/ratings/ratings.types.ts', label: 'ratings.types.ts', depth: 4, kind: 'file', parent: 'modules/ratings' },

  { id: 'modules/journal', label: 'journal/', depth: 3, kind: 'dir', parent: 'modules' },
  { id: 'modules/journal/index.ts', label: 'index.ts', depth: 4, kind: 'file', parent: 'modules/journal' },
  { id: 'modules/journal/journal.routes.ts', label: 'journal.routes.ts', depth: 4, kind: 'file', parent: 'modules/journal' },
  { id: 'modules/journal/journal.controller.ts', label: 'journal.controller.ts', depth: 4, kind: 'file', parent: 'modules/journal' },
  { id: 'modules/journal/journal.service.ts', label: 'journal.service.ts', depth: 4, kind: 'file', parent: 'modules/journal' },
  { id: 'modules/journal/journal.repository.ts', label: 'journal.repository.ts', depth: 4, kind: 'file', parent: 'modules/journal' },
  { id: 'modules/journal/journal.model.ts', label: 'journal.model.ts', depth: 4, kind: 'file', parent: 'modules/journal' },
  { id: 'modules/journal/journal.schema.ts', label: 'journal.schema.ts', depth: 4, kind: 'file', parent: 'modules/journal' },
  { id: 'modules/journal/journal.types.ts', label: 'journal.types.ts', depth: 4, kind: 'file', parent: 'modules/journal' },

  { id: 'modules/collections', label: 'collections/', depth: 3, kind: 'dir', parent: 'modules' },
  { id: 'modules/collections/index.ts', label: 'index.ts', depth: 4, kind: 'file', parent: 'modules/collections' },
  { id: 'modules/collections/collections.routes.ts', label: 'collections.routes.ts', depth: 4, kind: 'file', parent: 'modules/collections' },
  { id: 'modules/collections/collections.controller.ts', label: 'collections.controller.ts', depth: 4, kind: 'file', parent: 'modules/collections' },
  { id: 'modules/collections/collections.service.ts', label: 'collections.service.ts', depth: 4, kind: 'file', parent: 'modules/collections' },
  { id: 'modules/collections/collections.repository.ts', label: 'collections.repository.ts', depth: 4, kind: 'file', parent: 'modules/collections' },
  { id: 'modules/collections/collections.model.ts', label: 'collections.model.ts', depth: 4, kind: 'file', parent: 'modules/collections' },
  { id: 'modules/collections/collections.schema.ts', label: 'collections.schema.ts', depth: 4, kind: 'file', parent: 'modules/collections' },
  { id: 'modules/collections/collections.types.ts', label: 'collections.types.ts', depth: 4, kind: 'file', parent: 'modules/collections' },

  { id: 'modules/statistics', label: 'statistics/', depth: 3, kind: 'dir', parent: 'modules' },
  { id: 'modules/statistics/index.ts', label: 'index.ts', depth: 4, kind: 'file', parent: 'modules/statistics' },
  { id: 'modules/statistics/statistics.routes.ts', label: 'statistics.routes.ts', depth: 4, kind: 'file', parent: 'modules/statistics' },
  { id: 'modules/statistics/statistics.controller.ts', label: 'statistics.controller.ts', depth: 4, kind: 'file', parent: 'modules/statistics' },
  { id: 'modules/statistics/statistics.service.ts', label: 'statistics.service.ts', depth: 4, kind: 'file', parent: 'modules/statistics' },
  { id: 'modules/statistics/statistics.repository.ts', label: 'statistics.repository.ts', depth: 4, kind: 'file', parent: 'modules/statistics' },
  { id: 'modules/statistics/statistics.model.ts', label: 'statistics.model.ts', depth: 4, kind: 'file', parent: 'modules/statistics' },
  { id: 'modules/statistics/statistics.schema.ts', label: 'statistics.schema.ts', depth: 4, kind: 'file', parent: 'modules/statistics' },
  { id: 'modules/statistics/statistics.types.ts', label: 'statistics.types.ts', depth: 4, kind: 'file', parent: 'modules/statistics' },

  { id: 'modules/recommendations', label: 'recommendations/', depth: 3, kind: 'dir', parent: 'modules' },
  { id: 'modules/recommendations/index.ts', label: 'index.ts', depth: 4, kind: 'file', parent: 'modules/recommendations' },
  { id: 'modules/recommendations/recommendations.routes.ts', label: 'recommendations.routes.ts', depth: 4, kind: 'file', parent: 'modules/recommendations' },
  { id: 'modules/recommendations/recommendations.controller.ts', label: 'recommendations.controller.ts', depth: 4, kind: 'file', parent: 'modules/recommendations' },
  { id: 'modules/recommendations/recommendations.service.ts', label: 'recommendations.service.ts', depth: 4, kind: 'file', parent: 'modules/recommendations' },
  { id: 'modules/recommendations/recommendations.repository.ts', label: 'recommendations.repository.ts', depth: 4, kind: 'file', parent: 'modules/recommendations' },
  { id: 'modules/recommendations/recommendations.model.ts', label: 'recommendations.model.ts', depth: 4, kind: 'file', parent: 'modules/recommendations' },
  { id: 'modules/recommendations/recommendations.schema.ts', label: 'recommendations.schema.ts', depth: 4, kind: 'file', parent: 'modules/recommendations' },
  { id: 'modules/recommendations/recommendations.types.ts', label: 'recommendations.types.ts', depth: 4, kind: 'file', parent: 'modules/recommendations' },
];

/** Ids for the complete tree (used by folderFull) */
export const ALL_FOLDER_IDS = FOLDER_TREE.map((n) => n.id);

/** Main folders get bold + color in the diagram */
export const MAIN_FOLDER_COLORS: Record<string, string> = {
  server: '#f5c518',
  src: '#f5c518',
  'app.ts': '#ff8a5b',
  'server.ts': '#e8a317',
  config: '#F59E0B',
  database: '#60a5fa',
  plugins: '#a78bfa',
  common: '#F59E0B',
  modules: '#34d399',
  'modules/auth': '#2563EB',
  'modules/users': '#6366F1',
  'modules/tmdb': '#F59E0B',
  'modules/watchlist': '#2563EB',
  'modules/favorites': '#EF4444',
  'modules/ratings': '#F59E0B',
  'modules/journal': '#10B981',
  'modules/collections': '#6366F1',
  'modules/statistics': '#2563EB',
  'modules/recommendations': '#6366F1',
};

/** One-line responsibility for each layout highlight */
export const FOLDER_BRIEFS: Record<string, string> = {
  server: 'Backend package root — Node API for CineTrack.',
  src: 'All application source for the Fastify server.',
  'app.ts': 'Creates Fastify() and wires plugins + modules with app.register.',
  'server.ts': 'Connects MongoDB, then starts the server with app.listen.',
  config: 'Environment loading and Zod schema validation.',
  database: 'MongoDB connection setup used by repositories.',
  plugins: 'Cross-cutting Fastify plugins registered via registerPlugins().',
  common: 'Shared errors, types, middleware, validators, and helpers.',
  modules: 'Feature domains — each module is a Fastify plugin under /api/v1.',
};

export interface TocChild {
  /** Scene id to jump to */
  sceneId: string;
  title: string;
  module: string;
}

export interface TocSection {
  act: number;
  title: string;
  hint: string;
  children?: TocChild[];
}

export const MODULE_FOLDER: Record<string, string> = {
  Auth: 'auth',
  Users: 'users',
  TMDb: 'tmdb',
  Watchlist: 'watchlist',
  Favorites: 'favorites',
  Ratings: 'ratings',
  Journal: 'journal',
  Collections: 'collections',
  Statistics: 'statistics',
  Recommendations: 'recommendations',
};

export const TOC_SECTIONS: TocSection[] = [
  { act: 1, title: 'Bootstrap', hint: 'Boot · plugins · shared rules' },
  { act: 2, title: 'Modules', hint: 'Domain plugins' },
  { act: 3, title: 'One request', hint: 'Watchlist end-to-end' },
  { act: 4, title: 'Angular', hint: 'Client architecture' },
  { act: 5, title: 'React vs Angular', hint: 'Two frontend approaches' },
  { act: 6, title: 'Demo', hint: 'CineTrack in action' },
];

/** Escape HTML and wrap Fastify / Fastify API mentions for highlighting. */
export function markFastify(text: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return highlightFastifySyntax(escaped);
}

/** Highlight Fastify name and common Fastify syntax (expects already-escaped text). */
export function highlightFastifySyntax(escaped: string): string {
  const held: string[] = [];
  const hold = (html: string) => {
    held.push(html);
    return `\u0000${held.length - 1}\u0000`;
  };

  let out = escaped;
  const rules: Array<[RegExp, (m: string, ...args: string[]) => string]> = [
    [/\bFastify\(\)/g, () => hold('<span class="kw-fastify">Fastify()</span>')],
    [/\bregisterPlugins\(\)/g, () => hold('<span class="kw-fastify">registerPlugins()</span>')],
    [/\bregisterModules\(\)/g, () => hold('<span class="kw-fastify">registerModules()</span>')],
    [/\bapp\.register\b/g, () => hold('<span class="kw-fastify">app.register</span>')],
    [/\bfastify-plugin\b/gi, (m) => hold(`<span class="kw-fastify">${m}</span>`)],
    [
      /\b(preHandler|onRequest|preValidation|preSerialization|onSend|onResponse|onError)\b/g,
      (m) => hold(`<span class="kw-fastify">${m}</span>`),
    ],
    [
      /\b(decorateRequest|decorateReply|decorate)\b/g,
      (m) => hold(`<span class="kw-fastify">${m}</span>`),
    ],
    [
      /\b(jwtSign|jwtVerify|setCookie|clearCookie)\b/g,
      (m) => hold(`<span class="kw-fastify">${m}</span>`),
    ],
    [/\bapp\.listen\b/g, () => hold('<span class="kw-fastify">app.listen</span>')],
    [/\bFastify\b/g, () => hold('<span class="kw-fastify">Fastify</span>')],
    [/\bfastify\b/g, () => hold('<span class="kw-fastify">fastify</span>')],
  ];

  for (const [re, rep] of rules) {
    out = out.replace(re, rep as never);
  }

  return out.replace(/\u0000(\d+)\u0000/g, (_, i) => held[Number(i)] ?? '');
}

/** Short one-liners for the module tour popup */
export const MODULE_BRIEFS: Record<string, string> = {
  Auth: 'Register, login, logout — issues the JWT cookie.',
  Users: 'Profile endpoints and the shared User model.',
  TMDb: 'Movie & TV catalog via The Movie Database API.',
  Watchlist: 'Track what you plan to watch, are watching, or finished.',
  Favorites: 'Quick heart/save for titles you love.',
  Ratings: 'Score titles and optionally leave a review.',
  Journal: 'Personal notes and diary entries per title.',
  Collections: 'Named playlists of movies and shows.',
  Statistics: 'Your watching stats in one cached snapshot.',
  Recommendations: 'Suggestions from your taste + TMDb trends.',
};

export const MODULE_DETAILS: Record<
  string,
  {
    color: string;
    blurb: string;
    files: string;
    routes: string;
    points: string[];
    dive?: boolean;
  }
> = {
  Auth: {
    color: '#2563EB',
    blurb: 'Identity boundary — register, login, logout. Issues JWT and sets an httpOnly cookie.',
    files: 'routes · controller · service · password · schema',
    routes: 'POST /auth/register · /auth/login · /auth/logout',
    points: [
      'Rate-limited: 10 requests / IP / minute on register & login',
      'bcrypt (12 rounds) hashes passwords; never stores plain text',
      'reply.jwtSign({ sub, email }) then setCookie(accessToken)',
      'Reuses usersRepository — Auth does not own the User collection',
      'Generic “Invalid email or password” — no user enumeration',
    ],
    dive: true,
  },
  Users: {
    color: '#6366F1',
    blurb: 'Current-user profile. Owns the User Mongoose model that Auth and others depend on.',
    files: 'routes · controller · service · repository · model',
    routes: 'GET /users/me · PATCH /users/me',
    points: [
      'JWT-protected — authenticate middleware required',
      'PATCH only updates displayName (2–80 chars)',
      'Returns public user shape — never the password hash',
      'Unique email index in MongoDB',
      'Shared repository used by Auth for create / find-by-email',
    ],
  },
  TMDb: {
    color: '#F59E0B',
    blurb: 'Catalog proxy to The Movie Database — search, details, trending, discover. No Mongo for titles.',
    files: 'routes · controller · service · repository',
    routes: 'GET /tmdb/search · /movie/:id · /tv/:id · /trending · /discover/*',
    points: [
      'Public routes — no JWT required',
      'HTTP fetch to TMDB_BASE_URL with api_key from env',
      'Maps upstream errors to 404 / 502 / 503',
      'Repository pattern still applies — but the “DB” is an external API',
      'Trending supports mediaType + timeWindow; discover sorts by popularity',
    ],
  },
  Watchlist: {
    color: '#2563EB',
    blurb: 'Personal tracking: plan to watch, watching, completed, or dropped — with progress.',
    files: 'routes · controller · service · repository · model',
    routes: 'POST|GET /watchlist · GET|PATCH|DELETE /watchlist/:id',
    points: [
      'JWT-scoped to the signed-in user',
      'Status enum + optional season / episode / percent progress',
      'Unique (user, tmdbId, mediaType) → 409 on duplicates',
      'Paginated list; filter by status or mediaType',
      'Same layered plugin shape as Auth',
    ],
  },
  Favorites: {
    color: '#EF4444',
    blurb: 'Lightweight saved titles — just tmdbId + mediaType for quick UI toggles.',
    files: 'routes · controller · service · repository · model',
    routes: 'POST|GET /favorites · DELETE /favorites/:id · /favorites/title/...',
    points: [
      'JWT-protected; unique per user + title',
      '409 if already favorited',
      'Delete by document id OR by mediaType/tmdbId (handy for hearts)',
      'Paginated; optional mediaType filter',
      'Feeds recommendations (exclude already-loved titles)',
    ],
  },
  Ratings: {
    color: '#F59E0B',
    blurb: 'Score and optional review per title — the taste signal for stats and recommendations.',
    files: 'routes · controller · service · repository · model',
    routes: 'POST|GET /ratings · GET|PATCH|DELETE /ratings/:id',
    points: [
      'Score 0.5–10; review max 2000 characters',
      'One rating per title (unique index)',
      'List filters: mediaType, minScore, maxScore',
      'Powers statistics averages and recommendation seeds',
      'JWT-scoped CRUD like the other personal modules',
    ],
  },
  Journal: {
    color: '#10B981',
    blurb: 'Diary entries tied to a title — multiple notes allowed, unlike ratings.',
    files: 'routes · controller · service · repository · model',
    routes: 'POST|GET /journal · GET|PATCH|DELETE /journal/:id',
    points: [
      'Body required (up to 10k chars); optional mood, watchedAt, spoiler flag',
      'No unique-per-title constraint — many entries per movie/show',
      'Filter list by mediaType or tmdbId',
      'Indexed by user + createdAt for fast timelines',
      'JWT-protected like other personal domains',
    ],
  },
  Collections: {
    color: '#6366F1',
    blurb: 'Named playlists of titles — optional public flag and cover art.',
    files: 'routes · controller · service · repository · model',
    routes: 'CRUD /collections · POST|DELETE /collections/:id/items',
    points: [
      'Embedded items[] with tmdbId, mediaType, note, addedAt',
      'Unique (user, collection name)',
      'Conflict if a title is already in that collection',
      'Cover via coverTmdbId / coverMediaType',
      'List can filter by isPublic',
    ],
  },
  Statistics: {
    color: '#2563EB',
    blurb: 'Cached personal snapshot across watchlist, favorites, ratings, journal, collections.',
    files: 'routes · controller · service · repository',
    routes: 'GET /statistics?refresh=',
    points: [
      'Aggregates counts by watchlist status and media type',
      'Rating summary via Mongo $avg / $min / $max',
      'Upserted per-user cache — fast reads',
      'refresh=true recomputes from source collections',
      'Composition module — reads many domains, owns the cache doc',
    ],
  },
  Recommendations: {
    color: '#6366F1',
    blurb: 'Personalized suggestions from taste signals plus TMDb trending.',
    files: 'routes · controller · service · repository',
    routes: 'GET /recommendations?page&limit&mediaType&refresh',
    points: [
      'Hybrid: exclude watchlist / favorites / high ratings, pull weekly trending',
      '24h cache TTL; source = hybrid or tmdb',
      'Score derived from TMDb popularity',
      'Depends on watchlist, favorites, ratings, and tmdb repositories',
      'JWT-protected; refresh=true forces recompute',
    ],
  },
};

export const PLUGIN_CAST = [
  {
    name: 'Error Handler',
    plain: 'Maps thrown errors to a consistent API error response.',
  },
  {
    name: 'CORS',
    plain: 'Allows the Angular client to call this API from the browser.',
  },
  {
    name: 'Helmet',
    plain: 'Sets security HTTP headers on every response.',
  },
  {
    name: 'Compress',
    plain: 'Gzip/brotli-compresses responses to reduce payload size.',
  },
  {
    name: 'Rate Limit',
    plain: 'Caps request rate on opted-in routes (e.g. login).',
  },
  {
    name: 'Cookie',
    plain: 'Parses and sets cookies — used for the JWT session cookie.',
  },
  {
    name: 'JWT',
    plain: 'Signs and verifies JSON Web Tokens for authentication.',
  },
  {
    name: 'Swagger',
    plain: 'Generates interactive OpenAPI docs from your routes.',
  },
];

export const BOOT_CAST = [
  { id: 'env', label: 'Load & validate env' },
  { id: 'fastify', label: 'Create Fastify()' },
  { id: 'plugins', label: 'registerPlugins()' },
  { id: 'modules', label: 'registerModules()' },
  { id: 'health', label: 'GET /health' },
] as const;

export const AUTH_LAYERS = [
  {
    name: 'Routes',
    plain: 'Registers Fastify routes and hooks for Auth (e.g. POST /auth/login).',
  },
  {
    name: 'Controller',
    plain: 'Reads the Fastify request, calls the service, and builds the reply.',
  },
  {
    name: 'Service',
    plain: 'Business logic — verify credentials and issue JWT (jwtSign).',
  },
  {
    name: 'Repository',
    plain: 'Data access layer — load and persist user documents.',
  },
  {
    name: 'MongoDB',
    plain: 'Stores users and password hashes for Auth.',
  },
] as const;

export const REQUEST_HOPS = [
  {
    label: 'WatchlistService',
    tag: 'Angular',
    detail: '',
  },
  {
    label: 'Fastify()',
    tag: 'Server',
    detail: 'The request reaches the Fastify() instance from app.ts.',
  },
  {
    label: 'onRequest auth',
    tag: 'Hook',
    detail: 'authenticate runs as an onRequest hook — jwtVerify checks the cookie/token.',
  },
  {
    label: 'POST /watchlist',
    tag: 'Route',
    detail: 'Fastify matches the Watchlist module route and schema.',
  },
  {
    label: 'Controller',
    tag: 'Module',
    detail: 'Reads the Fastify request, validates the body, calls the service.',
  },
  {
    label: 'Service → MongoDB',
    tag: 'Data',
    detail: 'Business rules run, then the repository saves the watchlist item.',
  },
  {
    label: 'Reply 201',
    tag: 'Client',
    detail: 'Fastify reply returns success({ item }) — the UI shows it on the list.',
  },
];


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
  'core/guards': 'Route access checks — authGuard and guestGuard.',
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

export const MODULE_CAST = [
  'Auth',
  'Users',
  'TMDb',
  'Watchlist',
  'Favorites',
  'Ratings',
  'Journal',
  'Collections',
  'Statistics',
  'Recommendations',
];

const TOP = ['server', 'src', 'app.ts', 'server.ts'];
const WITH_CONFIG = [...TOP, 'config', 'config/env.ts', 'config/env.schema.ts', 'config/index.ts'];
const WITH_DB = [...WITH_CONFIG, 'database', 'database/connection.ts', 'database/index.ts'];
const WITH_PLUGINS = [
  ...WITH_DB,
  'plugins',
  'plugins/index.ts',
  'plugins/error-handler.ts',
  'plugins/cors.ts',
  'plugins/helmet.ts',
  'plugins/compress.ts',
  'plugins/rate-limit.ts',
  'plugins/cookie.ts',
  'plugins/jwt.ts',
  'plugins/swagger.ts',
];
const WITH_COMMON = [
  ...WITH_PLUGINS,
  'common',
  'common/index.ts',
  'common/constants',
  'common/constants/app.ts',
  'common/constants/enums.ts',
  'common/constants/http.ts',
  'common/constants/index.ts',
  'common/errors',
  'common/errors/app-error.ts',
  'common/errors/error-codes.ts',
  'common/errors/index.ts',
  'common/middleware',
  'common/middleware/authenticate.ts',
  'common/middleware/index.ts',
  'common/types',
  'common/types/api.ts',
  'common/types/auth.ts',
  'common/types/media.ts',
  'common/types/fastify-jwt.d.ts',
  'common/types/index.ts',
  'common/utils',
  'common/utils/response.ts',
  'common/utils/logger.ts',
  'common/utils/helpers.ts',
  'common/utils/mongoose.ts',
  'common/utils/index.ts',
  'common/validators',
  'common/validators/schemas.ts',
  'common/validators/helpers.ts',
  'common/validators/index.ts',
];

export const CINEMA_SCENES: CinemaScene[] = [
  {
    id: 'cover',
    act: 0,
    actTitle: 'CineTrack',
    sceneLabel: 'Cover',
    title: 'CineTrack',
    narration: 'Fastify API · Angular client — architecture walkthrough',
    takeaway: 'Press Next to begin',
    stage: 'cover',
  },
  {
    id: 'ch1',
    act: 1,
    actTitle: 'Part 1',
    sceneLabel: 'Overview',
    title: 'How Fastify is wired',
    narration:
      'Fastify creates one central app, then we attach everything it needs. One application is composed from several small, focused parts.',
    takeaway: 'Config · plugins · common · database · modules → one app',
    stage: 'engine',
    bullets: [
      'Bootstrap sequence',
      'Plugins',
      'Shared globals',
    ],
  },
  {
    id: 'folders',
    act: 1,
    actTitle: 'Part 1',
    sceneLabel: 'Layout',
    title: 'server/src layout',
    narration: 'Walk the tree one folder at a time.',
    takeaway: 'Folders = responsibilities',
    stage: 'folder',
    folderVisible: ['server', 'src'],
    folderSpot: 'src',
  },
  {
    id: 'folder-app',
    act: 1,
    actTitle: 'Part 1',
    sceneLabel: 'Layout',
    title: 'app.ts',
    narration: 'Creates Fastify() and wires plugins + modules with app.register.',
    takeaway: 'App factory',
    stage: 'folder',
    folderVisible: ['server', 'src', 'app.ts'],
    folderSpot: 'app.ts',
  },
  {
    id: 'folder-server',
    act: 1,
    actTitle: 'Part 1',
    sceneLabel: 'Layout',
    title: 'server.ts',
    narration: 'Connects MongoDB, then starts the server with app.listen.',
    takeaway: 'Process entry',
    stage: 'folder',
    folderVisible: ['server', 'src', 'app.ts', 'server.ts'],
    folderSpot: 'server.ts',
  },
  {
    id: 'folder-config',
    act: 1,
    actTitle: 'Part 1',
    sceneLabel: 'Layout',
    title: 'config/',
    narration: 'Environment loading and Zod schema validation.',
    takeaway: 'Validated env',
    stage: 'folder',
    folderVisible: ['server', 'src', 'app.ts', 'server.ts', 'config'],
    folderSpot: 'config',
  },
  {
    id: 'folder-database',
    act: 1,
    actTitle: 'Part 1',
    sceneLabel: 'Layout',
    title: 'database/',
    narration: 'MongoDB connection setup used by repositories.',
    takeaway: 'Data connection',
    stage: 'folder',
    folderVisible: ['server', 'src', 'app.ts', 'server.ts', 'config', 'database'],
    folderSpot: 'database',
  },
  {
    id: 'folder-plugins',
    act: 1,
    actTitle: 'Part 1',
    sceneLabel: 'Layout',
    title: 'plugins/',
    narration: 'Cross-cutting Fastify plugins — CORS, JWT, cookies, docs, and more.',
    takeaway: 'Shared infrastructure',
    stage: 'folder',
    folderVisible: ['server', 'src', 'app.ts', 'server.ts', 'config', 'database', 'plugins'],
    folderSpot: 'plugins',
  },
  {
    id: 'folder-common',
    act: 1,
    actTitle: 'Part 1',
    sceneLabel: 'Layout',
    title: 'common/',
    narration: 'Shared errors, types, middleware, validators, and helpers.',
    takeaway: 'Shared building blocks',
    stage: 'folder',
    folderVisible: [
      'server',
      'src',
      'app.ts',
      'server.ts',
      'config',
      'database',
      'plugins',
      'common',
    ],
    folderSpot: 'common',
  },
  {
    id: 'folder-modules',
    act: 1,
    actTitle: 'Part 1',
    sceneLabel: 'Layout',
    title: 'modules/',
    narration: 'Feature domains — each module is a Fastify plugin under /api/v1.',
    takeaway: 'Domain features',
    stage: 'folder',
    folderVisible: [
      'server',
      'src',
      'app.ts',
      'server.ts',
      'config',
      'database',
      'plugins',
      'common',
      'modules',
    ],
    folderSpot: 'modules',
  },
  {
    id: 'boot-env',
    act: 1,
    actTitle: 'Part 1',
    sceneLabel: 'Step 1',
    title: 'Load and validate env',
    narration: 'Zod validates configuration. Invalid env stops the process before listen().',
    takeaway: 'Fail fast before listen()',
    stage: 'boot',
    bootSpot: 'env',
    snippet: SNIPPETS.envLoad,
    focusLines: [1, 4, 5, 6],
    treePath: ['server', 'src', 'config', 'env.ts'],
  },
  {
    id: 'boot-fastify',
    act: 1,
    actTitle: 'Part 1',
    sceneLabel: 'Step 2',
    title: 'Create the Fastify app',
    narration: 'const app = Fastify({ ... }). Plugins and modules register onto it.',
    takeaway: 'const app = Fastify({ ... })',
    stage: 'boot',
    bootSpot: 'fastify',
    snippet: SNIPPETS.buildApp,
    focusLines: [2, 3, 4, 5],
    treePath: ['server', 'src', 'app.ts'],
  },
  {
    id: 'boot-plugins',
    act: 1,
    actTitle: 'Part 1',
    sceneLabel: 'Step 3',
    title: 'Register plugins',
    narration: 'registerPlugins(app) — security, cookies, JWT, docs via app.register.',
    takeaway: 'Infrastructure before features',
    stage: 'boot',
    bootSpot: 'plugins',
    snippet: SNIPPETS.buildApp,
    focusLines: [13],
    treePath: ['server', 'src', 'app.ts'],
  },
  {
    id: 'boot-modules',
    act: 1,
    actTitle: 'Part 1',
    sceneLabel: 'Step 4',
    title: 'Register modules',
    narration: 'registerModules(app) mounts Auth, Watchlist, and the rest under /api/v1.',
    takeaway: 'Features register as plugins too',
    stage: 'boot',
    bootSpot: 'modules',
    snippet: SNIPPETS.buildApp,
    focusLines: [14],
    treePath: ['server', 'src', 'app.ts'],
  },
  {
    id: 'plugins',
    act: 1,
    actTitle: 'Part 1',
    sceneLabel: 'Plugins',
    title: 'Shared plugins',
    narration: 'Eight cross-cutting plugins — registered once, available everywhere.',
    takeaway: 'Register once. Use everywhere.',
    stage: 'plugins',
    pluginSpot: 'overview',
    snippet: SNIPPETS.registerPlugins,
    focusLines: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    treePath: ['server', 'src', 'plugins', 'index.ts'],
  },
  {
    id: 'plugin-jwt',
    act: 1,
    actTitle: 'Part 1',
    sceneLabel: 'JWT',
    title: 'Example: JWT plugin',
    narration: 'One plugin uses decorate to add jwtSign / jwtVerify on the Fastify instance.',
    takeaway: 'Plugins decorate Fastify',
    stage: 'plugins',
    pluginSpot: 6,
    snippet: SNIPPETS.pluginJwt,
    focusLines: [1, 2, 3, 4],
    treePath: ['server', 'src', 'plugins', 'jwt.ts'],
  },
  {
    id: 'globals',
    act: 1,
    actTitle: 'Part 1',
    sceneLabel: 'Globals',
    title: 'Shared errors & responses',
    narration: 'AppError plus success()/failure() keep every module on the same contract.',
    takeaway: 'Shared rules → consistent APIs',
    stage: 'globals',
    globalSpot: 'both',
    snippet: SNIPPETS.responseHelpers,
    focusLines: [1, 2, 3, 4],
    treePath: ['server', 'src', 'common', 'utils', 'response.ts'],
  },
  {
    id: 'tmdb-overview',
    act: 1,
    actTitle: 'Part 1',
    sceneLabel: 'External API',
    title: 'How CineTrack uses TMDb',
    narration:
      'TMDb supplies movie and TV metadata; CineTrack keeps the API key and integration logic on the server.',
    takeaway: 'Angular → Fastify proxy → TMDb',
    stage: 'tmdb',
    bullets: [
      'Search, trending, discover, movie details, TV details',
      'API key stays in server environment variables',
      'Catalog titles are not duplicated in MongoDB',
    ],
    snippet: SNIPPETS.tmdbRepository,
    focusLines: [1, 2, 3, 9, 10, 11, 13],
    treePath: ['server', 'src', 'modules', 'tmdb', 'tmdb.repository.ts'],
  },
  {
    id: 'tmdb-client',
    act: 1,
    actTitle: 'Part 1',
    sceneLabel: 'External API',
    title: 'From TMDb data to the UI',
    narration:
      'Fastify wraps TMDb JSON in CineTrack’s success envelope; Angular unwraps it and builds poster and backdrop URLs from TMDb image paths.',
    takeaway: 'One service powers Dashboard · Discover · Details',
    stage: 'tmdb',
    bullets: [
      '/tmdb/trending fills the dashboard',
      '/tmdb/search and /discover/* fill Discover',
      '/tmdb/movie/:id and /tv/:id power detail pages',
      'Image sizes: w185 · w342 · w500 · w1280',
    ],
    snippet: SNIPPETS.clientTmdb,
    focusLines: [1, 2, 3, 4, 7, 8, 9],
    treePath: ['client', 'src', 'app', 'core', 'services', 'tmdb.service.ts'],
  },

  {
    id: 'ch2',
    act: 2,
    actTitle: 'Part 2',
    sceneLabel: 'Modules',
    title: 'Feature modules',
    narration: 'Each feature is a Fastify plugin with one clear responsibility.',
    takeaway: 'Auth · Users · TMDb · Watchlist · …',
    stage: 'bullets',
    bullets: [
      'A module = a plugin',
      'Own routes under /api/v1',
      'Same layer pattern everywhere',
    ],
  },
  {
    id: 'modules',
    act: 2,
    actTitle: 'Part 2',
    sceneLabel: 'Map',
    title: 'Ten feature modules',
    narration: 'Click any name for a short summary.',
    takeaway: 'Compose the API from plugins',
    stage: 'modules',
    snippet: SNIPPETS.registerModules,
    focusLines: [1, 2, 3, 4],
    treePath: ['server', 'src', 'modules', 'index.ts'],
  },
  {
    id: 'mod-Auth',
    act: 2,
    actTitle: 'Part 2',
    sceneLabel: 'Auth',
    title: 'Auth module',
    narration: 'Register, login, logout — JWT in an httpOnly cookie.',
    takeaway: 'Focus for Part 3',
    stage: 'modules',
    moduleSpot: 'Auth',
    snippet: SNIPPETS.authRoutes,
    focusLines: [1, 2, 3],
    treePath: ['server', 'src', 'modules', 'auth'],
  },
  {
    id: 'auth-layers',
    act: 2,
    actTitle: 'Part 2',
    sceneLabel: 'Auth',
    title: 'Auth layer stack',
    narration:
      'Routes → controller → service → repository → MongoDB — each layer has one job in the Fastify Auth module.',
    takeaway: 'Same pattern in every module',
    stage: 'auth',
    authSpot: 4,
    snippet: SNIPPETS.authController,
    focusLines: [1, 2, 5],
    treePath: ['server', 'src', 'modules', 'auth', 'auth.controller.ts'],
  },

  {
    id: 'ch3',
    act: 3,
    actTitle: 'Part 3',
    sceneLabel: 'One Request',
    title: 'One request: watchlist',
    narration: 'Follow POST /api/v1/watchlist through Fastify — from the client call to the reply.',
    takeaway: 'Client → Fastify → Watchlist → Mongo → reply',
    stage: 'bullets',
    bullets: [
      'Angular WatchlistService fires the call',
      'POST /api/v1/watchlist',
      'Through Fastify hooks, route, and layers',
    ],
  },
  ...REQUEST_HOPS.map((hop, i): CinemaScene => ({
    id: 'req-' + i,
    act: 3,
    actTitle: 'Part 3',
    sceneLabel: hop.tag,
    title: hop.label,
    narration: hop.detail,
    takeaway: 'Follow the request',
    stage: 'request',
    requestSpot: i,
    snippet:
      i === 0
        ? SNIPPETS.clientWatchlist
        : i === 1
          ? SNIPPETS.buildApp
          : i === 2
            ? SNIPPETS.pluginJwt
            : i === 3
              ? SNIPPETS.watchlistRoutes
              : i === 4
                ? SNIPPETS.watchlistController
                : i === 5
                  ? SNIPPETS.watchlistService
                  : SNIPPETS.watchlistController,
    focusLines:
      i === 0
        ? [1, 6, 7, 8]
        : i === 2
          ? [1, 2, 3, 4]
          : i === 3
            ? [1, 2, 3, 4, 10]
            : i === 4
              ? [1, 2, 3, 4, 5]
              : [1, 2],
    treePath:
      i === 0
        ? ['client', 'watchlist', 'watchlist.service.ts']
        : i === 1
          ? ['server', 'src', 'app.ts']
          : i === 2
            ? ['server', 'src', 'common', 'middleware', 'authenticate.ts']
            : i === 3
              ? ['server', 'src', 'modules', 'watchlist', 'watchlist.routes.ts']
              : i === 4 || i === 6
                ? ['server', 'src', 'modules', 'watchlist', 'watchlist.controller.ts']
                : ['server', 'src', 'modules', 'watchlist', 'watchlist.service.ts'],
  })),
  // ─── Part 4 · Angular client ──────────────────────────────────
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
      'Discover search waits 400 ms after typing, then issues one TMDb request — not one per keystroke.',
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
    id: 'angular-summary',
    act: 4,
    actTitle: 'Part 4',
    sceneLabel: 'Summary',
    title: 'Angular in CineTrack',
    narration: 'Components compose the UI; services, routing, signals, and RxJS connect it to Fastify.',
    takeaway: 'Structured frontend architecture',
    stage: 'bullets',
    bullets: [
      'Components build reusable views',
      'Services centralize API logic',
      'Router and guards control navigation',
      'Signals and RxJS keep data reactive',
    ],
  },
  {
    id: 'ch5',
    act: 5,
    actTitle: 'Part 5',
    sceneLabel: 'Comparison',
    title: 'React vs Angular',
    narration: 'Both build modern interfaces — their main difference is how much architecture they provide.',
    takeaway: 'Library flexibility vs framework consistency',
    stage: 'compare',
  },
  {
    id: 'compare-code',
    act: 5,
    actTitle: 'Part 5',
    sceneLabel: 'Mental model',
    title: 'Same goal, different defaults',
    narration:
      'React starts with UI primitives and lets the team choose the rest. Angular includes the application structure.',
    takeaway: 'Choose for the team and product',
    stage: 'compare',
    bullets: [
      'React: JSX · hooks · ecosystem choices',
      'Angular: templates · DI · router · RxJS · CLI',
      'Neither is universally better',
    ],
  },
  {
    id: 'compare-fit',
    act: 5,
    actTitle: 'Part 5',
    sceneLabel: 'CineTrack',
    title: 'Why Angular fits CineTrack',
    narration:
      'CineTrack has many routes, shared services, guards, and long-lived features — Angular keeps those patterns consistent.',
    takeaway: 'A strong fit, not a universal winner',
    stage: 'compare',
    bullets: [
      'Predictable feature folders',
      'Built-in dependency injection',
      'First-party routing and HTTP',
      'TypeScript-first conventions',
    ],
  },
  {
    id: 'demo',
    act: 6,
    actTitle: 'Part 6',
    sceneLabel: 'Demo',
    title: 'CineTrack in action',
    narration:
      'A recorded walkthrough of the working application — Dashboard, Discover, Watchlist, and movie details.',
    takeaway: 'The architecture becomes the product',
    stage: 'demo',
  },
];

