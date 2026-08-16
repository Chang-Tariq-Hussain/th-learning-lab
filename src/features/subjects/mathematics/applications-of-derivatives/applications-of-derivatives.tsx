"use client";

import { useState } from "react";
import { LevelNav } from "../calculus-foundations/components/level-nav";
import { IncreasingDecreasingPanel } from "./components/increasing-decreasing-panel";
import { DerivativeSignPanel } from "./components/derivative-sign-panel";
import { CriticalPointsPanel } from "./components/critical-points-panel";
import { TurningPointPanel } from "./components/turning-point-panel";
import { MaxVsMinPanel } from "./components/max-vs-min-panel";
import { CriticalPointFinderPanel } from "./components/critical-point-finder-panel";
import { SignChartPanel } from "./components/sign-chart-panel";
import { PracticePanel } from "./components/practice-panel";

interface Level {
  label: string;
  title: string;
  subtitle: string;
}

const LEVELS: Level[] = [
  {
    label: "Level 1",
    title: "Increasing & Decreasing",
    subtitle: "f'(x) > 0 means increasing. f'(x) < 0 means decreasing.",
  },
  {
    label: "Level 2",
    title: "Derivative Sign",
    subtitle: "Watch the two graphs move together as x changes.",
  },
  {
    label: "Level 3",
    title: "Critical Points",
    subtitle: "A critical point occurs where the derivative is zero.",
  },
  {
    label: "Level 4",
    title: "Local Minimum",
    subtitle: "Decreasing, then a critical point, then increasing.",
  },
  {
    label: "Level 5",
    title: "Local Maximum",
    subtitle: "Increasing, then a critical point, then decreasing.",
  },
  {
    label: "Level 6",
    title: "Maximum vs Minimum",
    subtitle: "Compare the two turning-point patterns side by side.",
  },
  {
    label: "Level 7",
    title: "Critical Point Finder",
    subtitle: "A slightly more advanced example: f(x) = x³ - 3x.",
  },
  {
    label: "Level 8",
    title: "Sign Chart",
    subtitle: "Connect the sign of f'(x) directly to the graph's shape.",
  },
  { label: "Practice", title: "Practice", subtitle: "Check your understanding." },
];

/**
 * Applications of Derivatives — Increasing, Decreasing, Maxima &
 * Minima. Nine self-paced levels reusing Calculus Foundations'
 * `LevelNav`/`FunctionGraph` and Derivative Explorer's sign vocabulary,
 * building on Derivative Rules and Chain Rule Explorer's step-control
 * and level-progression patterns to show WHY derivatives are useful —
 * not just how to compute them.
 */
export function ApplicationsOfDerivatives() {
  const [step, setStep] = useState(0);
  const level = LEVELS[step]!;

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">{level.label}</p>
        <h2 className="mt-1 font-display text-2xl font-medium text-ink dark:text-bone">{level.title}</h2>
        <p className="mx-auto mt-1 max-w-xl text-sm text-ink-soft dark:text-bone-soft">{level.subtitle}</p>
      </div>

      <div className="min-h-[420px]">
        {step === 0 ? <IncreasingDecreasingPanel key={`l1-${step}`} /> : null}
        {step === 1 ? <DerivativeSignPanel key={`l2-${step}`} /> : null}
        {step === 2 ? <CriticalPointsPanel key={`l3-${step}`} /> : null}
        {step === 3 ? <TurningPointPanel fnId="x2" key={`l4-${step}`} /> : null}
        {step === 4 ? <TurningPointPanel fnId="negx2" key={`l5-${step}`} /> : null}
        {step === 5 ? <MaxVsMinPanel key={`l6-${step}`} /> : null}
        {step === 6 ? <CriticalPointFinderPanel key={`l7-${step}`} /> : null}
        {step === 7 ? <SignChartPanel key={`l8-${step}`} /> : null}
        {step === 8 ? <PracticePanel key={`l9-${step}`} /> : null}
      </div>

      <LevelNav
        stepIndex={step}
        totalSteps={LEVELS.length}
        onBack={() => setStep((s) => Math.max(0, s - 1))}
        onNext={() => setStep((s) => Math.min(LEVELS.length - 1, s + 1))}
        onReset={() => setStep(0)}
        onJump={setStep}
      />
    </div>
  );
}
