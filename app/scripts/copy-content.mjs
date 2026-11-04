#!/usr/bin/env node
/**
 * Copy ../content/roleprep (the repo's content, same commit as the app) into
 * public/content/roleprep, so the app can fetch sub-topics at runtime and the
 * service worker can cache them for offline practice. Generated; gitignored.
 */
import { cpSync, rmSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const app = join(dirname(fileURLToPath(import.meta.url)), '..');
const from = join(app, '..', 'content', 'roleprep');
const to = join(app, 'public', 'content', 'roleprep');
rmSync(to, { recursive: true, force: true });
mkdirSync(to, { recursive: true });
cpSync(from, to, { recursive: true, filter: (src) => !src.includes(`${join('roleprep', 'examples')}`) });
console.log('content: copied content/roleprep to public/content/roleprep');
