"use client";

import { useTheme } from "next-themes";
import {
  SimulationCanvas,
  type SimulationCanvasRenderInfo,
} from "@/features/simulation";
import type { Trajectory } from "../physics";
import { sampleTrajectory } from "../physics";
import {
  createProjection,
  drawAccelerationVector,
  drawBall,
  drawFullPathGhost,
  drawGroundAndGrid,
  drawGroundShadow,
  drawLandingFlag,
  drawLauncher,
  drawMaxHeightGuide,
  drawMotionTrail,
  drawPlatform,
  drawTarget,
  drawVelocityVector,
} from "../canvas-helpers";

export interface DisplayOptions {
  showTrail: boolean;
  showVelocityVector: boolean;
  showAccelerationVector: boolean;
  showGrid: boolean;
  showLabels: boolean;
  highlightVectors: boolean;
}

export interface TargetOptions {
  x: number;
  toleranceMeters: number;
  /** m/s the target drifts outward; 0 for a stationary target. */
  speed?: number;
}

interface ProjectileCanvasProps {
  trajectory: Trajectory;
  gravity: number;
  angleDeg: number;
  /** kg — used only to give the ball a slightly heavier/lighter look, matching the mass slider. */
  mass: number;
  options: DisplayOptions;
  target?: TargetOptions | null;
}

const toRadians = (deg: number) => (deg * Math.PI) / 180;

export function ProjectileCanvas({
  trajectory,
  gravity,
  angleDeg,
  mass,
  options,
  target,
}: ProjectileCanvasProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const render = (
    ctx: CanvasRenderingContext2D,
    info: SimulationCanvasRenderInfo,
  ) => {
    const { size, viewport, frame } = info;
    const projection = createProjection(size, viewport, trajectory);
    const t = Math.min(frame.time, trajectory.timeOfFlight);
    const state = sampleTrajectory(trajectory, t);
    const inFlight = t < trajectory.timeOfFlight;

    // Ball radius: a small, legible range driven by mass so a heavier
    // launch visibly looks like a heavier ball, without ever getting
    // large enough to obscure the trajectory it's following.
    const ballRadius = 7 + Math.min(1, Math.max(0, mass / 20)) * 6;

    // ---- Scene backdrop --------------------------------------------------
    drawPlatform(ctx, size, projection, isDark);
    drawGroundAndGrid(ctx, size, projection, {
      showGrid: options.showGrid,
      showLabels: options.showLabels,
      isDark,
      maxX: trajectory.range,
      maxY: trajectory.maxHeight,
    });

    if (target) {
      const targetX = target.x + (target.speed ?? 0) * t;
      drawTarget(
        ctx,
        projection,
        targetX,
        target.toleranceMeters,
        isDark ? "#F0A54A" : "#B5691B",
      );
    }

    // Full predicted arc, faint — the whole experiment's outcome is
    // visible before the ball ever reaches it, like a chalk line drawn
    // in advance.
    drawFullPathGhost(
      ctx,
      projection,
      trajectory,
      isDark ? "rgba(231,236,232,0.22)" : "rgba(20,32,25,0.16)",
    );

    // ---- Launcher device ---------------------------------------------------
    drawLauncher(ctx, projection, toRadians(angleDeg), isDark);

    if (options.showTrail) {
      drawMotionTrail(
        ctx,
        projection,
        trajectory,
        t,
        isDark ? "#818CF8" : "#3D5AFE",
        isDark,
      );
    }

    drawMaxHeightGuide(
      ctx,
      projection,
      {
        x:
          trajectory.points.find((p) => p.t >= trajectory.maxHeightTime)?.x ??
          0,
        y: trajectory.maxHeight,
      },
      "#7C4FE0",
      isDark,
    );
    drawLandingFlag(
      ctx,
      projection,
      { x: trajectory.range, y: 0 },
      "#0D9488",
    );

    const vectorScale = options.highlightVectors ? 1.4 : 1;
    if (options.showVelocityVector && inFlight) {
      drawVelocityVector(
        ctx,
        projection,
        state,
        state.vx,
        state.vy,
        "#3D5AFE",
        2.2 * vectorScale,
      );
    }
    if (options.showAccelerationVector && inFlight) {
      drawAccelerationVector(
        ctx,
        projection,
        state,
        0,
        -gravity,
        "#E0524F",
        3.2 * vectorScale,
      );
    }

    // ---- The ball itself, drawn last so it's always on top -----------------
    drawGroundShadow(ctx, projection, state, ballRadius, isDark);
    const spinRad = state.x * 0.35;
    drawBall(ctx, projection, state, ballRadius, isDark, spinRad);
  };

  return (
    <SimulationCanvas
      render={render}
      showGrid={false}
      showAxes={false}
      ariaLabel="Projectile trajectory view: a launcher fires a ball whose path, current position, maximum height, and landing point are shown against a ground platform."
      className="min-h-[280px] sm:min-h-[360px] lg:min-h-[440px]"
    />
  );
}
