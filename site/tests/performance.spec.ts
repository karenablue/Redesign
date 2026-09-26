import { test, expect, type Page } from "@playwright/test";
import { ROUTES } from "./helpers";

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

for (const route of ROUTES) {
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
 * Every page on a slow phone: Largest Contentful Paint under 2.5s and
 * Cumulative Layout Shift under 0.1, the industry "good" thresholds.
 * Conditions match Lighthouse's mobile profile: 150ms RTT, 1.6 Mbps down,
 * 750 Kbps up, 4x CPU slowdown. The D9 benchmark measured every peer
 * homepage at 8-45s under these conditions.
 *
 * Serial, because CPU throttling is relative to the host: pages measured in
 * parallel would slow each other down. The preview server answers
 * instantly, so real hosting adds its response time on top; the budget
 * leaves room for that. Each page is loaded once unthrottled first, so a
 * cold server start is not counted against the first page measured.
 */
test.describe("slow phone, every page", () => {
  test.describe.configure({ mode: "serial" });

  for (const route of ROUTES) {
    test(`LCP and layout shift ${route}`, async ({ browser }) => {
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      });
      const page = await context.newPage();
      await page.goto(route, { waitUntil: "load" });

      const cold = await browser.newContext({
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      });
      const phone = await cold.newPage();
      const cdp = await cold.newCDPSession(phone);
      await cdp.send("Network.enable");
      await cdp.send("Network.emulateNetworkConditions", {
        offline: false,
        latency: 150,
        downloadThroughput: (1.6 * 1024 * 1024) / 8,
        uploadThroughput: (750 * 1024) / 8,
      });
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
      await phone.goto(route, { waitUntil: "load" });
      await phone.waitForTimeout(1500);
      const { lcp, cls } = await phone.evaluate(
        () =>
          new Promise<{ lcp: number; cls: number }>((resolve) => {
            let lcp = 0;
            let cls = 0;
            new PerformanceObserver((list) => {
              for (const e of list.getEntries()) lcp = e.startTime;
            }).observe({ type: "largest-contentful-paint", buffered: true });
            new PerformanceObserver((list) => {
              for (const e of list.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[])
                if (!e.hadRecentInput) cls += e.value;
            }).observe({ type: "layout-shift", buffered: true });
            setTimeout(() => resolve({ lcp, cls }), 200);
          })
      );
      await context.close();
      await cold.close();
      expect(lcp, `${route} LCP was ${(lcp / 1000).toFixed(2)}s on slow 4G; budget 2.5s`).toBeLessThanOrEqual(2500);
      expect(cls, `${route} layout shift was ${cls.toFixed(3)}; budget 0.1`).toBeLessThanOrEqual(0.1);
    });
  }
});
