---
name: rubric-craft
description: How to write Role Prep rubric points, weak answers and follow-ups that an examiner (human or AI) can score from a transcript. Load when writing or reviewing rubrics, or when AI scoring disagrees with human scoring.
---

# Rubric craft

The rubric is what AI feedback scores against, so a vague rubric produces vague,
generous feedback. Every point must be checkable from what the candidate said.

## A good rubric point

- **Names one observable act:** "Separated recall from ranking", "Set a measurable target and date".
- **Can be marked covered, partly or missed** by someone reading the transcript, without guessing.
- **Matches the strong answer:** the strong answer earns every point.
- **Belongs to the level** (see `level-voice`).

| Fails | Why | Passes |
|---|---|---|
| Communicates clearly | Not observable from content | Gives a structure: diagnose, fix, measure |
| Understands RAG | Not a single act | Says a reranker can't fix missing documents |
| Considers cost | Too loose to mark | Mentions the latency cost of reranking |
| Shows leadership | Not checkable | Sets success criteria before building |

## How many

3 to 6 per view. Fewer than 3 can't separate a middling answer from a strong
one; more than 6 turns feedback into a checklist nobody remembers.

## Partial credit

Write points so "partly" has a natural meaning: "Named a metric for each stage"
is partly covered when one stage has a metric. Avoid compound points ("X and Y
and Z"); split them.

## Weak answers

A weak answer is what a real, prepared but not-yet-ready candidate says. It
sounds reasonable and loses for one stated reason (`weakWhy`): no diagnosis,
no metric, deciding by opinion, no interim risk plan. Never a strawman.

## Follow-ups

The next question a sharp interviewer asks after a decent answer: push on the
trade-off, the edge case or the number. "The right chunk isn't in your top 50.
Now what?" Not a new topic.

## When AI and human scores disagree

Rewrite the rubric point before blaming the model. The usual causes are a
compound point, a point the strong answer doesn't earn, or a point that needs
judgement ("good reasoning") instead of an observable act.
