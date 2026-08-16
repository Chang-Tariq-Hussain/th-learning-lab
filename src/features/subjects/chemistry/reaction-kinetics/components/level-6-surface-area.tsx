"use client";

import { COLOR_A } from "../model";
import { PredictionPrompt } from "./prediction-prompt";
import { PREDICTION_QUESTIONS } from "../model";

function SolidPiece({ x, y, size }: { x: number; y: number; size: number }) {
  return <rect x={x} y={y} width={size} height={size} rx={3} fill={COLOR_A} stroke="white" strokeWidth={1.5} />;
}

/** Level 6 — a static (non-kinetic) chunk-vs-powder comparison, since exposed surface area isn't a live particle behaviour. */
export function Level6SurfaceArea() {
  return (
    <div className="flex flex-col gap-5">
      <p className="max-w-2xl text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        Only the <em>exposed</em> surface of a solid reactant can collide with the other reactant. Breaking a chunk
        into smaller pieces exposes far more surface, even though the total amount of substance barely changes.
      </p>

      <PredictionPrompt question={PREDICTION_QUESTIONS.surfaceArea} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">Large Chunk</p>
          <svg viewBox="0 0 160 120" className="mt-3 w-full">
            <SolidPiece x={30} y={20} size={100} />
          </svg>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs font-medium text-ink-soft dark:text-bone-soft">
              <span>Exposed Surface</span>
              <span>Low</span>
            </div>
            <div className="mt-1 h-3 w-full rounded-full bg-ink/[0.06] dark:bg-bone/[0.08]">
              <div className="h-3 w-[22%] rounded-full bg-pine-600 dark:bg-pine-300" />
            </div>
          </div>
          <p className="mt-2 text-center font-mono text-sm text-ink-soft dark:text-bone-soft">Slower reaction</p>
        </div>

        <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">Small Pieces / Powder</p>
          <svg viewBox="0 0 160 120" className="mt-3 w-full">
            {Array.from({ length: 5 }).flatMap((_, row) =>
              Array.from({ length: 5 }).map((_, col) => (
                <SolidPiece key={`${row}-${col}`} x={20 + col * 24} y={10 + row * 20} size={16} />
              ))
            )}
          </svg>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs font-medium text-ink-soft dark:text-bone-soft">
              <span>Exposed Surface</span>
              <span>High</span>
            </div>
            <div className="mt-1 h-3 w-full rounded-full bg-ink/[0.06] dark:bg-bone/[0.08]">
              <div className="h-3 w-[92%] rounded-full bg-pine-600 dark:bg-pine-300" />
            </div>
          </div>
          <p className="mt-2 text-center font-mono text-sm text-ink-soft dark:text-bone-soft">Faster reaction</p>
        </div>
      </div>

      <p className="text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        Same total amount of substance — but the powder offers many more collision opportunities.
      </p>
    </div>
  );
}
