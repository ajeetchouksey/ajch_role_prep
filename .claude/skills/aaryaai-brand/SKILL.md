---
name: aaryaai-brand
description: AaryaAI brand v2 as it applies to Role Prep — tokens, type, the Role Prep extension (accent pair, status colours, interviewer voice), motion and microcopy. Load before designing a screen or prototype, writing UI copy, or making any visual (OG card, README header).
---

# AaryaAI brand for Role Prep

Source of truth: `ajch_food_for_thoughts/brand/BRAND.md` (v2, mark "6a").
The shared package `ajch_brand` (`@aaryaai/brand`) is still on v1 (Inter,
violet/sky) and is being updated; until then, use the v2 values below.
Rule: **one brand, extended per vertical, never forked.** Role Prep adds meaning
to existing colours; it never adds a hex.

## Tokens

| Token | Value | Use |
|---|---|---|
| ink | #14122B | Text and dark grounds |
| indigo | #5B4BD6 | The one primary action per screen; a fill, not a text colour on light |
| indigo-deep | #4C3FBD | Accent text on light grounds |
| lilac | #A99BFF | Accent on dark grounds only |
| tint | #F0EDFF | Tinted panels |
| paper | #F2F2F3 | Light page ground |
| app ground | #0e1a2d | Dark app ground (default theme) |

Type: **Barlow Condensed 600** for headings and labels (labels uppercase,
0.12 to 0.24em tracking); **Barlow 400/500** for body at 16 to 18px, line
height 1.55; a monospace for numbers, timers and code, with tabular figures.

## Role Prep extension

| Meaning | Colour | Rule |
|---|---|---|
| Primary action | indigo | One per screen |
| Live state: listening, running timer, follow-up probe | sky (`--aarya-accent-2`) | Only while live |
| Rubric covered / partly / missed | emerald / amber / rose | Always with the word, never colour alone |
| Interview level | none | Shown by name and place in the level switch |

**Interviewer voice:** what the interviewer says is set in Barlow Condensed 600
at 24 to 30px, in a quiet bubble. Coaching text is Barlow body.

**Motion:** one moment per screen (timer fill, speaking pulse, score count-up);
all of it off under reduced motion. No bouncing, spinning or looping.

**Logo:** never redraw or recolour the mark. README header: stacked lockup at
180px, centred. Inner pages and slides: solid mark at 24px in a corner.

## Microcopy

- Talk like a coach: "You dropped the regression gate", not "Rubric item 4 unmet".
- Buttons say what happens: "Try again with this fix", not "Retry".
- Errors say what to do: "Microphone blocked. Type your answer instead."
- Never present readiness as a credential; it is practice progress.
- Label invented content "Example" until it is the candidate's own.
