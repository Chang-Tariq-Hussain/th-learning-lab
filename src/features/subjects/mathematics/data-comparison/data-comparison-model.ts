/**
 * Data model for the Data Comparison Lab. Reuses `mean`/`median`/
 * `range` from Central Tendency directly (matching the precedent set
 * by Measures of Dispersion, which imports `mean` the same way)
 * rather than reimplementing them. This topic's own contribution is
 * putting two datasets side by side and computing every statistic
 * for both at once, so differences are visible immediately.
 */

import { mean, median, range, formatNumber } from "../central-tendency/central-tendency-model";

export { formatNumber };

export interface ComparisonDataset {
  id: string;
  label: string;
  emoji: string;
  unit: string;
  color: string;
  values: number[];
}

export interface DatasetPairPreset {
  id: string;
  title: string;
  question: string;
  a: ComparisonDataset;
  b: ComparisonDataset;
}

export const TEST_SCORES_PRESET: DatasetPairPreset = {
  id: "test-scores",
  title: "Two Classes' Test Scores",
  question: "Which class performed more consistently?",
  a: {
    id: "class-a",
    label: "Class A",
    emoji: "🅰️",
    unit: "points",
    color: "#2d9cdb",
    values: [68, 71, 70, 72, 69],
  },
  b: {
    id: "class-b",
    label: "Class B",
    emoji: "🅱️",
    unit: "points",
    color: "#f2994a",
    values: [40, 60, 75, 90, 85],
  },
};

export const RAINFALL_PRESET: DatasetPairPreset = {
  id: "rainfall",
  title: "Rainfall in Two Cities",
  question: "Which city had more total and more variable rainfall this week?",
  a: {
    id: "city-a",
    label: "Rivertown",
    emoji: "🌧️",
    unit: "mm",
    color: "#2d9cdb",
    values: [2, 3, 40, 1, 2, 3, 1],
  },
  b: {
    id: "city-b",
    label: "Hillview",
    emoji: "🌦️",
    unit: "mm",
    color: "#27ae60",
    values: [6, 7, 8, 6, 7, 8, 6],
  },
};

export const SPORTS_PRESET: DatasetPairPreset = {
  id: "sports",
  title: "Two Players' Points Per Game",
  question: "Which player is the more reliable scorer, game to game?",
  a: {
    id: "player-a",
    label: "Player A",
    emoji: "🏀",
    unit: "points",
    color: "#8b5cf6",
    values: [18, 20, 19, 21, 18, 20],
  },
  b: {
    id: "player-b",
    label: "Player B",
    emoji: "🏀",
    unit: "points",
    color: "#e5484d",
    values: [5, 32, 8, 30, 4, 33],
  },
};

export const COMPARISON_PRESETS: DatasetPairPreset[] = [TEST_SCORES_PRESET, RAINFALL_PRESET, SPORTS_PRESET];

export interface DatasetStats {
  mean: number;
  median: number;
  range: number;
  min: number;
  max: number;
  total: number;
}

export function computeStats(values: number[]): DatasetStats {
  return {
    mean: mean(values),
    median: median(values),
    range: range(values),
    min: Math.min(...values),
    max: Math.max(...values),
    total: values.reduce((s, v) => s + v, 0),
  };
}

/** Which dataset is "more consistent" — i.e. has the smaller range,
 *  the simplest available signal of variability at this level (full
 *  standard deviation comparison belongs to Measures of Dispersion).
 *  Returns null on an exact tie. */
export function moreConsistent(statsA: DatasetStats, statsB: DatasetStats): "a" | "b" | null {
  if (statsA.range === statsB.range) return null;
  return statsA.range < statsB.range ? "a" : "b";
}
