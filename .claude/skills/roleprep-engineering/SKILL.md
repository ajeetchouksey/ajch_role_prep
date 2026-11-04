---
name: roleprep-engineering
description: How Role Prep is built across repos — where content is served from, the web-app file map and ownership rules in ajch_platform, the Worker route contracts, and the MCP server's tools. Load before building or reviewing any Role Prep code.
---

# Role Prep engineering

## Where things live

| Piece | Repo and path | Owner agent |
|---|---|---|
| Content (roleprep@2) | `ajch_role_prep/content/roleprep/` | `roleprep-writer`, released by `roleprep-publisher` |
| Screens | `ajch_platform/src/features/roleprep/` | `roleprep-frontend-engineer` |
| Pure logic (plan, readiness, delivery stats, feedback parse) | `ajch_platform/src/lib/roleprep/` with Vitest tests | `roleprep-frontend-engineer` |
| Shared UI primitives | `ajch_platform/src/components/ui/` | Platform Design Systems Engineer only |
| Routes | `ajch_platform/src/app/router.tsx` | Platform Engineer only |
| Worker routes | `ajch_platform/workers/subscribe.ts` | `roleprep-backend-engineer` |
| MCP server | `ajch_platform/workers/mcp/` (`aarya-mcp`) | `roleprep-backend-engineer` |
| CI, version, changelog | `ajch_platform/.github/`, `package.json` | Platform SRE only |

## How content reaches the app

`ajch_role_prep` is promoted at a pinned commit by `ajch_platform`'s
`promote-content.yml` (vertical `roleprep`). The app reads
`content-manifest.json` and fetches from jsDelivr at that commit. Until
cutover, the loader falls back to the old `public/content/interviews/` path.
Never edit content inside `ajch_platform`.

## Worker routes

| Route | Request | Response | Limits |
|---|---|---|---|
| `POST /roleprep/transcribe` | audio (≤ 3 min), `level` | `{ text }` | Mentor pattern: burst, daily, global; audio never stored |
| `POST /roleprep/feedback` | `{ itemId, level, answer, spoken }` | the `scoring-contract` response | Same limits plus 3 free feedbacks a day per user; rubric loaded server-side |

Model per task comes from Worker variables (`ROLEPREP_TRANSCRIBE_MODEL`,
`ROLEPREP_FEEDBACK_MODEL`), defaulting to Whisper large v3 turbo and to the
model that passed gate 1.

## MCP server (read-only)

| Tool | Input | Returns |
|---|---|---|
| `list_topics` | none | Topics with live sub-topic counts |
| `list_subtopics` | `topicId` | Sub-topics with status |
| `start_practice` | `subtopicId`, `level` | The moments' prompts, no answers or rubrics |
| `get_rubric` | `momentId`, `level` | Rubric, reference answer, follow-ups, for scoring after the answer |
| `mock_interview` | `subtopicId`, `level` | Instructions: one question at a time, wait, score with `get_rubric`, one fix, the follow-up |

`mock_interview` is also exposed as an MCP prompt; some clients only read tools,
so the tool is the reliable path. Streamable HTTP, no login, IP rate limits,
content read from the promoted commit. Write tools (`record_attempt`) wait for
OAuth (RP-9.3).

## Checks before handing over

`npx tsc -b --noEmit`, `npm run lint` (`--max-warnings=0`), `npm run test -- --run`;
for workers, `npx tsc -p tsconfig.worker.json --noEmit`. Then `roleprep-qa`, then `appsec-engineer`.
