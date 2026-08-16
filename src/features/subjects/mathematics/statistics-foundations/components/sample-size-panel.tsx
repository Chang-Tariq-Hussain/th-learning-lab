"use client";

import { useMemo, useState } from "react";
import { DotGrid } from "./dot-grid";
import {
  DEFAULT_SAMPLE_SIZE,
  PEOPLE_PER_DOT,
  POPULATION_DOT_COUNT,
  POPULATION_TOTAL,
  SAMPLE_SIZE_MAX,
  SAMPLE_SIZE_MIN,
  pickRandomIndices,
} from "../statistics-model";

/**
 * Level 6 — Sample Size. A slider from 10 to 100 people whose value
 * scales onto the 100-dot population grid, so students can feel more
 * of the population "light up" as the sample grows.
 */
export function SampleSizePanel() {
  const [sampleSize, setSampleSize] = useState(DEFAULT_SAMPLE_SIZE);
  const [seed, setSeed] = useState(0);

  const dotCount = Math.max(1, Math.round(sampleSize / PEOPLE_PER_DOT));
  const highlighted = useMemo(
    () => pickRandomIndices(POPULATION_DOT_COUNT, dotCount),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dotCount, seed],
  );

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6">
      <p className="max-w-md text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        Larger samples generally give us more information about the population, although sample size alone
        doesn&apos;t guarantee a good sample.
      </p>

      <DotGrid
        total={POPULATION_DOT_COUNT}
        highlighted={highlighted}
        ariaLabel={`Population of ${POPULATION_TOTAL}, with a sample of ${sampleSize} highlighted`}
        className="max-w-md justify-center"
      />

      <div className="flex w-full max-w-sm flex-col items-center gap-3">
        <div className="flex items-center gap-2 font-mono text-sm text-ink dark:text-bone">
          <span>Sample Size:</span>
          <span className="text-subject-math">{sampleSize}</span>
          <span className="text-ink-soft dark:text-bone-soft">of {POPULATION_TOTAL}</span>
        </div>
        <input
          type="range"
          min={SAMPLE_SIZE_MIN}
          max={SAMPLE_SIZE_MAX}
          step={5}
          value={sampleSize}
          onChange={(event) => {
            setSampleSize(Number(event.target.value));
            setSeed((s) => s + 1);
          }}
          aria-label="Sample size"
          className="h-3 w-full cursor-pointer touch-none appearance-none rounded-full bg-subject-math-soft accent-subject-math dark:bg-subject-math/20 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-subject-math [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:h-7 [&::-moz-range-thumb]:w-7 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-subject-math [&::-moz-range-thumb]:shadow-md"
        />
        <div className="flex w-full justify-between px-1 font-mono text-[11px] text-ink-soft dark:text-bone-soft">
          <span>{SAMPLE_SIZE_MIN}</span>
          <span>{SAMPLE_SIZE_MAX}</span>
        </div>
      </div>
    </div>
  );
}
