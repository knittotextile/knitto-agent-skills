---
description: "REVIEW stage — dispatch the review/QA-gate pass and check off the plan's review closing item"
argument-hint: "<path-or-slug> [--run-pending]"
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash, TaskUpdate, Skill, AskUserQuestion]
---

# /gate

Pipeline stage: **REVIEW**. Previous stage `/qa`, next stage `/promote`.

Dispatch the review pass for `$ARGUMENTS` — the other half of
[`exec-todo`](../../skills/exec-todo/SKILL.md)'s closing gates,
deliberately separated from `/qa` so review and verification can be run (or
batched) independently.

## Steps

1. Resolve `$ARGUMENTS` to the plan file. Confirm `/qa` already passed for
   it (its verification closing item is checked) — if not, send the user to
   `/qa` first; don't review before verification is settled, since review
   findings on unverified work are often moot.
2. If `--run-pending` was passed, or multiple plans are sitting verified
   but unreviewed, offer to batch the review pass across them (same stack
   cap of 3 as `exec-todo` Step 3) — one review call covering every plan in
   the batch rather than one call per plan.
3. Dispatch the review:
   - Use this repo's [`reviewer`](../../agents/reviewer/) agent if one
     exists.
   - Otherwise invoke [`code-review-and-quality`](../../skills/code-review-and-quality/SKILL.md)
     directly.
   - If the PB touches auth, data handling, or anything security-sensitive,
     also run [`security-review`](../../skills/security-review/SKILL.md).
4. Address blocking findings before proceeding — loop back to `/dev` for
   fixes if the review finds real defects, then re-run this command.
5. Once findings are addressed or accepted, check off the plan's
   review-related closing checklist item(s) for each plan in the batch that
   passed. A batched review can pass one plan and fail another — check off
   per-plan, not the whole batch at once.
6. For each plan that just passed fully (every closing checklist item now
   checked): commit any outstanding changes, then move its plan file from
   `todo/` to `done/` (per
   [`prd-grill`'s output conventions](../../skills/prd-grill/references/output-conventions.md))
   and fix any relative links in it or pointing to it. This happens here,
   not in `/promote` — the plan counts as "done" once verified and
   reviewed, independent of when the branch/release side actually ships.

## What this is not

- Not the verification pass — that's `/qa`, already done before this runs.
- Not a way to skip fixing blocking findings to move faster.
