/**
 * Shared bits for chapter stories and member voices (homepage + the
 * Highlights & Stories page). Submissions go to the one public HQ address;
 * no other contact address is used on this site.
 */
export const SUBMIT_EMAIL = "help@sgrho1922.org";

export const storyMailto = `mailto:${SUBMIT_EMAIL}?subject=${encodeURIComponent("Chapter Story")}`;
export const voiceMailto = `mailto:${SUBMIT_EMAIL}?subject=${encodeURIComponent("Member Voice")}`;

/** "2026-10-18" → "October 18, 2026", without timezone drift. */
export const formatStoryDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
