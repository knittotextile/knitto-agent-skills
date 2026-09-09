Pipeline stage: SHIP. Previous stage /gate. Last stage — nothing follows
this.

Ship the plan named in whatever text follows this command and close out
its plan file, now that /qa and /gate have both passed.

1. Resolve the argument to the plan file. Confirm every closing checklist
   item is checked (feature items from /dev, verification from /qa,
   review from /gate) — if anything is still open, say which stage to run
   first instead of proceeding.
2. Branch/release flow: apply the `branching` skill's `promote <slug>`
   (`.cursor/skills/branching/SKILL.md`) if this repo uses the paired
   feature-branch + long-lived releases/* model (its own Step 0 detects
   this) — this opens the production PR and checks whether a separate
   releases/main push is needed to actually deploy.
3. If this repo instead uses a different deploy convention, apply the
   `deployment` skill for the actual release steps instead.
4. Once live: move the plan file from todo/ to done/ (per prd-grill's
   output conventions) and fix any relative links in it or pointing to it.
   This step is exactly as mandatory as the deploy step itself.
5. Offer to clean up the merged feature branches (ask first, don't delete
   unilaterally).

Not a way to bypass /qa or /gate to ship faster — refuse to promote a plan
with open verification or review items, and say so plainly. Not for
shipping more than one plan file per invocation.
