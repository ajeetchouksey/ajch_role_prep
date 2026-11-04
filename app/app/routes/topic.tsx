import { Link } from 'react-router';
import type { Route } from './+types/topic';
import { getTopic } from '~/lib/content.server';

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: `${data?.title ?? 'Topic'} · Role Prep` },
    { name: 'description', content: `Interview practice for ${data?.title ?? 'this topic'}: short sub-topics with Tech, Tech Lead and Leadership answers.` },
  ];
}

export function loader({ params }: Route.LoaderArgs) {
  const t = getTopic(params.topic);
  return { id: t.id, title: t.title, subtopics: t.subtopics.map(({ id, title, status }) => ({ id, title, status })) };
}

export default function TopicPage({ loaderData: t }: Route.ComponentProps) {
  return (
    <div className="space-y-6">
      <Link to="/topics" className="text-sm text-mist hover:text-white">← All topics</Link>
      <h1 className="font-display text-4xl font-bold">{t.title}</h1>
      <ul className="space-y-3">
        {t.subtopics.map((s) => (
          <li key={s.id}>
            {s.status === 'live' ? (
              <Link to={`/topics/${t.id}/${s.id}`} className="flex items-center justify-between rounded-2xl border border-line bg-panel p-5 hover:border-lilac">
                <span className="font-semibold">{s.title}</span>
                <span className="text-sm text-live">Practise →</span>
              </Link>
            ) : (
              <div className="flex items-center justify-between rounded-2xl border border-dashed border-line p-5 text-mist">
                <span>{s.title}</span>
                <span className="text-sm">Coming soon</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
