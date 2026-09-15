import { test, expect } from "@playwright/test";
import { ROUTES, WIDTHS } from "./helpers";

/**
 * No page may scroll horizontally at any supported width.
 *
 * This spec sets its own viewports, so it runs once (desktop project) rather
 * than twice. The failure message names the widest offending element — a
 * bare "scrollWidth > clientWidth" assertion sends you hunting, and the
 * culprit is usually one unbreakable heading or one un-collapsed grid.
 */
// Runs on the desktop project only — see the `mobile` project's testMatch in
// playwright.config.ts. This spec drives its own viewports.
for (const route of ROUTES) {
  test(`no horizontal overflow ${route}`, async ({ page }) => {
    const problems: string[] = [];

    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 900 });
      // "load", not "networkidle": the homepage hero video is ~31MB and loops,
      // so the network never goes idle — five navigations per test then blew
      // the 30s budget. Layout is settled at "load", which is what this spec
      // measures. (That the page cannot reach network idle is a real
      // performance problem, tracked separately from this assertion.)
      await page.goto(route, { waitUntil: "load" });

      const result = await page.evaluate((vw) => {
        const de = document.documentElement;
        if (de.scrollWidth <= de.clientWidth + 1) return null;

        // Walk for the element that is itself wider than its own box. This
        // finds unbreakable text and un-collapsed grids, which a plain
        // bounding-rect scan misses entirely.
        const culprits: string[] = [];
        for (const el of Array.from(document.querySelectorAll("body *"))) {
          if (el.scrollWidth > el.clientWidth + 1) {
            const cs = getComputedStyle(el);
            if (cs.overflowX === "auto" || cs.overflowX === "scroll") continue; // intentional
            culprits.push(
              `${el.tagName.toLowerCase()}.${String(el.className).split(" ")[0]} ` +
                `(content ${el.scrollWidth}px in a ${el.clientWidth}px box)`
            );
          }
        }
        return {
          over: de.scrollWidth - de.clientWidth,
          scrollWidth: de.scrollWidth,
          culprits: culprits.slice(-4), // innermost are the most specific
        };
      }, width);

      if (result) {
        problems.push(
          `  @${width}px: page is ${result.scrollWidth}px (+${result.over}px)\n` +
            result.culprits.map((c) => `      ${c}`).join("\n")
        );
      }
    }

    expect(problems, `${route} scrolls horizontally:\n${problems.join("\n")}`).toEqual([]);
  });
}

test("tap targets meet WCAG 2.5.8, allowing the spacing exception", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const offenders: string[] = [];

  for (const route of ROUTES) {
    await page.goto(route, { waitUntil: "networkidle" });
    const bad = await page.evaluate(() => {
      const visible = (el: Element) => {
        const b = el.getBoundingClientRect();
        return b.width > 0 && b.height > 0 && !el.closest("[hidden]");
      };
      // 2.5.8 exempts a target whose size is constrained by surrounding prose.
      const inlineInProse = (el: Element) => {
        const parent = el.parentElement;
        if (!parent) return false;
        if (!["P", "LI", "SPAN", "TD", "DD", "BLOCKQUOTE"].includes(parent.tagName)) return false;
        const own = (el.textContent ?? "").trim().length;
        return (parent.textContent ?? "").trim().length > own + 12;
      };

      const targets = Array.from(
        document.querySelectorAll("a[href],button,[role=button],input,select,textarea")
      )
        .filter(visible)
        .map((el) => {
          const b = el.getBoundingClientRect();
          return { el, cx: b.left + b.width / 2, cy: b.top + b.height / 2, w: b.width, h: b.height };
        });

      const failures: string[] = [];
      for (const t of targets) {
        if (Math.min(t.w, t.h) >= 24) continue;
        if (inlineInProse(t.el)) continue;
        // Spacing exception: a 24px circle on each target must not overlap another's.
        const crowded = targets.some(
          (o) => o !== t && Math.hypot(o.cx - t.cx, o.cy - t.cy) < 24
        );
        if (crowded) {
          failures.push(
            `${Math.round(t.w)}x${Math.round(t.h)} "${(t.el.textContent ?? "").trim().slice(0, 28)}"`
          );
        }
      }
      return failures;
    });
    if (bad.length) offenders.push(`  ${route}: ${bad.join("; ")}`);
  }

  expect(offenders, `Targets under 24px that also fail the spacing exception:\n${offenders.join("\n")}`).toEqual([]);
});
