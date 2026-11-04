#!/usr/bin/env node
/**
 * Browser smoke test against a running app (default http://localhost:8787,
 * e.g. `npx wrangler dev`): pre-rendered HTML without JavaScript, the level
 * switch, a full practice rep, a deep link served by the app shell, the API,
 * service worker registration and phone width. Screenshots go to SMOKE_SHOTS.
 * Needs Playwright: set PLAYWRIGHT_DIR to a node_modules folder that has it.
 */
import { join, dirname, resolve } from 'path';
import { mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const app = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.SMOKE_URL || 'http://localhost:8787';
const SHOTS = resolve(process.env.SMOKE_SHOTS || join(app, 'build', 'smoke'));
mkdirSync(SHOTS, { recursive: true });
const require = createRequire(join(resolve(process.env.PLAYWRIGHT_DIR || join(app, 'node_modules')), 'x.js'));
const { chromium } = require('playwright');

let failed = 0;
const t = (name, ok, detail = '') => { console.log(`${ok ? '✓' : '✗'} ${name}${ok ? '' : ` — ${detail}`}`); if (!ok) failed++; };
const SUB = '/topics/rag/hybrid-search-reranking';

const raw = await fetch(BASE + SUB).then((r) => r.text());
t('sub-topic page is real HTML without JavaScript', raw.includes('When would you add a reranker to a RAG pipeline?') && raw.includes('<title>Hybrid search &amp; reranking interview questions'), raw.slice(0, 200));
const health = await fetch(BASE + '/api/health').then((r) => r.json()).catch(() => ({}));
t('API answers on /api/health', health.ok === true, JSON.stringify(health));
const missing = await fetch(BASE + '/api/nope');
t('unknown API path is a JSON 404', missing.status === 404);

const browser = await chromium.launch();
const errors = [];
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on('pageerror', (e) => errors.push(e.message));

await page.goto(BASE + SUB);
await page.getByRole('radio', { name: 'Leadership' }).click();
t('level switch shows the Leadership question', await page.getByText('wrong document', { exact: false }).first().isVisible());
await page.screenshot({ path: join(SHOTS, 'subtopic.png'), fullPage: true });

await page.getByRole('link', { name: 'Practise this sub-topic' }).click();
await page.waitForURL('**/practice/rag/hybrid-search-reranking');
await page.getByLabel('Your answer').fill('Two stages: hybrid retrieval for recall, then a cross-encoder reranker for precision.');
await page.getByRole('button', { name: 'Show the strong answer' }).click();
t('reveal shows the strong answer', await page.getByText('Strong answer').isVisible());
const boxes = page.getByRole('checkbox');
t('rubric points can be self-scored', (await boxes.count()) > 0);
await boxes.first().check();
await page.screenshot({ path: join(SHOTS, 'practice-reveal.png'), fullPage: true });
await page.getByRole('button', { name: 'Next moment' }).click();
t('next moment loads', await page.getByText('2 of 5', { exact: false }).isVisible());

await page.goto(BASE + '/today');
await page.getByText('Recent reps').waitFor({ timeout: 5000 });
t('Today shows the saved rep', (await page.getByText('hybrid-search-reranking', { exact: false }).count()) > 0 && !(await page.getByText('No reps yet').isVisible()));
await page.screenshot({ path: join(SHOTS, 'today.png'), fullPage: true });

const deep = await browser.newPage();
deep.on('pageerror', (e) => errors.push(e.message));
await deep.goto(BASE + '/practice/rag/hybrid-search-reranking');
t('deep link to an app route loads from the app shell', await deep.getByText('1 of 5', { exact: false }).isVisible({ timeout: 5000 }));

const swOk = await page.evaluate(async () => {
  if (!('serviceWorker' in navigator)) return false;
  const reg = await Promise.race([navigator.serviceWorker.ready, new Promise((r) => setTimeout(() => r(null), 8000))]);
  return !!reg;
});
t('service worker registers', swOk);

const phone = await browser.newPage({ viewport: { width: 390, height: 844 } });
await phone.goto(BASE + SUB);
const overflow = await phone.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
t('no horizontal scroll at phone width', overflow <= 0, `${overflow}px`);
await phone.screenshot({ path: join(SHOTS, 'subtopic-phone.png'), fullPage: true });
await phone.goto(BASE + '/');
await phone.screenshot({ path: join(SHOTS, 'home-phone.png'), fullPage: true });

t('no page errors', errors.length === 0, errors.join(' | '));
await browser.close();
console.log(failed ? `\n${failed} check(s) failed` : `\nall smoke checks passed · screenshots in ${SHOTS}`);
process.exit(failed ? 1 : 0);
