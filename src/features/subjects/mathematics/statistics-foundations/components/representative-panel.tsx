"use client";

import { DotGrid } from "./dot-grid";
import { REPRESENTATIVE_GROUPS, SAMPLE_A_COUNTS, SAMPLE_B_COUNTS, SAMPLING_POPULATION_SIZE } from "../statistics-model";

function groupColorAt(index: number): string {
  const aEnd = Math.round(REPRESENTATIVE_GROUPS[0]!.proportion * SAMPLING_POPULATION_SIZE);
  const bEnd = aEnd + Math.round(REPRESENTATIVE_GROUPS[1]!.proportion * SAMPLING_POPULATION_SIZE);
  if (index < aEnd) return REPRESENTATIVE_GROUPS[0]!.color;
  if (index < bEnd) return REPRESENTATIVE_GROUPS[1]!.color;
  return REPRESENTATIVE_GROUPS[2]!.color;
}

function sampleColors(counts: Record<"a" | "b" | "c", number>): (string | undefined)[] {
  const colors: (string | undefined)[] = [];
  for (const group of REPRESENTATIVE_GROUPS) {
    const count = counts[group.id as "a" | "b" | "c"];
    for (let i = 0; i < count; i++) colors.push(group.color);
  }
  return colors;
}

function Legend() {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {REPRESENTATIVE_GROUPS.map((g) => (
        <span key={g.id} className="flex items-center gap-1.5 text-xs text-ink-soft dark:text-bone-soft">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: g.color }} />
          {g.label} ({Math.round(g.proportion * 100)}%)
        </span>
      ))}
    </div>
  );
}

/**
 * Level 8 — Representative Samples. A 100-person population split into
 * three groups, compared against two 10-person samples — one that
 * roughly mirrors the population's proportions and one dominated by a
 * single group.
 */
export function RepresentativePanel() {
  const sampleAColors = sampleColors(SAMPLE_A_COUNTS);
  const sampleBColors = sampleColors(SAMPLE_B_COUNTS);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft dark:text-bone-soft">
          Population — 100 people
        </p>
        <DotGrid
          total={SAMPLING_POPULATION_SIZE}
          colorOf={groupColorAt}
          ariaLabel="Population of 100, colored by group"
          className="max-w-md justify-center"
        />
        <Legend />
      </div>

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col items-center gap-2 rounded-card border border-pine-500/40 bg-pine-50 p-4 text-center dark:border-pine-300/30 dark:bg-pine-900/20">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-pine-700 dark:text-pine-300">
            More Representative
          </p>
          <DotGrid
            total={sampleAColors.length}
            colorOf={(i) => sampleAColors[i]}
            dotSize="md"
            ariaLabel="Sample A, proportions similar to the population"
          />
          <p className="text-xs text-ink-soft dark:text-bone-soft">Roughly matches the population&apos;s proportions.</p>
        </div>

        <div className="flex flex-col items-center gap-2 rounded-card border border-amber-500/40 bg-amber-50 p-4 text-center dark:border-amber-400/30 dark:bg-amber-900/15">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-amber-700 dark:text-amber-300">
            Less Representative
          </p>
          <DotGrid
            total={sampleBColors.length}
            colorOf={(i) => sampleBColors[i]}
            dotSize="md"
            ariaLabel="Sample B, dominated by a single group"
          />
          <p className="text-xs text-ink-soft dark:text-bone-soft">Heavily dominated by one group.</p>
        </div>
      </div>

      <p className="max-w-md text-center text-sm text-ink-soft dark:text-bone-soft">
        A good sample should reasonably reflect the population when the goal is to estimate population
        characteristics.
      </p>
    </div>
  );
}
