# Standard Views

`gh project` has no `view-create` command, so views are set up in the web
UI (board → `+ New view`, then the view's ▾ menu). Every view that shows
work is **grouped by Wave**, so each Wave reads as one block.

Changing views on the org board needs the user's explicit approval.

## 1. All Work Items (TABLE)

- Layout: Table. No filter.
- Group by: `Wave`.
- Columns: Title, Status, Wave, Application, Owner, Estimate, Target Date, Parent issue, Sub-issues progress.
- Purpose: full audit list.

## 2. Engineering Workflow (BOARD)

- Layout: Board. Column field: `Status` (Backlog, Ready, In Progress, Done).
- Group by: `Wave` (swimlanes, one row per Wave).
- Filter: `-wave:Tracking`.
- Card fields: Application, Owner, Estimate.
- Purpose: daily standup; see which Wave is moving.

## 3. Delivery Roadmap (ROADMAP)

- Layout: Roadmap. Date field: `Target Date`.
- Group by: `Wave`.
- Filter: `-wave:Tracking`.
- Purpose: wave planning and deadlines.

## 4. Development Sequence (TABLE)

- Layout: Table.
- Filter: `-wave:Tracking -status:Done`.
- Group by: `Wave`. Sort: `Target Date` ascending.
- Columns: Title, Status, Application, Owner, Estimate, Target Date, Repository.
- Purpose: execution order for developers and agents (same order as
  `scripts/next-task.mjs`).

## Hiding Delivery Stage

In every view open the field menu (`+` at the column header / view
settings → Fields) and untick `Delivery Stage`. Remove any `Group by:
Delivery Stage` and replace it with `Wave`.

## Fixing "No Wave"

The `No Wave` group collects items whose Wave is empty. Run
`node scripts/lint-board.mjs` to list them with their old Delivery Stage
value, then fill Wave with `scripts/set-fields.mjs`.
