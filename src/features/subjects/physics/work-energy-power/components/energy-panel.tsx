"use client";

import { useState } from "react";
import { PlanSlider } from "../../simple-motion/components/plan-slider";
import { ReadoutCard } from "./readout-card";
import {
  DEFAULT_HEIGHT,
  DEFAULT_MASS,
  DEFAULT_VELOCITY,
  GRAVITY,
  HEIGHT_MAX,
  HEIGHT_MIN,
  HEIGHT_STEP,
  MASS_MAX,
  MASS_MIN,
  MASS_STEP,
  VELOCITY_MAX,
  VELOCITY_MIN,
  VELOCITY_STEP,
  computeGravitationalPE,
  computeKineticEnergy,
  formatEnergyValue,
} from "../model";

const SHELF_HEIGHT_PX = 90;

/** Kinetic and potential energy side by side, each with its own mass
 *  slider so a student can isolate "what changes KE" from "what
 *  changes PE" instead of one shared mass hiding the comparison. */
export function EnergyPanel() {
  const [keMass, setKeMass] = useState(DEFAULT_MASS);
  const [velocity, setVelocity] = useState(DEFAULT_VELOCITY);
  const [peMass, setPeMass] = useState(DEFAULT_MASS);
  const [height, setHeight] = useState(DEFAULT_HEIGHT);

  const ke = computeKineticEnergy(keMass, velocity);
  const pe = computeGravitationalPE(peMass, height);

  const shelfFraction = height / HEIGHT_MAX;
  const ballY = 10 + (1 - shelfFraction) * SHELF_HEIGHT_PX;

  // Continuous motion, not just a bigger number: a box that actually
  // crosses the track, faster at higher velocity. Duration is inversely
  // proportional to velocity (double the speed, half the time to cross)
  // so "faster" is something the eye can compare, not just read off a
  // slider. At velocity = 0 the animation is paused outright — a
  // resting box shouldn't twitch.
  const crossingDurationS = velocity > 0 ? 20 / velocity : 0;

  return (
    <div className="grid w-full grid-cols-1 gap-6 py-4 lg:grid-cols-2">
      {/* Kinetic energy */}
      <div className="flex flex-col items-center gap-4 rounded-[1.75rem] border border-line bg-white/70 p-5 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04]">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">Kinetic Energy</p>
        <svg viewBox="0 0 220 90" className="h-20 w-full" role="img" aria-label={`A ${keMass} kilogram box moving at ${velocity} meters per second`}>
          <rect x={0} y={70} width={220} height={10} rx={3} className="fill-ink/10 dark:fill-bone/10" />
          <rect
            x={20 + Math.min(velocity, VELOCITY_MAX) * 6}
            y={40}
            width={34}
            height={30}
            rx={6}
            className="fill-subject-physics-soft stroke-subject-physics dark:fill-subject-physics/20"
            strokeWidth={2}
            style={{ transition: "x 0.4s ease-out" }}
          />
          {/* Motion streaks rushing past behind the box — native SVG
              `<animate>`, no separate animation system, and paused
              entirely at velocity = 0 so a resting box reads as at
              rest, not just slow. Their cycle time is tied to the same
              `crossingDurationS` derived from velocity above, so
              "faster" is something visibly, continuously true rather
              than a single bigger number. */}
          {velocity > 0
            ? Array.from({ length: 3 }).map((_, i) => (
                <line
                  key={i}
                  y1={55}
                  y2={55}
                  strokeWidth={2}
                  className="stroke-subject-physics/50"
                >
                  <animate
                    attributeName="x1"
                    values="24;-6;24"
                    keyTimes="0;0.999;1"
                    dur={`${crossingDurationS}s`}
                    begin={`${i * (crossingDurationS / 3)}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="x2"
                    values="12;-18;12"
                    keyTimes="0;0.999;1"
                    dur={`${crossingDurationS}s`}
                    begin={`${i * (crossingDurationS / 3)}s`}
                    repeatCount="indefinite"
                  />
                </line>
              ))
            : null}
        </svg>
        <ReadoutCard label="Kinetic Energy" value={formatEnergyValue(ke)} unit="J" substitution={`½ × ${keMass} kg × (${velocity} m/s)²`} />
        <div className="grid w-full grid-cols-2 gap-4">
          <PlanSlider id="ke-mass" label="Mass" unit="kg" value={keMass} min={MASS_MIN} max={MASS_MAX} step={MASS_STEP} onChange={setKeMass} />
          <PlanSlider
            id="ke-velocity"
            label="Velocity"
            unit="m/s"
            value={velocity}
            min={VELOCITY_MIN}
            max={VELOCITY_MAX}
            step={VELOCITY_STEP}
            onChange={setVelocity}
          />
        </div>
      </div>

      {/* Potential energy */}
      <div className="flex flex-col items-center gap-4 rounded-[1.75rem] border border-line bg-white/70 p-5 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04]">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">Gravitational Potential Energy</p>
        <svg viewBox="0 0 220 100" className="h-24 w-full" role="img" aria-label={`A ${peMass} kilogram ball held ${height} meters above the ground`}>
          <rect x={0} y={90} width={220} height={10} rx={3} className="fill-ink/10 dark:fill-bone/10" />
          <line x1={30} y1={90} x2={30} y2={8} strokeWidth={2} strokeDasharray="3,3" className="stroke-ink/25 dark:stroke-bone/25" />
          <circle
            cx={30}
            cy={ballY}
            r={11}
            className="fill-subject-physics"
            style={{ transition: "cy 0.5s cubic-bezier(0.22,1,0.36,1)" }}
          />
          <text
            x={48}
            y={ballY + 4}
            className="fill-ink-soft font-mono text-[10px] dark:fill-bone-soft"
            style={{ transition: "y 0.5s cubic-bezier(0.22,1,0.36,1)" }}
          >
            h = {height} m
          </text>
        </svg>
        <ReadoutCard label="Potential Energy" value={formatEnergyValue(pe)} unit="J" substitution={`${peMass} kg × ${GRAVITY} m/s² × ${height} m`} />
        <div className="grid w-full grid-cols-2 gap-4">
          <PlanSlider id="pe-mass" label="Mass" unit="kg" value={peMass} min={MASS_MIN} max={MASS_MAX} step={MASS_STEP} onChange={setPeMass} />
          <PlanSlider id="pe-height" label="Height" unit="m" value={height} min={HEIGHT_MIN} max={HEIGHT_MAX} step={HEIGHT_STEP} onChange={setHeight} />
        </div>
      </div>
    </div>
  );
}
