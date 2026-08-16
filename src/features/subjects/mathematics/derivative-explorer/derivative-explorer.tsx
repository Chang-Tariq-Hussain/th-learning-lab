"use client";

import { useState } from "react";
import { DropdownSelector } from "@/features/simulation/components/controls/dropdown-selector";
import { LevelNav } from "../calculus-foundations/components/level-nav";
import { ApproachPointPanel } from "./components/approach-point-panel";
import { DerivativeGraphPanel } from "./components/derivative-graph-panel";
import { DerivativePanel } from "./components/derivative-panel";
import { MiniChallenge } from "./components/mini-challenge";
import { RateComparisonPanel } from "./components/rate-comparison-panel";
import { SecantPanel } from "./components/secant-panel";
import { SignPanel } from "./components/sign-panel";
import { TangentPanel } from "./components/tangent-panel";
import { VelocityPanel } from "./components/velocity-panel";
import { DERIVATIVE_FUNCTIONS, getDerivativeFunction, type DerivativeFunctionDef } from "./derivative-model";

interface Level {
  label: string;
  title: string;
  subtitle: string;
}

const LEVELS: Level[] = [
  { label: "Level 1", title: "Average Rate of Change", subtitle: "Two points on a curve define an average rate of change." },
  { label: "Level 2", title: "Secant Line", subtitle: "The line through those two points is called a secant line." },
  { label: "Level 3", title: "Approaching a Point", subtitle: "Move point B closer to A and watch the secant line rotate." },
  { label: "Level 4", title: "Tangent Line", subtitle: "When the gap closes completely, the secant becomes the tangent." },
  { label: "Level 5", title: "Instantaneous Rate of Change", subtitle: "Average rate uses two points; instantaneous rate uses one." },
  { label: "Level 6", title: "Derivative", subtitle: "f'(x) is the instantaneous rate of change of f at x." },
  { label: "Level 7", title: "Positive, Zero & Negative", subtitle: "The sign of the derivative tells you which way the graph is heading." },
  { label: "Level 8", title: "Derivative Graph", subtitle: "Plotting f'(x) at every x turns the derivative into its own graph." },
  { label: "Connection", title: "Position → Velocity", subtitle: "A real-world reason derivatives matter." },
  { label: "Challenge", title: "Mini Challenge", subtitle: "Five quick questions to check your understanding." },
];

/**
 * Derivative Explorer — Tangent Line & Instantaneous Rate of Change.
 *
 * Ten self-paced levels built directly on top of Calculus
 * Foundations' machinery: the same `FunctionGraph`, the same
 * `LevelNav`, the same `formatValue`/`APPROACH_DISTANCES` helpers,
 * and the same one-idea-per-screen rhythm. A secant/tangent "line" is
 * just another `GraphSegment` with a linear `evaluate`, so no new
 * plotting code was needed. Levels 1–4 and 6–8 share `x`/`deltaX`
 * state so dragging a point in one level carries into the next;
 * Level 7 fixes to f(x) = x² per the brief's own example.
 */
export function DerivativeExplorer() {
  const [step, setStep] = useState(0);
  const [functionId, setFunctionId] = useState<DerivativeFunctionDef["id"]>("x2");
  const [x, setX] = useState<number>(getDerivativeFunction("x2").defaultX);
  const [deltaX, setDeltaX] = useState(1);
  const [resetKey, setResetKey] = useState(0);

  const fn = getDerivativeFunction(functionId);
  const level = LEVELS[step]!;
  const clampedX = Math.min(fn.domainMax, Math.max(fn.domainMin, x));

  const handleSelectFunction = (id: string) => {
    const next = getDerivativeFunction(id as DerivativeFunctionDef["id"]);
    setFunctionId(next.id);
    setX(next.defaultX);
  };

  const handleReset = () => {
    if (step >= 0 && step <= 5) {
      setX(fn.defaultX);
      setDeltaX(1);
    } else {
      setResetKey((k) => k + 1);
    }
  };

  const showFunctionSelector = step >= 0 && step <= 7;

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">{level.label}</p>
        <h2 className="mt-1 font-display text-2xl font-medium text-ink dark:text-bone">{level.title}</h2>
        <p className="mx-auto mt-1 max-w-xl text-sm text-ink-soft dark:text-bone-soft">{level.subtitle}</p>
      </div>

      {showFunctionSelector ? (
        <DropdownSelector
          label="Function"
          value={functionId}
          options={DERIVATIVE_FUNCTIONS.map((f) => ({ value: f.id, label: f.label }))}
          onChange={handleSelectFunction}
          className="mx-auto w-full max-w-xs"
        />
      ) : null}

      <div className="min-h-[420px]">
        {step === 0 ? (
          <SecantPanel fn={fn} ax={clampedX} onAxChange={setX} deltaX={deltaX} onDeltaXChange={setDeltaX} focus="rate" />
        ) : null}

        {step === 1 ? (
          <SecantPanel fn={fn} ax={clampedX} onAxChange={setX} deltaX={deltaX} onDeltaXChange={setDeltaX} focus="line" />
        ) : null}

        {step === 2 ? <ApproachPointPanel key={resetKey} fn={fn} ax={clampedX} /> : null}

        {step === 3 ? <TangentPanel fn={fn} x={clampedX} onXChange={setX} /> : null}

        {step === 4 ? <RateComparisonPanel fn={fn} x={clampedX} /> : null}

        {step === 5 ? <DerivativePanel fn={fn} x={clampedX} onXChange={setX} /> : null}

        {step === 6 ? <SignPanel key={resetKey} /> : null}

        {step === 7 ? <DerivativeGraphPanel fn={fn} x={clampedX} onXChange={setX} /> : null}

        {step === 8 ? <VelocityPanel key={resetKey} /> : null}

        {step === 9 ? <MiniChallenge key={resetKey} /> : null}
      </div>

      <LevelNav
        stepIndex={step}
        totalSteps={LEVELS.length}
        onBack={() => setStep((s) => Math.max(0, s - 1))}
        onNext={() => setStep((s) => Math.min(LEVELS.length - 1, s + 1))}
        onReset={handleReset}
        onJump={setStep}
      />
    </div>
  );
}
