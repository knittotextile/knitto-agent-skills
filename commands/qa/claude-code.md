---
description: "VERIFY stage — run full E2E/manual verification against the real flows a plan touched"
argument-hint: "<path-or-slug> [--run-pending]"
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash, TaskUpdate, Skill, AskUserQuestion]
---

# /qa

Pipeline stage: **VERIFY**. Previous stage `/dev`, next stage `/gate`.

Run the expensive verification pass for `$ARGUMENTS` that `/dev`
deliberately skipped — this is a conscious, separate step, not an automatic
tail of every `/dev` run.

## Steps

1. Resolve `$ARGUMENTS` to the plan file (same resolution as `/dev`).
   Confirm every feature item is already checked off — if not, send the
   user back to `/dev` first, don't verify half-finished work.
2. If `--run-pending` was passed, or more than one plan is sitting with
   feature items done but gates unchecked, ask the user whether to batch
   this verification pass across all of them (same batching judgment as
   [`exec-todo`](../../skills/exec-todo/SKILL.md) Step 3, stack cap 3).
3. Run this repo's actual E2E/manual verification against the real flows
   the plan touched — not just unit tests/type-check (those already ran
   per-item in `/dev`). Use whichever of
   [`e2e-testing`](../../skills/e2e-testing/SKILL.md),
   [`react-testing`](../../skills/react-testing/SKILL.md),
   [`webapp-testing`](../../skills/webapp-testing/SKILL.md), or
   [`api-testing`](../../skills/api-testing/SKILL.md) matches what this
   repo/PB actually is. If the tooling isn't available this session, say so
   explicitly — don't skip silently.
4. Write whatever verification report/artifact this repo's convention
   expects (screenshots, a report file), if any.
5. Clean up test data and any dev processes started for verification.
6. Check off the plan's verification-related closing checklist item(s)
   (not the review item — that's `/gate`) once verification passes. If it
   fails, report the failures and send the user back to `/dev` — don't
   check off a failed verification.

## What this is not

- Not the code-review pass — that's `/gate`, run after this.
- Not for a plan whose feature items aren't all done yet.
