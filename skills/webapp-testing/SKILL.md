---
name: webapp-testing
description: Executable E2E + TDD workflow for web apps — real Playwright config, a Python test runner, and a CI pipeline file, not just markdown code snippets. Use when setting up or running E2E tests for a webapp end-to-end, not just reading patterns about it.
license: MIT
metadata:
  category: testing
  author: lintang
compatible_with: [claude-code, opencode, antigravity, commandcode]
---

# Webapp Testing (E2E + TDD, executable)

Sets up a webapp with a ready-to-run E2E test pipeline — real files you
copy and execute, not markdown snippets to retype every session. Combines
the TDD red-green-refactor discipline with Playwright E2E, wired through a
single Python entrypoint.

**Related skills:** for granular Playwright patterns (Page Object Model,
flaky-test triage, artifact management), see `e2e-testing`. For general
red-green-refactor discipline beyond E2E (unit/integration tests), see
`test-driven-development`. For the scenario list to implement against
(functional/edge/error/state-transition cases) before writing any spec
file, see `test-case-matrix` — run that first, then use each of its
checklist items as the RED step for one spec here. This skill sits on top
of all three — it's the scaffolding that turns their patterns into files
you actually run.

## When to use

- Setting up E2E testing for a webapp project from scratch
- Adding a new user-facing flow and want a failing E2E test before
  implementing it (TDD applied to E2E)
- Wiring E2E tests into CI

## When NOT to use

- You just need Playwright *patterns/snippets* to write a test by hand —
  use `e2e-testing` instead
- Pure unit/integration test TDD with no browser involved — use
  `test-driven-development`

## Steps

1. **Install the scaffolding.** Copy `assets/playwright.config.ts` to the
   project root (merge manually if a config already exists). Ensure
   `@playwright/test` is a dev dependency (`npm i -D @playwright/test`).

2. **Write the test first (RED).** Before implementing a new flow, write
   an E2E spec under `tests/e2e/` that describes the desired behavior. It
   should fail — see `references/tdd-e2e-workflow.md` for the full
   red-green-refactor cycle applied to E2E specifically.

3. **Run the suite via the runner, not raw `npx playwright test`.**

   ```bash
   python skills/webapp-testing/scripts/run_e2e.py
   ```

   This wraps Playwright using the reporters set in `playwright.config.ts`
   (`list` for live terminal progress, `html`/`json` for the report and
   machine-readable results — see that file, don't pass `--reporter` on the
   CLI, it replaces the config's reporters instead of adding to them) and
   prints a pass/fail/flaky summary at the end with a non-zero exit code on
   failure — so both you and CI can call one command instead of re-deriving
   Playwright flags each time. Pass through Playwright options as needed:
   `--grep <pattern>`, `--project chromium`. Runs **headed** (a visible
   browser window) by default when run locally, so you can watch it work —
   pass `--headless` for unattended/agent-driven runs (an agent isn't
   watching the window, and some sandboxes have no display to open one on
   at all). CI always runs headless regardless of the flag, since
   `playwright.config.ts` keys off `process.env.CI`.

4. **Implement until green.** Re-run `run_e2e.py` after each change until
   the new spec passes, then refactor with tests still green.

5. **Wire into CI.** Copy `assets/e2e-workflow.yml` to
   `.github/workflows/e2e.yml`. It calls the same `run_e2e.py` entrypoint
   used locally, so local and CI runs stay identical.

## Screenshots in the report

`playwright.config.ts` sets `screenshot: 'on'` (not `'only-on-failure'`) —
every test, pass or fail, leaves a final-state screenshot attached in the
html report, not just failures. That's what makes the report skimmable at
a glance instead of a bare pass/fail list. `video` stays
`'retain-on-failure'` — videos are heavy, keep those to failures only.
Open the report locally with `npx playwright show-report docs/qa/playwright-report`.

## All output lives under `docs/qa/`

`playwright.config.ts` routes every generated artifact into `docs/qa/`,
next to the matrix file `test-case-matrix` writes
(`docs/qa/<slug>/test-matrix.md`) — one place for everything QA-related
instead of loose folders scattered at the project root:

- `docs/qa/playwright-report/` — the html report (`open: 'never'`, see
  above).
- `docs/qa/playwright-results.json` — machine-readable results;
  `run_e2e.py`'s `RESULTS_PATH` reads this exact path for its summary, so
  if you change the `outputFile` in config, update the script too.
- `docs/qa/test-results/` — raw per-test artifacts (failure
  screenshots/videos/traces) via `outputDir`.

Add `docs/qa/playwright-report/`, `docs/qa/playwright-results.json`, and
`docs/qa/test-results/` to `.gitignore` — these are regenerated on every
run, don't commit them. `docs/qa/<slug>/test-matrix.md` (from
`test-case-matrix`) is the one thing under `docs/qa/` that **should** be
committed — it's a planning artifact, not a build output.

## Files in this skill

- `scripts/run_e2e.py` — the test runner/orchestrator (stdlib-only Python)
- `assets/playwright.config.ts` — ready-to-use Playwright config
- `assets/e2e-workflow.yml` — GitHub Actions pipeline, copy to
  `.github/workflows/e2e.yml`
- `references/tdd-e2e-workflow.md` — red-green-refactor cycle applied to
  E2E tests specifically, and how it relates to `test-driven-development`
