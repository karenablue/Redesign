import { test, expect, type Page } from "@playwright/test";

/**
 * Page-weight budget.
 *
 * The D9 benchmark (Sept 2026) measured peer homepages at 8–24 MB; the live
 * SGRho site is 0.9 MB. This keeps the rebuild from drifting toward its peers
 * after handover, when nobody is watching image sizes.
 *
 * Bytes are what crossed the wire (CDP encodedDataLength), after load plus a
 * short settle so lazy images near the fold are counted. The hero video is
 * reported separately: it is a deliberate choice, plays only on wide
 * viewports, and never downloads on a phone or under reduced motion (see
 * motion.spec.ts), so it gets its own budget rather than hiding in the total.
 */
const MB = 1024 * 1024;
const BUDGETS = {
  /** Everything except video, on any viewport. */
  page: 2 * MB,
  /** The hero clip, wide viewports only. */
  video: 4 * MB,
};

const PAGES = ["/", "/membership/become-a-member/", "/news-events/upcoming-events/"] as const;

async function weigh(page: Page, route: string) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  const types = new Map<string, string>();
  let other = 0;
  let video = 0;
  cdp.on("Network.responseReceived", (e) => types.set(e.requestId, e.type));
  cdp.on("Network.loadingFinished", (e) => {
    if (types.get(e.requestId) === "Media") video += e.encodedDataLength;
    else other += e.encodedDataLength;
  });
  await page.goto(route, { waitUntil: "load" });
  await page.waitForTimeout(1500);
  return { other, video };
}

const fmt = (b: number) => `${(b / MB).toFixed(2)} MB`;

for (const route of PAGES) {
  test(`page weight ${route}`, async ({ page }) => {
    const { other, video } = await weigh(page, route);
    expect(other, `${route} downloads ${fmt(other)} excluding video; budget ${fmt(BUDGETS.page)}`).toBeLessThanOrEqual(BUDGETS.page);
    expect(video, `${route} downloads ${fmt(video)} of video; budget ${fmt(BUDGETS.video)}`).toBeLessThanOrEqual(BUDGETS.video);
  });
}

test("page weight / on a phone stays inside the page budget with no video", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  const { other, video } = await weigh(page, "/");
  await context.close();
  expect(video, "a phone should not download the hero clip unasked").toBe(0);
  expect(other, `phone homepage downloads ${fmt(other)}; budget ${fmt(BUDGETS.page)}`).toBeLessThanOrEqual(BUDGETS.page);
});
