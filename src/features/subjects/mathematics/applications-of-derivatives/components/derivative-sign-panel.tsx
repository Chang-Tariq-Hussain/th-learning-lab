"use client";

import { useState } from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { FunctionGraph } from "../../calculus-foundations/components/function-graph";
import { XSlider } from "../../calculus-foundations/components/x-slider";
import { SimulationLayout } from "@/features/simulation";
import { ExampleSelector } from "./example-selector";
import { SignBadge } from "./sign-badge";
import {
  APP_FUNCTIONS,
  buildColoredDerivativeSegments,
  buildColoredSegments,
  getAppFunction,
  type AppFunctionDef,
} from "../applications-model";

/**
 * Level 2 — Derivative Sign. Two synchronized, stacked `FunctionGraph`
 * instances driven by one shared x: f(x) on top, f'(x) below. Both use
 * the same `buildColoredSegments`/`buildColoredDerivativeSegments`
 * coloring so a green/red region on top always lines up with the
 * matching region on the bottom, and the bottom graph's tracked point
 * sits above/below its own zero line exactly when the top curve is
 * rising/falling.
 */
export function DerivativeSignPanel() {
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

  const handleDrag = (nextX: number) => setX(Math.min(fn.domainMax, Math.max(fn.domainMin, nextX)));

  return (
    <SimulationLayout
      stageLabel="Function and derivative graphs"
      aspect={2}
      stageCap="24rem"
      stage={
        <div className="grid h-full grid-cols-2 gap-2">
          <div className="flex min-h-0 flex-col items-center gap-1">
            <p className="font-mono text-label uppercase text-ink-soft dark:text-bone-soft">f(x)</p>
            <div className="min-h-0 w-full flex-1">
              <FunctionGraph
                segments={buildColoredSegments(fn)}
                trackedPoint={{ x, y }}
                onDragTrackedPointX={handleDrag}
                ariaLabel="The original function's graph."
              />
            </div>
          </div>

          <div className="flex min-h-0 flex-col items-center gap-1">
            <p className="font-mono text-label uppercase text-ink-soft dark:text-bone-soft">f&apos;(x)</p>
            <div className="min-h-0 w-full flex-1">
              <FunctionGraph
                segments={buildColoredDerivativeSegments(fn)}
                trackedPoint={{ x, y: slope, label: `f'(${x.toFixed(1)}) = ${slope.toFixed(2)}` }}
                onDragTrackedPointX={handleDrag}
                ariaLabel="The derivative's graph."
              />
            </div>
          </div>
        </div>
      }
      readouts={<SignBadge slope={slope} />}
      controls={
        <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-5">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <ExampleSelector value={fnId} onChange={handleFnChange} />
            <BlockMath math={fn.latex} />
          </div>

          <BlockMath math={fn.derivativeLatex} />

          <XSlider value={x} onChange={setX} min={fn.domainMin} max={fn.domainMax} />
        </div>
      }
    />
  );
}
