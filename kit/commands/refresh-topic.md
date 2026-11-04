---
description: Check a topic's live sub-topics for outdated facts and list what to update
argument-hint: <topic-id>
---

Check Role Prep topic `$ARGUMENTS` for content that has gone out of date.

Use the `roleprep-lead` agent:

1. For each live sub-topic in `content/roleprep/topics/$ARGUMENTS/index.json`, list every product name, limit, price, API or version claim in its moments.
2. Check each claim against a current official source; open the page and note its URL.
3. Report a table: moment, level, claim, still true (yes, no, unsure), source, suggested change.
4. Change no files. If anything is out of date, finish with the exact `/new-subtopic`-style brief the writer would need to fix it.
