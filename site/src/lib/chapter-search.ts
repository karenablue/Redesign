/** Match a dated directory listing without inferring distance or chapter status. */
const states: Record<string, string> = {
  AR: "Arkansas",
  AL: "Alabama",
  AZ: "Arizona",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  DC: "District of Columbia Washington DC",
  HI: "Hawaii",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  MD: "Maryland",
  MA: "Massachusetts",
  ME: "Maine",
  MI: "Michigan",
  MN: "Minnesota",
  MO: "Missouri",
  MS: "Mississippi",
  NE: "Nebraska",
  ND: "North Dakota",
  NV: "Nevada",
  NM: "New Mexico",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NY: "New York",
  NC: "North Carolina",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  VA: "Virginia",
  VT: "Vermont",
  WV: "West Virginia",
  WA: "Washington",
  WI: "Wisconsin",
  GER: "Germany",
};
const normalize = (value: string) =>
  value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

export function matchesChapter(
  chapter: { search: string; state: string; type: string; region: string },
  query: string,
  type = "all",
  region = "all"
) {
  if (type !== "all" && chapter.type !== type) return false;
  if (region !== "all" && chapter.region !== region) return false;
  const terms = normalize(query).split(" ").filter(Boolean);
  const words = normalize(`${chapter.search} ${states[chapter.state] ?? ""}`).split(" ");
  return terms.every((term) => words.some((word) => word.startsWith(term)));
}
