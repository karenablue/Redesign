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

/**
 * Largest Contentful Paint on a slow phone, the industry "good" threshold
 * (2.5s). Conditions match Lighthouse's mobile profile: 150ms RTT,
 * 1.6 Mbps down, 750 Kbps up, 4x CPU slowdown. The D9 benchmark measured
 * every peer homepage at 8–45s under these conditions.
 *
 * The preview server answers instantly, so real hosting adds its response
 * time on top; the budget leaves room for that.
 */
test("homepage LCP on a slow 4G phone stays under 2.5s", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 150,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
  });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await page.goto("/", { waitUntil: "load" });
  await page.waitForTimeout(1500);
  const lcp = await page.evaluate(
    () =>
      new Promise<number>((resolve) => {
        new PerformanceObserver((list) => resolve(list.getEntries().at(-1)!.startTime)).observe({
          type: "largest-contentful-paint",
          buffered: true,
        });
      })
  );
  await context.close();
  expect(lcp, `homepage LCP was ${(lcp / 1000).toFixed(2)}s on slow 4G; budget 2.5s`).toBeLessThanOrEqual(2500);
});
