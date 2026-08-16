"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { COLOR_PRODUCT } from "../model";

interface ProgressGraphProps {
  data: { t: number; product: number }[];
  maxProduct: number;
  height?: number;
  compareData?: { t: number; product: number }[];
  compareLabel?: string;
  primaryLabel?: string;
}

/** Small "Amount of Product vs Time" line, shared by every level that runs a chamber. */
export function ProgressGraph({
  data,
  maxProduct,
  height = 140,
  compareData,
  compareLabel = "Experiment B",
  primaryLabel = "Experiment A",
}: ProgressGraphProps) {
  const merged = data.map((point, i) => ({
    t: point.t,
    a: point.product,
    b: compareData?.[i]?.product ?? compareData?.[compareData.length - 1]?.product,
  }));

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <LineChart data={merged} margin={{ top: 6, right: 10, bottom: 0, left: -18 }}>
          <XAxis
            dataKey="t"
            tick={{ fontSize: 10, fill: "currentColor" }}
            className="text-ink-soft dark:text-bone-soft"
            tickFormatter={(v: number) => `${v}s`}
            minTickGap={24}
          />
          <YAxis
            domain={[0, Math.max(maxProduct, 1)]}
            tick={{ fontSize: 10, fill: "currentColor" }}
            className="text-ink-soft dark:text-bone-soft"
            allowDecimals={false}
            width={26}
          />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
            labelFormatter={(v) => `t = ${v}s`}
            formatter={(value: number, key: string) => [value, key === "a" ? primaryLabel : compareLabel]}
          />
          <Line type="monotone" dataKey="a" stroke={COLOR_PRODUCT} strokeWidth={2.25} dot={false} isAnimationActive={false} name={primaryLabel} />
          {compareData ? (
            <Line type="monotone" dataKey="b" stroke="#3D6FE0" strokeWidth={2.25} dot={false} isAnimationActive={false} name={compareLabel} />
          ) : null}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
