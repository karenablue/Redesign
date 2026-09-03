# SGRho site rebuild (Astro)

This is the scaffold for rebuilding the Sigma Gamma Rho site as **semantic HTML
assembled from shared components**, replacing the Figma-export code in the repo
root (637 `<div>`s on the homepage, 25 unshared stylesheets, the same hero
rebuilt from scratch on every page, fixed-pixel grid tracks that collapse on
real screens).

The old files in the repo root are the **visual reference**. Nothing here
imports them.

## ⚠️ You must run it through a server — do not open the HTML files

Double-clicking `dist/index.html` (or any `.astro`/`.html` file) opens it as
`file://`, where the stylesheets (`/_astro/*.css`) and every internal link
(`/about/herstory/`) fail to resolve. The page renders with **no CSS** — the
nav collapses to a bullet list and the hero is unstyled black text. That is not
a bug in the site; a multi-page site with clean URLs has to be served.

Always view it with:

```bash
cd site
npm install        # first time only
npm run dev        # builds + opens http://localhost:4321 in your browser
```

`npm run build` → `site/dist/` (plain static HTML); `npm run preview` serves
that build the same way a host would. Deploying `dist/` to any web host also
works — the "no CSS" problem is unique to opening files straight from disk.

`predev` / `prebuild` run `scripts/link-images.mjs`, which links
`site/public/images` to the repo-root `images/` folder so the existing 65 MB of
photography is served without being copied into this project. The link is
git-ignored and recreated automatically.

## How it's organized

```
src/
  data/nav.js          Navigation as DATA — primary nav, header buttons, footer
                       columns, contact, search index. Defined ONCE. (The old
                       site pasted <nav> markup into 24 files.)
  lib/url.js           withBase() — prefixes internal links with the deploy
                       sub-path. Use it for every internal href/src.
  styles/
    tokens.css         All color, type, spacing, layout values as CSS custom
                       properties. The ONLY place hex values live.
    global.css         Reset + shared primitives: .container, .eyebrow, .btn,
                       .section-heading.
  layouts/Base.astro   The one <head>, <SiteHeader>, <SiteFooter>. Pages fill
                       the <main> slot and pass title/description/activeTop.
  components/
    SiteHeader.astro   Brand row + nav bar + search. Reads data/nav.js.
    SiteFooter.astro   Link columns + contact + social. Reads data/nav.js.
    Hero.astro         Full-bleed image hero. ONE component for what was
                       founders-hero / hq-page-hero / programs-hero / …
    Section.astro      A band: tone="white|cream|navy", optional heading block,
                       width="default|narrow". Wraps content in .container.
    CardGrid.astro     Responsive grid — repeat(auto-fit, minmax(min, 1fr)),
                       optional cols cap. This is the fix for the collapsing
                       fixed-px grids.
    Card.astro         One grid item: eyebrow/number, title, body, optional
                       image, optional whole-card link.
    StatBand.astro     The "at a glance" number row.
    CtaBand.astro      The dark navy call-to-action band that closes each page.
  pages/
    index.astro            Homepage — condensed rebuild showing the full flow.
    about/herstory.astro    END-TO-END REFERENCE. Port every other page the
                            same way: shared components first, page-scoped
                            <style> only for genuinely unique bands.
```

URLs come from file paths: `src/pages/about/herstory.astro` → `/about/herstory/`.

## Adding a page

1. Create `src/pages/<section>/<name>.astro`.
2. `import Base` and the components you need.
3. Wrap content in `<Base title="…" activeTop="…">`.
4. Compose `<Hero>`, `<Section>`, `<CardGrid>`/`<Card>`, `<StatBand>`,
   `<CtaBand>`. Only write a scoped `<style>` for layout unique to that page.
5. If it adds a nav destination, edit `src/data/nav.js` (one place).

## Porting checklist (per page)

- [ ] Hero → `<Hero>` (image in `public/images`, path `/images/…`)
- [ ] Intro / stat band → `<StatBand>` or `<Section>` + content
- [ ] Repeated cards → `<CardGrid>` + `<Card>` (never a fixed-px grid)
- [ ] Closing CTA → `<CtaBand>`
- [ ] Headings are real `<h1>`/`<h2>`/`<h3>` in order; one `<h1>` per page
- [ ] Images have meaningful `alt`
- [ ] No hard-coded colors — use `var(--…)` from `tokens.css`
- [ ] `npm run build` clean, page checked at 375 / 768 / 1440 px

## Deploy

`npm run build` emits fully static HTML/CSS in `dist/` — host it the same way
the current flat files are hosted. If it goes under a sub-path (e.g. GitHub
Pages project site), set `SITE_BASE=/Redesign npm run build` and update `site`
in `astro.config.mjs` to the real domain.

## When the rebuild is done

Move `images/` into `site/`, delete `scripts/link-images.mjs` + the
`predev`/`prebuild` hooks + the `public/images` line in `.gitignore`, remove the
old page folders from the repo root, and promote `site/` to the repo root.
