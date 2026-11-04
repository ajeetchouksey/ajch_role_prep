import { diagram, node, decision, edge } from '../../../scripts/diagram-kit.mjs';

const y = 24;
const h = 104;

export default diagram({
  title: 'The practice loop',
  subtitle: 'One interview moment, practised until it is ready at your level',
  description: 'Four steps: answer out loud, see which rubric points were hit, read your answer rewritten with one fix, then a readiness check that loops back to answering until the moment is marked ready.',
  width: 1088,
  height: 232,
  legend: [
    { kind: 'step', label: 'Candidate action' },
    { kind: 'live', label: 'AI feedback' },
    { kind: 'risk', label: 'Readiness check' },
    { kind: 'good', label: 'Outcome' },
  ],
  items: [
    node({ id: 'answer', x: 0, y, w: 176, h, eyebrow: 'Step 1', title: 'Answer out loud', sub: 'Timed, spoken or typed' }),
    node({ id: 'score', x: 240, y, w: 184, h, kind: 'live', eyebrow: 'Step 2', title: 'See rubric points hit', sub: 'Covered, partly or missed' }),
    node({ id: 'fix', x: 488, y, w: 184, h, eyebrow: 'Step 3', title: 'Read your answer rewritten', sub: 'One fix to take first' }),
    decision({ id: 'ready', x: 736, y, w: 160, h, title: 'Moment ready?' }),
    node({ id: 'done', x: 944, y, w: 144, h, kind: 'good', eyebrow: 'Outcome', title: 'Marked ready', sub: 'Counts toward level readiness' }),
    edge({ from: 'answer', to: 'score', label: 'submit' }),
    edge({ from: 'score', to: 'fix', label: 'take one fix' }),
    edge({ from: 'fix', to: 'ready', label: 'try again' }),
    edge({ from: 'ready', to: 'done', label: 'yes', kind: 'good' }),
    edge({ from: 'ready', to: 'answer', label: 'not yet: retry the moment', kind: 'risk', dashed: true, fromSide: 'bottom', toSide: 'bottom', via: [[816, 200], [88, 200]] }),
  ],
});
