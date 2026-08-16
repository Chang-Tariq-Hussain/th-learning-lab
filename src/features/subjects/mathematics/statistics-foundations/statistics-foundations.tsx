"use client";

import { useState } from "react";
import { LevelNav } from "../calculus-foundations/components/level-nav";
import { StateChain } from "../applications-of-derivatives/components/state-chain";
import { DatasetTable } from "./components/dataset-table";
import { VariableCards } from "./components/variable-cards";
import { SortActivity } from "./components/sort-activity";
import { PopulationSamplePanel } from "./components/population-sample-panel";
import { SampleSizePanel } from "./components/sample-size-panel";
import { SamplingMethodsPanel } from "./components/sampling-methods-panel";
import { RepresentativePanel } from "./components/representative-panel";
import { BiasPanel } from "./components/bias-panel";
import { PracticePanel } from "./components/practice-panel";
import { CATEGORICAL_NUMERICAL_ITEMS, DISCRETE_CONTINUOUS_ITEMS } from "./statistics-model";

interface Level {
  label: string;
  title: string;
  subtitle: string;
}

const LEVELS: Level[] = [
  { label: "Level 1", title: "What is Data?", subtitle: "A dataset is a collection of information gathered about individuals or objects." },
  { label: "Level 2", title: "Variables", subtitle: "A variable is something that can change from one individual to another." },
  { label: "Level 3", title: "Categorical vs Numerical", subtitle: "Categorical describes groups. Numerical represents measurable amounts." },
  { label: "Level 4", title: "Discrete vs Continuous", subtitle: "Discrete values are countable. Continuous values fall within a range." },
  { label: "Level 5", title: "Population vs Sample", subtitle: "A sample is a smaller group selected from the population." },
  { label: "Level 6", title: "Sample Size", subtitle: "Larger samples generally give more information — but size alone isn't everything." },
  { label: "Level 7", title: "Sampling Methods", subtitle: "Random, systematic, stratified, and convenience sampling, side by side." },
  { label: "Level 8", title: "Representative Samples", subtitle: "A good sample should reasonably reflect the population." },
  { label: "Level 9", title: "Sampling Bias", subtitle: "Who you choose can affect your conclusions." },
  { label: "Level 10", title: "Practice", subtitle: "Two quick games to check what stuck." },
];

const CONCEPT_CHAIN = [
  { label: "Data", tone: "neutral" as const },
  { label: "Variable", tone: "neutral" as const },
  { label: "Type of Data", tone: "neutral" as const },
  { label: "Population", tone: "neutral" as const },
  { label: "Sample", tone: "neutral" as const },
  { label: "Sampling", tone: "neutral" as const },
];

/**
 * Statistics Foundations — Data, Variables & Sampling.
 *
 * The first Statistics simulation: ten self-paced levels covering the
 * DATA -> VARIABLE -> TYPE OF DATA -> POPULATION -> SAMPLE -> SAMPLING
 * progression. Reuses Calculus Foundations' `LevelNav` and Applications
 * of Derivatives' `StateChain` directly rather than re-implementing
 * either, matching how those two topics already share components with
 * each other. No mean/median/std-dev/probability content — that's left
 * for later Statistics simulations.
 */
export function StatisticsFoundations() {
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
        {step === 0 ? (
          <div className="flex flex-col gap-8" key={resetKey}>
            <StateChain links={CONCEPT_CHAIN} />
            <DatasetTable />
          </div>
        ) : null}

        {step === 1 ? <VariableCards key={resetKey} /> : null}

        {step === 2 ? (
          <SortActivity
            key={resetKey}
            title="Categorical vs Numerical"
            items={CATEGORICAL_NUMERICAL_ITEMS}
            bins={[
              { id: "categorical", label: "Categorical", description: "Describes groups or categories." },
              { id: "numerical", label: "Numerical", description: "Numbers used as measurements or counts." },
            ]}
          />
        ) : null}

        {step === 3 ? (
          <SortActivity
            key={resetKey}
            title="Discrete vs Continuous"
            items={DISCRETE_CONTINUOUS_ITEMS}
            bins={[
              { id: "discrete", label: "Discrete", description: "Countable values." },
              { id: "continuous", label: "Continuous", description: "Values within a range." },
            ]}
          />
        ) : null}

        {step === 4 ? <PopulationSamplePanel key={resetKey} /> : null}

        {step === 5 ? <SampleSizePanel key={resetKey} /> : null}

        {step === 6 ? <SamplingMethodsPanel key={resetKey} /> : null}

        {step === 7 ? <RepresentativePanel key={resetKey} /> : null}

        {step === 8 ? <BiasPanel key={resetKey} /> : null}

        {step === 9 ? <PracticePanel key={resetKey} /> : null}
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
