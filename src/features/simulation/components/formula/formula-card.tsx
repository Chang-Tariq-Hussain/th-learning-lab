"use client";

import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";

export interface FormulaCardProps {
  /** LaTeX source, e.g. "F = ma" or "v = v_0 + at". */
  formula: string;
  /** Optional short caption shown above the formula, e.g. "Newton's Second Law". */
  caption?: string;
  /** Render as a centered block equation (default) or inline within text. */
  display?: boolean;
  className?: string;
}

/**
 * Renders a single LaTeX formula with KaTeX. Every subject can reuse this
 * for its own equations — the component has no notion of physics vs.
 * chemistry vs. math, it only renders LaTeX.
 */
export function FormulaCard({ formula, caption, display = true, className }: FormulaCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-line bg-white/60 px-4 py-4 text-center dark:border-line-dark dark:bg-white/[0.03]",
        className
      )}
    >
      {caption ? (
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-soft dark:text-bone-soft">
          {caption}
        </p>
      ) : null}
      <div className="text-ink dark:text-bone [&_.katex]:text-[1.15em]">
        {display ? <BlockMath math={formula} /> : <InlineMath math={formula} />}
      </div>
    </div>
  );
}
