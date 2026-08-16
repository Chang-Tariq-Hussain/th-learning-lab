"use client";

import { energyFractions, type EnergyPlan } from "../energy-model";

export interface EnergyBarsProps {
  plan: EnergyPlan;
  progress: number;
}

/**
 * Two plain fill-bars, no numbers or units — just how much of each
 * bar is filled, which is exactly what the spec's "████████" / "██"
 * sketch calls for. Both are drawn against the same fixed scale (the
 * tallest the hill ever gets), so a taller Potential bar at release
 * always turns into a taller Kinetic bar at the bottom.
 */
export function EnergyBars({ plan, progress }: EnergyBarsProps) {
  const { potential, kinetic } = energyFractions(plan, progress);

  return (
    <div className="flex flex-col gap-4">
      <Bar
        label="Potential Energy"
        fraction={potential}
        colorClass="bg-subject-physics"
      />
      <Bar
        label="Kinetic Energy"
        fraction={kinetic}
        colorClass="bg-[#E0524F]"
      />
    </div>
  );
}

function Bar({
  label,
  fraction,
  colorClass,
}: {
  label: string;
  fraction: number;
  colorClass: string;
}) {
  const percent = Math.round(Math.min(1, Math.max(0, fraction)) * 100);

  return (
    <div className="flex flex-col gap-1.5">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">
        {label}
      </p>
      <div className="h-6 w-full overflow-hidden rounded-full bg-white/70 shadow-card dark:bg-white/[0.04]">
        <div
          className={`h-full rounded-full transition-[width] duration-150 ease-linear ${colorClass}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
