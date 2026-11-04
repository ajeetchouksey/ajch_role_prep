---
name: roleprep-ux-standard
description: The UX bar every Role Prep screen must pass (six principles with Role Prep tests), the screen inventory with routes, the journey moments including setbacks, and the usability test tasks. Load when designing, prototyping, building or reviewing any Role Prep screen or flow.
---

# Role Prep UX standard

Owner's rule: **UX is approved before it is built.** A screen that would look
the same whatever the candidate did is a defect, even with excellent content.

## The bar

| # | Principle | Role Prep passes when |
|---|---|---|
| 1 | Learner-driven | The candidate picks level, date, topics and minutes a day, and can change any of them later |
| 2 | Visibly reactive | Every choice or answer changes the screen at once: plan, score, readiness, next step |
| 3 | Felt progress | Readiness per sub-topic and level, score change between attempts, days to go |
| 4 | Always a next step | Every screen ends in one specific action ("Try again with this fix") |
| 5 | Real data | Built from real content and the candidate's real attempts; anything else labelled "Example" |
| 6 | Phone width | Works at 360px with the primary action visible and no sideways scroll |

Report reviews as `Bar: 1 ✓ 2 ✗ 3 ✓ 4 ✓ 5 ✓ 6 ✓` plus the single biggest problem.

## Screens

| # | Screen | Route | One job |
|---|---|---|---|
| S1 | Home | `/roleprep` | Show the three-level difference in 30 seconds; start setup |
| S2 | Setup | `/roleprep/setup` | Level, date, topics, minutes; live plan with fixes when it doesn't fit |
| S3 | Today | `/roleprep/today` | Today's practice, plan strip, readiness, days to go |
| S4 | Topics | `/roleprep/topics` | Practise anything, plan topics first |
| S5 | Practice room | `/roleprep/:topic/:subtopic` | Answer, feedback, retry with one fix |
| S6 / S7 | Mock round, results | `/roleprep/mock` | Timed, no hints, follow-ups; weak moments back into the plan |
| S8 | Night-before | `/roleprep/review` | One page, weakest first |
| S9 | Your own AI | `/roleprep/own-ai` | Connect Claude, VS Code or Cursor in a minute; copy as prompt |
| S10 | Progress and data | `/profile/roleprep` | History, sync, delete |
| S11 | Pass moments | in context | Offer the pass at the free cap; "keep practising free" always beside it |
| S12 | Public sub-topic page | `/roleprep/learn/:topic/:subtopic` | Search landing: one moment at three levels |
| S13 | Microphone notice | modal | Audio is never stored; typing is always available |
| S14 | Setback states | on S3 and S5 | Missed day, score dropped, stuck after 3 tries, quota, interview tomorrow |

The reference prototype is `prototypes/role-prep-practice.html`.

## Journey moments

Arrive → set up → **first feedback within about 2 minutes** → daily loop →
**setback** → mock round → night before → interview day → after. A design that
skips the setback is incomplete; that is where people quit.

## Usability test tasks (five candidates: 2 Tech, 2 Tech Lead, 1 Leadership)

1. Set up prep for an interview in 10 days: plan fits, under 2 minutes, no help.
2. Answer the first moment out loud and get feedback: first feedback within 2 minutes of arriving.
3. Improve a score using the fix: second attempt higher, and they can say why.
4. Recover from a missed day: they find what to do without asking.
5. Connect Role Prep to Claude: a mock interview running within 5 minutes.

Close with: did the feedback feel fair, and would you come back tomorrow?
