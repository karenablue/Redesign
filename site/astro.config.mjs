// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  // Public URL the finished site will live at. Used for canonical URLs and
  // sitemap. Update to the real domain before launch.
  site: "https://www.sgrho1922.org",

  // If the site is served from a sub-path (e.g. GitHub Pages project site at
  // https://user.github.io/Redesign/), set base: "/Redesign". All internal
  // links already route through withBase() in src/lib/url.js, so this is the
  // only place that needs to change.
  base: process.env.SITE_BASE || "/",

  build: {
    // Emit /about/herstory/index.html so URLs have no .html extension,
    // matching the current site's directory-style links.
    format: "directory",
  },
});
