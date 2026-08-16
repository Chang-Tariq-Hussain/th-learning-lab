"use client";

import { useState } from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";
import { FunctionGraph } from "../../calculus-foundations/components/function-graph";
import {
  CONSTANT_MULTIPLE_EXAMPLES,
  derivativeOfTerm,
  evaluateTerm,
  termLatex,
} from "../derivative-rules-model";

const DOMAIN_FOR_N: Record<number, number> = { 2: 3, 3: 2, 4: 1.6 };

export function ConstantMultiplePanel() {
  const [index, setIndex] = useState(0);
  const term = CONSTANT_MULTIPLE_EXAMPLES[index]!;
  const derived = derivativeOfTerm(term);
  const domain = DOMAIN_FOR_N[term.n] ?? 2;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="mx-auto aspect-square w-full max-w-md">
        <FunctionGraph
          segments={[{ evaluate: (x) => evaluateTerm(term, x), from: -domain, to: domain }]}
          ariaLabel={`The graph of f of x equals ${termLatex(term)}.`}
        />
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
          The constant stays in front while the power rule is applied to the rest.
        </p>

        <BlockMath math="\dfrac{d}{dx}\left[c \cdot f(x)\right] = c \cdot f'(x)" />

        <div className="flex flex-wrap items-center gap-2">
          {CONSTANT_MULTIPLE_EXAMPLES.map((t, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-pressed={index === i}
              className={cn(
                "rounded-full border px-3.5 py-1.5 font-mono text-sm transition-colors",
                index === i
                  ? "border-subject-math bg-subject-math-soft text-subject-math dark:bg-subject-math/15"
                  : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30",
              )}
            >
              {t.c}x{t.n === 2 ? "²" : t.n === 3 ? "³" : "⁴"}
            </button>
          ))}
        </div>

        <div className="rounded-card border border-line bg-white/60 px-4 py-3 dark:border-line-dark dark:bg-white/[0.03]">
          <BlockMath math={`f(x) = ${termLatex(term)}`} />
          <BlockMath math={`f'(x) = ${termLatex(derived)}`} />
        </div>

        <p className="text-xs text-ink-soft dark:text-bone-soft">
          {term.c} stays exactly where it is — only x{term.n === 2 ? "²" : term.n === 3 ? "³" : "⁴"} gets
          differentiated by the power rule.
        </p>
      </div>
    </div>
  );
}
