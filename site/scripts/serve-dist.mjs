/**
 * Minimal foreground static server for dist/, used by the Playwright suite.
 *
 * Why not `astro preview`? In Astro 7 it manages a background daemon and
 * exits immediately when one is already running ("Preview server already
 * running... pid N"). Playwright's `webServer` needs a process that stays in
 * the foreground for the life of the run, so a daemon-manager makes the run
 * either abort ("Process from config.webServer exited early") or silently
 * reuse a server built from older source.
 *
 * This serves the built output only — no Vite client, no dev toolbar (whose
 * shadow-DOM UI is visible to Playwright locators and was being counted as
 * page content), and no compile cache to go stale.
 *
 * Usage: node scripts/serve-dist.mjs [port]
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const DIST = join(fileURLToPath(new URL("../", import.meta.url)), "dist");
const PORT = Number(process.argv[2] ?? 4322);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".pdf": "application/pdf",
};

/** Resolve a URL path to a file inside dist/, or null if it escapes or is absent. */
async function resolve(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath.split("?")[0])).replace(/^(\.\.[/\\])+/, "");
  const candidates = clean.endsWith("/")
    ? [join(clean, "index.html")]
    : [clean, join(clean, "index.html"), clean + ".html"];

  for (const candidate of candidates) {
    const full = join(DIST, candidate);
    if (!full.startsWith(DIST)) continue; // path traversal
    try {
      const info = await stat(full);
      if (info.isFile()) return full;
    } catch {
      /* try the next candidate */
    }
  }
  return null;
}

const server = createServer(async (req, res) => {
  const file = await resolve(req.url ?? "/");

  if (!file) {
    // Serve the real 404 page WITH a 404 status, so tests can assert both.
    try {
      const body = await readFile(join(DIST, "404.html"));
      res.writeHead(404, { "content-type": TYPES[".html"] });
      res.end(body);
    } catch {
      res.writeHead(404, { "content-type": TYPES[".txt"] });
      res.end("Not found");
    }
    return;
  }

  try {
    const body = await readFile(file);
    res.writeHead(200, {
      "content-type": TYPES[extname(file).toLowerCase()] ?? "application/octet-stream",
      // Content-Length matters beyond correctness: without it, tooling that
      // measures page weight from response headers reads every asset as 0.
      "content-length": body.byteLength,
      "cache-control": "no-store",
    });
    res.end(body);
  } catch (err) {
    res.writeHead(500, { "content-type": TYPES[".txt"] });
    res.end("Internal error: " + String(err));
  }
});

server.listen(PORT, () => {
  console.log(`serving dist/ at http://localhost:${PORT}`);
});
