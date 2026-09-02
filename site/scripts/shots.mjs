import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const OUT = process.env.SHOT_DIR || "shots";
mkdirSync(OUT, { recursive: true });

const pages = [
  ["home", "/"],
  ["herstory", "/about/herstory/"],
  ["founders", "/about/our-founders/"],
  ["grand-basileus", "/leadership/international-grand-basileus/"],
  ["become-a-member", "/membership/become-a-member/"],
  ["national-programs", "/service-impact/national-programs/"],
];

const base = process.env.BASE_URL || "http://localhost:4321";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();

for (const [name, path] of pages) {
  await page.goto(base + path, { waitUntil: "networkidle" });
  // scroll to bottom to trigger lazy-loaded images, then back to top
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(500);
  // above-the-fold
  await page.screenshot({ path: `${OUT}/${name}-fold.png` });
  // full page
  await page.screenshot({ path: `${OUT}/${name}-full.png`, fullPage: true });
  console.log("shot", name);
}

await browser.close();
