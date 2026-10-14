// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

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

  vite: {
    environments: {
      astro: {
        optimizeDeps: {
          // Pre-bundle picomatch before the ESM-only content runner evaluates it.
          include: ["picomatch"],
        },
      },
    },
  },

  // Every public page, for search engines (sitemap-index.xml). The design
  // concepts are noindex and the 404 is not a page to find, so both stay out.
  integrations: [
    sitemap({
      filter: (page) => !/\/concepts\/|\/404\/?$/.test(page),
    }),
  ],
});
