import { diagram, node, decision, edge } from '../../../scripts/diagram-kit.mjs';

const y1 = 152;
const y2 = 360;
const h = 104;

export default diagram({
  title: 'The candidate journey',
  subtitle: 'Interview in two weeks: practise one sub-topic a day until every moment is ready',
  description: 'Set level and date, pick the topics the role needs, then practise one sub-topic a day. At the readiness check, a no sends the candidate back to daily practice, either with the next sub-topic or through a SkillUp or HOL Lab detour to close a gap. A yes leads to a mixed mock round, the night-before review and interview day.',
  width: 1056,
  height: 472,
  legend: [
    { kind: 'step', label: 'Candidate stage' },
    { kind: 'risk', label: 'Readiness check' },
    { kind: 'live', label: 'Gap detour' },
    { kind: 'good', label: 'Outcome' },
  ],
  items: [
    node({ id: 'setup', x: 0, y: y1, w: 208, h, eyebrow: 'Stage 2', title: 'Set level and date', sub: 'Plan rebuilds as you choose' }),
    node({ id: 'topics', x: 272, y: y1, w: 208, h, eyebrow: 'Stage 2', title: 'Pick topics the role needs', sub: 'Plan fits your real time' }),
    node({ id: 'practise', x: 544, y: y1, w: 208, h, eyebrow: 'Stage 4', title: 'Practise one sub-topic a day', sub: 'Retry with the fix' }),
    decision({ id: 'ready', x: 816, y: y1, w: 168, h, title: 'Ready on all?' }),
    node({ id: 'detour', x: 796, y: 0, w: 208, h: 88, kind: 'live', eyebrow: 'Stage 5', title: 'SkillUp or HOL Lab', sub: 'Links back to the same moment' }),

    node({ id: 'mock', x: 0, y: y2, w: 208, h, eyebrow: 'Stage 6', title: 'Mixed mock round', sub: 'Timed, with follow-ups' }),
    node({ id: 'night', x: 272, y: y2, w: 208, h, eyebrow: 'Stage 7', title: 'Night-before review', sub: 'One page, weakest first' }),
    node({ id: 'day', x: 544, y: y2, w: 208, h, kind: 'good', eyebrow: 'Stage 8', title: 'Interview day', sub: 'Practised structures to fall back on' }),

    edge({ from: 'setup', to: 'topics', label: 'then' }),
    edge({ from: 'topics', to: 'practise', label: 'plan set' }),
    edge({ from: 'practise', to: 'ready', label: 'day done' }),
    edge({ from: 'ready', to: 'detour', label: 'no: gap found', kind: 'live', dashed: true, fromSide: 'top', toSide: 'bottom' }),
    edge({ from: 'detour', to: 'practise', label: 'back to the moment', kind: 'live', dashed: true, fromSide: 'left', toSide: 'top' }),
    edge({ from: 'ready', to: 'practise', label: 'no: next sub-topic', kind: 'risk', dashed: true, fromSide: 'bottom', toSide: 'bottom', via: [[900, 296], [648, 296]] }),
    edge({ from: 'ready', to: 'mock', label: 'yes', kind: 'good', fromSide: 'right', toSide: 'top', via: [[1032, 204], [1032, 328], [104, 328]] }),
    edge({ from: 'mock', to: 'night', label: 'done' }),
    edge({ from: 'night', to: 'day', label: 'ready' }),
  ],
});
