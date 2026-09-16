import { test, expect } from "@playwright/test";
import { ROUTES } from "./helpers";

/**
 * Page health: does every route load, and does it carry the things a page
 * needs to be findable and legible at all?
 */
for (const route of ROUTES) {
  test(`smoke ${route}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(`console: ${m.text()}`);
    });

    const response = await page.goto(route, { waitUntil: "networkidle" });
    expect(response?.status(), `${route} should return 200`).toBe(200);

    await expect(page.locator("h1"), `${route} needs exactly one h1`).toHaveCount(1);
    await expect(page.locator("main"), `${route} needs exactly one <main>`).toHaveCount(1);

    const title = await page.title();
    expect(title.trim(), `${route} needs a <title>`).not.toBe("");

    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content")
      .catch(() => null);
    expect(description?.trim(), `${route} needs a meta description`).toBeTruthy();

    expect(errors, `${route} logged JS errors:\n${errors.join("\n")}`).toEqual([]);
  });
}

test("every page title is unique", async ({ page }) => {
  const seen = new Map<string, string[]>();
  for (const route of ROUTES) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const title = await page.title();
    if (!seen.has(title)) seen.set(title, []);
    seen.get(title)!.push(route);
  }
  const duplicates = [...seen.entries()].filter(([, routes]) => routes.length > 1);
  expect(
    duplicates,
    `Duplicate <title> values:\n${duplicates.map(([t, r]) => `  "${t}" on ${r.join(", ")}`).join("\n")}`
  ).toEqual([]);
});

test("a bad URL gets the custom 404, not a blank page", async ({ page }) => {
  const response = await page.goto("/definitely-not-a-real-route/", { waitUntil: "networkidle" });
  expect(response?.status()).toBe(404);
  // The 404 should still be a real page of the site, not a bare error string.
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("header")).toBeVisible();
  await expect(page.locator("footer")).toBeVisible();
});

test("no internal link 404s, and every #anchor resolves", async ({ page }) => {
  // One test crawls every route with `networkidle`. That normally takes
  // 16–22s, and the default 30s budget failed twice under full-suite load
  // (Sept 2026) with no broken link involved. The budget is raised; the
  // assertions are unchanged.
  test.setTimeout(90_000);
  const checked = new Map<string, number>();
  const brokenAnchors: string[] = [];

  for (const route of ROUTES) {
    await page.goto(route, { waitUntil: "networkidle" });
    const hrefs = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]"))
        .map((a) => a.getAttribute("href")!)
        .filter((h) => h && !/^(https?:|mailto:|tel:)/.test(h))
    );

    for (const href of hrefs) {
      const [path, hash] = href.split("#");
      if (hash && (path === "" || path === route)) {
        // getElementById needs no escaping, and runs in the page where the
        // `CSS` global actually exists.
        const found = await page.evaluate((id) => !!document.getElementById(id), hash);
        if (!found) brokenAnchors.push(`${route} -> #${hash} (no element with that id)`);
      }
      if (!path) continue;
      if (!checked.has(path)) {
        const res = await page.request.get(path);
        checked.set(path, res.status());
      }
    }
  }

  const broken = [...checked.entries()].filter(([, status]) => status >= 400);
  expect(
    broken,
    `Broken internal links:\n${broken.map(([p, s]) => `  ${s}  ${p}`).join("\n")}`
  ).toEqual([]);
  expect(brokenAnchors, `Anchors pointing at missing ids:\n${brokenAnchors.join("\n")}`).toEqual([]);
});
