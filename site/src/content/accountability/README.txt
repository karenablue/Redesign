Membership Accountability register

One .md file per action, frontmatter only. The schema and the rules are in
src/content.config.ts ("accountability").

Add entries ONLY from International Corporate Headquarters' official register,
and only after counsel has approved publishing it. Suspensions with an endDate
in the past drop off the public page at the next build.

Example (member suspension), saved as e.g. 2026-10-01-lastname-firstname.md:

---
category: member-suspensions
region: Southwestern
chapter: Example Sigma Chapter
state: TX
location: Houston, TX
firstName: Firstname
lastName: Lastname
effective: 2026-10-01
endDate: 2027-10-01
fine: "$500"
listed: 2026-10-01
---
