"use client";

import {
  SimulationCanvas,
  type SimulationCanvasRenderInfo,
} from "@/features/simulation";
import { drawWorld } from "@/features/subjects/physics/engine";
import type { CartEngine, CartSnapshot } from "../cart-engine";
import {
  createProjection,
  drawForceVector,
  drawGround,
  drawLabel,
  drawVelocityVector,
} from "./canvas-helpers";
import { FreeBodyDiagram } from "./free-body-diagram";

export interface CartDisplayOptions {
  showVectors: boolean;
  showFreeBody: boolean;
  showForceLabels: boolean;
  highlightVectors: boolean;
}

export interface CartCanvasProps {
  engine: CartEngine;
  snapshot: CartSnapshot;
  options: CartDisplayOptions;
}

function isDarkMode(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

export function CartCanvas({ engine, snapshot, options }: CartCanvasProps) {
  const { readouts } = snapshot;

  const render = (
    ctx: CanvasRenderingContext2D,
    info: SimulationCanvasRenderInfo,
  ) => {
    const { size, viewport } = info;
    const cart = engine.rig.cart;
    const isDark = isDarkMode();

    const projection = createProjection(size, viewport, cart.position.x, 20);
    drawGround(ctx, size, projection, isDark);

    drawWorld(
      ctx,
      engine.rig.world,
      projection.toScreen,
      projection.pxPerMeter,
      (body) => ({
        fill: (body.userData.color as string) ?? "#7C4FE0",
        stroke: "transparent",
      }),
    );

    const vectorWidth = options.highlightVectors ? 4 : 2.5;
    const cartTop = {
      x: cart.position.x,
      y: cart.shape.kind === "rect" ? cart.shape.height / 2 : 0.5,
    };

    if (options.showVectors) {
      if (Math.abs(readouts.appliedForce) > 0.1) {
        drawForceVector(
          ctx,
          projection,
          cartTop,
          readouts.appliedForce,
          0,
          "#3D5AFE",
          vectorWidth,
        );
        if (options.showForceLabels) {
          const tip = projection.toScreen(cartTop);
          drawLabel(
            ctx,
            `F_applied = ${readouts.appliedForce.toFixed(0)} N`,
            { x: tip.x + readouts.appliedForce * 0.6, y: tip.y - 8 },
            "#3D5AFE",
          );
        }
      }
      if (Math.abs(readouts.frictionForce) > 0.1) {
        drawForceVector(
          ctx,
          projection,
          cartTop,
          readouts.frictionForce,
          0,
          "#E0524F",
          vectorWidth,
        );
        if (options.showForceLabels) {
          const tip = projection.toScreen(cartTop);
          drawLabel(
            ctx,
            `F_friction = ${readouts.frictionForce.toFixed(0)} N`,
            { x: tip.x + readouts.frictionForce * 0.6, y: tip.y + 18 },
            "#E0524F",
          );
        }
      }
      if (Math.abs(cart.velocity.x) > 0.05) {
        drawVelocityVector(
          ctx,
          projection,
          cart.position,
          cart.velocity.x,
          0,
          "#2E9E5B",
          vectorWidth,
        );
      }
    }

    // Weight / normal — always drawn thin, since they're always present and equal on level ground (the Law 1 "balanced forces" case).
    const base = { x: cart.position.x, y: 0 };
    const weightColor = isDark ? "rgba(224,82,79,0.55)" : "rgba(224,82,79,0.5)";
    const normalColor = isDark ? "rgba(61,90,254,0.55)" : "rgba(61,90,254,0.5)";
    drawForceVector(
      ctx,
      projection,
      cartTop,
      0,
      -readouts.weight,
      weightColor,
      1.5,
      0.04,
    );
    drawForceVector(
      ctx,
      projection,
      base,
      0,
      readouts.normalForce,
      normalColor,
      1.5,
      0.04,
    );
  };

  const forceOnColor = "#3D5AFE";
  const frictionColor = "#E0524F";

  return (
    <div className="relative">
      <SimulationCanvas
        ariaLabel="Cart on a surface, with applied force and friction"
        render={render}
        showGrid={false}
        showAxes={false}
        className="min-h-[280px] sm:min-h-[360px]"
      />
      {options.showFreeBody ? (
        <div className="absolute right-3 top-3 rounded-lg border border-line bg-white/85 p-2 backdrop-blur dark:border-line-dark dark:bg-chalkboard/85">
          <FreeBodyDiagram
            forces={[
              {
                label: "Applied",
                value: readouts.appliedForce,
                direction: "right",
                color: forceOnColor,
              },
              {
                label: "Friction",
                value: -readouts.frictionForce,
                direction: "left",
                color: frictionColor,
              },
              {
                label: "Weight",
                value: readouts.weight,
                direction: "down",
                color: "#E0524F",
              },
              {
                label: "Normal",
                value: readouts.normalForce,
                direction: "up",
                color: "#3D5AFE",
              },
            ]}
          />
        </div>
      ) : null}
    </div>
  );
}
