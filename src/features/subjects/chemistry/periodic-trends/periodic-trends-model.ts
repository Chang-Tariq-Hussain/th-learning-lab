/**
 * Periodic Trends — data model.
 *
 * Scope note: this shows the *main-group* elements only (groups 1, 2,
 * and 13–18), the same simplified table most intro-chemistry courses
 * use to teach trends. Transition metals, lanthanides, and actinides
 * are intentionally left out — including them would need a lot more
 * exception-heavy data without teaching the four trends any better.
 *
 * Every trend score below is a *relative, formula-derived* 0–1 value
 * used purely to drive the visual gradient and the comparison bars —
 * not a claim of precise experimental measurement. Direction and
 * relative ordering follow the real, well-established trends; exact
 * magnitudes are deliberately not implied (see `getScoreLabel`).
 */

export type TrendId =
  | "atomic-radius"
  | "ionization-energy"
  | "electronegativity"
  | "metallic-character";

export const TREND_ORDER: TrendId[] = [
  "atomic-radius",
  "ionization-energy",
  "electronegativity",
  "metallic-character",
];

export interface ElementDef {
  symbol: string;
  name: string;
  atomicNumber: number;
  /** Real IUPAC group number: 1, 2, or 13–18 (main groups only). */
  group: number;
  period: number;
  /**
   * Superheavy period-7 p-block elements (113–118) are synthesized one
   * atom at a time and decay in milliseconds — their chemical
   * properties are predicted from trend extrapolation, not measured.
   */
  isPredicted?: boolean;
}

// Real group number → compressed grid column (1–8), so the table
// renders as a compact "representative elements" grid with no wasted
// empty space where the transition metals would otherwise sit. This
// keeps the table small and legible on every screen size.
export const GROUP_GRID_COLUMN: Record<number, number> = {
  1: 1,
  2: 2,
  13: 3,
  14: 4,
  15: 5,
  16: 6,
  17: 7,
  18: 8,
};

const row = (
  period: number,
  atomicNumbers: number[],
  symbols: string[],
  names: string[],
  groups: number[],
  predicted?: boolean[]
): ElementDef[] =>
  atomicNumbers.map((atomicNumber, i) => ({
    atomicNumber,
    symbol: symbols[i]!,
    name: names[i]!,
    group: groups[i]!,
    period,
    isPredicted: predicted?.[i],
  }));

const GROUPS_8 = [1, 2, 13, 14, 15, 16, 17, 18];

export const ELEMENTS: ElementDef[] = [
  ...row(1, [1, 2], ["H", "He"], ["Hydrogen", "Helium"], [1, 18]),
  ...row(
    2,
    [3, 4, 5, 6, 7, 8, 9, 10],
    ["Li", "Be", "B", "C", "N", "O", "F", "Ne"],
    ["Lithium", "Beryllium", "Boron", "Carbon", "Nitrogen", "Oxygen", "Fluorine", "Neon"],
    GROUPS_8
  ),
  ...row(
    3,
    [11, 12, 13, 14, 15, 16, 17, 18],
    ["Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar"],
    ["Sodium", "Magnesium", "Aluminum", "Silicon", "Phosphorus", "Sulfur", "Chlorine", "Argon"],
    GROUPS_8
  ),
  ...row(
    4,
    [19, 20, 31, 32, 33, 34, 35, 36],
    ["K", "Ca", "Ga", "Ge", "As", "Se", "Br", "Kr"],
    ["Potassium", "Calcium", "Gallium", "Germanium", "Arsenic", "Selenium", "Bromine", "Krypton"],
    GROUPS_8
  ),
  ...row(
    5,
    [37, 38, 49, 50, 51, 52, 53, 54],
    ["Rb", "Sr", "In", "Sn", "Sb", "Te", "I", "Xe"],
    ["Rubidium", "Strontium", "Indium", "Tin", "Antimony", "Tellurium", "Iodine", "Xenon"],
    GROUPS_8
  ),
  ...row(
    6,
    [55, 56, 81, 82, 83, 84, 85, 86],
    ["Cs", "Ba", "Tl", "Pb", "Bi", "Po", "At", "Rn"],
    ["Cesium", "Barium", "Thallium", "Lead", "Bismuth", "Polonium", "Astatine", "Radon"],
    GROUPS_8
  ),
  ...row(
    7,
    [87, 88, 113, 114, 115, 116, 117, 118],
    ["Fr", "Ra", "Nh", "Fl", "Mc", "Lv", "Ts", "Og"],
    ["Francium", "Radium", "Nihonium", "Flerovium", "Moscovium", "Livermorium", "Tennessine", "Oganesson"],
    GROUPS_8,
    [false, false, true, true, true, true, true, true]
  ),
];

export function getElement(symbol: string): ElementDef | undefined {
  return ELEMENTS.find((e) => e.symbol === symbol);
}

export interface TrendMeta {
  id: TrendId;
  label: string;
  shortLabel: string;
  question: string;
  why: string[];
  acrossLabel: string;
  downLabel: string;
  acrossArrow: "→" | "←";
  downArrow: "↑" | "↓";
  /** Base hue used for the low→high gradient on the table. */
  color: string;
  /** e.g. "larger", "higher", "more metallic" — used in challenge phrasing. */
  comparativeWord: string;
  mistakeExplanation: string;
  excludesNobleGases?: boolean;
}

export const TRENDS: Record<TrendId, TrendMeta> = {
  "atomic-radius": {
    id: "atomic-radius",
    label: "Atomic Radius",
    shortLabel: "Radius",
    question: "Atomic radius is a measure of how large an atom is.",
    why: [
      "Down a group, atoms gain more electron shells, making the atom larger.",
      "Across a period, the nucleus pulls electrons more strongly, generally making atoms smaller.",
    ],
    acrossLabel: "increases toward the left",
    downLabel: "increases toward the bottom",
    acrossArrow: "←",
    downArrow: "↓",
    color: "#3D5AFE",
    comparativeWord: "larger",
    mistakeExplanation: "Try again. Atomic radius generally decreases from left to right, and increases down a group.",
  },
  "ionization-energy": {
    id: "ionization-energy",
    label: "Ionization Energy",
    shortLabel: "Ionization",
    question: "Ionization energy is the energy needed to remove an electron from an atom.",
    why: [
      "Across a period, the nucleus generally holds electrons more strongly.",
      "Down a group, outer electrons are farther from the nucleus and are easier to remove.",
    ],
    acrossLabel: "increases toward the right",
    downLabel: "increases toward the top",
    acrossArrow: "→",
    downArrow: "↑",
    color: "#E0663D",
    comparativeWord: "higher",
    mistakeExplanation: "Try again. Ionization energy generally increases left to right, and increases up a group.",
  },
  electronegativity: {
    id: "electronegativity",
    label: "Electronegativity",
    shortLabel: "Electroneg.",
    question: "Electronegativity describes how strongly an atom attracts electrons in a chemical bond.",
    why: ["Atoms near the top-right generally attract bonding electrons more strongly."],
    acrossLabel: "increases toward the right",
    downLabel: "increases toward the top",
    acrossArrow: "→",
    downArrow: "↑",
    color: "#7C4FE0",
    comparativeWord: "more electronegative",
    mistakeExplanation: "Try again. Electronegativity generally increases left to right, and increases up a group.",
    excludesNobleGases: true,
  },
  "metallic-character": {
    id: "metallic-character",
    label: "Metallic Character",
    shortLabel: "Metallic",
    question: "Metallic character describes how strongly an element shows metal-like properties.",
    why: ["Elements toward the lower-left generally behave more like metals."],
    acrossLabel: "increases toward the left",
    downLabel: "increases toward the bottom",
    acrossArrow: "←",
    downArrow: "↓",
    color: "#2E9E5B",
    comparativeWord: "more metallic",
    mistakeExplanation: "Try again. Metallic character generally increases toward the lower-left of the table.",
  },
};

// --- Score computation -----------------------------------------------

const groupIndex = (group: number) => GROUPS_8.indexOf(group); // 0 (group 1) .. 7 (group 18)
const periodIndex = (period: number) => period - 1; // 0 .. 6

function rawScore(trend: TrendId, el: ElementDef): number | null {
  const g = groupIndex(el.group); // 0..7, left..right
  const p = periodIndex(el.period); // 0..6, top..bottom

  switch (trend) {
    case "atomic-radius":
      // Increases down a group (dominant) and toward the left.
      return p * 3 + (7 - g) * 1;
    case "ionization-energy":
      // Increases across a period (dominant) and up a group.
      return (6 - p) * 2 + g * 3;
    case "electronegativity":
      if (g === 7) return null; // noble gases: not typically assigned
      return (6 - p) * 2 + g * 3;
    case "metallic-character":
      // Increases down a period and toward the left (dominant).
      return p * 2 + (7 - g) * 3;
  }
}

function buildNormalizedScores(trend: TrendId): Map<string, number | null> {
  const raws = ELEMENTS.map((el) => [el.symbol, rawScore(trend, el)] as const);
  const values = raws.map(([, v]) => v).filter((v): v is number => v !== null);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const map = new Map<string, number | null>();
  for (const [symbol, v] of raws) {
    map.set(symbol, v === null ? null : (v - min) / span);
  }
  return map;
}

const SCORES: Record<TrendId, Map<string, number | null>> = {
  "atomic-radius": buildNormalizedScores("atomic-radius"),
  "ionization-energy": buildNormalizedScores("ionization-energy"),
  electronegativity: buildNormalizedScores("electronegativity"),
  "metallic-character": buildNormalizedScores("metallic-character"),
};

/** Normalized 0–1 trend score for an element, or null if the trend doesn't apply (e.g. electronegativity for noble gases). */
export function getScore(trend: TrendId, symbol: string): number | null {
  return SCORES[trend].get(symbol) ?? null;
}

export type ScoreBucket = "low" | "medium" | "high";

export function getScoreBucket(score: number | null): ScoreBucket | null {
  if (score === null) return null;
  if (score < 0.34) return "low";
  if (score < 0.67) return "medium";
  return "high";
}

const WHY_TEMPLATES: Record<TrendId, Record<ScoreBucket, (name: string) => string>> = {
  "atomic-radius": {
    high: (n) => `${n} has a relatively large atomic radius.`,
    medium: (n) => `${n}'s atomic radius is about average among these elements.`,
    low: (n) => `${n} has a relatively small atomic radius.`,
  },
  "ionization-energy": {
    high: (n) => `${n} holds onto its electrons tightly — removing one takes a lot of energy.`,
    medium: (n) => `${n} has a moderate ionization energy.`,
    low: (n) => `${n} loses an outer electron relatively easily.`,
  },
  electronegativity: {
    high: (n) => `${n} attracts bonding electrons strongly.`,
    medium: (n) => `${n} attracts bonding electrons moderately.`,
    low: (n) => `${n} attracts bonding electrons only weakly.`,
  },
  "metallic-character": {
    high: (n) => `${n} behaves strongly like a metal.`,
    medium: (n) => `${n} has intermediate, metalloid-like character.`,
    low: (n) => `${n} behaves strongly like a nonmetal.`,
  },
};

/** Short, student-friendly "why" line for one element under the selected trend. */
export function getElementWhy(trend: TrendId, el: ElementDef): string {
  const score = getScore(trend, el.symbol);
  const bucket = getScoreBucket(score);
  if (!bucket) {
    return `${el.name} rarely forms bonds, so electronegativity isn't usually assigned to it.`;
  }
  return WHY_TEMPLATES[trend][bucket](el.name);
}

export const BUCKET_LABEL: Record<ScoreBucket, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

/** Mixes a trend's base color from a light tint (low) to full strength (high). Predicted/unknown elements are rendered desaturated regardless of score. */
export function scoreToBackground(color: string, score: number | null, isPredicted?: boolean): string {
  if (score === null) return "rgba(148, 155, 150, 0.12)";
  const alpha = 0.12 + score * 0.62;
  const hex = color.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  if (isPredicted) {
    return `rgba(${r}, ${g}, ${b}, ${(alpha * 0.55).toFixed(3)})`;
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
}

// --- Challenge ---------------------------------------------------------

export interface ChallengePair {
  a: ElementDef;
  b: ElementDef;
  correct: "a" | "b";
}

/** Picks two elements (excluding predicted, and noble gases for electronegativity) whose scores differ enough to make a clear, non-ambiguous question. */
export function pickChallengePair(trend: TrendId): ChallengePair {
  const pool = ELEMENTS.filter((el) => {
    if (el.isPredicted) return false;
    if (TRENDS[trend].excludesNobleGases && groupIndex(el.group) === 7) return false;
    return true;
  });

  for (let attempt = 0; attempt < 40; attempt++) {
    const a = pool[Math.floor(Math.random() * pool.length)]!;
    let b = pool[Math.floor(Math.random() * pool.length)]!;
    let tries = 0;
    while (b.symbol === a.symbol && tries < 10) {
      b = pool[Math.floor(Math.random() * pool.length)]!;
      tries++;
    }
    const scoreA = getScore(trend, a.symbol) ?? 0;
    const scoreB = getScore(trend, b.symbol) ?? 0;
    if (Math.abs(scoreA - scoreB) >= 0.22 && a.symbol !== b.symbol) {
      return { a, b, correct: scoreA > scoreB ? "a" : "b" };
    }
  }
  // Fallback: classic textbook example.
  const a = getElement("Na")!;
  const b = getElement("Cl")!;
  return { a, b, correct: (getScore(trend, "Na") ?? 0) > (getScore(trend, "Cl") ?? 0) ? "a" : "b" };
}
