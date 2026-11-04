#!/usr/bin/env node
/**
 * check-options.mjs — giveaway checks for pushback moments.
 *
 * A candidate should not be able to pick the strong response by its length
 * or by spotting an absolute in the others. Two rules, per pushback view:
 *   1. The strong option is between 0.7x and 1.3x the mean length of the others.
 *   2. Weak and partial options contain no absolutes (always, never, guaranteed,
 *      "cannot ... at all") — strawmen are easy to rule out on wording alone.
 *
 * Same idea as ajch_skillup/scripts/check-option-lengths.mjs for MCQs.
 * Exit 0 = clean, 1 = problems found.
 */
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, relative, dirname } from 'path';
import { fileURLToPath } from 'url';

// ROLEPREP_ROOT lets the packaged plugin validate the project it is installed in.
const ROOT = process.env.ROLEPREP_ROOT || join(dirname(fileURLToPath(import.meta.url)), '..');
const TOPICS = join(ROOT, 'content', 'roleprep', 'topics');
const MAX = 1.3, MIN = 0.7;
const ABSOLUTE = /\b(always|never|guaranteed)\b|\bcannot\b[^.]*\bat all\b/i;
const quiet = process.argv.includes('--quiet');

const problems = [];
if (existsSync(TOPICS)) {
  for (const topic of readdirSync(TOPICS)) {
    for (const f of readdirSync(join(TOPICS, topic))) {
      if (f === 'index.json' || !f.endsWith('.json')) continue;
      const file = join(TOPICS, topic, f);
      let d;
      try { d = JSON.parse(readFileSync(file, 'utf-8')); } catch { continue; } // validate-content reports bad JSON
      for (const m of d.moments ?? []) {
        if (m.kind !== 'pushback') continue;
        for (const [lv, v] of Object.entries(m.views ?? {})) {
          const opts = v.options ?? [];
          const strong = opts.find((o) => o.verdict === 'strong');
          const others = opts.filter((o) => o !== strong);
          if (!strong || !others.length) continue;
          const mean = others.reduce((n, o) => n + o.text.length, 0) / others.length;
          const ratio = strong.text.length / mean;
          const at = `${relative(ROOT, file).replace(/\\/g, '/')}: ${m.id}.${lv}`;
          if (ratio > MAX || ratio < MIN) problems.push(`${at}: strong option is ${ratio.toFixed(2)}x the others' length (allowed ${MIN} to ${MAX})`);
          others.forEach((o, i) => { if (ABSOLUTE.test(o.text)) problems.push(`${at}: option "${o.text.slice(0, 40)}…" uses an absolute; rewrite it as a reasoned wrong answer`); });
        }
      }
    }
  }
}
if (problems.length) { console.error(problems.join('\n')); console.error(`\n${problems.length} giveaway problem(s).`); process.exit(1); }
if (!quiet) console.log('pushback options: no giveaways');
