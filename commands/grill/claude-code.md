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
2. **Check for triviality first.** If `$ARGUMENTS` is a bug, send the user
   to [`guides/bug-fix-flow.md`](../../guides/bug-fix-flow.md) instead —
   this pipeline isn't for bugs. If it's not a bug but genuinely small (scope
   fits in one-two sentences, touches ~1-2 files, no new endpoint/schema,
   no real design decision) — say so and point to
   [`guides/small-change-flow.md`](../../guides/small-change-flow.md)
   instead of grilling it into a full PRD+ISSUES pair; `prd-grill` itself
   declines "trivial one-line tasks that don't need a written plan," and
   this pipeline's other commands (`/dev`, `/qa`, `/gate`, `/promote`) all
   require a plan file to resolve their argument against, so forcing a
   trivial PB through here just produces paperwork nobody needed. If
   genuinely unsure whether it's trivial, ask the user rather than
   guessing either way.
3. Decide whether this PB already has a BRD (written by a business/system
   analyst — pasted text or an attached file) that needs to be read and
   understood first, or can go straight to implementation planning:
   - Has a BRD: invoke the [`brd-reader`](../../skills/brd-reader/SKILL.md)
     skill on `$ARGUMENTS`. It hands off to `prd-grill` itself once the BRD
     is confirmed understood (its own Step 4) — let that handoff happen,
     don't invoke `prd-grill` again separately. Note: `brd-reader` never
     authors a new BRD — if the PB has no BRD at all, that's not this path.
   - No BRD exists: invoke [`prd-grill`](../../skills/prd-grill/SKILL.md)
     directly on `$ARGUMENTS`.
   - If unclear which applies, ask the user rather than assuming.
4. If `$ARGUMENTS` looks like `refine <slug>`, pass that through as-is to
   whichever skill owns the existing doc (check `docs/prd/todo|done/<slug>/`
   and any BRD location for which exists).
5. When the invoked skill finishes, report the exact file path(s) written
   (BRD.md and/or PRD.md + ISSUES.md) and tell the user to run `/dev
   <slug>` next.

## What this is not

- Not the place to write code — both `brd-reader` and `prd-grill` only write
  planning documents.
- Not for a PB that already has a confirmed, still-open PRD+ISSUES pair —
  that goes straight to `/dev`, this command is for defining/refining the
  plan, not re-deriving one that already exists.
