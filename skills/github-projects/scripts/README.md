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
| `next-task.mjs [--application X] [--owner Y] [--wave Wn] [--limit 20] [--all] [--json]` | Open items in Ready/Backlog whose `Depends:` are all Done, sorted Wave → Ready before Backlog → Target Date. `--all` also shows blocked items and what blocks them |
| `lint-board.mjs [--application X] [--open-only] [--json]` | Empty Wave/Application/Owner, missing or mismatched `[Wn]` title prefix, `[Wn-lanjutan]` not linked as a sub-issue, header/field Wave mismatch. Exit 1 when anything is found |
| `wave-report.mjs [--application X] [--owner Y] [--json]` | Markdown table per Wave: Done/Total, count per Status, Estimate hours done/total |

## Write (dry run unless `--yes`)

| Script | What it does |
|---|---|
| `set-fields.mjs <ref> [--status] [--wave] [--application] [--owner] [--estimate] [--target-date]` | Sets the given fields; adds the issue to the board if needed |
| `set-status.mjs <ref> "<Status>"` | Sets Status only |
| `mark-done.mjs <ref> [--no-close] [--no-check]` | Ticks `## 3. Success Criteria` checkboxes, sets Status Done, closes the issue |
| `add-lanjutan.mjs --parent <ref> --title "..." [--repo] [--branch] [--depends] [--body-file] [--wave] [--application] [--owner] [--estimate] [--target-date] [--status]` | Creates `[Wn-lanjutan] ...` with the header line, links it as a sub-issue of the parent, adds it to the board, fills Wave/Application/Owner (inherited from the parent unless given) and Status (Backlog). Parent Status untouched |

## Examples

```bash
node scripts/next-task.mjs --application Studio --limit 5
node scripts/add-lanjutan.mjs --parent knittotextile/knitto-api-sdlc-studio#4 --title "Akun MySQL read-only" --estimate 3
node scripts/add-lanjutan.mjs --parent knittotextile/knitto-api-sdlc-studio#4 --title "Akun MySQL read-only" --estimate 3 --yes
node scripts/mark-done.mjs knittotextile/knitto-api-sdlc-studio#13 --yes
```

`lib.mjs` holds the shared helpers (GraphQL, field lookup, header parsing).
