import type { ParameterSchema } from "@/features/simulation";

/**
 * One shared schema across Gravitation's three panels (Force Lab,
 * Orbit, Weight & Worlds) inside a single `SimulationContainer` — the
 * same "one container, multiple tabs with their own slice of the
 * schema" shape `NewtonsLaws` uses for its Law 1/2/3 tabs. Each panel
 * only renders the `ParameterSlider`s relevant to it; `values` holds
 * every parameter regardless of which tab is active, so switching
 * tabs never loses a setting.
 */
export const gravitationSchema: ParameterSchema = {
  numeric: [
    // --- Force Lab: real SI units, deliberately astronomical scale so
    // the resulting force is a legible number rather than the
    // vanishingly small value real G gives for everyday, kilogram-scale
    // masses. See `physics.ts`'s doc comment for why.
    {
      key: "mass1",
      label: "Mass 1",
      description: "First object's mass, in units of 10²⁴ kg (Earth ≈ 5.97).",
      unit: "×10²⁴ kg",
      min: 0.1,
      max: 20,
      step: 0.1,
      defaultValue: 5.97,
    },
    {
      key: "mass2",
      label: "Mass 2",
      description: "Second object's mass, in units of 10²⁴ kg.",
      unit: "×10²⁴ kg",
      min: 0.1,
      max: 20,
      step: 0.1,
      defaultValue: 1,
    },
    {
      key: "distance",
      label: "Distance",
      description: "Distance between the two objects' centers, in units of 10⁶ m (1,000 km).",
      unit: "×10⁶ m",
      min: 1,
      max: 50,
      step: 0.5,
      defaultValue: 10,
    },
    // --- Weight & Worlds: independent of Force Lab's masses, since this
    // panel is about one person/object's weight varying by location,
    // not about the force between two astronomical bodies.
    {
      key: "personMass",
      label: "Your mass",
      description: "Mass doesn't change from world to world — only weight does.",
      unit: "kg",
      min: 1,
      max: 150,
      step: 1,
      defaultValue: 70,
    },
    // --- Orbit: small idealized "toy" units — see physics.ts's doc
    // comment. Central mass and satellite mass are live-syncable
    // (adjustable during playback); radius and speed are *initial*
    // conditions, only applied when the simulation resets.
    {
      key: "centralMass",
      label: "Central mass",
      description: "Mass of the fixed central body (illustrative units, not real astronomical scale).",
      unit: "units",
      min: 10,
      max: 200,
      step: 5,
      defaultValue: 50,
    },
    {
      key: "satelliteMass",
      label: "Satellite mass",
      description: "Mass of the orbiting object — watch how little this affects its path.",
      unit: "units",
      min: 0.1,
      max: 5,
      step: 0.1,
      defaultValue: 1,
    },
    {
      key: "initialRadius",
      label: "Initial distance",
      description: "Starting distance from the central body. Applies the next time the simulation resets.",
      unit: "units",
      min: 2,
      max: 8,
      step: 0.5,
      defaultValue: 4,
    },
    {
      key: "initialSpeed",
      label: "Initial speed",
      description: "Starting tangential speed. 0 falls straight in; higher values curve into an orbit or escape. Applies the next time the simulation resets.",
      unit: "units",
      min: 0,
      max: 12,
      step: 0.1,
      defaultValue: 0,
    },
  ],
};
