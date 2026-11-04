#!/usr/bin/env node
/**
 * validate-content.mjs — structural and editorial checks for roleprep@2 content.
 *
 * Validates the whole tree under content/roleprep/ every time (it is small and
 * fast), so a hook can call it after any write without tracking dependencies.
 *
 *   node scripts/validate-content.mjs            # whole tree
 *   node scripts/validate-content.mjs --quiet    # print only errors
 *
 * Exit 0 = clean, 1 = errors (printed one per line as `file: message`).
 * The rules mirror .claude/skills/roleprep-content-standard/SKILL.md; change
 * both together.
 */
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, relative, basename, dirname } from 'path';
import { fileURLToPath } from 'url';

// ROLEPREP_ROOT lets the packaged plugin validate the project it is installed in.
const ROOT = process.env.ROLEPREP_ROOT || join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = join(ROOT, 'content', 'roleprep');
const LEVELS = ['tech', 'lead', 'leadership'];
const KINDS = ['know-cold', 'question', 'pushback', 'challenge'];
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SEMVER = /^\d+\.\d+\.\d+$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const BROKEN_TEXT = /â€|Ã.|�/;
const quiet = process.argv.includes('--quiet');

const errors = [];
const err = (file, msg) => errors.push(`${relative(ROOT, file).replace(/\\/g, '/')}: ${msg}`);
const words = (s) => (typeof s === 'string' ? s.trim().split(/\s+/).filter(Boolean).length : 0);
const isText = (s) => typeof s === 'string' && s.trim().length > 0;
const isTextList = (a, min, max) => Array.isArray(a) && a.length >= min && a.length <= max && a.every(isText);

function readJson(file) {
  try {
    const raw = readFileSync(file, 'utf-8');
    if (BROKEN_TEXT.test(raw)) err(file, 'contains broken text encoding (for example "â€"); re-save as UTF-8');
    return JSON.parse(raw);
  } catch (e) {
    err(file, `cannot read JSON: ${e.message}`);
    return null;
  }
}

// Required fields per moment kind: [field, check, description]
const FIELDS = {
  'know-cold': [
    ['asked', isText, 'text'],
    ['points', (v) => isTextList(v, 3, 5), '3 to 5 points'],
    ['short', (v) => isText(v) && words(v) <= 140, 'text of 140 words or fewer'],
  ],
  question: [
    ['asked', isText, 'text'],
    ['testing', isText, 'text'],
    ['structure', (v) => isTextList(v, 3, 5), '3 to 5 steps'],
    ['strong', (v) => isText(v) && words(v) <= 180, 'text of 180 words or fewer'],
    ['weak', isText, 'text'],
    ['weakWhy', isText, 'text'],
    ['followUps', (v) => isTextList(v, 1, 4), '1 to 4 follow-ups'],
    ['flags', (v) => isTextList(v, 1, 5), '1 to 5 red flags'],
    ['say', (v) => isTextList(v, 1, 4), '1 to 4 lines'],
    ['avoid', (v) => isTextList(v, 1, 4), '1 to 4 lines'],
    ['rubric', (v) => isTextList(v, 3, 6), '3 to 6 checkable points'],
  ],
  pushback: [
    ['line', isText, 'text'],
    ['context', isText, 'text'],
    ['options', (v) => Array.isArray(v) && v.length === 3 && v.every((o) => o && isText(o.text) && isText(o.why) && ['strong', 'weak', 'partial'].includes(o.verdict)) && v.filter((o) => o.verdict === 'strong').length === 1, '3 options with text, why and verdict; exactly one strong'],
    ['takeaway', isText, 'text'],
  ],
  challenge: [
    ['asked', isText, 'text'],
    ['frame', (v) => isTextList(v, 3, 5), '3 to 5 steps'],
    ['rubric', (v) => isTextList(v, 3, 6), '3 to 6 checkable points'],
    ['model', (v) => isText(v) && words(v) <= 200, 'text of 200 words or fewer'],
    ['followUp', isText, 'text'],
  ],
};
// The field that must read differently at each level (no copy-paste between levels).
const DISTINCT = { 'know-cold': 'short', question: 'strong', pushback: 'line', challenge: 'model' };

function checkSubtopic(file, topicId, expectedId) {
  const d = readJson(file);
  if (!d) return;
  if (d.schema !== 'roleprep-subtopic@2' || d.schemaVersion !== 2) err(file, 'schema must be "roleprep-subtopic@2" with schemaVersion 2');
  if (d.topicId !== topicId) err(file, `topicId "${d.topicId}" does not match its folder "${topicId}"`);
  if (d.id !== `${topicId}.${expectedId}`) err(file, `id must be "${topicId}.${expectedId}"`);
  if (!isText(d.title)) err(file, 'title is required');
  if (!SEMVER.test(d.contentVersion ?? '')) err(file, 'contentVersion must be x.y.z');
  if (!DATE.test(d.updatedAt ?? '')) err(file, 'updatedAt must be YYYY-MM-DD');
  if (!Array.isArray(d.moments) || d.moments.length < 3 || d.moments.length > 8) { err(file, 'moments must be a list of 3 to 8'); return; }
  const seen = new Set();
  d.moments.forEach((m, i) => {
    const at = `moments[${i}]${m && m.id ? ` (${m.id})` : ''}`;
    if (!m || !SLUG.test(m.id ?? '')) err(file, `${at}: id must be lowercase-hyphenated`);
    else if (seen.has(m.id)) err(file, `${at}: duplicate id`);
    else seen.add(m.id);
    if (!KINDS.includes(m.kind)) { err(file, `${at}: kind must be one of ${KINDS.join(', ')}`); return; }
    if (!isText(m.title)) err(file, `${at}: title is required`);
    if (m.kind === 'challenge' && !isText(m.scenario)) err(file, `${at}: challenges need a scenario`);
    const keys = Object.keys(m.views ?? {});
    if (LEVELS.some((l) => !keys.includes(l)) || keys.length !== LEVELS.length) { err(file, `${at}: views must have exactly ${LEVELS.join(', ')}`); return; }
    for (const lv of LEVELS) {
      for (const [field, ok, want] of FIELDS[m.kind]) {
        if (!ok(m.views[lv][field])) err(file, `${at}.views.${lv}.${field}: expected ${want}`);
      }
    }
    const texts = LEVELS.map((lv) => m.views[lv][DISTINCT[m.kind]]);
    if (new Set(texts).size < LEVELS.length) err(file, `${at}: "${DISTINCT[m.kind]}" is identical at two levels; each level needs its own answer`);
  });
}

// Catalogue -> topic indexes -> live sub-topic files.
const catalogFile = join(BASE, 'catalog.json');
const catalog = existsSync(catalogFile) ? readJson(catalogFile) : (err(catalogFile, 'missing'), null);
if (catalog) {
  if (catalog.schema !== 'roleprep-catalog@2' || catalog.schemaVersion !== 2) err(catalogFile, 'schema must be "roleprep-catalog@2" with schemaVersion 2');
  if (!SEMVER.test(catalog.contentVersion ?? '')) err(catalogFile, 'contentVersion must be x.y.z');
  const lv = (catalog.levels ?? []).map((l) => l.id);
  if (lv.join() !== LEVELS.join()) err(catalogFile, `levels must be ${LEVELS.join(', ')} in that order`);
  const kinds = (catalog.kinds ?? []).map((k) => k.id);
  if (KINDS.some((k) => !kinds.includes(k))) err(catalogFile, `kinds must include ${KINDS.join(', ')}`);
  const topicIds = new Set();
  for (const t of catalog.topics ?? []) {
    if (!SLUG.test(t.id ?? '') || topicIds.has(t.id)) { err(catalogFile, `topic id "${t.id}" missing, malformed or duplicated`); continue; }
    topicIds.add(t.id);
    const indexFile = join(ROOT, t.indexFile ?? '');
    if (t.indexFile !== `content/roleprep/topics/${t.id}/index.json` || !existsSync(indexFile)) { err(catalogFile, `topic "${t.id}": indexFile must be content/roleprep/topics/${t.id}/index.json and exist`); continue; }
    const index = readJson(indexFile);
    if (!index) continue;
    if (index.schema !== 'roleprep-topic@2' || index.id !== t.id) err(indexFile, `schema must be "roleprep-topic@2" and id "${t.id}"`);
    const subIds = new Set();
    for (const s of index.subtopics ?? []) {
      if (!SLUG.test(s.id ?? '') || subIds.has(s.id)) { err(indexFile, `sub-topic id "${s.id}" missing, malformed or duplicated`); continue; }
      subIds.add(s.id);
      if (s.status === 'planned') { if (s.file !== null) err(indexFile, `planned sub-topic "${s.id}" must have file: null`); continue; }
      if (s.status !== 'live') { err(indexFile, `sub-topic "${s.id}": status must be live or planned`); continue; }
      const want = `content/roleprep/topics/${t.id}/${s.id}.json`;
      if (s.file !== want || !existsSync(join(ROOT, want))) { err(indexFile, `live sub-topic "${s.id}" must point to ${want}, which must exist`); continue; }
      checkSubtopic(join(ROOT, want), t.id, s.id);
    }
  }
  // Orphans: topic folders or sub-topic files the catalogue doesn't list.
  const topicsDir = join(BASE, 'topics');
  if (existsSync(topicsDir)) {
    for (const dir of readdirSync(topicsDir)) {
      if (!topicIds.has(dir)) err(join(topicsDir, dir), 'topic folder is not listed in catalog.json');
      else for (const f of readdirSync(join(topicsDir, dir))) {
        if (f === 'index.json') continue;
        const index = readJson(join(topicsDir, dir, 'index.json'));
        if (index && !(index.subtopics ?? []).some((s) => s.file === `content/roleprep/topics/${dir}/${f}`)) err(join(topicsDir, dir, f), 'file is not listed as a live sub-topic in its index.json');
      }
    }
  }
}

if (errors.length) { console.error(errors.join('\n')); console.error(`\n${errors.length} problem(s) found.`); process.exit(1); }
if (!quiet) console.log('roleprep content: valid');
