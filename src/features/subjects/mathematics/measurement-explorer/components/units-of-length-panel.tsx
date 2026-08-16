"use client";

import { Ruler } from "lucide-react";
import { QuizPanel } from "../../statistics-foundations/components/quiz-panel";
import { UNIT_CHALLENGE_QUESTIONS, UNIT_EXAMPLES } from "../measurement-model";

/**
 * Level 6 — Units of Length. Four real-world reference examples (one
 * per unit), then the "choose the best unit" challenge (Section 10)
 * folded directly in, reusing the same `QuizPanel` the other
 * simulations already share.
 */
export function UnitsOfLengthPanel() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <div className="flex flex-col items-center gap-4">
        <p className="text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
          Four units cover almost everything you&apos;ll ever measure — pick the one that fits the object&apos;s scale.
        </p>
        <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
          {UNIT_EXAMPLES.map((ex) => (
            <div
              key={ex.id}
              className="flex flex-col items-center gap-1.5 rounded-card border border-line bg-white/60 px-3 py-4 text-center dark:border-line-dark dark:bg-white/[0.03]"
            >
              <Ruler className="h-5 w-5 text-subject-math" strokeWidth={1.5} />
              <p className="font-mono text-base font-semibold text-subject-math">{ex.unit}</p>
              <p className="text-xs leading-snug text-ink-soft dark:text-bone-soft">{ex.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-line pt-6 dark:border-line-dark">
        <p className="mb-4 text-center font-mono text-[11px] uppercase tracking-[0.15em] text-ink-soft dark:text-bone-soft">
          Choose the best unit
        </p>
        <QuizPanel questions={UNIT_CHALLENGE_QUESTIONS} restartLabel="Try Again" />
      </div>
    </div>
  );
}
