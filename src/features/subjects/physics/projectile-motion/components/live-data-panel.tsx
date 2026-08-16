"use client";

import { InfoPanel, type InfoStat } from "@/features/simulation";
import type { KinematicState, Trajectory } from "../physics";
import { computeEnergy } from "../physics";

interface LiveDataPanelProps {
  state: KinematicState;
  trajectory: Trajectory;
  mass: number;
  gravity: number;
}

/**
 * Every stat the task requires, computed from the already-sampled
 * kinematic state plus the precomputed trajectory summary — this
 * component does no physics of its own, only formatting.
 */
export function LiveDataPanel({ state, trajectory, mass, gravity }: LiveDataPanelProps) {
  const energy = computeEnergy(state, mass, gravity);
  const distanceTravelled = trajectory.points.reduce((total, point, i, points) => {
    if (i === 0) return total;
    const prev = points[i - 1]!;
    if (point.t > state.t) return total;
    return total + Math.hypot(point.x - prev.x, point.y - prev.y);
  }, 0);

  const stats: InfoStat[] = [
    { label: "Time", value: state.t.toFixed(2), unit: "s" },
    { label: "X position", value: state.x.toFixed(2), unit: "m" },
    { label: "Y position", value: state.y.toFixed(2), unit: "m" },
    { label: "Horizontal velocity", value: state.vx.toFixed(2), unit: "m/s" },
    { label: "Vertical velocity", value: state.vy.toFixed(2), unit: "m/s" },
    { label: "Total velocity", value: state.speed.toFixed(2), unit: "m/s" },
    { label: "Maximum height", value: trajectory.maxHeight.toFixed(2), unit: "m" },
    { label: "Distance travelled", value: distanceTravelled.toFixed(2), unit: "m" },
    { label: "Range", value: trajectory.range.toFixed(2), unit: "m" },
    { label: "Time of flight", value: trajectory.timeOfFlight.toFixed(2), unit: "s" },
    { label: "Potential energy", value: energy.potential.toFixed(1), unit: "J" },
    { label: "Kinetic energy", value: energy.kinetic.toFixed(1), unit: "J" },
  ];

  return (
    <>
      <InfoPanel title="Live data" stats={stats} />
      {/* Screen-reader-only live region: announces key readouts without
          spamming assistive tech on every 100ms sync — see aria-live docs. */}
      <p className="sr-only" aria-live="polite">
        {`Time ${state.t.toFixed(1)} seconds. Height ${state.y.toFixed(
          1
        )} meters. Horizontal distance ${state.x.toFixed(1)} meters. Speed ${state.speed.toFixed(
          1
        )} meters per second.`}
      </p>
    </>
  );
}
