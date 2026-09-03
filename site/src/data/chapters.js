/* ==========================================================================
   Chapter directory — sample/illustrative data for the Find a Chapter
   prototype. Chapter names, cities, and founding years are illustrative
   (not a real directory pull); region assignments follow the Sorority's
   actual regional boundaries below.

   Central: IL, IN, IA, KS, KY, MI, MO, MN, NE, ND, OH, SD, WI, and the
     Canadian divisions from Windsor, Ontario west to Saskatchewan, plus the
     Baffin Islands, Greenland, Iceland, Queen Elizabeth Islands, and Germany.
   Northeastern: Bermuda, Eastern Canada, CT, DE, DC, Ghana, Korea, ME, MD,
     MA, NH, NY, NJ, NC, PA, RI, VT, VA, WV.
   Southeastern: AL, FL, GA, MS, SC, TN, the Bahamas, and the Virgin Islands.
   Southwestern: AR, LA, OK, TX, and Belize.
   Western: AK, AZ, CA, CO, HI, ID, MT, NV, NM, OR, UT, WA, WY, the UAE, and
     Japan.
   ========================================================================== */

export const regions = ["Central", "Northeastern", "Southeastern", "Southwestern", "Western"];

export const chapters = [
  { name: "Alpha Chapter", type: "Collegiate", region: "Central", city: "Indianapolis", state: "IN", established: 1922 },
  { name: "Alpha Delta Chapter", type: "Collegiate", region: "Central", city: "Chicago", state: "IL", established: 1948 },
  { name: "Alpha Rho Sigma Chapter", type: "Alumnae", region: "Central", city: "Detroit", state: "MI", established: 1954 },
  { name: "Beta Chapter", type: "Collegiate", region: "Central", city: "Columbus", state: "OH", established: 1925 },
  { name: "Chi Sigma Chapter", type: "Alumnae", region: "Central", city: "St. Louis", state: "MO", established: 1961 },
  { name: "Omicron Chapter", type: "Collegiate", region: "Central", city: "Milwaukee", state: "WI", established: 1946 },

  { name: "Gamma Sigma Chapter", type: "Alumnae", region: "Northeastern", city: "Philadelphia", state: "PA", established: 1939 },
  { name: "Epsilon Chapter", type: "Collegiate", region: "Northeastern", city: "Pittsburgh", state: "PA", established: 1931 },
  { name: "Theta Sigma Chapter", type: "Alumnae", region: "Northeastern", city: "New York", state: "NY", established: 1943 },
  { name: "Rho Delta Chapter", type: "Collegiate", region: "Northeastern", city: "Boston", state: "MA", established: 1968 },
  { name: "Phi Sigma Chapter", type: "Alumnae", region: "Northeastern", city: "Newark", state: "NJ", established: 1957 },
  { name: "Mu Sigma Chapter", type: "Alumnae", region: "Northeastern", city: "Charlotte", state: "NC", established: 1959 },
  { name: "Pi Sigma Chapter", type: "Alumnae", region: "Northeastern", city: "Cary", state: "NC", established: 1971 },

  { name: "Zeta Sigma Chapter", type: "Alumnae", region: "Southeastern", city: "Atlanta", state: "GA", established: 1944 },
  { name: "Kappa Chapter", type: "Collegiate", region: "Southeastern", city: "Tallahassee", state: "FL", established: 1937 },
  { name: "Xi Chapter", type: "Collegiate", region: "Southeastern", city: "Nashville", state: "TN", established: 1940 },
  { name: "Tau Chapter", type: "Collegiate", region: "Southeastern", city: "Columbia", state: "SC", established: 1952 },

  { name: "Delta Sigma Chapter", type: "Alumnae", region: "Southwestern", city: "Houston", state: "TX", established: 1940 },
  { name: "Iota Chapter", type: "Collegiate", region: "Southwestern", city: "Dallas", state: "TX", established: 1949 },
  { name: "Nu Sigma Chapter", type: "Alumnae", region: "Southwestern", city: "New Orleans", state: "LA", established: 1955 },
  { name: "Omega Chapter", type: "Collegiate", region: "Southwestern", city: "Little Rock", state: "AR", established: 1958 },
  { name: "Sigma Sigma Chapter", type: "Alumnae", region: "Southwestern", city: "Oklahoma City", state: "OK", established: 1963 },

  { name: "Lambda Chapter", type: "Collegiate", region: "Western", city: "Los Angeles", state: "CA", established: 1951 },
  { name: "Upsilon Sigma Chapter", type: "Alumnae", region: "Western", city: "Oakland", state: "CA", established: 1965 },
  { name: "Psi Chapter", type: "Collegiate", region: "Western", city: "Phoenix", state: "AZ", established: 1970 },
  { name: "Omega Sigma Chapter", type: "Alumnae", region: "Western", city: "Seattle", state: "WA", established: 1974 },
];
