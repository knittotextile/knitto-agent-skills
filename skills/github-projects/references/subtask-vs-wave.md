# New Work: Subtask or New Wave

Waves are defined up front, so new work must be weighed before it lands on
the board. The agent **recommends** one option with its reasons and the
user decides. Never create the issue before the user picks.

## Step 1 - Gather the facts

- Goal: which existing `[Wn]` goal does this serve, if any?
- Estimate in hours (ask for a rough number if unknown).
- Scope: repos, applications, new endpoints/schema/screens.
- Dependencies: what it needs, and what would have to wait for it.

Use `node scripts/wave-report.mjs` and `node scripts/next-task.mjs --all`
to see current Waves and their estimates.

## Step 2 - Weigh it

**Subtask** (`[Wn-follow-up]` under an existing `[Wn]`) when all of these hold:

- It serves the goal of an existing `[Wn]`: a gap, fix, verification,
  hardening, or small extension of what that Wave delivered.
- Estimate ≤ 8 hours, or ≤ 30% of that Wave's total Estimate.
- One issue is enough (no breakdown into several issues needed).
- No new application, and no major new schema/endpoint/screen.
- Later Waves do not have to wait for it, or it is already blocking them
  and belongs in that Wave.

**New Wave** (`W(n+1)`, a new `[Wn]` issue) when any of these holds:

- A new goal or deliverable that no existing `[Wn]` describes.
- Estimate > 8 hours and > 30% of the closest Wave, or it needs several issues.
- It introduces a new application, repo, or major schema/endpoint/screen.
- It needs its own dependency order (other work must wait for it).
- The closest Wave is fully Done and this is a new phase, not a gap in it.

When signals conflict, lean towards **subtask** if the closest Wave is
still open, and towards **new Wave** if it is Done.

The thresholds (8 hours, 30%) are defaults; a project may override them in
its board README.

## Step 3 - Recommend and ask

Present it like this, then ask the user to choose:

```
Usulan: [W2-follow-up] di bawah knittotextile/repo#12 "[W2] Editor flowchart"
Alasan:
- Tujuan sama dengan W2 (melengkapi validasi editor)
- Estimate ±5 jam (W2 total 60 jam → 8%)
- Satu issue, repo sama, tanpa endpoint baru
Alternatif: W5 baru — kalau ini dianggap fase terpisah
```

If no fitting `[Wn]` parent exists, list the closest candidates (title,
Wave, Status) and ask which one, or whether to open a new Wave.

## Step 4 - Create

- Subtask: `node scripts/add-subtask.mjs --parent o/r#n --title "..."` (dry run), then `--yes`.
- New Wave: the maintainer adds option `W(n+1)` to the Wave field (org board
  change, needs explicit approval), then create the `[W(n+1)]` issue with
  `references/template-issue.md` and `scripts/set-fields.mjs`.
