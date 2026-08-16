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
  drawFullPathGhost,
  drawGroundAndGrid,
  drawLandingMarker,
  drawMaxHeightMarker,
  drawProjectile,
  drawTarget,
  drawTrail,
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
  options: DisplayOptions;
  target?: TargetOptions | null;
}

export function ProjectileCanvas({
  trajectory,
  gravity,
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

    // Full predicted path, faint — helps students see the whole arc even
    // before the projectile gets there.
    drawFullPathGhost(
      ctx,
      projection,
      trajectory,
      isDark ? "rgba(231,236,232,0.25)" : "rgba(20,32,25,0.18)",
    );

    if (options.showTrail) {
      drawTrail(ctx, projection, trajectory, t, "#3D5AFE");
    }

    drawMaxHeightMarker(
      ctx,
      projection,
      {
        x:
          trajectory.points.find((p) => p.t >= trajectory.maxHeightTime)?.x ??
          0,
        y: trajectory.maxHeight,
      },
      "#7C4FE0",
    );
    drawLandingMarker(
      ctx,
      projection,
      { x: trajectory.range, y: 0 },
      "#0D9488",
    );

    const vectorScale = options.highlightVectors ? 1.4 : 1;
    if (options.showVelocityVector && t < trajectory.timeOfFlight) {
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
    if (options.showAccelerationVector && t < trajectory.timeOfFlight) {
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

    drawProjectile(
      ctx,
      projection,
      state,
      "#142019",
      options.highlightVectors ? 9 : 7,
    );
  };

  return (
    <SimulationCanvas
      render={render}
      showGrid={false}
      showAxes={false}
      ariaLabel="Projectile trajectory view: shows the projectile, its path, velocity and acceleration vectors, the maximum height marker, and the landing point."
      className="min-h-[260px] sm:min-h-[340px] lg:min-h-[420px]"
    />
  );
}
