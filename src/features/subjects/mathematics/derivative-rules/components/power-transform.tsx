"use client";

import { useEffect, useState } from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";

const HIGHLIGHT = "#D97706"; // amber-600, matches the amber accents used elsewhere for "moving" pieces

interface PowerTransformProps {
  n: number;
}

/**
 * Shows xⁿ transforming into n·x^(n-1): the exponent is highlighted in
 * both the "before" and "after" formulas so it's visually obvious that
 * the same number moves down to become the coefficient and drops by 1.
 * Re-triggers its reveal animation whenever n changes.
 */
export function PowerTransform({ n }: PowerTransformProps) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setRevealed(false);
    const id = setTimeout(() => setRevealed(true), 60);
    return () => clearTimeout(id);
  }, [n]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="rounded-card border border-line bg-white/60 px-5 py-3 dark:border-line-dark dark:bg-white/[0.03]">
        <BlockMath math={`x^{\\textcolor{${HIGHLIGHT}}{${n}}}`} />
      </div>

      <div
        className={cn(
          "flex flex-col items-center text-ink-soft transition-all duration-500 dark:text-bone-soft",
          revealed ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-40",
        )}
      >
        <span className="text-lg leading-none">↓</span>
        <span className="max-w-[13rem] text-center text-[11px] leading-snug">
          Exponent moves down and becomes the coefficient. Exponent decreases by 1.
        </span>
      </div>

      <div
        className={cn(
          "rounded-card border px-5 py-3 transition-all duration-500",
          revealed
            ? "border-subject-math bg-subject-math-soft opacity-100 dark:bg-subject-math/15"
            : "border-line bg-white/60 opacity-60 dark:border-line-dark dark:bg-white/[0.03]",
        )}
      >
        <BlockMath math={`\\textcolor{${HIGHLIGHT}}{${n}} \\cdot x^{${n - 1}}`} />
      </div>
    </div>
  );
}
