import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { mkdirSync } from "node:fs";

const OUT = process.env.SHOT_DIR || "slices";
mkdirSync(OUT, { recursive: true });
const target = process.env.TARGET || pathToFileURL(resolve("..", "index.html")).href;
const label = process.env.LABEL || "orig";
const SLICE = 1100;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: SLICE } });
const page = await ctx.newPage();
await page.goto(target, { waitUntil: "load" });
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 500) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 50));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(600);
const h = await page.evaluate(() => document.body.scrollHeight);
let i = 0;
for (let y = 0; y < h; y += SLICE) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(150);
  await page.screenshot({ path: `${OUT}/${label}-${String(i).padStart(2, "0")}.png` });
  i++;
}
await browser.close();
console.log(`${label}: ${i} slices, page height ${h}`);
