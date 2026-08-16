"use client";

import { useState } from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";
import { FunctionGraph } from "../../calculus-foundations/components/function-graph";
import { StateChain } from "./state-chain";
import { buildColoredSegments, criticalMarkers, getAppFunction, PROFIT_FUNCTION } from "../applications-model";

const MAX_FN = getAppFunction("negx2");
const MIN_FN = getAppFunction("x2");

/**
 * Level 6 — Maximum vs Minimum. A side-by-side comparison (Section 6)
 * so the two turning-point patterns can be seen at once, plus a
 * togglable, deliberately non-interactive "Profit" note (Section 10)
 * reusing the same -x² curve relabeled conceptually — not a separate
 * economics simulation.
 */
export function MaxVsMinPanel() {
  const [showProfit, setShowProfit] = useState(false);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6">
      <p className="max-w-lg text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        A local maximum turns from increasing to decreasing. A local minimum turns from decreasing to
        increasing.
      </p>

      <div className="grid w-full gap-4 sm:grid-cols-2">
        <div className="flex flex-col items-center gap-3 rounded-card border border-line bg-white/60 px-4 py-5 dark:border-line-dark dark:bg-white/[0.03]">
          <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-soft dark:text-bone-soft">
            Local Maximum
          </span>
          <BlockMath math={MAX_FN.latex} />
          <div className="aspect-square w-full max-w-[220px]">
            <FunctionGraph
              segments={buildColoredSegments(MAX_FN)}
              markers={criticalMarkers(MAX_FN)}
              ariaLabel="f(x) = -x squared, a local maximum at the origin."
            />
          </div>
          <StateChain
            links={[
              { label: "Increasing", tone: "positive" },
              { label: "Decreasing", tone: "negative" },
            ]}
          />
        </div>

        <div className="flex flex-col items-center gap-3 rounded-card border border-line bg-white/60 px-4 py-5 dark:border-line-dark dark:bg-white/[0.03]">
          <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-soft dark:text-bone-soft">
            Local Minimum
          </span>
          <BlockMath math={MIN_FN.latex} />
          <div className="aspect-square w-full max-w-[220px]">
            <FunctionGraph
              segments={buildColoredSegments(MIN_FN)}
              markers={criticalMarkers(MIN_FN)}
              ariaLabel="f(x) = x squared, a local minimum at the origin."
            />
          </div>
          <StateChain
            links={[
              { label: "Decreasing", tone: "negative" },
              { label: "Increasing", tone: "positive" },
            ]}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowProfit((s) => !s)}
        className="rounded-full border border-line px-4 py-1.5 font-mono text-xs uppercase tracking-[0.15em] text-ink-soft transition-colors hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30"
      >
        {showProfit ? "Hide" : "Show"} a Real-World Example
      </button>

      {showProfit ? (
        <div
          className={cn(
            "flex w-full max-w-md flex-col items-center gap-3 rounded-card border border-line bg-white/60 px-5 py-5 text-center dark:border-line-dark dark:bg-white/[0.03]"
          )}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-subject-math">Profit</p>
          <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
            Imagine x is the number of products sold and f(x) is the profit. A local maximum point can
            represent the point where profit is greatest.
          </p>
          <StateChain
            links={[
              { label: "Increasing Profit", tone: "positive" },
              { label: "Maximum", tone: "neutral" },
              { label: "Decreasing Profit", tone: "negative" },
            ]}
          />
          <p className="text-xs text-ink-soft dark:text-bone-soft">
            Derivatives can help locate points like this — the same idea behind{" "}
            <span className="font-mono">{PROFIT_FUNCTION.label}</span> above, just relabeled.
          </p>
        </div>
      ) : null}
    </div>
  );
}
