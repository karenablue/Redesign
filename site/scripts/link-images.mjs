/**
 * Recreates site/public/images as a link to the repo-root images/ folder so
 * `astro dev` / `astro build` can serve the existing 65 MB of photography
 * without duplicating it into the Astro project. Runs automatically before
 * dev/build via the "predev" / "prebuild" npm scripts.
 *
 * When the rebuild is finished and images are moved into the Astro project
 * for real, delete this script, the predev/prebuild hooks, and the
 * public/images entry in .gitignore.
 */
import { existsSync, symlinkSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const link = join(here, "..", "public", "images");
const target = join(here, "..", "..", "images");

if (existsSync(link)) {
  process.exit(0);
}
if (!existsSync(target)) {
  console.error(`[link-images] source not found: ${target} — build needs the full repository`);
  process.exit(1);
}

mkdirSync(dirname(link), { recursive: true });
try {
  // "junction" works on Windows without admin rights; ignored elsewhere.
  symlinkSync(target, link, process.platform === "win32" ? "junction" : "dir");
  console.log("[link-images] linked public/images -> ../images");
} catch (err) {
  console.error("[link-images] failed:", err.message);
  process.exit(1);
}
