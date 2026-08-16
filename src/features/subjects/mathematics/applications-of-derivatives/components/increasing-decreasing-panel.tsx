"use client";

import { useState } from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { FunctionGraph } from "../../calculus-foundations/components/function-graph";
import { XSlider } from "../../calculus-foundations/components/x-slider";
import { ExampleSelector } from "./example-selector";
import { SignBadge } from "./sign-badge";
import { APP_FUNCTIONS, buildColoredSegments, formatValue, getAppFunction, type AppFunctionDef } from "../applications-model";

/**
 * Level 1 — Increasing and Decreasing. A single function graph, colored
 * green where f'(x) > 0 and red where f'(x) < 0 via
 * `buildColoredSegments`, with a draggable point (also movable by
 * slider) whose sign badge updates live as the student drags across
 * the curve. Includes the "Movable Function Explorer" (Section 9)
 * selector so students can compare all three predefined functions.
 */
export function IncreasingDecreasingPanel() {
  const [fnId, setFnId] = useState<AppFunctionDef["id"]>("x2");
  const fn = getAppFunction(fnId);
  const [x, setX] = useState(fn.defaultX);

  const handleFnChange = (id: AppFunctionDef["id"]) => {
    const next = APP_FUNCTIONS.find((f) => f.id === id) ?? APP_FUNCTIONS[0]!;
    setFnId(id);
    setX(next.defaultX);
  };

  const y = fn.evaluate(x);
  const slope = fn.derivative(x);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-5">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <ExampleSelector value={fnId} onChange={handleFnChange} />
        <BlockMath math={fn.latex} />
      </div>

      <div className="aspect-square w-full max-w-md">
        <FunctionGraph
          segments={buildColoredSegments(fn)}
          trackedPoint={{ x, y }}
          onDragTrackedPointX={(nextX) => setX(Math.min(fn.domainMax, Math.max(fn.domainMin, nextX)))}
          ariaLabel="The function's graph, colored green where increasing and red where decreasing, with a draggable point."
        />
      </div>

      <XSlider value={x} onChange={setX} min={fn.domainMin} max={fn.domainMax} />

      <SignBadge slope={slope} />

      <p className="max-w-md text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        Drag the point, at x = {formatValue(x)}, across the curve and watch the color and the badge change
        together.
      </p>
    </div>
  );
}
