"use client";

import { useState } from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { StepControls } from "./step-controls";

const U_COLOR = "#0284C7"; // sky-600
const V_COLOR = "#E11D48"; // rose-600

const STEP_TITLES = ["Identify u and v", "Differentiate each", "Substitute into the formula", "Simplify"];

export function QuotientRulePanel() {
  const [step, setStep] = useState(0);

  return (
    <div className="flex flex-col items-center gap-5">
      <p className="max-w-xl text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        When one function is divided by another, both get differentiated, then combined in this specific
        pattern — the order matters, so it helps to always substitute the same way.
      </p>
      <BlockMath math="f(x) = \dfrac{u(x)}{v(x)} \qquad \left(\dfrac{u}{v}\right)' = \dfrac{v u' - u v'}{v^2}" />
      <BlockMath math={`f(x) = \\dfrac{\\textcolor{${U_COLOR}}{x^2}}{\\textcolor{${V_COLOR}}{x + 1}}`} />

      <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-subject-math">
        {STEP_TITLES[step]}
      </p>

      <div className="flex min-h-[7rem] w-full max-w-lg flex-wrap items-center justify-center gap-4 rounded-card border border-line bg-white/60 px-4 py-5 dark:border-line-dark dark:bg-white/[0.03]">
        {step === 0 ? (
          <>
            <span className="rounded-lg border px-3 py-2" style={{ borderColor: U_COLOR }}>
              <BlockMath math={`u = \\textcolor{${U_COLOR}}{x^2}`} />
            </span>
            <span className="rounded-lg border px-3 py-2" style={{ borderColor: V_COLOR }}>
              <BlockMath math={`v = \\textcolor{${V_COLOR}}{x + 1}`} />
            </span>
          </>
        ) : null}

        {step === 1 ? (
          <>
            <span className="rounded-lg border px-3 py-2" style={{ borderColor: U_COLOR }}>
              <BlockMath math={`u' = \\textcolor{${U_COLOR}}{2x}`} />
            </span>
            <span className="rounded-lg border px-3 py-2" style={{ borderColor: V_COLOR }}>
              <BlockMath math={`v' = \\textcolor{${V_COLOR}}{1}`} />
            </span>
          </>
        ) : null}

        {step === 2 ? (
          <BlockMath
            math={`\\dfrac{\\textcolor{${V_COLOR}}{v}\\,\\textcolor{${U_COLOR}}{u'} - \\textcolor{${U_COLOR}}{u}\\,\\textcolor{${V_COLOR}}{v'}}{v^2} = \\dfrac{\\textcolor{${V_COLOR}}{(x+1)}\\,\\textcolor{${U_COLOR}}{(2x)} - \\textcolor{${U_COLOR}}{(x^2)}\\,\\textcolor{${V_COLOR}}{(1)}}{(x+1)^2}`}
          />
        ) : null}

        {step === 3 ? (
          <div className="flex flex-col items-center gap-2">
            <BlockMath math="\dfrac{2x^2 + 2x - x^2}{(x+1)^2}" />
            <BlockMath math="f'(x) = \dfrac{x^2 + 2x}{(x+1)^2}" />
          </div>
        ) : null}
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
