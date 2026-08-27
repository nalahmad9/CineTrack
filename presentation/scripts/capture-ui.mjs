/**
 * Capture real CineTrack UI screenshots for the presentation.
 * Prerequisites: API on :3000, client on :4202
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const BASE = 'http://127.0.0.1:4202';
const API = 'http://127.0.0.1:3000/api/v1';
const OUT = path.join(ROOT, 'presentation', 'public', 'ui');
const EMAIL = `demo.present+${Date.now()}@cinetrack.local`;
const PASS = 'DemoPass123!';
const NAME = 'Demo Presenter';

fs.mkdirSync(OUT, { recursive: true });

async function api(method, url, body, token) {
  const res = await fetch(`${API}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`${method} ${url} → ${res.status} ${JSON.stringify(json)}`);
  }
  return json;
}

async function seed() {
  const reg = await api('POST', '/auth/register', {
    email: EMAIL,
    password: PASS,
    displayName: NAME,
  });
  const access = reg.data?.accessToken;
  if (!access) throw new Error('No access token: ' + JSON.stringify(reg).slice(0, 400));

  const movies = [
    { tmdbId: 693134, mediaType: 'movie', status: 'plan_to_watch' },
    { tmdbId: 872585, mediaType: 'movie', status: 'watching' },
    { tmdbId: 414906, mediaType: 'movie', status: 'completed' },
  ];
  for (const m of movies) {
    try {
      await api('POST', '/watchlist', m, access);
    } catch (e) {
      console.warn('watchlist seed', e.message);
    }
  }
  try {
    await api('POST', '/favorites', { tmdbId: 693134, mediaType: 'movie' }, access);
  } catch (e) {
    console.warn('favorite seed', e.message);
  }

  return {
    email: EMAIL,
    password: PASS,
    access,
    user: reg.data.user,
  };
}

async function shot(page, name, opts = {}) {
  const file = path.join(OUT, `${name}.png`);
  await page.waitForTimeout(opts.wait ?? 800);
  await page.screenshot({
    path: file,
    fullPage: opts.fullPage ?? false,
    animations: 'disabled',
  });
  console.log('saved', path.basename(file));
}

async function main() {
  const creds = await seed();
  console.log('seeded', creds.email);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  // Login page (guest) — real UI
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
  await shot(page, 'login', { wait: 1800 });

  // Authenticate by hydrating the same keys the app uses
  await page.goto(`${BASE}/login`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(
    ({ user, token }) => {
      localStorage.setItem('ct_user', JSON.stringify(user));
      localStorage.setItem('ct_token', token);
    },
    { user: creds.user, token: creds.access },
  );
  await page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3200);
  await shot(page, 'dashboard', { wait: 1500 });

  await page.goto(`${BASE}/discover`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2800);
  await shot(page, 'discover', { wait: 1200 });

  const search = page.locator('input[type="search"], input[placeholder*="Search" i]').first();
  if ((await search.count()) > 0) {
    await search.fill('dune');
    await page.waitForTimeout(1800);
    await shot(page, 'discover-search', { wait: 2200 });
  }

  await page.goto(`${BASE}/watchlist`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2800);
  await shot(page, 'watchlist', { wait: 1200 });

  await page.goto(`${BASE}/favorites`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2200);
  await shot(page, 'favorites', { wait: 1000 });

  await page.goto(`${BASE}/movie/693134`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3500);
  await shot(page, 'movie-details', { wait: 1500 });

  await page.goto(`${BASE}/watchlist`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);
  await shot(page, 'routing-shell', { wait: 800 });

  await browser.close();
  console.log('done →', OUT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
