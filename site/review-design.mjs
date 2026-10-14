import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ reducedMotion: "reduce" });
await mkdir("design-review", { recursive: true });
const routes = process.argv.slice(2);
for (const route of routes) {
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    const response = await page.goto(`http://localhost:4335${route}`, { waitUntil: "load" });
    if (!response.ok()) throw new Error(`${route}: HTTP ${response.status()}`);
    await page.evaluate(() => document.fonts.ready);
    for (const img of await page.locator("main img").all()) {
      await img.evaluate(el => { el.loading = "eager"; });
    }
    const failed = await page.evaluate(async () => {
      const images = Array.from(document.querySelectorAll("main img"));
      await Promise.allSettled(images.map(img => img.decode()));
      return images.filter(img => !img.naturalWidth).map(img => img.getAttribute("src"));
    });
    if (failed.length) console.log("Failed images", route, JSON.stringify(failed));
    await page.screenshot({path:`design-review/${route.replaceAll("/", "_") || "home"}-${width}.png`, fullPage: true});
    await page.screenshot({path:`design-review/${route.replaceAll("/", "_") || "home"}-${width}-opening.png`});
    const report = await page.evaluate(() => ({overflow: document.documentElement.scrollWidth > innerWidth + 1, h1: document.querySelectorAll("h1").length}));
    console.log(route, width, JSON.stringify(report));
  }
}
await browser.close();
