import { test, expect } from "@playwright/test";

const route = "/membership/chapter-locator/";
const visibleCards = ".chapter-result:visible";

test("completed import includes all assigned listings and Southeastern chapter search", async ({
  page,
}) => {
  await page.goto(`${route}?q=Alpha+Beta&region=Southeastern&type=undergraduate`);
  await expect(page.locator(".chapter-result")).toHaveCount(719);
  await expect(page.locator(visibleCards)).toHaveCount(1);
  await expect(page.locator(visibleCards)).toContainText("Tennessee State University");
  await expect(page.locator(visibleCards)).toContainText("Nashville, TN");
  await expect(page.locator(`${visibleCards} a`)).toHaveAttribute(
    "href",
    "https://www.seregionsgrho.org/team-3"
  );
  await page.goto(`${route}?q=Lambda+Nu+Sigma+Toronto&region=Northeastern&type=alumnae`);
  await expect(page.locator(visibleCards)).toHaveCount(1);
  await expect(page.locator(visibleCards)).toContainText("Toronto, Ontario, Canada");
  await page.goto(`${route}?q=Xi+Pi+Virgin&region=Southeastern&type=undergraduate`);
  await expect(page.locator(visibleCards)).toHaveCount(1);
  await expect(page.locator(visibleCards)).toContainText("U.S. Virgin Islands");
  await expect(page.locator(`${visibleCards} .chapter-result__location`)).not.toContainText(",");
});

test("single-letter chapter sequence comes before double-letter chapter names", async ({
  page,
}) => {
  await page.goto(`${route}?region=Central&type=undergraduate`);
  await expect(page.locator(`${visibleCards} h3`).first()).toHaveText("Alpha");
  const names = await page.locator(`${visibleCards} h3`).allTextContents();
  expect(names.slice(0, 6).map((name) => name.trim())).toEqual([
    "Alpha",
    "Epsilon",
    "Zeta",
    "Eta",
    "Kappa",
    "Lambda",
  ]);
  const allNames = await page.locator(".chapter-result h3").allTextContents();
  expect(allNames.findIndex((name) => name.trim() === "Psi")).toBeLessThan(
    allNames.findIndex((name) => name.trim() === "Alpha Delta")
  );
});

test("search finds sourced chapters by city, university and full state name", async ({ page }) => {
  await page.goto(route);
  await page.locator("#chapter-search").fill("Chicago IL");
  await page.getByRole("button", { name: "Find Chapters", exact: true }).click();
  await expect(page.locator(visibleCards)).toContainText(
    Array(await page.locator(visibleCards).count()).fill("Chicago, IL")
  );
  await page.getByRole("button", { name: "Alumnae", exact: true }).click();
  await expect(page.locator(visibleCards)).toHaveCount(1);
  await expect(page.locator(visibleCards)).toContainText("Delta Sigma");
  await expect(page.locator(`${visibleCards} a`)).toHaveAttribute(
    "href",
    "https://www.sgrhocentral.com/chapter-locator"
  );

  await page.getByRole("button", { name: "Clear filters" }).click();
  await page.locator("#chapter-search").fill("Butler University");
  await page.getByRole("button", { name: "Find Chapters", exact: true }).click();
  await expect(page.locator(visibleCards)).toHaveCount(1);
  await expect(page.locator(visibleCards)).toContainText("Indianapolis, IN");

  await page.locator("#chapter-search").fill("California");
  await page.getByRole("button", { name: "Find Chapters", exact: true }).click();
  await expect(page.locator(visibleCards).first()).toContainText("Western Region");
  await expect(page.locator("#search-message")).toContainText("Showing 12");
  await page.getByRole("button", { name: "Show more chapters" }).click();
  await expect(page.locator(visibleCards)).toHaveCount(24);
});

test("filters survive reload and browser back; missing coverage has a regional fallback", async ({
  page,
}) => {
  await page.goto(`${route}?q=Chicago+IL&type=alumnae`);
  await expect(page.locator(visibleCards)).toHaveCount(1);
  await expect(page.getByRole("button", { name: "Alumnae", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true"
  );
  await page.locator("#chapter-region").selectOption("Northeastern");
  await expect(page.locator("#empty-state")).toBeVisible();
  await expect(page.locator("#empty-state a")).toHaveAttribute("href", "#regional-directories");
  await page.goBack();
  await expect(page.locator(visibleCards)).toHaveCount(1);
  await page.reload();
  await expect(page.locator(visibleCards)).toHaveCount(1);
  await page.locator("#chapter-search").fill("60601");
  await page.getByRole("button", { name: "Find Chapters", exact: true }).click();
  await expect(page.locator("#search-message")).toContainText("ZIP search is unavailable");
});

for (const width of [375, 768, 1440]) {
  test(`locator fits at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(route);
    await expect(page.locator(visibleCards)).toHaveCount(12);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true
    );
    await expect(page.locator("main h1")).toHaveCount(1);
  });
}

test("new regional and international sources are searchable with accurate source links", async ({
  page,
}) => {
  await page.goto(`${route}?q=Ghana&type=alumnae&region=Northeastern`);
  await expect(page.locator(visibleCards)).toHaveCount(1);
  await expect(page.locator(visibleCards)).toContainText("Nu Lambda Sigma");
  await expect(page.locator(visibleCards)).toContainText("Accra, Ghana");
  await expect(page.locator(`${visibleCards} a`)).toHaveAttribute(
    "href",
    "https://www.sgrhoneregion.org/international-chapters"
  );
  await page.locator("#chapter-search").fill("Bermuda");
  await page.getByRole("button", { name: "Find Chapters", exact: true }).click();
  await expect(page.locator(visibleCards)).toHaveCount(1);
  await expect(page.locator(visibleCards)).toContainText("Gamma Sigma Sigma");

  await page.goto(`${route}?q=Beta+Tau&region=Northeastern&type=undergraduate`);
  await expect(page.locator(visibleCards)).toHaveCount(1);
  await expect(page.locator(visibleCards)).toContainText("Baltimore, MD");
  await expect(page.locator(`${visibleCards} a`)).toHaveAttribute(
    "href",
    "https://www.sgrhoneregion.org/maryland"
  );

  await page.goto(`${route}?q=Nu+Iota&region=Southwestern&type=undergraduate`);
  await expect(page.locator(visibleCards)).toHaveCount(1);
  await expect(page.locator(visibleCards)).toContainText("University of Texas at Arlington");
  await expect(page.locator(`${visibleCards} a`)).toHaveAttribute(
    "href",
    /mid=1xG4niXX33pUVIJBC4e6eWFAjd3LVi3CE/
  );
  await page.goto(`${route}?q=Texas&region=Southwestern`);
  await expect(page.locator(visibleCards).first()).toContainText("Southwestern Region");
});
