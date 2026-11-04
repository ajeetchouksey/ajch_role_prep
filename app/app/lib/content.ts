/** roleprep@2 content types, shared by build-time loaders and the app. */
export type LevelId = 'tech' | 'lead' | 'leadership';
export type KindId = 'know-cold' | 'question' | 'pushback' | 'challenge';

export interface Catalog {
  contentVersion: string;
  updatedAt: string;
  levels: { id: LevelId; label: string; note: string }[];
  kinds: { id: KindId; label: string; targetSeconds: number }[];
  topics: { id: string; title: string; subtopics: number; live: number }[];
}

export interface Topic {
  id: string;
  title: string;
  subtopics: { id: string; title: string; status: 'live' | 'planned'; file: string | null }[];
}

export interface View {
  asked: string;
  testing?: string;
  structure?: string[];
  strong?: string;
  short?: string;
  points?: string[];
  weak?: string;
  weakWhy?: string;
  followUps?: string[];
  flags?: string[];
  say?: string[];
  avoid?: string[];
  rubric?: string[];
  line?: string;
  context?: string;
  options?: { text: string; verdict: string; why?: string }[];
  takeaway?: string;
  frame?: string | string[];
  model?: string;
  followUp?: string;
}

export interface Moment {
  id: string;
  kind: KindId;
  title: string;
  scenario?: string;
  views: Record<LevelId, View>;
}

export interface Subtopic {
  id: string;
  topicId: string;
  title: string;
  contentVersion: string;
  updatedAt: string;
  moments: Moment[];
}

/** Related items elsewhere on aaryaai.dev, ranked by shared taxonomy concepts. */
export interface RelatedItem { id: string; title: string; url: string; why: 'picked' | 'matched'; shared: string[] }
export type Related = Record<'skillup' | 'useCases' | 'blog' | 'holLabs', RelatedItem[]>;

export const RELATED_GROUPS: { key: keyof Related; label: string; verb: string }[] = [
  { key: 'skillup', label: 'SkillUp notes', verb: 'Learn it' },
  { key: 'holLabs', label: 'Hands-on labs', verb: 'Build it' },
  { key: 'useCases', label: 'Real use cases', verb: 'See it in production' },
  { key: 'blog', label: 'Blog', verb: 'Read more' },
];

/** Runtime fetch of a sub-topic's related links (app routes; cached by the service worker). */
export async function fetchRelated(topicId: string, subtopicId: string): Promise<Related | null> {
  const res = await fetch('/content/roleprep/related/links.json');
  if (!res.ok) return null;
  const all: { subtopics: Record<string, Related> } = await res.json();
  return all.subtopics[`${topicId}/${subtopicId}`] ?? null;
}

export const LEVELS: { id: LevelId; label: string }[] = [
  { id: 'tech', label: 'Tech' },
  { id: 'lead', label: 'Tech Lead' },
  { id: 'leadership', label: 'Leadership' },
];

export const KIND_LABEL: Record<KindId, string> = {
  'know-cold': 'Know this cold',
  question: 'Interview question',
  pushback: 'Pushback',
  challenge: 'Challenge',
};

/** Runtime fetch of a sub-topic (app routes; cached by the service worker). */
export async function fetchSubtopic(topicId: string, subtopicId: string): Promise<Subtopic> {
  const res = await fetch(`/content/roleprep/topics/${topicId}/${subtopicId}.json`);
  if (!res.ok) throw new Response('Sub-topic not found', { status: 404 });
  return res.json();
}
