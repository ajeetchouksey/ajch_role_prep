# Role Prep docs

> The decisions behind Role Prep, in the order to read them: why it exists, who
> it serves, what we build, how it looks, and how the repo and agents deliver it.
>
> Status: Draft · Updated: 2026-11-04 · Owner: Ajeet Chouksey

## Reading order

| # | Doc | Answers |
|---|---|---|
| 01 | [Business case and value proposition](01-business-case.md) | Why build Role Prep, for whom, and why it wins against what candidates use today |
| 02 | [Use cases](02-use-cases.md) | Who uses it, for which jobs, and the journey a candidate takes |
| 03 | [Epic, features and stories](03-epic-features-stories.md) | What we build, in which phase and gate, with acceptance criteria |
| 04 | [UX and UI plan](04-ux-ui-plan.md) | How every feature looks and behaves: screens, flows, states and brand |
| 05 | [Repo, brand and agent kit plan](05-repo-brand-agent-kit-plan.md) | Where content, code and agents live, and how the authoring pipeline runs |
| 06 | [App architecture](06-app-architecture.md) | How the Role Prep app is built, hosted and installed: static pages plus a PWA |

Each doc builds on the ones before it, so a newcomer can read top to bottom.

## See it working

- [Role Prep practice prototype](https://claude.ai/artifact/2M4U1TkwGxn3Ddpuo95rGq): the
  full multi-screen flow on one sub-topic, RAG → Hybrid search and reranking.
  Covers setup, today's plan, practice with speak-your-answer and AI feedback,
  mock interview, results, review and bring-your-own-AI.
- [Role Prep agent kit map](https://claude.ai/artifact/K6qGK5V4tgPApQWqiia2aq): every
  agent, skill, command and hook in `.claude/`, and how they call each other.

## Writing a doc

Use `/doc <name or link>` or the `roleprep-docs-writer` agent. The rules are in
[`docs-standard`](../.claude/skills/docs-standard/SKILL.md), rendered from ajch_agent_framework,
and `npm run docs` checks names, headings, links and diagrams.
