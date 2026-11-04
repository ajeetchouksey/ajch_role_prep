import { diagram, node, edge } from '../../../scripts/diagram-kit.mjs';

const y = 24;
const h = 128;
const w = 196;
const xs = [0, 300, 600, 900];
const card = (i, o) => node({ id: 's' + (i + 1), x: xs[i], y, w, h, eyebrow: 'Step ' + (i + 1), ...o });

export default diagram({
  title: 'Mock round',
  subtitle: 'A timed round feeds its weakest moments back into the plan',
  description: 'Four steps: start a mock round from Today, answer timed mixed moments with no hints, see the score and the weakest three on the results screen, and add those moments to the plan for the next day.',
  width: 1096,
  height: 224,
  legend: [
    { kind: 'step', label: 'Daily home and plan' },
    { kind: 'live', label: 'Timed round' },
    { kind: 'good', label: 'Results' },
  ],
  items: [
    card(0, { kind: 'step', title: 'Start from Today', sub: 'S3 Today' }),
    card(1, { kind: 'live', title: 'Timed mixed moments', sub: 'S6 Mock round, no hints' }),
    card(2, { kind: 'good', title: 'Score and weakest three', sub: 'S7 Round results' }),
    card(3, { kind: 'step', title: 'Tomorrow\'s plan updated', sub: 'Weak moments added' }),
    edge({ from: 's1', to: 's2', label: 'mock round', kind: 'live', labelXY: [248, 64] }),
    edge({ from: 's2', to: 's3', label: 'round ends', kind: 'good', labelXY: [548, 64] }),
    edge({ from: 's3', to: 's4', label: 'Add to plan', kind: 'step', labelXY: [848, 64] }),
  ],
});
