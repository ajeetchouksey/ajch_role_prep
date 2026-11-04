---
name: roleprep-engineering
description: How the Role Prep app is built — the app/ file map and ownership, rendering (pre-rendered public pages plus the PWA app shell), how content reaches the app, the Worker's API route contracts, the MCP server's tools, and the checks to run. Load before building or reviewing any Role Prep code.
---

# Role Prep engineering

Role Prep is its own app at `roleprep.aaryaai.dev`, built in this repo under
`app/`. The decision and its reasons are in `docs/06-app-architecture.md`.

## Where things live

| Piece | Path in ajch_role_prep | Owner agent |
|---|---|---|
| Content (roleprep@2) | `content/roleprep/` | `roleprep-writer`, released by `roleprep-publisher` |
| Routes (one table) | `app/app/routes.ts` | `roleprep-frontend-engineer` |
| Screens | `app/app/routes/*.tsx` | `roleprep-frontend-engineer` |
| Pure logic (plan, readiness, delivery stats, feedback parse) | `app/app/lib/` with tests | `roleprep-frontend-engineer` |
| Build-time content access | `app/app/lib/content.server.ts` (loaders only) | `roleprep-frontend-engineer` |
| Brand theme | `app/app/app.css` (`@theme` tokens, AaryaAI brand v2) | `roleprep-frontend-engineer`, following `aaryaai-brand` |
| PWA (manifest, service worker caching) | `app/vite.config.ts` → `VitePWA` | `roleprep-frontend-engineer` |
| Worker and API routes | `app/worker/index.ts`, `app/wrangler.jsonc` | `roleprep-backend-engineer` |
| MCP server | `app/worker/mcp/` (served at `/mcp`) | `roleprep-backend-engineer` |
| CI | `.github/workflows/validate.yml` | `roleprep-qa` proposes, the lead approves |

Sign-in and progress sync use the existing AaryaAI sign-in at `api.aaryaai.dev`
(owned by ajch_platform). Changes there go to the platform's owning agent as a
written request.

## Rendering

React Router 7 in framework mode with `ssr: false`:

- **Pre-rendered** (real HTML for search): `/`, `/topics`, `/topics/:topic`,
  `/topics/:topic/:subtopic`. The list comes from `publicPaths()`; their `loader`
  runs at build time and reads `content/roleprep` from the repo.
- **App shell** (`__spa-fallback.html`): `/today`, `/practice/:topic/:subtopic` and
  every other app screen. They use `clientLoader`, never `loader`, and fetch
  `/content/roleprep/**` JSON at runtime.
- The Worker serves assets first; an unmatched page navigation gets the app shell.

Public pages never show strong answers or rubrics: candidates answer before they read.

## How content reaches the app

Same commit, no promotion: `npm run build` copies `content/roleprep` into
`app/public/content/roleprep` and pre-renders from it. A content change ships
when the app is deployed.

## Offline and install

Service worker (Workbox via `vite-plugin-pwa`): app assets precached; page
navigations network-first with cached fallback; `/content/**` stale-while-
revalidate; `/api/**` network-only. Progress is on the device first
(`app/app/lib/progress.ts`), synced when signed in. Every storage call is guarded.

## API routes

| Route | Request | Response | Limits |
|---|---|---|---|
| `GET /api/health` | — | `{ ok, service }` | none |
| `POST /api/transcribe` | audio (≤ 3 min), `level` | `{ text }` | burst, daily, global; audio never stored |
| `POST /api/feedback` | `{ itemId, level, answer, spoken }` | the `scoring-contract` response | same limits plus 3 free feedbacks a day per user; rubric loaded server-side |

Model per task comes from Worker variables (`ROLEPREP_TRANSCRIBE_MODEL`,
`ROLEPREP_FEEDBACK_MODEL`), defaulting to Whisper large v3 turbo and to the
model that passed gate 1. The AI binding is enabled in `wrangler.jsonc` with
the first AI route.

## MCP server (read-only, at /mcp)

| Tool | Input | Returns |
|---|---|---|
| `list_topics` | none | Topics with live sub-topic counts |
| `list_subtopics` | `topicId` | Sub-topics with status |
| `start_practice` | `subtopicId`, `level` | The moments' prompts, no answers or rubrics |
| `get_rubric` | `momentId`, `level` | Rubric, reference answer, follow-ups, for scoring after the answer |
| `mock_interview` | `subtopicId`, `level` | Instructions: one question at a time, wait, score with `get_rubric`, one fix, the follow-up |

`mock_interview` is also exposed as an MCP prompt; some clients only read tools,
so the tool is the reliable path. Streamable HTTP, no login, IP rate limits,
content from the deployed build. Write tools (`record_attempt`) wait for OAuth (RP-9.3).

## Checks before handing over

In `app/`: `npm run typecheck`, `npm run build`, `npm run check` (pre-rendered
pages, app shell, service worker, manifest). Then with the Worker running
(`npx wrangler dev`), `node scripts/smoke.mjs` (needs Playwright via
`PLAYWRIGHT_DIR`). Then `roleprep-qa`, then `appsec-engineer`.
