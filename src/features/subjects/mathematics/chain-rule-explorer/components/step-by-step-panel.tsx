"use client";

import { useState } from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { StepControls } from "../../derivative-rules/components/step-controls";
import { buildWorkspaceSteps, WORKSPACE_EXAMPLE } from "../chain-rule-model";

const STEPS = buildWorkspaceSteps(WORKSPACE_EXAMPLE);

/**
 * Section 6 — an "expression workspace" for y = (3x² + 2)⁴, walking
 * through all six named steps (identify inner, identify outer,
 * differentiate outer, differentiate inner, multiply, substitute) with
 * each step visually highlighted, one at a time.
 */
export function StepByStepPanel() {
  const [step, setStep] = useState(0);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-5">
      <p className="max-w-lg text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        A worked example, one named step at a time.
      </p>
      <BlockMath math={WORKSPACE_EXAMPLE.fullLatex} />

      <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-subject-math">
        {STEPS[step]!.title} — {STEPS[step]!.subtitle}
      </p>

      <div className="flex min-h-[6rem] w-full items-center justify-center rounded-card border border-line bg-white/60 px-6 py-6 dark:border-line-dark dark:bg-white/[0.03]">
        <span className="rounded-lg border-2 border-subject-math bg-subject-math-soft px-4 py-3 dark:bg-subject-math/15">
          <BlockMath math={STEPS[step]!.latex} />
        </span>
      </div>

      <StepControls
        index={step}
        total={STEPS.length}
        onBack={() => setStep((s) => Math.max(0, s - 1))}
        onNext={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
        onReset={() => setStep(0)}
      />
    </div>
  );
}
