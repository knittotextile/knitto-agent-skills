# github-projects scripts

Node.js 18+, no dependencies. Every script shells out to `gh` (needs the
`project` scope) and targets org `knittotextile` project #15 by default.
Override with `--org` / `--project` or `GH_PROJECT_ORG` / `GH_PROJECT_NUMBER`.

Issue refs: `owner/repo#n` or a full issue URL.

**Write scripts are dry runs unless `--yes` is passed.** Run without `--yes`
first, check the printed plan, then rerun with `--yes`.

## Read-only

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
| `add-subtask.mjs --parent <ref> --title "..." [--repo] [--branch] [--depends] [--body-file] [--wave] [--application] [--assignee a,b] [--estimate] [--target-date] [--status]` | Creates `[Wn-follow-up] ...` with the header line, links it as a sub-issue of the parent, adds it to the board, fills Wave/Application (inherited) and Assignees (parent's assignees unless given) and Status (Backlog). Parent Status untouched |

## Examples

```bash
node scripts/next-task.mjs --application Studio --limit 5
node scripts/add-subtask.mjs --parent knittotextile/knitto-api-sdlc-studio#4 --title "Akun MySQL read-only" --estimate 3
node scripts/add-subtask.mjs --parent knittotextile/knitto-api-sdlc-studio#4 --title "Akun MySQL read-only" --estimate 3 --yes
node scripts/mark-done.mjs knittotextile/knitto-api-sdlc-studio#13 --yes
```

`lib.mjs` holds the shared helpers (GraphQL, field lookup, header parsing).

## Board template

Views can't be created through the API, but a copied project keeps them.
`Knitto SDLC Template` (org project #17) is the org template: views, fields,
and workflows set up once, no items.

| Script | What it does |
|---|---|
| `setup-template.mjs --create-from <n> --title "..."` or `--project <n>` | Copies a board's structure (no items) or prepares an existing one: ensures Start Date / Target Date / Estimate (jam) / Wave (with `Tracking`) / Application, drops legacy Delivery Stage, marks it as an org template |
| `new-board.mjs --title "..." [--template <n>]` | New board copied from the template: all views, fields, and workflows ready |

The same template is offered in the web UI: org → Projects → New project → Templates.
