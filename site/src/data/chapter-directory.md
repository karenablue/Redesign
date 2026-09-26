# Chapter directory

`chapter-directory.json` lists 672 chapters (348 undergraduate,
324 alumnae; 474 with a map position), built by
`scripts/sync-chapters.mjs` on 2026-09-26 from HQ's own chapter feed:
https://sgrho1922.org/wp-json/sgr/v1/chapters (the data behind the current sgrho1922.org Chapter Locator).

Rebuild with `npm run sync:chapters` while that feed exists. When the WordPress
site is retired, point the script at an export from HQ's member system, or
edit `chapter-directory.json` directly.

## How the list is made

- **Which chapters:** every undergraduate and graduate (alumnae) record in the
  feed. All are marked "Open", so the feed is HQ's list of active chapters.
  Rhoer, Philo and Rhosebud affiliate groups are left out (Karena, 2026-09-26);
  they have their own Affiliates page, and Rhosebuds are a youth group.
- **Details:** the feed rarely names a school and gives no location for 158
  chapters, so `chapter-directory-regional.json` (the earlier snapshot of the
  five regional directories, 2026-09-18) fills city, state, school and region
  for chapters it matches by name.
- **Regions:** from that snapshot where matched, otherwise from the state
  (every state maps to one region in the snapshot).
- **Cities** in the feed are often mailing addresses, not campus towns
  (Psi, Southern Illinois University, is listed in Fairview Heights, IL).

## For HQ to confirm before launch

`chapter-review.json` holds these lists in full.

1. **Is this data meant to be public?** The feed is a Salesforce report export.
   It includes the report footer "Confidential Information - Do Not Distribute"
   and a Salesforce copyright line as if they were chapters. The chapter
   details themselves (names, cities, schools, websites) are already shown on
   the public locator. Site owner's call (Karena, 2026-09-26): fine to use. The
   locator only tells visitors which chapters exist and where; nothing beyond
   what the live locator already publishes. Worth a courtesy note to HQ that
   their feed still carries the report footer.
2. **Rows that are not chapters** (11, dropped): Central General Member, Central Members-At-Large, Northeastern General Member, Northeastern Members-At-Large, Southeastern General Member, Southeastern Members-At-Large, Southwestern General Member, Southwestern Members-At-Large, TEST Undergraduate Chapter, Western General Member, Western Members-At-Large.
3. **Chapters with no location anywhere** (8, listed by name only): Eta Eta Sigma, Eta Tau Sigma, Eta Upsilon, Iota Iota Sigma, Sarasota/Bradenton, Florida, Staten Island, NY, Tau Eta, Xi Sigma Sigma.
4. **In the regional directories but not in HQ's list** (85), so not shown.
   Some may be closed; others may be missing from HQ's records. Examples:
   Zeta Delta, Rho Pi, Gamma Nu, Gamma Mu Sigma, Beta Gamma, Xi Iota, Tau Alpha, Xi Delta, Zeta, Beta Nu, Gamma Psi, Delta Kappa.

## Earlier snapshot

`chapter-directory-regional.json` is kept as the fallback source above. Its
provenance notes follow, unchanged.

`chapter-directory.json` contains 719 chapter listings collected September 18,
2026 from official regional directories, the supplied Southwestern map, and Wikipedia. Each record retains its source URL.
It is a static snapshot, not a live national feed or a certification of active
chapter status. Do not add the illustrative records in `chapters.js` to this data.

- Central: 120 named chapters from https://www.sgrhocentral.com/chapter-locator.
  Campus listings labeled only “Central Region Undergraduates” were omitted
  because no chapter name was supplied. Duplicate Epsilon Nu Sigma entries
  (Matteson/Matterson) were consolidated using the first published listing.
  Michigan was normalized to MI; other location spellings remain as published.
- Western: 56 chapters from the state/area pages linked at
  https://www.westernsgrho.org/wr-chapter-directory: arizona, california,
  colorado, hawaii, japan, nevada, newmexico, oregon, uae, washington.
- Northeastern: 163 named chapters from the supplied Connecticut, Delaware,
  District of Columbia, Maryland, Massachusetts, New Jersey, New York, North
  Carolina, Pennsylvania, Rhode Island, Virginia, and international-chapters
  pages at https://www.sgrhoneregion.org. International entries include Nu
  Lambda Sigma (Accra, Ghana) and Gamma Sigma Sigma (Bermuda). Unnamed NERU
  expansion/campus listings are omitted; campuses and spellings are as published.
  Ghana and Bermuda chapters use the alumnae pathway. Other chapter types follow
  their published Undergraduate/Alumnae section. Repeated source URLs are imported once.
- Southwestern: 67 entries labeled ACTIVE in the KML export of the supplied map
  https://www.google.com/maps/d/u/0/viewer?mid=1xG4niXX33pUVIJBC4e6eWFAjd3LVi3CE.
  Its displayed publication date is November 21, 2018. That label is historical,
  not verification of present status. Age/status notes are retained in the internal dataset. The 14 entries labeled INACTIVE are omitted. GRADUATE maps to alumnae;
  UNDERGRADUATE maps to undergraduate. The export supplies city/state addresses,
  not coordinates. Confirm current information at https://www.sigmaswregion.com/locate.
- Wikipedia: 310 gap-filling listings from the supplied chapter list, comprising
  the five previously added single-letter chapters and all 305 remaining listings
  with assigned regions. Regions follow published geographic boundaries,
  independent of individual chapter website availability. Wikipedia source/status notes are retained internally. Inactive and Reissued Wikipedia rows were not
  imported. Gamma Alpha (Liberia) and Kappa Beta (missing location) are excluded
  at the user's request. All assigned audit records are now imported.
  Entries giving only a territory/country retain that location without inventing
  a city. U.S. state names are normalized to postal abbreviations, including DC.
  Same-name listings with distinct published campuses/locations remain separate.
- Final regional totals: Central 160, Northeastern 202, Southeastern 181, Southwestern 107, Western 69.
  This collection combines supplied sources and does not guarantee exhaustive
  or currently active chapter coverage. Totals count listings.

Before updating, review each official listing for chapter name, location,
campus, and type. Keep the collection date and page coverage note in sync.
The UI searches names, cities, state names/abbreviations, campuses, and regions.
ZIP codes, distance calculations, and map pins require validated location data
and are not offered. Source directory links provide current contact information;
personal email addresses are deliberately not copied into this snapshot.

## Site-owner charter update

The supplied regional screenshot adds Phi Gamma (Albion University, Albion, MI;
Fall 2025) and Phi Epsilon (Simmons College, Louisville, KY; Spring 2026). Both
are Central undergraduate chapters. Campus names are preserved as supplied.
The screenshot is the evidence for the new charters; their links lead to the
Central directory for contact information rather than asserting that the
directory currently lists them. The previously pending Governors State University charter is now imported as
Phi Zeta (University Park, IL; Central undergraduate), following the site owner’s
chapter-name confirmation. Its notes remain internal.

The following named chapters from that screenshot were already present:

- Fall 2024 reactivations: Nu Beta, Rho Psi, Xi Beta.
- Spring 2025 reactivations: Eta, Tau Iota.
- Fall 2025 reactivations: Epsilon, Eta Psi.
- Spring 2026 reinstatements: Lambda, Rho Tau, Xi Gamma.

Source/status notes are not displayed in the public locator, per the site owner.
Wikipedia-backed cards link to their regional directory for chapter information.
