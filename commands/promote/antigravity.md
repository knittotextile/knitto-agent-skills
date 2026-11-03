---
name: promote
description: SHIP stage — promote a fully verified and reviewed plan through the repository's branch/PR flow; does not deploy or wait for CI.
---

# SHIP — `/promote`

Treat the text following `/promote` as the plan path, slug, or identifier. Confirm the plan is in `done/` and all feature, verification, and review closing items are checked. If any gate is incomplete, direct the user to the appropriate earlier stage and stop.

Follow the `branching` skill to detect the repository's branch model. Open or update the PR(s) required by that model. For paired feature branches and long-lived `releases/*` branches, open the feature-to-trunk PR and run the branching skill's sync step for the staging branch; if the staging target is ambiguous, ask the user.

For other branch models, follow the repository's documented PR convention. Do not check or wait for CI, trigger deployment, or claim that this command releases to production. Ask before deleting any branches.

## Board close-out (GitHub Projects, Wave convention)

For each board issue this plan delivers (issue links in ISSUES.md or the
PR's `Closes owner/repo#n` lines):

- While the PR into the trunk is only open, leave the issue In Progress.
- Once that PR is merged, run the `github-projects` skill's
  `node scripts/mark-done.mjs <owner/repo#n> --project <board URL>` as a dry run, show the plan
  (tick Success Criteria, Status Done, close the issue), and rerun with
  `--yes` after the user confirms.
- Finish with `node scripts/wave-report.mjs --project <board URL>` so the user sees the Wave's progress.
