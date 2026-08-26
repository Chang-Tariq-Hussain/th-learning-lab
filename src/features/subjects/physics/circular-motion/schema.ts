import type { ParameterSchema } from "@/features/simulation";

/**
 * Declarative parameter list for Circular Motion, in the shape the
 * simulation framework expects (mirrors `projectile-motion/schema.ts`).
 * Three controls are all uniform circular motion needs: radius and
 * speed fully determine the motion's shape (ω, T, f, a_c); mass only
 * scales the centripetal *force* readout, never the acceleration or
 * the path itself — which is itself a teaching point this topic's
 * Explore/Explain sections lean on directly.
 */
export const circularMotionSchema: ParameterSchema = {
  numeric: [
    {
      key: "radius",
      label: "Radius",
      description: "Radius of the circular path.",
      unit: "m",
      min: 0.5,
      max: 5,
      step: 0.1,
      defaultValue: 2,
    },
    {
      key: "speed",
      label: "Speed",
      description: "Constant tangential speed around the circle.",
      unit: "m/s",
      min: 0.5,
      max: 15,
      step: 0.1,
      defaultValue: 4,
    },
    {
      key: "mass",
      label: "Mass",
      description: "Affects the centripetal force readout only — the path and acceleration don't depend on mass.",
      unit: "kg",
      min: 0.5,
      max: 20,
      step: 0.5,
      defaultValue: 2,
    },
  ],
  select: [
    {
      key: "direction",
      label: "Direction",
      description: "Which way the object travels around the circle.",
      defaultValue: "ccw",
      options: [
        { label: "Counterclockwise", value: "ccw" },
        { label: "Clockwise", value: "cw" },
      ],
    },
  ],
};
