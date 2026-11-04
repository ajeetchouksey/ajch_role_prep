import { Link } from 'react-router';
import type { Route } from './+types/topics';
import { getCatalog } from '~/lib/content.server';

export function meta() {
  return [
    { title: 'Topics · Role Prep' },
    { name: 'description', content: 'AI-role interview topics: RAG, agents, evaluation, LLMOps, cost, responsible AI and more, each split into short sub-topics you can practise.' },
  ];
}

export function loader() {
  return { topics: getCatalog().topics };
}

export default function Topics({ loaderData }: Route.ComponentProps) {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl font-bold">Topics</h1>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loaderData.topics.map((t) => (
          <li key={t.id}>
            <Link to={`/topics/${t.id}`} className="block h-full rounded-2xl border border-line bg-panel p-5 hover:border-lilac">
              <h2 className="font-semibold">{t.title}</h2>
              <p className="mt-2 text-sm text-mist">{t.subtopics} sub-topics · {t.live > 0 ? <span className="text-live">{t.live} live</span> : 'coming soon'}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
