# github-projects scripts

Node.js 18+, no dependencies. Every script shells out to `gh` (needs the
`project` scope).

**There is no default board.** Every script needs the board:
`--project https://github.com/orgs/<org>/projects/<n>` (a view URL works
too), or `--project <n> --org <org>`, or `GH_PROJECT_ORG` + `GH_PROJECT_NUMBER`.
Without one the script stops and says so.

Issue refs: `owner/repo#n` or a full issue URL.

**Write scripts are dry runs unless `--yes` is passed.** Run without `--yes`
first, check the printed plan, then rerun with `--yes`.

Scripts marked *Wave* require a Wave field on the board; on a board
without one they stop and point at `init-board.mjs`.

## Board setup

| Script | What it does |
|---|---|
| `new-board.mjs --org <org> --title "..." [--template <URL/n>] [--applications "A,B"]` | New board copied from the org's Wave template (views, fields, workflows; no items). Without `--template` it finds the org template that has a Wave field. `--applications` sets this board's Application options |
| `init-board.mjs --project <URL> [--applications "A,B"] [--drop-legacy]` | Puts an existing board on the Wave convention: Wave (Tracking, W0–W5), Application with distinct colors, Start Date, Target Date, Estimate (jam). Keeps existing values. Views still need the web UI |
| `setup-template.mjs --create-from <URL> --title "..."` or `--project <URL> [--keep-legacy]` | Makes an org Wave template: copies a board's structure (no items) or prepares one, ensures the convention fields, drops legacy Delivery Stage / Owner, marks it as an org template |

Views can't be created through the API, but a copied project keeps them, so
new boards come from the template. The same template is offered in the web
UI: org → Projects → New project → Templates.

## Read-only (*Wave*)

| Script | What it does |
|---|---|
| `next-task.mjs [--application X] [--assignee login] [--wave Wn] [--limit 20] [--all] [--json]` | Open items in Ready/Backlog whose `Depends:` are all Done, sorted Wave → Ready before Backlog → Target Date. `--all` also shows blocked items and what blocks them |
| `lint-board.mjs [--application X] [--open-only] [--json]` | Empty Wave/Application, no Assignees, missing or mismatched `[Wn]` title prefix, `[Wn-follow-up]` not linked as a sub-issue, header/field Wave mismatch. Exit 1 when anything is found |
| `wave-report.mjs [--application X] [--assignee login] [--json]` | Markdown table per Wave: Done/Total, count per Status, Estimate hours done/total |

## Write (dry run unless `--yes`)

| Script | What it does |
|---|---|
| `set-fields.mjs <ref> [--status] [--wave] [--application] [--assignee a,b] [--estimate] [--target-date]` | Sets the given fields; adds the issue to the board if needed |
| `set-status.mjs <ref> "<Status>"` | Sets Status only |
| `mark-done.mjs <ref> [--no-close] [--no-check]` | Ticks `## 3. Success Criteria` checkboxes, sets Status Done, closes the issue |
| `add-subtask.mjs --parent <ref> --title "..." [--repo] [--branch] [--depends] [--body-file] [--wave] [--application] [--assignee a,b] [--estimate] [--target-date] [--status]` (*Wave*) | Creates `[Wn-follow-up] ...` with the header line, links it as a sub-issue of the parent, adds it to the board, fills Wave/Application (inherited) and Assignees (parent's unless given) and Status (Backlog). Parent Status untouched |

## Examples

```bash
B=https://github.com/orgs/knittotextile/projects/15
node scripts/next-task.mjs --project $B --application Studio --limit 5
node scripts/add-subtask.mjs --project $B --parent knittotextile/knitto-api-sdlc-studio#4 --title "Akun MySQL read-only" --estimate 3
node scripts/mark-done.mjs knittotextile/knitto-api-sdlc-studio#13 --project $B --yes
node scripts/new-board.mjs --org knittotextile --title "Knitto Live Chat v2" --applications "Widget,API Chat,Portal"
node scripts/init-board.mjs --project https://github.com/orgs/knittotextile/projects/8
```

`lib.mjs` holds the shared helpers (board resolution, GraphQL, field lookup,
header parsing, convention-field generator).
