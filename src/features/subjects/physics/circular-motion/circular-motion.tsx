"use client";

import { useMemo, useState } from "react";
import {
  ControlPanel,
  FormulaExplanation,
  FormulaPanel,
  InfoPanel,
  InstructionsPanel,
  Legend,
  ParameterDropdownSelector,
  ParameterSlider,
  SimulationContainer,
  Toolbar,
  useSimulation,
} from "@/features/simulation";
import { circularMotionSchema } from "./schema";
import {
  computeAngularVelocity,
  computeCentripetalAcceleration,
  computeCentripetalForce,
  computeFrequency,
  computePeriod,
  computeState,
  formatReadout,
} from "./physics";
import { CircularMotionCanvas } from "./components/circular-motion-canvas";

/**
 * Circular Motion's Explore simulation. Following the same
 * inspect-first convention `Momentum` documents: this topic has no
 * existing simulation to reuse (no `circular-motion` files existed
 * anywhere in the codebase before this batch), so this is a new,
 * dedicated lab built directly on the shared simulation framework —
 * the same one `ProjectileMotion` and `NewtonsLaws` use — rather than
 * a bespoke rig, so playback, parameter sliders, zoom/pan,
 * screenshot export, and keyboard shortcuts are all inherited for
 * free instead of rebuilt.
 */
export function CircularMotion() {
  return (
    <SimulationContainer
      label="Circular motion simulation"
      schema={circularMotionSchema}
      initialSpeed={1}
      className="relative"
    >
      <CircularMotionBody />
    </SimulationContainer>
  );
}

function CircularMotionBody() {
  const { values, time } = useSimulation();
  const [showVelocity, setShowVelocity] = useState(true);
  const [showAcceleration, setShowAcceleration] = useState(true);
  const [showTrail, setShowTrail] = useState(true);

  const radiusM = Number(values.radius);
  const speedMs = Number(values.speed);
  const massKg = Number(values.mass);
  const direction = values.direction === "cw" ? -1 : 1;

  const state = useMemo(
    () => computeState(time, { radiusM, speedMs }, direction),
    [time, radiusM, speedMs, direction],
  );

  const omega = computeAngularVelocity(radiusM, speedMs);
  const period = computePeriod(radiusM, speedMs);
  const frequency = computeFrequency(radiusM, speedMs);
  const centripetalAcceleration = computeCentripetalAcceleration(radiusM, speedMs);
  const centripetalForce = computeCentripetalForce(radiusM, speedMs, massKg);
  const speedOfVelocityVector = Math.hypot(state.velocity.x, state.velocity.y);

  const radiusParam = circularMotionSchema.numeric!.find((p) => p.key === "radius")!;
  const speedParam = circularMotionSchema.numeric!.find((p) => p.key === "speed")!;
  const massParam = circularMotionSchema.numeric!.find((p) => p.key === "mass")!;
  const directionSelect = circularMotionSchema.select!.find((p) => p.key === "direction")!;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-4">
          <CircularMotionCanvas
            showVelocity={showVelocity}
            showAcceleration={showAcceleration}
            showTrail={showTrail}
          />

          <dl className="grid grid-cols-3 divide-x divide-line rounded-card border border-line bg-white/50 text-center dark:divide-line-dark dark:border-line-dark dark:bg-white/[0.03]">
            <div className="px-2 py-3">
              <dt className="text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Period</dt>
              <dd className="mt-0.5 font-mono text-lg font-semibold text-ink dark:text-bone">
                {formatReadout(period)}
                <span className="ml-1 text-xs font-normal text-ink-soft dark:text-bone-soft">s</span>
              </dd>
            </div>
            <div className="px-2 py-3">
              <dt className="text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Centripetal a</dt>
              <dd className="mt-0.5 font-mono text-lg font-semibold text-ink dark:text-bone">
                {formatReadout(centripetalAcceleration)}
                <span className="ml-1 text-xs font-normal text-ink-soft dark:text-bone-soft">m/s²</span>
              </dd>
            </div>
            <div className="px-2 py-3">
              <dt className="text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Centripetal F</dt>
              <dd className="mt-0.5 font-mono text-lg font-semibold text-ink dark:text-bone">
                {formatReadout(centripetalForce)}
                <span className="ml-1 text-xs font-normal text-ink-soft dark:text-bone-soft">N</span>
              </dd>
            </div>
          </dl>

          <Toolbar exportFilename="circular-motion" />
          <Legend
            items={[
              { label: "Tangential velocity", color: "#3D5AFE", shape: "line" },
              { label: "Centripetal acceleration (toward center)", color: "#E0524F", shape: "line" },
              { label: "Object", color: "#2E9E5B", shape: "dot" },
            ]}
          />

          <details className="group rounded-card border border-line bg-white/50 dark:border-line-dark dark:bg-white/[0.03]">
            <summary className="cursor-pointer select-none rounded-card px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft transition-colors hover:text-ink dark:text-bone-soft dark:hover:text-bone">
              Display options
            </summary>
            <fieldset className="flex flex-col gap-2 border-t border-line p-4 dark:border-line-dark">
              {(
                [
                  [showVelocity, setShowVelocity, "Show velocity vector"],
                  [showAcceleration, setShowAcceleration, "Show acceleration vector"],
                  [showTrail, setShowTrail, "Show motion trail"],
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
          <ControlPanel title="Circle">
            <ParameterSlider parameter={radiusParam} />
            <ParameterSlider parameter={speedParam} />
            <ParameterDropdownSelector parameter={directionSelect} />
          </ControlPanel>

          <ControlPanel title="Object">
            <ParameterSlider parameter={massParam} />
          </ControlPanel>

          <InfoPanel
            title="Live readouts"
            stats={[
              { label: "Angular position", value: formatReadout((state.angleRad * 180) / Math.PI), unit: "°" },
              { label: "Angular velocity (ω)", value: formatReadout(omega), unit: "rad/s" },
              { label: "Period (T)", value: formatReadout(period), unit: "s" },
              { label: "Frequency (f)", value: formatReadout(frequency), unit: "Hz" },
              { label: "Tangential speed", value: formatReadout(speedOfVelocityVector), unit: "m/s" },
              { label: "Centripetal acceleration", value: formatReadout(centripetalAcceleration), unit: "m/s²" },
              { label: "Centripetal force", value: formatReadout(centripetalForce), unit: "N" },
            ]}
          />
        </div>
      </div>

      <InstructionsPanel
        title="How to use this lab"
        defaultOpen={false}
        steps={[
          "Set Radius and Speed, then press Play — the object travels around the circle at constant speed while its velocity direction keeps changing.",
          "Watch the blue tangential-velocity arrow always point along the direction of travel, and the red centripetal-acceleration arrow always point straight toward the center — even though speed never changes, direction does, so the object is always accelerating.",
          "Increase Speed while holding Radius fixed and watch centripetal acceleration and force jump — they depend on speed squared.",
          "Increase Radius while holding Speed fixed and watch centripetal acceleration and force fall — for the same speed, a gentler (larger) curve needs less inward force.",
          "Change Mass and notice centripetal force changes but centripetal acceleration doesn't — acceleration only depends on speed and radius.",
        ]}
      />

      <FormulaPanel title="Formulas">
        <div className="grid gap-6 sm:grid-cols-3">
          <FormulaExplanation
            formula="v = \dfrac{2\pi r}{T}"
            caption="Tangential speed"
            explanation="The object covers the circle's circumference, 2πr, once every period T."
            variables={[
              { symbol: "v", meaning: "Tangential speed", unit: "m/s" },
              { symbol: "r", meaning: "Radius", unit: "m" },
              { symbol: "T", meaning: "Period", unit: "s" },
            ]}
          />
          <FormulaExplanation
            formula="a_c = \dfrac{v^2}{r}"
            caption="Centripetal acceleration"
            explanation="Even at constant speed, velocity's direction keeps changing — that change points toward the center, with magnitude v²/r."
            variables={[
              { symbol: "a_c", meaning: "Centripetal acceleration", unit: "m/s²" },
              { symbol: "v", meaning: "Tangential speed", unit: "m/s" },
              { symbol: "r", meaning: "Radius", unit: "m" },
            ]}
          />
          <FormulaExplanation
            formula="F_c = \dfrac{m v^2}{r}"
            caption="Centripetal force"
            explanation="The net inward force needed to keep an object of mass m on the circular path — supplied by tension, gravity, friction, or the normal force, depending on the situation."
            variables={[
              { symbol: "F_c", meaning: "Centripetal force", unit: "N" },
              { symbol: "m", meaning: "Mass", unit: "kg" },
              { symbol: "v", meaning: "Tangential speed", unit: "m/s" },
              { symbol: "r", meaning: "Radius", unit: "m" },
            ]}
          />
        </div>
      </FormulaPanel>
    </div>
  );
}
