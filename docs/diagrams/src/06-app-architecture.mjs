import { diagram, node, edge, group, note } from '../../../scripts/diagram-kit.mjs';

export default diagram({
  title: 'App architecture',
  subtitle: 'One Worker serves pre-rendered pages, the app shell and its own API',
  description: 'The browser, either a public page visitor or the installed PWA, talks to one Cloudflare Worker at roleprep.aaryaai.dev. The Worker serves static assets (pre-rendered public pages and the app shell) and its own API, which calls Workers AI. The installed app calls api.aaryaai.dev directly for sign-in and sync. At build time, content/roleprep is read by the React Router pre-render, which writes build/client for the Worker. The old aaryaai.dev/roleprep address redirects to the public pages.',
  width: 1104,
  height: 832,
  legend: [
    { kind: 'step', label: 'Role Prep app, build or Worker' },
    { kind: 'live', label: 'Live service' },
    { kind: 'plain', label: 'Old address' },
  ],
  items: [
    group({ x: 0, y: 64, w: 256, h: 352, kind: 'step', title: 'Browser', sub: 'Two ways in' }),
    node({ id: 'pwa', x: 24, y: 120, w: 208, h: 104, eyebrow: 'Installed', title: 'Practice PWA', sub: 'App shell, offline, progress on device' }),
    node({ id: 'pages', x: 24, y: 288, w: 208, h: 104, eyebrow: 'Public', title: 'Search visitor', sub: 'Real HTML, no install needed' }),

    group({ x: 336, y: 64, w: 408, h: 352, kind: 'step', title: 'roleprep.aaryaai.dev', sub: 'One Cloudflare Worker named roleprep' }),
    node({ id: 'api', x: 360, y: 120, w: 360, h: 104, eyebrow: 'Own API', title: '/api/* and /mcp', sub: 'Health now; transcribe, feedback and MCP to come' }),
    node({ id: 'assets', x: 360, y: 288, w: 360, h: 104, eyebrow: 'Static assets', title: 'Pre-rendered pages and app shell', sub: 'build/client, served from the edge' }),

    group({ x: 840, y: 64, w: 264, h: 352, kind: 'live', title: 'Live services', sub: 'Never cached' }),
    node({ id: 'ai', x: 864, y: 120, w: 216, h: 104, kind: 'live', eyebrow: 'Live', title: 'Workers AI', sub: 'Whisper speech to text, scoring' }),
    node({ id: 'auth', x: 864, y: 288, w: 216, h: 104, kind: 'live', eyebrow: 'Live', title: 'api.aaryaai.dev', sub: 'AaryaAI Google sign-in and sync' }),

    node({ id: 'old', x: 0, y: 552, w: 256, h: 104, kind: 'plain', eyebrow: 'Old address', title: 'aaryaai.dev/roleprep', sub: 'Redirects to roleprep.aaryaai.dev' }),

    group({ x: 336, y: 496, w: 408, h: 336, kind: 'step', title: 'Build time', sub: 'One commit' }),
    node({ id: 'render', x: 360, y: 552, w: 360, h: 104, eyebrow: 'React Router', title: 'Pre-render public routes', sub: 'Loaders read content at build time' }),
    node({ id: 'content', x: 360, y: 720, w: 360, h: 88, eyebrow: 'Content', title: 'content/roleprep', sub: 'Same repo, same commit' }),

    note({ x: 864, y: 568, w: 232, kind: 'plain', text: 'No CDN promotion step for Role Prep: the content is in the build.' }),
    note({ x: 24, y: 696, w: 224, kind: 'plain', text: 'The platform nav keeps its Role Prep link, now pointing here.' }),

    edge({ from: 'pages', to: 'assets', label: 'HTML, app shell', kind: 'step' }),
    edge({ from: 'pwa', to: 'api', label: 'audio, answers', kind: 'step' }),
    edge({ from: 'api', to: 'ai', label: 'transcribe, score', kind: 'live' }),
    edge({ from: 'pwa', to: 'auth', label: 'sign-in, sync', kind: 'live', fromSide: 'top', toSide: 'right', via: [[128, 32], [1092, 32], [1092, 340]], labelAt: 0.35 }),
    edge({ from: 'old', to: 'pages', label: 'redirects', kind: 'plain', dashed: true }),
    edge({ from: 'content', to: 'render', label: 'read at build', kind: 'step' }),
    edge({ from: 'render', to: 'assets', label: 'writes build/client', kind: 'step' }),
  ],
});
