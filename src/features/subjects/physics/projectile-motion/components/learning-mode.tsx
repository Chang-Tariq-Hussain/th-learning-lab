"use client";

import { useState } from "react";
import { GraduationCap } from "lucide-react";
import { ControlPanel, useSimulation } from "@/features/simulation";
import { cn } from "@/lib/utils";
import { learningScenarios } from "../learning-scenarios";

export function LearningMode() {
  const { setNumeric, setSelect, resetAll, play } = useSimulation();
  const [activeId, setActiveId] = useState<string | null>(null);

  const runScenario = (id: string) => {
    const scenario = learningScenarios.find((s) => s.id === id);
    if (!scenario) return;
    resetAll();
    if (scenario.apply.speed !== undefined) setNumeric("speed", scenario.apply.speed);
    if (scenario.apply.angleDeg !== undefined) setNumeric("angleDeg", scenario.apply.angleDeg);
    if (scenario.apply.customGravity !== undefined)
      setNumeric("customGravity", scenario.apply.customGravity);
    if (scenario.apply.gravityPreset !== undefined)
      setSelect("gravityPreset", scenario.apply.gravityPreset);
    if (scenario.apply.airResistance !== undefined)
      setSelect("airResistance", scenario.apply.airResistance);
    setActiveId(id);
    // Give React a tick to commit the new parameter values before firing the animation.
    requestAnimationFrame(() => play());
  };

  const active = learningScenarios.find((s) => s.id === activeId);

  return (
    <ControlPanel title="Learning mode">
      <div className="flex items-start gap-2 text-sm text-ink-soft dark:text-bone-soft">
        <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-pine-600 dark:text-pine-300" strokeWidth={1.75} />
        <p>Pick a question — it sets up the simulation and launches automatically.</p>
      </div>

      <div className="flex flex-col gap-2">
        {learningScenarios.map((scenario) => (
          <button
            key={scenario.id}
            type="button"
            onClick={() => runScenario(scenario.id)}
            className={cn(
              "rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
              activeId === scenario.id
                ? "border-pine-500 bg-pine-50 text-pine-900 dark:border-pine-300 dark:bg-pine-900/30 dark:text-pine-50"
                : "border-line text-ink hover:border-ink/30 dark:border-line-dark dark:text-bone dark:hover:border-bone/30"
            )}
          >
            {scenario.question}
          </button>
        ))}
      </div>

      {active ? (
        <div
          role="status"
          className="rounded-lg border border-dashed border-pine-500/40 bg-pine-50 p-3 text-sm leading-relaxed text-pine-900 dark:border-pine-300/25 dark:bg-pine-900/20 dark:text-pine-50"
        >
          {active.explanation}
        </div>
      ) : null}
    </ControlPanel>
  );
}
