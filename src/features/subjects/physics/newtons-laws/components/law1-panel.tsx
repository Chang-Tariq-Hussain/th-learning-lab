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
import { newtonsLawsSchema } from "../schema";
import type { CartDisplayOptions } from "./cart-canvas";

const massParam = newtonsLawsSchema.numeric!.find((p) => p.key === "mass")!;
const appliedForceParam = newtonsLawsSchema.numeric!.find(
  (p) => p.key === "appliedForce",
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
  forceOn: boolean;
  viewOptions: CartDisplayOptions;
  onViewOptionsChange: (next: CartDisplayOptions) => void;
}

export function Law1Panel({
  engine,
  forceOn,
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
        <ParameterSlider parameter={appliedForceParam} />

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
          at constant velocity, unless an unbalanced force acts on it. Apply a
          force and the cart accelerates; remove it and — with friction off —
          the cart coasts forever at whatever velocity it had. Turn friction
          back on and that same coast slows to a stop, not because the cart
          &ldquo;wants&rdquo; to stop, but because friction is an outside unbalanced force
          opposing the motion. The free-body diagram shows exactly this: when
          Applied and Friction arrows are equal and opposite, the cart neither
          speeds up nor slows down.
        </p>
      </div>
    </div>
  );
}
