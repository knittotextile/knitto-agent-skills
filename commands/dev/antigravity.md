---
name: dev
description: BUILD stage — implement one confirmed plan's unchecked feature checklist items, running cheap checks per item and stopping before full verification or review.
---

# BUILD — `/dev`

Treat the text following `/dev` as the plan path, slug, or identifier. Follow the `exec-todo` skill to resolve the plan, implement its unchecked feature items in order, and run the cheap checks required for each item. Do not process more than one plan in a single invocation.

Stop when the feature checklist is complete. Do not run the full E2E/manual verification or code review gates here. Report the result and direct the user to `/qa` next.

If no plan can be resolved, ask the user for its path or slug instead of guessing. If the request is a small ad hoc change rather than a planned feature, do not force it through the pipeline.

## Board (Knitto Wave Delivery)

- No plan given and the work lives on the board? Run the `github-projects`
  skill's `node scripts/next-task.mjs` (optionally `--application` /
  `--owner`), show the pickable tasks, and let the user choose.
- When work on a board issue starts, set it In Progress with
  `node scripts/set-status.mjs <owner/repo#n> "In Progress"` — a dry run
  first, then `--yes` once the user agrees.
