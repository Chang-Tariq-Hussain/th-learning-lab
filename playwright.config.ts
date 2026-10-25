import { defineConfig, devices } from "@playwright/test";

/**
 * Browser tests for the critical UI flows (drawer, nav state, toasts, double-submit, 320px overflow).
 *
 *   E2E_MODE=accounts (default)  needs the account-mode stack (Postgres + PostgREST + fake auth, see
 *                                scripts/e2e-accounts/README.md and docs/e2e.md). Covers everything.
 *   E2E_MODE=password            needs only ADMIN_PASSWORD / ADMIN_SESSION_SECRET. Skips tests that need the database.
 *
 * The app must already be built (`next build`); the suite starts `next start` unless E2E_BASE_URL is set.
 * Tests change data in one shared database, so they run one at a time.
 */
const PORT = process.env.E2E_PORT ?? "3122";
const baseURL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"]],
  outputDir: "test-results",
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    // Set PW_CHROMIUM to use a browser that is already installed instead of `playwright install`.
    launchOptions: { executablePath: process.env.PW_CHROMIUM || undefined, args: ["--no-sandbox"] },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : { command: `npx next start -p ${PORT}`, url: baseURL, reuseExistingServer: true, timeout: 120_000 },
});
