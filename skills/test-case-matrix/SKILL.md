---
name: test-case-matrix
description: Use when a feature/spec needs test scenarios written down BEFORE implementation or before automating tests — triggers on "/test-case-matrix", "buatkan test matrix", "buatkan test case", "test scenario apa aja", or as the mandatory first step when a qa-engineer-style agent is invoked. Reads the PRD/issue/spec for a feature (or asks for a quick feature description if none exists), maps each scenario to the source files it exercises, and writes a single markdown file: one table per category+priority (functional/edge/error/state-transition) with columns for status (`[ ]`/`[V]`), source file references, precondition, test data, numbered steps with expected results, and requirement — plus a requirement-traceability matrix. One table, one row per case, no separate checklist duplicating status. Does not write or run any test code — that's `react-testing`/`e2e-testing`/`webapp-testing`'s job, this skill only produces the scenario list those skills implement against.
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

## Step 2 — Extract scenarios

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
3; it's what lets someone find every test case affected when a specific
file changes, not just when a requirement changes.

## Step 3 — Write the matrix

Write one file: `docs/qa/<slug>/test-matrix.md` (create the folder if
missing). Use this exact structure — see `assets/test-matrix-template.md`
for the literal template to copy and fill in.

- Header: feature name, requirement source (link), date, scope / out-of-
  scope.
- **Test Cases** — one table per category+priority group, **one row per
  test case, one table overall per group** (not a separate checklist plus
  a separate detail table — that duplicates status tracking in two places,
  which is how these files used to balloon in size). Columns:
  - `Status` — `[ ]` (not done) or `[V]` (implemented and passing). This
    is the **only** place completion status lives; flip `[ ]` to `[V]` in
    this same cell as a case passes, don't add checkboxes anywhere else.
  - `ID` — `TC-F-01` / `TC-E-01` / `TC-ERR-01` / `TC-ST-01` etc.
  - `Title` — short descriptive name.
  - `Files` — source file path(s) this case exercises (from Step 2),
    backtick-quoted, comma-separated if more than one. This is what makes
    the matrix useful when a dependency/file changes: grep this column for
    the changed path to find every test case that needs re-checking.
  - `Precondition`, `Test data`.
  - `Steps → Expected` — numbered steps joined with `<br>` inside the
    cell, each ending in `→ **Expected:** <result>`.
  - `Post-condition`, `Requirement`.
- **Traceability Matrix** — table mapping each requirement/acceptance
  criterion to the test case id(s) covering it, with a covered/gap marker.
  Always include this section: if there's no structured requirement doc,
  derive rows from the informal feature description gathered in Step 1
  instead of skipping the section.

## Step 4 — Report gaps

After writing the file, tell the user which requirements have no covering
test case (⚠️ rows in the traceability matrix) and which categories came up
empty — those are either genuinely inapplicable or a sign the requirement
source under-specifies that area; say which you think it is per gap.

## What this skill does NOT do

- Does not write test code or config — hand the finished matrix to
  `react-testing` (component-level), `e2e-testing` (Playwright patterns),
  or `webapp-testing` (executable E2E+TDD workflow) for implementation.
- Does not execute tests or flip `[ ]` to `[V]` itself — the `Status`
  column is for the human/agent running the tests to update as they go.
- Does not decide priority tradeoffs (what P0 actually blocks release) —
  that's a product/eng call; this skill only assigns a starting priority
  per case based on the requirement's stated importance.
