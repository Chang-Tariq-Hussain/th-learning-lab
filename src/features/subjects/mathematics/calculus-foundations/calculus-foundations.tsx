"use client";

import { useState } from "react";
import {
  JUMP_DOMAIN_MAX,
  JUMP_DOMAIN_MIN,
  JUMP_TARGET,
  LIMIT_FUNCTION,
  LIMIT_TARGET,
  getFunction,
  jumpLeftPiece,
  jumpRightPiece,
  type FunctionId,
} from "./calculus-model";
import { ApproachPanel } from "./components/approach-panel";
import { CalculusBridge } from "./components/calculus-bridge";
import { ContinuityPanel } from "./components/continuity-panel";
import { FunctionGraph } from "./components/function-graph";
import { FunctionMachine } from "./components/function-machine";
import { FunctionSelector } from "./components/function-selector";
import { HolePanel } from "./components/hole-panel";
import { LevelNav } from "./components/level-nav";
import { MiniChallenge } from "./components/mini-challenge";
import { TwoSidedApproachPanel } from "./components/two-sided-approach-panel";
import { XSlider } from "./components/x-slider";

interface Level {
  label: string;
  title: string;
  subtitle: string;
}

const LEVELS: Level[] = [
  { label: "Level 1", title: "Functions", subtitle: "A function takes an input x and produces one output f(x)." },
  { label: "Level 2", title: "Graphs", subtitle: "Every (x, f(x)) pair is a point — drag it along the curve." },
  {
    label: "Level 3",
    title: "Approaching a Value",
    subtitle: "Step x closer and closer to a target without ever landing on it.",
  },
  { label: "Level 4", title: "Limits", subtitle: "When both sides approach the same value, the limit exists." },
  {
    label: "Level 5",
    title: "Left & Right Approach",
    subtitle: "Sometimes the two sides disagree — then the limit does not exist.",
  },
  { label: "Level 6", title: "Continuity", subtitle: "A continuous graph has no breaks, jumps, or gaps." },
  { label: "Level 7", title: "Holes & Discontinuities", subtitle: "A single missing point doesn't stop a limit from existing." },
  { label: "Connection", title: "Calculus Connection", subtitle: "Where these ideas lead next." },
  { label: "Challenge", title: "Mini Challenge", subtitle: "Five quick questions to check your understanding." },
];

/**
 * Calculus Foundations — Functions, Graphs & Limits.
 *
 * Nine self-paced levels, each built as its own focused panel so no
 * single screen tries to teach more than one idea at a time. Levels 1
 * and 2 share `selectedFunction`/`x` state so changing the function or
 * dragging the graph point keeps the machine and the graph in sync;
 * every later level uses the brief's own worked examples (f(x) = x² at
 * x → 2, and one simple jump discontinuity) so the teaching examples
 * stay fixed and predictable.
 */
export function CalculusFoundations() {
  const [step, setStep] = useState(0);
  const [selectedFunctionId, setSelectedFunctionId] = useState<FunctionId>("x2");
  const [x, setX] = useState<number>(getFunction("x2").defaultX);
  const [resetKey, setResetKey] = useState(0);

  const fn = getFunction(selectedFunctionId);
  const level = LEVELS[step]!;

  const handleSelectFunction = (id: FunctionId) => {
    setSelectedFunctionId(id);
    setX(getFunction(id).defaultX);
  };

  const handleReset = () => {
    if (step === 0 || step === 1) {
      setX(fn.defaultX);
    } else {
      setResetKey((k) => k + 1);
    }
  };

  const clampedX = Math.min(fn.domainMax, Math.max(fn.domainMin, x));

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">{level.label}</p>
        <h2 className="mt-1 font-display text-2xl font-medium text-ink dark:text-bone">{level.title}</h2>
        <p className="mx-auto mt-1 max-w-xl text-sm text-ink-soft dark:text-bone-soft">{level.subtitle}</p>
      </div>

      <div className="min-h-[420px]">
        {step === 0 ? (
          <div className="flex flex-col items-center gap-6">
            <FunctionSelector value={selectedFunctionId} onChange={handleSelectFunction} className="w-full max-w-xs" />
            <FunctionMachine fn={fn} x={clampedX} />
            <XSlider value={clampedX} onChange={setX} min={fn.domainMin} max={fn.domainMax} />
          </div>
        ) : null}

        {step === 1 ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
            <div className="mx-auto aspect-square w-full max-w-md">
              <FunctionGraph
                segments={[{ evaluate: fn.evaluate, from: fn.domainMin, to: fn.domainMax }]}
                trackedPoint={{ x: clampedX, y: fn.evaluate(clampedX) }}
                onDragTrackedPointX={(nextX) => setX(Math.min(fn.domainMax, Math.max(fn.domainMin, nextX)))}
                showGuides
                ariaLabel="A graph of the selected function with a draggable point."
              />
            </div>
            <div className="flex flex-col items-center justify-center gap-6">
              <FunctionSelector value={selectedFunctionId} onChange={handleSelectFunction} className="w-full max-w-xs" />
              <XSlider value={clampedX} onChange={setX} min={fn.domainMin} max={fn.domainMax} />
              <p className="rounded-card border border-line bg-white/60 px-4 py-3 text-center font-mono text-sm text-ink dark:border-line-dark dark:bg-white/[0.03] dark:text-bone">
                x = {clampedX.toFixed(2)} · f(x) = {fn.evaluate(clampedX).toFixed(2)}
              </p>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <ApproachPanel
            key={resetKey}
            evaluate={LIMIT_FUNCTION.evaluate}
            domainMin={LIMIT_FUNCTION.domainMin}
            domainMax={LIMIT_FUNCTION.domainMax}
            target={LIMIT_TARGET}
            latex={LIMIT_FUNCTION.latex}
          />
        ) : null}

        {step === 3 ? (
          <TwoSidedApproachPanel
            key={resetKey}
            segments={[{ evaluate: LIMIT_FUNCTION.evaluate, from: LIMIT_FUNCTION.domainMin, to: LIMIT_FUNCTION.domainMax }]}
            evaluateLeft={LIMIT_FUNCTION.evaluate}
            evaluateRight={LIMIT_FUNCTION.evaluate}
            target={LIMIT_TARGET}
            latex="\lim_{x \to 2} x^2"
          />
        ) : null}

        {step === 4 ? (
          <TwoSidedApproachPanel
            key={resetKey}
            segments={[
              { evaluate: jumpLeftPiece, from: JUMP_DOMAIN_MIN, to: JUMP_TARGET },
              { evaluate: jumpRightPiece, from: JUMP_TARGET, to: JUMP_DOMAIN_MAX },
            ]}
            markers={[
              { x: JUMP_TARGET, y: jumpLeftPiece(JUMP_TARGET), kind: "open" },
              { x: JUMP_TARGET, y: jumpRightPiece(JUMP_TARGET), kind: "closed" },
            ]}
            evaluateLeft={jumpLeftPiece}
            evaluateRight={jumpRightPiece}
            target={JUMP_TARGET}
            latex="\lim_{x \to 2} f(x)"
          />
        ) : null}

        {step === 5 ? <ContinuityPanel key={resetKey} /> : null}

        {step === 6 ? <HolePanel key={resetKey} /> : null}

        {step === 7 ? <CalculusBridge /> : null}

        {step === 8 ? <MiniChallenge key={resetKey} /> : null}
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
