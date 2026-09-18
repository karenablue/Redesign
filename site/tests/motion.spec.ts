import { test, expect } from "@playwright/test";

/**
 * WCAG 2.2.2 (Pause, Stop, Hide) for the homepage hero video, plus
 * prefers-reduced-motion. The clip loops forever, so without a working
 * control there is no way to stop it.
 */

test.describe("hero video, default motion settings", () => {
  test("autoplays on a wide viewport, and the toggle pauses and resumes it", async ({ page }) => {
    test.skip(
      (page.viewportSize()?.width ?? 0) < 900,
      "narrow viewports deliberately do not stream the clip — covered by the next test"
    );
    await page.goto("/", { waitUntil: "load" });

    const video = page.locator("video[data-hero-video]");
    await expect(video).toHaveCount(1);
    await expect(video).toHaveAttribute("aria-hidden", "true");

    const toggle = page.locator("[data-hero-motion]");
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await expect
      .poll(() => video.evaluate((v: HTMLVideoElement) => v.paused), { timeout: 15_000 })
      .toBe(false);

    // The control itself must be operable: 44px is the 2.5.5 target size.
    const box = await toggle.boundingBox();
    expect(box!.height, "the motion toggle must be at least 44px tall").toBeGreaterThanOrEqual(44);

    await toggle.click();
    expect(await video.evaluate((v: HTMLVideoElement) => v.paused), "click should pause").toBe(
      true
    );
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await expect(toggle).toContainText(/play/i);

    await toggle.click();
    await expect
      .poll(() => video.evaluate((v: HTMLVideoElement) => v.paused), { timeout: 15_000 })
      .toBe(false);
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await expect(toggle).toContainText(/pause/i);
  });

  test("a phone does not download the clip unasked, but can opt in", async ({ page }) => {
    test.skip(
      (page.viewportSize()?.width ?? 0) >= 900,
      "wide viewports stream it — covered by the previous test"
    );
    await page.goto("/", { waitUntil: "load" });
    const video = page.locator("video[data-hero-video]");

    // preload="none" plus no autoplay attribute: nothing should be buffered.
    await page.waitForTimeout(1200);
    const state = await video.evaluate((v: HTMLVideoElement) => ({
      paused: v.paused,
      networkState: v.networkState, // 0 EMPTY / 1 IDLE — not 2 LOADING
      buffered: v.buffered.length,
      hasPoster: !!v.getAttribute("poster"),
    }));
    expect(state.paused, "a phone must not autoplay the hero clip").toBe(true);
    expect(state.buffered, "nothing should be buffered before the visitor asks").toBe(0);
    expect(state.hasPoster, "the poster carries the hero instead").toBe(true);

    // Opting in must still work.
    const toggle = page.locator("[data-hero-motion]");
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await expect(toggle).toContainText(/play/i);
    await toggle.click();
    await expect
      .poll(() => video.evaluate((v: HTMLVideoElement) => v.paused), { timeout: 20_000 })
      .toBe(false);
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

test("each signature program card links to its section on National Programs", async ({ page }) => {
  await page.goto("/", { waitUntil: "load" });
  const links = page.locator(".program-row__go");
  await expect(links).toHaveCount(5);
  for (const href of await links.evaluateAll((els) =>
    els.map((e) => e.getAttribute("href") ?? "")
  )) {
    expect(href).toMatch(/\/service-impact\/national-programs\/#[a-z]+$/);
  }
});
