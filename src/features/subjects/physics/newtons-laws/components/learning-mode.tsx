"use client";

import { ControlPanel, useSimulation } from "@/features/simulation";
import { cn } from "@/lib/utils";
import { GraduationCap } from "lucide-react";
import { useState } from "react";
import type { Law3ScenarioKey } from "../physics";
import { learningScenarios } from "../scenarios";

export interface LearningModeProps {
  onSelectLaw: (law: 1 | 2 | 3) => void;
  onSelectLaw3Scenario: (key: Law3ScenarioKey) => void;
}

export function LearningMode({
  onSelectLaw,
  onSelectLaw3Scenario,
}: LearningModeProps) {
  const { setNumeric, setSelect, resetAll } = useSimulation();
  const [activeId, setActiveId] = useState<string | null>(null);

  const runScenario = (id: string) => {
    const scenario = learningScenarios.find((s) => s.id === id);
    if (!scenario) return;

    resetAll();
    onSelectLaw(scenario.law);
    if (scenario.law3Scenario) onSelectLaw3Scenario(scenario.law3Scenario);

    for (const [key, value] of Object.entries(scenario.patch)) {
      if (
        key === "surface" ||
        key === "gravityPreset" ||
        key === "frictionEnabled" ||
        key === "objectPreset"
      ) {
        setSelect(key, String(value));
      } else {
        setNumeric(key, Number(value));
      }
    }
    setActiveId(id);
  };

  const active = learningScenarios.find((s) => s.id === activeId);

  return (
    <ControlPanel title="Learning mode">
      <div className="flex items-start gap-2 text-sm text-ink-soft dark:text-bone-soft">
        <GraduationCap
          className="mt-0.5 h-4 w-4 shrink-0 text-pine-600 dark:text-pine-300"
          strokeWidth={1.75}
        />
        <p>
          Pick a question — it sets up the right law and parameters. You run the
          experiment.
        </p>
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
                : "border-line text-ink hover:border-ink/30 dark:border-line-dark dark:text-bone dark:hover:border-bone/30",
            )}
          >
            {scenario.question}
          </button>
        ))}
      </div>

      {active ? (
        <div
          role="status"
          className="flex flex-col gap-2 rounded-lg border border-dashed border-pine-500/40 bg-pine-50 p-3 text-sm leading-relaxed text-pine-900 dark:border-pine-300/25 dark:bg-pine-900/20 dark:text-pine-50"
        >
          <p>{active.explanation}</p>
          <p className="font-medium">{active.instruction}</p>
        </div>
      ) : null}
    </ControlPanel>
  );
}
