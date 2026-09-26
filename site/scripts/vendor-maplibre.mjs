/**
 * Copies MapLibre GL's browser build into public/vendor/maplibre/ so the
 * Chapter Locator can load it on demand, unbundled. MapLibre 6 starts its
 * worker from a file beside itself (new URL(..., import.meta.url)) that
 * imports a shared chunk by relative path; bundling breaks that link, so the
 * three files are served exactly as published. Runs before dev and build.
 * public/vendor/ is gitignored: the source of truth is package.json.
 */
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const pkgDir = join(here, "..", "node_modules", "maplibre-gl");
const { version } = JSON.parse(readFileSync(join(pkgDir, "package.json"), "utf8"));
const out = join(here, "..", "public", "vendor", "maplibre");

mkdirSync(out, { recursive: true });
for (const file of ["maplibre-gl.mjs", "maplibre-gl-shared.mjs", "maplibre-gl-worker.mjs", "maplibre-gl.css"]) {
  copyFileSync(join(pkgDir, "dist", file), join(out, file));
}
console.log(`[vendor-maplibre] maplibre-gl ${version} -> public/vendor/maplibre/`);
