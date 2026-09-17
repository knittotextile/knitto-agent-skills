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
4. Address blocking findings before proceeding. If the review finds real
   defects, **write each blocking finding back into the plan's `ISSUES.md`
   as a new unchecked `- [ ]` feature checklist item** (one item per
   defect, worded as the fix to make — e.g. "Fix: secret can leak into
   application log via write/rotate route", not just the finding
   description) before sending the user to `/dev`. This is required, not
   optional: `/dev` calls `exec-todo`, which only acts on unchecked feature
   lines already in the file — if the findings aren't written there,
   `exec-todo` sees every feature item already checked and does nothing,
   leaving the user stuck bouncing between `/gate` and `/dev` with no
   actual fix happening. Insert the new items before the closing checklist
   items (review-dispatch, verification, etc.), and note in each item which
   finding it addresses (severity/category) so `exec-todo`'s implementer
   has the same context the review gave. Non-blocking notes (nits,
   suggestions) don't need to be written back — only blockers that must be
   fixed before `/gate` can pass. Then send the user back to `/dev`, and
   tell them to re-run `/qa` → `/gate` afterward (a code fix can invalidate
   prior verification, not just review).
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
