"use client";

import { SimulationCanvas, type SimulationCanvasRenderInfo } from "@/features/simulation";
import { drawWorld } from "@/features/subjects/physics/engine";
import type { OrbitEngine } from "../engine";
import { computeGravitationalForce } from "../physics";
import { ORBIT_G } from "../engine";
import { createProjection, drawArrow, drawLabel } from "./canvas-helpers";

const FORCE_COLOR = "#E0524F";
const VELOCITY_COLOR = "#3D5AFE";
/** Pixels-per-force-unit and pixels-per-speed-unit, tuned for the Orbit panel's toy-unit ranges so arrows stay legible without overwhelming the scene. */
const FORCE_ARROW_SCALE = 0.35;
const VELOCITY_ARROW_SCALE = 4;

export interface OrbitCanvasProps {
  engine: OrbitEngine;
  showForce: boolean;
  showVelocity: boolean;
  showTrail: boolean;
}

/**
 * The Orbit panel's visual. Every frame, the satellite's screen
 * position comes straight from the live `RigidBody` the shared physics
 * engine is actually integrating (`engine.rig.satellite.position`) —
 * not a scripted path — so if it crashes, escapes, or settles into an
 * orbit, that's the real `World.step()` result, matching this batch's
 * "do not use decorative circular animation disconnected from the
 * physics" instruction.
 */
export function OrbitCanvas({ engine, showForce, showVelocity, showTrail }: OrbitCanvasProps) {
  const render = (ctx: CanvasRenderingContext2D, info: SimulationCanvasRenderInfo) => {
    const { size, viewport } = info;
    const isDark = document.documentElement.classList.contains("dark");
    const rig = engine.rig;
    const projection = createProjection(size, viewport);
    const { toScreen, pxPerMeter, centerX, centerY } = projection;

    // --- Fading trail ------------------------------------------------
    if (showTrail && rig.trail.length > 1) {
      ctx.save();
      ctx.strokeStyle = "#2E9E5B";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      const n = rig.trail.length;
      for (let i = 1; i < n; i++) {
        const p1 = toScreen(rig.trail[i - 1]!);
        const p2 = toScreen(rig.trail[i]!);
        ctx.globalAlpha = 0.04 + 0.4 * (i / n);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
      ctx.restore();
    }

    // --- Both bodies ---------------------------------------------------
    drawWorld(ctx, rig.world, toScreen, pxPerMeter, (body) => ({
      fill: (body.userData.color as string) ?? "#3D5AFE",
      stroke: isDark ? "rgba(11,23,16,0.7)" : "rgba(255,255,255,0.85)",
      lineWidth: 2,
    }));

    const satelliteScreen = toScreen(rig.satellite.position);
    const distance = rig.satellite.position.magnitude();

    // --- Gravitational force vector, satellite toward center -----------
    if (showForce && distance > 0.01) {
      const forceMag = computeGravitationalForce(rig.central.mass, rig.satellite.mass, distance, ORBIT_G);
      const dirX = -rig.satellite.position.x / distance;
      const dirY = -rig.satellite.position.y / distance;
      const lengthPx = Math.min(forceMag * FORCE_ARROW_SCALE, distance * pxPerMeter * 0.85);
      const tip = { x: satelliteScreen.x + dirX * lengthPx, y: satelliteScreen.y - dirY * lengthPx };
      drawArrow(ctx, satelliteScreen, tip, FORCE_COLOR, 3);
    }

    // --- Velocity vector, actual direction of travel --------------------
    if (showVelocity) {
      const speed = rig.satellite.speed;
      if (speed > 0.02) {
        const tip = {
          x: satelliteScreen.x + rig.satellite.velocity.x * VELOCITY_ARROW_SCALE,
          y: satelliteScreen.y - rig.satellite.velocity.y * VELOCITY_ARROW_SCALE,
        };
        drawArrow(ctx, satelliteScreen, tip, VELOCITY_COLOR, 3);
      }
    }

    // --- Status overlay --------------------------------------------------
    if (rig.status === "crashed") {
      drawLabel(ctx, "Crashed into the central body", { x: centerX, y: centerY - 60 }, isDark ? "#E7ECE8" : "#142019");
    } else if (rig.status === "escaped") {
      drawLabel(ctx, "Escaped — press Reset to try again", { x: size.width / 2, y: 24 }, isDark ? "#E7ECE8" : "#142019");
    }
  };

  return (
    <SimulationCanvas
      ariaLabel="Orbit simulation: a satellite orbiting a central body under gravity, with force and velocity vectors."
      showGrid={false}
      showAxes={false}
      render={render}
      className="min-h-[360px]"
    />
  );
}
