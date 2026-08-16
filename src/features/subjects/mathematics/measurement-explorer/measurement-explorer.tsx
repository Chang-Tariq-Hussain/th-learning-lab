"use client";

import { useState } from "react";
import { LevelNav } from "../calculus-foundations/components/level-nav";
import { QuizPanel } from "../statistics-foundations/components/quiz-panel";
import { WhatIsMeasurementPanel } from "./components/what-is-measurement-panel";
import { RulerIntroPanel } from "./components/ruler-intro-panel";
import { ReadingRulerPanel } from "./components/reading-ruler-panel";
import { NonZeroStartPanel } from "./components/non-zero-start-panel";
import { RulerDivisionsPanel } from "./components/ruler-divisions-panel";
import { UnitsOfLengthPanel } from "./components/units-of-length-panel";
import { ConversionPanel } from "./components/conversion-panel";
import { EstimationPanel } from "./components/estimation-panel";
import { MeasurementLabPanel } from "./components/measurement-lab-panel";
import { MEASUREMENT_CHALLENGE_QUESTIONS } from "./measurement-model";

interface Level {
  label: string;
  title: string;
  subtitle: string;
}

const LEVELS: Level[] = [
  { label: "Level 1", title: "What is Measurement?", subtitle: "Comparing an object with a standard unit." },
  { label: "Level 2", title: "The Ruler", subtitle: "Every measurement starts from the zero mark." },
  { label: "Level 3", title: "Reading a Scale", subtitle: "Read where an object ends to find its length." },
  { label: "Level 4", title: "Measuring from a Non-Zero Point", subtitle: "Length is End − Start, not just the ending number." },
  { label: "Level 5", title: "Ruler Divisions", subtitle: "One centimeter is ten millimeters." },
  { label: "Level 6", title: "Units of Length", subtitle: "mm, cm, m, and km — and when to use each." },
  { label: "Level 7", title: "Unit Conversion", subtitle: "The same length, in every unit at once." },
  { label: "Level 8", title: "Estimation", subtitle: "A reasonable guess before an exact measurement." },
  { label: "Level 9", title: "Measurement Lab", subtitle: "Estimate, then measure for real, and compare." },
  { label: "Level 10", title: "Practice", subtitle: "Six quick questions to check what stuck." },
];

/**
 * Measurement Explorer — Length, Distance & Rulers.
 *
 * Ten self-paced levels establishing the Measurements topic:
 * WHAT IS MEASUREMENT? -> RULER -> READING A SCALE -> NON-ZERO START
 * -> DIVISIONS -> UNITS -> CONVERSION -> ESTIMATION -> LAB -> PRACTICE.
 * The draggable ruler (`RulerTrack`) follows Number Line's
 * pointer-capture drag pattern, and the simulation reuses Calculus
 * Foundations' `LevelNav` and Statistics Foundations' `QuizPanel`
 * directly — the same cross-topic sharing established by Central
 * Tendency and Measures of Dispersion. Area, perimeter, volume, mass,
 * time, angles, and measurement uncertainty are deliberately out of
 * scope for this simulation.
 */
export function MeasurementExplorer() {
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
        {step === 0 ? <WhatIsMeasurementPanel key={resetKey} /> : null}
        {step === 1 ? <RulerIntroPanel key={resetKey} /> : null}
        {step === 2 ? <ReadingRulerPanel key={resetKey} /> : null}
        {step === 3 ? <NonZeroStartPanel key={resetKey} /> : null}
        {step === 4 ? <RulerDivisionsPanel key={resetKey} /> : null}
        {step === 5 ? <UnitsOfLengthPanel key={resetKey} /> : null}
        {step === 6 ? <ConversionPanel key={resetKey} /> : null}
        {step === 7 ? <EstimationPanel key={resetKey} /> : null}
        {step === 8 ? <MeasurementLabPanel key={resetKey} /> : null}
        {step === 9 ? <QuizPanel key={resetKey} questions={MEASUREMENT_CHALLENGE_QUESTIONS} restartLabel="Restart Practice" /> : null}
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
