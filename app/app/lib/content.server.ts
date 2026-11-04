/**
 * Build-time content access. Runs only in route loaders while pre-rendering, so
 * it reads content/roleprep straight from the repo (same commit as the app).
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Catalog, Topic, Subtopic, Related } from './content';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const read = <T>(rel: string): T => JSON.parse(readFileSync(join(ROOT, rel), 'utf-8')) as T;

export const getCatalog = () => read<Catalog>('content/roleprep/catalog.json');
export const getTopic = (topicId: string) => read<Topic>(`content/roleprep/topics/${topicId}/index.json`);

export function getSubtopic(topicId: string, subtopicId: string): Subtopic | null {
  const entry = getTopic(topicId).subtopics.find((s) => s.id === subtopicId);
  return entry?.status === 'live' && entry.file ? read<Subtopic>(entry.file) : null;
}

/** Links to SkillUp, use cases, blog and labs for one sub-topic (scripts/build-related.mjs). */
export function getRelated(topicId: string, subtopicId: string): Related | null {
  return read<{ subtopics: Record<string, Related> }>('content/roleprep/related/links.json').subtopics[`${topicId}/${subtopicId}`] ?? null;
}

/** Every public page to pre-render: home, catalogue, each topic, each live sub-topic. */
export function publicPaths(): string[] {
  const paths = ['/', '/topics'];
  for (const t of getCatalog().topics) {
    paths.push(`/topics/${t.id}`);
    for (const s of getTopic(t.id).subtopics) if (s.status === 'live') paths.push(`/topics/${t.id}/${s.id}`);
  }
  return paths;
}
