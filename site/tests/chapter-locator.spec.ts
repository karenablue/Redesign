import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";

// The list is HQ's chapter records (scripts/sync-chapters.mjs). Chapters named
// below are checked against that data as retrieved; if a re-sync drops one,
// pick another from src/data/chapter-directory.json.
const directory = JSON.parse(
  readFileSync(new URL("../src/data/chapter-directory.json", import.meta.url), "utf8")
);

const route = "/membership/chapter-locator/";
const visibleCards = ".chapter-result:visible";

test("every chapter in HQ's records is listed, and Southeastern chapter search works", async ({
  page,
}) => {
  await page.goto(`${route}?q=Alpha+Beta&region=Southeastern&type=undergraduate`);
  expect(directory.chapters.length).toBeGreaterThan(600);
  await expect(page.locator(".chapter-result")).toHaveCount(directory.chapters.length);
  await expect(page.locator(visibleCards)).toHaveCount(1);
  await expect(page.locator(visibleCards)).toContainText("Tennessee State University");
  await expect(page.locator(visibleCards)).toContainText("Nashville, TN");
  await expect(page.locator(`${visibleCards} a`)).toHaveAttribute(
    "href",
    "https://www.seregionsgrho.org/team-3"
  );
  await page.goto(`${route}?q=Lambda+Nu+Sigma+Montreal&region=Northeastern&type=alumnae`);
  await expect(page.locator(visibleCards)).toHaveCount(1);
  await expect(page.locator(visibleCards)).toContainText("Montreal, Canada");
  // A chapter with its own website links there instead of the regional directory.
  await expect(page.locator(`${visibleCards} a`)).toHaveAttribute(
    "href",
    "https://www.lambdanusigma.ca/"
  );
  await page.goto(`${route}?q=Zeta+Upsilon+Sigma&region=Southeastern&type=alumnae`);
  await expect(page.locator(visibleCards)).toHaveCount(1);
  await expect(page.locator(visibleCards)).toContainText("U.S. Virgin Islands");
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
    "Eta",
    "Kappa",
    "Lambda",
    "Mu",
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
  await expect(page.locator(visibleCards)).toContainText("Theta Chi Sigma");
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

test("chapter-type guides apply the matching directory filter", async ({ page }) => {
  await page.goto(route);
  await page.getByRole("button", { name: "Show alumnae chapters" }).click();
  await expect(page.getByRole("button", { name: "Alumnae", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true"
  );
  await expect(page).toHaveURL(/type=alumnae/);
  await expect(page.locator(visibleCards).first()).toContainText("Alumnae");

  await page.getByRole("button", { name: "Show undergraduate chapters" }).click();
  await expect(page.getByRole("button", { name: "Undergraduate", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true"
  );
  await expect(page).toHaveURL(/type=undergraduate/);
  await expect(page.locator(visibleCards).first()).toContainText("Undergraduate");
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

test("international chapters are searchable and link to their directory or website", async ({
  page,
}) => {
  await page.goto(`${route}?q=Ghana&type=alumnae&region=Northeastern`);
  await expect(page.locator(visibleCards)).toHaveCount(1);
  await expect(page.locator(visibleCards)).toContainText("Nu Lambda Sigma");
  await expect(page.locator(visibleCards)).toContainText("Accra, Ghana");
  await expect(page.locator(`${visibleCards} a`)).toHaveAttribute(
    "href",
    "https://www.sgrhoneregion.org/chapter-locator-2"
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
    "https://www.sgrhoneregion.org/chapter-locator-2"
  );

  await page.goto(`${route}?q=Nu+Iota&region=Southwestern&type=undergraduate`);
  await expect(page.locator(visibleCards)).toHaveCount(1);
  await expect(page.locator(visibleCards)).toContainText("University of Texas at Arlington");
  await expect(page.locator(`${visibleCards} a`)).toHaveAttribute(
    "href",
    "http://www.uta.edu/greek/"
  );
  await page.goto(`${route}?q=Texas&region=Southwestern`);
  await expect(page.locator(visibleCards).first()).toContainText("Southwestern Region");
});

test("the map loads on approach and follows the filters", async ({ page }) => {
  await page.goto(route);
  const map = page.locator("#chapter-map");
  await expect(map.locator(".chapter-map__placeholder")).toBeVisible();
  await map.scrollIntoViewIfNeeded();
  await expect(map.locator("canvas")).toBeVisible({ timeout: 20_000 });
  await page.locator("#chapter-search").fill("Texas");
  await page.getByRole("button", { name: "Find Chapters", exact: true }).click();
  await expect(page.locator("#search-message")).toContainText('for "Texas"');
});

test("chapters show a logo for each social account, and bad web addresses fall back", async ({
  page,
}) => {
  // HQ's "website" for Theta Epsilon is its Facebook page: shown as the logo.
  await page.goto(`${route}?q=Theta+Epsilon+Los+Angeles`);
  await expect(page.locator(visibleCards)).toHaveCount(1);
  const facebook = page.getByRole("link", { name: "Theta Epsilon on Facebook (opens in a new tab)" });
  await expect(facebook).toHaveAttribute("href", "https://www.facebook.com/thetaepsgrho");
  await expect(facebook.locator("svg")).toBeVisible();
  await expect(page.locator(visibleCards)).not.toContainText("Chapter website");

  // "http://etaxisgrho@weebly.com" is not a working site: link the region instead.
  await page.goto(`${route}?q=Eta+Xi+Woodstock`);
  await expect(page.locator(visibleCards)).toHaveCount(1);
  await expect(page.locator(`${visibleCards} a`)).toHaveAttribute(
    "href",
    "https://www.sgrhoneregion.org/chapter-locator-2"
  );
});

test("every name in chapter-socials.json matches a chapter", () => {
  const socials = JSON.parse(
    readFileSync(new URL("../src/data/chapter-socials.json", import.meta.url), "utf8")
  );
  const names = new Set(directory.chapters.map((c: { name: string }) => c.name));
  expect(Object.keys(socials).filter((name) => !names.has(name))).toEqual([]);
});
