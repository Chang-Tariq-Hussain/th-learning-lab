"use client";

import {
  ControlPanel,
  ParameterDropdownSelector,
  ParameterSlider,
  ToggleSwitch,
  useSimulation,
} from "@/features/simulation";
import type { CartReadouts } from "../physics";
import { newtonsLawsSchema } from "../schema";

const massParam = newtonsLawsSchema.numeric!.find((p) => p.key === "mass")!;
const maxPushForceParam = newtonsLawsSchema.numeric!.find(
  (p) => p.key === "maxPushForce",
)!;
const surfaceSelect = newtonsLawsSchema.select!.find(
  (p) => p.key === "surface",
)!;
const frictionCoefficientParam = newtonsLawsSchema.numeric!.find(
  (p) => p.key === "frictionCoefficient",
)!;

export interface Law2PanelProps {
  readouts: CartReadouts;
}

export function Law2Panel({ readouts }: Law2PanelProps) {
  const { values, setSelect } = useSimulation();
  const surface = String(values.surface ?? "wood");
  const frictionOn = values.frictionEnabled !== "off";

  return (
    <div className="flex flex-col gap-4">
      <ControlPanel title="Law 2 — F = ma">
        <ParameterSlider parameter={massParam} />
        <ParameterSlider parameter={maxPushForceParam} />
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

        {/* Live readouts for the two people — dragging them in the scene
            above is the primary control, so these are values, not
            another pair of sliders. */}
        <div className="flex gap-3 border-t border-line pt-3 text-sm dark:border-line-dark">
          <div className="flex-1">
            <div className="text-ink-soft dark:text-bone-soft">
              Left person force
            </div>
            <div className="font-mono text-base font-semibold text-ink dark:text-bone">
              {readouts.leftForce.toFixed(0)} N
            </div>
          </div>
          <div className="flex-1">
            <div className="text-ink-soft dark:text-bone-soft">
              Right person force
            </div>
            <div className="font-mono text-base font-semibold text-ink dark:text-bone">
              {readouts.rightForce.toFixed(0)} N
            </div>
          </div>
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
          Net force (left push minus right push minus friction) equals mass
          times acceleration. Hold the leans fixed and raise the mass slider —
          acceleration drops. Drag a person in further and — mass held fixed —
          acceleration climbs proportionally. The graphs below make both
          relationships visible at once: a straight line for force vs.
          acceleration, a curve for mass vs. acceleration.
        </p>
      </div>
    </div>
  );
}
