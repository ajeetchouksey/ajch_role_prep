import { diagram, node, edge, group, note } from '../../../scripts/diagram-kit.mjs';

export default diagram({
  title: 'Target architecture',
  subtitle: 'Content, kit and app live in one repo and ship from one commit',
  description: 'Role Prep content, the app and the agent kit live in ajch_role_prep. A build pre-renders the app and writes it for the roleprep Worker at roleprep.aaryaai.dev, which serves the static assets and its own API and MCP server; the API calls Workers AI. Brand tokens reach the app from the AaryaAI brand package, and ajch_agent_framework renders the kit.',
  width: 1104,
  height: 760,
  legend: [
    { kind: 'step', label: 'Our repo, build or Worker' },
    { kind: 'live', label: 'AI service' },
    { kind: 'plain', label: 'Shared package or tool' },
  ],
  items: [
    // Shared tool
    node({ id: 'framework', x: 0, y: 0, w: 256, h: 96, kind: 'plain', eyebrow: 'Shared tool', title: 'ajch_agent_framework', sub: 'Renders kit/ into .claude/' }),

    // Repo
    group({ x: 0, y: 168, w: 256, h: 512, kind: 'step', title: 'ajch_role_prep', sub: 'One repo' }),
    node({ id: 'kit', x: 24, y: 224, w: 208, h: 112, eyebrow: 'Agent kit', title: '.claude/ generated', sub: 'Agents, skills, commands, hooks' }),
    node({ id: 'content', x: 24, y: 400, w: 208, h: 96, eyebrow: 'Content', title: 'Role Prep content', sub: 'content/roleprep' }),
    node({ id: 'app', x: 24, y: 560, w: 208, h: 96, eyebrow: 'App', title: 'app/', sub: 'React Router, PWA, Worker' }),

    // Build and brand
    note({ x: 376, y: 40, w: 264, kind: 'plain', text: 'No promote workflow or CDN for Role Prep: the content is in the build.' }),
    node({ id: 'build', x: 376, y: 480, w: 200, h: 96, eyebrow: 'Build', title: 'Pre-render, bundle', sub: 'One commit, one build' }),
    node({ id: 'brand', x: 376, y: 640, w: 200, h: 88, kind: 'plain', eyebrow: 'Brand v2', title: 'ajch_brand tokens', sub: 'Barlow, indigo and lilac' }),

    // Worker
    group({ x: 696, y: 0, w: 408, h: 600, kind: 'step', title: 'roleprep.aaryaai.dev', sub: 'One Cloudflare Worker named roleprep' }),
    node({ id: 'ai', x: 720, y: 72, w: 360, h: 88, kind: 'live', eyebrow: 'Live', title: 'Workers AI', sub: 'Transcription, scoring' }),
    node({ id: 'api', x: 720, y: 288, w: 360, h: 104, eyebrow: 'Own API', title: '/api/* and /mcp', sub: 'Transcribe, feedback, read-only MCP' }),
    node({ id: 'web', x: 720, y: 480, w: 360, h: 96, eyebrow: 'Static assets', title: 'Pages and app shell', sub: 'Pre-rendered public pages, PWA' }),

    edge({ from: 'framework', to: 'kit', label: 'renders from kit/', kind: 'plain' }),
    edge({ from: 'kit', to: 'content', label: 'authors', kind: 'step' }),
    edge({ from: 'content', to: 'build', label: 'read at build', kind: 'step', fromSide: 'right', toSide: 'top', via: [[476, 448]] }),
    edge({ from: 'app', to: 'build', label: 'built from', kind: 'step', fromSide: 'right', toSide: 'bottom', via: [[476, 608]] }),
    edge({ from: 'brand', to: 'app', label: 'brand tokens', kind: 'plain', fromSide: 'left', toSide: 'bottom', via: [[128, 684]] }),
    edge({ from: 'build', to: 'web', label: 'build/client', kind: 'step' }),
    edge({ from: 'web', to: 'api', label: 'app calls', kind: 'step' }),
    edge({ from: 'api', to: 'ai', label: 'transcribe, score', kind: 'live' }),
  ],
});
