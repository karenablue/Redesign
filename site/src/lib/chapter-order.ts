const greekLetters = [
  "alpha",
  "beta",
  "gamma",
  "delta",
  "epsilon",
  "zeta",
  "eta",
  "theta",
  "iota",
  "kappa",
  "lambda",
  "mu",
  "nu",
  "xi",
  "omicron",
  "pi",
  "rho",
  "sigma",
  "tau",
  "upsilon",
  "phi",
  "chi",
  "psi",
  "omega",
];

/** Chapter sequence finishes single-letter names before double and triple names. */
export function compareChapterNames(a: string, b: string): number {
  const left = a.trim().toLowerCase().split(/\s+/);
  const right = b.trim().toLowerCase().split(/\s+/);
  if (left.length !== right.length) return left.length - right.length;
  for (let i = 0; i < Math.min(left.length, right.length); i++) {
    const leftRank = greekLetters.indexOf(left[i]);
    const rightRank = greekLetters.indexOf(right[i]);
    const difference =
      (leftRank < 0 ? greekLetters.length : leftRank) -
      (rightRank < 0 ? greekLetters.length : rightRank);
    if (difference) return difference;
    if (leftRank < 0 && left[i] !== right[i]) return left[i].localeCompare(right[i]);
  }
  return left.length - right.length;
}
