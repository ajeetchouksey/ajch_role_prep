import { Link } from 'react-router';
import type { Route } from './+types/today';
import { LEVELS, type Catalog, type Topic } from '~/lib/content';
import { loadLevel, loadReps } from '~/lib/progress';

// Today (screen S3), first cut: level, last reps and the next sub-topic. The
// plan built from the interview date (setup, S2) replaces the fixed pick later.
export async function clientLoader() {
  const catalog: Catalog = await fetch('/content/roleprep/catalog.json').then((r) => r.json());
  const topics: Topic[] = await Promise.all(
    catalog.topics.filter((t) => t.live > 0).map((t) => fetch(`/content/roleprep/topics/${t.id}/index.json`).then((r) => r.json() as Promise<Topic>)),
  );
  const next = topics.flatMap((t) => t.subtopics.filter((s) => s.status === 'live').map((s) => ({ topicId: t.id, id: s.id, title: s.title })))[0];
  return { level: loadLevel(), reps: loadReps().slice(-5).reverse(), next };
}

export function meta() {
  return [{ title: 'Today · Role Prep' }, { name: 'robots', content: 'noindex' }];
}

export default function Today({ loaderData }: Route.ComponentProps) {
  const { level, reps, next } = loaderData;
  const label = LEVELS.find((l) => l.id === level)?.label;
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-lilac">Today</p>
        <h1 className="font-display text-4xl font-bold">One sub-topic, out loud</h1>
        <p className="mt-2 text-mist">Practising at {label} level. Change it in the practice room.</p>
      </div>
      {next && (
        <Link to={`/practice/${next.topicId}/${next.id}`} className="block rounded-2xl border border-indigo bg-indigo/15 p-6 hover:bg-indigo/25">
          <p className="text-xs font-bold uppercase tracking-widest text-lilac">Up next</p>
          <p className="mt-1 text-2xl font-semibold">{next.title}</p>
          <p className="mt-1 text-mist">About 10 minutes · answer first, then compare</p>
        </Link>
      )}
      <section className="space-y-3">
        <h2 className="font-semibold">Recent reps</h2>
        {reps.length === 0 ? (
          <p className="text-mist">No reps yet. Your first one takes two minutes.</p>
        ) : (
          <ul className="space-y-2">
            {reps.map((r) => (
              <li key={r.at} className="flex justify-between rounded-xl border border-line bg-panel px-4 py-3 text-sm">
                <span>{r.key.split('/').slice(1).join(' · ')}</span>
                <span className={r.of && r.score / r.of >= 0.75 ? 'text-covered' : r.score > 0 ? 'text-partly' : 'text-missed'}>{r.score}/{r.of}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
