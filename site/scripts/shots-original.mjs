import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { mkdirSync } from "node:fs";

const OUT = process.env.SHOT_DIR || "shots-orig";
mkdirSync(OUT, { recursive: true });
const ROOT = resolve("..");

const pages = [
  ["home", "index.html"],
  ["herstory", "about/herstory/herstory.html"],
  ["founders", "about/our-founders/founders.html"],
  ["grand-basileus", "leadership/international-grand-basileus/grandbasileus.html"],
  ["become-a-member", "membership/become-a-member/becomeamember.html"],
  ["national-programs", "service-impact/national-programs/nationalprograms.html"],
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

for (const [name, rel] of pages) {
  const url = pathToFileURL(resolve(ROOT, rel)).href;
  await page.goto(url, { waitUntil: "load" });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/${name}-fold.png` });
  await page.screenshot({ path: `${OUT}/${name}-full.png`, fullPage: true });
  console.log("shot", name);
}
await browser.close();
