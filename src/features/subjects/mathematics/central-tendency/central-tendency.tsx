"use client";

import { useState } from "react";
import { LevelNav } from "../calculus-foundations/components/level-nav";
import { QuizPanel } from "../statistics-foundations/components/quiz-panel";
import { DatasetEditor } from "./components/dataset-editor";
import { MeanPanel } from "./components/mean-panel";
import { MedianPanel } from "./components/median-panel";
import { ModePanel } from "./components/mode-panel";
import { RangePanel } from "./components/range-panel";
import { OutlierComparisonPanel } from "./components/outlier-comparison-panel";
import { MeasureGuidePanel } from "./components/measure-guide-panel";
import {
  CHALLENGE_QUESTIONS,
  COMPARISON_WITHOUT_OUTLIER,
  COMPARISON_WITH_OUTLIER,
  OUTLIER_BASE_DATASET,
  OUTLIER_VALUE,
} from "./central-tendency-model";

interface Level {
  label: string;
  title: string;
  subtitle: string;
}

const LEVELS: Level[] = [
  { label: "Level 1", title: "Understanding the Center", subtitle: "Every dataset has a center — edit the values and watch it shift." },
  { label: "Level 2", title: "Mean", subtitle: "The value where the data would balance." },
  { label: "Level 3", title: "Median", subtitle: "The middle value once the data is arranged in order." },
  { label: "Level 4", title: "Mode", subtitle: "The value that appears most often." },
  { label: "Level 5", title: "Range", subtitle: "The difference between the largest and smallest values." },
  { label: "Level 6", title: "Outliers", subtitle: "One extreme value can move some measures more than others." },
  { label: "Level 7", title: "Mean vs Median", subtitle: "Which one better represents the center depends on the data." },
  { label: "Level 8", title: "Choose the Right Measure", subtitle: "A quick reference for when each measure is most useful." },
  { label: "Level 9", title: "Practice", subtitle: "Five quick questions to check what stuck." },
];

/**
 * Measures of Central Tendency — Mean, Median, Mode & Range.
 *
 * Nine self-paced levels covering DATASET -> MEAN / MEDIAN / MODE ->
 * RANGE -> OUTLIER EFFECT -> CHOOSING A MEASURE -> PRACTICE. Reuses
 * Calculus Foundations' `LevelNav` and Statistics Foundations' shared
 * `QuizPanel` directly, matching how Statistics Foundations already
 * shares components across topics rather than re-implementing them.
 * Variance, standard deviation, quartiles, and probability are
 * deliberately out of scope for this simulation.
 */
export function CentralTendency() {
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
        {step === 0 ? <DatasetEditor key={resetKey} /> : null}
        {step === 1 ? <MeanPanel key={resetKey} /> : null}
        {step === 2 ? <MedianPanel key={resetKey} /> : null}
        {step === 3 ? <ModePanel key={resetKey} /> : null}
        {step === 4 ? <RangePanel key={resetKey} /> : null}

        {step === 5 ? (
          <OutlierComparisonPanel
            key={resetKey}
            intro={`Start with ${OUTLIER_BASE_DATASET.join(", ")}, then add one extreme value: ${OUTLIER_VALUE}.`}
            explanation="The mean can be strongly affected by extreme values — the median moves far less."
            without={OUTLIER_BASE_DATASET}
            withOutlier={[...OUTLIER_BASE_DATASET, OUTLIER_VALUE]}
          />
        ) : null}

        {step === 6 ? (
          <OutlierComparisonPanel
            key={resetKey}
            intro="Compare the mean and median side by side, with and without the outlier."
            explanation="When an outlier is present, the median often gives a more representative sense of where most of the data sits."
            without={COMPARISON_WITHOUT_OUTLIER}
            withOutlier={COMPARISON_WITH_OUTLIER}
          />
        ) : null}

        {step === 7 ? <MeasureGuidePanel key={resetKey} /> : null}

        {step === 8 ? <QuizPanel key={resetKey} questions={CHALLENGE_QUESTIONS} restartLabel="Restart Practice" /> : null}
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
