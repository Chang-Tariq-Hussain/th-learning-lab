"use client";

import { colorForParity, isEven } from "../colors";

/**
 * Renders a whole number as pairs of dots, side by side, with a
 * single unpaired dot floating below the last pair when the number
 * is odd — the same "leftover" mental model the Learn/Explain
 * content leans on ("even numbers pair up with nothing left over").
 * Deliberately plain SVG circles, no external asset, so the pattern
 * stays crisp at any size.
 */
export function DotGrid({ value, label }: { value: number; label: string }) {
  const pairCount = Math.floor(value / 2);
  const hasLeftover = !isEven(value);
  const color = colorForParity(value);
  const cols = Math.min(pairCount, 5) || 1;
  const rows = Math.max(1, Math.ceil(pairCount / 5));

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft/70 dark:text-bone-soft/70">
        {label}
      </span>
      <div
        className="flex min-h-[92px] w-full max-w-[220px] flex-col items-center justify-center gap-2 rounded-2xl border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]"
        role="img"
        aria-label={`${value} shown as ${pairCount} pair${pairCount === 1 ? "" : "s"}${hasLeftover ? " and one leftover dot" : ""}`}
      >
        <div
          className="grid gap-x-3 gap-y-2"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: pairCount }, (_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <Dot color={color} />
              <Dot color={color} />
            </div>
          ))}
        </div>
        {hasLeftover ? (
          <div className="flex items-center gap-1.5 border-t border-dashed border-ink/15 pt-2 dark:border-bone/15">
            <Dot color={color} />
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft/70 dark:text-bone-soft/70">
              leftover
            </span>
          </div>
        ) : null}
        {value === 0 ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft/60 dark:text-bone-soft/60">
            nothing to pair
          </span>
        ) : null}
      </div>
      <span className="text-lg font-semibold" style={{ color }}>
        {value} — {isEven(value) ? "Even" : "Odd"}
      </span>
    </div>
  );
}

function Dot({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <circle cx="7" cy="7" r="6" fill={color} />
    </svg>
  );
}
