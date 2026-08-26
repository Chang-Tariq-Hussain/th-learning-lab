"use client";

import { SimulationCanvas, type SimulationCanvasRenderInfo } from "@/features/simulation";
import { computeState } from "../physics";
import { createProjection, drawArrow } from "./canvas-helpers";

const VELOCITY_COLOR = "#3D5AFE";
const ACCELERATION_COLOR = "#E0524F";
const PATH_COLOR_LIGHT = "rgba(20,32,25,0.18)";
const PATH_COLOR_DARK = "rgba(231,236,232,0.22)";
const OBJECT_COLOR = "#2E9E5B";

/** Pixels-per-(m/s) and pixels-per-(m/s²) scaling for the two vector
 *  arrows — chosen so they read clearly across the sliders' ranges
 *  without either overwhelming the circle or disappearing into it. */
const VELOCITY_ARROW_SCALE = 6;
const ACCEL_ARROW_SCALE = 2.2;

export interface CircularMotionCanvasProps {
  showVelocity: boolean;
  showAcceleration: boolean;
  showTrail: boolean;
}

/**
 * The circular-motion Explore visual. Unlike a decorative rotating
 * icon, the object's screen position on every frame comes straight
 * out of `computeState(t, ...)` — real physics state, not just a CSS
 * animation — with the tangential-velocity and centripetal-
 * acceleration vectors drawn from that same state so their length and
 * direction always match what's actually happening.
 */
export function CircularMotionCanvas({ showVelocity, showAcceleration, showTrail }: CircularMotionCanvasProps) {
  const render = (ctx: CanvasRenderingContext2D, info: SimulationCanvasRenderInfo) => {
    const { size, viewport, values, frame } = info;
    const radiusM = Number(values.radius);
    const speedMs = Number(values.speed);
    const direction = values.direction === "cw" ? -1 : 1;
    const isDark = document.documentElement.classList.contains("dark");

    const projection = createProjection(size, viewport, radiusM);
    const { toScreen, pxPerMeter, centerX, centerY } = projection;
    const state = computeState(frame.time, { radiusM, speedMs }, direction);

    // --- Circular path -------------------------------------------------
    ctx.save();
    ctx.strokeStyle = isDark ? PATH_COLOR_DARK : PATH_COLOR_LIGHT;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 5]);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radiusM * pxPerMeter, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // --- Optional fading trail behind the object ------------------------
    if (showTrail && speedMs > 0) {
      const omega = Math.abs(speedMs / Math.max(radiusM, 0.0001));
      const trailSpanRad = Math.min(Math.PI * 1.2, omega * 0.9 || 0.6);
      ctx.save();
      ctx.strokeStyle = OBJECT_COLOR;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      const steps = 24;
      for (let i = 0; i < steps; i++) {
        const frac = i / steps;
        const angle = state.angleRad - direction * trailSpanRad * (1 - frac);
        const next = state.angleRad - direction * trailSpanRad * (1 - (i + 1) / steps);
        const p1 = toScreen({ x: radiusM * Math.cos(angle), y: radiusM * Math.sin(angle) });
        const p2 = toScreen({ x: radiusM * Math.cos(next), y: radiusM * Math.sin(next) });
        ctx.globalAlpha = 0.06 + 0.3 * frac;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
      ctx.restore();
    }

    // --- Center point + radius line -------------------------------------
    ctx.save();
    ctx.fillStyle = isDark ? "rgba(231,236,232,0.5)" : "rgba(20,32,25,0.45)";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
    ctx.fill();

    const objectScreen = toScreen(state.position);
    ctx.strokeStyle = isDark ? "rgba(231,236,232,0.25)" : "rgba(20,32,25,0.2)";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(objectScreen.x, objectScreen.y);
    ctx.stroke();
    ctx.restore();

    // --- Acceleration vector (drawn first, so the object sits on top) ---
    if (showAcceleration) {
      const aMag = Math.hypot(state.acceleration.x, state.acceleration.y);
      if (aMag > 0.001) {
        const tipWorld = {
          x: state.position.x + (state.acceleration.x / aMag) * Math.min(aMag * ACCEL_ARROW_SCALE / pxPerMeter, radiusM * 0.9),
          y: state.position.y + (state.acceleration.y / aMag) * Math.min(aMag * ACCEL_ARROW_SCALE / pxPerMeter, radiusM * 0.9),
        };
        drawArrow(ctx, objectScreen, toScreen(tipWorld), ACCELERATION_COLOR, 3);
      }
    }

    // --- Velocity vector (tangent) --------------------------------------
    if (showVelocity) {
      const vMag = Math.hypot(state.velocity.x, state.velocity.y);
      if (vMag > 0.001) {
        const lengthM = (vMag * VELOCITY_ARROW_SCALE) / pxPerMeter;
        const tipWorld = {
          x: state.position.x + (state.velocity.x / vMag) * lengthM,
          y: state.position.y + (state.velocity.y / vMag) * lengthM,
        };
        drawArrow(ctx, objectScreen, toScreen(tipWorld), VELOCITY_COLOR, 3);
      }
    }

    // --- The moving object itself ----------------------------------------
    ctx.save();
    ctx.fillStyle = OBJECT_COLOR;
    ctx.beginPath();
    ctx.arc(objectScreen.x, objectScreen.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = isDark ? "#0B1710" : "#FFFFFF";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  };

  return (
    <SimulationCanvas
      ariaLabel="Circular motion simulation: an object traveling around a circular path, with velocity and acceleration vectors."
      showGrid={false}
      render={render}
      className="min-h-[360px]"
    />
  );
}
