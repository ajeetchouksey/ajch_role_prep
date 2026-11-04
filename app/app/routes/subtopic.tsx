import { useState } from 'react';
import { Link, data } from 'react-router';
import type { Route } from './+types/subtopic';
import { getSubtopic, getTopic } from '~/lib/content.server';
import { KIND_LABEL, LEVELS, type LevelId } from '~/lib/content';

// Public sub-topic page (screen S12): pre-rendered for search. It shows what each
// moment asks and tests at every level; the answers stay in the practice room,
// so candidates answer before they read.
export function meta({ data: d }: Route.MetaArgs) {
  if (!d) return [{ title: 'Sub-topic · Role Prep' }];
  return [
    { title: `${d.title} interview questions · Role Prep` },
    { name: 'description', content: `Practise ${d.title} for AI-role interviews: ${d.moments.length} moments with Tech, Tech Lead and Leadership versions. ${d.moments[0]?.views.tech.asked ?? ''}` },
  ];
}

export function loader({ params }: Route.LoaderArgs) {
  const s = getSubtopic(params.topic, params.subtopic);
  if (!s) throw data('Sub-topic not found', { status: 404 });
  const topic = getTopic(params.topic);
  return {
    topicId: topic.id,
    topicTitle: topic.title,
    id: params.subtopic,
    title: s.title,
    updatedAt: s.updatedAt,
    moments: s.moments.map((m) => ({
      id: m.id, kind: m.kind, title: m.title, scenario: m.scenario,
      views: Object.fromEntries(LEVELS.map(({ id }) => {
        const v = m.views[id];
        return [id, { asked: v.asked ?? v.line ?? '', testing: v.testing ?? v.context ?? '', structure: v.structure ?? [] }];
      })) as Record<LevelId, { asked: string; testing: string; structure: string[] }>,
    })),
  };
}

export default function SubtopicPage({ loaderData: s }: Route.ComponentProps) {
  const [level, setLevel] = useState<LevelId>('tech');
  return (
    <article className="space-y-8">
      <div className="space-y-3">
        <Link to={`/topics/${s.topicId}`} className="text-sm text-mist hover:text-white">← {s.topicTitle}</Link>
        <h1 className="font-display text-4xl font-bold">{s.title}</h1>
        <p className="text-mist">{s.moments.length} interview moments · updated {s.updatedAt}</p>
        <div role="radiogroup" aria-label="Interview level" className="inline-flex rounded-xl border border-line p-1">
          {LEVELS.map((l) => (
            <button key={l.id} role="radio" aria-checked={level === l.id} onClick={() => setLevel(l.id)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${level === l.id ? 'bg-indigo text-white' : 'text-mist hover:text-white'}`}>
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <ol className="space-y-4">
        {s.moments.map((m, i) => {
          const v = m.views[level];
          return (
            <li key={m.id} className="rounded-2xl border border-line bg-panel p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-lilac">{i + 1} · {KIND_LABEL[m.kind]}</p>
              <h2 className="mt-2 text-lg font-semibold">{m.title}</h2>
              {m.scenario && <p className="mt-2 text-sm text-mist">{m.scenario}</p>}
              <p className="mt-3">“{v.asked}”</p>
              {v.testing && <p className="mt-2 text-sm text-mist"><span className="font-semibold text-white">What they're testing: </span>{v.testing}</p>}
              {v.structure.length > 0 && (
                <p className="mt-2 text-sm text-mist"><span className="font-semibold text-white">Shape of a strong answer: </span>{v.structure.join(' → ')}</p>
              )}
            </li>
          );
        })}
      </ol>

      <div className="rounded-2xl border border-indigo bg-indigo/15 p-6">
        <h2 className="font-display text-2xl font-bold">Answer before you read</h2>
        <p className="mt-2 text-mist">Practise each moment against a timer, then compare with the strong answer, the weak one and why it loses.</p>
        <Link to={`/practice/${s.topicId}/${s.id}`} className="mt-4 inline-block rounded-xl bg-indigo px-5 py-3 font-semibold text-white hover:bg-indigo-strong">
          Practise this sub-topic
        </Link>
      </div>
    </article>
  );
}
