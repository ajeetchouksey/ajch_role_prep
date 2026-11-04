import { diagram, node, edge } from '../../../scripts/diagram-kit.mjs';

const y = 24;
const h = 128;
const w = 196;
const xs = [0, 300, 600, 900];
const card = (i, o) => node({ id: 's' + (i + 1), x: xs[i], y, w, h, eyebrow: 'Step ' + (i + 1), ...o });

export default diagram({
  title: 'Setback',
  subtitle: 'A missed day rolls forward; three failed tries lead to a lesson',
  description: 'Four steps: the candidate misses a day, Today shows the moved work, the candidate tries a moment three times without getting it ready, and is sent to the matching lesson instead of a fourth try.',
  width: 1096,
  height: 224,
  legend: [
    { kind: 'risk', label: 'Setback' },
    { kind: 'step', label: 'Recovery on Today' },
    { kind: 'good', label: 'Way forward' },
  ],
  items: [
    card(0, { kind: 'risk', title: 'Candidate misses a day', sub: 'The plan would normally slip' }),
    card(1, { kind: 'step', title: 'Today shows moved work', sub: 'S3 Today, still on track' }),
    card(2, { kind: 'risk', title: 'Three tries, not ready', sub: 'S5 Practice room, S14 state' }),
    card(3, { kind: 'good', title: 'Open the lesson', sub: 'Matching SkillUp or HOL Labs link' }),
    edge({ from: 's1', to: 's2', label: 'rolls forward', kind: 'step', labelXY: [248, 64] }),
    edge({ from: 's2', to: 's3', label: 'Start practice', kind: 'risk', labelXY: [548, 64] }),
    edge({ from: 's3', to: 's4', label: 'needs learning', kind: 'good', labelXY: [848, 64] }),
  ],
});
