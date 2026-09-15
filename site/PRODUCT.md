# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two primary audiences, confirmed by the client. Neither is secondary; when
their needs conflict on a surface, the surface must serve both rather than
pick one:

- **Prospective sorors** — collegiate women and alumnae/graduate women
  evaluating membership. Their job is to decide whether this is for them, then
  find the right pathway (collegiate vs. alumnae) and a chapter near them.
- **Corporate and foundation partners** — sponsors, funders, and prospective
  partners evaluating credibility, national reach, and program substance
  before committing money or a co-branded initiative.

Also served, but not the optimization target: current sorors, inactive members
considering reactivation, families of members, individual donors, and
press/general public.

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

- 28 routes in the current build (27 public pages plus a custom 404).
- **The Poodle Portal stays external.** It is linked to and never rebuilt,
  proxied, or wrapped.
- **HQ staff must be able to self-edit content** — at minimum news, events,
  and leadership, which are the pages that go stale.
- **Static output is acceptable.** Combined with the requirement above, this
  means a static build fed by a git-based or headless CMS rather than a plain
  developer-edited static site. **Open decision: which CMS.** Nothing in the
  current codebase commits to one, and future work must not assume a plain
  static site with no editing path.
- Organization vocabulary is not interchangeable with generic equivalents:
  *Herstory* (not History), *Soror*, *Boulé*, *Basileus* / *Grand Basileus*,
  *Philos®*, *Rhoer Club®*, *EE-YIP®*. Full legal name on first use.

## Brand Commitments

- The **SGR Brand Guidelines FY2027** (created January 2026, effective July
  2026) is the authoritative source. Where anything else disagrees, it wins.
- Official type is **LEMON MILK** (display) and **Montserrat** (body) — the
  guidelines name only these two and explicitly reject decorative fonts.
  The rebuild extends this to four roles by an explicit client decision
  (Playfair Display for editorial voice, Pinyon Script as a rationed accent);
  that extension is deliberate and documented, not drift.
- Color: Royal Blue `#2041A5` (Pantone 19-4053), Gold `#DFB136` (Pantone
  13-0757), Bright White `#FCFFFE`, Black. **Yellow Gold `#FFD700` is Rhoer
  Club only.** The official palette contains no cream.
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
