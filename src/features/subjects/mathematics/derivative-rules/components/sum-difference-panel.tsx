"use client";

import { useState } from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";
import { SUM_EXAMPLES, derivativeOfTerm, termLatex } from "../derivative-rules-model";
import { StepControls } from "./step-controls";

const STEP_TITLES = ["The function", "Split into terms", "Differentiate each term", "Combine"];

export function SumDifferencePanel() {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [step, setStep] = useState(0);
  const example = SUM_EXAMPLES[exampleIndex]!;
  const [a, b] = example.terms;
  const da = derivativeOfTerm(a);
  const db = derivativeOfTerm(b);
  const fullLatex = `${termLatex(a)} ${termLatex(b, false)}`;
  const derivativeLatex = `${termLatex(da)} ${termLatex(db, false)}`;

  const handleSwitchExample = (i: number) => {
    setExampleIndex(i);
    setStep(0);
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <p className="max-w-xl text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        Differentiate each term separately, then add (or subtract) the results.
      </p>
      <BlockMath math="\dfrac{d}{dx}\left[f(x) \pm g(x)\right] = f'(x) \pm g'(x)" />

      <div className="flex gap-2">
        {SUM_EXAMPLES.map((e, i) => (
          <button
            key={e.label}
            type="button"
            onClick={() => handleSwitchExample(i)}
            aria-pressed={exampleIndex === i}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              exampleIndex === i
                ? "border-subject-math bg-subject-math-soft text-subject-math dark:bg-subject-math/15"
                : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30",
            )}
          >
            {e.label} Example
          </button>
        ))}
      </div>

      <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-soft dark:text-bone-soft">
        {STEP_TITLES[step]}
      </p>

      <div className="flex min-h-[7rem] w-full max-w-md flex-col items-center justify-center gap-3 rounded-card border border-line bg-white/60 px-4 py-5 dark:border-line-dark dark:bg-white/[0.03]">
        {step === 0 ? <BlockMath math={`f(x) = ${fullLatex}`} /> : null}

        {step === 1 ? (
          <div className="flex items-center gap-4">
            <span className="rounded-lg border border-subject-math/40 bg-subject-math-soft px-3 py-2 dark:border-subject-math/30 dark:bg-subject-math/15">
              <BlockMath math={termLatex(a)} />
            </span>
            <span className="text-ink-soft dark:text-bone-soft">{b.c < 0 ? "−" : "+"}</span>
            <span className="rounded-lg border border-amber-500/40 bg-amber-50 px-3 py-2 dark:border-amber-400/30 dark:bg-amber-900/15">
              <BlockMath math={termLatex({ ...b, c: Math.abs(b.c) })} />
            </span>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="flex items-center gap-4">
            <span className="rounded-lg border border-subject-math/40 bg-subject-math-soft px-3 py-2 dark:border-subject-math/30 dark:bg-subject-math/15">
              <BlockMath math={termLatex(da)} />
            </span>
            <span className="text-ink-soft dark:text-bone-soft">{db.c < 0 ? "−" : "+"}</span>
            <span className="rounded-lg border border-amber-500/40 bg-amber-50 px-3 py-2 dark:border-amber-400/30 dark:bg-amber-900/15">
              <BlockMath math={termLatex({ ...db, c: Math.abs(db.c) })} />
            </span>
          </div>
        ) : null}

        {step === 3 ? <BlockMath math={`f'(x) = ${derivativeLatex}`} /> : null}
      </div>

      <StepControls
        index={step}
        total={STEP_TITLES.length}
        onBack={() => setStep((s) => Math.max(0, s - 1))}
        onNext={() => setStep((s) => Math.min(STEP_TITLES.length - 1, s + 1))}
      />
    </div>
  );
}
