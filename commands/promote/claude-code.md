---
description: "SHIP stage — promote a fully-gated plan through branch sync/promotion and close it out"
argument-hint: "<path-or-slug>"
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash, TaskUpdate, Skill, AskUserQuestion]
---

# /promote

Pipeline stage: **SHIP**. Previous stage `/gate`. Last stage — nothing
follows this.

Ship `$ARGUMENTS` and close out its plan file, now that `/qa` and `/gate`
have both passed.

## Steps

1. Resolve `$ARGUMENTS` to the plan file. Confirm every closing checklist
   item is checked (feature items from `/dev`, verification from `/qa`,
   review from `/gate`) — if anything is still open, say which stage to run
   first instead of proceeding.
2. Branch/release flow: invoke [`branching`](../../skills/branching/SKILL.md)
   `promote <slug>` if this repo uses the paired feature-branch +
   long-lived releases/* model (its own Step 0 detects this) — this opens
   the production PR and checks whether a separate `releases/main` push is
   needed to actually deploy.
3. If this repo instead uses a different deploy convention (plain
   GitHub Flow, trunk-based, or a documented CI pipeline), use
   [`deployment`](../../skills/deployment/SKILL.md) for the actual release
   steps instead of `branching`.
4. Once live: move the plan file from `todo/` to `done/` (per
   [`prd-grill`'s output conventions](../../skills/prd-grill/references/output-conventions.md))
   and fix any relative links in it or pointing to it. This step is exactly
   as mandatory as the deploy step itself — a shipped feature whose plan
   file is still sitting in `todo/` is an incomplete close-out.
5. Offer to clean up the merged feature branches (ask first, don't delete
   unilaterally — see `branching`'s own cleanup step).

## What this is not

- Not a way to bypass `/qa` or `/gate` to ship faster — refuse to promote a
  plan with open verification or review items, and say so plainly.
- Not for shipping more than one plan file per invocation.
