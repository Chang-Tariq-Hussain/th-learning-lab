"use client";

import { colorForParity, isEven } from "../colors";
import type { Operation } from "../model";

export function ResultCard({
  a,
  b,
  operation,
  result,
}: {
  a: number;
  b: number;
  operation: Operation;
  result: number;
}) {
  const symbol = operation === "add" ? "+" : "−";
  const color = colorForParity(result);
  const parityLabel = isEven(result) ? "Even" : "Odd";
  const otherParity = (n: number) => (isEven(n) ? "even" : "odd");

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3 rounded-[1.75rem] border border-line bg-white/70 p-6 text-center shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04]">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft/70 dark:text-bone-soft/70">
        {otherParity(a)} {symbol === "+" ? "plus" : "minus"} {otherParity(b)}
      </span>
      <div className="font-display text-3xl font-medium text-ink dark:text-bone">
        {a} {symbol} {b} = <span style={{ color }}>{result}</span>
      </div>
      <span
        className="rounded-full px-4 py-1 text-sm font-semibold"
        style={{ color, backgroundColor: `${color}1A` }}
      >
        {parityLabel}
      </span>
    </div>
  );
}
