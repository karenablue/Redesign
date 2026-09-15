import { test, expect, type Page } from "@playwright/test";
import { ROUTES } from "./helpers";

/**
 * No page may load a subresource from another origin.
 *
 * This exists because /about/headquarters/ shipped eleven staff headshots
 * hotlinked from the legacy WordPress site (sgrho1922.org/wp-content/...).
 * Nothing caught it: the asset-weight work only measured local files, and the
 * suite's own static server sends no Content-Security-Policy, so the browser
 * never objected. It surfaced only when the CSP written for Cloudflare Pages
 * was tested against the real build.
 *
 * A static site that silently depends on the server it is replacing is a
 * deployment hazard — those URLs break the moment HQ moves or reorganises
 * their media library.
 *
 * Outbound LINKS to other sites are fine and expected; this is only about
 * things the browser must fetch to render the page.
 *
 * Runs on the desktop project only (see the mobile project's testMatch).
 */

/** Hosts allowed to serve subresources. Keep this list short and justified. */
const ALLOWED_HOSTS = [
  "fonts.googleapis.com", // the Google Fonts stylesheet
  "fonts.gstatic.com", // the font files that stylesheet references
];

type ForeignAsset = { tag: string; url: string; host: string };

async function findForeignSubresources(page: Page, allowed: string[]): Promise<ForeignAsset[]> {
  return page.evaluate((allowedHosts) => {
    const out: ForeignAsset[] = [];
    const seen = new Set<string>();
    const selector = "img[src], script[src], link[href], source[src], source[srcset], video[src], video[poster], audio[src], iframe[src], embed[src], object[data], track[src]";
    for (const el of Array.from(document.querySelectorAll(selector))) {
      const raw =
        el.getAttribute("src") ||
        el.getAttribute("href") ||
        el.getAttribute("data") ||
        el.getAttribute("srcset") ||
        "";
      // srcset can hold several candidates
      for (const candidate of raw.split(",").map((s) => s.trim().split(/\s+/)[0]).filter(Boolean)) {
        let url: URL;
        try {
          url = new URL(candidate, location.href);
        } catch {
          continue;
        }
        if (url.protocol === "data:" || url.protocol === "blob:") continue;
        if (url.origin === location.origin) continue;
        if (allowedHosts.includes(url.host)) continue;
        // A <link> that is not a subresource (dns-prefetch, preconnect,
        // canonical, alternate) costs no fetch of content.
        const rel = (el.getAttribute("rel") || "").toLowerCase();
        if (el.tagName === "LINK" && !/stylesheet|preload|icon|manifest/.test(rel)) continue;
        const key = el.tagName + url.href;
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ tag: el.tagName.toLowerCase(), url: url.href, host: url.host });
      }
    }
    return out;
  }, allowed);
}

const describe = (rows: ForeignAsset[]) =>
  rows.map((r) => `  <${r.tag}> -> ${r.url}`).join("\n");

for (const route of ROUTES) {
  test(`no off-site subresources ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: "load" });
    const foreign = await findForeignSubresources(page, ALLOWED_HOSTS);
    expect(
      foreign,
      `${route} loads ${foreign.length} subresource(s) from another origin. ` +
        `Host them locally instead — a static build must not depend on an external server:\n${describe(foreign)}`
    ).toEqual([]);
  });
}

test("canary: the check catches an injected off-site image", async ({ page }) => {
  await page.goto("/", { waitUntil: "load" });
  await page.evaluate(() => {
    const img = document.createElement("img");
    img.src = "https://example.com/not-ours.png";
    document.body.appendChild(img);
  });
  const foreign = await findForeignSubresources(page, ALLOWED_HOSTS);
  expect(
    foreign.some((f) => f.host === "example.com"),
    "the injected off-site image was not detected"
  ).toBe(true);
});

test("canary: the allowlist is actually consulted", async ({ page }) => {
  // With the font hosts removed from the allowlist, the Google Fonts
  // stylesheet must be reported — otherwise the allowlist is doing nothing
  // and the test above would pass for the wrong reason.
  await page.goto("/", { waitUntil: "load" });
  const foreign = await findForeignSubresources(page, []);
  expect(
    foreign.some((f) => f.host === "fonts.googleapis.com"),
    "expected the Google Fonts stylesheet to be reported when the allowlist is empty"
  ).toBe(true);
});
