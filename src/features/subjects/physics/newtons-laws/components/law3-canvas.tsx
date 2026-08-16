"use client";

import {
  SimulationCanvas,
  type SimulationCanvasRenderInfo,
} from "@/features/simulation";
import { drawWorld } from "@/features/subjects/physics/engine";
import type { Law3Engine, Law3Readouts } from "../law3-engine";
import {
  createProjection,
  drawForceVector,
  drawGround,
  drawLabel,
  drawVelocityVector,
} from "./canvas-helpers";

export interface Law3CanvasProps {
  engine: Law3Engine;
  readouts: Law3Readouts;
  highlightVectors: boolean;
}

function isDarkMode(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

const ACTION_COLOR = "#3D5AFE";
const REACTION_COLOR = "#E0524F";

export function Law3Canvas({
  engine,
  readouts,
  highlightVectors,
}: Law3CanvasProps) {
  const render = (
    ctx: CanvasRenderingContext2D,
    info: SimulationCanvasRenderInfo,
  ) => {
    const { size, viewport } = info;
    const isDark = isDarkMode();
    const rig = engine.rig;
    const lineWidth = highlightVectors ? 4 : 2.5;

    const focusX =
      rig.kind === "skaters"
        ? (rig.skaterA.position.x + rig.skaterB.position.x) / 2
        : rig.kind === "collision"
          ? (rig.ballA.position.x + rig.ballB.position.x) / 2
          : rig.kind === "spring"
            ? rig.cart.position.x
            : rig.body.position.x;

    const span =
      rig.kind === "collision" ? 12 : rig.kind === "skaters" ? 8 : 10;
    const projection = createProjection(size, viewport, focusX, span);
    drawGround(ctx, size, projection, isDark);
    drawWorld(
      ctx,
      rig.world,
      projection.toScreen,
      projection.pxPerMeter,
      (body) => ({
        fill: (body.userData.color as string) ?? "#3D5AFE",
        stroke: "transparent",
      }),
    );

    // Velocity vectors on every non-static body — always relevant for "did momentum carry through?"
    for (const body of rig.world.bodies) {
      if (body.isStatic || Math.abs(body.velocity.x) < 0.05) continue;
      drawVelocityVector(
        ctx,
        projection,
        body.position,
        body.velocity.x,
        0,
        "#2E9E5B",
        2,
        5,
      );
    }

    // Equal-and-opposite action/reaction arrows at the interaction point, scenario-specific.
    if (
      rig.kind === "skaters" &&
      Math.abs(readouts.forceOnA) < 0.01 &&
      readouts.extra
    ) {
      // Push already happened (impulse, not a continuous force) — draw at the moment of contact only via labels.
      const mid = {
        x: (rig.skaterA.position.x + rig.skaterB.position.x) / 2,
        y: rig.skaterA.position.y,
      };
      const p = projection.toScreen(mid);
      drawLabel(
        ctx,
        "Equal & opposite impulse at push",
        { x: p.x, y: p.y - 40 },
        isDark ? "#E7ECE8" : "#142019",
      );
    }

    if (
      (rig.kind === "rocket" || rig.kind === "balloon") &&
      rig.state.thrustOn
    ) {
      const nose = { x: rig.body.position.x + 0.6, y: rig.body.position.y };
      const exhaust = { x: rig.body.position.x - 0.6, y: rig.body.position.y };
      drawForceVector(
        ctx,
        projection,
        nose,
        readouts.forceOnA,
        0,
        ACTION_COLOR,
        lineWidth,
        1.4,
      );
      drawForceVector(
        ctx,
        projection,
        exhaust,
        readouts.forceOnB,
        0,
        REACTION_COLOR,
        lineWidth,
        1.4,
      );
      drawLabel(
        ctx,
        "Thrust (action)",
        { x: projection.toScreen(nose).x, y: projection.toScreen(nose).y - 44 },
        ACTION_COLOR,
      );
      drawLabel(
        ctx,
        "Exhaust (reaction)",
        {
          x: projection.toScreen(exhaust).x,
          y: projection.toScreen(exhaust).y - 44,
        },
        REACTION_COLOR,
      );
    }

    if (rig.kind === "spring" && !rig.released) {
      const cartFace = { x: rig.cart.position.x - 0.5, y: rig.cart.position.y };
      const anchorFace = { x: 0.3, y: rig.cart.position.y };
      drawForceVector(
        ctx,
        projection,
        cartFace,
        readouts.forceOnA,
        0,
        ACTION_COLOR,
        lineWidth,
        0.15,
      );
      drawForceVector(
        ctx,
        projection,
        anchorFace,
        readouts.forceOnB,
        0,
        REACTION_COLOR,
        lineWidth,
        0.15,
      );
    }
  };

  return (
    <SimulationCanvas
      ariaLabel="Newton's Third Law scenario view"
      render={render}
      showGrid={false}
      showAxes={false}
      className="min-h-[280px] sm:min-h-[360px]"
    />
  );
}
