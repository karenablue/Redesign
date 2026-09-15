import { test, expect } from "@playwright/test";
import { ROUTES } from "./helpers";

/**
 * Catches the failure mode that has no symptom.
 *
 * `gap: var(--space-14)` where --space-14 was never defined is not a CSS
 * error — the declaration is simply invalid at computed-value time, so the
 * property falls back to its initial value and the gap silently becomes 0.
 * Nothing logs, nothing looks obviously broken, and it survives review.
 *
 * A name is only reported if it resolves nowhere: not on :root, and not on
 * any element. That second check matters because components legitimately set
 * custom properties as inline style (CardGrid.astro passes --card-min,
 * --card-gap and --card-cols that way), and those must not be flagged.
 */
// Runs on the desktop project only — see the `mobile` project's testMatch in
// playwright.config.ts. Stylesheets are viewport-independent.
for (const route of ROUTES) {
  test(`no undefined CSS custom properties ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });

    const undefinedTokens = await page.evaluate(() => {
      const referenced = new Set<string>();

      const walk = (rules: CSSRuleList) => {
        for (const rule of Array.from(rules)) {
          const text = (rule as CSSStyleRule).cssText;
          if (text) {
            for (const m of text.matchAll(/var\(\s*(--[a-zA-Z0-9_-]+)/g)) referenced.add(m[1]);
          }
          const nested = (rule as CSSGroupingRule).cssRules;
          if (nested) walk(nested);
        }
      };

      for (const sheet of Array.from(document.styleSheets)) {
        try {
          walk(sheet.cssRules);
        } catch {
          continue; // cross-origin (Google Fonts) — not ours to audit
        }
      }

      // Inline style attributes can also reference tokens.
      document.querySelectorAll("[style]").forEach((el) => {
        const s = el.getAttribute("style") ?? "";
        for (const m of s.matchAll(/var\(\s*(--[a-zA-Z0-9_-]+)/g)) referenced.add(m[1]);
      });

      const rootStyle = getComputedStyle(document.documentElement);
      const everything = Array.from(document.querySelectorAll("*"));

      const missing: string[] = [];
      for (const name of referenced) {
        if (rootStyle.getPropertyValue(name).trim()) continue;
        // Defined on some subtree instead (e.g. set inline by a component)?
        const definedSomewhere = everything.some((el) =>
          getComputedStyle(el).getPropertyValue(name).trim()
        );
        if (!definedSomewhere) missing.push(name);
      }
      return missing.sort();
    });

    expect(
      undefinedTokens,
      `${route} references CSS variables that are never defined — these declarations ` +
        `are silently dropped:\n  ${undefinedTokens.join("\n  ")}`
    ).toEqual([]);
  });
}
