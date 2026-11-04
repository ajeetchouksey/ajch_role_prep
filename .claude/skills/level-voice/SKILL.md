---
name: level-voice
description: How the same interview question is asked and answered differently at Tech, Tech Lead and Leadership level, with a worked example. Load whenever writing or reviewing the three level views of a Role Prep moment, or judging an answer's level fit.
---

# Level voice

Role Prep's core promise is a separate bar for each interview level. A level is
not a harder or longer version of the same answer; each level is judged on a
different thing.

## What each level is judged on

| | Tech | Tech Lead | Leadership |
|---|---|---|---|
| The interviewer wants to know | Can you build it and explain how it works? | Can you make the call and bring the team with you? | Can you turn this into outcomes the business trusts? |
| Answers centre on | Mechanism, trade-offs in the design, metrics per component | Evidence before deciding, success criteria agreed up front, rollout, team practice, regression gates | Impact in business terms, risk while fixing, cost and effort, one headline number, reporting rhythm |
| Good vocabulary | recall@50, cross-encoder, p95 latency, re-index | failure analysis, latency budget, behind a flag, CI gate, owner | wrong answers cost us, target by date, baseline, monthly audit, no new licence |
| Typical red flags | "It just works better", no metric, no latency cost | Deciding by opinion or seniority, no budget, no plan for regressions | Jargon untranslated, no target, ignoring interim risk, only good news |
| How the question is phrased | "When would you add a reranker?" | "Your team wants a reranker. How do you decide it's worth it?" | "Customers say the assistant quotes the wrong policy. What do you need to approve the fix?" |

## Rules

1. **Rephrase the question for the level**, as that interviewer would ask it.
   The underlying decision stays the same.
2. **Change the substance, not the vocabulary.** Swapping "nDCG" for "quality"
   doesn't make a Leadership answer. A Leadership answer is about cost,
   risk and a number the business tracks.
3. **Keep each level self-contained.** A Leadership answer must not need the
   Tech answer to make sense.
4. **Rubrics differ too.** A Tech rubric checks mechanism; a Leadership rubric
   checks impact, interim risk and reporting.
5. **Follow-ups match the level.** Tech: "How would you cut the reranker's latency?"
   Lead: "Precision is up 8% but p95 rose 0.4s. Ship?" Leadership: "The fix only
   gets us to 6%. Is that good enough?"

## Level-fit verdicts used in feedback

`right`, `too-technical` (a Lead or Leadership answer drowning in mechanism),
`too-shallow` (a Tech answer with no mechanism), `too-vague` (no specifics at
any level). The scoring contract uses exactly these four values.
