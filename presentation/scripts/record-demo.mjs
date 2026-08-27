import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const presentationRoot = path.resolve(__dirname, '..');
const outputDir = path.join(presentationRoot, 'public', 'demo');
const tempDir = path.join(outputDir, 'raw');
const videoPath = path.join(outputDir, 'cinetrack-demo.webm');
const baseUrl = 'http://127.0.0.1:4202';
const apiUrl = 'http://127.0.0.1:3000/api/v1';
const email = `presentation.demo+${Date.now()}@cinetrack.local`;
const password = 'DemoPass123!';

fs.mkdirSync(tempDir, { recursive: true });

async function api(method, route, body, token) {
  const response = await fetch(`${apiUrl}${route}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${method} ${route}: ${response.status}`);
  return payload;
}

async function seedDemo() {
  const registration = await api('POST', '/auth/register', {
    email,
    password,
    displayName: 'Demo Presenter',
  });
  const { accessToken, user } = registration.data;

  const watchlist = [
    { tmdbId: 693134, mediaType: 'movie', status: 'plan_to_watch' },
    { tmdbId: 872585, mediaType: 'movie', status: 'watching' },
    { tmdbId: 414906, mediaType: 'movie', status: 'completed' },
  ];
  for (const item of watchlist) {
    await api('POST', '/watchlist', item, accessToken).catch(() => undefined);
  }
  await api(
    'POST',
    '/favorites',
    { tmdbId: 693134, mediaType: 'movie' },
    accessToken,
  ).catch(() => undefined);

  return { accessToken, user };
}

async function hold(page, ms = 3200) {
  await page.waitForTimeout(ms);
}

async function showChapter(page, number, title, subtitle) {
  await page.evaluate(
    ({ number, title, subtitle }) => {
      document.getElementById('ct-demo-chapter')?.remove();
      const chapter = document.createElement('div');
      chapter.id = 'ct-demo-chapter';
      chapter.innerHTML = `
        <span>${number}</span>
        <div><strong>${title}</strong><small>${subtitle}</small></div>
      `;
      Object.assign(chapter.style, {
        position: 'fixed',
        left: '32px',
        bottom: '28px',
        zIndex: '999999',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '14px',
        color: '#f7f1e8',
        background: 'rgba(7, 6, 5, .88)',
        border: '1px solid rgba(245, 197, 24, .32)',
        boxShadow: '0 18px 40px rgba(0,0,0,.45)',
        backdropFilter: 'blur(12px)',
        fontFamily: 'Arial, sans-serif',
        opacity: '0',
        transform: 'translateY(14px)',
        transition: 'opacity .35s ease, transform .35s ease',
      });
      const numberEl = chapter.querySelector('span');
      Object.assign(numberEl.style, {
        color: '#f5c518',
        fontFamily: 'monospace',
        fontSize: '12px',
        fontWeight: '700',
      });
      const strong = chapter.querySelector('strong');
      Object.assign(strong.style, {
        display: 'block',
        fontSize: '14px',
        letterSpacing: '.01em',
      });
      const small = chapter.querySelector('small');
      Object.assign(small.style, {
        display: 'block',
        marginTop: '3px',
        color: '#b7a99a',
        fontSize: '11px',
      });
      document.body.appendChild(chapter);
      requestAnimationFrame(() => {
        chapter.style.opacity = '1';
        chapter.style.transform = 'translateY(0)';
      });
      setTimeout(() => {
        chapter.style.opacity = '0';
        chapter.style.transform = 'translateY(8px)';
      }, 2800);
      setTimeout(() => chapter.remove(), 3300);
    },
    { number, title, subtitle },
  );
  await hold(page, 3400);
}

async function smoothScroll(page, y) {
  await page.evaluate((top) => window.scrollTo({ top, behavior: 'smooth' }), y);
  await hold(page, 2200);
}

async function visit(page, route, chapter, title, subtitle, wait = 2200) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
  await hold(page, wait);
  await showChapter(page, chapter, title, subtitle);
}

async function main() {
  const auth = await seedDemo();
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: tempDir,
      size: { width: 1280, height: 720 },
    },
  });
  const page = await context.newPage();

  // 00 — Real authentication screen
  await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle' });
  await showChapter(page, '00', 'Authentication', 'Login form → AuthService → Fastify');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await hold(page, 900);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL(/dashboard/, { timeout: 20_000 });
  await hold(page, 2800);

  // 01 — Dashboard hero and media rows
  await showChapter(page, '01', 'Dashboard', 'TMDb trending data and reusable media rows');
  await hold(page, 2200);
  await smoothScroll(page, 560);
  await hold(page, 2600);
  await smoothScroll(page, 0);
  await hold(page, 1600);

  // 02 — Discover, filters, and debounced search
  await visit(
    page,
    '/discover',
    '02',
    'Discover',
    'Search, media filters, and reusable MovieCard components',
  );
  const search = page
    .locator('input[name="discoverSearch"], input[placeholder*="Search movies or TV" i]')
    .first();
  if ((await search.count()) > 0) {
    await search.click();
    await search.pressSequentially('dune', { delay: 180 });
    await hold(page, 4200);
  }
  const moviesTab = page.getByRole('button', { name: 'Movies', exact: true });
  if ((await moviesTab.count()) > 0) {
    await moviesTab.click();
    await hold(page, 2600);
  }

  // 03 — Watchlist filters, statuses, and sorting
  await visit(
    page,
    '/watchlist',
    '03',
    'Watchlist',
    'Status management, filters, sorting, and persisted user data',
    3200,
  );
  const watching = page.getByRole('button', { name: 'Watching', exact: true });
  if ((await watching.count()) > 0) {
    await watching.click();
    await hold(page, 2600);
  }
  const allStatus = page.getByRole('button', { name: 'All Status', exact: true });
  if ((await allStatus.count()) > 0) {
    await allStatus.click();
    await hold(page, 1800);
  }
  const sort = page.locator('select[aria-label="Sort watchlist"]');
  if ((await sort.count()) > 0) {
    await sort.selectOption('title');
    await hold(page, 2400);
  }

  // 04 — Favorites reuses the same media model and card
  await visit(
    page,
    '/favorites',
    '04',
    'Favorites',
    'A focused saved-title view powered by FavoritesService',
    2600,
  );
  await hold(page, 2400);

  // 05 — Dynamic movie details route
  await visit(
    page,
    '/movie/693134',
    '05',
    'Movie details',
    'Dynamic route, TMDb details, watchlist and favorite actions',
    3500,
  );
  await smoothScroll(page, 420);
  await hold(page, 2600);
  const overviewTab = page.getByRole('button', { name: 'Overview', exact: true });
  if ((await overviewTab.count()) > 0) {
    await overviewTab.click();
    await hold(page, 1800);
  }
  await smoothScroll(page, 0);
  await hold(page, 2200);

  // End on the complete dashboard shell
  await visit(
    page,
    '/dashboard',
    '06',
    'One connected application',
    'Angular UI + Fastify API + TMDb catalog + MongoDB user data',
    3000,
  );
  await hold(page, 3500);

  const video = page.video();
  await page.close();
  if (!video) throw new Error('Playwright did not create a video');
  await video.saveAs(videoPath);
  await context.close();
  await browser.close();

  fs.rmSync(tempDir, { recursive: true, force: true });
  console.log(videoPath);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
