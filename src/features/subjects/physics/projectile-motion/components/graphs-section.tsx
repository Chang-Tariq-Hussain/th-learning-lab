"use client";

import { useMemo } from "react";
import { LineChart, ControlPanel, type ChartSeries } from "@/features/simulation";
import type { KinematicState, Trajectory } from "../physics";
import { computeEnergy } from "../physics";

interface GraphsSectionProps {
  trajectory: Trajectory;
  currentTime: number;
  mass: number;
  gravity: number;
}

const PHYSICS_COLORS = {
  x: "#3D5AFE",
  y: "#0D9488",
  vx: "#3D5AFE",
  vy: "#0D9488",
  speed: "#7C4FE0",
  potential: "#2E9E5B",
  kinetic: "#3D5AFE",
  total: "#7C4FE0",
};

/** Cap the number of points fed to each chart so recharts stays smooth even for long flights. */
function downsample(points: KinematicState[], upToTime: number, maxPoints = 160): KinematicState[] {
  const visible = points.filter((p) => p.t <= upToTime);
  if (visible.length <= maxPoints) return visible;
  const stride = Math.ceil(visible.length / maxPoints);
  const sampled = visible.filter((_, i) => i % stride === 0);
  const last = visible[visible.length - 1];
  if (last && sampled[sampled.length - 1] !== last) sampled.push(last);
  return sampled;
}

/**
 * Five required graphs, all driven by the framework's `LineChart`. Data
 * is recomputed only when `currentTime` advances (synced ~10x/second from
 * the animation engine, not every animation frame), which keeps the
 * charts genuinely live without re-rendering recharts 60 times a second.
 */
export function GraphsSection({ trajectory, currentTime, mass, gravity }: GraphsSectionProps) {
  const visiblePoints = useMemo(
    () => downsample(trajectory.points, currentTime),
    [trajectory, currentTime]
  );

  const heightSeries: ChartSeries[] = useMemo(
    () => [
      {
        id: "y",
        label: "Height",
        color: PHYSICS_COLORS.y,
        data: visiblePoints.map((p) => ({ x: Number(p.t.toFixed(2)), y: p.y })),
      },
    ],
    [visiblePoints]
  );

  const velocitySeries: ChartSeries[] = useMemo(
    () => [
      {
        id: "vx",
        label: "Horizontal velocity",
        color: PHYSICS_COLORS.vx,
        data: visiblePoints.map((p) => ({ x: Number(p.t.toFixed(2)), y: p.vx })),
      },
      {
        id: "vy",
        label: "Vertical velocity",
        color: PHYSICS_COLORS.vy,
        data: visiblePoints.map((p) => ({ x: Number(p.t.toFixed(2)), y: p.vy })),
      },
      {
        id: "speed",
        label: "Total speed",
        color: PHYSICS_COLORS.speed,
        data: visiblePoints.map((p) => ({ x: Number(p.t.toFixed(2)), y: p.speed })),
      },
    ],
    [visiblePoints]
  );

  const xPositionSeries: ChartSeries[] = useMemo(
    () => [
      {
        id: "x",
        label: "Horizontal position",
        color: PHYSICS_COLORS.x,
        data: visiblePoints.map((p) => ({ x: Number(p.t.toFixed(2)), y: p.x })),
      },
    ],
    [visiblePoints]
  );

  const yPositionSeries: ChartSeries[] = useMemo(
    () => [
      {
        id: "y2",
        label: "Vertical position",
        color: PHYSICS_COLORS.y,
        data: visiblePoints.map((p) => ({ x: Number(p.t.toFixed(2)), y: p.y })),
      },
    ],
    [visiblePoints]
  );

  const energySeries: ChartSeries[] = useMemo(
    () => [
      {
        id: "potential",
        label: "Potential energy",
        color: PHYSICS_COLORS.potential,
        data: visiblePoints.map((p) => ({
          x: Number(p.t.toFixed(2)),
          y: computeEnergy(p, mass, gravity).potential,
        })),
      },
      {
        id: "kinetic",
        label: "Kinetic energy",
        color: PHYSICS_COLORS.kinetic,
        data: visiblePoints.map((p) => ({
          x: Number(p.t.toFixed(2)),
          y: computeEnergy(p, mass, gravity).kinetic,
        })),
      },
      {
        id: "total",
        label: "Total energy",
        color: PHYSICS_COLORS.total,
        data: visiblePoints.map((p) => ({
          x: Number(p.t.toFixed(2)),
          y: computeEnergy(p, mass, gravity).total,
        })),
      },
    ],
    [visiblePoints, mass, gravity]
  );

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <ControlPanel title="Height vs. time">
        <LineChart series={heightSeries} xLabel="t (s)" yLabel="y (m)" height={200} />
      </ControlPanel>
      <ControlPanel title="Velocity vs. time">
        <LineChart series={velocitySeries} xLabel="t (s)" yLabel="v (m/s)" height={200} />
      </ControlPanel>
      <ControlPanel title="Horizontal position vs. time">
        <LineChart series={xPositionSeries} xLabel="t (s)" yLabel="x (m)" height={200} />
      </ControlPanel>
      <ControlPanel title="Vertical position vs. time">
        <LineChart series={yPositionSeries} xLabel="t (s)" yLabel="y (m)" height={200} />
      </ControlPanel>
      <ControlPanel title="Energy vs. time" className="lg:col-span-2">
        <LineChart series={energySeries} xLabel="t (s)" yLabel="E (J)" height={220} />
      </ControlPanel>
    </div>
  );
}
