import { diagram, node, decision, edge, note } from '../../../scripts/diagram-kit.mjs';

export default diagram({
  title: 'The authoring pipeline',
  subtitle: 'Five agents and two gates; anything that fails goes back to the writer',
  description: 'The lead plans five moments and briefs the writer. Every write passes the validator hook, then the rubric reviewer, then the quality gate, then the AppSec engineer and the AppSec gate, then the publisher opens the release PR. Schema errors, a reviewer fix list and an AppSec block all loop back to the writer.',
  width: 1120,
  height: 632,
  legend: [
    { kind: 'step', label: 'Agent' },
    { kind: 'live', label: 'Validator hook' },
    { kind: 'risk', label: 'Gate' },
    { kind: 'good', label: 'Pass and outcome' },
    { kind: 'stop', label: 'Sent back to the writer' },
  ],
  items: [
    node({ id: 'lead', x: 0, y: 72, w: 176, h: 104, eyebrow: 'Opus 5.5', title: 'roleprep-lead', sub: 'Plans the 5 moments' }),
    node({ id: 'writer', x: 304, y: 72, w: 176, h: 104, eyebrow: 'Sonnet 5.5', title: 'roleprep-writer', sub: 'Writes the sub-topic' }),
    node({ id: 'hook', x: 608, y: 72, w: 176, h: 104, kind: 'live', eyebrow: 'Automatic', title: 'Validator hook', sub: 'Schema check on write' }),
    node({ id: 'reviewer', x: 912, y: 72, w: 176, h: 104, eyebrow: 'Opus 5.5', title: 'rubric-reviewer', sub: 'Blind quality review' }),

    decision({ id: 'gate1', x: 920, y: 328, w: 160, h: 112, title: 'Quality passes?' }),
    node({ id: 'sec', x: 608, y: 332, w: 176, h: 104, eyebrow: 'Sonnet 5.5', title: 'appsec-engineer', sub: 'Pre and post-build check' }),
    decision({ id: 'gate2', x: 312, y: 328, w: 160, h: 112, title: 'AppSec clear?' }),
    node({ id: 'pub', x: 0, y: 332, w: 176, h: 104, eyebrow: 'Haiku 5.5', title: 'roleprep-publisher', sub: 'Catalog, version, PR' }),
    node({ id: 'done', x: 0, y: 520, w: 176, h: 80, kind: 'good', eyebrow: 'Outcome', title: 'Release PR opened' }),

    note({ x: 304, y: 556, w: 600, kind: 'plain', text: 'The validator hook catches schema errors on every write, so the reviewer only judges quality.' }),

    edge({ from: 'lead', to: 'writer', label: 'briefs', kind: 'step' }),
    edge({ from: 'writer', to: 'hook', label: 'every write', kind: 'step' }),
    edge({ from: 'hook', to: 'reviewer', label: 'clean file', kind: 'live' }),
    edge({ from: 'reviewer', to: 'gate1', label: 'verdict', kind: 'step' }),
    edge({ from: 'gate1', to: 'sec', label: 'PASS', kind: 'good' }),
    edge({ from: 'sec', to: 'gate2', label: 'verdict', kind: 'step' }),
    edge({ from: 'gate2', to: 'pub', label: 'PASS', kind: 'good' }),
    edge({ from: 'pub', to: 'done', label: 'opens the PR', kind: 'good' }),

    edge({ from: 'hook', to: 'writer', label: 'schema errors', kind: 'stop', dashed: true, fromSide: 'bottom', toSide: 'bottom', via: [[696, 216], [392, 216]] }),
    edge({ from: 'gate1', to: 'writer', label: 'fix list: rewrite', kind: 'stop', dashed: true, fromSide: 'right', toSide: 'top', via: [[1104, 384], [1104, 32], [392, 32]] }),
    edge({ from: 'gate2', to: 'writer', label: 'BLOCK: fix, re-run', kind: 'stop', dashed: true, fromSide: 'top', toSide: 'bottom' }),
  ],
});
