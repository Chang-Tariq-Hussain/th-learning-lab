"use client";

import { useState } from "react";
import { LevelNav } from "../calculus-foundations/components/level-nav";
import { ConstantMultiplePanel } from "./components/constant-multiple-panel";
import { ConstantRulePanel } from "./components/constant-rule-panel";
import { MiniChallenge } from "./components/mini-challenge";
import { PowerRulePanel } from "./components/power-rule-panel";
import { ProductRulePanel } from "./components/product-rule-panel";
import { QuotientRulePanel } from "./components/quotient-rule-panel";
import { RuleSelectorPanel } from "./components/rule-selector-panel";
import { StepByStepPanel } from "./components/step-by-step-panel";
import { SumDifferencePanel } from "./components/sum-difference-panel";

interface Level {
  label: string;
  title: string;
  subtitle: string;
}

const LEVELS: Level[] = [
  { label: "Level 1", title: "Constant Rule", subtitle: "A constant never changes, so its derivative is always 0." },
  {
    label: "Level 2",
    title: "Power Rule",
    subtitle: "Bring the exponent down as a coefficient, then subtract 1 from it.",
  },
  {
    label: "Level 3",
    title: "Constant Multiple Rule",
    subtitle: "The constant stays in front while the power rule is applied.",
  },
  {
    label: "Level 4",
    title: "Sum & Difference Rule",
    subtitle: "Differentiate each term separately, then combine.",
  },
  {
    label: "Level 5",
    title: "Multiple-Term Functions",
    subtitle: "Step through a longer expression, one term at a time.",
  },
  { label: "Level 6", title: "Product Rule", subtitle: "(uv)' = u'v + uv' — both functions get differentiated." },
  {
    label: "Level 7",
    title: "Quotient Rule",
    subtitle: "(u/v)' = (vu' − uv') / v² — the order matters.",
  },
  { label: "Level 8", title: "Choose the Correct Rule", subtitle: "Recognize the structure before you calculate." },
  { label: "Practice", title: "Mini Practice", subtitle: "Six quick questions to check your understanding." },
];

/**
 * Derivative Rules — Learn Differentiation Step by Step.
 *
 * Nine self-paced levels reusing Calculus Foundations' `LevelNav` for
 * top-level progression and `FunctionGraph`/KaTeX for every worked
 * example, following on directly from Derivative Explorer's "what is
 * a derivative" intuition into "how do I calculate one".
 */
export function DerivativeRules() {
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
        {step === 0 ? <ConstantRulePanel /> : null}
        {step === 1 ? <PowerRulePanel /> : null}
        {step === 2 ? <ConstantMultiplePanel /> : null}
        {step === 3 ? <SumDifferencePanel key={`sum-${step}`} /> : null}
        {step === 4 ? <StepByStepPanel key={`steps-${step}`} /> : null}
        {step === 5 ? <ProductRulePanel key={`product-${step}`} /> : null}
        {step === 6 ? <QuotientRulePanel key={`quotient-${step}`} /> : null}
        {step === 7 ? <RuleSelectorPanel key={`selector-${step}`} /> : null}
        {step === 8 ? <MiniChallenge key={`practice-${step}`} /> : null}
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
