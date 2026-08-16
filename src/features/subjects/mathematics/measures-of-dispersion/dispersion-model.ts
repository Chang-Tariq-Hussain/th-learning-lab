/**
 * Measures of Dispersion — data model & pure math helpers.
 *
 * Builds directly on Central Tendency's `mean`/`formatNumber` (imported
 * rather than reimplemented) and adds the deviation/variance/standard
 * deviation math this simulation needs. Everything operates on plain
 * `number[]` — no stats library.
 */

import { formatNumber, mean } from "../central-tendency/central-tendency-model";

export { formatNumber, mean };

/** Signed deviation of each value from a center (defaults to the dataset's own mean). */
export function deviations(values: number[], center: number = mean(values)): number[] {
  return values.map((v) => v - center);
}

export function squaredDeviations(values: number[], center: number = mean(values)): number[] {
  return deviations(values, center).map((d) => d * d);
}

/** Population variance: average squared deviation, divided by N. */
export function populationVariance(values: number[]): number {
  if (values.length === 0) return 0;
  const sq = squaredDeviations(values);
  return sq.reduce((s, v) => s + v, 0) / values.length;
}

/** Sample variance: sum of squared deviations divided by n - 1 (undefined for n <= 1, returns 0). */
export function sampleVariance(values: number[]): number {
  if (values.length <= 1) return 0;
  const sq = squaredDeviations(values);
  return sq.reduce((s, v) => s + v, 0) / (values.length - 1);
}

export function standardDeviation(variance: number): number {
  return Math.sqrt(variance);
}

export type VarianceMode = "population" | "sample";

export function varianceFor(values: number[], mode: VarianceMode): number {
  return mode === "population" ? populationVariance(values) : sampleVariance(values);
}

// --- Level 1 — same mean, different spread --------------------------------------

export const SAME_MEAN_A: number[] = [10, 10, 10, 10, 10];
export const SAME_MEAN_B: number[] = [2, 6, 10, 14, 18];

// --- Level 2 — deviation from the mean (also the editable/draggable dataset) ------

export const DEVIATION_STARTER_DATASET: number[] = [2, 6, 10, 14, 18];
export const DEVIATION_DATASET_MIN_SIZE = 3;
export const DEVIATION_DATASET_MAX_SIZE = 8;
export const DEVIATION_VALUE_MIN = 0;
export const DEVIATION_VALUE_MAX = 30;

// --- Level 3 — why square deviations? ---------------------------------------------

export const SQUARING_DATASET: number[] = [2, 6, 10, 14, 18];

// --- Level 4 & 5 — variance and standard deviation guided calculation -------------

export const VARIANCE_WALKTHROUGH_DATASET: number[] = [2, 6, 10, 14, 18];

// --- Level 7 — low vs high spread -------------------------------------------------

export const LOW_SPREAD_DATASET: number[] = [9, 10, 10, 10, 11];
export const HIGH_SPREAD_DATASET: number[] = [2, 6, 10, 14, 18];

// --- Level 8 — outlier effect ------------------------------------------------------

export const DISPERSION_OUTLIER_BASE: number[] = [10, 11, 12, 13, 14];
export const DISPERSION_OUTLIER_VALUE = 100;

// --- Level 9 — population vs sample -------------------------------------------------

export const POP_VS_SAMPLE_DATASET: number[] = [2, 6, 10, 14, 18];

// --- Level 10 — practice challenge --------------------------------------------------

export interface ClassifyQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const DISPERSION_CHALLENGE_QUESTIONS: ClassifyQuestion[] = [
  {
    id: "greater-spread",
    prompt: "Which dataset has greater spread — A: 9, 10, 10, 10, 11 or B: 2, 6, 10, 14, 18?",
    options: ["Dataset A", "Dataset B", "They're equal", "Can't tell from this"],
    correctIndex: 1,
    explanation: "Dataset B's values sit much farther from the mean of 10 than Dataset A's do.",
  },
  {
    id: "why-square",
    prompt: "Why are deviations squared before averaging?",
    options: [
      "To make the numbers bigger",
      "To prevent positive and negative deviations from cancelling out",
      "Squaring is required by convention only",
      "To convert the data to percentages",
    ],
    correctIndex: 1,
    explanation: "Deviations above and below the mean always sum to zero — squaring makes every term positive first.",
  },
  {
    id: "variance-based-on",
    prompt: "What is variance based on?",
    options: ["The range of the data", "The most frequent value", "The average squared deviation from the mean", "The middle value"],
    correctIndex: 2,
    explanation: "Variance is literally the mean of the squared deviations.",
  },
  {
    id: "variance-to-sd",
    prompt: "What operation converts variance into standard deviation?",
    options: ["Squaring", "Square root", "Dividing by n", "Multiplying by 2"],
    correctIndex: 1,
    explanation: "Standard deviation is the square root of variance — it returns the spread to the original units.",
  },
  {
    id: "outlier-effect",
    prompt: "What generally happens to standard deviation when an extreme outlier is added?",
    options: ["It decreases", "It stays exactly the same", "It increases", "It becomes negative"],
    correctIndex: 2,
    explanation: "One far-away value pulls the mean and adds a large squared deviation, increasing both variance and SD.",
  },
];
