"use client";

import { useState } from "react";
import { LevelNav } from "../calculus-foundations/components/level-nav";
import { QuizPanel } from "../statistics-foundations/components/quiz-panel";
import { PerimeterVsAreaPanel } from "./components/perimeter-vs-area-panel";
import { PerimeterCountingPanel } from "./components/perimeter-counting-panel";
import { PerimeterFormulaPanel } from "./components/perimeter-formula-panel";
import { AreaUnitSquaresPanel } from "./components/area-unit-squares-panel";
import { AreaFormulaPanel } from "./components/area-formula-panel";
import { InteractiveRectanglePanel } from "./components/interactive-rectangle-panel";
import { SquarePanel } from "./components/square-panel";
import { TrianglePanel } from "./components/triangle-panel";
import { ComparisonGrid } from "./components/comparison-grid";
import { CompositeShapePanel } from "./components/composite-shape-panel";
import { RealWorldPanel } from "./components/real-world-panel";
import {
  CHALLENGE_QUESTIONS,
  SAME_AREA_BEST_INDEX,
  SAME_AREA_OPTIONS,
  SAME_AREA_VALUE,
  SAME_PERIMETER_BEST_INDEX,
  SAME_PERIMETER_OPTIONS,
  SAME_PERIMETER_VALUE,
} from "./perimeter-area-model";

interface Level {
  label: string;
  title: string;
  subtitle: string;
}

const LEVELS: Level[] = [
  { label: "Level 1", title: "Perimeter vs Area", subtitle: "Perimeter measures the distance around. Area measures the surface inside." },
  { label: "Level 2", title: "Perimeter by Counting", subtitle: "Count around the boundary before seeing the formula." },
  { label: "Level 3", title: "Perimeter Formula", subtitle: "l + w + l + w becomes 2(l + w)." },
  { label: "Level 4", title: "Area with Unit Squares", subtitle: "Count equal-sized squares covering a surface." },
  { label: "Level 5", title: "Area Formula", subtitle: "Number of squares = length × width." },
  { label: "Level 6", title: "Interactive Rectangle", subtitle: "Resize a rectangle and watch perimeter and area update live." },
  { label: "Level 7", title: "Square", subtitle: "A rectangle where every side is the same length." },
  { label: "Level 8", title: "Triangle", subtitle: "Perimeter is just the sum of the three sides." },
  { label: "Level 9", title: "Same Perimeter, Different Area", subtitle: "Equal perimeters can enclose very different areas." },
  { label: "Level 10", title: "Same Area, Different Perimeter", subtitle: "Equal areas can have very different perimeters." },
  { label: "Level 11", title: "Composite Shape", subtitle: "Split an L-shape into rectangles to find its area." },
  { label: "Level 12", title: "Real-World Applications", subtitle: "Fencing, flooring, and knowing which measure you actually need." },
  { label: "Level 13", title: "Practice", subtitle: "Eight quick questions to check what stuck." },
];

/**
 * Perimeter & Area Explorer — Measuring 2D Shapes.
 *
 * Thirteen self-paced levels building PERIMETER and AREA together, as
 * the brief asks, since students need the contrast between them more
 * than either concept alone. Reuses Calculus Foundations' `LevelNav`
 * and Statistics Foundations' `QuizPanel` directly — the same
 * cross-topic sharing Measurement Explorer already established — and
 * every shape renders through the one `RectShape` primitive rather
 * than each level drawing its own rectangle. No volume, surface area,
 * circles, or coordinate geometry here — those are separate
 * simulations.
 */
export function PerimeterAreaExplorer() {
  const [step, setStep] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  const level = LEVELS[step]!;

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">{level.label}</p>
        <h2 className="mt-1 font-display text-2xl font-medium text-ink dark:text-bone">{level.title}</h2>
        <p className="mx-auto mt-1 max-w-xl text-sm text-ink-soft dark:text-bone-soft">{level.subtitle}</p>
      </div>

      <div className="min-h-[420px]">
        {step === 0 ? <PerimeterVsAreaPanel key={resetKey} /> : null}
        {step === 1 ? <PerimeterCountingPanel key={resetKey} /> : null}
        {step === 2 ? <PerimeterFormulaPanel key={resetKey} /> : null}
        {step === 3 ? <AreaUnitSquaresPanel key={resetKey} /> : null}
        {step === 4 ? <AreaFormulaPanel key={resetKey} /> : null}
        {step === 5 ? <InteractiveRectanglePanel key={resetKey} /> : null}
        {step === 6 ? <SquarePanel key={resetKey} /> : null}
        {step === 7 ? <TrianglePanel key={resetKey} /> : null}

        {step === 8 ? (
          <ComparisonGrid
            key={resetKey}
            options={SAME_PERIMETER_OPTIONS}
            fixedMeasure="perimeter"
            fixedValue={SAME_PERIMETER_VALUE}
            question="Which rectangle has the greatest area?"
            bestIndex={SAME_PERIMETER_BEST_INDEX}
            bestReason="5 × 5 has the greatest area (25) — of all rectangles with a fixed perimeter, the one closest to a square encloses the most area."
          />
        ) : null}

        {step === 9 ? (
          <ComparisonGrid
            key={resetKey}
            options={SAME_AREA_OPTIONS}
            fixedMeasure="area"
            fixedValue={SAME_AREA_VALUE}
            question="Which rectangle has the smallest perimeter?"
            bestIndex={SAME_AREA_BEST_INDEX}
            bestReason="4 × 6 has the smallest perimeter (20) — of all rectangles with a fixed area, the one closest to a square uses the least boundary."
          />
        ) : null}

        {step === 10 ? <CompositeShapePanel key={resetKey} /> : null}
        {step === 11 ? <RealWorldPanel key={resetKey} /> : null}
        {step === 12 ? <QuizPanel key={resetKey} questions={CHALLENGE_QUESTIONS} restartLabel="Restart Practice" /> : null}
      </div>

      <LevelNav
        stepIndex={step}
        totalSteps={LEVELS.length}
        onBack={() => setStep((s) => Math.max(0, s - 1))}
        onNext={() => setStep((s) => Math.min(LEVELS.length - 1, s + 1))}
        onReset={() => setResetKey((k) => k + 1)}
        onJump={setStep}
      />
    </div>
  );
}
