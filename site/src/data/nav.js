/* ==========================================================================
   Site navigation — ONE source of truth.
   The old site copy-pasted this <nav> markup into 24 HTML files; changing a
   link meant a 24-file find-and-replace. Here it is data. SiteHeader.astro,
   SiteFooter.astro, and the search index all read from this file.

   Paths are root-absolute ("/about/herstory/") so they work from any page
   depth. Astro's `base` config (astro.config.mjs) is prepended automatically
   where needed via the withBase() helper in the components.
   ========================================================================== */

export const primaryNav = [
  {
    label: "About",
    children: [
      { label: "Herstory", href: "/about/herstory/" },
      { label: "Our Founders", href: "/about/our-founders/" },
      { label: "Notable Sigmas", href: "/about/notable-sigmas/" },
      { label: "International Corporate Headquarters", href: "/about/headquarters/" },
    ],
  },
  {
    label: "Leadership",
    children: [
      { label: "International Grand Basileus", href: "/leadership/international-grand-basileus/" },
      { label: "International Board of Directors", href: "/leadership/international-board/" },
      { label: "Regional Leadership", href: "/leadership/regional-leadership/" },
      { label: "Past Grand Basilei", href: "/leadership/past-grand-basilei/" },
    ],
  },
  {
    label: "Membership",
    children: [
      { label: "Become a Member", href: "/membership/become-a-member/" },
      { label: "Reactivate Membership", href: "/membership/reactivate/" },
      { label: "Chapter Locator", href: "/membership/chapter-locator/" },
      { label: "Affiliates", href: "/membership/affiliates/" },
      { label: "Accountability", href: "/membership/accountability/" },
    ],
  },
  {
    label: "Service & Impact",
    children: [
      { label: "National Programs", href: "/service-impact/national-programs/" },
      { label: "Partner Foundations", href: "/service-impact/partner-foundations/" },
      { label: "Corporate Partnerships", href: "/service-impact/corporate-partnerships/" },
    ],
  },
  {
    label: "News & Events",
    children: [
      { label: "Latest News", href: "/news-events/latest-news/" },
      { label: "Upcoming Events", href: "/news-events/upcoming-events/" },
      { label: "Media Relations", href: "/news-events/media-relations/" },
    ],
  },
  {
    label: "Resources",
    children: [
      { label: "Vendor", href: "/resources/vendor/" },
      { label: "Help Center", href: "/resources/help-center/" },
      { label: "Anti-Hazing Policy", href: "/resources/anti-hazing-policy/" },
      { label: "Careers", href: "/resources/careers/" },
    ],
  },
  { label: "Contact", href: "/contact/" },
];

/* Header action buttons (right side of the nav bar). */
/* Tier 1 of the header: utility links for people who already know what they
   came for. The Poodle Portal lives here rather than in the main nav. */
export const headerUtility = [
  { label: "Find a Chapter", href: "/membership/chapter-locator/" },
  { label: "Donate", href: "/service-impact/partner-foundations/" },
  { label: "Poodle Portal", href: "https://portal.sgrho1922.org/", external: true },
];

/* Tier 2's call to action. One button: the public path in. */
export const headerActions = [
  { label: "Join ΣΓΡ®", href: "/membership/become-a-member/", variant: "solid" },
];

/* Footer link columns. Kept separate from primaryNav because the footer
   groups links differently (e.g. "Programs", Poodle Portal). */
export const footerColumns = [
  {
    title: "About",
    links: [
      { label: "Our History", href: "/about/herstory/" },
      { label: "The Seven Founders", href: "/about/our-founders/" },
      { label: "Notable Sigmas", href: "/about/notable-sigmas/" },
      { label: "Headquarters", href: "/about/headquarters/" },
    ],
  },
  {
    title: "Membership",
    links: [
      { label: "Become a Member", href: "/membership/become-a-member/" },
      { label: "Reactivate", href: "/membership/reactivate/" },
      { label: "Chapter Locator", href: "/membership/chapter-locator/" },
      { label: "Poodle Portal", href: "https://portal.sgrho1922.org/", external: true },
      { label: "Affiliates", href: "/membership/affiliates/" },
      { label: "Accountability", href: "/membership/accountability/" },
    ],
  },
  {
    title: "Programs",
    links: [
      { label: "National Programs", href: "/service-impact/national-programs/" },
      { label: "Scholarships", href: "/service-impact/partner-foundations/#nef" },
      { label: "Partner Foundations", href: "/service-impact/partner-foundations/" },
      { label: "Corporate Partnerships", href: "/service-impact/corporate-partnerships/" },
      { label: "Community Impact", href: "/service-impact/national-programs/" },
    ],
  },
];

/* Bottom-bar legal links — site-wide utility pages, kept out of primaryNav
   and footerColumns because they belong in the copyright row. */
export const footerLegal = [
  { label: "Privacy Policy", href: "/privacy/" },
  { label: "Cookie Notice", href: "/cookies/" },
  { label: "Terms of Use", href: "/terms/" },
  { label: "Membership Accountability", href: "/membership/accountability/" },
  { label: "Anti-Hazing Policy", href: "/resources/anti-hazing-policy/" },
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
  return out;
}
