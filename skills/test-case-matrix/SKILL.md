---
name: test-case-matrix
description: Use when a feature/spec needs test scenarios written down BEFORE implementation or before automating tests — triggers on "/test-case-matrix", "buatkan test matrix", "buatkan test case", "test scenario apa aja", or as the mandatory first step when a qa-engineer-style agent is invoked. Reads the PRD/issue/spec for a feature (or asks for a quick feature description if none exists) and writes a single markdown file listing every test scenario — functional, edge case, error handling, state transition — as numbered, checkable steps with per-step expected results, priority, and a requirement-traceability matrix. Does not write or run any test code — that's `react-testing`/`e2e-testing`/`webapp-testing`'s job, this skill only produces the scenario list those skills implement against.
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

## Step 3 — Write the matrix

Write one file: `docs/qa/<slug>/test-matrix.md` (create the folder if
missing). Use this exact structure — see `assets/test-matrix-template.md`
for the literal template to copy and fill in:

- Header: feature name, requirement source (link), date, scope / out-of-
  scope.
- **Test Case Checklist** — one checkbox line per test case (id + short
  title), for a fast overview of what's covered and what's still open.
- **Test Cases** — one subsection per case: id + title, priority (`P0`–
  `P3`), precondition, test data, steps as checkboxes with an **Expected**
  result on each step, post-condition, and a link back to the requirement
  it covers.
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
- Does not execute tests or check off the checkboxes itself — the
  checkboxes are for the human/agent running the tests to track as they go.
- Does not decide priority tradeoffs (what P0 actually blocks release) —
  that's a product/eng call; this skill only assigns a starting priority
  per case based on the requirement's stated importance.
