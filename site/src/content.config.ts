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

/** A calendar date as YYYY-MM-DD text. YAML (and CMS date pickers) turn an
 *  unquoted 2026-11-12 into a Date, so both forms are accepted. */
const isoDate = z.preprocess(
  (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v),
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD, e.g. 2026-11-12")
);

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
     * Confirmed calendar dates, YYYY-MM-DD. Optional because most entries
     * carry no year yet. When `start` is set, the event gets an
     * "Add to calendar" download; `end` is the last day, for multi-day events.
     * Only fill these from HQ's confirmed schedule; never infer the year.
     */
    start: isoDate.optional(),
    end: isoDate.optional(),

    /** Pins the event in the wide banner above the list. Use on one entry. */
    featured: z.boolean().optional(),

    /**
     * Display position. The curated sequence runs across a season
     * (Sep → May), and because the dates above are fuzzy it cannot be derived
     * by sorting. An editor reorders the page by changing these numbers.
     */
    order: z.number().int().positive(),
  }).refine((e) => !e.end || (e.start !== undefined && e.end >= e.start), {
    message: "`end` needs a `start`, and cannot be before it",
    path: ["end"],
  }),
});

/** Latest news. Prose lives in the markdown body, like events. */
const news = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/news" }),
  schema: z.object({
    title: z.string().min(1),
    tag: z.string().min(1),
    /** Optional: a story with no real photograph runs as a text row. */
    image: z.string().min(1).optional(),
    /** Optional publication date as it should read, e.g. "July 2026". */
    date: z.string().optional(),
    /** Optional link. Absolute URLs open in a new tab when `external` is set;
     *  site-relative paths are passed through withBase() by the page. */
    href: z.string().optional(),
    external: z.boolean().optional(),
    order: z.number().int().positive(),
  }),
});

/**
 * International Board of Directors. No markdown body — every field is
 * structured, so these files are frontmatter only.
 *
 * Regional leadership is deliberately NOT a collection: each region nests a
 * leaders[] array plus four social URLs, territory prose and a presentation
 * flag, which would hand an editor a deeply nested form for content that
 * changes on a known cadence. It stays a single data array in its page.
 */
const board = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/board" }),
  schema: z.object({
    name: z.string().min(1),
    role: z.string().min(1),
    image: z.string().min(1),
    note: z.string().optional(),
    featured: z.boolean().optional(),
    order: z.number().int().positive(),
  }),
});

/**
 * Notable Sigmas — the famous Soror and honorary member roster.
 *
 * A collection rather than the page's former hardcoded arrays for three
 * reasons beyond the usual editability:
 *
 *   1. `honorary` is the page's whole organising principle. Famous Sorors
 *      crossed; honorary members were inducted without pledging. Getting a
 *      real woman's category wrong is a factual error about a person, so the
 *      distinction is a required boolean, not an optional tag.
 *   2. `cat` is an enum, so a typo'd or invented category fails the build by
 *      name instead of quietly rendering a card no filter button can reach.
 *   3. Photographs carry licence obligations. CC BY and CC BY-SA REQUIRE
 *      attribution, so any entry with an image must also carry its licence
 *      and credit — enforced below rather than left to whoever adds the next
 *      portrait.
 */
const notableSigmas = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/notable-sigmas" }),
  schema: z
    .object({
      name: z.string().min(1),

      /** Human-readable field label shown on the card, e.g. "Arts & Entertainment". */
      field: z.string().min(1),

      /** Filter key. Must match a button in the page's `filters` array. */
      cat: z.enum([
        "arts",
        "education",
        "law",
        "business",
        "public",
        "advocacy",
        "literature",
        "athletics",
        "medicine",
        "religion",
      ]),

      /** One-line description of why she is notable. */
      note: z.string().min(1),

      /**
       * Monogram shown when there is no portrait. Optional because an editor
       * adding someone through the CMS should not have to work it out; the
       * page derives it from the name when this is absent.
       */
      initials: z.string().min(1).max(4).optional(),

      /** Chapter, only where documented. Never inferred. */
      chapter: z.string().optional(),

      /**
       * True = honorary member (inducted). False = initiated Soror who
       * crossed. Required: there is no defensible default.
       */
      honorary: z.boolean(),

      /** Where the honorary/initiated determination came from. */
      source: z.string().optional(),

      /** Portrait, relative to public/. Omit and the card uses initials. */
      image: z.string().optional(),
      /** Licence name exactly as the file's metadata states it. */
      license: z.string().optional(),
      licenseUrl: z.string().optional(),
      /** Photographer / attribution string. */
      credit: z.string().optional(),

      // Deliberately no `order` field. The page sorts alphabetically by name,
      // so a stored position would be dead weight — and worse, it would mean
      // an editor had to pick a number to slot someone into the right place.
      // Sorting in the page means a new entry lands correctly on its own.
    })
    .refine((d) => !d.image || (d.license && d.credit), {
      message:
        "An entry with an image must also carry `license` and `credit` — CC BY and CC BY-SA require attribution.",
      path: ["credit"],
    }),
});

/**
 * Membership Accountability register — one file per action, frontmatter only.
 *
 * Entries come ONLY from International Corporate Headquarters' official
 * register, after counsel has approved publishing it. Never add a name from
 * any other source: a wrong or stale entry here is a legal risk to the
 * Sorority and a real harm to the person named.
 *
 * Suspensions with an `endDate` in the past drop off the page automatically
 * at the next build, so a reinstated member is not left listed. Expulsions,
 * charter revocations and denouncements are permanent and have no end date.
 */
const accountability = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/accountability" }),
  schema: z
    .object({
      category: z.enum([
        "member-suspensions",
        "chapter-suspensions",
        "expulsions",
        "charter-revocations",
        "denouncements",
      ]),
      region: z.string().min(1),
      /** Name of the member's last affiliated chapter, or the chapter acted on. */
      chapter: z.string().min(1),
      state: z.string().optional(),
      /** City of the chapter, e.g. "Houston, TX". */
      location: z.string().optional(),
      university: z.string().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      /** Date the action took effect, YYYY-MM-DD. */
      effective: isoDate,
      /** Suspensions only: last day of the suspension, YYYY-MM-DD. */
      endDate: isoDate.optional(),
      fine: z.string().optional(),
      /** Denouncements only: status label shown as a badge. */
      status: z.string().optional(),
      /** Date HQ supplied or last confirmed this entry, YYYY-MM-DD. */
      listed: isoDate,
    })
    .refine(
      (r) =>
        !["member-suspensions", "expulsions", "denouncements"].includes(r.category) ||
        Boolean(r.firstName && r.lastName),
      { message: "Individual entries need firstName and lastName", path: ["lastName"] }
    ),
});

/**
 * Chapter stories — service and sisterhood reported by chapters, curated by
 * HQ. Markdown body is the story (aim for about 150 words).
 *
 * Every entry must come from a chapter's own submission. Never write one:
 * a story HQ did not receive is a fabrication on the national site.
 * A photo needs `photoConsent: true`, confirming everyone pictured agreed
 * to publication, and alt text describing it.
 */
const stories = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/stories" }),
  schema: z
    .object({
      title: z.string().min(1),
      chapter: z.string().min(1),
      region: z.string().min(1),
      /** City and state of the activity, e.g. "Houston, TX". */
      place: z.string().optional(),
      /** Date of the activity, YYYY-MM-DD. Newest stories show first. */
      date: isoDate,
      /** National program the work belongs to, if any, e.g. "SWIM 1922". */
      program: z.string().optional(),
      image: z.string().optional(),
      imageAlt: z.string().optional(),
      photoConsent: z.boolean().optional(),
    })
    .refine((s) => !s.image || (s.imageAlt && s.photoConsent === true), {
      message: "A photo needs imageAlt and photoConsent: true",
      path: ["image"],
    }),
});

/**
 * Member voices — short quotes from sorors, published only with the member's
 * written permission. `consent` must be literally true or the build fails.
 * Never paraphrase or compose a quote.
 */
const voices = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/voices" }),
  schema: z.object({
    quote: z.string().min(1).max(320),
    name: z.string().min(1),
    chapter: z.string().min(1),
    region: z.string().min(1),
    /** e.g. "Collegiate soror", "Alumnae soror since 1998". */
    role: z.string().optional(),
    consent: z.literal(true, { message: "Publish a member's words only with their permission" }),
    /** Date permission was given, YYYY-MM-DD. */
    consentDate: isoDate,
    order: z.number().int().positive().optional(),
  }),
});

export const collections = { events, news, board, notableSigmas, accountability, stories, voices };
