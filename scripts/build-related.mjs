#!/usr/bin/env node
/**
 * build-related.mjs — link every live Role Prep sub-topic to the most relevant
 * SkillUp notes, use cases, blog posts and hands-on labs on aaryaai.dev.
 *
 * Matching uses the platform's shared taxonomy: each sub-topic (and its topic)
 * lists `taxonomyIds`, every item in the other verticals lists its own, and
 * items are ranked by the concepts they share, rarer concepts counting more.
 * Hand-picked links in a sub-topic's `links` always come first.
 *
 *   node scripts/build-related.mjs --fetch   refresh the snapshot of the other
 *                                            verticals at the commits aaryaai.dev
 *                                            serves (ajch_platform's content
 *                                            manifest), then rebuild the links
 *   node scripts/build-related.mjs           rebuild links offline from the snapshot
 *   node scripts/build-related.mjs --check   fail if links are stale or an ID is unknown
 *
 * Writes content/roleprep/related/catalog.json (snapshot) and links.json.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = process.env.ROLEPREP_ROOT || process.env.KIT_ROOT || join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = join(ROOT, 'content', 'roleprep');
const OUT = join(BASE, 'related');
const args = process.argv.slice(2);
const fetchMode = args.includes('--fetch');
const check = args.includes('--check');
const quiet = args.includes('--quiet');

const SITE = 'https://aaryaai.dev';
const PLATFORM_RAW = 'https://raw.githubusercontent.com/ajeetchouksey/ajch_platform/main/public';
const TYPES = ['skillup', 'useCases', 'blog', 'holLabs'];
const PER_TYPE = 3;
const TOPIC_WEIGHT = 0.5;

const readJson = (p) => JSON.parse(readFileSync(p, 'utf-8'));
const problems = [];

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res.json();
}

async function refreshSnapshot() {
  const manifest = await getJson(`${PLATFORM_RAW}/content-manifest.json`);
  const taxonomy = (await getJson(`${PLATFORM_RAW}/content/taxonomy.json`)).topics.map((t) => t.id).sort();
  const at = (key, path) => `${manifest[key].baseUrl}/${manifest[key].repo}@${manifest[key].sha}/${path}`;
  const items = [];

  const blog = await getJson(at('blog', 'content/blog/index.json'));
  for (const p of blog.posts ?? []) {
    if (p.draft) continue;
    items.push({ type: 'blog', id: p.slug, title: p.title, url: `${SITE}/blog/${p.slug}`, taxonomyIds: p.taxonomyIds ?? [] });
  }

  const skillup = await getJson(at('skillup', 'content/skillup/catalog.json'));
  for (const e of skillup.exams ?? []) {
    if (e.available === false) continue;
    for (const d of e.domains ?? []) {
      items.push({ type: 'skillup', id: `${e.id}:d${d.id}`, title: `${e.shortTitle ?? e.examCode ?? e.id} · ${d.title}`, url: `${SITE}/skillup/${e.id}/notes`, taxonomyIds: d.taxonomyIds ?? [] });
    }
  }

  const [owner, name] = manifest.usecases.repo.split('/');
  const listing = await getJson(`https://data.jsdelivr.com/v1/packages/gh/${owner}/${name}@${manifest.usecases.sha}?structure=flat`);
  const caseFiles = listing.files.map((f) => f.name).filter((n) => /^\/content\/usecases\/cases\/[^/]+\.json$/.test(n)).sort();
  for (const f of caseFiles) {
    const c = await getJson(at('usecases', f.slice(1)));
    items.push({ type: 'useCases', id: c.id, title: c.title, url: `${SITE}/usecases/${c.id}`, taxonomyIds: c.taxonomyIds ?? [] });
  }

  const labs = await getJson(at('hol-labs', 'content/hol-labs/index.json'));
  for (const l of labs.labs ?? []) {
    items.push({ type: 'holLabs', id: l.id, title: l.title, url: `${SITE}/hol-labs/${l.id}`, taxonomyIds: l.taxonomyIds ?? [] });
  }

  items.sort((a, b) => (a.type + a.id).localeCompare(b.type + b.id));
  const sources = Object.fromEntries(['blog', 'skillup', 'usecases', 'hol-labs'].map((k) => [k, { repo: manifest[k].repo, sha: manifest[k].sha }]));
  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, 'catalog.json'), JSON.stringify({ schema: 'roleprep-related-catalog@1', fetchedAt: new Date().toISOString().slice(0, 10), sources, taxonomy, items }, null, 2) + '\n');
  if (!quiet) console.log(`related: snapshot of ${items.length} items (${TYPES.map((t) => `${items.filter((i) => i.type === t).length} ${t}`).join(', ')})`);
}

function buildLinks(snapshot) {
  const known = new Set(snapshot.taxonomy);
  const byKey = new Map(snapshot.items.map((i) => [`${i.type}:${i.id}`, i]));
  // Rarer concepts are stronger evidence: weight = ln(1 + N / df).
  const df = new Map();
  for (const i of snapshot.items) for (const t of new Set(i.taxonomyIds)) df.set(t, (df.get(t) ?? 0) + 1);
  const weight = (t) => Math.log(1 + snapshot.items.length / (df.get(t) ?? 1));

  const catalog = readJson(join(BASE, 'catalog.json'));
  const result = {};
  for (const t of catalog.topics) {
    const topic = readJson(join(BASE, 'topics', t.id, 'index.json'));
    const topicIds = topic.taxonomyIds ?? [];
    for (const id of topicIds) if (!known.has(id)) problems.push(`topics/${t.id}/index.json: unknown taxonomy id "${id}"`);
    for (const s of topic.subtopics.filter((x) => x.status === 'live')) {
      const where = `topics/${t.id}/${s.id}.json`;
      const sub = readJson(join(ROOT, s.file));
      const own = sub.taxonomyIds ?? [];
      if (own.length < 2) problems.push(`${where}: needs 2 to 8 taxonomyIds from the platform taxonomy`);
      for (const id of own) if (!known.has(id)) problems.push(`${where}: unknown taxonomy id "${id}"`);
      const w = new Map([...topicIds.map((id) => [id, TOPIC_WEIGHT]), ...own.map((id) => [id, 1])]);

      const entry = {};
      for (const type of TYPES) {
        const pinned = (sub.links?.[type] ?? []).map((id) => {
          const item = byKey.get(`${type}:${id}`);
          if (!item) problems.push(`${where}: links.${type} "${id}" is not on aaryaai.dev (snapshot ${snapshot.fetchedAt})`);
          return item;
        }).filter(Boolean);
        const scored = snapshot.items
          .filter((i) => i.type === type && !pinned.includes(i))
          .map((i) => {
            const shared = i.taxonomyIds.filter((id) => w.has(id));
            const ownShared = shared.filter((id) => own.includes(id));
            return { i, shared, ok: ownShared.length >= 1 || shared.length >= 2, score: shared.reduce((n, id) => n + weight(id) * w.get(id), 0) };
          })
          .filter((x) => x.ok && x.score > 0)
          .sort((a, b) => b.score - a.score || a.i.id.localeCompare(b.i.id));
        const pick = (i, why, shared) => ({ id: i.id, title: i.title, url: i.url, why, shared });
        entry[type] = [
          ...pinned.map((i) => pick(i, 'picked', i.taxonomyIds.filter((id) => w.has(id)))),
          ...scored.slice(0, Math.max(0, PER_TYPE - pinned.length)).map((x) => pick(x.i, 'matched', x.shared)),
        ];
      }
      result[`${t.id}/${s.id}`] = entry;
    }
  }
  return { schema: 'roleprep-related@1', snapshot: snapshot.fetchedAt, sources: snapshot.sources, subtopics: result };
}

if (fetchMode) await refreshSnapshot();
const catalogPath = join(OUT, 'catalog.json');
if (!existsSync(catalogPath)) { console.error('related: no snapshot yet; run node scripts/build-related.mjs --fetch'); process.exit(1); }
const links = buildLinks(readJson(catalogPath));
const text = JSON.stringify(links, null, 2) + '\n';
const linksPath = join(OUT, 'links.json');

if (problems.length) { console.error(`related: ${problems.length} problem(s)\n` + problems.map((p) => '  ' + p).join('\n')); process.exit(1); }
if (check) {
  const current = existsSync(linksPath) ? readFileSync(linksPath, 'utf-8').replace(/\r\n/g, '\n') : null;
  if (current !== text) { console.error('related: links.json is stale; run node scripts/build-related.mjs'); process.exit(1); }
  if (!quiet) console.log(`related: links for ${Object.keys(links.subtopics).length} sub-topic(s) up to date`);
} else {
  writeFileSync(linksPath, text);
  if (!quiet) {
    for (const [k, v] of Object.entries(links.subtopics)) console.log(`related: ${k} → ${TYPES.map((t) => `${v[t].length} ${t}`).join(', ')}`);
  }
}
