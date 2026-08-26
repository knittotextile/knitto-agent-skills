---
name: webapp-testing
description: Executable, local-only E2E + TDD workflow for web apps — real Playwright config and a Python test runner, not just markdown code snippets. No CI provider or GitHub Actions wiring — everything here runs on your own machine, on demand or via an optional local git pre-push hook. Use when setting up or running E2E tests for a webapp end-to-end, not just reading patterns about it.
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
- Gating a local `git push` on the suite passing, without any CI provider

## When NOT to use

- You just need Playwright *patterns/snippets* to write a test by hand —
  use `e2e-testing` instead
- Pure unit/integration test TDD with no browser involved — use
  `test-driven-development`

## Steps

1. **Install the scaffolding.** Copy `assets/playwright.config.ts` to the
   project root (merge manually if a config already exists). Ensure
   `@playwright/test` is a dev dependency (`npm i -D @playwright/test`).

   **Always do this in the same pass, don't skip it:** check the project's
   `.gitignore` for `docs/qa/playwright-report/`, `docs/qa/test-results/`,
   and `docs/qa/playwright-results.json` (see "All output lives under
   `docs/qa/`" below) — append whatever's missing. This is mandatory setup,
   not optional cleanup: without it, the very first run stages screenshots,
   videos, and a 500KB+ report file into git. `docs/qa/<slug>/test-matrix.md`
   (from `test-case-matrix`) is the only thing under `docs/qa/` that should
   stay trackable — everything else there is regenerated output.

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
   failure — one command instead of re-deriving Playwright flags each time,
   usable the same way whether you type it yourself or the pre-push hook
   (step 5) calls it for you. Pass through Playwright options as needed:
   `--grep <pattern>`, `--project chromium`. Runs **headed** (a visible
   browser window) by default, so you can watch it work — pass `--headless`
   for unattended/agent-driven runs (an agent isn't watching the window,
   and some sandboxes have no display to open one on at all); the pre-push
   hook also runs headless for the same reason.

   Runs at Playwright's default parallel worker count even when headed —
   several Chrome windows opening at once is expected, that's what keeps a
   headed run fast instead of one test at a time.

4. **Implement until green.** Re-run `run_e2e.py` after each change until
   the new spec passes, then refactor with tests still green.

5. **Optional: gate `git push` on the suite locally — no CI provider, no
   `.github/workflows/`, nothing that goes near GitHub.** This skill
   deliberately does not ship a GitHub Actions (or any other hosted CI)
   pipeline file — running E2E is meant to stay entirely on the developer's
   own machine. If the user wants pushes gated on tests passing, install
   `assets/pre-push-hook.sh` as a local git hook:

   ```bash
   cp skills/webapp-testing/assets/pre-push-hook.sh .git/hooks/pre-push
   chmod +x .git/hooks/pre-push
   ```

   This only ever runs locally, as part of the developer's own `git push`
   — no workflow file gets created, nothing is staged, nothing is
   committed. This step is opt-in like the rest of the automation here:
   don't install the hook unless asked, since it changes the behavior of
   every future `git push` on this machine. `rm .git/hooks/pre-push` to
   remove it.

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
- `assets/pre-push-hook.sh` — optional local git pre-push hook, see step 5
- `references/tdd-e2e-workflow.md` — red-green-refactor cycle applied to
  E2E tests specifically, and how it relates to `test-driven-development`
