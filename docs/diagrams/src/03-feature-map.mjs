import { diagram, node, decision, edge, group } from '../../../scripts/diagram-kit.mjs';

const W = 336;
const H = 88;
const col = [24, 392, 760];
const r1 = 56;
const r2 = r1 + H + 24;

export default diagram({
  title: 'Feature map',
  subtitle: 'Ten features in three phases; two gates decide when each phase moves on',
  description: 'Phase 1 builds F1 to F6: content model, practice room, speak your answer, AI feedback, journey setup and own-AI access. Gate 1 needs 80% scoring agreement. Phase 2 adds F7 accounts and F8 growth and measurement. Gate 2 needs 30% return within 7 days and 200 weekly active practisers. Phase 3 holds F9 Interview Pass and F10 Teams.',
  width: 1120,
  height: 1088,
  legend: [
    { kind: 'step', label: 'Feature' },
    { kind: 'risk', label: 'Gate' },
    { kind: 'live', label: 'Measurement' },
    { kind: 'plain', label: 'Outline only' },
  ],
  items: [
    group({ x: 0, y: 0, w: 1120, h: 280, title: 'Phase 1', sub: 'Build the practice product' }),
    node({ id: 'f1', x: col[0], y: r1, w: W, h: H, eyebrow: 'F1', title: 'Content model and authoring', sub: 'Base for every other feature' }),
    node({ id: 'f2', x: col[1], y: r1, w: W, h: H, eyebrow: 'F2', title: 'Practice room', sub: 'Needs F1: answer first, then read' }),
    node({ id: 'f3', x: col[2], y: r1, w: W, h: H, eyebrow: 'F3', title: 'Speak your answer', sub: 'Needs F2: audio transcribed, discarded' }),
    node({ id: 'f5', x: col[0], y: r2, w: W, h: H, eyebrow: 'F5', title: 'Journey setup and plan', sub: 'Needs F1: plan fits your real time' }),
    node({ id: 'f4', x: col[1], y: r2, w: W, h: H, eyebrow: 'F4', title: 'AI feedback', sub: 'Needs F1 and F2: scored by rubric' }),
    node({ id: 'f6', x: col[2], y: r2, w: W, h: H, eyebrow: 'F6', title: 'Practise with your own AI', sub: 'Needs F1: read-only MCP server' }),

    decision({ id: 'g1', x: 476, y: 352, w: 168, h: 104, title: 'Scores agree?' }),

    group({ x: 0, y: 528, w: 1120, h: 152, title: 'Phase 2', sub: 'Accounts and measurement' }),
    node({ id: 'f7', x: 192, y: 584, w: W, h: H, eyebrow: 'F7', title: 'Accounts and progress sync', sub: 'Needs F2 and F5: sign in, sync' }),
    node({ id: 'f8', x: 592, y: 584, w: W, h: H, kind: 'live', eyebrow: 'F8', title: 'Growth and measurement', sub: 'Gate 2 numbers from real use', badge: 'RP-8.1 in phase 1' }),

    decision({ id: 'g2', x: 476, y: 744, w: 168, h: 104, title: 'Users return?' }),

    group({ x: 0, y: 920, w: 1120, h: 168, title: 'Phase 3', sub: 'Money and teams' }),
    node({ id: 'f9', x: 192, y: 976, w: W, h: H, eyebrow: 'F9', title: 'Interview Pass', sub: 'Needs F7: $19 for 30 days' }),
    node({ id: 'f10', x: 592, y: 976, w: W, h: H, kind: 'plain', eyebrow: 'F10', title: 'Teams', sub: 'Outline only, after individuals prove it' }),

    edge({ from: 'f4', to: 'g1', label: 'RP-4.3: 80% agree', kind: 'risk' }),
    edge({ from: 'g1', to: 'f7', label: 'gate passed', kind: 'good', fromSide: 'left', toSide: 'top' }),
    edge({ from: 'g1', to: 'f8', label: 'gate passed', kind: 'good', fromSide: 'right', toSide: 'top' }),
    edge({ from: 'f8', to: 'g2', label: '30% return, 200 weekly', kind: 'risk', fromSide: 'bottom', toSide: 'top' }),
    edge({ from: 'g2', to: 'f9', label: 'gate passed', kind: 'good', fromSide: 'left', toSide: 'top' }),
    edge({ from: 'g2', to: 'f10', label: 'gate passed', kind: 'good', fromSide: 'right', toSide: 'top' }),
  ],
});
