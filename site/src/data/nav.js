/* ==========================================================================
   Site navigation — ONE source of truth.
   The old site copy-pasted this <nav> markup into 24 HTML files; changing a
   link meant a 24-file find-and-replace. Here it is data. SiteHeader.astro,
   SiteFooter.astro, and the search index all read from this file.

   Paths are root-absolute ("/about/herstory/") so they work from any page
   depth. Astro's `base` config (astro.config.mjs) is prepended automatically
   where needed via the withBase() helper in the components.
   ========================================================================== */

/**
 * Top-level sections. An item either links directly (`href`) or opens a
 * dropdown (`children`); the annotation keeps both shapes valid for
 * consumers like 404.astro.
 * @type {{ label: string; href?: string; children?: { label: string; href: string }[] }[]}
 */
export const primaryNav = [
  {
    label: "About",
    children: [
      { label: "Herstory", href: "/about/herstory/" },
      { label: "Our Founders", href: "/about/our-founders/" },
      { label: "Our Foundations", href: "/about/our-foundations/" },
      { label: "Notable Sigmas", href: "/about/notable-sigmas/" },
      { label: "Anti-Hazing Policy", href: "/about/anti-hazing-policy/" },
    ],
  },
  {
    label: "Leadership",
    children: [
      { label: "International Grand Basileus", href: "/leadership/international-grand-basileus/" },
      { label: "Board of Directors", href: "/leadership/international-board/" },
      { label: "Regional Leadership", href: "/leadership/regional-leadership/" },
      { label: "International Corporate Headquarters", href: "/leadership/headquarters/" },
      { label: "Past Grand Basilei", href: "/leadership/past-grand-basilei/" },
    ],
  },
  {
    label: "Membership",
    children: [
      { label: "Become a Member", href: "/membership/become-a-member/" },
      { label: "Reactivate Membership", href: "/membership/reactivate/" },
      { label: "Chapter Locator", href: "/membership/chapter-locator/" },
    ],
  },
  {
    label: "Programs & Initiatives",
    children: [
      { label: "National Programs", href: "/service-impact/national-programs/" },
      { label: "Partner Foundations", href: "/service-impact/partner-foundations/" },
      { label: "Affiliates", href: "/service-impact/affiliates/" },
    ],
  },
  {
    label: "News & Events",
    children: [
      { label: "Latest News", href: "/news-events/latest-news/" },
      { label: "Upcoming Events", href: "/news-events/upcoming-events/" },
      { label: "Highlights & Stories", href: "/news-events/highlights-stories/" },
      { label: "Media Relations", href: "/news-events/media-relations/" },
    ],
  },
  {
    label: "Resources",
    children: [
      { label: "Help Center", href: "/resources/help-center/" },
      { label: "Contact Us", href: "/resources/contact/" },
      { label: "Careers", href: "/resources/careers/" },
      { label: "Vendor", href: "/resources/vendor/" },
      { label: "Media", href: "/resources/media/" },
    ],
  },
];

/* Deck 1's two utility actions, right of the wordmark. */
export const headerActions = [
  // Joining and signing in side by side, the pattern the D9 benchmark
  // credits to Iota Phi Theta.
  { label: "Join", href: "/membership/become-a-member/", variant: "outline" },
  {
    label: "Poodle Portal",
    href: "https://portal.sgrho1922.org/",
    external: true,
    variant: "solid",
  },
  { label: "Donate", href: "/service-impact/partner-foundations/", variant: "outline" },
];

/* Footer link columns. Kept separate from primaryNav because the footer
   groups links differently (e.g. "Programs", Poodle Portal). */
export const footerColumns = [
  {
    title: "About",
    links: [
      { label: "Our History", href: "/about/herstory/" },
      { label: "Our Founders", href: "/about/our-founders/" },
      { label: "Our Foundations", href: "/about/our-foundations/" },
      { label: "Notable Sigmas", href: "/about/notable-sigmas/" },
      { label: "Headquarters", href: "/leadership/headquarters/" },
    ],
  },
  {
    title: "Membership",
    links: [
      { label: "Become a Member", href: "/membership/become-a-member/" },
      { label: "Reactivate", href: "/membership/reactivate/" },
      { label: "Chapter Locator", href: "/membership/chapter-locator/" },
      { label: "Poodle Portal", href: "https://portal.sgrho1922.org/", external: true },
      { label: "Accountability", href: "/membership/accountability/" },
    ],
  },
  {
    title: "Programs",
    links: [
      { label: "National Programs", href: "/service-impact/national-programs/" },
      { label: "Scholarships", href: "/service-impact/partner-foundations/#nef" },
      { label: "Partner Foundations", href: "/service-impact/partner-foundations/" },
      { label: "Affiliates", href: "/service-impact/affiliates/" },
      { label: "Corporate Partnerships", href: "/service-impact/corporate-partnerships/" },
    ],
  },
];

/* Bottom-bar legal links — site-wide utility pages, kept out of primaryNav
   and footerColumns because they belong in the copyright row. */
export const footerLegal = [
  { label: "Privacy Policy", href: "/privacy/" },
  { label: "Cookie Notice", href: "/cookies/" },
  { label: "Terms of Use", href: "/terms/" },
  { label: "Accessibility", href: "/accessibility/" },
  { label: "Membership Accountability", href: "/membership/accountability/" },
  { label: "Anti-Hazing Policy", href: "/about/anti-hazing-policy/" },
  { label: "Help Center", href: "/resources/help-center/" },
];

export const footerContact = {
  title: "Contact",
  lines: ["Headquarters", "1000 Southhill Dr STE 200", "Cary, NC 27513"],
  phone: "+19196789720",
  phoneLabel: "(919) 678-9720",
  email: "help@sgrho1922.org",
};

export const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/sgrhoupdates", external: true },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@ICHQofSigmaGammaRhoSororityInc",
    external: true,
  },
  { label: "TikTok", href: "https://www.tiktok.com/@sgrhoupdates", external: true },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/sigma-gamma-rho-sorority-inc./",
    external: true,
  },
  { label: "Instagram", href: "https://www.instagram.com/sgrhoupdates/", external: true },
];

/* Flat list for the client-side search index. Derived from primaryNav so it
   never drifts out of sync. */
export function searchIndex() {
  const out = [{ label: "Home", href: "/" }];
  for (const item of primaryNav) {
    if (item.href) out.push({ label: item.label, href: item.href });
    for (const child of item.children ?? []) out.push({ label: child.label, href: child.href });
  }
  return [...out, ...unlistedPages];
}

/* Real pages the tested IA leaves out of primaryNav. They stay reachable
   from the footer and in-page links, and search still finds them. */
const unlistedPages = [
  { label: "Membership Accountability", href: "/membership/accountability/" },
  { label: "Corporate Partnerships", href: "/service-impact/corporate-partnerships/" },
];
