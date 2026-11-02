# Template README (Knitto SDLC board)

The board README is the contract for every application on the board.

```md
# Knitto SDLC
> Owner: @owner | Written by: name/date | Updated: date

## Waves

| Wave | Goal | Status | Target |
|------|------|--------|--------|
| W0 | Foundation: accounts, access, benchmarks | Done | 2026-09-30 |
| W1 | Backend core | In Progress | 2026-10-31 |
| W2 | Frontend | Backlog | 2026-11-30 |

Waves run in order. Parallel work inside one wave is allowed.
New work is a `[Wn-lanjutan]` sub-issue or a new Wave — see the decision
rule (lanjutan ≤ 8 hours or ≤ 30% of the Wave, same goal).

## Applications

| Application | Repos | Work branch | Base |
|-------------|-------|-------------|------|
| Studio | `knittotextile/knitto-api-sdlc-studio`, `knittotextile/knitto-sdlc-studio-web` | `feature/<slug>` | `releases/staging` |
| Atlas | `knittotextile/knitto-api-sdlc-atlas` | `feature/<slug>` | `releases/staging` |

## Rules

- Mandatory: Wave, Application, and Assignees.
- Title prefix `[Wn]` / `[Wn-lanjutan]` matches the Wave field.
- A Done parent stays Done; follow-up work goes into a lanjutan.

## References

Links to Asana, Drive, Sheets, analysis docs.

## Open Questions

1. Question with owner and due date.
```
