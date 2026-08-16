"use client";

import { memo } from "react";
import {
  CartesianGrid,
  Scatter,
  ScatterChart as RechartsScatterChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartSeries } from "../../types";

export interface ScatterPlotProps {
  series: ChartSeries[];
  xLabel?: string;
  yLabel?: string;
  height?: number;
}

/**
 * Reusable scatter plot for data that isn't naturally aligned along a
 * shared x-axis (e.g. sampled particle positions, trial outcomes).
 * Unlike `LineChart`/`BarChart`, each series' points are plotted
 * independently rather than merged into shared rows.
 */
function ScatterPlotImpl({ series, xLabel, yLabel, height = 260 }: ScatterPlotProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsScatterChart margin={{ top: 8, right: 12, bottom: 8, left: 4 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-line dark:stroke-line-dark" />
        <XAxis
          type="number"
          dataKey="x"
          tick={{ fontSize: 11 }}
          label={xLabel ? { value: xLabel, position: "insideBottom", offset: -4, fontSize: 11 } : undefined}
        />
        <YAxis
          type="number"
          dataKey="y"
          tick={{ fontSize: 11 }}
          label={yLabel ? { value: yLabel, angle: -90, position: "insideLeft", fontSize: 11 } : undefined}
        />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} cursor={{ strokeDasharray: "3 3" }} />
        {series.map((s) => (
          <Scatter key={s.id} name={s.label} data={s.data} fill={s.color} />
        ))}
      </RechartsScatterChart>
    </ResponsiveContainer>
  );
}

export const ScatterPlot = memo(ScatterPlotImpl);
