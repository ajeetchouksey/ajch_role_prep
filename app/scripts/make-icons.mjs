#!/usr/bin/env node
/**
 * Render the PWA icons from brand/logo-mark.svg (run when the mark changes;
 * outputs are committed). Needs Playwright: set PLAYWRIGHT_DIR to a
 * node_modules folder that has it.
 */
import { readFileSync, copyFileSync, mkdirSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const app = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(app, 'public', 'icons');
const markPath = join(app, '..', 'brand', 'logo-mark.svg');
const mark = readFileSync(markPath, 'utf-8');
mkdirSync(out, { recursive: true });
copyFileSync(markPath, join(out, 'logo-mark.svg'));

const require = createRequire(join(resolve(process.env.PLAYWRIGHT_DIR || join(app, 'node_modules')), 'x.js'));
const { chromium } = require('playwright');
const browser = await chromium.launch();
const page = await browser.newPage();
const svg = `data:image/svg+xml;base64,${Buffer.from(mark).toString('base64')}`;

// Standard icons: the mark on the dark app ground. Maskable: extra padding so
// Android's circle or squircle crop never cuts the hexagon.
for (const [file, size, pad] of [['icon-192.png', 192, 0.12], ['icon-512.png', 512, 0.12], ['icon-maskable-512.png', 512, 0.24]]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<body style="margin:0;background:#0E1A2D;display:grid;place-items:center;width:${size}px;height:${size}px"><img src="${svg}" style="width:${size * (1 - 2 * pad)}px;height:${size * (1 - 2 * pad)}px"></body>`);
  await page.screenshot({ path: join(out, file), omitBackground: false });
}
await browser.close();
console.log('icons: wrote public/icons/{icon-192,icon-512,icon-maskable-512}.png and logo-mark.svg');
