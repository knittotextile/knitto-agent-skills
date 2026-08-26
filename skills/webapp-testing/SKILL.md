---
name: webapp-testing
description: Executable, local-only E2E + TDD workflow for web apps — real Playwright config, a Python test runner, and a custom self-contained html report (grouped by test-case-matrix category, click a test to expand its steps, every screenshot, and a slowed-down video with adjustable playback speed) — not just markdown code snippets or Playwright's bare default report. Runs up to 3 browser windows in parallel when headed, not an uncapped wall of Chrome windows. No CI provider or GitHub Actions wiring — everything here runs on your own machine, on demand or via an optional local git pre-push hook. Use when setting up or running E2E tests for a webapp end-to-end, not just reading patterns about it.
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

1. **Install the scaffolding.**
   - Copy `assets/playwright.config.ts` to the project root (merge
     manually if a config already exists).
   - Copy `scripts/run_e2e.py` and `scripts/build_report.py` to the
     project's `scripts/` folder — both assume they live next to each
     other there, and `build_report.py` assumes `scripts/` sits directly
     under the project root (that's what `docs/qa/...` resolves against).
   - Ensure `@playwright/test` is a dev dependency
     (`npm i -D @playwright/test`).

   **Always do this in the same pass, don't skip it:** check the project's
   `.gitignore` for `docs/qa/playwright-report/`, `docs/qa/test-results/`,
   `docs/qa/playwright-results.json`, and `docs/qa/report.html` (see "All
   output lives under `docs/qa/`" below) — append whatever's missing. This
   is mandatory setup, not optional cleanup: without it, the very first run
   stages screenshots, videos, and a 1MB+ report file into git.
   `docs/qa/<slug>/test-matrix.md` (from `test-case-matrix`) is the only
   thing under `docs/qa/` that should stay trackable — everything else
   there is regenerated output.

2. **Write the test first (RED).** Before implementing a new flow, write
   an E2E spec under `tests/e2e/` that describes the desired behavior. It
   should fail — see `references/tdd-e2e-workflow.md` for the full
   red-green-refactor cycle applied to E2E specifically.

   **Use `assets/step-shot-helper.ts`'s `stepShot` pattern, not a flat test
   body.** Add its `stepShot` function to the project's test fixture file,
   then wrap each logical action in it instead of writing bare
   `await`-chains:

   ```ts
   test('TC-F-01 — login success', async ({ page, loginPage }, testInfo) => {
     await stepShot(page, testInfo, 'Open /login', async () => {
       await loginPage.goto()
     })
     await stepShot(page, testInfo, 'Fill credentials and submit', async () => {
       await loginPage.login(DEMO_EMAIL, DEMO_PASSWORD)
       await expect(page.getByTestId('dashboard-page')).toBeVisible()
     })
   })
   ```

   Map each `stepShot` title to one "Steps → Expected" row from this test
   case's entry in `test-case-matrix`'s matrix — the report should show the
   same breakdown that's already written down there, not a different one
   invented per-spec. Without this, a test still runs and reports fine, it
   just has an empty step list and only the one auto "on" screenshot in the
   report (see step 3).

3. **Run the suite via the runner, not raw `npx playwright test`.**

   ```bash
   python scripts/run_e2e.py
   ```

   This wraps Playwright using the reporters set in `playwright.config.ts`
   (`list` for live terminal progress, `html`/`json` for the report and
   machine-readable results — see that file, don't pass `--reporter` on the
   CLI, it replaces the config's reporters instead of adding to them),
   prints a pass/fail/flaky summary, then automatically calls
   `build_report.py` to (re)build `docs/qa/report.html` from the fresh
   results — one command instead of re-deriving Playwright flags each time
   and remembering to rebuild the report separately, usable the same way
   whether you type it yourself or the pre-push hook (step 5) calls it for
   you. Pass through Playwright options as needed: `--grep <pattern>`,
   `--project chromium`. Runs **headed** (a visible browser window) by
   default, so you can watch it work — pass `--headless` for
   unattended/agent-driven runs (an agent isn't watching the window, and
   some sandboxes have no display to open one on at all); the pre-push hook
   also runs headless for the same reason.

   Runs up to 3 workers in parallel even when headed (`workers: 3` in
   config, capped below Playwright's uncapped default of roughly half the
   CPU cores) — enough Chrome windows at once to keep a headed run fast
   without it being an unwatchable wall of browser windows. CI stays
   pinned to 1 worker regardless.

4. **Implement until green.** Re-run `run_e2e.py` after each change until
   the new spec passes, then refactor with tests still green.

5. **Optional: gate `git push` on the suite locally — no CI provider, no
   `.github/workflows/`, nothing that goes near GitHub.** This skill
   deliberately does not ship a GitHub Actions (or any other hosted CI)
   pipeline file — running E2E is meant to stay entirely on the developer's
   own machine. If the user wants pushes gated on tests passing, install
   `assets/pre-push-hook.sh` as a local git hook:

   ```bash
   cp <path-to-this-skill>/assets/pre-push-hook.sh .git/hooks/pre-push
   chmod +x .git/hooks/pre-push
   ```

   This only ever runs locally, as part of the developer's own `git push`
   — no workflow file gets created, nothing is staged, nothing is
   committed. This step is opt-in like the rest of the automation here:
   don't install the hook unless asked, since it changes the behavior of
   every future `git push` on this machine. `rm .git/hooks/pre-push` to
   remove it.

## Two reports, two purposes

Every run produces **both**, don't treat one as replacing the other:

- **`docs/qa/report.html`** (built by `build_report.py`, step 3) — the one
  to actually look at day to day. Grouped by describe-block to match
  `test-case-matrix`'s categories, one row per test case. Click a row to
  expand its step list, every screenshot recorded via `stepShot` (not just
  the final one), and that test's video — click a screenshot to open it
  full-size in an in-page lightbox with prev/next between that test's
  photos; the video plays at 0.5× by default (a real run is fast enough to
  be hard to follow at 1×) with speed buttons (0.25×/0.5×/1×/1.5×) to
  change it — a client-side playback rate, not a re-encoded file, so
  switching speed is instant. A single self-contained file (screenshots
  and video both embedded as base64) — safe to send around without also
  sending `docs/qa/test-results/`.
- **`docs/qa/playwright-report/`** (Playwright's own html reporter) — for
  deep debugging a failure: full trace viewer, network log, DOM snapshots
  at each action. `report.html` doesn't replace this — reach for this one
  when a test actually fails and you need to see *why*, step by step at
  the framework level. Open it with
  `npx playwright show-report docs/qa/playwright-report`.

`playwright.config.ts` sets `screenshot: 'on'` and `video: 'on'` (not
`'only-on-failure'`/`'retain-on-failure'`) so every test, pass or fail,
leaves a screenshot and a video in both reports — that's what makes
`report.html` skimmable and watchable at a glance instead of a bare
pass/fail list with evidence only on failure.

## All output lives under `docs/qa/`

`playwright.config.ts` routes every generated artifact into `docs/qa/`,
next to the matrix file `test-case-matrix` writes
(`docs/qa/<slug>/test-matrix.md`) — one place for everything QA-related
instead of loose folders scattered at the project root:

- `docs/qa/playwright-report/` — Playwright's own html report
  (`open: 'never'`, see above).
- `docs/qa/playwright-results.json` — machine-readable results;
  `run_e2e.py`'s `RESULTS_PATH` and `build_report.py`'s `RESULTS_PATH` both
  read this exact path, so if you change the `outputFile` in config,
  update both scripts.
- `docs/qa/test-results/` — raw per-test artifacts (failure
  screenshots/videos/traces) via `outputDir`.
- `docs/qa/report.html` — the custom report `build_report.py` builds from
  `playwright-results.json`, see "Two reports, two purposes" above.

Add `docs/qa/playwright-report/`, `docs/qa/playwright-results.json`,
`docs/qa/test-results/`, and `docs/qa/report.html` to `.gitignore` — all
four are regenerated on every run, don't commit them.
`docs/qa/<slug>/test-matrix.md` (from `test-case-matrix`) is the one thing
under `docs/qa/` that **should** be committed — it's a planning artifact,
not a build output.

## Files in this skill

- `scripts/run_e2e.py` — the test runner/orchestrator (stdlib-only Python);
  calls `build_report.py` automatically after every run
- `scripts/build_report.py` — builds `docs/qa/report.html` from
  `playwright-results.json` (stdlib-only Python, see "Two reports, two
  purposes" above); can also be run standalone to rebuild the report
  without rerunning the suite
- `assets/playwright.config.ts` — ready-to-use Playwright config
- `assets/step-shot-helper.ts` — the `stepShot` pattern from step 2, add to
  the project's test fixtures
- `assets/pre-push-hook.sh` — optional local git pre-push hook, see step 5
- `references/tdd-e2e-workflow.md` — red-green-refactor cycle applied to
  E2E tests specifically, and how it relates to `test-driven-development`
