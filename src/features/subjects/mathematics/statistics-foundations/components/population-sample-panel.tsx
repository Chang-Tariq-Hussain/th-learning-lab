"use client";

import { useMemo } from "react";
import { DotGrid } from "./dot-grid";
import { PEOPLE_PER_DOT, POPULATION_DOT_COUNT, POPULATION_TOTAL, pickRandomIndices } from "../statistics-model";

const SAMPLE_PEOPLE = 50;
const SAMPLE_DOTS = Math.round(SAMPLE_PEOPLE / PEOPLE_PER_DOT);

/**
 * Level 5 — Population vs Sample. Renders the 1000-student population
 * as 100 dots (each dot standing in for 10 people, so the grid stays
 * light) with a 50-person sample highlighted within it.
 */
export function PopulationSamplePanel() {
  const sampleIndices = useMemo(() => pickRandomIndices(POPULATION_DOT_COUNT, SAMPLE_DOTS), []);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft dark:text-bone-soft">
          Population = {POPULATION_TOTAL.toLocaleString()} students
        </p>
        <p className="max-w-md text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
          The <strong className="text-ink dark:text-bone">population</strong> is the entire group we want to study.
          Each dot below stands in for {PEOPLE_PER_DOT} students.
        </p>
      </div>

      <DotGrid
        total={POPULATION_DOT_COUNT}
        highlighted={sampleIndices}
        ariaLabel="1000 students, with a 50-student sample highlighted"
        className="max-w-md justify-center"
      />

      <div className="rounded-card border border-subject-math/40 bg-subject-math-soft px-4 py-3 text-center dark:border-subject-math/30 dark:bg-subject-math/10">
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-subject-math">
          Sample = {SAMPLE_PEOPLE} students
        </p>
        <p className="mt-1 max-w-sm text-sm text-ink-soft dark:text-bone-soft">
          A <strong className="text-ink dark:text-bone">sample</strong> is a smaller group selected from the
          population — the highlighted dots above.
        </p>
      </div>
    </div>
  );
}
