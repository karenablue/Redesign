---
name: Sigma Gamma Rho Sorority, Incorporated
description: The national ICHQ site — royal and gold, educator's authority, warmth earned through specifics.
colors:
  royal: "#2041a5"
  royal-2: "#1a3580"
  royal-3: "#2b4ea8"
  royal-dark: "#17357f"
  navy: "#081633"
  deep-blue: "#0f2555"
  gold: "#dfb136"
  white: "#ffffff"
  ink: "#333333"
  muted: "#555a66"
  muted-2: "#6a7282"
  cream: "#fffbf0"
  cream-2: "#fef8ed"
  tint: "#f4f6fb"
  line: "rgba(32, 65, 165, 0.12)"
  line-dark: "rgba(255, 255, 255, 0.14)"
typography:
  display:
    fontFamily: "LEMON MILK, Oswald, Arial Narrow, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 1.8rem + 4.6vw, 4.5rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "LEMON MILK, Oswald, Arial Narrow, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.4rem + 3vw, 3rem)"
    fontWeight: 400
    lineHeight: 1.15
  title:
    fontFamily: "Montserrat, system-ui, Arial, sans-serif"
    fontSize: "clamp(1.5rem, 1.2rem + 1.4vw, 2rem)"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Montserrat, system-ui, Arial, sans-serif"
    fontSize: "clamp(1rem, 0.9rem + 0.5vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Montserrat, system-ui, Arial, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 700
    letterSpacing: "0.15em"
  editorial:
    fontFamily: "Playfair Display, Georgia, Times New Roman, serif"
    fontSize: "clamp(1.5rem, 1.2rem + 1.4vw, 2rem)"
    fontWeight: 400
    lineHeight: 1.35
  accent:
    fontFamily: "Pinyon Script, Snell Roundhand, Segoe Script, cursive"
    fontSize: "2rem"
    fontWeight: 400
rounded:
  sm: "8px"
  lg: "16px"
  xl: "40px"
  pill: "999px"
spacing:
  "1": "0.25rem"
  "2": "0.5rem"
  "3": "0.75rem"
  "4": "1rem"
  "5": "1.25rem"
  "6": "1.5rem"
  "8": "2rem"
  "10": "2.5rem"
  "12": "3rem"
  "14": "3.5rem"
  "16": "4rem"
  "20": "5rem"
  "24": "6rem"
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.navy}"
    rounded: "{rounded.pill}"
    padding: "0.95em 2.2em"
    typography: "{typography.body}"
  button-primary-hover:
    backgroundColor: "{colors.royal}"
    textColor: "{colors.white}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.royal}"
    rounded: "{rounded.pill}"
    padding: "0.95em 2.2em"
  button-outline-hover:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.navy}"
  button-navy:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "0.95em 2.2em"
  button-ghost-light:
    backgroundColor: "rgba(255, 255, 255, 0.96)"
    textColor: "{colors.royal}"
    rounded: "{rounded.pill}"
    padding: "0.95em 2.2em"
  card:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.lg}"
  eyebrow:
    textColor: "{colors.royal}"
    typography: "{typography.label}"
  eyebrow-on-dark:
    textColor: "{colors.gold}"
    typography: "{typography.label}"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    padding: "0.5rem 0"
  nav-link-active:
    textColor: "{colors.white}"
---

# Design System: Sigma Gamma Rho Sorority, Incorporated

## Overview

**Creative North Star: "The Pearl Standard"**

Few elements, each one finished. A pearl earns attention by being small,
complete and slightly luminous — not by being loud — and this system works the
same way. Gold is the luster: rationed hard so that when it appears, on a
rule, a numeral, an eyebrow, or one button, it still reads as precious. Royal
blue carries the institutional weight. Everything else gets out of the way so
photography of real sorors and real numbers can do the persuading.

The mood is **warm and welcoming before it is impressive**. A woman
considering membership should feel invited, not audited; a foundation officer
should find the evidence without hunting for it. Those two readings are not in
tension here, because the warmth comes from generous space, unhurried line
height (1.7 body), and real faces — not from soft language. Trust is earned
with founding history, named leadership, and verified figures. Where a number
does not exist, the layout accommodates its absence; it does not invent one.

Depth is **tonal, not cast**. The page advances through bands — white, cool
slate, cream, then a royal gradient — and that stack is what creates
hierarchy. Shadows are close to eliminated by intent.

**Key Characteristics:**

- Gold as luster, never as surface — rationed to rules, numerals, labels and a single button
- Royal and navy carry structure; the palette has no third accent
- Depth from stacked tonal bands, not from shadow
- Two display faces (LEMON MILK) over two text faces (Montserrat, Playfair), never more
- Real photography and verified numbers over illustration and claims
- AA contrast is a floor enforced by tests, not a review step

## Colors

The FY2027 guidelines define a two-color brand — royal blue and gold — and
this system keeps it that way. There is deliberately no secondary or tertiary
accent; extra hues would break the Pearl Standard.

### Primary

- **Royal Blue** (`#2041a5`, Pantone 19-4053 TCX): every heading, link, and the
  navigation bar. The organization's structural voice. Two gradient siblings
  (`#1a3580`, `#2b4ea8`) exist only to build the royal band; never use them as
  flat fills.
- **Navy** (`#081633`): the deepest ground — hero base, footer, and the text
  color on any gold fill. Not a "dark royal"; it is its own floor.

### Secondary

- **Gold** (`#dfb136`, Pantone 13-0757 TCX): **the only gold.** Rules,
  dividers, underlines, dots, year pills, icons, borders, button fills, and
  text on navy (8.9:1). **Never text on a light ground** — it is 2:1 on white,
  which fails the FY2027 guidelines' own WCAG 2.1 AA clause. Never a
  background for body content.
- **Accent Text** (`--accent-text`): not a colour but a role. Words that carry
  the accent (eyebrows, the highlighted half of a headline) are **royal** on
  light ground and **brand gold** inside `.on-dark`. Its partners are
  `--accent-underline` (brand gold on light, none on dark) and
  `--accent-hover` (deep royal on light, white on dark).
- *Retired, Sept 2026:* `--gold-text`, `--gold-display`, `--gold-bright` and
  `--gold-dark`. They each passed contrast, and together they made the site
  read as several golds, which the brand does not have.

### Neutral

- **White** (`#ffffff`): the default page ground and card surface.
- **Cream** (`#fffbf0`) and **Cream 2** (`#fef8ed`): the warm alternating band
  and card background. *Note: the official FY2027 palette contains no cream —
  this is a rebuild decision and it is what supplies the warmth.*
- **Tint** (`#f4f6fb`): the cool slate band, used to separate sections without
  going warm.
- **Ink** (`#333333`): body text. **Muted** (`#555a66`) and **Muted 2**
  (`#6a7282`): secondary text and metadata.
- **Line** (`rgba(32,65,165,.12)`) and **Line Dark** (`rgba(255,255,255,.14)`):
  hairline borders on light and dark grounds respectively.

### Named Rules

**The Rationed Luster Rule.** Gold covers well under 10% of any screen. If a
composition needs more gold to feel finished, the composition is the problem.

**The One-Gold Rule.** There is one gold, `#DFB136`. On light ground it never
carries words; the accent word is royal (`--accent-text`) and the gold arrives
as its underline, a rule, a pill or a fill. On navy it may carry words. Any
other gold as text is a defect, however well it passes contrast —
`tests/color-context.spec.ts` fails the build on it.

**The No Third Accent Rule.** Royal and gold. Any additional hue — a green
success state, a red error, a purple anything — must be argued for, not
assumed.

**The Rhoer Reservation.** Yellow Gold `#FFD700` belongs to the Rhoer Club
only. Never use it in general design.

## Typography

**Display Font:** LEMON MILK (fallback Oswald, Arial Narrow) — self-hosted
**Body Font:** Montserrat (fallback system-ui, Arial)
**Editorial Font:** Playfair Display (fallback Georgia)
**Accent Font:** Pinyon Script (fallback Snell Roundhand) — rationed

**Character:** LEMON MILK is a narrow, single-weight, all-caps display face —
it has authority but shouts if overused, so it is confined to h1/h2 and
numerals. Montserrat does all the work a reader actually spends time in.
Playfair supplies an editorial register for multi-word headlines and pull
quotes. Pinyon is a signature, not a tool.

### Hierarchy

- **Display** (LEMON MILK 400, `clamp(2.75rem, 1.8rem + 4.6vw, 4.5rem)`, lh 1):
  page h1 and hero titles only.
- **Headline** (LEMON MILK 400, `clamp(2rem, 1.4rem + 3vw, 3rem)`, lh 1.15):
  section h2.
- **Title** (Montserrat **700**, `clamp(1.5rem, 1.2rem + 1.4vw, 2rem)`, lh 1.3):
  h3/h4 and every card title. Deliberately *not* LEMON MILK.
- **Body** (Montserrat 400, `clamp(1rem, 0.9rem + 0.5vw, 1.25rem)`, lh 1.7):
  all prose. Reading measure 600–700px.
- **Label** (Montserrat 700, 11px, tracking 0.15em, uppercase): eyebrows and
  small caps labels.
- **Editorial** (Playfair Display 400, italic where quoted): multi-word
  storytelling headlines and pull quotes.
- **Accent** (Pinyon Script, ≥30px): at most one phrase per page.

### Named Rules

**The Shouting Rule.** LEMON MILK is all-caps by nature. h1, h2, eyebrows and
big numerals — nothing else. Card titles and sub-heads are Montserrat 700,
because LEMON MILK everywhere reads as shouting. Promoting a card title to h2
for outline reasons would silently change its typeface; add a
visually-hidden h2 instead.

**The One Signature Rule.** Pinyon Script appears at most once per page, at
30px or larger, on a high-emotion phrase. It is never an eyebrow, a label, or
body copy. In practice it appears **once on the whole site**: the registered
"Greater Service, Greater Progress." line closing *Herstory*'s legacy section.
Once is the ceiling, not a target — a page with no phrase that earns it gets
none, which is most pages.

**The Four Faces Rule.** Four families is the ceiling, and it is already
reached. Any fifth face is a regression.

## Layout

A single container primitive: `min(1100px, 100% - 48px)`, with a 24px gutter
and a `--container--narrow` variant for reading measure. The homepage widens
its container locally for editorial composition; pages do not otherwise
override it.

Sections are full-bleed bands with `clamp(4rem, 3rem + 3vw, 6rem)` of vertical
padding, and the page reads as a stack of those bands. Rhythm comes from a
`0.25rem`-based spacing scale (`--space-1` through `--space-24`).

Grids are intrinsic, never fixed: `repeat(auto-fit, minmax(min(280px, 100%), 1fr))`.
The `min()` wrapper is mandatory — a bare `minmax(340px, 1fr)` overflows a
320px viewport, which is exactly how this site shipped a horizontal scrollbar.

Responsive behavior is content-driven rather than tied to device widths. The
navigation collapses to a drawer below 1280px, which is where the nav row
genuinely stops fitting. Layout must hold from **320px** up, with no
horizontal scroll at any width.

### Named Rules

**The No Fixed Track Rule.** Never size a grid track in bare pixels. Always
`minmax(min(Npx, 100%), 1fr)`.

**The 320 Rule.** 320px is a supported width, not an edge case. A long
unbreakable headline in a narrow column is a layout bug, not a content
problem.

## Elevation & Depth

**This system is layered by tone, not by shadow.** Depth comes from the
vertical stack of grounds — white, cool slate (`#f4f6fb`), cream (`#fffbf0`),
and the royal gradient band — plus hairline borders. Surfaces sit flat.

Two shadow tokens exist and are deliberately reserved:

- **`--shadow-sm`** (`0 2px 14px rgba(8,22,51,.08)`): rare, for something that
  genuinely floats above the page.
- **`--shadow-md`** (`0 14px 34px rgba(8,22,51,.18)`): feature imagery only.

*Known drift: several pages currently use `--shadow-md` as a resting state on
cards and figures. That predates this decision and contradicts it; new work
should not copy the pattern, and existing instances are candidates for
removal.*

### Named Rules

**The Flat-At-Rest Rule.** Surfaces are flat by default. If something needs to
separate from its background, change the band tone or add a hairline before
reaching for a shadow.

## Shapes

Two radii and one pill. Cards and media use `16px` (`--radius-lg`); inputs,
chips and small surfaces use `8px` (`--radius`); every button is a full pill
(`999px`). One structural exception exists: the membership block's `40px`
bottom-only radius.

Borders are hairlines — `1px solid rgba(32,65,165,.12)` on light, the white
equivalent on dark. The recurring decorative form is the **gold rule**: a
4rem × 2px gold bar under a heading.

### Named Rules

**The Pill-or-Nothing Rule.** Buttons are fully round. There are no
`8px`-radius buttons in this system.

**The Hairline Rule.** Borders separate; they do not decorate. A border
thicker than 1px on a rounded card reads as a template accent — the top-border
card treatment currently on three pages is under review for exactly this
reason.

## Components

Character: **refined and restrained.** Generous internal padding, hairline
borders, minimal ornament. Components recede; content does the work.

### Buttons

- **Shape:** full pill (`999px`), `1.5px` border, padding `0.95em 2.2em`,
  Montserrat 700 at 16px.
- **Primary:** gold fill with **navy** text. Never white text on gold — white
  is 2:1 against `#dfb136`. Hover switches to a royal fill with white text
  (8.2:1) — there is no second gold to deepen to. Inside `.on-dark` the hover
  is white with navy text, and in the royal header bar likewise.
- **Outline:** transparent with royal text and a gold border. Hover fills gold
  and switches text to navy (same rule as primary).
- **Navy:** navy fill, white text; hover lifts to royal. The quiet, serious
  variant.
- **Ghost Light:** near-opaque white with royal text, for use over photography
  and dark bands.
- **On dark:** `.on-dark .btn--outline` renders white text with a gold border,
  and hovers to a faint white wash rather than a gold fill.

### Cards / Containers

- **Corner Style:** `16px`.
- **Background:** white, or cream where the band alternates.
- **Border:** a single `rgba(32,65,165,.12)` hairline.
- **Shadow Strategy:** none at rest — see Elevation & Depth.
- **Internal Padding:** `--space-6` to `--space-8`.

### Inputs / Fields

Inputs are borderless within a bordered field wrapper (`8px` radius, hairline
border, white ground) with an inline SVG icon. The input itself inherits the
page font, sets navy text, and removes its own outline — **the wrapper owns
the focus treatment**, which must be a visible state, never `outline: 0` with
nothing replacing it.

### Navigation

A two-row header: a white brand row carrying the shield and word mark, over a
royal navigation bar. Links are Montserrat 700 at 16px, white, with a
transparent 2px bottom border that fills gold on hover — an underline reveal,
not a pill. The active or open item stays white and keeps its
gold underline — brand gold as text on the royal bar is 4.44:1, just under AA. Below 1280px the whole nav collapses to a hamburger
drawer with accordion submenus, `aria-expanded` on the toggle, and Escape
returning focus to it.

### Signature Component: the Eyebrow

Small uppercase LEMON MILK labels at 0.28em tracking, above a heading. They
are the system's most repeated gesture — around 69 instances — and therefore
its biggest liability: they are the "badge above the headline" pattern, and at
this volume they risk reading as templated. Color is context-bound through
`--accent-text`: royal on light ground, brand gold inside `.on-dark`. Never set eyebrow
color in a page-scoped rule; `body.page-home .eyebrow` is specificity 0,2,1
and silently outranks the `.on-dark` override, which is how the hero eyebrow
once shipped at 2:1.

### Signature Component: the Stat Band

A solid royal band of large LEMON MILK numerals with white tracked labels,
divided by thin vertical rules. It is how the organization states scale, and
it sits directly under the hero.

## Do's and Don'ts

### Do:

- **Do** use `--accent-text` for accent words, and let brand gold arrive as
  the underline, rule, pill or fill. Gold carries words only on navy.
- **Do** put navy text on any gold fill.
- **Do** build separation from band tone and hairlines before reaching for a
  shadow.
- **Do** write grid tracks as `minmax(min(Npx, 100%), 1fr)`.
- **Do** keep card titles and sub-heads in Montserrat 700, and add a
  visually-hidden `h2` when an outline needs one.
- **Do** use real SGRho photography — sisterhood, service, celebration.
- **Do** cite real, verified numbers, and design around a number's absence
  rather than inventing it.
- **Do** treat AA contrast as a build gate; the Playwright suite in `tests/`
  enforces it across every route.

### Don't:

- **Don't** let this look like a **generic nonprofit template** — stock
  smiling-people photography, three icon boxes in a row, a donate bar, vague
  mission language. This is the confirmed anti-reference.
- **Don't** let this look **collegiate or athletic** — varsity type, diagonal
  cuts, team-brand energy. Confirmed anti-reference.
- **Don't** use gold as a background for body content.
- **Don't** use Yellow Gold `#FFD700`; it is Rhoer Club only.
- **Don't** introduce a fifth type family, or a third accent hue.
- **Don't** set eyebrow or highlight color in a page-scoped selector.
- **Don't** put a thick accent border on a rounded card.
- **Don't** add a decorative font, clip art, sticker, or overlay, and never
  stretch, recolor, crop, or overlap the Shield.
- **Don't** ship AI-generated imagery that misrepresents the marks, or publish
  ritual photography.
