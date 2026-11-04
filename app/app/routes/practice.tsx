import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import type { Route } from './+types/practice';
import { fetchRelated, fetchSubtopic, KIND_LABEL, LEVELS, type LevelId, type Moment, type View } from '~/lib/content';
import { RelatedLinks } from '~/lib/related-links';
import { loadLevel, saveLevel, saveRep } from '~/lib/progress';

// Practice room (screen S5): answer first against a timer, then reveal, then
// self-score against the rubric. Speak-your-answer and AI feedback plug in here
// (stories RP-3.x and RP-4.x) through /api/transcribe and /api/feedback.
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const [subtopic, related] = await Promise.all([fetchSubtopic(params.topic, params.subtopic), fetchRelated(params.topic, params.subtopic)]);
  return { subtopic, related, topicId: params.topic };
}

export function meta({ data }: Route.MetaArgs) {
  return [{ title: `Practise ${data?.subtopic.title ?? ''} · Role Prep` }, { name: 'robots', content: 'noindex' }];
}

type Phase = 'answer' | 'reveal' | 'done';

export default function Practice({ loaderData }: Route.ComponentProps) {
  const { subtopic, related, topicId } = loaderData;
  const [level, setLevel] = useState<LevelId>('tech');
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('answer');
  const [answer, setAnswer] = useState('');
  const [picked, setPicked] = useState<number | null>(null);
  const [checked, setChecked] = useState<boolean[]>([]);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => setLevel(loadLevel()), []);
  const moment: Moment = subtopic.moments[index];
  const view: View = moment.views[level];
  const rubric = view.rubric ?? view.points ?? [];

  useEffect(() => {
    if (phase !== 'answer') return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [phase, index]);

  function chooseLevel(l: LevelId) { setLevel(l); saveLevel(l); }
  function reveal() { setPhase('reveal'); setChecked(rubric.map(() => false)); }
  function next() {
    saveRep({ key: `${topicId}/${subtopic.id.split('.').pop()}/${moment.id}`, level, score: checked.filter(Boolean).length, of: rubric.length, at: new Date().toISOString() });
    if (index + 1 >= subtopic.moments.length) { setPhase('done'); return; }
    setIndex(index + 1); setPhase('answer'); setAnswer(''); setPicked(null); setSeconds(0);
  }

  if (phase === 'done') {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Sub-topic done</h1>
        <p className="text-mist">Your reps are saved on this device. Come back tomorrow and the weakest moments come first.</p>
        <Link to="/today" className="inline-block rounded-xl bg-indigo px-5 py-3 font-semibold text-white">Back to Today</Link>
      </div>
    );
  }

  const target = { 'know-cold': 60, question: 120, pushback: 0, challenge: 300 }[moment.kind];
  const mmss = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to={`/topics/${topicId}/${subtopic.id.split('.').pop()}`} className="text-sm text-mist hover:text-white">← {subtopic.title}</Link>
        <div role="radiogroup" aria-label="Interview level" className="inline-flex rounded-xl border border-line p-1">
          {LEVELS.map((l) => (
            <button key={l.id} role="radio" aria-checked={level === l.id} onClick={() => chooseLevel(l.id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${level === l.id ? 'bg-indigo text-white' : 'text-mist'}`}>{l.label}</button>
          ))}
        </div>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-line" aria-label={`Moment ${index + 1} of ${subtopic.moments.length}`}>
        <div className="h-full bg-lilac transition-all" style={{ width: `${(index / subtopic.moments.length) * 100}%` }} />
      </div>

      <section className="space-y-3 rounded-2xl border border-line bg-panel p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-lilac">{index + 1} of {subtopic.moments.length} · {KIND_LABEL[moment.kind]}</p>
        {moment.scenario && <p className="text-mist">{moment.scenario}</p>}
        <h1 className="text-2xl font-semibold">“{view.asked ?? view.line}”</h1>
        {view.context && <p className="text-sm text-mist">{view.context}</p>}
      </section>

      {phase === 'answer' && moment.kind !== 'pushback' && (
        <section className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <label htmlFor="answer" className="font-semibold">Your answer</label>
            <span className={`tabular-nums ${target && seconds > target ? 'text-partly' : 'text-mist'}`} aria-live="polite">{mmss}{target ? ` / ${Math.floor(target / 60)}:00` : ''}</span>
          </div>
          <textarea id="answer" value={answer} onChange={(e) => setAnswer(e.target.value)} rows={7}
            placeholder="Say it out loud, then jot the key points. Speak-your-answer is coming next."
            className="w-full rounded-2xl border border-line bg-ground p-4 text-base outline-none focus:border-lilac" />
          <button onClick={reveal} className="rounded-xl bg-indigo px-5 py-3 font-semibold text-white hover:bg-indigo-strong">Show the strong answer</button>
        </section>
      )}

      {phase === 'answer' && moment.kind === 'pushback' && (
        <section className="space-y-3">
          <p className="font-semibold">Which reply would you give?</p>
          {view.options?.map((o, i) => (
            <button key={i} onClick={() => { setPicked(i); reveal(); }}
              className="block w-full rounded-2xl border border-line bg-panel p-4 text-left hover:border-lilac">{o.text}</button>
          ))}
        </section>
      )}

      {phase === 'reveal' && (
        <section className="space-y-5">
          {moment.kind === 'pushback' ? (
            view.options?.map((o, i) => (
              <div key={i} className={`rounded-2xl border p-4 ${o.verdict === 'strong' ? 'border-covered' : 'border-line'} ${picked === i ? 'ring-2 ring-lilac' : ''}`}>
                <p className={`text-xs font-bold uppercase tracking-widest ${o.verdict === 'strong' ? 'text-covered' : 'text-missed'}`}>{o.verdict}{picked === i ? ' · your pick' : ''}</p>
                <p className="mt-1">{o.text}</p>
                {o.why && <p className="mt-2 text-sm text-mist">{o.why}</p>}
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-covered/60 bg-covered/10 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-covered">Strong answer</p>
              {view.structure && <p className="mt-2 text-sm text-mist">{view.structure.join(' → ')}</p>}
              <p className="mt-2 leading-relaxed">{view.strong ?? view.model ?? view.short}</p>
            </div>
          )}
          {view.weak && (
            <div className="rounded-2xl border border-missed/50 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-missed">Weak answer and why it loses</p>
              <p className="mt-2">{view.weak}</p>
              <p className="mt-2 text-sm text-mist">{view.weakWhy}</p>
            </div>
          )}
          {rubric.length > 0 && (
            <fieldset className="space-y-2 rounded-2xl border border-line p-5">
              <legend className="px-1 font-semibold">Did your answer cover these?</legend>
              {rubric.map((r, i) => (
                <label key={i} className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1 size-4 accent-covered" checked={checked[i] ?? false}
                    onChange={(e) => setChecked(checked.map((c, j) => (j === i ? e.target.checked : c)))} />
                  <span>{r}</span>
                </label>
              ))}
            </fieldset>
          )}
          {related && rubric.length > 0 && checked.some((c) => !c) && (
            <div className="space-y-3 rounded-2xl border border-live/50 bg-live/5 p-5">
              <p className="font-semibold">Close the gap</p>
              <p className="text-sm text-mist">Missed a point? These cover it, then come back and retry this moment.</p>
              <RelatedLinks related={related} compact />
            </div>
          )}
          {(view.followUps?.length || view.followUp) && (
            <p className="text-sm text-mist"><span className="font-semibold text-white">They'll follow up with: </span>{view.followUps?.join(' · ') ?? view.followUp}</p>
          )}
          <button onClick={next} className="rounded-xl bg-indigo px-5 py-3 font-semibold text-white hover:bg-indigo-strong">
            {index + 1 >= subtopic.moments.length ? 'Finish' : 'Next moment'}
          </button>
        </section>
      )}
    </div>
  );
}
