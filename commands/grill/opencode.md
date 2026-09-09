---
description: "DEFINE stage — turn a Product Backlog item into a BRD and/or PRD+ISSUES via iterative Q&A"
agent: build
---

Pipeline stage: DEFINE. Next stage is /dev.

Turn the Product Backlog item "$ARGUMENTS" into a written, confirmed plan
before any code gets touched.

1. If no argument was given, ask which PB/topic this is for — don't guess.
2. Decide whether this PB needs a formal BRD first (business requirement
   docs, process/UI/data-dictionary impact worth capturing) or can go
   straight to implementation planning:
   - Needs BRD: call the "brd-grill" skill (`skill({ name: "brd-grill" })`)
     on "$ARGUMENTS". It hands off to prd-grill itself once the BRD is
     confirmed — let that handoff happen, don't call prd-grill again
     separately.
   - Skips BRD: call the "prd-grill" skill (`skill({ name: "prd-grill" })`)
     directly on "$ARGUMENTS".
   - If unclear which applies, ask the user rather than assuming.
3. If "$ARGUMENTS" looks like `refine <slug>`, pass that through as-is to
   whichever skill owns the existing doc.
4. When the invoked skill finishes, report the exact file path(s) written
   (BRD.md and/or PRD.md + ISSUES.md) and tell the user to run /dev next.

Not the place to write code — both skills only write planning documents.
Not for a PB that already has a confirmed, still-open PRD+ISSUES pair —
that goes straight to /dev.
