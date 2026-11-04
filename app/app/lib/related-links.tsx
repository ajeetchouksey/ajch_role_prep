import { RELATED_GROUPS, type Related } from './content';

/**
 * Links to the rest of AaryaAI for one sub-topic: SkillUp notes, labs, use cases
 * and blog posts, each group ranked by shared taxonomy concepts with hand-picked
 * items first. `compact` shows one item per group (the practice room's
 * "close the gap" card); the full view lists every group.
 */
export function RelatedLinks({ related, compact = false }: { related: Related; compact?: boolean }) {
  const groups = RELATED_GROUPS.map((g) => ({ ...g, items: compact ? related[g.key].slice(0, 1) : related[g.key] })).filter((g) => g.items.length);
  if (!groups.length) return null;
  return (
    <div className={compact ? 'grid gap-3 sm:grid-cols-2' : 'grid gap-4 sm:grid-cols-2'}>
      {groups.map((g) => (
        <section key={g.key} aria-label={g.label} className="rounded-2xl border border-line bg-panel p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-live">{g.verb} · {g.label}</p>
          <ul className="mt-2 space-y-2">
            {g.items.map((i) => (
              <li key={i.id}>
                <a href={i.url} className="group block" title={`Shares: ${i.shared.join(', ')}`}>
                  <span className="font-semibold group-hover:text-lilac group-hover:underline">{i.title}</span>
                  <span className="sr-only"> (opens on aaryaai.dev)</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
