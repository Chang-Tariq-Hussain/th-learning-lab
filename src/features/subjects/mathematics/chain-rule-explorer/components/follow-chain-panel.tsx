"use client";

import { useState } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatValue, type CompositeFunctionDef } from "../chain-rule-model";

export interface FollowChainPanelProps {
  fn: CompositeFunctionDef;
  x: number;
}

type ChainMode = "values" | "rates";

function ChainArrow() {
  return (
    <div className="flex h-6 w-6 shrink-0 items-center justify-center text-ink-soft/60 dark:text-bone-soft/60">
      <ArrowDown className="h-5 w-5 sm:hidden" strokeWidth={1.75} />
      <ArrowRight className="hidden h-5 w-5 sm:block" strokeWidth={1.75} />
    </div>
  );
}

function ChainBox({ label, value, tone }: { label: string; value: string; tone: "ink" | "math" | "amber" }) {
  return (
    <div
      className={cn(
        "flex min-w-[7.5rem] flex-col items-center gap-1 rounded-lg border-2 px-4 py-3 text-center",
        tone === "math" && "border-subject-math bg-subject-math-soft dark:bg-subject-math/15",
        tone === "amber" && "border-amber-500 bg-amber-50 dark:border-amber-400 dark:bg-amber-900/20",
        tone === "ink" && "border-line bg-white/60 dark:border-line-dark dark:bg-white/[0.03]"
      )}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-soft dark:text-bone-soft">
        {label}
      </p>
      <p className="font-mono text-sm font-semibold text-ink dark:text-bone">{value}</p>
    </div>
  );
}

/**
 * Section 4 — "Follow the Chain". Two toggleable chains built from the
 * same connected-box visual language as the composition machine: the
 * value chain (x -> inner -> u -> outer -> output) and the rate chain
 * (x -> inner rate -> outer rate -> final rate), so the name "Chain
 * Rule" reads as literally chained steps rather than a formula to
 * memorize.
 */
export function FollowChainPanel({ fn, x }: FollowChainPanelProps) {
  const [mode, setMode] = useState<ChainMode>("values");
  const u = fn.evaluateInner(x);
  const output = fn.evaluateOuter(u);
  const innerRate = fn.innerDerivative(x);
  const outerRate = fn.outerDerivativeAtU(u);
  const finalRate = fn.derivative(x);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("values")}
          aria-pressed={mode === "values"}
          className={cn(
            "rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-[0.15em] transition-colors",
            mode === "values"
              ? "border-subject-math bg-subject-math-soft text-subject-math dark:bg-subject-math/15"
              : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft"
          )}
        >
          Values
        </button>
        <button
          type="button"
          onClick={() => setMode("rates")}
          aria-pressed={mode === "rates"}
          className={cn(
            "rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-[0.15em] transition-colors",
            mode === "rates"
              ? "border-amber-500 bg-amber-50 text-amber-700 dark:border-amber-400 dark:bg-amber-900/20 dark:text-amber-300"
              : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft"
          )}
        >
          Rates of Change
        </button>
      </div>

      {mode === "values" ? (
        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <ChainBox label="x" value={formatValue(x)} tone="ink" />
          <ChainArrow />
          <ChainBox label="Inner Function" value={fn.innerLatex} tone="math" />
          <ChainArrow />
          <ChainBox label="u" value={formatValue(u)} tone="ink" />
          <ChainArrow />
          <ChainBox label="Outer Function" value={fn.outerLatex} tone="amber" />
          <ChainArrow />
          <ChainBox label="Final Output" value={formatValue(output)} tone="ink" />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <ChainBox label="x" value={formatValue(x)} tone="ink" />
          <ChainArrow />
          <ChainBox label="Inner Rate" value={fn.innerDerivativeLatex} tone="math" />
          <ChainArrow />
          <ChainBox label="Outer Rate" value={fn.outerDerivativeLatex} tone="amber" />
          <ChainArrow />
          <ChainBox label="Final Rate" value={formatValue(finalRate)} tone="ink" />
        </div>
      )}

      <p className="max-w-lg text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        {mode === "values"
          ? "Each stage's output becomes the next stage's input — that chain of hand-offs is what gives the Chain Rule its name."
          : `The inner rate (${formatValue(innerRate)}) and the outer rate (${formatValue(outerRate)}) multiply together to give the final rate of change.`}
      </p>
    </div>
  );
}
