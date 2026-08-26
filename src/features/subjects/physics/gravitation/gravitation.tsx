"use client";

import { useEffect, useRef, useState } from "react";
import {
  ControlPanel,
  FormulaExplanation,
  FormulaPanel,
  InfoPanel,
  InstructionsPanel,
  Legend,
  ParameterSlider,
  SimulationContainer,
  Toolbar,
  useSimulation,
} from "@/features/simulation";
import { gravitationSchema } from "./schema";
import {
  G_REAL,
  computeGravitationalForce,
  formatReadout,
  formatScientific,
} from "./physics";
import { useOrbitEngine, useOrbitSnapshot } from "./engine";
import { ForceLabDiagram } from "./components/force-lab-diagram";
import { WeightWorldsPanel } from "./components/weight-worlds-panel";
import { OrbitCanvas } from "./components/orbit-canvas";
import { PanelTabs, type GravitationPanel } from "./components/panel-tabs";

/**
 * Gravitation's Explore experience — two linked panels behind one tab
 * switcher (the same "one `SimulationContainer`, several tabs sharing
 * its schema" shape `NewtonsLaws` uses for Law 1/2/3): a static Force
 * Lab for F = Gm₁m₂/r² and weight-vs-mass, and an animated Orbit lab
 * built on the shared physics engine (`@/features/subjects/physics/engine`)
 * for how gravity produces real orbital motion. Inspecting the
 * codebase first (per this batch's instructions) found no existing
 * Gravitation simulation, but did find the engine's `NewtonianGravity`
 * force generator sitting unused, already written and documented with
 * an orbital-motion scene in mind — Orbit reuses it directly rather
 * than writing a new integrator.
 */
export function Gravitation() {
  return (
    <SimulationContainer
      label="Gravitation simulation"
      schema={gravitationSchema}
      initialSpeed={1}
      className="relative"
    >
      <GravitationBody />
    </SimulationContainer>
  );
}

function GravitationBody() {
  const { values, frameCount } = useSimulation();
  const [panel, setPanel] = useState<GravitationPanel>("force-lab");
  const [showForce, setShowForce] = useState(true);
  const [showVelocity, setShowVelocity] = useState(true);
  const [showTrail, setShowTrail] = useState(true);

  const orbitActive = panel === "orbit";
  const orbitEngine = useOrbitEngine(orbitActive, values);
  const orbitReadouts = useOrbitSnapshot(orbitEngine, orbitActive);

  // The framework's Reset button resets its own time/parameter state,
  // but has no idea the Orbit rig's `World` exists — its bodies'
  // position/velocity persist independently. Detecting the
  // frameCount-drops-to-zero edge (not just "frameCount === 0", which
  // is also true on first mount) rebuilds the rig from the current
  // initialRadius/initialSpeed sliders, matching `newtons-laws.tsx`'s
  // identical handling of its own two engine-backed rigs.
  const prevFrameCountRef = useRef(frameCount);
  useEffect(() => {
    if (frameCount === 0 && prevFrameCountRef.current > 0) {
      orbitEngine.reset();
    }
    prevFrameCountRef.current = frameCount;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameCount]);

  const mass1Param = gravitationSchema.numeric!.find((p) => p.key === "mass1")!;
  const mass2Param = gravitationSchema.numeric!.find((p) => p.key === "mass2")!;
  const distanceParam = gravitationSchema.numeric!.find((p) => p.key === "distance")!;
  const personMassParam = gravitationSchema.numeric!.find((p) => p.key === "personMass")!;
  const centralMassParam = gravitationSchema.numeric!.find((p) => p.key === "centralMass")!;
  const satelliteMassParam = gravitationSchema.numeric!.find((p) => p.key === "satelliteMass")!;
  const initialRadiusParam = gravitationSchema.numeric!.find((p) => p.key === "initialRadius")!;
  const initialSpeedParam = gravitationSchema.numeric!.find((p) => p.key === "initialSpeed")!;

  const mass1 = Number(values.mass1);
  const mass2 = Number(values.mass2);
  const distance = Number(values.distance);
  const personMass = Number(values.personMass);

  const forceN = computeGravitationalForce(mass1 * 1e24, mass2 * 1e24, distance * 1e6, G_REAL);

  return (
    <div className="flex flex-col gap-6">
      <PanelTabs active={panel} onChange={setPanel} />

      {panel === "force-lab" ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-4">
            <div className="rounded-card border border-line bg-white/50 p-4 dark:border-line-dark dark:bg-white/[0.03]">
              <ForceLabDiagram mass1={mass1} mass2={mass2} distance={distance} />
            </div>

            <dl className="grid grid-cols-2 divide-x divide-line rounded-card border border-line bg-white/50 text-center dark:divide-line-dark dark:border-line-dark dark:bg-white/[0.03]">
              <div className="px-2 py-3">
                <dt className="text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Gravitational force</dt>
                <dd className="mt-0.5 font-mono text-lg font-semibold text-ink dark:text-bone">
                  {formatScientific(forceN)}
                  <span className="ml-1 text-xs font-normal text-ink-soft dark:text-bone-soft">N</span>
                </dd>
              </div>
              <div className="px-2 py-3">
                <dt className="text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">G (constant)</dt>
                <dd className="mt-0.5 font-mono text-lg font-semibold text-ink dark:text-bone">6.674×10⁻¹¹</dd>
              </div>
            </dl>

            <div>
              <h3 className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft dark:text-bone-soft">
                Weight &amp; Worlds — same mass, different weight
              </h3>
              <ControlPanel title="Your mass">
                <ParameterSlider parameter={personMassParam} />
              </ControlPanel>
              <div className="mt-3">
                <WeightWorldsPanel personMass={personMass} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <ControlPanel title="Masses & distance">
              <ParameterSlider parameter={mass1Param} />
              <ParameterSlider parameter={mass2Param} />
              <ParameterSlider parameter={distanceParam} />
            </ControlPanel>

            <FormulaPanel title="Formulas">
              <FormulaExplanation
                formula="F = \dfrac{G m_1 m_2}{r^2}"
                caption="Newton's law of universal gravitation"
                explanation="Every mass attracts every other mass, with a force proportional to both masses and inversely proportional to the square of the distance between their centers."
                variables={[
                  { symbol: "F", meaning: "Gravitational force", unit: "N" },
                  { symbol: "G", meaning: "Gravitational constant", unit: "N·m²/kg²" },
                  { symbol: "m₁, m₂", meaning: "The two masses", unit: "kg" },
                  { symbol: "r", meaning: "Distance between centers", unit: "m" },
                ]}
              />
              <FormulaExplanation
                formula="W = m g"
                caption="Weight"
                explanation="Weight is the gravitational force acting on an object's mass — it changes from world to world because g does, even though mass itself never changes."
                variables={[
                  { symbol: "W", meaning: "Weight", unit: "N" },
                  { symbol: "m", meaning: "Mass", unit: "kg" },
                  { symbol: "g", meaning: "Local gravitational acceleration", unit: "m/s²" },
                ]}
              />
            </FormulaPanel>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-4">
            <OrbitCanvas engine={orbitEngine} showForce={showForce} showVelocity={showVelocity} showTrail={showTrail} />

            <dl className="grid grid-cols-3 divide-x divide-line rounded-card border border-line bg-white/50 text-center dark:divide-line-dark dark:border-line-dark dark:bg-white/[0.03]">
              <div className="px-2 py-3">
                <dt className="text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Distance</dt>
                <dd className="mt-0.5 font-mono text-lg font-semibold text-ink dark:text-bone">{formatReadout(orbitReadouts.distance)}</dd>
              </div>
              <div className="px-2 py-3">
                <dt className="text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Speed</dt>
                <dd className="mt-0.5 font-mono text-lg font-semibold text-ink dark:text-bone">{formatReadout(orbitReadouts.speed)}</dd>
              </div>
              <div className="px-2 py-3">
                <dt className="text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Circular orbit speed here</dt>
                <dd className="mt-0.5 font-mono text-lg font-semibold text-ink dark:text-bone">{formatReadout(orbitReadouts.circularOrbitalSpeed)}</dd>
              </div>
            </dl>

            <Toolbar exportFilename="gravitation-orbit" />
            <Legend
              items={[
                { label: "Velocity (actual direction of travel)", color: "#3D5AFE", shape: "line" },
                { label: "Gravitational force (toward center)", color: "#E0524F", shape: "line" },
                { label: "Satellite path", color: "#2E9E5B", shape: "dot" },
              ]}
            />

            <details className="group rounded-card border border-line bg-white/50 dark:border-line-dark dark:bg-white/[0.03]">
              <summary className="cursor-pointer select-none rounded-card px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft transition-colors hover:text-ink dark:text-bone-soft dark:hover:text-bone">
                Display options
              </summary>
              <fieldset className="flex flex-col gap-2 border-t border-line p-4 dark:border-line-dark">
                {(
                  [
                    [showForce, setShowForce, "Show gravitational force vector"],
                    [showVelocity, setShowVelocity, "Show velocity vector"],
                    [showTrail, setShowTrail, "Show orbital trail"],
                  ] as const
                ).map(([checked, setter, label]) => (
                  <label key={label} className="flex items-center gap-2 text-sm text-ink-soft dark:text-bone-soft">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => setter(e.target.checked)}
                      className="h-4 w-4 rounded accent-pine-600 dark:accent-pine-300"
                    />
                    {label}
                  </label>
                ))}
              </fieldset>
            </details>
          </div>

          <div className="flex flex-col gap-4">
            <ControlPanel title="Central body">
              <ParameterSlider parameter={centralMassParam} />
            </ControlPanel>
            <ControlPanel title="Satellite (launch conditions — apply on Reset)">
              <ParameterSlider parameter={satelliteMassParam} />
              <ParameterSlider parameter={initialRadiusParam} />
              <ParameterSlider parameter={initialSpeedParam} />
            </ControlPanel>

            <InfoPanel
              title="Live readouts (illustrative units)"
              stats={[
                { label: "Distance from center", value: formatReadout(orbitReadouts.distance), unit: "units" },
                { label: "Speed", value: formatReadout(orbitReadouts.speed), unit: "units/s" },
                { label: "Gravitational force", value: formatReadout(orbitReadouts.force), unit: "units" },
                { label: "Gravitational acceleration", value: formatReadout(orbitReadouts.acceleration), unit: "units/s²" },
                { label: "Circular orbital speed at this distance", value: formatReadout(orbitReadouts.circularOrbitalSpeed), unit: "units/s" },
                { label: "Escape speed at this distance", value: formatReadout(orbitReadouts.escapeSpeed), unit: "units/s" },
              ]}
            />

            <FormulaPanel title="Formulas">
              <FormulaExplanation
                formula="v_{orbit} = \sqrt{\dfrac{GM}{r}}"
                caption="Circular orbital speed"
                explanation="The exact speed at which gravity's inward pull matches the centripetal acceleration needed for a circular path at radius r — set the Initial speed slider to this value (shown in the readouts) and reset to try it."
                variables={[
                  { symbol: "v", meaning: "Orbital speed", unit: "units/s" },
                  { symbol: "G", meaning: "Gravitational constant (idealized here)" },
                  { symbol: "M", meaning: "Central mass", unit: "units" },
                  { symbol: "r", meaning: "Orbital radius", unit: "units" },
                ]}
              />
            </FormulaPanel>
          </div>
        </div>
      )}

      <InstructionsPanel
        title="How to use this lab"
        defaultOpen={false}
        steps={
          panel === "force-lab"
            ? [
                "Drag Mass 1 or Mass 2 up and watch the gravitational force readout grow — proportionally with each mass.",
                "Drag Distance up and watch force fall sharply — this is the inverse-square relationship, so doubling distance cuts force to a quarter, not a half.",
                "Try to find two different mass/distance combinations that give the same force — there's more than one way.",
                "Below, change Your mass and watch weight change on every world at once, while mass itself never changes — that's the difference between mass and weight.",
              ]
            : [
                "Start with Initial speed at 0 and press Play — the satellite falls straight toward the central body under gravity alone.",
                "Reset, then set Initial speed to match the \"Circular orbital speed at this distance\" readout, and press Play — the satellite should trace a steady circle.",
                "Try speeds a bit below or above that circular value — the path becomes an ellipse instead of a circle.",
                "Push Initial speed above the \"Escape speed\" readout — the satellite leaves and never comes back, instead of orbiting.",
                "Change Central mass and watch the circular/escape speed readouts update — a more massive central body needs a faster orbit at the same distance.",
                "Change Satellite mass and confirm the orbital path itself doesn't change at all — only central mass and distance determine the motion.",
              ]
        }
      />
    </div>
  );
}
