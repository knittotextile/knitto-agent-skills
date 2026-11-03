# Board Model — Wave convention

Applies to any GitHub Projects board that has a Wave field (new boards copied
from the org Wave template, or boards initialized with `init-board.mjs`).
One board can hold several applications; filter by `Application` instead of
creating more boards. Examples below use the Knitto SDLC board.

## Fields

| Field | Type | Values | Mandatory | Notes |
|---|---|---|---|---|
| Status | single select | Backlog, Ready, In Progress, Done | yes | Backlog → Ready is set by the maintainer |
| Wave | single select | Tracking, W0 … Wn | yes | Only sequencing field. Add W(n+1) when a new Wave is agreed |
| Application | single select | the board's own apps, each a distinct color (e.g. Studio blue, Atlas green, Inspector orange, Cross-system purple) | yes | A "Cross-system"-style option when more than one app is touched |
| Assignees | built-in | GitHub logins | yes | Issue assignees. Replaces an `Owner` text field some older boards have |
| Start Date | date | YYYY-MM-DD | when known | Roadmap bar start (Start Date → Target Date) |
| Estimate | number | hours | when known | Used by `wave-report` and the subtask/Wave decision |
| Target Date | date | YYYY-MM-DD | when known | Roadmap view |
| Effort Forecast | — | — | no | Optional, unchanged |
| Delivery Stage | single select | (legacy S0–S5) | **no** | Hidden from every view; never fill it for new items |
| Owner | text | (legacy) | **no** | Replaced by Assignees; hidden, not in the template |

### Why Delivery Stage is gone

In practice Wave and Delivery Stage were always paired (W0↔S0 … W5↔S5), so
every item needed the same information twice, and forgotten items fell into
a "No Delivery Stage" group. Wave alone carries the order. The field stays
on the board (hidden) until every old item has a Wave, then the maintainer
may delete it.

## Wave values

- `W0 … Wn` — a delivery phase with its own goal. Waves run in order; work
  inside one Wave may run in parallel.
- `Tracking` — umbrella/parent containers (e.g. a PB epic) that are not work
  themselves. Excluded from Development Wave, `next-task`, and `wave-report`.

## Issue naming

| Kind | Title | Wave field | Parent |
|---|---|---|---|
| Wave issue | `[Wn] Judul` | Wn | optional (Tracking umbrella) |
| Subtask | `[Wn-follow-up] Judul` | Wn (same as parent) | **mandatory**: a `[Wn]` issue |
| Umbrella | free title | Tracking | — |

The `Wn` in the title, the `Wave:` header line, and the Wave field must
match. `lint-board` checks this.

## Sub-issue rules (`[Wn-follow-up]`)

1. New work never becomes a loose item. Decide subtask vs new Wave first
   (`subtask-vs-wave.md`).
2. A subtask is a GitHub **sub-issue** of its `[Wn]` parent, not just a
   `Parent:` line in the body. `add-subtask.mjs` does both.
3. A Done parent stays Done. Do not reopen it or move it back; the subtask
   carries the new work and its own Status.
4. Wave, Application, and Assignees are mandatory on the subtask; by default
   they are inherited from the parent and can be overridden.
5. A subtask does not get its own subtask. Further follow-up work hangs
   off the same `[Wn]` parent.

## Status flow

```
Backlog --(maintainer)--> Ready --(picked up)--> In Progress --(merged + Success Criteria met)--> Done
```

An issue stays Backlog while any `Depends:` issue is not Done.
`mark-done.mjs` ticks Success Criteria, sets Done, and closes the issue.
