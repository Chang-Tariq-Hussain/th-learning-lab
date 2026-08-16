"use client";

import { useState } from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { LevelNav } from "../calculus-foundations/components/level-nav";
import { CompositionMachine } from "./components/composition-machine";
import { InnerOuterPanel } from "./components/inner-outer-panel";
import { ChainRuleVisualPanel } from "./components/chain-rule-visual-panel";
import { StepByStepPanel } from "./components/step-by-step-panel";
import { PowerVsChainLevel } from "./components/power-vs-chain-level";
import { NestedFunctionsPanel } from "./components/nested-functions-panel";
import { MiniChallenge } from "./components/mini-challenge";

interface Level {
  label: string;
  title: string;
  subtitle: string;
}

const LEVELS: Level[] = [
  {
    label: "Level 1",
    title: "Function Composition",
    subtitle: "A composite function is a function inside another function.",
  },
  {
    label: "Level 2",
    title: "Inner and Outer Functions",
    subtitle: "First calculate the inner function, then apply the outer function.",
  },
  {
    label: "Level 3",
    title: "Basic Chain Rule",
    subtitle: "Outer derivative times inner derivative, then substitute u back in.",
  },
  {
    label: "Level 4",
    title: "Step-by-Step Chain Rule",
    subtitle: "A worked example, one named step at a time.",
  },
  {
    label: "Level 5",
    title: "Chain Rule vs Power Rule",
    subtitle: "Recognize whether an inner function is hiding inside the power.",
  },
  {
    label: "Level 6",
    title: "Nested Functions",
    subtitle: "The Chain Rule can be applied more than once, one layer at a time.",
  },
  { label: "Practice", title: "Mini Practice", subtitle: "Six quick questions to check your understanding." },
];

/**
 * Chain Rule Explorer — Differentiating Composite Functions.
 *
 * Seven self-paced levels reusing Calculus Foundations' `LevelNav` for
 * top-level progression and the shared `FunctionGraph`/KaTeX/step
 * controls every other Calculus activity already uses. Follows on
 * directly from Derivative Rules: same worked-example, click-to-reveal
 * teaching pattern, now applied to composite functions.
 */
export function ChainRuleExplorer() {
  const [step, setStep] = useState(0);
  const level = LEVELS[step]!;

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">{level.label}</p>
        <h2 className="mt-1 font-display text-2xl font-medium text-ink dark:text-bone">{level.title}</h2>
        <p className="mx-auto mt-1 max-w-xl text-sm text-ink-soft dark:text-bone-soft">{level.subtitle}</p>
      </div>

      <div className="flex flex-col items-center gap-1.5 rounded-card border border-line bg-white/60 px-4 py-3 dark:border-line-dark dark:bg-white/[0.03]">
        <BlockMath math="\dfrac{d}{dx}[f(g(x))] = f'(g(x)) \cdot g'(x)" />
        <p className="font-mono text-xs text-ink-soft dark:text-bone-soft">
          Outer derivative × Inner derivative
        </p>
      </div>

      <div className="min-h-[420px]">
        {step === 0 ? <CompositionMachine /> : null}
        {step === 1 ? <InnerOuterPanel /> : null}
        {step === 2 ? <ChainRuleVisualPanel key={`visual-${step}`} /> : null}
        {step === 3 ? <StepByStepPanel key={`steps-${step}`} /> : null}
        {step === 4 ? <PowerVsChainLevel key={`compare-${step}`} /> : null}
        {step === 5 ? <NestedFunctionsPanel key={`nested-${step}`} /> : null}
        {step === 6 ? <MiniChallenge key={`practice-${step}`} /> : null}
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
