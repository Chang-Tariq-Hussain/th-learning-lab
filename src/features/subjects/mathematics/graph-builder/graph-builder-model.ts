/**
 * Data model for the Graph Builder. A dataset here is a small,
 * directly-editable list of category/value pairs — unlike Data
 * Collection Lab (which builds frequency from individual tapped
 * observations), this topic starts one level up: the values are
 * already counted, and the point is choosing and reading the right
 * *representation* of them (bar, pie, or line).
 */

export interface DataPoint {
  id: string;
  label: string;
  emoji: string;
  value: number;
  color: string;
}

export type ChartType = "bar" | "pie" | "line";

export interface GraphDataset {
  id: string;
  title: string;
  unit: string;
  /** Whether this dataset's categories have a natural left-to-right
   *  order (e.g. days of the week) — line graphs only make sense for
   *  ordered/sequential data, so this gates whether "Line Graph" is
   *  offered as a view for it. */
  sequential: boolean;
  points: DataPoint[];
}

export const ICE_CREAM_SALES: GraphDataset = {
  id: "ice-cream",
  title: "Ice Cream Flavor Sales",
  unit: "cones sold",
  sequential: false,
  points: [
    { id: "vanilla", label: "Vanilla", emoji: "🍦", value: 18, color: "#f5b700" },
    { id: "chocolate", label: "Chocolate", emoji: "🍫", value: 24, color: "#8b5c2a" },
    { id: "strawberry", label: "Strawberry", emoji: "🍓", value: 14, color: "#e5484d" },
    { id: "mint", label: "Mint", emoji: "🍀", value: 9, color: "#27ae60" },
  ],
};

export const WEEKLY_RAINFALL: GraphDataset = {
  id: "rainfall",
  title: "Rainfall This Week",
  unit: "mm of rain",
  sequential: true,
  points: [
    { id: "mon", label: "Mon", emoji: "☔", value: 4, color: "#2d9cdb" },
    { id: "tue", label: "Tue", emoji: "☔", value: 8, color: "#2d9cdb" },
    { id: "wed", label: "Wed", emoji: "☔", value: 2, color: "#2d9cdb" },
    { id: "thu", label: "Thu", emoji: "☔", value: 12, color: "#2d9cdb" },
    { id: "fri", label: "Fri", emoji: "☔", value: 6, color: "#2d9cdb" },
  ],
};

export const CLASS_PET_VOTES: GraphDataset = {
  id: "pet-votes",
  title: "Class Pet Election Votes",
  unit: "votes",
  sequential: false,
  points: [
    { id: "hamster", label: "Hamster", emoji: "🐹", value: 11, color: "#f2994a" },
    { id: "fish", label: "Fish Tank", emoji: "🐠", value: 7, color: "#2d9cdb" },
    { id: "rabbit", label: "Rabbit", emoji: "🐰", value: 5, color: "#8b5cf6" },
  ],
};

export const GRAPH_DATASETS: GraphDataset[] = [ICE_CREAM_SALES, WEEKLY_RAINFALL, CLASS_PET_VOTES];

export const VALUE_MIN = 0;
export const VALUE_MAX = 40;

export function total(points: DataPoint[]): number {
  return points.reduce((sum, p) => sum + p.value, 0);
}

export function highest(points: DataPoint[]): DataPoint | null {
  if (points.length === 0) return null;
  return points.reduce((best, p) => (p.value > best.value ? p : best), points[0]!);
}

export function lowest(points: DataPoint[]): DataPoint | null {
  if (points.length === 0) return null;
  return points.reduce((best, p) => (p.value < best.value ? p : best), points[0]!);
}

/** Which chart types make sense for a given dataset — line graphs are
 *  only offered when the categories are sequential (e.g. days), since
 *  a line implies a trend across an order that a set of unordered
 *  categories (e.g. flavors) doesn't have. */
export function availableChartTypes(dataset: GraphDataset): ChartType[] {
  return dataset.sequential ? ["bar", "line"] : ["bar", "pie"];
}
