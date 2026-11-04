import { diagram, node, edge, note } from '../../../scripts/diagram-kit.mjs';

const rows = [
  { id: 'nav', y: 56, req: ['Page navigation', 'Opening any screen or public page'], strat: ['Network first', 'Cached copy if the network fails'], res: ['risk', 'Pages you opened before', 'Open from cache; new pages need a connection'], via: 'cached copy' },
  { id: 'app', y: 192, req: ['App files', 'JavaScript and CSS of the shell'], strat: ['Precache', 'Stored at install, versioned'], res: ['good', 'The app always opens', 'The shell never needs the network'], via: 'from cache' },
  { id: 'json', y: 328, req: ['Content JSON', '/content/roleprep/**'], strat: ['Stale while revalidate', 'Show the copy, refresh behind it'], res: ['good', 'Downloaded sub-topics', 'Plus the night-before review sheet'], via: 'last copy' },
  { id: 'prog', y: 464, req: ['Your progress', 'Attempts, plan, readiness'], strat: ['Local first', 'Written to IndexedDB on the device'], res: ['good', 'Saved offline', 'Synced when you sign in'], via: 'saved here' },
  { id: 'api', y: 600, req: ['API calls', '/api/transcribe, /api/feedback'], strat: ['Network only', 'Never cached, audio never stored'], res: ['stop', 'Needs a connection', 'Speech and AI feedback wait for it'], via: 'fails' },
];

export default diagram({
  title: 'Offline strategy',
  subtitle: 'Each kind of request has one caching rule, and the rule decides what works offline',
  description: 'Five request types and the strategy for each. Page navigations are network first with a cached fallback. App files are precached. Content JSON is stale while revalidate. Progress is written locally first to IndexedDB. API calls are network only, so transcription and AI feedback need a connection.',
  width: 1088,
  height: 728,
  legend: [
    { kind: 'plain', label: 'Request' },
    { kind: 'step', label: 'Caching strategy' },
    { kind: 'good', label: 'Works offline' },
    { kind: 'risk', label: 'Partly offline' },
    { kind: 'stop', label: 'Needs network' },
  ],
  items: [
    note({ x: 0, y: 20, w: 200, text: 'REQUEST', strong: true }),
    note({ x: 408, y: 20, w: 200, text: 'STRATEGY', strong: true }),
    note({ x: 816, y: 20, w: 200, text: 'WHAT WORKS OFFLINE', strong: true }),
    ...rows.flatMap((r) => [
      node({ id: `${r.id}-req`, x: 0, y: r.y, w: 272, h: 96, kind: 'plain', title: r.req[0], sub: r.req[1] }),
      node({ id: `${r.id}-strat`, x: 408, y: r.y, w: 272, h: 96, kind: 'step', title: r.strat[0], sub: r.strat[1] }),
      node({ id: `${r.id}-res`, x: 816, y: r.y, w: 272, h: 96, kind: r.res[0], title: r.res[1], sub: r.res[2] }),
      edge({ from: `${r.id}-req`, to: `${r.id}-strat`, label: 'handled by', kind: 'step' }),
      edge({ from: `${r.id}-strat`, to: `${r.id}-res`, label: r.via, kind: r.res[0] }),
    ]),
  ],
});
