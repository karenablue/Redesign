import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const OUT = process.env.SHOT_DIR || "shots";
const browser = await chromium.launch();

// 1. served dev/preview homepage at desktop + mobile
const ctxD = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const pD = await ctxD.newPage();
await pD.goto("http://localhost:4321/", { waitUntil: "networkidle" });
await pD.waitForTimeout(500);
await pD.screenshot({ path: `${OUT}/served-desktop.png` });

const ctxM = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
const pM = await ctxM.newPage();
await pM.goto("http://localhost:4321/", { waitUntil: "networkidle" });
await pM.waitForTimeout(500);
await pM.screenshot({ path: `${OUT}/served-mobile.png`, fullPage: true });

// 2. the same file opened directly from disk (file://) — the common mistake
const pF = await ctxD.newPage();
await pF.goto(pathToFileURL(resolve("dist/index.html")).href, { waitUntil: "load" });
await pF.waitForTimeout(400);
await pF.screenshot({ path: `${OUT}/file-open.png` });

await browser.close();
console.log("done");
