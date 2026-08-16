"use client";

import { InfoPanel, type InfoStat } from "@/features/simulation";
import type { Law3Readouts } from "../law3-engine";
import type { CartReadouts } from "../physics";

export function CartDataPanel({ readouts }: { readouts: CartReadouts }) {
  const stats: InfoStat[] = [
    { label: "Mass", value: readouts.mass.toFixed(1), unit: "kg" },
    { label: "Velocity", value: readouts.velocity.toFixed(2), unit: "m/s" },
    {
      label: "Acceleration",
      value: readouts.acceleration.toFixed(2),
      unit: "m/s²",
    },
    { label: "Momentum", value: readouts.momentum.toFixed(1), unit: "kg·m/s" },
    { label: "Net force", value: readouts.netForce.toFixed(1), unit: "N" },
    { label: "Weight", value: readouts.weight.toFixed(1), unit: "N" },
    {
      label: "Normal force",
      value: readouts.normalForce.toFixed(1),
      unit: "N",
    },
    {
      label: "Applied force",
      value: readouts.appliedForce.toFixed(1),
      unit: "N",
    },
    {
      label: "Friction force",
      value: readouts.frictionForce.toFixed(1),
      unit: "N",
    },
    {
      label: "Elapsed time",
      value: readouts.elapsedTime.toFixed(2),
      unit: "s",
    },
    { label: "Distance", value: readouts.distance.toFixed(2), unit: "m" },
  ];

  return <InfoPanel title="Live data" stats={stats} />;
}

export function Law3DataPanel({ readouts }: { readouts: Law3Readouts }) {
  const labelA =
    readouts.kind === "collision"
      ? "Ball A"
      : readouts.kind === "skaters"
        ? "Skater A"
        : "Object";
  const labelB =
    readouts.kind === "collision"
      ? "Ball B"
      : readouts.kind === "skaters"
        ? "Skater B"
        : "Reaction";

  const stats: InfoStat[] = [
    {
      label: `${labelA} velocity`,
      value: readouts.velocityA.toFixed(2),
      unit: "m/s",
    },
    {
      label: `${labelA} momentum`,
      value: readouts.momentumA.toFixed(1),
      unit: "kg·m/s",
    },
  ];

  if (readouts.kind === "skaters" || readouts.kind === "collision") {
    stats.push(
      {
        label: `${labelB} velocity`,
        value: readouts.velocityB.toFixed(2),
        unit: "m/s",
      },
      {
        label: `${labelB} momentum`,
        value: readouts.momentumB.toFixed(1),
        unit: "kg·m/s",
      },
    );
  } else {
    stats.push(
      { label: "Action force", value: readouts.forceOnA.toFixed(1), unit: "N" },
      {
        label: "Reaction force",
        value: readouts.forceOnB.toFixed(1),
        unit: "N",
      },
    );
  }

  stats.push({
    label: "Total momentum",
    value: readouts.totalMomentum.toFixed(1),
    unit: "kg·m/s",
  });

  return <InfoPanel title="Live data" stats={stats} />;
}
