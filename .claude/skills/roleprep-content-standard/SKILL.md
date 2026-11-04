---
name: roleprep-content-standard
description: The roleprep@2 content format and the rules every Role Prep file must meet — catalogue, topic index, sub-topic and the four moment kinds with their required fields per level. Load before writing, reviewing, validating or publishing any file under content/roleprep/.
---

# Role Prep content standard (roleprep@2)

Role Prep is interview practice for AI roles. Content is organised as
**topic → sub-topic → ordered moments**, and every moment carries a separate
view for each interview level: `tech`, `lead`, `leadership`.

`scripts/validate-content.mjs` enforces the structural rules below and
`scripts/check-options.mjs` the pushback giveaway rules. If you change a rule
here, change the script in the same commit.

## Files

```
content/roleprep/
├── catalog.json                         # schema roleprep-catalog@2
└── topics/<topic>/
    ├── index.json                       # schema roleprep-topic@2
    └── <subtopic>.json                  # schema roleprep-subtopic@2, one per live sub-topic
```

- IDs are lowercase-hyphenated (`hybrid-search-reranking`). A sub-topic's `id` is `<topic>.<subtopic>`.
- A sub-topic is `planned` (`file: null`) or `live` (`file` points to its JSON, which must exist).
- Every file under `topics/` must be listed; the validator flags strays.
- `content/roleprep/examples/` holds the archived job-ad packs. Read-only.

## Sub-topic file

| Field | Rule |
|---|---|
| `schema`, `schemaVersion` | `"roleprep-subtopic@2"`, `2` |
| `id`, `topicId`, `title` | as above |
| `contentVersion` | `x.y.z`; patch for fixes, minor for new moments |
| `updatedAt` | `YYYY-MM-DD` |
| `taxonomyIds` | 2 to 8 concept IDs from the platform taxonomy (`content/roleprep/related/catalog.json` → `taxonomy`), most specific first. They drive the automatic links to the rest of AaryaAI |
| `links` | Hand-picked links that always show first: `{ skillup: ["ab100:d2"], useCases: ["policy-qa-rag"], blog: ["slug"], holLabs: ["lab-id"] }`. IDs must exist on aaryaai.dev; pick one only when it is clearly the best place to close a gap |
| `moments` | 3 to 8, in practice order; at least one question, one pushback and one challenge |

## Moment kinds and required fields (every level)

| Kind | Purpose | Fields |
|---|---|---|
| `know-cold` | The 60-second answer to an opener | `asked`, `points` (3 to 5), `short` (≤ 140 words) |
| `question` | A real interview question | `asked`, `testing`, `structure` (3 to 5), `strong` (≤ 180 words), `weak`, `weakWhy`, `followUps` (1 to 4), `flags` (1 to 5), `say` (1 to 4), `avoid` (1 to 4), `rubric` (3 to 6) |
| `pushback` | The interviewer challenges your answer | `line`, `context`, `options` (exactly 3: `text`, `verdict` strong / weak / partial, `why`; one strong), `takeaway` |
| `challenge` | A scenario to work through | moment-level `scenario`; per level `asked`, `frame` (3 to 5), `rubric` (3 to 6), `model` (≤ 200 words), `followUp` |

The level-defining text (`short`, `strong`, `line`, `model`) must differ at each
level. The validator rejects identical text; the reviewer rejects reworded copies.

## Links to the rest of AaryaAI

Every live sub-topic shows "Go deeper on AaryaAI" (public page) and "Close the gap"
(practice room, after a missed rubric point): up to 3 SkillUp notes, labs, use cases
and blog posts. `scripts/build-related.mjs` ranks items by the taxonomy concepts they
share with the sub-topic (and, at half weight, its topic), rarer concepts counting
more, hand-picked `links` first. It writes `content/roleprep/related/links.json`.

- After changing `taxonomyIds` or `links`, run `node scripts/build-related.mjs` (the
  write hook does this too) and read the result: every item should help someone who
  missed a rubric point in this sub-topic. If one doesn't, tighten `taxonomyIds`
  rather than adding more.
- Unknown taxonomy IDs and links to items not on aaryaai.dev fail the check.
- `node scripts/build-related.mjs --fetch` refreshes the snapshot of the other
  verticals at the commits aaryaai.dev serves; the publisher runs it before each release.

## Writing rules (checked by the reviewer)

1. Each moment tests **one decision**, named in the lead's plan.
2. Strong answers are spoken: first person, about 2 minutes, no lists, specific numbers where the decision needs them.
3. Rubric points are checkable from a transcript (see `rubric-craft`).
4. Wrong answers lose for a reason a real interviewer would give (see `moment-craft`).
5. Facts that change (product names, limits, prices) come from an opened source, never memory.
6. Plain text only: no Markdown, HTML or emoji inside fields.

## Catalogue

`catalog.json` lists levels (`tech`, `lead`, `leadership`, in that order), the
four kinds with timer targets, every topic with its `indexFile`, and a
`changelog` (newest first). `scripts/build-catalog.mjs` fills each topic's
`subtopics` and `live` counts.
