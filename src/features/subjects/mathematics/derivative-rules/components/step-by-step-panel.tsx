"use client";

import { useState } from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";
import { STEP_BY_STEP_TERMS, derivativeOfTerm, termLatex } from "../derivative-rules-model";
import { StepControls } from "./step-controls";

const STEPS = [
  { title: "Step 1", subtitle: "Identify each term." },
  { title: "Step 2", subtitle: "Apply the appropriate rule to each term." },
  { title: "Step 3", subtitle: "Differentiate each term." },
  { title: "Step 4", subtitle: "Combine into the final answer." },
];

const RULE_FOR_TERM = ["Power Rule", "Power Rule", "Constant Multiple", "Constant Rule"];

export function StepByStepPanel() {
  const [step, setStep] = useState(0);
  const terms = STEP_BY_STEP_TERMS;
  const derivedTerms = terms.map(derivativeOfTerm);
  const fullLatex = terms.map((t, i) => termLatex(t, i === 0)).join(" ");
  const finalTerms = derivedTerms.filter((t) => t.c !== 0);
  const finalLatex = finalTerms.map((t, i) => termLatex(t, i === 0)).join(" ");

  return (
    <div className="flex flex-col items-center gap-5">
      <p className="max-w-xl text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        Bigger expressions are just several of the rules you&apos;ve already learned, applied one term at a
        time.
      </p>
      <BlockMath math={`f(x) = ${fullLatex}`} />

      <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-subject-math">
        {STEPS[step]!.title} — {STEPS[step]!.subtitle}
      </p>

      <div className="flex min-h-[7rem] w-full max-w-2xl flex-wrap items-center justify-center gap-3 rounded-card border border-line bg-white/60 px-4 py-5 dark:border-line-dark dark:bg-white/[0.03]">
        {step === 0
          ? terms.map((t, i) => (
              <span
                key={i}
                className="rounded-lg border border-subject-math/40 bg-subject-math-soft px-3 py-2 dark:border-subject-math/30 dark:bg-subject-math/15"
              >
                <BlockMath math={termLatex(t, true)} />
              </span>
            ))
          : null}

        {step === 1
          ? terms.map((t, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 rounded-lg border border-line bg-white/70 px-3 py-2 dark:border-line-dark dark:bg-white/[0.04]">
                <BlockMath math={termLatex(t, true)} />
                <span className="text-[10px] font-medium uppercase tracking-wide text-amber-600 dark:text-amber-300">
                  {RULE_FOR_TERM[i]}
                </span>
              </div>
            ))
          : null}

        {step === 2
          ? terms.map((t, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-ink-soft/60 dark:text-bone-soft/60">
                  <BlockMath math={termLatex(t, true)} />
                </span>
                <span className="text-ink-soft dark:text-bone-soft">→</span>
                <span
                  className={cn(
                    "rounded-lg border px-3 py-2",
                    "border-subject-math/40 bg-subject-math-soft dark:border-subject-math/30 dark:bg-subject-math/15",
                  )}
                >
                  <BlockMath math={termLatex(derivedTerms[i]!, true)} />
                </span>
              </div>
            ))
          : null}

        {step === 3 ? <BlockMath math={`f'(x) = ${finalLatex}`} /> : null}
      </div>

      <StepControls
        index={step}
        total={STEPS.length}
        onBack={() => setStep((s) => Math.max(0, s - 1))}
        onNext={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
      />
    </div>
  );
}
