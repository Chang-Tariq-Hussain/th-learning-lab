"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { XSlider } from "../../calculus-foundations/components/x-slider";
import { ExampleSelector } from "./example-selector";
import { ChainStepsPanel } from "./chain-steps-panel";
import { FollowChainPanel } from "./follow-chain-panel";
import { GraphConnectionPanel } from "./graph-connection-panel";
import { COMPOSITE_FUNCTIONS, getComposite, type CompositeFunctionDef } from "../chain-rule-model";

type View = "steps" | "chain" | "graph";

const VIEWS: { id: View; label: string }[] = [
  { id: "steps", label: "Chain Rule Steps" },
  { id: "chain", label: "Follow the Chain" },
  { id: "graph", label: "On the Graph" },
];

/**
 * Level 3 — Basic Chain Rule. Ties together Section 3 (the step-by-step
 * derivation), Section 4 (Follow the Chain), Section 5 (progressively
 * harder examples, via the shared example picker), and Section 9 (the
 * graph connection) behind one segmented control, so students explore
 * the same composite function three different ways without the level
 * turning into three separate levels.
 */
export function ChainRuleVisualPanel() {
  const [exampleId, setExampleId] = useState<CompositeFunctionDef["id"]>("a");
  const [view, setView] = useState<View>("steps");
  const fn = getComposite(exampleId);
  const [x, setX] = useState(fn.defaultX);

  const handleExampleChange = (id: CompositeFunctionDef["id"]) => {
    const next = COMPOSITE_FUNCTIONS.find((f) => f.id === id) ?? COMPOSITE_FUNCTIONS[0]!;
    setExampleId(id);
    setX(next.defaultX);
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6">
      <ExampleSelector value={exampleId} onChange={handleExampleChange} />

      <div className="flex flex-wrap justify-center gap-2">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setView(v.id)}
            aria-pressed={view === v.id}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              view === v.id
                ? "border-subject-math bg-subject-math-soft text-subject-math dark:bg-subject-math/15"
                : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft"
            )}
          >
            {v.label}
          </button>
        ))}
      </div>

      {view === "steps" ? <ChainStepsPanel fn={fn} /> : null}

      {view === "chain" ? (
        <div className="flex w-full flex-col items-center gap-5">
          <XSlider value={x} onChange={setX} min={fn.domainMin} max={fn.domainMax} />
          <FollowChainPanel fn={fn} x={x} />
        </div>
      ) : null}

      {view === "graph" ? <GraphConnectionPanel fn={fn} x={x} onXChange={setX} /> : null}
    </div>
  );
}
