# Board Model — Knitto SDLC

Org `knittotextile`, project #15. One shared board for every application;
filter by `Application` instead of creating more boards.

## Fields

| Field | Type | Values | Mandatory | Notes |
|---|---|---|---|---|
| Status | single select | Backlog, Ready, In Progress, Done | yes | Backlog → Ready is set by the maintainer |
| Wave | single select | Tracking, W0 … Wn | yes | Only sequencing field. Add W(n+1) when a new Wave is agreed |
| Application | single select | Studio, Atlas, Inspector, Cross-system | yes | Cross-system when more than one app is touched |
| Owner | text | GitHub login | yes | One person accountable |
| Estimate | number | hours | when known | Used by `wave-report` and the lanjutan/Wave decision |
| Target Date | date | YYYY-MM-DD | when known | Roadmap view |
| Effort Forecast | — | — | no | Optional, unchanged |
| Delivery Stage | single select | (legacy S0–S5) | **no** | Hidden from every view; never fill it for new items |

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
| Lanjutan | `[Wn-lanjutan] Judul` | Wn (same as parent) | **mandatory**: a `[Wn]` issue |
| Umbrella | free title | Tracking | — |

The `Wn` in the title, the `Wave:` header line, and the Wave field must
match. `lint-board` checks this.

## Sub-issue rules (`[Wn-lanjutan]`)

1. New work never becomes a loose item. Decide lanjutan vs new Wave first
   (`lanjutan-vs-wave.md`).
2. A lanjutan is a GitHub **sub-issue** of its `[Wn]` parent, not just a
   `Parent:` line in the body. `add-lanjutan.mjs` does both.
3. A Done parent stays Done. Do not reopen it or move it back; the lanjutan
   carries the new work and its own Status.
4. Wave, Application, and Owner are mandatory on the lanjutan; by default
   they are inherited from the parent and can be overridden.
5. A lanjutan does not get its own lanjutan. Further follow-up work hangs
   off the same `[Wn]` parent.

## Status flow

```
Backlog --(maintainer)--> Ready --(picked up)--> In Progress --(merged + Success Criteria met)--> Done
```

An issue stays Backlog while any `Depends:` issue is not Done.
`mark-done.mjs` ticks Success Criteria, sets Done, and closes the issue.
