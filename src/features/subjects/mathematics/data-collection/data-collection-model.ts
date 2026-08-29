/**
 * Data model for the Data Collection Lab. Kept deliberately tiny and
 * pure (no React) so it's easy to unit-reason-about and to reuse from
 * both the simulation and, later, tests: a "dataset" here is just an
 * ordered list of category ids in the order they were collected —
 * everything else (frequency table, totals, bar heights) is derived
 * from that single source of truth.
 */

export interface Category {
  id: string;
  label: string;
  emoji: string;
  /** Tailwind-safe inline color for this category's bar/chip. */
  color: string;
}

export interface DatasetPreset {
  id: string;
  title: string;
  question: string;
  categories: Category[];
  /** A believable starting sample, already "collected" so the table
   *  isn't empty on first load — students immediately see raw data
   *  become a frequency table, then can keep adding to it. */
  seed: string[];
}

export const FRUIT_PRESET: DatasetPreset = {
  id: "fruit",
  title: "Favorite Fruit Survey",
  question: "Which fruit do you like best?",
  categories: [
    { id: "apple", label: "Apple", emoji: "🍎", color: "#e5484d" },
    { id: "banana", label: "Banana", emoji: "🍌", color: "#f5b700" },
    { id: "orange", label: "Orange", emoji: "🍊", color: "#f2994a" },
    { id: "grape", label: "Grape", emoji: "🍇", color: "#8b5cf6" },
  ],
  seed: ["apple", "apple", "banana", "orange", "apple", "banana"],
};

export const PET_PRESET: DatasetPreset = {
  id: "pet",
  title: "Favorite Pet Survey",
  question: "Which pet would you most like to have?",
  categories: [
    { id: "dog", label: "Dog", emoji: "🐶", color: "#f2994a" },
    { id: "cat", label: "Cat", emoji: "🐱", color: "#8b5cf6" },
    { id: "fish", label: "Fish", emoji: "🐠", color: "#2d9cdb" },
    { id: "bird", label: "Bird", emoji: "🐦", color: "#27ae60" },
  ],
  seed: ["dog", "cat", "dog", "dog", "fish"],
};

export const WEATHER_PRESET: DatasetPreset = {
  id: "weather",
  title: "This Month's Weather Log",
  question: "What was the weather like each day?",
  categories: [
    { id: "sunny", label: "Sunny", emoji: "☀️", color: "#f5b700" },
    { id: "cloudy", label: "Cloudy", emoji: "☁️", color: "#94a3b8" },
    { id: "rainy", label: "Rainy", emoji: "🌧️", color: "#2d9cdb" },
    { id: "stormy", label: "Stormy", emoji: "⛈️", color: "#7c4fe0" },
  ],
  seed: ["sunny", "sunny", "cloudy", "rainy", "sunny", "cloudy", "sunny"],
};

export const DATASET_PRESETS: DatasetPreset[] = [FRUIT_PRESET, PET_PRESET, WEATHER_PRESET];

export interface FrequencyRow {
  category: Category;
  count: number;
}

/** Turns raw collected observations (a flat list of category ids)
 *  into a frequency table row per category — the core "raw data ->
 *  table" transformation this whole simulation is built to make
 *  visible. Categories with zero observations are still included so
 *  the table's shape doesn't jump around as data changes. */
export function buildFrequencyTable(categories: Category[], observations: string[]): FrequencyRow[] {
  return categories.map((category) => ({
    category,
    count: observations.filter((id) => id === category.id).length,
  }));
}

export function mostFrequent(rows: FrequencyRow[]): FrequencyRow | null {
  if (rows.length === 0) return null;
  return rows.reduce((best, row) => (row.count > best.count ? row : best), rows[0]!);
}

export function leastFrequent(rows: FrequencyRow[]): FrequencyRow | null {
  if (rows.length === 0) return null;
  return rows.reduce((best, row) => (row.count < best.count ? row : best), rows[0]!);
}
