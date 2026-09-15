/* ==========================================================================
   SAMPLE chapter dataset — powers the Chapter Locator search + filters.

   ⚠  ILLUSTRATIVE DEMO DATA. This is NOT the official Sigma Gamma Rho chapter
   directory. It exists so the locator's search / filter / results UI is
   genuinely functional in the rebuild. Swap this array for the authoritative
   national feed (same shape) when it's available — nothing else needs to
   change. Until then the five regional directories linked on the page remain
   the source of truth, and the UI says so.

   shape:
     name    display name — institution for collegiate, "<City> Alumnae" for
             alumnae chapters
     type    "undergraduate" | "alumnae"
     city    city
     state   full state / territory name (matched by search)
     abbr    USPS abbreviation (also matched by search, e.g. "GA")
     region  one of chapterRegions
   ========================================================================== */

export const chapterRegions = [
  "Central",
  "Northeastern",
  "Southeastern",
  "Southwestern",
  "Western",
];

export const chapters = [
  // ---- Central ----------------------------------------------------------
  { name: "Butler University", type: "undergraduate", city: "Indianapolis", state: "Indiana", abbr: "IN", region: "Central" },
  { name: "University of Illinois", type: "undergraduate", city: "Champaign", state: "Illinois", abbr: "IL", region: "Central" },
  { name: "Chicago Alumnae", type: "alumnae", city: "Chicago", state: "Illinois", abbr: "IL", region: "Central" },
  { name: "Detroit Alumnae", type: "alumnae", city: "Detroit", state: "Michigan", abbr: "MI", region: "Central" },
  { name: "Twin Cities Alumnae", type: "alumnae", city: "Minneapolis", state: "Minnesota", abbr: "MN", region: "Central" },
  { name: "Milwaukee Alumnae", type: "alumnae", city: "Milwaukee", state: "Wisconsin", abbr: "WI", region: "Central" },
  { name: "Greater Kansas City Alumnae", type: "alumnae", city: "Kansas City", state: "Missouri", abbr: "MO", region: "Central" },

  // ---- Northeastern ----------------------------------------------------
  { name: "Howard University", type: "undergraduate", city: "Washington", state: "District of Columbia", abbr: "DC", region: "Northeastern" },
  { name: "University of Maryland", type: "undergraduate", city: "College Park", state: "Maryland", abbr: "MD", region: "Northeastern" },
  { name: "New York Metropolitan Alumnae", type: "alumnae", city: "New York", state: "New York", abbr: "NY", region: "Northeastern" },
  { name: "Philadelphia Alumnae", type: "alumnae", city: "Philadelphia", state: "Pennsylvania", abbr: "PA", region: "Northeastern" },
  { name: "Boston Alumnae", type: "alumnae", city: "Boston", state: "Massachusetts", abbr: "MA", region: "Northeastern" },
  { name: "Pittsburgh Alumnae", type: "alumnae", city: "Pittsburgh", state: "Pennsylvania", abbr: "PA", region: "Northeastern" },
  { name: "Northern Virginia Alumnae", type: "alumnae", city: "Alexandria", state: "Virginia", abbr: "VA", region: "Northeastern" },

  // ---- Southeastern --------------------------------------------------
  { name: "Florida A&M University", type: "undergraduate", city: "Tallahassee", state: "Florida", abbr: "FL", region: "Southeastern" },
  { name: "University of South Carolina", type: "undergraduate", city: "Columbia", state: "South Carolina", abbr: "SC", region: "Southeastern" },
  { name: "Atlanta Alumnae", type: "alumnae", city: "Atlanta", state: "Georgia", abbr: "GA", region: "Southeastern" },
  { name: "Charlotte Alumnae", type: "alumnae", city: "Charlotte", state: "North Carolina", abbr: "NC", region: "Southeastern" },
  { name: "Nashville Alumnae", type: "alumnae", city: "Nashville", state: "Tennessee", abbr: "TN", region: "Southeastern" },
  { name: "Miami-Dade Alumnae", type: "alumnae", city: "Miami", state: "Florida", abbr: "FL", region: "Southeastern" },
  { name: "Birmingham Alumnae", type: "alumnae", city: "Birmingham", state: "Alabama", abbr: "AL", region: "Southeastern" },

  // ---- Southwestern ------------------------------------------------
  { name: "Prairie View A&M University", type: "undergraduate", city: "Prairie View", state: "Texas", abbr: "TX", region: "Southwestern" },
  { name: "University of Oklahoma", type: "undergraduate", city: "Norman", state: "Oklahoma", abbr: "OK", region: "Southwestern" },
  { name: "Houston Alumnae", type: "alumnae", city: "Houston", state: "Texas", abbr: "TX", region: "Southwestern" },
  { name: "Dallas Alumnae", type: "alumnae", city: "Dallas", state: "Texas", abbr: "TX", region: "Southwestern" },
  { name: "New Orleans Alumnae", type: "alumnae", city: "New Orleans", state: "Louisiana", abbr: "LA", region: "Southwestern" },
  { name: "Little Rock Alumnae", type: "alumnae", city: "Little Rock", state: "Arkansas", abbr: "AR", region: "Southwestern" },

  // ---- Western ---------------------------------------------------
  { name: "University of California, Los Angeles", type: "undergraduate", city: "Los Angeles", state: "California", abbr: "CA", region: "Western" },
  { name: "Los Angeles Alumnae", type: "alumnae", city: "Los Angeles", state: "California", abbr: "CA", region: "Western" },
  { name: "Bay Area Alumnae", type: "alumnae", city: "Oakland", state: "California", abbr: "CA", region: "Western" },
  { name: "Seattle Alumnae", type: "alumnae", city: "Seattle", state: "Washington", abbr: "WA", region: "Western" },
  { name: "Las Vegas Alumnae", type: "alumnae", city: "Las Vegas", state: "Nevada", abbr: "NV", region: "Western" },
  { name: "Denver Alumnae", type: "alumnae", city: "Denver", state: "Colorado", abbr: "CO", region: "Western" },
];
