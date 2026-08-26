"use client";

import { useState } from "react";
import { PlanSlider } from "../../simple-motion/components/plan-slider";
import { ReadoutCard } from "./readout-card";
import {
  ANGLE_MAX,
  ANGLE_MIN,
  ANGLE_STEP,
  DEFAULT_ANGLE,
  DEFAULT_DISPLACEMENT,
  DEFAULT_FORCE,
  DISPLACEMENT_MAX,
  DISPLACEMENT_MIN,
  DISPLACEMENT_STEP,
  FORCE_MAX,
  FORCE_MIN,
  FORCE_STEP,
  computeWork,
  formatEnergyValue,
  workSign,
} from "../model";

const VIEW_WIDTH = 460;
const VIEW_HEIGHT = 180;
const GROUND_Y = 140;
const BOX_X = 190;
const BOX_SIZE = 46;
const BOX_Y_TOP = GROUND_Y - BOX_SIZE;
const ARROW_LENGTH = 90;

/** Force, displacement, and angle-between-them, with a live diagram
 *  and a signed Work readout — the one control set the Work half of
 *  Learn/Predict/Explore/Explain all point back to. */
export function WorkPanel() {
  const [force, setForce] = useState(DEFAULT_FORCE);
  const [displacement, setDisplacement] = useState(DEFAULT_DISPLACEMENT);
  const [angle, setAngle] = useState(DEFAULT_ANGLE);

  const work = computeWork(force, displacement, angle);
  const sign = workSign(work);
  const tone = sign === "positive" ? "positive" : sign === "negative" ? "negative" : "default";

  // Single source of truth: the box's screen offset is driven directly
  // by the `displacement` value (the same number the Work readout
  // uses), scaled at 8px/m — nothing here animates independently of
  // that state. A CSS transition on the wrapping `<g>` (below) is what
  // turns a slider change into visible travel instead of a jump.
  const travelPx = displacement * 8;
  const angleRad = (angle * Math.PI) / 180;
  const arrowEndX = BOX_SIZE / 2 + ARROW_LENGTH * Math.cos(angleRad);
  const arrowEndY = BOX_SIZE / 2 - ARROW_LENGTH * Math.sin(angleRad);
  const arrowStartX = BOX_SIZE / 2;
  const arrowStartY = BOX_SIZE / 2;

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[1fr_18rem]">
        <div className="h-[200px] rounded-[1.75rem] border border-line bg-white/70 p-4 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04]">
          <svg
            viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
            className="h-full w-full"
            role="img"
            aria-label={`A force of ${force} newtons applied at ${angle} degrees to a box, over a displacement of ${displacement} meters`}
          >
            <rect x={0} y={GROUND_Y} width={VIEW_WIDTH} height={16} rx={4} className="fill-ink/10 dark:fill-bone/10" />

            {/* Ghost outline marking the box's starting position, so the
                travel distance below reads against a fixed reference. */}
            <rect
              x={BOX_X}
              y={BOX_Y_TOP}
              width={BOX_SIZE}
              height={BOX_SIZE}
              rx={6}
              fill="none"
              strokeDasharray="3,3"
              className="stroke-ink/25 dark:stroke-bone/25"
              strokeWidth={1.5}
            />

            {/* Displacement track — from the starting position to the
                box's live position, so it always matches where the box
                actually is, not just the target value. */}
            <line
              x1={BOX_X + BOX_SIZE / 2}
              y1={GROUND_Y + 8}
              x2={BOX_X + BOX_SIZE / 2 + travelPx}
              y2={GROUND_Y + 8}
              strokeWidth={3}
              strokeDasharray="4,4"
              className="stroke-ink/40 dark:stroke-bone/40"
              style={{ transition: "x2 0.6s cubic-bezier(0.22,1,0.36,1)" }}
            />
            <text
              x={BOX_X + BOX_SIZE / 2 + travelPx / 2}
              y={GROUND_Y + 26}
              textAnchor="middle"
              className="fill-ink-soft font-mono text-[10px] dark:fill-bone-soft"
              style={{ transition: "x 0.6s cubic-bezier(0.22,1,0.36,1)" }}
            >
              displacement = {displacement} m
            </text>

            {/* The box itself travels: this group's transform is driven
                directly by `displacement` (via `travelPx`), and the CSS
                transition is purely visual polish on top of that single
                source of truth — turning a slider commit into the box
                actually crossing the floor rather than teleporting. */}
            <g
              transform={`translate(${BOX_X + travelPx}, ${BOX_Y_TOP})`}
              style={{ transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)" }}
            >
              <rect
                width={BOX_SIZE}
                height={BOX_SIZE}
                rx={6}
                className="fill-subject-physics-soft stroke-subject-physics dark:fill-subject-physics/20"
                strokeWidth={2}
              />

              {/* Force arrow, anchored to the box so it travels with it. */}
              <line
                x1={arrowStartX}
                y1={arrowStartY}
                x2={arrowEndX}
                y2={arrowEndY}
                strokeWidth={3}
                className="stroke-[#E0524F]"
                markerEnd="url(#work-arrowhead)"
              />
              <text
                x={arrowEndX}
                y={arrowEndY - 8}
                textAnchor="middle"
                className="fill-[#E0524F] font-mono text-[10px] font-semibold"
              >
                F = {force} N, θ = {angle}°
              </text>
            </g>
            <defs>
              <marker id="work-arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" className="fill-[#E0524F]" />
              </marker>
            </defs>
          </svg>
        </div>

        <div className="flex flex-col justify-center gap-3">
          <ReadoutCard
            label="Work Done"
            value={formatEnergyValue(work)}
            unit="J"
            substitution={`${force} N × ${displacement} m × cos(${angle}°)`}
            tone={tone}
          />
          <p className="text-center font-mono text-[11px] uppercase tracking-[0.15em] text-ink-soft dark:text-bone-soft">
            {sign === "zero"
              ? "No mechanical work is done"
              : sign === "positive"
                ? "Positive work — energy added to the box"
                : "Negative work — energy removed from the box"}
          </p>
        </div>
      </div>

      <div className="grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
        <PlanSlider
          id="work-force"
          label="Force"
          unit="N"
          value={force}
          min={FORCE_MIN}
          max={FORCE_MAX}
          step={FORCE_STEP}
          onChange={setForce}
        />
        <PlanSlider
          id="work-displacement"
          label="Displacement"
          unit="m"
          value={displacement}
          min={DISPLACEMENT_MIN}
          max={DISPLACEMENT_MAX}
          step={DISPLACEMENT_STEP}
          onChange={setDisplacement}
        />
        <PlanSlider
          id="work-angle"
          label="Angle to displacement"
          unit="°"
          value={angle}
          min={ANGLE_MIN}
          max={ANGLE_MAX}
          step={ANGLE_STEP}
          onChange={setAngle}
        />
      </div>
    </div>
  );
}
