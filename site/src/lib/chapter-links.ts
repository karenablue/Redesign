/**
 * Works out what a Chapter Locator card links to: the chapter's own website,
 * and a logo for each of its social accounts.
 *
 * Social accounts come from two places:
 *  - HQ's record, when the "website" HQ holds is really a Facebook or
 *    Instagram page (a few are);
 *  - src/data/chapter-socials.json, the hand-kept list. Key it by the chapter
 *    name exactly as the locator shows it, e.g.
 *      { "Theta Epsilon": { "instagram": "https://www.instagram.com/..." } }
 *    Allowed keys: instagram, facebook, tiktok, x, youtube, linkedin.
 *    Only add an account the chapter itself runs.
 */
import socials from "../data/chapter-socials.json";

export const SOCIAL_NETWORKS = [
  { key: "instagram", label: "Instagram", hosts: ["instagram.com"] },
  { key: "facebook", label: "Facebook", hosts: ["facebook.com", "fb.com"] },
  { key: "tiktok", label: "TikTok", hosts: ["tiktok.com"] },
  { key: "x", label: "X", hosts: ["x.com", "twitter.com"] },
  { key: "youtube", label: "YouTube", hosts: ["youtube.com"] },
  { key: "linkedin", label: "LinkedIn", hosts: ["linkedin.com"] },
] as const;

export type SocialKey = (typeof SOCIAL_NETWORKS)[number]["key"];
export type SocialLink = { key: SocialKey; label: string; href: string };

const listed = socials as Record<string, Partial<Record<SocialKey, string>>>;

function parse(url: string): URL | null {
  try {
    const u = new URL(url);
    // "http://name@weebly.com" parses as a login for weebly.com, not a site.
    return /^https?:$/.test(u.protocol) && !u.username ? u : null;
  } catch {
    return null;
  }
}

function networkOf(u: URL) {
  const host = u.hostname.replace(/^(www|m)\./, "");
  return SOCIAL_NETWORKS.find((n) => n.hosts.some((h) => host === h || host.endsWith(`.${h}`)));
}

export function chapterLinks(chapter: { name: string; website?: string }) {
  const found = new Map<SocialKey, string>();
  let website: string | undefined;

  const hq = chapter.website ? parse(chapter.website) : null;
  if (hq) {
    const network = networkOf(hq);
    if (network) found.set(network.key, hq.href);
    else website = hq.href;
  }
  for (const [key, href] of Object.entries(listed[chapter.name] ?? {})) {
    if (href && parse(href)) found.set(key as SocialKey, href);
  }

  const social: SocialLink[] = SOCIAL_NETWORKS.filter((n) => found.has(n.key)).map((n) => ({
    key: n.key,
    label: n.label,
    href: found.get(n.key)!,
  }));
  return { website, social };
}

