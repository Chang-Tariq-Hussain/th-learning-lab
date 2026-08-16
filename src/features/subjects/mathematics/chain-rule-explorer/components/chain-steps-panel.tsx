"use client";

import { useEffect, useState } from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { StepControls } from "../../derivative-rules/components/step-controls";
import { buildChainSteps, type CompositeFunctionDef } from "../chain-rule-model";

export interface ChainStepsPanelProps {
  fn: CompositeFunctionDef;
}

/**
 * The Section 3 "don't reveal the answer immediately" walkthrough:
 * outer derivative, inner derivative, multiply, replace u, final —
 * one step visible at a time via the shared `StepControls`, same as
 * Derivative Rules' step-by-step panel.
 */
export function ChainStepsPanel({ fn }: ChainStepsPanelProps) {
  const [step, setStep] = useState(0);
  const steps = buildChainSteps(fn);

  useEffect(() => {
    setStep(0);
  }, [fn.id]);

  return (
    <div className="flex flex-col items-center gap-5">
      <BlockMath math={fn.fullLatex} />

      <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-subject-math">
        {steps[step]!.title}
      </p>

      <div className="flex min-h-[6rem] w-full max-w-xl items-center justify-center rounded-card border border-line bg-white/60 px-6 py-6 dark:border-line-dark dark:bg-white/[0.03]">
        <BlockMath math={steps[step]!.latex} />
      </div>

      <StepControls
        index={step}
        total={steps.length}
        onBack={() => setStep((s) => Math.max(0, s - 1))}
        onNext={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
        onReset={() => setStep(0)}
      />
    </div>
  );
}
