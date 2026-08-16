"use client";

import { Button } from "@/components/ui/button";
import {
  ControlPanel,
  ParameterDropdownSelector,
  ParameterSlider,
  useSimulation,
} from "@/features/simulation";
import { cn } from "@/lib/utils";
import type { Law3Engine } from "../law3-engine";
import type { Law3ScenarioKey } from "../physics";
import { newtonsLawsSchema } from "../schema";

const massAParam = newtonsLawsSchema.numeric!.find((p) => p.key === "massA")!;
const massBParam = newtonsLawsSchema.numeric!.find((p) => p.key === "massB")!;
const massParam = newtonsLawsSchema.numeric!.find((p) => p.key === "mass")!;
const thrustParam = newtonsLawsSchema.numeric!.find((p) => p.key === "thrust")!;
const speedAParam = newtonsLawsSchema.numeric!.find((p) => p.key === "speedA")!;
const restitutionParam = newtonsLawsSchema.numeric!.find(
  (p) => p.key === "restitution",
)!;
const springStiffnessParam = newtonsLawsSchema.numeric!.find(
  (p) => p.key === "springStiffness",
)!;
const compressionParam = newtonsLawsSchema.numeric!.find(
  (p) => p.key === "compression",
)!;
const surfaceSelect = newtonsLawsSchema.select!.find(
  (p) => p.key === "surface",
)!;

const SCENARIOS: { key: Law3ScenarioKey; label: string }[] = [
  { key: "skaters", label: "Skaters" },
  { key: "rocket", label: "Rocket" },
  { key: "balloon", label: "Balloon" },
  { key: "collision", label: "Collision" },
  { key: "spring", label: "Spring launch" },
];

const EXPLANATIONS: Record<Law3ScenarioKey, string> = {
  skaters:
    "Skater A pushes skater B; B pushes back on A with equal magnitude, opposite direction — simultaneously, not as a delayed response. Since the forces act on two different people, they don't cancel: both skaters end up moving, in opposite directions, with equal and opposite momentum.",
  rocket:
    "A rocket pushes exhaust gas backward (action); the gas pushes the rocket forward with equal force (reaction). Watch the rocket accelerate forward the whole time thrust is on — the two forces act on different masses (rocket vs. exhaust), so nothing cancels.",
  balloon:
    "A balloon rocket works identically to a real rocket, just with air instead of combustion exhaust: air rushes out one end (action), the balloon is pushed the other way (reaction) with exactly equal force.",
  collision:
    "During the collision, ball A exerts a force on ball B and B exerts an equal, opposite force on A — for the brief instant they're in contact. Total momentum immediately before and after is conserved either way; try restitution = 1 (elastic, no energy lost) vs. 0 (inelastic, balls stick and move together).",
  spring:
    "A compressed spring pushes the cart away (action) and the cart's inertia pushes back on the spring (reaction) with equal force. All the spring's stored potential energy converts into the cart's kinetic energy as it releases.",
};

export interface Law3PanelProps {
  engine: Law3Engine;
}

function actionLabel(engine: Law3Engine): string {
  const rig = engine.rig;
  switch (rig.kind) {
    case "skaters":
      return "Push apart";
    case "rocket":
      return rig.state.thrustOn ? "Stop thrust" : "Fire thrust";
    case "balloon":
      return rig.state.thrustOn ? "Stop release" : "Release balloon";
    case "collision":
      return "Launch";
    case "spring":
      return rig.released ? "Reset spring" : "Release";
  }
}

export function Law3Panel({ engine }: Law3PanelProps) {
  const { values } = useSimulation();
  const surface = String(values.surface ?? "wood");
  const rig = engine.rig;

  return (
    <div className="flex flex-col gap-4">
      <ControlPanel title="Law 3 — Action & Reaction">
        <div
          role="tablist"
          aria-label="Law 3 scenario"
          className="flex flex-wrap gap-1.5"
        >
          {SCENARIOS.map((s) => (
            <button
              key={s.key}
              type="button"
              role="tab"
              aria-selected={engine.scenario === s.key}
              onClick={() => engine.setScenario(s.key)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                engine.scenario === s.key
                  ? "bg-pine-600 text-paper dark:bg-pine-300 dark:text-chalkboard"
                  : "border border-line text-ink-soft hover:text-ink dark:border-line-dark dark:text-bone-soft dark:hover:text-bone",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-line pt-3 dark:border-line-dark">
          {rig.kind === "skaters" ? (
            <>
              <ParameterSlider parameter={massAParam} />
              <ParameterSlider parameter={massBParam} />
            </>
          ) : null}

          {rig.kind === "rocket" || rig.kind === "balloon" ? (
            <>
              <ParameterSlider parameter={massParam} />
              <ParameterSlider parameter={thrustParam} />
              <ParameterDropdownSelector parameter={surfaceSelect} />
            </>
          ) : null}

          {rig.kind === "collision" ? (
            <>
              <ParameterSlider parameter={massAParam} />
              <ParameterSlider parameter={massBParam} />
              <ParameterSlider parameter={speedAParam} />
              <ParameterSlider parameter={restitutionParam} />
            </>
          ) : null}

          {rig.kind === "spring" ? (
            <>
              <ParameterSlider parameter={massParam} />
              <ParameterSlider parameter={springStiffnessParam} />
              <ParameterSlider parameter={compressionParam} />
            </>
          ) : null}
        </div>

        <div className="flex gap-2 border-t border-line pt-3 dark:border-line-dark">
          <Button size="sm" onClick={engine.primaryAction}>
            {actionLabel(engine)}
          </Button>
          <Button size="sm" variant="secondary" onClick={engine.reset}>
            Reset scenario
          </Button>
        </div>
      </ControlPanel>

      <div className="rounded-lg border border-dashed border-pine-500/40 bg-pine-50 p-4 text-sm leading-relaxed text-pine-900 dark:border-pine-300/25 dark:bg-pine-900/20 dark:text-pine-50">
        <p className="mb-2 font-medium">Action & reaction, this scenario</p>
        <p>{EXPLANATIONS[engine.scenario]}</p>
      </div>
    </div>
  );
}
