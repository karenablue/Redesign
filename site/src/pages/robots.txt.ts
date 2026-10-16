/**
 * robots.txt. The site is a private concept, so every page carries a noindex
 * meta tag (Base.astro). Crawling stays allowed on purpose: a crawler blocked
 * here would never see the noindex. No sitemap is advertised while private.
 */
import type { APIRoute } from "astro";

export const GET: APIRoute = () =>
  new Response("User-agent: *\nAllow: /\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
