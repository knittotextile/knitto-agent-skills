Pipeline stage: REVIEW. Previous stage /qa, next stage /promote.

Dispatch the review pass for the plan named in whatever text follows this
command — the other half of the closing gates, deliberately separated
from /qa so review and verification can be run (or batched) independently.

1. Resolve the argument to the plan file. Confirm /qa already passed for
   it (its verification closing item is checked) — if not, send the user
   to /qa first; don't review before verification is settled.
2. If "--run-pending" was passed, or multiple plans are sitting verified
   but unreviewed, offer to batch the review pass across them (stack cap
   of 3) — one review call covering every plan in the batch.
3. Dispatch the review: apply the `code-review-and-quality` skill's
   instructions (`.cursor/skills/code-review-and-quality/SKILL.md`). If
   the PB touches auth, data handling, or anything security-sensitive,
   also apply `security-review`.
4. Address blocking findings before proceeding — loop back to /dev for
   fixes if the review finds real defects, then re-run this command.
5. Once findings are addressed or accepted, check off the plan's
   review-related closing checklist item(s) for each plan in the batch
   that passed. A batched review can pass one plan and fail another —
   check off per-plan, not the whole batch at once.

Not the verification pass — that's /qa, already done before this runs.
Not a way to skip fixing blocking findings to move faster.
