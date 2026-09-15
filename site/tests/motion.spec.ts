import { test, expect } from "@playwright/test";

/**
 * WCAG 2.2.2 (Pause, Stop, Hide) for the homepage hero video, plus
 * prefers-reduced-motion. The clip loops forever, so without a working
 * control there is no way to stop it.
 */

test.describe("hero video, default motion settings", () => {
  test("autoplays, and the toggle pauses and resumes it", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const video = page.locator("video[data-hero-video]");
    await expect(video).toHaveCount(1);
    await expect(video).toHaveAttribute("aria-hidden", "true");

    await page.waitForTimeout(400);
    expect(await video.evaluate((v: HTMLVideoElement) => v.paused), "should autoplay").toBe(false);

    const toggle = page.locator("[data-hero-motion]");
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-pressed", "false");

    // The control itself must be operable: 44px is the 2.5.5 target size.
    const box = await toggle.boundingBox();
    expect(box!.height, "the motion toggle must be at least 44px tall").toBeGreaterThanOrEqual(44);

    await toggle.click();
    expect(await video.evaluate((v: HTMLVideoElement) => v.paused), "click should pause").toBe(true);
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await expect(toggle).toContainText(/play/i);

    await toggle.click();
    expect(await video.evaluate((v: HTMLVideoElement) => v.paused), "click should resume").toBe(false);
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await expect(toggle).toContainText(/pause/i);
  });
});

test.describe("hero video, prefers-reduced-motion", () => {
  test("never plays a frame, but can still be opted into", async ({ page }) => {
    // Emulated explicitly rather than via test.use({ reducedMotion }): under
    // this config the fixture option did not reach the page (matchMedia still
    // reported false), which made the test fail against correct site code.
    // emulateMedia is unambiguous, and must run before goto so the hero's
    // inline script sees the preference on first evaluation.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "networkidle" });

    expect(
      await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches),
      "guard: the reduced-motion emulation must actually be active, or this test proves nothing"
    ).toBe(true);
    const video = page.locator("video[data-hero-video]");
    await page.waitForTimeout(1200);

    const state = await video.evaluate((v: HTMLVideoElement) => ({
      paused: v.paused,
      currentTime: v.currentTime,
    }));
    expect(state.paused, "reduced motion must leave the video paused").toBe(true);
    expect(state.currentTime, "reduced motion must not advance the video").toBe(0);

    // The control must report "play", so a user who wants the motion can get it.
    const toggle = page.locator("[data-hero-motion]");
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await expect(toggle).toContainText(/play/i);

    await toggle.click();
    expect(await video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(false);
  });
});

test("the program spotlight is keyboard-operable and does not navigate", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const rows = page.locator(".program-index__row");
  const count = await rows.count();
  expect(count).toBeGreaterThan(1);

  // Buttons, not links — these swap content in place, they don't go anywhere.
  for (let i = 0; i < count; i++) {
    await expect(rows.nth(i)).toHaveJSProperty("tagName", "BUTTON");
    await expect(rows.nth(i)).toHaveAttribute("aria-controls", "program-spotlight");
  }

  const spotlight = page.locator("#program-spotlight");
  await expect(spotlight).toHaveAttribute("aria-live", "polite");

  // Exactly one row is ever current.
  await expect(page.locator('.program-index__row[aria-current="true"]')).toHaveCount(1);

  const urlBefore = page.url();
  const before = await spotlight.locator(".program-spotlight__eyebrow").innerText();

  await rows.first().focus();
  await page.keyboard.press("Enter");

  expect(page.url(), "activating a program must not navigate").toBe(urlBefore);
  await expect(spotlight.locator(".program-spotlight__eyebrow")).not.toHaveText(before);
  await expect(page.locator('.program-index__row[aria-current="true"]')).toHaveCount(1);
});
