import { diagram, node, edge, group, note } from '../../../scripts/diagram-kit.mjs';

export default diagram({
  title: 'Target architecture',
  subtitle: 'Content flows one way: repo, then a pinned commit, then the app',
  description: 'Role Prep content and the agent kit live in ajch_role_prep. The promote workflow records a pinned commit in content-manifest.json, jsDelivr serves that commit, and the ajch_platform web app and MCP server read it. Brand tokens reach the web app from the AaryaAI brand package; the Worker routes call speech and AI services.',
  width: 1104,
  height: 832,
  legend: [
    { kind: 'step', label: 'Our repo, workflow or app' },
    { kind: 'live', label: 'CDN or AI service' },
    { kind: 'plain', label: 'Shared package or tool' },
  ],
  items: [
    // Repo
    group({ x: 0, y: 0, w: 256, h: 352, kind: 'step', title: 'ajch_role_prep', sub: 'Content and authoring kit' }),
    node({ id: 'content', x: 24, y: 56, w: 208, h: 96, eyebrow: 'Content', title: 'Role Prep content', sub: 'content/roleprep' }),
    node({ id: 'kit', x: 24, y: 216, w: 208, h: 112, eyebrow: 'Agent kit', title: '.claude/ generated', sub: 'Agents, skills, commands, hooks' }),
    node({ id: 'framework', x: 24, y: 416, w: 208, h: 96, kind: 'plain', eyebrow: 'Shared tool', title: 'ajch_agent_framework', sub: 'Renders kit/ into .claude/' }),
    note({ x: 24, y: 552, w: 224, kind: 'plain', text: 'The platform keeps syncing the shared agents (AppSec, vocabulary, pipeline) out to this kit.' }),

    // Delivery path
    group({ x: 352, y: 0, w: 248, h: 496, kind: 'plain', title: 'Delivery path', sub: 'Pinned, never live' }),
    node({ id: 'promote', x: 376, y: 56, w: 200, h: 96, eyebrow: 'Workflow', title: 'Promote content', sub: 'promote-content.yml' }),
    node({ id: 'manifest', x: 376, y: 216, w: 200, h: 96, eyebrow: 'Manifest', title: 'Pinned commit', sub: 'content-manifest.json' }),
    node({ id: 'cdn', x: 376, y: 376, w: 200, h: 96, kind: 'live', eyebrow: 'CDN', title: 'jsDelivr', sub: 'Serves the pinned commit' }),

    // Brand
    group({ x: 696, y: 0, w: 408, h: 168, kind: 'plain', title: 'AaryaAI brand foundation' }),
    node({ id: 'brand', x: 720, y: 56, w: 360, h: 88, kind: 'plain', eyebrow: 'Brand v2', title: 'ajch_brand tokens', sub: 'Barlow type, indigo and lilac palette' }),

    // Platform
    group({ x: 696, y: 328, w: 408, h: 352, kind: 'step', title: 'ajch_platform', sub: 'aaryaai.dev' }),
    node({ id: 'web', x: 720, y: 376, w: 360, h: 96, eyebrow: 'Web app', title: '/roleprep UI', sub: 'src/features/roleprep, on the brand' }),
    node({ id: 'mcp', x: 720, y: 552, w: 168, h: 104, eyebrow: 'MCP server', title: 'Read-only', sub: 'Reads the same commit' }),
    node({ id: 'worker', x: 912, y: 552, w: 168, h: 104, eyebrow: 'Worker routes', title: 'Transcribe, feedback', sub: 'Speech and scoring calls' }),
    node({ id: 'ai', x: 912, y: 744, w: 168, h: 88, kind: 'live', eyebrow: 'External', title: 'Speech and AI', sub: 'Transcription, scoring' }),

    edge({ from: 'kit', to: 'content', label: 'authors', kind: 'step' }),
    edge({ from: 'framework', to: 'kit', label: 'renders from kit/', kind: 'plain' }),
    edge({ from: 'content', to: 'promote', label: 'pinned commit', kind: 'step' }),
    edge({ from: 'promote', to: 'manifest', label: 'records commit', kind: 'step' }),
    edge({ from: 'manifest', to: 'cdn', label: 'served at commit', kind: 'live' }),
    edge({ from: 'cdn', to: 'web', label: 'fetches content', kind: 'live' }),
    edge({ from: 'cdn', to: 'mcp', label: 'same commit', kind: 'live', fromSide: 'bottom', toSide: 'left', via: [[476, 604]], labelAt: 0.75 }),
    edge({ from: 'brand', to: 'web', label: 'brand tokens', kind: 'plain' }),
    edge({ from: 'web', to: 'worker', label: 'audio, answers', kind: 'step' }),
    edge({ from: 'worker', to: 'ai', label: 'transcribe, score', kind: 'live' }),
  ],
});
