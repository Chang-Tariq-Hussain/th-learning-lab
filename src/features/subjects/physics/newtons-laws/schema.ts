import type { ParameterSchema } from "@/features/simulation";
import { GRAVITY_PRESETS, OBJECT_PRESETS, SURFACE_PRESETS } from "./physics";

/**
 * One schema for the whole lab, the same way `projectile-motion/schema.ts`
 * declares every control up front rather than swapping schemas per mode
 * — `SimulationContainer` only accepts a single schema, and Law 1/2
 * genuinely share state (the same cart), so splitting the schema per law
 * would just recreate the sync problem `cart-engine.ts` already solves
 * cleanly. Each Law tab renders only the `ParameterSlider`/
 * `ParameterDropdownSelector` instances relevant to it.
 */
export const newtonsLawsSchema: ParameterSchema = {
  numeric: [
    // --- Law 1 & 2 (cart) ---
    {
      key: "mass",
      label: "Mass",
      description: "Mass of the object on the cart.",
      unit: "kg",
      min: 1,
      max: 30,
      step: 0.5,
      defaultValue: 5,
    },
    {
      key: "appliedForce",
      label: "Applied force",
      description: "Magnitude of the push, while it's switched on.",
      unit: "N",
      min: 0,
      max: 200,
      step: 5,
      defaultValue: 50,
    },
    {
      key: "frictionCoefficient",
      label: "Custom friction coefficient",
      description: "Used only when Surface is set to Custom.",
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 0.35,
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

    // --- Law 3: skaters / collision (shared mass sliders) ---
    {
      key: "massA",
      label: "Mass A",
      description: "Skater A / Ball A.",
      unit: "kg",
      min: 1,
      max: 120,
      step: 1,
      defaultValue: 60,
    },
    {
      key: "massB",
      label: "Mass B",
      description: "Skater B / Ball B.",
      unit: "kg",
      min: 1,
      max: 120,
      step: 1,
      defaultValue: 60,
    },

    // --- Law 3: collision-only ---
    {
      key: "speedA",
      label: "Ball A launch speed",
      unit: "m/s",
      min: 0.5,
      max: 10,
      step: 0.1,
      defaultValue: 4,
    },
    {
      key: "restitution",
      label: "Restitution (bounciness)",
      description:
        "1 = perfectly elastic (no energy lost), 0 = perfectly inelastic (balls stick together).",
      min: 0,
      max: 1,
      step: 0.05,
      defaultValue: 1,
    },

    // --- Law 3: rocket/balloon-only ---
    {
      key: "thrust",
      label: "Thrust",
      unit: "N",
      min: 1,
      max: 50,
      step: 1,
      defaultValue: 15,
    },

    // --- Law 3: spring-only ---
    {
      key: "springStiffness",
      label: "Spring stiffness (k)",
      unit: "N/m",
      min: 20,
      max: 300,
      step: 5,
      defaultValue: 120,
    },
    {
      key: "compression",
      label: "Compression",
      unit: "m",
      min: 0.1,
      max: 1.2,
      step: 0.05,
      defaultValue: 0.6,
    },
  ],
  select: [
    {
      key: "gravityPreset",
      label: "Gravity",
      defaultValue: "earth",
      options: GRAVITY_PRESETS.map((p) => ({ label: p.label, value: p.key })),
    },
    {
      key: "surface",
      label: "Surface",
      defaultValue: "wood",
      options: SURFACE_PRESETS.map((s) => ({ label: s.label, value: s.key })),
    },
    {
      key: "frictionEnabled",
      label: "Friction",
      defaultValue: "on",
      options: [
        { label: "On", value: "on" },
        { label: "Off", value: "off" },
      ],
    },
    {
      key: "objectPreset",
      label: "Object",
      defaultValue: "box",
      options: OBJECT_PRESETS.map((o) => ({ label: o.label, value: o.key })),
    },
  ],
};

export function findNumericParam(key: string) {
  const param = newtonsLawsSchema.numeric?.find((p) => p.key === key);
  if (!param) throw new Error(`Unknown numeric parameter: ${key}`);
  return param;
}

export function findSelectParam(key: string) {
  const param = newtonsLawsSchema.select?.find((p) => p.key === key);
  if (!param) throw new Error(`Unknown select parameter: ${key}`);
  return param;
}
