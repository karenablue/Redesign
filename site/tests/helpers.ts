/**
 * Shared test helpers.
 *
 * ROUTES is the canonical list every page-level spec iterates. It is written
 * out longhand rather than derived from src/data/nav.js because the nav is
 * one of the things under test — deriving the list from it would make a nav
 * that drops a page look like a passing suite.
 */
export const ROUTES = [
  "/",
  "/about/herstory/",
  "/about/our-founders/",
  "/about/our-foundations/",
  "/about/notable-sigmas/",
  "/leadership/headquarters/",
  "/leadership/international-grand-basileus/",
  "/leadership/international-board/",
  "/leadership/regional-leadership/",
  "/leadership/past-grand-basilei/",
  "/membership/become-a-member/",
  "/membership/reactivate/",
  "/membership/chapter-locator/",
  "/service-impact/affiliates/",
  "/membership/accountability/",
  "/service-impact/national-programs/",
  "/service-impact/partner-foundations/",
  "/service-impact/corporate-partnerships/",
  "/news-events/latest-news/",
  "/news-events/upcoming-events/",
  "/news-events/highlights-stories/",
  "/news-events/media-relations/",
  "/resources/vendor/",
  "/resources/help-center/",
  "/about/anti-hazing-policy/",
  "/resources/careers/",
  "/resources/contact/",
  "/resources/media/",
  "/privacy/",
  "/cookies/",
  "/terms/",
  "/accessibility/",
] as const;

/** Viewport widths that must never produce a horizontal scrollbar. */
export const WIDTHS = [320, 375, 768, 1280, 1440] as const;

export type ContrastFailure = {
  selector: string;
  text: string;
  fontPx: number;
  ratio: number;
  required: number;
  color: string;
  background: string;
};

/**
 * Runs a WCAG 1.4.3 contrast audit inside the page.
 *
 * Two deliberate choices, both learned from getting false positives by hand:
 *
 *  - Backgrounds are resolved by walking ancestors and compositing
 *    semi-transparent background-colors, NOT by reading one element's own
 *    background (which is usually `transparent` and yields nonsense).
 *  - Any text sitting over a gradient or image background is reported
 *    separately rather than guessed at, because a gradient cannot honestly
 *    be reduced to a single colour to compare against.
 *
 * Decorative text (inside aria-hidden, or a near-transparent watermark) is
 * excluded — 1.4.3 does not apply to incidental decoration.
 */
export async function auditContrast(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const nums = (s: string) => (String(s).match(/[-\d.]+/g) || []).map(Number);
    const parse = (s: string) => {
      const n = nums(s);
      return n.length < 3 ? null : { rgb: n.slice(0, 3), a: n.length >= 4 ? n[3] : 1 };
    };
    const channel = (v: number) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    const luminance = (c: number[]) =>
      0.2126 * channel(c[0]) + 0.7152 * channel(c[1]) + 0.0722 * channel(c[2]);
    const composite = (fg: number[], a: number, bg: number[]) =>
      fg.map((v, i) => v * a + bg[i] * (1 - a));

    const backgroundOf = (el: Element): { rgb?: number[]; image?: boolean } => {
      let cur: Element | null = el;
      let acc: { rgb: number[]; a: number } | null = null;
      while (cur) {
        const cs = getComputedStyle(cur);
        if (cs.backgroundImage && cs.backgroundImage !== "none") return { image: true };
        const c = parse(cs.backgroundColor);
        if (c && c.a > 0) {
          acc =
            acc === null
              ? { rgb: c.rgb, a: c.a }
              : { rgb: composite(acc.rgb, acc.a, c.rgb), a: Math.min(1, acc.a + c.a) };
          if (acc.a >= 0.999) return { rgb: acc.rgb.map(Math.round) };
        }
        cur = cur.parentElement;
      }
      return {
        rgb: acc ? composite(acc.rgb, acc.a, [255, 255, 255]).map(Math.round) : [255, 255, 255],
      };
    };

    const failures: ContrastFailureShape[] = [];
    const overGradient: string[] = [];

    for (const el of Array.from(document.querySelectorAll("body *"))) {
      const ownText = Array.from(el.childNodes)
        .filter((n) => n.nodeType === Node.TEXT_NODE)
        .map((n) => n.textContent)
        .join("")
        .trim();
      if (!ownText) continue;

      const box = el.getBoundingClientRect();
      if (!box.width || !box.height) continue;

      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.opacity === "0" || el.closest("[hidden]")) continue;

      const fgc = parse(cs.color);
      if (!fgc) continue;

      // decoration, not content
      if (el.closest('[aria-hidden="true"]') || fgc.a < 0.12) continue;

      const selector =
        el.tagName.toLowerCase() + (el.className ? "." + String(el.className).split(" ")[0] : "");
      const bg = backgroundOf(el);
      if (bg.image) {
        overGradient.push(selector);
        continue;
      }

      const fontPx = parseFloat(cs.fontSize);
      const bold = parseInt(cs.fontWeight, 10) >= 700;
      const required = fontPx >= 24 || (fontPx >= 18.66 && bold) ? 3 : 4.5;

      const fg = composite(fgc.rgb, fgc.a, bg.rgb!);
      const l1 = luminance(fg);
      const l2 = luminance(bg.rgb!);
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

      if (ratio < required) {
        failures.push({
          selector,
          text: ownText.slice(0, 40),
          fontPx: Math.round(fontPx),
          ratio: Math.round(ratio * 100) / 100,
          required,
          color: cs.color,
          background: `rgb(${bg.rgb!.join(",")})`,
        });
      }
    }
    return { failures, overGradient: Array.from(new Set(overGradient)) };
  });
}

/** Formats contrast failures into a message that names the fix, not just the count. */
export function formatContrast(failures: ContrastFailure[]) {
  const byPair = new Map<string, { n: number; ratio: number; egs: Set<string> }>();
  for (const f of failures) {
    const key = `${f.color} on ${f.background} (needs ${f.required}:1)`;
    if (!byPair.has(key)) byPair.set(key, { n: 0, ratio: f.ratio, egs: new Set() });
    const e = byPair.get(key)!;
    e.n++;
    e.ratio = Math.min(e.ratio, f.ratio);
    e.egs.add(`${f.selector} "${f.text}"`);
  }
  return [...byPair.entries()]
    .sort((a, b) => b[1].n - a[1].n)
    .map(
      ([pair, v]) =>
        `  ${v.ratio}:1  ${pair}\n     ${v.n} instance(s), e.g. ${[...v.egs].slice(0, 3).join(", ")}`
    )
    .join("\n");
}

// Shape mirrored inside page.evaluate (no imports available in that scope).
type ContrastFailureShape = ContrastFailure;
