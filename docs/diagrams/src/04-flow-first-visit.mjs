import { diagram, node, edge } from '../../../scripts/diagram-kit.mjs';

const y = 24;
const h = 128;
const w = 196;
const xs = [0, 300, 600, 900];
const card = (i, o) => node({ id: 's' + (i + 1), x: xs[i], y, w, h, eyebrow: 'Step ' + (i + 1), ...o });

export default diagram({
  title: 'First visit',
  subtitle: 'A visitor reaches their first feedback in about two minutes',
  description: 'Four steps: a visitor arrives on a public sub-topic page or the Role Prep home, sets up a plan, answers the first moment from Today, and gets first feedback in under two minutes.',
  width: 1096,
  height: 224,
  legend: [
    { kind: 'plain', label: 'Arrival' },
    { kind: 'step', label: 'Set up' },
    { kind: 'live', label: 'Live practice' },
    { kind: 'good', label: 'First win' },
  ],
  items: [
    card(0, { kind: 'plain', title: 'Visitor arrives', sub: 'S12 public page or S1 home' }),
    card(1, { kind: 'step', title: 'Set up the plan', sub: 'S2 Setup, with a live plan' }),
    card(2, { kind: 'live', title: 'Answer first moment', sub: 'S3 Today, then S5 Practice room' }),
    card(3, { kind: 'good', title: 'First feedback', sub: 'Under 2 minutes from arriving' }),
    edge({ from: 's1', to: 's2', label: 'Set up my prep', kind: 'step', labelXY: [248, 64] }),
    edge({ from: 's2', to: 's3', label: 'plan is ready', kind: 'live', labelXY: [548, 64] }),
    edge({ from: 's3', to: 's4', label: 'Get feedback', kind: 'good', labelXY: [848, 64] }),
  ],
});
