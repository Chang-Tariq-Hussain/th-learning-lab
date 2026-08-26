"use client";

import { WORLD_PRESETS, computeWeight, formatScientific } from "../physics";

export interface WeightWorldsPanelProps {
  personMass: number;
}

/**
 * "Same mass, different weight" made concrete: one mass value, shown
 * against every world's real surface gravity at once, so the contrast
 * is visible in a single glance rather than requiring the student to
 * flip a selector back and forth. Deliberately a plain table, not an
 * animated simulation — comparing six static numbers doesn't need
 * motion, the same reasoning behind Force Lab's static diagram.
 */
export function WeightWorldsPanel({ personMass }: WeightWorldsPanelProps) {
  const maxG = Math.max(...WORLD_PRESETS.map((w) => w.g));

  return (
    <div className="overflow-hidden rounded-card border border-line dark:border-line-dark">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line bg-white/50 text-left dark:border-line-dark dark:bg-white/[0.03]">
            <th className="px-3 py-2 font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">World</th>
            <th className="px-3 py-2 font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">g (m/s²)</th>
            <th className="px-3 py-2 font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Your weight</th>
            <th className="hidden px-3 py-2 sm:table-cell" />
          </tr>
        </thead>
        <tbody>
          {WORLD_PRESETS.map((world) => {
            const weight = computeWeight(personMass, world.g);
            const barPct = (world.g / maxG) * 100;
            return (
              <tr key={world.key} className="border-b border-line last:border-0 dark:border-line-dark">
                <td className="px-3 py-2 text-ink dark:text-bone">{world.label}</td>
                <td className="px-3 py-2 font-mono text-ink-soft dark:text-bone-soft">{world.g.toFixed(2)}</td>
                <td className="px-3 py-2 font-mono font-semibold text-ink dark:text-bone">{formatScientific(weight)} N</td>
                <td className="hidden w-40 px-3 py-2 sm:table-cell">
                  <div className="h-2 rounded-full bg-line/60 dark:bg-line-dark/60">
                    <div className="h-2 rounded-full bg-subject-physics" style={{ width: `${barPct}%` }} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="border-t border-line px-3 py-2 text-xs text-ink-soft dark:border-line-dark dark:text-bone-soft">
        Your mass ({personMass} kg) is the same everywhere — only your weight (the gravitational force on you) changes with each world&apos;s surface gravity.
      </p>
    </div>
  );
}
