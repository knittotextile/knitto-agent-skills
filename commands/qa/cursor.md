Pipeline stage: VERIFY. Previous stage /dev, next stage /gate.

Run the expensive verification pass for the plan named in whatever text
follows this command — this is a conscious, separate step, not an
automatic tail of every /dev run.

1. Resolve the argument to the plan file. Confirm every feature item is
   already checked off — if not, send the user back to /dev first, don't
   verify half-finished work.
2. If "--run-pending" was passed, or more than one plan is sitting with
   feature items done but gates unchecked, ask the user whether to batch
   this verification pass across all of them (stack cap 3).
3. Run this repo's actual E2E/manual verification against the real flows
   the plan touched — not just unit tests/type-check. Apply whichever of
   the `e2e-testing`, `react-testing`, `webapp-testing`, or `api-testing`
   skills (`.cursor/skills/<name>/SKILL.md`) matches what this repo/PB
   actually is. If the tooling isn't available this session, say so
   explicitly — don't skip silently. If there's no test coverage at all
   for the flows this plan touched (no matrix, no specs to execute), don't
   write it from scratch inline here — that's the `qa-engineer` agent's
   job. Stop and tell the user to run `qa-engineer`/`test-case-matrix`
   first, then re-run this command once coverage exists to execute.
4. Write whatever verification report/artifact this repo's convention
   expects, if any. Clean up test data and any dev processes started for
   verification.
5. Check off the plan's verification-related closing checklist item(s)
   (not the review item — that's /gate) once verification passes. If it
   fails, report the failures and send the user back to /dev.

Not the code-review pass — that's /gate, run after this. Not for a plan
whose feature items aren't all done yet.
