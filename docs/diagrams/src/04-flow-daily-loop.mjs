import { diagram, node, edge } from '../../../scripts/diagram-kit.mjs';

const y = 24;
const h = 128;
const w = 196;
const xs = [0, 300, 600, 900];
const card = (i, o) => node({ id: 's' + (i + 1), x: xs[i], y, w, h, eyebrow: 'Step ' + (i + 1), ...o });

export default diagram({
  title: 'Daily loop',
  subtitle: 'Answer, learn the fix, retry, then return to Today',
  description: 'Four steps: open Today, answer a moment in the practice room, read feedback with one fix, retry for a higher score, and return to Today for the next moment once the moment is ready.',
  width: 1096,
  height: 224,
  legend: [
    { kind: 'step', label: 'Daily home' },
    { kind: 'live', label: 'Live practice and feedback' },
    { kind: 'good', label: 'Outcome' },
  ],
  items: [
    card(0, { kind: 'step', title: 'Open Today', sub: 'S3 Today, plan and readiness' }),
    card(1, { kind: 'live', title: 'Answer a moment', sub: 'S5 Practice room, timed' }),
    card(2, { kind: 'live', title: 'Feedback and one fix', sub: 'Points hit, your answer improved' }),
    card(3, { kind: 'good', title: 'Higher score', sub: 'Moment marked ready' }),
    edge({ from: 's1', to: 's2', label: 'Start practice', kind: 'live', labelXY: [248, 64] }),
    edge({ from: 's2', to: 's3', label: 'Get feedback', kind: 'live', labelXY: [548, 64] }),
    edge({ from: 's3', to: 's4', label: 'Retry with fix', kind: 'good', labelXY: [848, 64] }),
    edge({ from: 's4', to: 's1', label: 'Next moment, once ready', kind: 'step', dashed: true, fromSide: 'bottom', toSide: 'bottom', via: [[998, 192], [98, 192]] }),
  ],
});
