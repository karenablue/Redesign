import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config for the SGRho rebuild.
 *
 * The suite in tests/ is an accessibility + regression harness, not a
 * feature-behaviour suite — this is a static content site, so what actually
 * breaks is contrast, mobile overflow, silently-dead CSS tokens, and
 * semantics. Each spec file here exists because that class of bug was found
 * by hand at least once; the tests keep it from coming back.
 *
 * `webServer` starts Astro itself, so `npx playwright test` and the VS Code
 * extension both work from a cold start with no separate terminal. An
 * already-running dev server on 4321 is reused instead of double-started.
 */
export default defineConfig({
  testDir: "./tests",

  // Astro dev compiles on first request; a cold page can exceed the 5s default.
  timeout: 30_000,
  expect: { timeout: 10_000 },

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["html"], ["github"]] : [["html", { open: "never" }], ["list"]],

  use: {
    baseURL: "http://localhost:4322",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"] },
      // The slow-phone speed checks run in their own project, below.
      grepInvert: /slow phone, every page/,
    },
    // Mobile matters disproportionately here and is where the layout bugs
    // actually live. Pixel 7 uses the same Chromium binary, so this project
    // costs no extra download.
    //
    // It runs only the specs whose result depends on the viewport. a11y,
    // responsive and design-tokens either drive their own viewports or test
    // viewport-independent things, so running them here would just double
    // the suite runtime for identical results.
    {
      name: "mobile",
      use: { ...devices["Pixel 7"] },
      testMatch: /(smoke|motion)\.spec\.ts/,
    },
    // The slow-phone speed checks throttle the CPU relative to this machine,
    // so running them beside other tests measured the other tests too: the
    // homepage read 1.9s alone and 2.6-3.0s mid-suite. They run last, on
    // their own, once desktop and mobile have finished. (If either of those
    // fails, Playwright skips this project; fix that first.)
    {
      name: "speed",
      use: { ...devices["Desktop Chrome"] },
      testMatch: /performance\.spec\.ts/,
      grep: /slow phone, every page/,
      dependencies: ["desktop", "mobile"],
    },
  ],

  // Tests run against the BUILT site (astro preview), not `astro dev`, for
  // two reasons learned the hard way:
  //   1. The dev toolbar renders in shadow DOM, and Playwright locators pierce
  //      shadow roots — it contributed 4 phantom <h1>s to every page.
  //   2. The dev server has served stale compiled CSS in this project before.
  // Preview serves dist/ off disk, so `npm run build` refreshes what the
  // running server returns without needing a restart. Port 4322 keeps it
  // clear of a `npm run dev` on 4321.
  webServer: {
    command: "npm run preview:ci",
    url: "http://localhost:4322",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
