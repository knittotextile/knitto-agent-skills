---
name: github-projects
description: Use when the user wants to plan or track work on the org knittotextile GitHub Projects board ("Knitto SDLC") — create issues in the Wave format, decide whether new work is a `[Wn-lanjutan]` sub-issue or a new Wave, set board fields (Status, Wave, Application, Assignees, Estimate), find the next task, mark work done, lint the board, report progress per Wave, or set up the standard views. Triggers on "buat issue di board", "add issue to project", "ada kerjaan baru", "task berikutnya apa", "mark done", "progress wave", "rapikan board". Not for git branching (see branching) or Asana tasks.
license: MIT
compatibility: "Requires gh CLI auth with project scope, and Node.js 18+ for scripts/"
metadata:
  category: git-workflow
  author: knitto
  version: "2.0.0"
allowed-tools: [Bash, Read, Grep, Glob, AskUserQuestion]
disallowed-tools: []
argument-hint: "add-issue | lanjutan | next | done <issue> | lint | report | add-view"
when_to_use: "Also trigger when user mentions a wave, [Wn-lanjutan], the board, sub-issue, or project views, or when /grill output goes to GitHub issues/Project."
disable-model-invocation: false
user-invocable: true
effort: medium
compatible_with: [claude-code, opencode, antigravity]
---

# github-projects

One shared board, **Knitto SDLC** (org `knittotextile`, project
#15), holds all delivery work across applications. The board is the source
of truth, the issue is the execution unit for AI and human, and **Wave** is
the only sequencing dimension.

Full model: `references/model.md`. Lanjutan vs new Wave:
`references/lanjutan-vs-wave.md`. Scripts: `scripts/README.md`.

## When to use

- New work arrives: decide lanjutan vs new Wave, then create the issue.
- Create or update issues in the Wave format.
- Set or fix board fields; move Status; mark an issue done.
- Find the next pickable task; report progress per Wave; lint the board.
- Set up the standard views (grouped by Wave).

## When NOT to use

- Git branch management (use `branching`).
- Code implementation itself (use `exec-todo`, `incremental-implementation`).
- Asana task management.

## Step 0 - Verify via gh

1. `gh auth status` must show the `project` scope.
2. Read the board through the scripts (`node scripts/wave-report.mjs`,
   `node scripts/next-task.mjs --all`) or `gh project view 15 --owner knittotextile`.

Never scrape the web UI. Never create a new board unless the user asks for
one explicitly; the default target is always Knitto SDLC.
Renaming the board, adding/removing fields or options, and editing views
change the org board — do them only with the user's explicit approval.

## Step 1 - Board model (summary)

| Field | Values | Rule |
|---|---|---|
| Status | Backlog, Ready, In Progress, Done | Backlog → Ready is a manual maintainer decision |
| Wave | `Tracking`, W0, W1, … Wn | **Mandatory**. The only sequencing field |
| Application | Studio, Atlas, Inspector, Cross-system | **Mandatory** |
| Assignees | issue assignees (GitHub logins) | **Mandatory**; replaces the old Owner text field |
| Start Date | date | Roadmap bar start |
| Estimate | number, hours | Fill when known |
| Target Date | date | Drives the Roadmap view |

`Delivery Stage` is legacy (it was always paired W0↔S0 … W5↔S5). It is
hidden from every view and must not be filled for new items.
`Tracking` marks umbrella/parent containers that are not work themselves.

## Step 2 - New work: lanjutan or new Wave (mandatory)

Waves are defined up front. New work never becomes a loose item: it is
either a `[Wn-lanjutan]` sub-issue of an existing `[Wn]` issue, or the
start of a new Wave. Weigh it with `references/lanjutan-vs-wave.md`,
**recommend one option with the reason** (estimate, scope, dependencies),
and let the user decide. If no fitting `[Wn]` parent exists, show the
closest candidates and ask; do not invent one silently.

## Step 3 - Clarify until the issue is complete

Do NOT create an issue while any of these is missing. Ask; do not guess.

1. Wave (from Step 2) and Parent (for lanjutan).
2. Application and Assignees.
3. Repo and branch (`feature/<slug>` from `releases/staging`).
4. Definition, Changes, Success Criteria (must include Test), Depends.

## Step 4 - Issue format

See `references/template-issue.md`.

- Title: `[Wn] Judul` for a wave issue, `[Wn-lanjutan] Judul` for follow-up work.
- Header line:
  `Wave: Wn | Parent: owner/repo#n | Repo: owner/repo | Branch: feature/<slug> (from releases/staging) | Depends: owner/repo#n, ...`
- Sections: `## 1. Definition`, `## 2. Changes`, `## 3. Success Criteria`
  (checkboxes; Functional, Test, Regression), optional `## 4. Keputusan terbuka`.

An issue without a Test checkbox is NOT Ready.

## Step 5 - Waves and dependencies

- Waves run in order. Parallel work inside one wave is allowed.
- If any `Depends:` issue is not Done, the issue stays Backlog and must not start.
- A Done parent stays Done when a lanjutan is added under it; the lanjutan
  carries the new work and its own Status.

## Step 6 - Scripts (use them instead of hand-written gh calls)

Every write script is a dry run unless `--yes` is passed: run it once
without `--yes`, show the user the plan, then rerun with `--yes`.

| Task | Command |
|---|---|
| Next pickable task | `node scripts/next-task.mjs [--application X] [--assignee login]` |
| Create lanjutan | `node scripts/add-lanjutan.mjs --parent o/r#n --title "..." [--yes]` |
| Set fields | `node scripts/set-fields.mjs o/r#n --wave W2 --application Studio --assignee login [--yes]` |
| Change Status | `node scripts/set-status.mjs o/r#n "In Progress" [--yes]` |
| Mark done | `node scripts/mark-done.mjs o/r#n [--no-close] [--yes]` |
| Lint board | `node scripts/lint-board.mjs [--open-only]` |
| Progress per Wave | `node scripts/wave-report.mjs` |
| New board from template | `node scripts/new-board.mjs --title "..." [--yes]` |
| Prepare a template | `node scripts/setup-template.mjs --project <n> [--yes]` |

Paths are relative to this skill's folder. Details: `scripts/README.md`.

## Step 7 - Standard views

`gh project` cannot create views; set them up once in the web UI following
`references/views.md`. Set them in the org template **Knitto SDLC Template**
(#17); every board created with `new-board.mjs` (or Templates in the web UI)
copies them, so a new board never starts from scratch. Every view that shows work is grouped by **Wave**:

1. All Work Items (TABLE, grouped by Wave).
2. Engineering Workflow (BOARD, columns = Status, grouped by Wave).
3. Delivery Roadmap (ROADMAP by Target Date, grouped by Wave).
4. Development Wave (TABLE, filter `-wave:Tracking`, grouped by Wave, sorted by Target Date).

## References

- `references/model.md` - fields, values, naming, sub-issue rules.
- `references/lanjutan-vs-wave.md` - how to weigh new work.
- `references/template-issue.md` - issue skeleton.
- `references/template-readme.md` - board README skeleton.
- `references/views.md` - view setup step by step.
- `scripts/README.md` - helper scripts.
