import { diagram, node, edge, group, note } from '../../../scripts/diagram-kit.mjs';

// Hub layout: Today (S3) sits in the middle column and one vertical "spine"
// carries every route that leaves it.
const W = 144;
const H = 80;
const cy = (y) => y + H / 2;

const Y = {
  s12: 176, s1: 176, s2: 464,
  s4: 176, s14: 320, s3: 464, s10: 656,
  s6: 64, s7: 208, s5: 464, s11: 656,
  s9: 64, s8: 320, s13: 464,
};
const X = { s12: 24, s1: 192, s2: 108, daily: 448, l: 736, r: 952, s11: 736 };

const SPINE = 640;
const c3 = cy(Y.s3);

const toSpine = (id, y, kind, label, labelXY, extra = {}) =>
  edge({ from: 's3', to: id, label, kind, fromSide: 'right', toSide: 'right', via: [[SPINE, c3], [SPINE, cy(y)]], labelXY, ...extra });

export default diagram({
  title: 'Site map',
  subtitle: 'Fourteen screens and states in five areas, all reached from Today once you are set up',
  description:
    'Visitors reach Role Prep home or a public sub-topic page, go to Setup, and land on Today. From Today they open Topics, setback states, the Practice room, a mock round, the night-before sheet or their profile. The Practice room opens the microphone notice, the own-AI page and the pass offer. A mock round ends in results that feed back into Today.',
  width: 1120,
  height: 760,
  legend: [
    { kind: 'step', label: 'Set up and daily home' },
    { kind: 'live', label: 'Recording or live practice' },
    { kind: 'good', label: 'Results and review' },
    { kind: 'risk', label: 'Setback or pass offer' },
    { kind: 'plain', label: 'Other screen' },
  ],
  items: [
    group({ x: 0, y: 112, w: 360, h: 168, title: 'Arrive', sub: 'From search or the home' }),
    group({ x: 84, y: 400, w: 192, h: 168, title: 'Set up' }),
    group({ x: 424, y: 112, w: 192, h: 456, title: 'Daily' }),
    group({ x: 424, y: 592, w: 480, h: 168, title: 'Account' }),
    group({ x: 712, y: 0, w: 408, h: 568, title: 'Practise' }),

    node({ id: 's12', x: X.s12, y: Y.s12, w: W, h: H, kind: 'plain', eyebrow: 'S12', title: 'Public sub-topic page' }),
    node({ id: 's1', x: X.s1, y: Y.s1, w: W, h: H, kind: 'plain', eyebrow: 'S1', title: 'Role Prep home' }),
    node({ id: 's2', x: X.s2, y: Y.s2, w: W, h: H, eyebrow: 'S2', title: 'Setup' }),

    node({ id: 's4', x: X.daily, y: Y.s4, w: W, h: H, kind: 'plain', eyebrow: 'S4', title: 'Topics' }),
    node({ id: 's14', x: X.daily, y: Y.s14, w: W, h: H, kind: 'risk', eyebrow: 'S14', title: 'Setback states' }),
    node({ id: 's3', x: X.daily, y: Y.s3, w: W, h: H, eyebrow: 'S3', title: 'Today' }),

    node({ id: 's10', x: X.daily, y: Y.s10, w: W, h: H, kind: 'plain', eyebrow: 'S10', title: 'Progress and data' }),
    node({ id: 's11', x: X.s11, y: Y.s11, w: W, h: H, kind: 'risk', eyebrow: 'S11', title: 'Pass moments' }),

    node({ id: 's6', x: X.l, y: Y.s6, w: W, h: H, kind: 'live', eyebrow: 'S6', title: 'Mock round' }),
    node({ id: 's7', x: X.l, y: Y.s7, w: W, h: H, kind: 'good', eyebrow: 'S7', title: 'Round results' }),
    node({ id: 's5', x: X.l, y: Y.s5, w: W, h: H, kind: 'live', eyebrow: 'S5', title: 'Practice room' }),
    node({ id: 's9', x: X.r, y: Y.s9, w: W, h: H, kind: 'plain', eyebrow: 'S9', title: 'Practise with your own AI' }),
    node({ id: 's8', x: X.r, y: Y.s8, w: W, h: H, kind: 'good', eyebrow: 'S8', title: 'Night-before sheet' }),
    node({ id: 's13', x: X.r, y: Y.s13, w: W, h: H, kind: 'live', eyebrow: 'S13', title: 'Microphone notice' }),

    // Arrive -> Set up -> Today
    edge({ from: 's12', to: 's2', label: 'Set up my prep', kind: 'step', labelXY: [96, 312] }),
    edge({ from: 's1', to: 's2', label: 'Set up my interview prep', kind: 'step', labelXY: [264, 312] }),
    edge({ from: 's2', to: 's3', label: 'plan is ready', kind: 'step' }),
    edge({ from: 's1', to: 's9', label: 'Practise in your own AI', fromSide: 'top', toSide: 'top', via: [[264, 40], [1024, 40]], labelXY: [480, 40] }),

    // The spine out of Today
    toSpine('s4', Y.s4, 'plain', 'browses topics', [SPINE + 12, cy(Y.s4)]),
    toSpine('s14', Y.s14, 'risk', 'missed a day', [SPINE + 12, cy(Y.s14)]),
    edge({ from: 's3', to: 's8', label: 'interview tomorrow', kind: 'good', fromSide: 'right', toSide: 'left', via: [[SPINE, c3], [SPINE, cy(Y.s8)]], labelXY: [800, cy(Y.s8)] }),
    edge({ from: 's3', to: 's6', label: 'mock round', kind: 'live', fromSide: 'right', toSide: 'left', via: [[SPINE, c3], [SPINE, cy(Y.s6)]], labelXY: [688, cy(Y.s6)] }),
    edge({ from: 's3', to: 's5', label: 'Start practice', kind: 'live', fromSide: 'right', toSide: 'left', labelXY: [690, c3] }),
    edge({ from: 's3', to: 's10', label: 'opens profile', fromSide: 'bottom', toSide: 'top', labelXY: [520, 580] }),

    // Mock round loop
    edge({ from: 's6', to: 's7', label: 'round ends', kind: 'good', fromSide: 'bottom', toSide: 'top' }),
    edge({ from: 's7', to: 's3', label: 'weak moments to plan', kind: 'step', dashed: true, fromSide: 'left', toSide: 'top', via: [[696, cy(Y.s7)], [696, 432], [X.daily + W / 2, 432]], labelXY: [608, 432] }),

    // Practice room
    edge({ from: 's5', to: 's13', label: 'Speak', kind: 'live', fromSide: 'right', toSide: 'left', labelXY: [916, c3] }),
    edge({ from: 's5', to: 's9', label: 'copy as prompt', fromSide: 'right', toSide: 'left', via: [[916, c3], [916, cy(Y.s9)]], labelXY: [916, 432] }),
    edge({ from: 's5', to: 's11', label: 'free feedback used up', kind: 'risk', dashed: true, fromSide: 'bottom', toSide: 'top', labelXY: [808, 580] }),

    note({ x: 24, y: 648, w: 340, text: 'Topics and Setback states both lead on to the Practice room (S5).' }),
    note({ x: 928, y: 648, w: 176, text: 'Start speaking and Keep practising free both return to S5.' }),
  ],
});
