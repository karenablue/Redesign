import { test, expect } from "@playwright/test";

/**
 * Homepage interaction checks. The homepage no longer has a hero video
 * (removed 2026-09-17), so the WCAG 2.2.2 video-control tests went with it;
 * Hero.astro still supports video and its pause control if one returns.
 */

test("each signature program card links to its section on National Programs", async ({ page }) => {
  await page.goto("/", { waitUntil: "load" });
  const links = page.locator(".program-card h4 a");
  await expect(links).toHaveCount(3);
  for (const href of await links.evaluateAll((els) => els.map((e) => e.getAttribute("href") ?? ""))) {
    expect(href).toMatch(/\/service-impact\/national-programs\/#[a-z]+$/);
  }
});
