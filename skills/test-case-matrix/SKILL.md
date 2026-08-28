---
name: test-case-matrix
description: Use when a feature/spec needs test scenarios written down BEFORE implementation or before automating tests — triggers on "/test-case-matrix", "buatkan test matrix", "buatkan test case", "test scenario apa aja", or as the mandatory first step when a qa-engineer-style agent is invoked. Reads the PRD/issue/spec for a feature (or asks for a quick feature description if none exists), optionally builds a parameter/value combination matrix first for features with multiple interacting variables, maps each scenario to the source files it exercises, and writes a single markdown file: header metadata + pass/fail summary, one table per category+priority (functional/edge/error/state-transition) with columns matching manual-tester spreadsheet naming (Test Case ID, Group No, Feature, Process No (FC), TYPE, Test Case, Test Variable, Pre-Condition, Test Data, Test Steps, Expected Result, Requirement, Evidence, Automation Tools, Remarks, Date) — cell content in Bahasa Indonesia with concrete UI-accurate steps, column names left in English — plus a requirement-traceability matrix. One table, one row per case, no separate checklist duplicating status. Does not write or run any test code — that's `react-testing`/`e2e-testing`/`webapp-testing`'s job, this skill only produces the scenario list those skills implement against.
license: MIT
metadata:
  category: testing
  author: lintang
  version: "1.0.0"
allowed-tools: [Read, Write, Glob, Grep]
argument-hint: "[feature/slug or PRD path]"
compatible_with: [claude-code, opencode, antigravity, commandcode]
---

# /test-case-matrix

Turn a feature's requirements into a complete, checkable list of test
scenarios in markdown — before any test code is written. This is a planning
artifact, not test automation: it produces the scenario list that
`react-testing`, `e2e-testing`, or `webapp-testing` then implement against.

## When this runs

- Called directly (`/test-case-matrix <feature>` or "buatkan test matrix
  untuk X").
- Called as the mandatory first step by a `qa-engineer`-style agent, before
  it touches any test code — the matrix is the plan, implementation follows
  it, not the other way around.

## Bahasa & detail step

Nama kolom tabel tetap persis seperti di Step 4 (bahasa Inggris, match
istilah tester manual: `Test Case ID`, `Pre-Condition`, `Test Data`, `Test
Steps`, `Expected Result`, dst) — jangan diterjemahkan, supaya konsisten
lintas file dan gampang di-grep. **Isi selnya** yang ditulis dalam
**Bahasa Indonesia**: `Test Case`, `Feature`, `Pre-Condition`, `Test Data`,
`Test Steps`, `Expected Result`, `Requirement` (ringkasan), dan `Remarks`.
`ID`/status code (`TC-F-01`, `[V]`, `Automated`, dst) tetap apa adanya.
Kalau requirement source-nya berbahasa Inggris, terjemahkan isinya saat
ditulis ke matrix, jangan copy-paste mentah.

Tiap langkah di `Test Steps`/`Expected Result` harus **konkret dan sesuai
alur nyata aplikasi** — bukan deskripsi generik ("test the form",
"verifikasi berhasil"). Sebelum menulis steps, cek UI/kode yang relevan
(nama tombol/field/route sebenarnya lewat Glob/Grep singkat di Step 3)
supaya langkahnya bisa langsung diikuti tester manual tanpa buka kode:
"1. Buka `/login`" + Expected "Form login tampil" jauh lebih berguna
daripada "1. Buka halaman login" + Expected "Berhasil". Kalau ada
`data-testid` atau selector yang jelas, sebutkan literalnya di step.

## Step 1 — Find the requirement source

Look for a spec covering this feature, in priority order:
1. A PRD/ISSUES pair from `prd-grill` (`docs/prd/**/PRD.md`,
   `docs/prd/**/ISSUES.md`) or a BRD from `brd-grill`, if the slug/feature
   name matches.
2. A GitHub issue (`gh issue view <n>`) if the user references one.
3. Any other plan/spec doc in the repo that plausibly covers this feature.

If nothing structured exists, ask the user for a short feature description
(what it does, main user flows, explicit constraints) — don't invent
requirements. Note in the output header that requirements are informal.

## Step 2 — Build the parameter matrix (when relevant)

Skip this step for simple features (single input, no interacting options) —
go straight to Step 3. Do it when the feature has multiple variables that
combine (order type × payment method × item type, form field × validation
mode, role × permission level, etc.):

1. List each variable that affects behavior and its possible values.
2. Build a combination table: which value-sets actually need a test case.
   Don't do a full cartesian product once there are more than ~3 variables —
   pick the combinations that are realistic and that differ in behavior
   (pairwise coverage), plus any combination explicitly called out in the
   requirement source as high-risk.
3. Each row in this table becomes (or feeds) a `TC-F`/`TC-E` scenario in
   Step 4 — reference the combination id in that case's `Test Data` or
   `Test Case` so the link back is visible.

This mirrors combinatorial test design: the matrix exists to make sure
scenario coverage isn't just "one happy path + one error", but the actual
value combinations that behave differently.

## Step 3 — Extract scenarios

From the requirement source, list every scenario across these categories —
don't stop at the happy path:

- **Functional (`TC-F`)** — each documented behavior/flow, including every
  stated acceptance criterion.
- **Edge case (`TC-E`)** — boundary values, empty/null input, max-size
  input, unusual-but-valid combinations.
- **Error handling (`TC-ERR`)** — invalid input, failed dependencies
  (network/API down), permission denied, concurrent-conflict cases.
- **State transition (`TC-ST`)** — any state machine or multi-step flow in
  the feature (e.g. draft → published, pending → approved/rejected).

Skip a category only if it's genuinely inapplicable (e.g. a stateless
read-only endpoint has no `TC-ST`) — don't skip because it's more work.

For each scenario, also identify the source file(s) it exercises (the
component/page/hook/handler/endpoint under test) — a quick Glob/Grep pass
over the repo for the feature's name/route/component is usually enough,
don't do a full deep-dive. This is what goes in the `Files` column in Step
4; it's what lets someone find every test case affected when a specific
file changes, not just when a requirement changes.

## Step 4 — Write the matrix

Write one file: `docs/qa/<slug>/test-matrix.md` (create the folder if
missing). Use this exact structure — see `assets/test-matrix-template.md`
for the literal template to copy and fill in.

- **Header** — feature name, requirement source (link), tester/programmer
  (if known — ask or leave `<belum diisi>` rather than guessing), created/
  updated date, scope / out-of-scope.
- **Summary** — one table: Total, Passed, Failed, Re-Test, Skip, counted
  live from the `Status` column below (not maintained separately — recount
  when the file is updated, don't let it drift from the actual rows).
- **Parameter Matrix** — only if Step 2 produced one; the variable/value
  table plus the combinations selected for testing.
- **Test Cases** — one table per category+priority group, **one row per
  test case, one table overall per group** (not a separate checklist plus
  a separate detail table — that duplicates status tracking in two places,
  which is how these files used to balloon in size). Columns:
  - `Status` — one of `[ ]` (not done), `[V]` (passed), `[X]` (failed),
    `[R]` (needs re-test), `[S]` (skipped). This is the **only** place
    completion status lives; update this same cell as a case's outcome
    changes, don't add checkboxes anywhere else.
  - `Test Case ID` — `TC-F-01` / `TC-E-01` / `TC-ERR-01` / `TC-ST-01` etc.
  - `Group No` — groups related cases under the same flow/PB item within
    this file, sequential per group (`1`, `1`, `2`, `2`, `3`, ...) — mirrors
    how the requirement source itself groups related scenarios.
  - `Feature` — the sub-feature/flow this group of cases belongs to, in
    Bahasa Indonesia (e.g. "Pengecekan Perubahan Qty Order"), same value
    repeated for every row in the group.
  - `Process No (FC)` — reference to the flowchart/process step in the
    design spec if the requirement source has one (e.g. "FC 2C.18.9.21 -
    Proses 2"); leave blank if the project doesn't use FC-numbered specs.
  - `TYPE` — `+` for a positive/valid-input scenario, `-` for a
    negative/invalid-input scenario.
  - `Test Case` — short descriptive name of what's being tested, in
    Bahasa Indonesia.
  - `Test Variable` — the specific input variation/combination this case
    covers, in Bahasa Indonesia; reference the `Parameter Matrix`
    combination id (e.g. "K1") when Step 2 produced one, otherwise
    describe the variation directly.
  - `Files` — source file path(s) this case exercises (from Step 3),
    backtick-quoted, comma-separated if more than one. This is what makes
    the matrix useful when a dependency/file changes: grep this column for
    the changed path to find every test case that needs re-checking.
  - `Pre-Condition`, `Test Data` — in Bahasa Indonesia; keep literal
    values (input strings, URLs, selectors) untranslated.
  - `Test Steps`, `Expected Result` — two separate columns (not merged),
    in Bahasa Indonesia. `Test Steps` = numbered steps joined with `<br>`
    inside the cell (`1. <aksi><br>2. <aksi>`); `Expected Result` = the
    matching numbered outcomes in the same cell layout, same numbering as
    the steps they belong to.
  - `Requirement` — link to the requirement/acceptance criterion this case
    covers, short description in Bahasa Indonesia if paraphrased.
  - `Evidence` — link/path to screenshot, recording, or CI run for this
    case once it's been executed; leave blank until then.
  - `Automation Tools` — how this case is/will be verified: `Automated`
    (covered by `react-testing`/`e2e-testing`/`webapp-testing` code, link
    the test file if known), `Manual`, or `Planned`.
  - `Remarks` — free-text notes in Bahasa Indonesia: blocker, bug ticket
    reference, why a case is skipped, anything that doesn't fit another
    column.
  - `Date` — last-executed date, blank until first run.
- **Traceability Matrix** — table mapping each requirement/acceptance
  criterion to the test case id(s) covering it, with a covered/gap marker.
  Always include this section: if there's no structured requirement doc,
  derive rows from the informal feature description gathered in Step 1
  instead of skipping the section.

## Step 5 — Report gaps

After writing the file, tell the user which requirements have no covering
test case (⚠️ rows in the traceability matrix) and which categories came up
empty — those are either genuinely inapplicable or a sign the requirement
source under-specifies that area; say which you think it is per gap.

## What this skill does NOT do

- Does not write test code or config — hand the finished matrix to
  `react-testing` (component-level), `e2e-testing` (Playwright patterns),
  or `webapp-testing` (executable E2E+TDD workflow) for implementation.
- Does not execute tests or update `Status`/`Evidence`/`Date` itself — those
  columns are for the human/agent running the tests to update as they go.
- Does not decide priority tradeoffs (what P0 actually blocks release) —
  that's a product/eng call; this skill only assigns a starting priority
  per case based on the requirement's stated importance.
