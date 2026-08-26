"use client";

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
import type { CartDisplayOptions } from "./cart-canvas";

const massParam = newtonsLawsSchema.numeric!.find((p) => p.key === "mass")!;
const maxPushForceParam = newtonsLawsSchema.numeric!.find(
  (p) => p.key === "maxPushForce",
)!;
const frictionCoefficientParam = newtonsLawsSchema.numeric!.find(
  (p) => p.key === "frictionCoefficient",
)!;
const surfaceSelect = newtonsLawsSchema.select!.find(
  (p) => p.key === "surface",
)!;
const objectSelect = newtonsLawsSchema.select!.find(
  (p) => p.key === "objectPreset",
)!;

export interface Law1PanelProps {
  engine: CartEngine;
  readouts: CartReadouts;
  viewOptions: CartDisplayOptions;
  onViewOptionsChange: (next: CartDisplayOptions) => void;
}

export function Law1Panel({
  engine,
  readouts,
  viewOptions,
  onViewOptionsChange,
}: Law1PanelProps) {
  const { values, setSelect } = useSimulation();
  const frictionOn = values.frictionEnabled !== "off";
  const surface = String(values.surface ?? "wood");

  return (
    <div className="flex flex-col gap-4">
      <ControlPanel title="Law 1 — Inertia">
        <ParameterDropdownSelector parameter={objectSelect} />
        <ParameterSlider parameter={massParam} />
        <ParameterDropdownSelector parameter={surfaceSelect} />
        {surface === "custom" ? (
          <ParameterSlider parameter={frictionCoefficientParam} />
        ) : null}
        <ToggleSwitch
          label="Friction"
          description="Turn friction off to see an object keep moving forever once pushed."
          checked={frictionOn}
          onChange={(checked) =>
            setSelect("frictionEnabled", checked ? "on" : "off")
          }
        />
        <ParameterSlider parameter={maxPushForceParam} />

        {/* Live readouts for the two people — the primary interaction is
            dragging them in the scene above, so these are values, not
            another pair of sliders. */}
        <div className="flex gap-3 border-t border-line pt-3 text-sm dark:border-line-dark">
          <div className="flex-1">
            <div className="text-ink-soft dark:text-bone-soft">
              Left person {engine.leftMode === "push" ? "push" : "pull"}
            </div>
            <div className="font-mono text-base font-semibold text-ink dark:text-bone">
              {readouts.leftForce.toFixed(0)} N
            </div>
          </div>
          <div className="flex-1">
            <div className="text-ink-soft dark:text-bone-soft">
              Right person {engine.rightMode === "push" ? "push" : "pull"}
            </div>
            <div className="font-mono text-base font-semibold text-ink dark:text-bone">
              {readouts.rightForce.toFixed(0)} N
            </div>
          </div>
        </div>
      </ControlPanel>

      <ControlPanel title="Visualization">
        <ToggleSwitch
          label="Show vectors"
          checked={viewOptions.showVectors}
          onChange={(v) =>
            onViewOptionsChange({ ...viewOptions, showVectors: v })
          }
        />
        <ToggleSwitch
          label="Show force labels"
          checked={viewOptions.showForceLabels}
          onChange={(v) =>
            onViewOptionsChange({ ...viewOptions, showForceLabels: v })
          }
        />
        <ToggleSwitch
          label="Free-body diagram"
          checked={viewOptions.showFreeBody}
          onChange={(v) =>
            onViewOptionsChange({ ...viewOptions, showFreeBody: v })
          }
        />
      </ControlPanel>

      <div className="rounded-lg border border-dashed border-pine-500/40 bg-pine-50 p-4 text-sm leading-relaxed text-pine-900 dark:border-pine-300/25 dark:bg-pine-900/20 dark:text-pine-50">
        <p className="mb-2 font-medium">Inertia, visually</p>
        <p>
          An object at rest stays at rest, and an object in motion keeps moving
          at constant velocity, unless an unbalanced force acts on it. Drag one
          person in and the box accelerates; let go and — with friction off —
          the box coasts forever at whatever velocity it had. Turn friction
          back on and that same coast slows to a stop, not because the box
          &ldquo;wants&rdquo; to stop, but because friction is an outside unbalanced force
          opposing the motion. The free-body diagram shows exactly this: when
          the two pushes and friction sum to zero, the box neither speeds up
          nor slows down.
        </p>
      </div>
    </div>
  );
}
