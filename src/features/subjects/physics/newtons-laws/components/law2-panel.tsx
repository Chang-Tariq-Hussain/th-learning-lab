"use client";

import { Button } from "@/components/ui/button";
import {
  ControlPanel,
  ParameterDropdownSelector,
  ParameterSlider,
  ToggleSwitch,
  useSimulation,
} from "@/features/simulation";
import type { CartEngine } from "../cart-engine";
import type { CartReadouts } from "../physics";
import { newtonsLawsSchema } from "../schema";

const massParam = newtonsLawsSchema.numeric!.find((p) => p.key === "mass")!;
const appliedForceParam = newtonsLawsSchema.numeric!.find(
  (p) => p.key === "appliedForce",
)!;
const surfaceSelect = newtonsLawsSchema.select!.find(
  (p) => p.key === "surface",
)!;
const frictionCoefficientParam = newtonsLawsSchema.numeric!.find(
  (p) => p.key === "frictionCoefficient",
)!;

export interface Law2PanelProps {
  engine: CartEngine;
  forceOn: boolean;
  readouts: CartReadouts;
}

export function Law2Panel({ engine, forceOn, readouts }: Law2PanelProps) {
  const { values, setSelect } = useSimulation();
  const surface = String(values.surface ?? "wood");
  const frictionOn = values.frictionEnabled !== "off";

  return (
    <div className="flex flex-col gap-4">
      <ControlPanel title="Law 2 — F = ma">
        <ParameterSlider parameter={massParam} />
        <ParameterSlider parameter={appliedForceParam} />
        <ParameterDropdownSelector parameter={surfaceSelect} />
        {surface === "custom" ? (
          <ParameterSlider parameter={frictionCoefficientParam} />
        ) : null}
        <ToggleSwitch
          label="Friction"
          checked={frictionOn}
          onChange={(checked) =>
            setSelect("frictionEnabled", checked ? "on" : "off")
          }
        />

        <div className="flex gap-2 border-t border-line pt-3 dark:border-line-dark">
          <Button
            size="sm"
            onClick={() => engine.setForceOn(true)}
            disabled={forceOn}
          >
            Apply force
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => engine.setForceOn(false)}
            disabled={!forceOn}
          >
            Remove force
          </Button>
        </div>
      </ControlPanel>

      <div className="rounded-lg border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
        <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft dark:text-bone-soft">
          Live calculation
        </p>
        <p className="font-mono text-lg text-ink dark:text-bone">
          {readouts.netForce.toFixed(1)} N ÷ {readouts.mass.toFixed(1)} kg ={" "}
          {readouts.acceleration.toFixed(2)} m/s²
        </p>
      </div>

      <div className="rounded-lg border border-dashed border-pine-500/40 bg-pine-50 p-4 text-sm leading-relaxed text-pine-900 dark:border-pine-300/25 dark:bg-pine-900/20 dark:text-pine-50">
        <p className="mb-2 font-medium">F = ma, made concrete</p>
        <p>
          Net force (applied force minus friction) equals mass times
          acceleration. Hold the force fixed and raise the mass slider —
          acceleration drops. Hold the mass fixed and raise the force —
          acceleration climbs proportionally. The graphs below make both
          relationships visible at once: a straight line for force vs.
          acceleration, a curve for mass vs. acceleration.
        </p>
      </div>
    </div>
  );
}
