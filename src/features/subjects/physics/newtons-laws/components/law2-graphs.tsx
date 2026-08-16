"use client";

import {
  ControlPanel,
  Legend,
  LineChart,
  type ChartSeries,
} from "@/features/simulation";
import { useMemo } from "react";
import type { CartTrailSample } from "../cart-engine";
import type { CartReadouts } from "../physics";

export interface Law2GraphsProps {
  trail: CartTrailSample[];
  readouts: CartReadouts;
}

/** Ideal (frictionless) a = F/m sweep, holding mass fixed at its current value. */
function forceVsAcceleration(mass: number): ChartSeries[] {
  const points = Array.from({ length: 21 }, (_, i) => {
    const force = (i / 20) * 200;
    return {
      x: Number(force.toFixed(0)),
      y: mass > 0 ? Number((force / mass).toFixed(2)) : 0,
    };
  });
  return [
    {
      id: "f-a",
      label: `a = F / ${mass.toFixed(1)} kg`,
      color: "#3D5AFE",
      data: points,
    },
  ];
}

/** Ideal a = F/m sweep, holding force fixed — the hyperbolic "heavier means less acceleration" curve. */
function massVsAcceleration(force: number): ChartSeries[] {
  const points = Array.from({ length: 30 }, (_, i) => {
    const mass = i + 1;
    return { x: mass, y: Number((force / mass).toFixed(2)) };
  });
  return [
    {
      id: "m-a",
      label: `a = ${force.toFixed(0)} N / m`,
      color: "#E0524F",
      data: points,
    },
  ];
}

export function Law2Graphs({ trail, readouts }: Law2GraphsProps) {
  const forceSeries = useMemo(
    () => forceVsAcceleration(readouts.mass),
    [readouts.mass],
  );
  const massSeries = useMemo(
    () => massVsAcceleration(readouts.appliedForce || 50),
    [readouts.appliedForce],
  );

  const velocitySeries: ChartSeries[] = useMemo(
    () => [
      {
        id: "v",
        label: "Velocity",
        color: "#2E9E5B",
        data: trail.map((s) => ({ x: s.t, y: s.v })),
      },
    ],
    [trail],
  );
  const distanceSeries: ChartSeries[] = useMemo(
    () => [
      {
        id: "x",
        label: "Distance",
        color: "#7C4FE0",
        data: trail.map((s) => ({ x: s.t, y: Math.abs(s.x) })),
      },
    ],
    [trail],
  );
  const accelerationSeries: ChartSeries[] = useMemo(
    () => [
      {
        id: "a",
        label: "Acceleration",
        color: "#3D5AFE",
        data: trail.map((s) => ({ x: s.t, y: s.a })),
      },
    ],
    [trail],
  );

  return (
    <ControlPanel title="Graphs" className="lg:col-span-2">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Graph
          title="Force vs. Acceleration"
          note="Ideal, frictionless — at the current mass."
          series={forceSeries}
          xLabel="F (N)"
          yLabel="a (m/s²)"
        />
        <Graph
          title="Mass vs. Acceleration"
          note="Ideal, frictionless — at the current applied force."
          series={massSeries}
          xLabel="m (kg)"
          yLabel="a (m/s²)"
        />
        <Graph
          title="Velocity vs. Time"
          series={velocitySeries}
          xLabel="t (s)"
          yLabel="v (m/s)"
        />
        <Graph
          title="Distance vs. Time"
          series={distanceSeries}
          xLabel="t (s)"
          yLabel="x (m)"
        />
        <div className="md:col-span-2">
          <Graph
            title="Acceleration vs. Time"
            series={accelerationSeries}
            xLabel="t (s)"
            yLabel="a (m/s²)"
          />
        </div>
      </div>
    </ControlPanel>
  );
}

function Graph({
  title,
  series,
  xLabel,
  yLabel,
  note,
}: {
  title: string;
  series: ChartSeries[];
  xLabel: string;
  yLabel: string;
  note?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-sm font-medium text-ink dark:text-bone">{title}</h4>
      <LineChart
        series={series}
        xLabel={xLabel}
        yLabel={yLabel}
        height={200}
        animated
      />
      <Legend
        items={series.map((s) => ({
          label: s.label,
          color: s.color,
          shape: "line" as const,
        }))}
      />
      {note ? (
        <p className="text-xs italic text-ink-soft dark:text-bone-soft">
          {note}
        </p>
      ) : null}
    </div>
  );
}
