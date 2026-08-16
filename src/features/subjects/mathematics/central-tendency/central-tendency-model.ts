/**
 * Measures of Central Tendency — data model & pure math helpers.
 *
 * Everything here operates on plain `number[]` datasets — no stats
 * library, per the brief's "keep it lightweight" instruction. This
 * file only computes mean/median/mode/range and carries the small
 * hand-authored datasets and practice questions each panel renders.
 */

// --- Core calculations ---------------------------------------------------------

export function sortedValues(values: number[]): number[] {
  return [...values].sort((a, b) => a - b);
}

export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const s = sortedValues(values);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 === 0 ? (s[mid - 1]! + s[mid]!) / 2 : s[mid]!;
}

/**
 * Returns every value tied for the highest frequency. If every value
 * appears exactly once (nothing repeats), returns an empty array —
 * the conventional "no mode" case — rather than treating all values
 * as tied modes.
 */
export function modes(values: number[]): number[] {
  if (values.length === 0) return [];
  const freq = new Map<number, number>();
  for (const v of values) freq.set(v, (freq.get(v) ?? 0) + 1);
  const maxFreq = Math.max(...freq.values());
  if (maxFreq <= 1) return [];
  return [...freq.entries()]
    .filter(([, count]) => count === maxFreq)
    .map(([value]) => value)
    .sort((a, b) => a - b);
}

export function range(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.max(...values) - Math.min(...values);
}

/** Trims floating-point noise (e.g. 6.000000000001 -> 6, 6.5 stays 6.5). */
export function formatNumber(n: number): string {
  const rounded = Math.round(n * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

// --- Level 1 — interactive dataset ---------------------------------------------

export const STARTER_DATASET: number[] = [2, 4, 5, 6, 8];
export const DATASET_MIN_SIZE = 3;
export const DATASET_MAX_SIZE = 12;
export const VALUE_MIN = 0;
export const VALUE_MAX = 30;

// --- Level 2 — mean ---------------------------------------------------------

export const BALANCE_DATASET: number[] = [2, 4, 6, 8, 10];
export const MEAN_STEPS_DATASET: number[] = [4, 6, 8, 10];

// --- Level 3 — median ---------------------------------------------------------

export const MEDIAN_ODD_DATASET: number[] = [3, 5, 7, 9, 11];
export const MEDIAN_EVEN_DATASET: number[] = [3, 5, 7, 9];
export const MEDIAN_UNSORTED_DATASET: number[] = [8, 3, 10, 5, 2, 7];

// --- Level 4 — mode ---------------------------------------------------------

export interface ModeExample {
  id: string;
  label: string;
  dataset: number[];
}

export const MODE_EXAMPLES: ModeExample[] = [
  { id: "one-mode", label: "One Mode", dataset: [2, 3, 3, 4, 5, 3, 6] },
  { id: "no-mode", label: "No Mode", dataset: [1, 2, 3, 4, 5] },
  { id: "bimodal", label: "Two Modes (Bimodal)", dataset: [1, 2, 2, 3, 3, 4] },
];

// --- Level 5 — range ---------------------------------------------------------

export const RANGE_DATASET: number[] = [4, 7, 9, 12, 15];

// --- Level 6 — outliers ---------------------------------------------------------

export const OUTLIER_BASE_DATASET: number[] = [10, 11, 12, 13, 14];
export const OUTLIER_VALUE = 100;

// --- Level 7 — mean vs median ---------------------------------------------------

export const COMPARISON_WITHOUT_OUTLIER: number[] = [10, 11, 12, 13, 14];
export const COMPARISON_WITH_OUTLIER: number[] = [10, 11, 12, 13, 100];

// --- Level 8 — when should I use which? ------------------------------------

export interface MeasureGuide {
  id: string;
  name: string;
  summary: string;
  color: string;
}

export const MEASURE_GUIDES: MeasureGuide[] = [
  {
    id: "mean",
    name: "Mean",
    summary: "Good for numerical data without strong extreme values.",
    color: "#3D5AFE",
  },
  {
    id: "median",
    name: "Median",
    summary: "Useful when extreme values may distort the mean.",
    color: "#E8B923",
  },
  {
    id: "mode",
    name: "Mode",
    summary: "Useful for identifying the most frequent value or category.",
    color: "#2E9E6C",
  },
  {
    id: "range",
    name: "Range",
    summary: "Shows the difference between the smallest and largest values.",
    color: "#E0524F",
  },
];

// --- Level 9 — practice challenge ------------------------------------------

export interface ClassifyQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const CHALLENGE_QUESTIONS: ClassifyQuestion[] = [
  {
    id: "find-mean",
    prompt: "Find the mean: 2, 4, 6, 8",
    options: ["4", "5", "6", "20"],
    correctIndex: 1,
    explanation: "Sum = 2 + 4 + 6 + 8 = 20, and 20 ÷ 4 = 5.",
  },
  {
    id: "find-median",
    prompt: "Find the median: 3, 5, 7, 9, 11",
    options: ["5", "6", "7", "9"],
    correctIndex: 2,
    explanation: "Already in order — the middle value of 5 numbers is 7.",
  },
  {
    id: "find-mode",
    prompt: "Find the mode: 2, 3, 3, 4, 5",
    options: ["2", "3", "4", "5"],
    correctIndex: 1,
    explanation: "3 appears twice — more than any other value.",
  },
  {
    id: "find-range",
    prompt: "Find the range: 5, 8, 12, 15",
    options: ["7", "8", "10", "15"],
    correctIndex: 2,
    explanation: "Range = maximum − minimum = 15 − 5 = 10.",
  },
  {
    id: "outlier-effect",
    prompt: "Which measure is most affected by an extreme outlier?",
    options: ["Mean", "Median", "Mode", "They're affected equally"],
    correctIndex: 0,
    explanation: "The mean uses every value in its sum, so one extreme value can pull it a long way.",
  },
];
