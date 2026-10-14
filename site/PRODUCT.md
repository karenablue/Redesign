# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The homepage and primary navigation lead with prospective members and the
general public (Karena, 2026-09-30). The site serves:

- **Prospective sorors** — collegiate women and alumnae/graduate women
  evaluating membership. Their job is to decide whether this is for them, then
  find the right pathway (collegiate vs. alumnae) and a chapter near them.
- **General public** — visitors learning who Sigma Gamma Rho is, how its
  founders shaped its mission, and what its service programs do locally.
- **Corporate and foundation partners** — sponsors, funders, and prospective
  partners evaluating credibility, national reach, and program substance
  before committing money or a co-branded initiative.

Current sorors, inactive members considering reactivation, families of members,
individual donors, and press also have clear paths. Member access remains in
the header; the public homepage introduces the seven founders, service, and
membership before leadership updates and news. This updates the 2026-09-26
homepage direction after Karena's 2026-09-30 request to focus on prospective
visitors and the public.

## Product Purpose

The national website for **Sigma Gamma Rho Sorority, Incorporated®** — the
International Corporate Headquarters (ICHQ) site, not a chapter or regional
site. Founded November 12, 1922 at Butler University in Indianapolis, Indiana,
by seven Black educators.

Success is a prospective soror who understands the organization well enough to
start a membership pathway, and a partner who can see verified reach and real
programs without asking for a deck.

## Positioning

**Founded by seven educators.** Education is the organization's founding
mechanism, not one program area among several — all seven founders were
teachers, and scholarship reads as origin rather than as a pillar bolted on
later. This is the distinguishing claim the site should lead with, and it is
one a peer organization cannot truthfully copy.

## Operating Context

- Prospective sorors arrive to evaluate, then need a pathway and a chapter;
  the chapter locator and the two membership pathways are the conversion
  surfaces.
- Partners arrive to evaluate, then need proof: national figures, the partner
  roster, named leadership, and the five national programs.
- Membership systems live in the **Poodle Portal**
  (`https://portal.sgrho1922.org/`), a separate third-party product.
- Governance runs through the biennial **Boulé**, an International Board, and
  five regions, each with its own leadership.
- Traffic is seasonal around the events calendar — Founders' Day (November
  12), regional Fall Cluster Conferences, and touring/series programming.

## Capabilities and Constraints

- 30 routes in the public-page test list, plus a news article, three noindex
  design concepts, a custom 404, and utility output such as `robots.txt`.
- **The Poodle Portal stays external.** It is linked to and never rebuilt,
  proxied, or wrapped.
- **HQ staff must be able to self-edit content** — at minimum news, events,
  and leadership, which are the pages that go stale.
- **Static output is acceptable**, and combined with the requirement above it
  means a static build fed by a CMS rather than a developer-edited static site.
- **Delivery model: build and hand over.** Confirmed by the client — this is
  not a retained engagement, so HQ must be able to operate the site with no
  developer on call. Every account (GitHub organisation, Cloudflare, domain
  registrar, CMS) should be created in SGRho's name with Karena added as an
  admin, never under personal accounts, or the handover becomes a migration
  and she stays a single point of failure.
- **Content source: markdown in this repository**, exposed through Astro
  content collections (`src/content.config.ts`). Events, news, the
  International Board, and Notable Sigmas use these collections. The content
  remains plain text if the editor is replaced. Sveltia CMS is the selected
  editor UI at `/admin/`; it still needs an HQ-owned GitHub repository,
  authentication, and an end-to-end save test before handoff. See
  [HANDOFF.md](HANDOFF.md).
- **Headless WordPress was considered and dropped.** Verified from the live
  site on 2026-09-15: `sgrho1922.org` serves WordPress on PHP 8.4.25 behind
  Cloudflare, from a Plesk-managed Linux origin (a general VPS or reseller
  account, not managed WordPress hosting), with email on Microsoft 365 and a
  custom theme at `wp-content/themes/sigma-gamma-rho`. `/wp-json/` answers
  `200` with JSON, so the REST API is reachable. But it holds **1 published
  post, 30 pages, and no custom post types** — the structure lives in theme
  templates, not in queryable fields. So it offers almost no structured
  content to preserve, while costing two systems and two bills to maintain
  forever. _Only HQ can confirm who holds the hosting account._
- **Deploy target: Cloudflare Pages.** HQ's DNS is already on Cloudflare
  (`sara`/`noah.ns.cloudflare.com`), so this needs no nameserver change, and
  security headers ship in-repo as `public/_headers`. Note the live site
  returns `cf-cache-status: DYNAMIC` — its HTML is not edge-cached today, so
  every view reaches that Plesk server; a static build removes that hop.
- Organization vocabulary is not interchangeable with generic equivalents:
  _Herstory_ (not History), _Soror_, _Boulé_, _Basileus_ / _Grand Basileus_,
  _Philos®_, _Rhoer Club®_, _EE-YIP®_. Full legal name on first use.

## Brand Commitments

- The **SGR Brand Guidelines FY2027** (created January 2026, effective July 2026) is the authoritative source. Where anything else disagrees, it wins.
- Official type is **LEMON MILK** (display) and **Montserrat** (body) — the
  guidelines name only these two and explicitly reject decorative fonts.
  The rebuild adds one editorial face by an explicit client decision
  (Playfair Display for multi-word headlines and quotes); that extension is
  deliberate and documented, not drift. A script accent (Pinyon Script) was
  tried and retired in Sept 2026 as a decorative font.
- Color: Royal Blue `#2041A5` (Pantone 19-4053), Gold `#DFB136` (Pantone
  13-0757), Bright White `#FCFFFE`, Black. **Yellow Gold `#FFD700` is Rhoer
  Club only.** The official palette contains no cream.
- **The guidelines themselves mandate WCAG 2.1 AA for digital color**, verbatim:
  "All uses of this color on websites and digital products must comply with
  WCAG 2.1 AA accessibility requirements for color contrast." Acceptable Use
  additionally requires "high contrast between background and text", and
  Unacceptable Use names "text that is difficult to read due to poor color
  contrast". This matters because brand Gold is 2:1 on white and **fails that
  clause as text**. The site resolves it with **one gold only** (Karena, Sept
  2026): `#DFB136` never carries words on a light ground — there the accent
  word is royal and the gold is its underline, rule, pill or fill — and it
  carries words only on navy. An earlier approach darkened the gold for text,
  which passed contrast but put several golds on every page; that is retired.
- **Two items for HQ to ratify at handover** (both deliberate, neither a
  mistake, and neither blocking):
  1. **Cream** (`#fffbf0`, `#fef8ed`) is outside the official palette but used
     38 times across 20 files. It came from the Figma Make source and it is
     what supplies the site's warmth and its alternating-band rhythm — most
     visibly the Key Facts band on _Herstory_. Removing it is a visual
     decision, not a cleanup; see `AGENTS.md` §6, which says not to strip it
     without a human decision. Same status for `--tint` (`#f4f6fb`), the cool
     slate band.
  2. **The Bright White definition contradicts itself in the PDF.** The color
     page lists `HEX #FCFFFE` but `Digital: R-241 G-242 B-241`, which is
     `#F1F2F1` — a visibly different, greyer white. The site uses `#ffffff`.
     HQ should say which is authoritative before anyone "corrects" it.
- **® placement (Sept 2026):** the FY2027 word-mark register shows ® on every
  entry (verified in the PDF text as U+00AE). Each mark carries ® at its
  **first prominent use on a page**; later mentions on the same page do not.
  The site header's wordmark and "Join ΣΓΡ®", and the footer tagline, mark every
  page. In headings, labels and buttons the ® is rendered raised via
  `src/lib/reg.js`; plain body copy uses the character. The registered form
  is **SGRHO** (caps) — "SGRho" in running prose is the colloquial name.
- **Beyond the brand PDF:** the USPTO confirms **THE AURORA** (Reg. No.
  4692203, live, renewed) as a Sigma Gamma Rho registration, so The Aurora
  also carries ®. Public records list about 33 marks owned by the Sorority,
  more than the PDF's register; the full list could not be retrieved
  (Justia and Trademarkia block automated access). **Ask HQ for its current
  trademark schedule** before assuming any other name is or is not
  registered.
- Registered marks to preserve: "Greater Service, Greater Progress"®,
  "Greater Women, Greater World"®, ΣΓΡ®, SGRHO®, SGRHO1922®, MCMXXII®,
  Philos®, EE-YIP®, Rhoer Club®, Philo Affiliate®.
- The Shield renders proportionally with clear space, in royal and gold only.
  Never stretched, recolored, cropped, or overlapped.
- Photography is real sisterhood, service, and celebration. Never rituals,
  photos of internal reports, alcohol or smoking, or AI-generated imagery that
  misrepresents the marks.
- Voice is warm but substantive — trust is earned with founding history, real
  figures, and named leadership, not inspirational filler.

## Evidence on Hand

Real, verified, and safe to use:

- **Photography:** `../images` (~65MB), junctioned into `public/images`.
- **Partners:** 14 corporate partners with real external URLs, in
  `src/pages/index.astro`.
- **Leadership:** 26th International Grand Basileus Marica T. Harris, the
  International Board, and five regional leadership teams, all named.
- **Organization figures:** 500+ chapters, 100,000+ members, founded 1922, 50
  U.S. states & territories, 10 countries. Since 2020: 2.1M+ hours of service,
  $7.4M+ philanthropic impact, $3.1M+ in scholarships.
- **Boulé 2026:** 61st International Biennial Boulé, Tampa, July 22–26 — the
  first SGRho international convention in Tampa since 1976; a projected $5.1M
  in direct regional economic impact, 300 newborn care packages, 3,000
  backpacks for K–8 students, 300 free swim lessons.
- **Events:** the Fall Into Greater tour dates and the Rhoyal Table Talk
  series, with locations.

Absences that future work must **not** fabricate:

- **There are no per-program impact numbers.** No verified "backpacks
  delivered," "students served," or equivalent figures exist for the five
  national programs individually. Do not generate them.
- **No testimonials, quotes from members, or case studies** beyond what is
  already quoted from published sources.
- **NPHC, the National Urban League, and UNCF are not partners** of record
  here. Only the NAACP appears in the verified material. These three have been
  named in conversation by mistake; do not add them.
- Third-party programming is only usable when SGRho is actually the named
  participant — a March of Dimes webinar was excluded from the events page
  because the named officer belonged to a different organization.

## Product Principles

1. **Earn trust with specifics.** Named leadership, real dates, verified
   figures. Generic nonprofit language is a failure mode, not a fallback.
2. **Two audiences, one page.** A prospective soror and a partner must both be
   served by the same major surfaces. No separate partner microsite.
3. **Education is the origin, not a program.** The founders' vocation frames
   scholarship and service rather than sitting beside them.
4. **Never fabricate proof.** Where a number does not exist, the design
   accommodates its absence instead of inventing it.
5. **The Portal is a destination, not a feature.** Membership systems belong
   to HQ's separate tooling; this site routes to them.

## Accessibility & Inclusion

WCAG 2.1/2.2 **AA is a requirement**, not an aspiration, and it is enforced
mechanically rather than by review: the Playwright suite in `tests/` asserts
contrast, heading structure, form labelling, accessible names, target size,
skip-link behavior, and `prefers-reduced-motion` across every route. A change
that regresses any of these fails the build.

The audience skews mobile, so layout must hold from 320px up.
