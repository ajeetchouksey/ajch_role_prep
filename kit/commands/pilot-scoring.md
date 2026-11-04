---
description: Run the blind AI-scoring pilot for a sub-topic (gate 1)
argument-hint: <subtopic id> [candidate models, comma-separated]
---

Run the Role Prep scoring pilot: $ARGUMENTS

Use the `scoring-calibrator` agent with the `scoring-contract` prompt unchanged.
Write results to `pilots/<today>-<subtopic>/` and finish with the gate line:
`Gate 1: PASS with <model>` or `Gate 1: NOT YET — <reason>`. If no real
practice answers exist yet, say the pilot is synthetic.
