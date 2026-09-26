/** Transcribed from the supplied 2026–27 Community Impact and Recognition calendars.
 * Undated initiatives remain monthly focuses; no event times or locations are inferred.
 */
export interface CalendarItem {
  title: string;
  date: string;
  note?: string;
}

export interface CalendarMonth {
  id: string;
  label: string;
  impact: CalendarItem[];
  recognition: CalendarItem[];
}

export const nationalCalendar: CalendarMonth[] = [
  {
    id: "2026-09",
    label: "September 2026",
    impact: [
      { date: "Sep 10", title: "World Suicide Prevention Day" },
      { date: "Sep 26", title: "St. Jude Walk" },
    ],
    recognition: [
      { date: "Sep 7", title: "Labor Day" },
      { date: "Sep 11", title: "September 11" },
      { date: "Sep 15 – Oct 15", title: "National Hispanic Heritage Month" },
      { date: "Sep 15", title: "National Voter Registration Day" },
      { date: "Sep 21–25", title: "Hazing Prevention Week" },
    ],
  },
  {
    id: "2026-10",
    label: "October 2026",
    impact: [
      { date: "Monthly focus", title: "Women's Wellness Initiative" },
      { date: "Month-long", title: "Domestic Violence Awareness Month" },
      { date: "Month-long", title: "Breast Cancer Awareness Month" },
      { date: "Date not specified", title: "World Mental Health Day" },
    ],
    recognition: [{ date: "Oct 12", title: "Indigenous Peoples’ Day" }],
  },
  {
    id: "2026-11",
    label: "November 2026",
    impact: [
      { date: "Nov 7", title: "International Day of Service" },
      { date: "Nov 12", title: "Founders’ Day Initiative" },
      { date: "Nov 15", title: "World Prematurity Day" },
    ],
    recognition: [
      { date: "Nov 3", title: "Election Day" },
      { date: "Nov 11", title: "Veterans Day" },
      { date: "Nov 12", title: "Founders’ Day" },
      { date: "Nov 13", title: "World Kindness Day" },
      { date: "Nov 17", title: "Omega Psi Phi Founders’ Day" },
      { date: "Nov 26", title: "Thanksgiving" },
    ],
  },
  {
    id: "2026-12",
    label: "December 2026",
    impact: [{ date: "Dec 1", title: "World AIDS Day" }],
    recognition: [
      { date: "Dec 1", title: "World AIDS Day" },
      { date: "Dec 4", title: "Alpha Phi Alpha Founders’ Day" },
      { date: "Dec 25", title: "Christmas" },
      { date: "Dec 29", title: "Rhoer Club Affiliate Anniversary" },
    ],
  },
  {
    id: "2027-01",
    label: "January 2027",
    impact: [
      {
        date: "Monthly focus",
        title: "Operation BigBookBag",
        note: "Tutoring, digital literacy, and preparing for testing.",
      },
      { date: "Jan 17–23", title: "National Healthy Weight Week" },
      { date: "Month-long", title: "National Human Trafficking Prevention Month" },
      { date: "Month-long", title: "National Blood Donor Month" },
    ],
    recognition: [
      { date: "Month-long", title: "Mentoring Month" },
      { date: "Jan 1", title: "New Year’s Day" },
      { date: "Jan 5", title: "Kappa Alpha Psi Founders’ Day" },
      { date: "Jan 9", title: "Phi Beta Sigma Founders’ Day" },
      { date: "Jan 13", title: "Delta Sigma Theta Founders’ Day" },
      { date: "Jan 15", title: "Alpha Kappa Alpha Founders’ Day" },
      { date: "Jan 16", title: "Zeta Phi Beta Founders’ Day" },
      { date: "Jan 18", title: "Martin Luther King, Jr. Day" },
    ],
  },
  {
    id: "2027-02",
    label: "February 2027",
    impact: [
      { date: "Month-long", title: "National American Heart Month" },
      { date: "Date not specified", title: "Rhoyal Goes Red" },
    ],
    recognition: [
      { date: "Month-long", title: "Black History Month" },
      { date: "Feb 7", title: "Sandy Still Speaks" },
      { date: "Feb 14", title: "Valentine’s Day" },
    ],
  },
  {
    id: "2027-03",
    label: "March 2027",
    impact: [{ date: "Monthly focus", title: "Annual Youth Symposium" }],
    recognition: [
      { date: "Month-long", title: "Women’s History Month" },
      { date: "Mar 8", title: "International Women’s Day" },
      { date: "Mar 28", title: "Easter" },
    ],
  },
  {
    id: "2027-04",
    label: "April 2027",
    impact: [
      { date: "Monthly focus", title: "Project CRADLE Care" },
      { date: "Apr 11–17", title: "Black Maternal Health Week" },
      { date: "Apr 28", title: "Denim Day" },
    ],
    recognition: [
      { date: "Month-long", title: "Financial Literacy Month" },
      { date: "Month-long", title: "Month of the Military Child" },
      { date: "Apr 1–4", title: "Central Region Conference" },
      { date: "Apr 1–4", title: "Southeastern Region Conference" },
      { date: "Apr 11–17", title: "Black Maternal Health Week" },
      { date: "Apr 14–17", title: "Southwestern Region Conference" },
      { date: "Apr 15–19", title: "Western Region Conference" },
      { date: "Apr 22–25", title: "Northeastern Region Conference" },
    ],
  },
  {
    id: "2027-05",
    label: "May 2027",
    impact: [
      { date: "Monthly focus", title: "SWIM 1922" },
      { date: "May 15", title: "International Water Safety Day" },
      { date: "Monthly focus", title: "Mental Health Awareness" },
    ],
    recognition: [
      { date: "Month-long", title: "Asian American & Pacific Islander Heritage Month" },
      { date: "May 3–7", title: "Teacher Appreciation Week" },
      { date: "May 7", title: "Military Spouse Appreciation Day" },
      {
        date: "May 9 & 10",
        title: "Mother’s Day",
        note: "The supplied calendar lists two dates. Date confirmation is pending.",
      },
      { date: "May 31", title: "Memorial Day" },
    ],
  },
  {
    id: "2027-06",
    label: "June 2027",
    impact: [{ date: "Month-long", title: "Alzheimer’s & Brain Awareness Month" }],
    recognition: [
      { date: "Month-long", title: "Caribbean American Heritage Month" },
      { date: "Month-long", title: "Pride Month" },
      { date: "Jun 19", title: "Juneteenth" },
      { date: "Jun 20", title: "Father’s Day" },
    ],
  },
  {
    id: "2027-07",
    label: "July 2027",
    impact: [],
    recognition: [
      { date: "Jul 1", title: "Sorority New Year" },
      { date: "Jul 3", title: "National Crown Day" },
      { date: "Jul 4", title: "Independence Day" },
    ],
  },
];
