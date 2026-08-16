"use client";

import { memo, useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { mergeSeriesForRecharts } from "./chart-utils";
import type { ChartSeries } from "../../types";

export interface LineChartProps {
  series: ChartSeries[];
  xLabel?: string;
  yLabel?: string;
  height?: number;
  /** Disable the point dot when a series updates every frame, for performance. */
  animated?: boolean;
}

/**
 * Live-updating line chart — pass a fresh `series` array (e.g. an
 * expanding array of `{x: time, y: value}` points) each frame or on a
 * throttled interval and it re-renders efficiently via `React.memo`.
 * Typical uses: position vs. time, concentration vs. time, population
 * vs. generation.
 */
function LineChartImpl({ series, xLabel, yLabel, height = 260, animated = false }: LineChartProps) {
  const data = useMemo(() => mergeSeriesForRecharts(series), [series]);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 8, right: 12, bottom: 8, left: 4 }}>
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
          <Line
            key={s.id}
            type="monotone"
            dataKey={s.id}
            name={s.label}
            stroke={s.color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={animated}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

export const LineChart = memo(LineChartImpl);
