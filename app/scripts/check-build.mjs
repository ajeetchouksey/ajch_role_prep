#!/usr/bin/env node
/**
 * Check the built app (CI, after npm run build): every public page is
 * pre-rendered real HTML with its content in it, the app shell and PWA files
 * exist, and the manifest is installable.
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const app = join(dirname(fileURLToPath(import.meta.url)), '..');
const client = join(app, 'build', 'client');
const content = join(app, '..', 'content', 'roleprep');
const read = (p) => JSON.parse(readFileSync(p, 'utf-8'));
const problems = [];
const html = (route) => join(client, route === '/' ? 'index.html' : `${route.slice(1)}/index.html`);
const expect = (route, text) => {
  const f = html(route);
  if (!existsSync(f)) return problems.push(`${route}: not pre-rendered (${f} missing)`);
  const page = readFileSync(f, 'utf-8');
  const plain = page.replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
  if (!plain.includes(text)) problems.push(`${route}: pre-rendered HTML lacks "${text.slice(0, 60)}"`);
};

const catalog = read(join(content, 'catalog.json'));
expect('/', 'Interview practice for AI roles');
expect('/topics', catalog.topics[0].title);
let pages = 2;
for (const t of catalog.topics) {
  const topic = read(join(content, 'topics', t.id, 'index.json'));
  expect(`/topics/${t.id}`, topic.title); pages++;
  for (const s of topic.subtopics.filter((x) => x.status === 'live')) {
    const sub = read(join(app, '..', s.file));
    expect(`/topics/${t.id}/${s.id}`, sub.moments[0].views.tech.asked); pages++;
    expect(`/topics/${t.id}/${s.id}`, 'Go deeper on AaryaAI');
  }
}

for (const f of ['__spa-fallback.html', 'sw.js', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'content/roleprep/catalog.json']) {
  if (!existsSync(join(client, f))) problems.push(`missing build/client/${f}`);
}
if (existsSync(join(client, 'manifest.webmanifest'))) {
  const m = read(join(client, 'manifest.webmanifest'));
  for (const k of ['name', 'short_name', 'start_url', 'display', 'icons']) if (!m[k]) problems.push(`manifest: missing ${k}`);
  if (!m.icons?.some((i) => i.sizes === '512x512' && i.purpose === 'maskable')) problems.push('manifest: needs a 512x512 maskable icon');
}

if (problems.length) { console.error(`app: ${problems.length} problem(s)\n` + problems.map((p) => '  ' + p).join('\n')); process.exit(1); }
console.log(`app: ${pages} pre-rendered pages, app shell, service worker and manifest OK`);
