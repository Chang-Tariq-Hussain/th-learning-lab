"use client";

import {
  HOLE_DOMAIN_MAX,
  HOLE_DOMAIN_MIN,
  HOLE_TARGET,
  HOLE_VALUE,
  formatValue,
  holeFunction,
} from "../calculus-model";
import { TwoSidedApproachPanel } from "./two-sided-approach-panel";

/**
 * A removable discontinuity: f(x) = (x^2 - 4) / (x - 2) simplifies to
 * x + 2 everywhere except x = 2, where it's undefined. Reuses the
 * same two-sided approach mechanics as Limit Explorer — the values
 * still converge, even though the function itself has a gap.
 */
export function HolePanel() {
  return (
    <div className="flex flex-col gap-4">
      <TwoSidedApproachPanel
        segments={[
          { evaluate: holeFunction, from: HOLE_DOMAIN_MIN, to: HOLE_TARGET },
          { evaluate: holeFunction, from: HOLE_TARGET, to: HOLE_DOMAIN_MAX },
        ]}
        markers={[{ x: HOLE_TARGET, y: HOLE_VALUE, kind: "open" }]}
        evaluateLeft={holeFunction}
        evaluateRight={holeFunction}
        target={HOLE_TARGET}
        latex="f(x) = \dfrac{x^2 - 4}{x - 2}"
      />
      <p className="rounded-card border border-line bg-white/60 px-4 py-3 text-sm leading-relaxed text-ink dark:border-line-dark dark:bg-white/[0.03] dark:text-bone">
        The open circle at ({formatValue(HOLE_TARGET)}, {formatValue(HOLE_VALUE)}) is the <strong>hole</strong> — a
        missing point where the function is undefined. The values still approach {formatValue(HOLE_VALUE)} even
        though the function is missing at that exact point.
      </p>
    </div>
  );
}
