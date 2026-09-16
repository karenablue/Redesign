# AGENTS.md — working rules for the SGRho site rebuild

Read this before touching anything in `site/`. These are hard constraints, not
suggestions. `README.md` is the human tutorial (how to run it, how to port a
page); this file is the contract every model works under. `CLAUDE.md` is a
symlink to this file.

---

## 1. What this repo is — two sources, side by side

The repository root holds **two separate things on purpose**:

- **Repo root** (`index.html`, `about/`, `leadership/`, `images/`, `*.css`) —
  the original **Figma Make export**: 637-div pages, 25 unshared stylesheets.
  **Reference only.** Read it for copy, content, image paths, and visual
  intent. **Never import it, never edit it to "fix" the site.**
- **`site/`** — the **Astro rebuild**: semantic HTML from shared components.
  This is the real work; all changes happen here.

The rebuild does **not** import the root. When a page is ported, its content is
re-expressed through the component system — it is not copied.

End state (see README "When the rebuild is done"): `images/` moves into `site/`,
the link script is deleted, the root export folders are removed, and `site/` is
promoted to the repo root. Until then, keep the two worlds separate.

---

## 2. Stack

- **Astro 7**, static output (`build.format: "directory"` → clean URLs, no `.html`).
- **No UI framework.** No React/Vue/Svelte. `.astro` components only.
- **No CSS framework.** No Tailwind, no CSS-in-JS, no component libraries.
  Styling is plain CSS: `tokens.css` + `global.css` + scoped `<style>` blocks.
- **TypeScript strict** (`astro/tsconfigs/strict`). Keep `astro check` clean.
- Runtime deps are deliberately minimal (`astro`, plus `playwright` for dev).
  **Do not add a dependency** without asking — most needs here are five lines
  of vanilla JS or one CSS custom property.

---

## 3. Commands (run from `site/`)

```
npm run dev       # link images, start astro dev, open browser
npm run build     # link images, static build → dist/
npm run preview   # serve dist/ like a host would
npm run astro -- check   # type-check .astro + TS (add to your loop)
```

`predev` / `prebuild` run `scripts/link-images.mjs`, which junctions
`site/public/images` → repo-root `images/`. The link is git-ignored and
self-healing; don't commit it, don't copy images into `site/`.

**Never open the built HTML from disk** (`file://`) — CSS and links resolve
against `/`, so the page renders unstyled. Always view through the dev server
or `preview`. An unstyled page is not a CSS bug.

---

## 4. Architecture

```
src/
  data/nav.js        Navigation as DATA — the ONLY source of nav. primaryNav,
                     headerActions, footerColumns, footerContact, socialLinks,
                     searchIndex(). SiteHeader, SiteFooter, and search read it.
  lib/url.js         withBase() — prefixes internal paths with the deploy base.
  styles/
    tokens.css       Every color / type size / space / radius / shadow as a
                     CSS custom property. The ONLY place raw hex values live.
    global.css       @font-face, reset, and shared primitives: .container,
                     .section--*, .eyebrow, .btn--*, .gold-rule, .visually-hidden.
  layouts/Base.astro <head>, <SiteHeader>, <SiteFooter>. Props: title,
                     description, activeTop, image. Page content fills the slot.
  components/         Section, Hero, CardGrid, Card, StatBand, CtaBand, Faq,
                     Carousel, SigmaRule, Button, FeatureRow, SiteHeader,
                     SiteFooter. Compose these; don't hand-roll their markup.
  pages/             File path = URL. src/pages/about/herstory.astro → /about/herstory/
```

`src/pages/about/herstory.astro` is the **end-to-end reference page**. Port
every other page the same way: shared components first, a scoped `<style>` only
for a band that is genuinely one-of-a-kind.

---

## 5. Styling rules

1. **No hard-coded colors.** Every color is `var(--…)` from `tokens.css`. If a
   value you need isn't a token, add the token — don't inline the hex.
2. **No Tailwind / utility classes.** Use the `global.css` primitives
   (`.container`, `.section--cream`, `.eyebrow`, `.btn--outline`, `.gold-rule`)
   and scoped `<style>` for the rest.
3. **Scoped `<style>` is for page- or component-unique layout only.** If you're
   writing the same rule in a third file, it belongs in `global.css` (that's
   how `.gold-rule` got there).
4. **Never a fixed-pixel grid.** Repeated cards go through `<CardGrid>` /
   `<Card>` (`repeat(auto-fit, minmax(min, 1fr))`). Fixed `grid-template-columns`
   in px is the exact bug this rebuild exists to kill.
5. Spacing comes from the `--space-*` / `--section-y` scale. Section bands use
   `<Section tone="…">` or the `.section--*` classes, not ad-hoc padding.
6. Container width is `--container` (1100px) via `.container`; narrow content
   uses `.container--narrow` (760px).

---

## 6. Typography — four roles

```
--font-display   LEMON MILK        → display headers: short section titles,
                 (--font-head,       big stat numerals, hero
                  --font-label)
--font-editorial Playfair Display  → editorial voice: multi-word headlines,
                                     pull quotes, storytelling subtitles
--font-kicker    Pinyon Script     → RESERVED accent only — a signature line
                                     or one high-emotion phrase per page.
                                     NOT eyebrows, NOT any repeating label.
--font-body      Montserrat        → body & UI: paragraphs, buttons, forms,
                                     nav, h3/h4 sub-heads, AND eyebrows
                                     (bold, uppercase, 11px, 0.15em tracked)
```

- This **extends** the FY2027 PDF's two families (LEMON MILK + Montserrat)
  with two accent faces, by an explicit design decision for the rebuild
  (Sept 2026). It is being rolled out **homepage-first** — other pages
  still show the two-family system until each is converted. When you touch
  a page, you may bring it onto the four-role system; keep `tokens.css`,
  `global.css`, and this list in sync.
- **LEMON MILK stays upright, `font-weight: 400`, never italic.** Playfair
  Display carries the italic (quotes, subtitles).
- **Pinyon Script is rationed.** It read as fussy and amateur when used as
  the eyebrow on every section. One use per page, sized ≥30px (its
  x-height is tiny), never uppercased or letter-spaced. Functional
  eyebrows are Montserrat bold caps.
  - **Where it actually lives (Sept 2026):** exactly one place —
    `.hs-legacy__copy .hs-motto` on `about/herstory.astro`, the registered
    "Greater Service, Greater Progress." line closing the legacy section.
    Before this it was loaded on all 28 pages and rendered **zero glyphs**,
    so every visitor downloaded a face that drew nothing. If you remove that
    one use, drop Pinyon from the Google Fonts link in `Base.astro` too.
  - **"At most once per page" is a ceiling, not a quota.** Do not go looking
    for a slot on other pages. The homepage has none that qualify: its motto
    is a `CtaBand` eyebrow, `.act-women__sign` is an attribution label — both
    banned above — and the Grand Basileus pull quote is body-length copy
    already carrying Playfair italic, where Pinyon is illegible.
- `--font-head` and `--font-label` remain aliases of the LEMON MILK stack
  for now; don't repoint them without a human's sign-off.
- LEMON MILK is self-hosted (`@font-face` in `global.css`, files in
  `public/fonts/`); it is **not on Google Fonts**. Oswald is its web fallback.
  Montserrat, Oswald, Playfair Display, and Pinyon Script load from Google
  Fonts in `Base.astro`.
- `--cream` (`#fffbf0`) is intentionally part of the system (from the Make
  design, used on program cards). Don't strip cream citing the brand PDF
  without a human decision — that's the other thing that keeps getting
  re-litigated.

---

## 7. Navigation & links

- **All nav lives in `src/data/nav.js`.** Adding, removing, renaming, or
  reordering a link = edit that file, nowhere else. Never paste `<nav>` markup
  into a page (that's what the old site did across 24 files).
- Paths in `nav.js` are root-absolute with a trailing slash:
  `/about/herstory/`.
- **Every internal `href`/`src` goes through `withBase()`** from `src/lib/url.js`
  so the site survives being deployed under a sub-path. External URLs, `mailto:`,
  `tel:`, and `#` anchors pass through untouched — `withBase()` already guards
  those.
- A new page that is a nav destination isn't done until it's in `nav.js`.

---

## 8. Accessibility (non-negotiable, checked per page)

- Exactly one `<h1>` per page; headings in order, no level skips.
- Real landmarks: content is inside the `<main>` slot; don't add a second `<main>`.
- Every `<img>` has meaningful `alt` (empty `alt=""` only for decoration).
- Interactive elements are `<a>`/`<button>`, keyboard-reachable, with a visible
  `:focus-visible` state (the global gold outline — don't remove it).
- Color contrast holds on cream and on the navy gradient bands.

---

## 9. Working method

- **Small batches.** One sub-task per change: the schema, then the component,
  then the page that uses it. Not "build the whole section."
- **Explain non-obvious choices** in the response — structure, trade-offs,
  edge cases — so the human can review without reverse-engineering.
- **Prefer the existing component.** New component only when no combination of
  the current ones fits, and say why.
- Match the surrounding file: same comment density, same prop-doc header style
  (`/** props: … */` in the frontmatter), same naming.

---

## 10. AI-default patterns — do not ship these

Models drift toward a house style. This project has its own identity (a
102-year-old sorority, royal/gold, LEMON MILK, editorial). Actively avoid the
generic-AI-build tells:

### Visual / UI

- No "AI SaaS" look: no charcoal dark-mode default, no purple→blue gradients,
  no glowing borders (`box-shadow: 0 0 15px …`), no undifferentiated bento grids.
  The palette is `tokens.css` — royal, gold, white, cream, navy.
- Headings are not all the same shout. Respect the scale (`--text-hero` /
  `--text-h2` / `--text-h3`) and hierarchy.
- No gratuitous motion: no 3D hover-tilt, shimmer borders, or aggressive scroll
  fades. Transitions are the small `.18s` color/shadow moves already in
  `global.css`. Motion must respect `prefers-reduced-motion`.
- Test every card/component with **long** titles (3+ lines), **missing** images,
  and empty/one-item collections — not just the pristine 3-word case.

#### Content / copy

- No sparkle emojis (✨) or substance-free hero slogans ("Build your dreams",
  "Without limits"). Copy is specific to SGRho and its programs.
- **No invented testimonials, names, quotes, stats, dates, or headshots.** If
  real content isn't supplied, use a clearly-marked placeholder or leave the
  slot out — never fabricate proof.
- **Icons are SVG assets, not emoji.** Emoji are not a UI icon set.
- No `href="#"` / bare-domain placeholder links. A link goes to a real route
  (via `nav.js` + `withBase()`) or it isn't a link yet.
- Prose: vary sentence and list structure; don't start every bullet with the
  same verb; don't carpet-bomb em dashes.

#### Behavior

- No dead affordances: if it highlights on hover it must do something. Don't
  style a control you haven't wired up.
- Real empty states and (where forms exist) real inline validation — no
  `alert()`, no blank screen on "no results".
- Browser back/forward must not break state or navigation.

#### Code

- No inline utility-class soup — semantic classes + tokens (see §5).
- No package hoarding — see §2. No library for a fade or a date format.
- One way to do a thing per the patterns here; don't invent a third data or
  styling approach per file.
- Comments explain _why_, not _what_ (`// adds two numbers` is noise). Match the
  existing docstring density — useful, not robotic.
- No orphaned code: remove unused imports, dead CSS classes, unreferenced
  helpers as you go.
- No blanket `try/catch { console.error(e) }` that swallows failures. Let it
  throw, or handle it specifically.
- Pages are static Astro — real server-rendered HTML in `dist/`, not an empty
  root div. Keep it that way (OG tags + real content in source).

---

## 11. Git

- Work on a short-lived branch off `astro-rebuild`; merge back via PR when a
  coherent chunk is done. `main` gets reviewed milestones only.
- **Atomic, described commits** — one working sub-task each, so a bad
  generation is one `git reset` away, not a lost day.
- **Do not rewrite history that's already pushed** (no force-push to a shared
  branch) unless a human explicitly asks. If local and remote diverge,
  surface it — don't paper over it with a force-push.
- Never commit `dist/`, `.astro/`, `node_modules/`, or `public/images`
  (all git-ignored already).

---

## 11. Definition of done (per change)

- [ ] `npm run astro -- check` clean (no new type errors)
- [ ] `npm run build` clean
- [ ] Viewed through the dev server at **375 / 768 / 1440 px**
- [ ] No hard-coded colors; no fixed-px grid; no serif
- [ ] Nav destinations are in `data/nav.js`
- [ ] Headings ordered, one `<h1>`, images have `alt`
