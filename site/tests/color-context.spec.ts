import { test, expect, type Page } from "@playwright/test";
import { ROUTES } from "./helpers";

/**
 * Colour-context checks — the two holes a11y.spec.ts's contrast test cannot
 * see.
 *
 * 1. The One-Gold Rule (DESIGN.md, FY2027 guidelines). The brand has one gold,
 *    #DFB136. Any other gold used as text is a violation, whatever its
 *    contrast: this site once shipped five golds and every one of them passed
 *    WCAG. Brand gold itself is 2:1 on white, so as text it belongs only on
 *    dark ground; on light ground the accent word is --accent-text (royal).
 *
 * 2. Hover contrast. The contrast test measures resting states only, which is
 *    how a white-on-gold button hover (2:1) went out.
 *
 * Every check here has a canary: a test that deliberately breaks a page and
 * asserts the check notices. Audit code in this project has silently passed
 * everything more than once, so a check without a canary is not trusted.
 *
 * Runs on the desktop project only (see the mobile project's testMatch).
 */

type RGB = number[];
type ColorUtils = {
  parse(s: string): { rgb: RGB; a: number } | null;
  hex(s: string): RGB | null;
  luminance(c: RGB): number;
  composite(fg: RGB, a: number, bg: RGB): RGB;
  ratio(a: RGB, b: RGB): number;
  solidGround(el: Element): RGB | null;
  groundOf(el: Element): RGB;
  ownText(el: Element): string;
};

type GoldViolation = { verdict: string; selector: string; text: string; color: string };
type HoverFailure = {
  target: string;
  text: string;
  ratio: number;
  required: number;
  color: string;
  ground: string;
};

/** Colour maths shared by both audits, installed into the page before load. */
async function installColorUtils(page: Page) {
  await page.addInitScript(() => {
    const nums = (s: string) => (String(s).match(/[-\d.]+/g) || []).map(Number);
    const parse = (s: string) => {
      const n = nums(s);
      return n.length < 3 ? null : { rgb: n.slice(0, 3), a: n.length >= 4 ? n[3] : 1 };
    };
    const hex = (s: string) => {
      const h = String(s).trim().replace("#", "");
      return /^[0-9a-f]{6}$/i.test(h)
        ? [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
        : null;
    };
    const channel = (v: number) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    const luminance = (c: RGB) =>
      0.2126 * channel(c[0]) + 0.7152 * channel(c[1]) + 0.0722 * channel(c[2]);
    const composite = (fg: RGB, a: number, bg: RGB) => fg.map((v, i) => v * a + bg[i] * (1 - a));
    const ratio = (a: RGB, b: RGB) => {
      const l1 = luminance(a);
      const l2 = luminance(b);
      return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    };
    const ownText = (el: Element) =>
      Array.from(el.childNodes)
        .filter((n) => n.nodeType === Node.TEXT_NODE)
        .map((n) => n.textContent)
        .join("")
        .trim();

    /**
     * The single colour under an element, for contrast maths. Returns null when
     * a gradient or image is in the way: that ground cannot honestly be reduced
     * to one colour, so it is skipped rather than guessed at.
     */
    const solidGround = (el: Element): RGB | null => {
      let cur: Element | null = el;
      let acc: { rgb: RGB; a: number } | null = null;
      while (cur) {
        const cs = getComputedStyle(cur);
        if (cs.backgroundImage && cs.backgroundImage !== "none") return null;
        const c = parse(cs.backgroundColor);
        if (c && c.a > 0) {
          acc =
            acc === null
              ? { rgb: c.rgb, a: c.a }
              : { rgb: composite(acc.rgb, acc.a, c.rgb), a: Math.min(1, acc.a + c.a) };
          if (acc.a >= 0.999) return acc.rgb;
        }
        cur = cur.parentElement;
      }
      return acc ? composite(acc.rgb, acc.a, [255, 255, 255]) : [255, 255, 255];
    };

    /**
     * A coarse ground colour for light-vs-dark classification only. A gradient
     * counts as the mean of its visible stops — precise enough to tell a royal
     * band from a cream one, which is all the One-Gold Rule needs.
     */
    const groundOf = (el: Element): RGB => {
      let cur: Element | null = el;
      let acc: { rgb: RGB; a: number } | null = null;
      while (cur) {
        const cs = getComputedStyle(cur);
        const bi = cs.backgroundImage;
        if (bi && bi !== "none") {
          // Gradients are weighted by their alpha, and a translucent gradient
          // does NOT end the walk. Treating every gradient as opaque once
          // misread a 14% gold wash on Herstory's navy band as solid pale gold.
          // A layer counts as opaque when its stops average to full alpha, so
          // an opaque linear under a translucent radial still ends the walk.
          const layers: string[] = [];
          let depth = 0;
          let start = 0;
          for (let i = 0; i < bi.length; i++) {
            const ch = bi[i];
            if (ch === "(") depth++;
            else if (ch === ")") depth--;
            else if (ch === "," && depth === 0) {
              layers.push(bi.slice(start, i));
              start = i + 1;
            }
          }
          layers.push(bi.slice(start));
          const sum = [0, 0, 0];
          let weight = 0;
          let alpha = 0;
          for (const layer of layers) {
            const stops = Array.from(layer.matchAll(/rgba?\(([^)]+)\)/g)).map((m) =>
              m[1].split(",").map(Number)
            );
            if (!stops.length) continue;
            let layerAlpha = 0;
            for (const s of stops) {
              const a = s.length >= 4 ? s[3] : 1;
              layerAlpha += a;
              weight += a;
              for (let k = 0; k < 3; k++) sum[k] += s[k] * a;
            }
            alpha = Math.max(alpha, layerAlpha / stops.length);
          }
          if (weight > 0) {
            const mean = sum.map((v) => v / weight);
            acc =
              acc === null
                ? { rgb: mean, a: alpha }
                : { rgb: composite(acc.rgb, acc.a, mean), a: Math.min(1, acc.a + alpha) };
            if (acc.a >= 0.999) return acc.rgb;
          }
        }
        const c = parse(cs.backgroundColor);
        if (c && c.a > 0) {
          acc =
            acc === null
              ? { rgb: c.rgb, a: c.a }
              : { rgb: composite(acc.rgb, acc.a, c.rgb), a: Math.min(1, acc.a + c.a) };
          if (acc.a >= 0.999) return acc.rgb;
        }
        cur = cur.parentElement;
      }
      return acc ? composite(acc.rgb, acc.a, [255, 255, 255]) : [255, 255, 255];
    };

    const utils: ColorUtils = {
      parse,
      hex,
      luminance,
      composite,
      ratio,
      solidGround,
      groundOf,
      ownText,
    };
    (window as unknown as { __sgrColor: ColorUtils }).__sgrColor = utils;
  });
}

async function auditOneGold(page: Page): Promise<GoldViolation[]> {
  return page.evaluate(() => {
    const C = (window as unknown as { __sgrColor: ColorUtils }).__sgrColor;
    const root = getComputedStyle(document.documentElement);
    // Read brand gold from the live token so the check follows tokens.css.
    const brand = (C.hex(root.getPropertyValue("--gold")) || []).join(",");
    if (!brand) throw new Error("One-Gold audit could not resolve --gold on :root");

    // "Looks gold": a warm yellow hue with real saturation. Royal, navy, the
    // greys and white all fall outside it.
    const goldish = (c: RGB) => {
      const [r, g, b] = c.map((v) => v / 255);
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const d = max - min;
      const l = (max + min) / 2;
      if (d === 0) return false;
      const sat = d / (1 - Math.abs(2 * l - 1));
      let h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
      h *= 60;
      if (h < 0) h += 360;
      return h >= 30 && h <= 60 && sat >= 0.4 && l >= 0.15 && l <= 0.9;
    };

    const out: GoldViolation[] = [];
    const seen = new Set<string>();
    for (const el of Array.from(document.querySelectorAll("body *"))) {
      const text = C.ownText(el);
      if (!text) continue;
      const box = el.getBoundingClientRect();
      if (!box.width || !box.height) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.opacity === "0" || el.closest("[hidden]")) continue;
      // Decoration is exempt: 1.4.3 does not apply to it.
      if (el.closest('[aria-hidden="true"]')) continue;

      const fg = C.parse(cs.color);
      if (!fg) continue;
      const key = fg.rgb.map(Math.round).join(",");
      let verdict: string | null = null;
      if (key === brand) {
        if (C.luminance(C.groundOf(el)) >= 0.2) {
          verdict = "brand gold as text on a light ground (2:1; use --accent-text)";
        }
      } else if (goldish(fg.rgb)) {
        verdict = "non-brand gold used as text (the brand has one gold, #DFB136)";
      }
      if (!verdict) continue;

      const selector =
        el.tagName.toLowerCase() +
        (el.className ? "." + String(el.className).trim().split(/\s+/).join(".") : "");
      if (seen.has(selector + verdict)) continue;
      seen.add(selector + verdict);
      out.push({ verdict, selector, text: text.slice(0, 40), color: cs.color });
    }
    return out;
  });
}

async function auditHoverContrast(page: Page): Promise<HoverFailure[]> {
  // Freeze transitions so what gets measured is the settled hover style, not
  // a frame from the middle of a 180ms fade.
  await page.addStyleTag({
    content: "*,*::before,*::after{transition:none!important;animation:none!important}",
  });

  // One representative per look: the same element and classes, in the same
  // kind of region, on the same ground, hover the same way.
  const count = await page.evaluate(() => {
    let n = 0;
    const seen = new Set<string>();
    for (const el of Array.from(
      document.querySelectorAll("a[href], button, [role=button], summary")
    )) {
      const box = el.getBoundingClientRect();
      if (!box.width || !box.height) continue;
      // parked off-canvas until focused, e.g. the skip link
      if (box.top + window.scrollY < 0 || box.left + window.scrollX < 0) continue;
      const cs = getComputedStyle(el);
      if (
        cs.visibility === "hidden" ||
        el.closest("[hidden]") ||
        el.closest('[aria-hidden="true"]')
      )
        continue;
      if (!(el.textContent || "").trim()) continue; // icon-only controls are non-text contrast, out of scope

      const region = el.closest("section, header, footer, nav, aside");
      const signature = [
        el.tagName,
        el.className,
        region ? region.className : "",
        !!el.closest(".on-dark, .section--navy"),
      ].join("|");
      if (seen.has(signature)) continue;
      seen.add(signature);
      el.setAttribute("data-hover-probe", String(n++));
    }
    return n;
  });

  const failures: HoverFailure[] = [];
  for (let i = 0; i < count; i++) {
    const target = page.locator(`[data-hover-probe="${i}"]`);
    try {
      await target.hover({ timeout: 1500 });
    } catch {
      continue; // covered by another element or not actionable at this viewport
    }

    const found = await target.evaluate((el) => {
      const C = (window as unknown as { __sgrColor: ColorUtils }).__sgrColor;
      const label =
        el.tagName.toLowerCase() +
        (el.className ? "." + String(el.className).trim().split(/\s+/).join(".") : "");
      const rows: HoverFailure[] = [];

      // The control itself and the text inside it: a card link's colour change
      // usually lands on its h3 or p, not on the anchor.
      const nodes = [el, ...Array.from(el.querySelectorAll("*"))].slice(0, 25);
      for (const node of nodes) {
        const text = C.ownText(node);
        if (!text || node.closest('[aria-hidden="true"]')) continue;
        const box = node.getBoundingClientRect();
        if (!box.width || !box.height) continue;
        const cs = getComputedStyle(node);
        if (cs.visibility === "hidden" || cs.opacity === "0") continue;
        const fg = C.parse(cs.color);
        if (!fg || fg.a < 0.12) continue;
        const ground = C.solidGround(node);
        if (!ground) continue;

        const px = parseFloat(cs.fontSize);
        const bold = parseInt(cs.fontWeight, 10) >= 700;
        const required = px >= 24 || (px >= 18.66 && bold) ? 3 : 4.5;
        const r = C.ratio(C.composite(fg.rgb, fg.a, ground), ground);
        if (r < required) {
          rows.push({
            target: label,
            text: text.slice(0, 40),
            ratio: Math.round(r * 100) / 100,
            required,
            color: cs.color,
            ground: `rgb(${ground.map(Math.round).join(",")})`,
          });
        }
      }
      return rows;
    });

    failures.push(...found);
    await page.mouse.move(0, 0);
  }
  return failures;
}

const describeGold = (rows: GoldViolation[]) =>
  rows.map((v) => `  ${v.verdict}: ${v.selector} "${v.text}" (${v.color})`).join("\n");
const describeHover = (rows: HoverFailure[]) =>
  rows
    .map(
      (f) =>
        `  ${f.ratio}:1 (needs ${f.required}:1)  ${f.target} "${f.text}"  ${f.color} on ${f.ground}`
    )
    .join("\n");

for (const route of ROUTES) {
  test(`one gold ${route}`, async ({ page }) => {
    await installColorUtils(page);
    await page.goto(route, { waitUntil: "load" });
    const violations = await auditOneGold(page);
    expect(
      violations,
      `One-Gold Rule violations on ${route}:\n${describeGold(violations)}`
    ).toEqual([]);
  });

  test(`hover contrast ${route}`, async ({ page }) => {
    await installColorUtils(page);
    await page.goto(route, { waitUntil: "load" });
    const failures = await auditHoverContrast(page);
    expect(
      failures,
      `WCAG 1.4.3 failures in the HOVER state on ${route}:\n${describeHover(failures)}`
    ).toEqual([]);
  });
}

test.describe("canaries: each check must catch a deliberately broken page", () => {
  const expectGold = async (page: Page, css: string, route: string, prefix: string) => {
    await installColorUtils(page);
    await page.goto(route, { waitUntil: "load" });
    await page.addStyleTag({ content: css });
    const violations = await auditOneGold(page);
    expect(
      violations.some((v) => v.verdict.startsWith(prefix)),
      `the injected violation was not detected; the audit returned:\n${describeGold(violations)}`
    ).toBe(true);
  };

  test("one gold flags a darker, non-brand gold used as text", async ({ page }) => {
    // #8a6510 was the retired --gold-text.
    await expectGold(
      page,
      ".ph__title span { color: #8a6510 !important; }",
      "/resources/help-center/",
      "non-brand gold"
    );
  });

  test("one gold flags a lighter, non-brand gold on a dark hero", async ({ page }) => {
    // #f0cf5c was the retired --gold-bright: it passes contrast on navy and is
    // still off-brand.
    await expectGold(
      page,
      ".ph__title span { color: #f0cf5c !important; }",
      "/resources/help-center/",
      "non-brand gold"
    );
  });

  test("one gold flags brand gold as text on a light ground", async ({ page }) => {
    await expectGold(
      page,
      ".legal-toc a { color: #dfb136 !important; }",
      "/privacy/",
      "brand gold"
    );
  });

  test("one gold still flags brand gold on a translucent tint over a LIGHT ground", async ({
    page,
  }) => {
    // Guards the alpha-weighted gradient reading: a faint wash must not make a
    // light page read as dark.
    await expectGold(
      page,
      ".legal-toc a { color: #dfb136 !important; background-image: linear-gradient(145deg, rgba(223,177,54,.14), rgba(255,255,255,.04)) !important; }",
      "/privacy/",
      "brand gold"
    );
  });

  test("hover contrast flags a link that turns white on a light ground", async ({ page }) => {
    await installColorUtils(page);
    await page.goto("/resources/contact/", { waitUntil: "load" });
    await page.addStyleTag({ content: "a:hover { color: #ffffff !important; }" });
    const failures = await auditHoverContrast(page);
    expect(failures.length, "the injected hover failure was not detected").toBeGreaterThan(0);
  });
});
