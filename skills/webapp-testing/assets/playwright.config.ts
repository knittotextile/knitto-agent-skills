import { defineConfig, devices } from '@playwright/test'

// All Playwright output lives under docs/qa/ — next to test-matrix.md from
// the test-case-matrix skill — so everything QA-related for this app is in
// one place instead of scattered loose folders at the project root.
const QA_DIR = 'docs/qa'

// Headless in CI, or when HEADLESS=true is set explicitly for an
// unattended/agent-driven local run. Headed otherwise (a human at a
// terminal, watching).
const isHeadless = !!process.env.CI || process.env.HEADLESS === 'true'

export default defineConfig({
  testDir: './tests/e2e',
  // Raw per-test artifacts (failure screenshots/videos/traces before the
  // html report bundles them) — also under docs/qa/, not the default
  // root-level test-results/.
  outputDir: `${QA_DIR}/test-results`,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // 1 worker when headed — parallel workers each open their own browser
  // window, so a headed run with the default parallel worker count pops
  // open several Chrome windows at once instead of one test at a time.
  // Headless runs (CI, or an agent with --headless) keep full parallelism
  // since there's no window to be confusing about.
  workers: process.env.CI ? 1 : isHeadless ? undefined : 1,
  reporter: [
    // 'list' gives live pass/fail progress in the terminal while the suite
    // runs — without it, specifying html/json here replaces Playwright's
    // default reporter entirely and the terminal stays silent until the
    // whole run finishes.
    ['list'],
    // open: 'never' — don't auto-launch a browser tab with the report when
    // run outside CI; that's surprising/disruptive when this is invoked by
    // an agent rather than a human at a terminal. Open it manually with
    // `npx playwright show-report docs/qa/playwright-report` when you want
    // to see it.
    ['html', { outputFolder: `${QA_DIR}/playwright-report`, open: 'never' }],
    ['json', { outputFile: `${QA_DIR}/playwright-results.json` }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    headless: isHeadless,
    trace: 'on-first-retry',
    // 'on' (not 'only-on-failure') so every test — pass or fail — leaves a
    // final screenshot attached in the html report; that's what makes the
    // report visually useful to skim instead of just a pass/fail list.
    screenshot: 'on',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
})
