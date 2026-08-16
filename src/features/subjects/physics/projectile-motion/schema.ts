import type { ParameterSchema } from "@/features/simulation";
import { GRAVITY_PRESETS } from "./physics";

/**
 * Declarative parameter list for Projectile Motion, in the shape the
 * simulation framework expects. `ParameterSlider` / `ParameterDropdownSelector`
 * render directly from these definitions — no simulation-specific control
 * components were written for this simulation.
 */
export const projectileSchema: ParameterSchema = {
  numeric: [
    {
      key: "speed",
      label: "Launch velocity",
      description: "Initial speed of the projectile at launch.",
      unit: "m/s",
      min: 0,
      max: 100,
      step: 1,
      defaultValue: 25,
    },
    {
      key: "angleDeg",
      label: "Launch angle",
      description: "Angle above the horizontal.",
      unit: "°",
      min: 0,
      max: 90,
      step: 1,
      defaultValue: 45,
    },
    {
      key: "customGravity",
      label: "Custom gravity",
      description: "Used only when Gravity is set to Custom.",
      unit: "m/s²",
      min: 0.5,
      max: 30,
      step: 0.1,
      defaultValue: 9.81,
    },
    {
      key: "mass",
      label: "Mass",
      description: "Affects potential and kinetic energy readouts only — trajectory shape is mass-independent.",
      unit: "kg",
      min: 0.1,
      max: 20,
      step: 0.1,
      defaultValue: 1,
    },
  ],
  select: [
    {
      key: "gravityPreset",
      label: "Gravity",
      description: "Pick a world, or Custom to set your own value.",
      defaultValue: "earth",
      options: GRAVITY_PRESETS.map((p) => ({ label: p.label, value: p.key })),
    },
    {
      key: "airResistance",
      label: "Air resistance",
      description: "Adds velocity-squared drag; range and height are no longer given by the closed-form equations.",
      defaultValue: "off",
      options: [
        { label: "Off", value: "off" },
        { label: "On", value: "on" },
      ],
    },
  ],
};

export const DEFAULT_DRAG_COEFFICIENT = 0.02;
