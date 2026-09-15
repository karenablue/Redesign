import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
// `z` re-exported from "astro:content" is deprecated in Astro 7; astro/zod is
// the supported path and avoids adding zod as a direct dependency.
import { z } from "astro/zod";

/**
 * Content collections.
 *
 * Content that goes stale — events first, then news and leadership — lives in
 * src/content/ as markdown rather than as arrays inside .astro pages. Two
 * reasons:
 *
 *   1. The site is being built to hand over. Every git-based CMS (Decap,
 *      Sveltia, Tina) edits exactly these files, so this commits the project
 *      to no particular CMS vendor — and if the CMS is ever abandoned, the
 *      content is still plain text anyone can read and edit.
 *   2. The schema below is validated at build time, so a malformed entry
 *      fails the build with a named field instead of rendering a broken card.
 */

const events = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/events" }),
  schema: z.object({
    title: z.string().min(1),

    /**
     * Date is deliberately two free-text fields rather than a real date: real
     * entries include "Sep–Oct" and a day of "—" for month-long activations,
     * which no date type can represent. They are rendered verbatim.
     */
    month: z.string().min(1),
    day: z.string().min(1),

    /** Category chip. Free text on purpose — HQ can add a category after
     *  handover without anyone editing code. */
    tag: z.string().min(1),

    location: z.string().min(1),

    /**
     * Display position. The curated sequence runs across a season
     * (Sep → May), and because the dates above are fuzzy it cannot be derived
     * by sorting. An editor reorders the page by changing these numbers.
     */
    order: z.number().int().positive(),
  }),
});

export const collections = { events };
