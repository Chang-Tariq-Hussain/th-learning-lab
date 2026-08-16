"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  CONTINUOUS_EXAMPLE,
  JUMP_DOMAIN_MAX,
  JUMP_DOMAIN_MIN,
  JUMP_TARGET,
  jumpLeftPiece,
  jumpRightPiece,
} from "../calculus-model";
import { FunctionGraph } from "./function-graph";

type ContinuityMode = "continuous" | "discontinuous";

/**
 * Continuity, made visual: the exact same graph area shows either a
 * smooth curve with no break, or the Level 5 jump example with an
 * open/closed circle at the break — so the difference is the one
 * thing that changes when the student flips the toggle.
 */
export function ContinuityPanel() {
  const [mode, setMode] = useState<ContinuityMode>("continuous");

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="mx-auto aspect-square w-full max-w-md">
        {mode === "continuous" ? (
          <FunctionGraph
            segments={[{ evaluate: CONTINUOUS_EXAMPLE.evaluate, from: CONTINUOUS_EXAMPLE.domainMin, to: CONTINUOUS_EXAMPLE.domainMax }]}
            ariaLabel="A smooth continuous curve with no break."
          />
        ) : (
          <FunctionGraph
            segments={[
              { evaluate: jumpLeftPiece, from: JUMP_DOMAIN_MIN, to: JUMP_TARGET },
              { evaluate: jumpRightPiece, from: JUMP_TARGET, to: JUMP_DOMAIN_MAX },
            ]}
            markers={[
              { x: JUMP_TARGET, y: jumpLeftPiece(JUMP_TARGET), kind: "open" },
              { x: JUMP_TARGET, y: jumpRightPiece(JUMP_TARGET), kind: "closed" },
            ]}
            ariaLabel="A graph with a visible jump, showing a discontinuity."
          />
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="mx-auto flex w-fit gap-1 rounded-full border border-line bg-white/60 p-1 dark:border-line-dark dark:bg-white/[0.03] lg:mx-0">
          {(["continuous", "discontinuous"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setMode(option)}
              aria-pressed={mode === option}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors",
                mode === option
                  ? "bg-pine-600 text-paper dark:bg-pine-300 dark:text-chalkboard"
                  : "text-ink-soft hover:text-ink dark:text-bone-soft dark:hover:text-bone"
              )}
            >
              {option}
            </button>
          ))}
        </div>

        <p className="rounded-card border border-line bg-white/60 px-4 py-3 text-sm leading-relaxed text-ink dark:border-line-dark dark:bg-white/[0.03] dark:text-bone">
          A function is continuous at a point when the graph has no break there and the function approaches the
          same value from both sides.
        </p>

        {mode === "continuous" ? (
          <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
            This curve has no gaps or jumps — you could trace it without lifting your pen.
          </p>
        ) : (
          <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
            This graph jumps at x = 2: the open circle shows where the left piece would land, and the filled dot
            shows where the function actually is. You&apos;d have to lift your pen to draw it.
          </p>
        )}
      </div>
    </div>
  );
}
