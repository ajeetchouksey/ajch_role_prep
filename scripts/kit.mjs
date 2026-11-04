#!/usr/bin/env node
/**
 * kit.mjs — render this repo's agent kit (kit/ + kit.json) into .claude/ with
 * ajch_agent_framework. Pass --check to fail on drift instead of writing (CI).
 *
 * The framework checkout comes from KIT_FRAMEWORK, else a sibling folder
 * ../ajch_agent_framework. Its version must match kit.json's "framework".
 */
import { spawnSync } from 'child_process';
import { existsSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const fw = resolve(process.env.KIT_FRAMEWORK || join(root, '..', 'ajch_agent_framework'));
const render = join(fw, 'bin', 'render.mjs');
if (!existsSync(render)) {
  console.error(`✗ ajch_agent_framework not found at ${fw}. Clone it there, or set KIT_FRAMEWORK.`);
  process.exit(1);
}
const r = spawnSync(process.execPath, [render, root, ...process.argv.slice(2)], { stdio: 'inherit' });
process.exit(r.status ?? 1);
