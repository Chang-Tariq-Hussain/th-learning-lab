"use client";

import type { ReactNode } from "react";
import { FractionBar, WholeBars } from "./fraction-bar";
import { lcm, type Fraction } from "../model";

const FRACTION_A_COLOR = "#3D5AFE";
const FRACTION_B_COLOR = "#7C4FE0";
const RESULT_COLOR = "#2E9E5B";

/**
 * Addition and subtraction share the same first move — convert both
 * fractions to a common denominator so every cell in every bar
 * represents the same size piece — so one component covers both,
 * switching only in how the result bar is drawn.
 */
export function AddSubtractVisual({
  a,
  b,
  isSubtract,
}: {
  a: Fraction;
  b: Fraction;
  isSubtract: boolean;
}) {
  const commonDen = lcm(a.den, b.den);
  const scaledA = a.num * (commonDen / a.den);
  const scaledB = b.num * (commonDen / b.den);
  const resultRaw = isSubtract ? scaledA - scaledB : scaledA + scaledB;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <LabeledBar label={`${a.num}/${a.den} → ${scaledA}/${commonDen}`}>
          <FractionBar den={commonDen} filled={scaledA} color={FRACTION_A_COLOR} size="sm" />
        </LabeledBar>
        <span className="font-display text-xl text-ink-soft/60 dark:text-bone-soft/60">{isSubtract ? "−" : "+"}</span>
        <LabeledBar label={`${b.num}/${b.den} → ${scaledB}/${commonDen}`}>
          <FractionBar den={commonDen} filled={scaledB} color={FRACTION_B_COLOR} size="sm" />
        </LabeledBar>
      </div>

      {isSubtract && resultRaw < 0 ? (
        <p className="max-w-sm text-center text-sm text-ink-soft dark:text-bone-soft">
          {a.num}/{a.den} is smaller than {b.num}/{b.den} once both are written in {commonDen}ths, so this subtraction
          goes negative — try increasing the first fraction or decreasing the second.
        </p>
      ) : isSubtract ? (
        <LabeledBar label={`Result: ${resultRaw}/${commonDen}`}>
          <FractionBar den={commonDen} filled={scaledA} crossedCount={scaledB} color={RESULT_COLOR} size="sm" />
        </LabeledBar>
      ) : (
        <LabeledBar label={`Result: ${resultRaw}/${commonDen}`}>
          <WholeBars den={commonDen} totalFilled={resultRaw} color={RESULT_COLOR} size="sm" />
        </LabeledBar>
      )}
    </div>
  );
}

function LabeledBar({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft/70 dark:text-bone-soft/70">
        {label}
      </span>
      {children}
    </div>
  );
}
