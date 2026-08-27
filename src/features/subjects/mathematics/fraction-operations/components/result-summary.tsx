"use client";

import { OPERATION_SYMBOLS, simplify, toMixedString, type Fraction, type Operation } from "../model";

export function ResultSummary({ a, b, operation, result }: { a: Fraction; b: Fraction; operation: Operation; result: Fraction }) {
  const simplified = simplify(result);
  const mixed = toMixedString(result);
  const isNegative = simplified.num < 0;
  const showsSimplified = simplified.num !== result.num || simplified.den !== result.den;

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-2 rounded-[1.75rem] border border-line bg-white/70 p-6 text-center shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04]">
      <div className="font-display text-2xl font-medium text-ink dark:text-bone sm:text-3xl">
        {a.num}/{a.den} {OPERATION_SYMBOLS[operation]} {b.num}/{b.den} = {result.num}/{result.den}
      </div>
      {isNegative ? (
        <p className="text-sm text-ink-soft dark:text-bone-soft">
          That result is negative — try adjusting the fractions so the first is at least as large as the second.
        </p>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-ink-soft dark:text-bone-soft">
          {showsSimplified ? (
            <span>
              Simplified: <strong className="text-subject-math">{simplified.num}/{simplified.den}</strong>
            </span>
          ) : null}
          {mixed !== `${simplified.num}/${simplified.den}` && mixed !== `${simplified.num}` ? (
            <span>
              Mixed number: <strong className="text-subject-math">{mixed}</strong>
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}
