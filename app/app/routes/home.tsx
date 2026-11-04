import { Link } from 'react-router';
import type { Route } from './+types/home';
import { getCatalog } from '~/lib/content.server';

export function meta() {
  return [
    { title: 'Role Prep: interview practice for AI roles' },
    { name: 'description', content: 'Practise AI-role interview questions out loud at your level: Tech, Tech Lead or Leadership. Answer first, then see the strong answer and what the interviewer is testing.' },
  ];
}

export function loader() {
  const c = getCatalog();
  return { levels: c.levels, topics: c.topics.length, live: c.topics.reduce((n, t) => n + t.live, 0) };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { levels, topics, live } = loaderData;
  return (
    <div className="space-y-12">
      <section className="space-y-5 pt-6">
        <p className="text-sm font-bold uppercase tracking-widest text-lilac">Interview practice for AI roles</p>
        <h1 className="font-display text-5xl font-bold leading-tight sm:text-6xl">Answer it out loud.<br />Then see what strong sounds like.</h1>
        <p className="max-w-2xl text-lg text-mist">
          Every question is asked the way your interview asks it, at your level. Answer first, then compare with a strong answer,
          what the interviewer is testing, and the follow-ups that come next.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/today" className="rounded-xl bg-indigo px-5 py-3 font-semibold text-white hover:bg-indigo-strong">Start practising</Link>
          <Link to="/topics" className="rounded-xl border border-line px-5 py-3 font-semibold hover:border-lilac">Browse {topics} topics</Link>
        </div>
        <p className="text-sm text-mist">{live} sub-topic{live === 1 ? '' : 's'} live now, more every week.</p>
      </section>
      <section aria-labelledby="levels" className="space-y-4">
        <h2 id="levels" className="font-display text-2xl font-bold">Three levels, three different answers</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {levels.map((l) => (
            <div key={l.id} className="rounded-2xl border border-line bg-panel p-5">
              <h3 className="font-semibold">{l.label}</h3>
              <p className="mt-2 text-sm text-mist">{l.note}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
