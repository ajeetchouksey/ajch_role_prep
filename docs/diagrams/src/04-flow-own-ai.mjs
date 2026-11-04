import { diagram, node, edge } from '../../../scripts/diagram-kit.mjs';

const y = 24;
const h = 128;
const w = 196;
const xs = [0, 300, 600, 900];
const card = (i, o) => node({ id: 's' + (i + 1), x: xs[i], y, w, h, eyebrow: 'Step ' + (i + 1), ...o });

export default diagram({
  title: 'Own AI',
  subtitle: 'From "I use Claude" to a mock interview in about a minute',
  description: 'Four steps: open Practise with your own AI from the Role Prep home, pick Claude, VS Code or Cursor, paste the server URL into connector settings, then run the first prompt for a mock interview in your own AI.',
  width: 1096,
  height: 224,
  legend: [
    { kind: 'plain', label: 'Role Prep screen' },
    { kind: 'step', label: 'Own-AI page' },
    { kind: 'live', label: 'In your own AI' },
  ],
  items: [
    card(0, { kind: 'plain', title: 'Open Role Prep', sub: 'S1 Role Prep home' }),
    card(1, { kind: 'step', title: 'Pick your tool', sub: 'S9: Claude, VS Code or Cursor' }),
    card(2, { kind: 'live', title: 'Paste the server URL', sub: 'In your connector settings' }),
    card(3, { kind: 'live', title: 'Mock interview', sub: 'Run the first prompt in your AI' }),
    edge({ from: 's1', to: 's2', label: 'Own AI', kind: 'step', labelXY: [248, 64] }),
    edge({ from: 's2', to: 's3', label: 'Copy URL', kind: 'live', labelXY: [548, 64] }),
    edge({ from: 's3', to: 's4', label: 'First prompt', kind: 'live', labelXY: [848, 64] }),
  ],
});
