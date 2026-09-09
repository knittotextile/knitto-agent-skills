---
description: "DEFINE stage — turn a Product Backlog item into a BRD and/or PRD+ISSUES via iterative Q&A"
argument-hint: "[nama PB atau topik] | refine <slug>"
allowed-tools: [Skill, Read, Glob, Grep]
---

# /grill

Pipeline stage: **DEFINE**. Next stage is `/dev`.

Turn the Product Backlog item `$ARGUMENTS` into a written, confirmed plan
before any code gets touched.

## Steps

1. If `$ARGUMENTS` is empty, ask which PB/topic this is for — don't guess.
2. Decide whether this PB needs a formal BRD first (business requirement
   docs, process/UI/data-dictionary impact worth capturing) or can go
   straight to implementation planning:
   - Needs BRD: invoke the [`brd-grill`](../../skills/brd-grill/SKILL.md)
     skill on `$ARGUMENTS`. It hands off to `prd-grill` itself once the BRD
     is confirmed (its own Step 5) — let that handoff happen, don't invoke
     `prd-grill` again separately.
   - Skips BRD: invoke [`prd-grill`](../../skills/prd-grill/SKILL.md)
     directly on `$ARGUMENTS`.
   - If unclear which applies, ask the user rather than assuming.
3. If `$ARGUMENTS` looks like `refine <slug>`, pass that through as-is to
   whichever skill owns the existing doc (check `docs/prd/todo|done/<slug>/`
   and any BRD location for which exists).
4. When the invoked skill finishes, report the exact file path(s) written
   (BRD.md and/or PRD.md + ISSUES.md) and tell the user to run `/dev
   <slug>` next.

## What this is not

- Not the place to write code — both `brd-grill` and `prd-grill` only write
  planning documents.
- Not for a PB that already has a confirmed, still-open PRD+ISSUES pair —
  that goes straight to `/dev`, this command is for defining/refining the
  plan, not re-deriving one that already exists.
