"use client";

import { useState } from "react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { SimulationLayout } from "@/features/simulation";
import { cn } from "@/lib/utils";
import { FunctionGraph } from "../../calculus-foundations/components/function-graph";
import { POWER_RULE_EXPONENTS } from "../derivative-rules-model";
import { PowerTransform } from "./power-transform";

const DOMAIN_FOR_N: Record<number, number> = { 2: 3, 3: 2, 4: 1.6, 5: 1.35 };

export function PowerRulePanel() {
  const [n, setN] = useState(2);
  const domain = DOMAIN_FOR_N[n] ?? 2;
  const evaluate = (x: number) => Math.pow(x, n);
  const derivative = (x: number) => n * Math.pow(x, n - 1);

  return (
    <SimulationLayout
      stageLabel="Graphs of x to the n and its derivative"
      aspect={2}
      stageCap="24rem"
      stage={
        <div className="grid h-full grid-cols-2 gap-2">
          <div className="flex min-h-0 flex-col items-center gap-1">
            <p className="font-mono text-label uppercase text-ink-soft dark:text-bone-soft">f(x) = x^{n}</p>
            <div className="min-h-0 w-full flex-1">
              <FunctionGraph
                segments={[{ evaluate, from: -domain, to: domain }]}
                ariaLabel={`The graph of f of x equals x to the ${n}.`}
              />
            </div>
          </div>
          <div className="flex min-h-0 flex-col items-center gap-1">
            <p className="font-mono text-label uppercase text-subject-math">f&apos;(x) = {n}x^{n - 1}</p>
            <div className="min-h-0 w-full flex-1">
              <FunctionGraph
                segments={[{ evaluate: derivative, from: -domain, to: domain, color: "#D97706" }]}
                ariaLabel={`The graph of the derivative, ${n} times x to the ${n - 1}.`}
              />
            </div>
          </div>
        </div>
      }
      controls={
        <div className="flex flex-col gap-5">
          <div className="flex flex-col items-center gap-3">
            <p className="max-w-xl text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
              The Power Rule: for <InlineMath math="f(x) = x^n" />, bring the exponent down in front as a
              multiplier, then subtract 1 from the exponent.
            </p>
            <BlockMath math="\dfrac{d}{dx}\left(x^n\right) = n x^{n-1}" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="font-mono text-label uppercase tracking-[0.15em] text-ink-soft dark:text-bone-soft">n =</span>
            {POWER_RULE_EXPONENTS.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setN(v)}
                aria-pressed={n === v}
                className={cn(
                  "min-h-11 rounded-full border px-3.5 py-1.5 font-mono text-sm transition-colors",
                  n === v
                    ? "border-subject-math bg-subject-math-soft text-subject-math dark:bg-subject-math/15"
                    : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30",
                )}
              >
                x{v === 2 ? "²" : v === 3 ? "³" : v === 4 ? "⁴" : "⁵"}
              </button>
            ))}
          </div>

          <PowerTransform n={n} />
        </div>
      }
      explanation={
        <p className="mx-auto max-w-xl text-center text-sm text-ink-soft dark:text-bone-soft">
          These are the same rules the tangent-line slopes in Derivative Explorer were quietly following the
          whole time — the Power Rule just lets us calculate that slope directly, without a limit.
        </p>
      }
    />
  );
}
