import { diagram, node, decision, edge, note } from '../../../scripts/diagram-kit.mjs';

const y = 88;
const h = 112;

export default diagram({
  title: 'Roadmap: three phases, two gates',
  subtitle: 'Each gate decides when a phase moves on, not the calendar',
  description: 'Phase 1 builds the free core, then Gate 1 asks whether AI scoring matches human scoring (80% agreement on 20 blind answers). Phase 2 is a free launch that measures usage, then Gate 2 asks whether repeat usage is proven (30% return within 7 days, 200 weekly practisers). Phase 3 adds Interview Pass and Teams. A failed gate loops back to its phase.',
  width: 1136,
  height: 304,
  legend: [
    { kind: 'step', label: 'Build' },
    { kind: 'risk', label: 'Gate' },
    { kind: 'live', label: 'Free launch' },
    { kind: 'good', label: 'Payments' },
    { kind: 'stop', label: 'Gate failed' },
  ],
  items: [
    node({ id: 'p1', x: 0, y, w: 176, h, eyebrow: 'Phase 1', title: 'Build free core', sub: 'Practice loop and MCP' }),
    decision({ id: 'g1', x: 240, y, w: 168, h, title: 'Gate 1: scores agree?' }),
    node({ id: 'p2', x: 472, y, w: 176, h, kind: 'live', eyebrow: 'Phase 2', title: 'Free launch', sub: 'Measure usage' }),
    decision({ id: 'g2', x: 712, y, w: 168, h, title: 'Gate 2: users return?' }),
    node({ id: 'p3', x: 944, y, w: 192, h, kind: 'good', eyebrow: 'Phase 3', title: 'Interview Pass and Teams', sub: 'Build payments' }),
    note({ x: 232, y: 40, w: 184, kind: 'risk', strong: true, text: 'AI matches human scoring: 80% agreement on 20 blind answers' }),
    note({ x: 704, y: 40, w: 184, kind: 'risk', strong: true, text: 'Repeat usage proven: 30% return in 7 days, 200 weekly practisers' }),
    edge({ from: 'p1', to: 'g1', label: 'blind' }),
    edge({ from: 'g1', to: 'p2', label: 'pass', kind: 'live' }),
    edge({ from: 'p2', to: 'g2', label: 'usage' }),
    edge({ from: 'g2', to: 'p3', label: 'met', kind: 'good' }),
    edge({ from: 'g1', to: 'p1', label: 'fail: fix rubrics', kind: 'stop', dashed: true, fromSide: 'bottom', toSide: 'bottom', via: [[324, 264], [88, 264]] }),
    edge({ from: 'g2', to: 'p2', label: 'not met: keep improving', kind: 'stop', dashed: true, fromSide: 'bottom', toSide: 'bottom', via: [[796, 264], [560, 264]] }),
  ],
});
