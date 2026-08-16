"use client";

import { useState } from "react";
import { LevelNav } from "../calculus-foundations/components/level-nav";
import { QuizPanel } from "../statistics-foundations/components/quiz-panel";
import { CenterSpreadPanel } from "./components/center-spread-panel";
import { DeviationPanel } from "./components/deviation-panel";
import { SquaringPanel } from "./components/squaring-panel";
import { VariancePanel } from "./components/variance-panel";
import { StandardDeviationPanel } from "./components/standard-deviation-panel";
import { SquareRootExplainerPanel } from "./components/square-root-explainer-panel";
import { SpreadComparisonPanel } from "./components/spread-comparison-panel";
import { DispersionOutlierPanel } from "./components/dispersion-outlier-panel";
import { PopulationSamplePanel } from "./components/population-sample-panel";
import { DISPERSION_CHALLENGE_QUESTIONS } from "./dispersion-model";

interface Level {
  label: string;
  title: string;
  subtitle: string;
}

const LEVELS: Level[] = [
  { label: "Level 1", title: "Center vs Spread", subtitle: "Two datasets can share a mean but differ enormously in spread." },
  { label: "Level 2", title: "Deviation from the Mean", subtitle: "How far each value sits from the center." },
  { label: "Level 3", title: "Why Square Deviations?", subtitle: "Raw deviations always cancel out — squaring fixes that." },
  { label: "Level 4", title: "Variance", subtitle: "The average of the squared deviations from the mean." },
  { label: "Level 5", title: "Standard Deviation", subtitle: "The square root of variance — spread in the original units." },
  { label: "Level 6", title: "Why Square Root?", subtitle: "Returning squared units back to something interpretable." },
  { label: "Level 7", title: "Low vs High Spread", subtitle: "Same mean, very different standard deviations." },
  { label: "Level 8", title: "Outliers", subtitle: "One extreme value can greatly increase standard deviation." },
  { label: "Level 9", title: "Population vs Sample", subtitle: "A quick look at dividing by N versus n − 1." },
  { label: "Level 10", title: "Practice", subtitle: "Five quick questions to check what stuck." },
];

/**
 * Measures of Dispersion — Variance & Standard Deviation.
 *
 * Ten self-paced levels building the CENTER + SPREAD idea: two
 * same-mean datasets, deviations, why squaring is needed, variance,
 * standard deviation, why the square root matters, low vs high
 * spread, outliers, population vs sample, and practice. Builds on
 * Central Tendency's `mean`/`formatNumber` and `ValueNumberLine`
 * directly, and reuses Calculus Foundations' `LevelNav`, Applications
 * of Derivatives' `StateChain`, and Statistics Foundations' `QuizPanel`
 * — matching how those simulations already share components with each
 * other. Quartiles, IQR, box plots, and probability are deliberately
 * out of scope for this simulation.
 */
export function MeasuresOfDispersion() {
  const [step, setStep] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  const level = LEVELS[step]!;

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">{level.label}</p>
        <h2 className="mt-1 font-display text-2xl font-medium text-ink dark:text-bone">{level.title}</h2>
        <p className="mx-auto mt-1 max-w-xl text-sm text-ink-soft dark:text-bone-soft">{level.subtitle}</p>
      </div>

      <div className="min-h-[420px]">
        {step === 0 ? <CenterSpreadPanel key={resetKey} /> : null}
        {step === 1 ? <DeviationPanel key={resetKey} /> : null}
        {step === 2 ? <SquaringPanel key={resetKey} /> : null}
        {step === 3 ? <VariancePanel key={resetKey} /> : null}
        {step === 4 ? <StandardDeviationPanel key={resetKey} /> : null}
        {step === 5 ? <SquareRootExplainerPanel key={resetKey} /> : null}
        {step === 6 ? <SpreadComparisonPanel key={resetKey} /> : null}
        {step === 7 ? <DispersionOutlierPanel key={resetKey} /> : null}
        {step === 8 ? <PopulationSamplePanel key={resetKey} /> : null}
        {step === 9 ? <QuizPanel key={resetKey} questions={DISPERSION_CHALLENGE_QUESTIONS} restartLabel="Restart Practice" /> : null}
      </div>

      <LevelNav
        stepIndex={step}
        totalSteps={LEVELS.length}
        onBack={() => setStep((s) => Math.max(0, s - 1))}
        onNext={() => setStep((s) => Math.min(LEVELS.length - 1, s + 1))}
        onReset={() => setResetKey((k) => k + 1)}
        onJump={setStep}
      />
    </div>
  );
}
