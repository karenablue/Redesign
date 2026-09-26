import { test, expect } from "@playwright/test";
import { ROUTES, auditContrast, formatContrast } from "./helpers";

// Layout-independent semantics and colour. Runs on the desktop project only —
// see the `mobile` project's testMatch in playwright.config.ts.
for (const route of ROUTES) {
  test(`contrast ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });
    const { failures } = await auditContrast(page);
    expect(
      failures,
      `WCAG 1.4.3 failures on ${route} (${failures.length}):\n${formatContrast(failures)}`
    ).toEqual([]);
  });
}

for (const route of ROUTES) {
  test(`semantics ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });

    const report = await page.evaluate(() => {
      const accessibleName = (el: Element): string => {
        const label = el.getAttribute("aria-label");
        if (label?.trim()) return label.trim();
        const labelledby = el.getAttribute("aria-labelledby");
        if (labelledby) {
          const text = labelledby
            .split(/\s+/)
            .map((id) => document.getElementById(id)?.textContent ?? "")
            .join(" ")
            .trim();
          if (text) return text;
        }
        const own = (el.textContent ?? "").trim();
        if (own) return own;
        const img = el.querySelector<HTMLImageElement>("img[alt]");
        if (img?.alt.trim()) return img.alt.trim();
        const svgTitle = el.querySelector("svg title");
        if (svgTitle?.textContent?.trim()) return svgTitle.textContent.trim();
        return el.getAttribute("title")?.trim() ?? "";
      };
      const visible = (el: Element) => {
        const box = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return (
          box.width > 0 && box.height > 0 && cs.visibility !== "hidden" && !el.closest("[hidden]")
        );
      };

      const levels = Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6"));
      const headingSkips: string[] = [];
      for (let i = 1; i < levels.length; i++) {
        const prev = +levels[i - 1].tagName[1];
        const cur = +levels[i].tagName[1];
        if (cur > prev + 1) {
          headingSkips.push(`h${prev} -> h${cur} at "${levels[i].textContent?.trim().slice(0, 40)}"`);
        }
      }

      const idCounts = new Map<string, number>();
      document.querySelectorAll("[id]").forEach((el) => {
        idCounts.set(el.id, (idCounts.get(el.id) ?? 0) + 1);
      });
      const duplicateIds = [...idCounts.entries()]
        .filter(([, n]) => n > 1)
        .map(([id, n]) => `${id} (x${n})`);

      const imagesMissingAlt = Array.from(document.querySelectorAll("img:not([alt])")).map(
        (img) => img.getAttribute("src") ?? "?"
      );

      const controls = Array.from(
        document.querySelectorAll("input:not([type=hidden]),select,textarea")
      ).filter(visible);
      const unlabeledControls = controls
        .filter((c) => {
          if (accessibleName(c)) return false;
          if (c.id && document.querySelector(`label[for="${CSS.escape(c.id)}"]`)) return false;
          return !c.closest("label");
        })
        .map((c) => `${c.tagName.toLowerCase()}[${(c as HTMLInputElement).type ?? ""}]`);

      const namelessControls = Array.from(
        document.querySelectorAll("a[href],button,[role=button]")
      )
        .filter(visible)
        .filter((el) => !accessibleName(el))
        .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).split(" ")[0]}`);

      const positiveTabindex = Array.from(document.querySelectorAll("[tabindex]")).filter(
        (el) => Number(el.getAttribute("tabindex")) > 0
      ).length;

      return {
        lang: document.documentElement.getAttribute("lang"),
        headingSkips,
        duplicateIds,
        imagesMissingAlt,
        unlabeledControls,
        namelessControls,
        positiveTabindex,
        hasSkipLink: !!document.querySelector('a.skip-link, a[href="#main"], a[href="#main-content"]'),
      };
    });

    expect(report.lang, `${route} needs <html lang>`).toBeTruthy();
    expect(report.headingSkips, `${route} skips heading levels:\n  ${report.headingSkips.join("\n  ")}`).toEqual([]);
    expect(report.duplicateIds, `${route} has duplicate ids: ${report.duplicateIds.join(", ")}`).toEqual([]);
    expect(report.imagesMissingAlt, `${route} has <img> with no alt attribute: ${report.imagesMissingAlt.join(", ")}`).toEqual([]);
    expect(report.unlabeledControls, `${route} has unlabeled form controls: ${report.unlabeledControls.join(", ")}`).toEqual([]);
    expect(report.namelessControls, `${route} has links/buttons with no accessible name: ${report.namelessControls.join(", ")}`).toEqual([]);
    expect(report.positiveTabindex, `${route} uses positive tabindex, which breaks tab order`).toBe(0);
    expect(report.hasSkipLink, `${route} needs a skip-to-content link`).toBe(true);
  });
}

test("keyboard: the skip link actually moves focus into main", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  const focused = await page.evaluate(() => document.activeElement?.className ?? "");
  expect(focused, "the first Tab stop should be the skip link").toContain("skip");
  await page.keyboard.press("Enter");
  const landedInMain = await page.evaluate(() => {
    const el = document.activeElement;
    return !!el && (el.id === "main" || !!el.closest("main"));
  });
  expect(landedInMain, "activating the skip link should move focus into <main>").toBe(true);
});

test("keyboard: the mobile nav drawer opens, closes on Escape, and returns focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });

  const toggle = page.locator(".nav-toggle");
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");

  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");

  const focusReturned = await page.evaluate(() =>
    document.activeElement?.classList.contains("nav-toggle")
  );
  expect(focusReturned, "Escape should return focus to the toggle that opened the drawer").toBe(true);
});

test("phone: the open menu offers Join, Poodle Portal and Donate", async ({ page }) => {
  // The masthead hides these buttons below 640px; they must reappear in the
  // drawer, or a phone visitor has no header route to the portal or Donate.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.locator(".nav-toggle").click();
  const actions = page.locator(".nav-panel__actions");
  for (const name of ["Join", "Poodle Portal", "Donate"]) {
    await expect(actions.getByRole("link", { name })).toBeVisible();
  }
});
