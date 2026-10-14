/**
 * Builds src/data/chapter-directory.json from HQ's own chapter feed, the one
 * the current sgrho1922.org Chapter Locator reads.
 *
 *   node scripts/sync-chapters.mjs            fetch the live feed
 *   node scripts/sync-chapters.mjs feed.json  use a saved copy instead
 *
 * The feed is the source of truth for WHICH chapters exist: every record in
 * it is marked "Open". It is thin on detail, though (few schools, 158 of 683
 * chapters without a location), so the earlier regional-directory snapshot
 * (chapter-directory-regional.json) fills city, state, school and region for
 * chapters it can match by name. Regions for the rest come from a
 * state-to-region table read off that same snapshot, where every state maps
 * to exactly one region.
 *
 * Only undergraduate and graduate (alumnae) chapters are kept (Karena,
 * 2026-09-26): affiliates have their own page, and Rhosebuds are a youth
 * group. The feed is a Salesforce report export and carries non-chapter
 * rows (a "Confidential Information - Do Not Distribute" footer, a copyright
 * line, test records, member-at-large pools); those are dropped here and
 * listed in chapter-directory.md for HQ.
 *
 * The feed disappears when the WordPress site is retired. After handover,
 * point FEED_URL at whatever HQ's member system can export, or maintain
 * chapter-directory.json directly.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const FEED_URL = "https://sgrho1922.org/wp-json/sgr/v1/chapters";
const here = dirname(fileURLToPath(import.meta.url));
const dataDir = join(here, "..", "src", "data");

const US = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  "District of Columbia": "DC",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
};
// Places outside the fifty states, written the way the regional snapshot does.
const PLACE = {
  "US Virgin Islands": "U.S. Virgin Islands",
  Quebec: "Canada",
  "Grand Bahama": "Bahamas",
};

const JUNK = /^(test\b|confidential|copyright|remembers\b)|general member|members-at-large|^\s*$/i;
const norm = (s) =>
  String(s ?? "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const feedArg = process.argv[2];
const feed = feedArg
  ? JSON.parse(readFileSync(feedArg, "utf8"))
  : await (await fetch(FEED_URL, { headers: { accept: "application/json" } })).json();

const regional = JSON.parse(readFileSync(join(dataDir, "chapter-directory-regional.json"), "utf8"));
const byName = new Map(regional.chapters.map((c) => [norm(c.name), c]));
const regionOf = new Map();
for (const c of regional.chapters) regionOf.set(c.state, c.region);

const kept = [];
const dropped = [];
const unplaced = [];
for (const r of feed.chapters) {
  if (!["Undergraduate", "Graduate"].includes(r.chapter_type)) continue;
  if (JUNK.test(r.name)) {
    dropped.push(r.name);
    continue;
  }
  const match = byName.get(norm(r.name));
  const state = r.state ? (US[r.state] ?? PLACE[r.state] ?? r.state) : (match?.state ?? "");
  const city = r.city || match?.city || "";
  const region = match?.region ?? regionOf.get(state) ?? "";
  if (!state || !region) unplaced.push(r.name);
  const lat = Number(r.latitude);
  const lng = Number(r.longitude);
  kept.push({
    name: r.name.trim(),
    university: r.institution || match?.university || "",
    city,
    state,
    type: r.chapter_type === "Graduate" ? "alumnae" : "undergraduate",
    region,
    website: r.website || "",
    ...(Number.isFinite(lat) && Number.isFinite(lng) && (lat || lng) ? { lat, lng } : {}),
  });
}

const feedNames = new Set(kept.map((c) => norm(c.name)));
const notInFeed = regional.chapters.filter((c) => !feedNames.has(norm(c.name))).map((c) => c.name);

const retrieved = new Date().toISOString().slice(0, 10);
writeFileSync(
  join(dataDir, "chapter-directory.json"),
  JSON.stringify({ retrieved, source: FEED_URL, chapters: kept }, null, 1) + "\n"
);
writeFileSync(
  join(dataDir, "chapter-review.json"),
  JSON.stringify(
    {
      retrieved,
      droppedNonChapterRows: dropped,
      withoutLocation: unplaced,
      inRegionalSnapshotButNotInFeed: notInFeed,
    },
    null,
    1
  ) + "\n"
);
console.log(
  `[sync-chapters] ${kept.length} chapters (${kept.filter((c) => c.lat !== undefined).length} mapped), ` +
    `${dropped.length} non-chapter rows dropped, ${unplaced.length} without location, ` +
    `${notInFeed.length} regional-snapshot names not in the feed`
);
