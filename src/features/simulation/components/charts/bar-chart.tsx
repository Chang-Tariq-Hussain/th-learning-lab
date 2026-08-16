"use client";

import { memo, useMemo } from "react";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { mergeSeriesForRecharts } from "./chart-utils";
import type { ChartSeries } from "../../types";

export interface BarChartProps {
  series: ChartSeries[];
  xLabel?: string;
  yLabel?: string;
  height?: number;
}

/**
 * Reusable bar chart, e.g. for energy-level occupancy, reaction yields
 * by trial, or histogram-style distributions. Same `ChartSeries[]` input
 * shape as `LineChart` and `ScatterPlot` for consistency.
 */
function BarChartImpl({ series, xLabel, yLabel, height = 260 }: BarChartProps) {
  const data = useMemo(() => mergeSeriesForRecharts(series), [series]);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} margin={{ top: 8, right: 12, bottom: 8, left: 4 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-line dark:stroke-line-dark" />
        <XAxis
          dataKey="x"
          tick={{ fontSize: 11 }}
          label={xLabel ? { value: xLabel, position: "insideBottom", offset: -4, fontSize: 11 } : undefined}
        />
        <YAxis
          tick={{ fontSize: 11 }}
          label={yLabel ? { value: yLabel, angle: -90, position: "insideLeft", fontSize: 11 } : undefined}
        />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
        {series.map((s) => (
          <Bar key={s.id} dataKey={s.id} name={s.label} fill={s.color} radius={[3, 3, 0, 0]} />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

export const BarChart = memo(BarChartImpl);
