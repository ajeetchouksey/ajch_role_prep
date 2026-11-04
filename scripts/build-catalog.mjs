#!/usr/bin/env node
/**
 * build-catalog.mjs — refresh the derived counts in content/roleprep/catalog.json.
 *
 * Each catalogue topic gets `subtopics` (all) and `live` (playable) counts from
 * its index.json, so the app can show "2 of 5 live" without opening every
 * index. Writes only when something changed. Run by roleprep-publisher.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// ROLEPREP_ROOT lets the packaged plugin validate the project it is installed in.
const ROOT = process.env.ROLEPREP_ROOT || join(dirname(fileURLToPath(import.meta.url)), '..');
const file = join(ROOT, 'content', 'roleprep', 'catalog.json');
const before = readFileSync(file, 'utf-8');
const catalog = JSON.parse(before);
for (const t of catalog.topics) {
  const index = JSON.parse(readFileSync(join(ROOT, t.indexFile), 'utf-8'));
  t.subtopics = index.subtopics.length;
  t.live = index.subtopics.filter((s) => s.status === 'live').length;
}
const after = JSON.stringify(catalog, null, 2) + '\n';
if (after === before) console.log('catalog.json: no changes');
else { writeFileSync(file, after); console.log('catalog.json: counts updated'); }
