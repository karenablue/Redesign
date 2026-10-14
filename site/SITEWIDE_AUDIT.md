# Public-site design audit — September 30, 2026

## Scope

Reviewed all 30 public routes at 375px and 1440px using the built Astro site.
The homepage changes were also checked at 320px. The review focused on a
first-time visitor's ability to understand Sigma Gamma Rho, explore membership,
see service, and find a local chapter. Automated accessibility and responsive
checks are maintained in `tests/`.

| Section            | Public routes reviewed                                                                                                                                 | Finding                                                                                                                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Home               | `/`                                                                                                                                                    | Strong photography and typography; the old opening led with the administration theme and member login before explaining the organization. Updated the opening, section order, and visitor paths.       |
| About              | `/about/herstory/`, `/about/our-founders/`, `/about/notable-sigmas/`, `/about/headquarters/`                                                           | Clear source-based history and leadership context. Herstory, founders, and notable members are long on phones; retain the full record, but future source-approved editing could make scanning easier.  |
| Leadership         | `/leadership/international-grand-basileus/`, `/leadership/international-board/`, `/leadership/regional-leadership/`, `/leadership/past-grand-basilei/` | Consistent hierarchy and portrait treatment. The Grand Basileus section remains on the homepage after the visitor introduction.                                                                        |
| Membership         | `/membership/become-a-member/`, `/membership/reactivate/`, `/membership/chapter-locator/`, `/membership/affiliates/`, `/membership/accountability/`    | Membership pathways and the chapter locator are useful. The main gap was access from the closed phone menu; membership is now a visible mobile header action on every route.                           |
| Service and impact | `/service-impact/national-programs/`, `/service-impact/partner-foundations/`, `/service-impact/corporate-partnerships/`                                | Named programs and partner routes provide substance. Program photography and verified local outcomes would make the work more tangible. The homepage now sends visitors directly to national programs. |
| News and events    | `/news-events/latest-news/`, `/news-events/upcoming-events/`, `/news-events/chapter-stories/`, `/news-events/media-relations/`                         | News and event layouts are coherent. Chapter Stories correctly waits for approved submissions. Homepage news now follows the introductory visitor journey.                                             |
| Resources          | `/resources/vendor/`, `/resources/help-center/`, `/resources/anti-hazing-policy/`, `/resources/careers/`                                               | Practical information is accessible through shared navigation and footer; the anti-hazing reporting route remains visible from the homepage.                                                           |
| Contact            | `/contact/`                                                                                                                                            | Clear route for general inquiries.                                                                                                                                                                     |
| Legal and access   | `/privacy/`, `/cookies/`, `/terms/`, `/accessibility/`                                                                                                 | Readable layouts. Published policy text and accessibility claims still require HQ/legal review before final handoff.                                                                                   |

## Changes made in this pass

- Homepage opening now states the seven-educator origin and century of service,
  with direct actions for membership and national programs.
- A short pathway section links to membership, the chapter locator, and national
  programs. Founders, programs, and chapter connection now come before leadership
  and news on the homepage.
- The shared mobile header shows an **Explore Membership** action without
  requiring the visitor to open the menu. The top-level navigation label is
  shortened to **Membership**.

## What would raise the design further

1. Obtain a high-resolution, HQ-approved service photograph for the homepage
   opening or first story. The current cover photograph is strong for sisterhood;
   direct evidence of service would better match the new promise.
2. Publish a small set of approved chapter stories with a place, program, date,
   photograph, and verified result. The current collection is intentionally empty.
3. Add HQ-verified outcomes to the program pages when available. Current copy
   explains each program's purpose without inventing impact figures.
4. Confirm policy, accessibility, CMS ownership, and deployment items in
   [HANDOFF.md](HANDOFF.md) before calling the site launch-ready.
