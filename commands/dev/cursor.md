Pipeline stage: BUILD. Previous stage /grill, next stage /qa.

Implement the checklist named in whatever text follows this command (path,
slug, or number). Apply the `exec-todo` skill's instructions
(`.cursor/skills/exec-todo/SKILL.md`) — it already implements exactly this
scope: resolve the file, parse feature items into a tracked task list,
implement each with cheap checks only (unit tests/type-check/build), and
stop once every feature item is checked off. It does not dispatch review
or run full E2E verification itself.

`exec-todo` stops on its own once every feature item is checked off — it
never moves the file to done/ or runs the expensive gates. Relay its final
report, then tell the user the closing gates (/qa → /gate → /promote) are
next.

Not /qa or /gate — cheap per-item checks run here, but the expensive
E2E/manual verification pass and the code-review pass are separate
commands, run deliberately. Not for more than one plan file per invocation.

## Board (GitHub Projects, Wave convention)

- No plan given and the work lives on the board? Run the `github-projects`
  skill's `node scripts/next-task.mjs --project <board URL>` (optionally `--application` /
  `--assignee`), show the pickable tasks, and let the user choose.
- When work on a board issue starts, set it In Progress with
  `node scripts/set-status.mjs <owner/repo#n> "In Progress" --project <board URL>` — a dry run
  first, then `--yes` once the user agrees.
