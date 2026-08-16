import type { ChartSeries } from "../../types";

export interface MergedChartRow {
  x: number;
  [seriesId: string]: number;
}

/**
 * Recharts expects one array of row objects (`{ x, seriesA, seriesB }`)
 * rather than one array per series. This merges the framework's
 * `ChartSeries[]` shape into that format, matching points across series
 * by their `x` value. Simulations that append one point per series per
 * frame (the common "live updating" case) naturally produce aligned `x`
 * values, so this stays a simple exact-match merge rather than an
 * interpolating one.
 */
export function mergeSeriesForRecharts(series: ChartSeries[]): MergedChartRow[] {
  const rowsByX = new Map<number, MergedChartRow>();

  for (const s of series) {
    for (const point of s.data) {
      const row = rowsByX.get(point.x) ?? { x: point.x };
      row[s.id] = point.y;
      rowsByX.set(point.x, row);
    }
  }

  return Array.from(rowsByX.values()).sort((a, b) => a.x - b.x);
}
