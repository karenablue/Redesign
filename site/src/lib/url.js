/* Prefix a root-absolute site path with Astro's configured `base`.
   Use for every internal href/src so the site works when deployed to a
   sub-path (e.g. GitHub Pages project sites) as well as at a domain root. */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export function withBase(path) {
  if (!path || /^(https?:|mailto:|tel:|#)/.test(path)) return path;
  return BASE + (path.startsWith("/") ? path : "/" + path);
}
