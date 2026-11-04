---
description: Prepare a Role Prep content release and open the release PR
argument-hint: [one-line summary of what changed]
---

Prepare a Role Prep content release. Summary: $ARGUMENTS

Use the `roleprep-publisher` agent. It stops if the validators fail. It never
edits moment text, never pushes to `main` and never promotes; after the PR is
merged, promotion runs from `ajch_platform` (`promote-content.yml`, vertical
`roleprep`, the merge commit).
