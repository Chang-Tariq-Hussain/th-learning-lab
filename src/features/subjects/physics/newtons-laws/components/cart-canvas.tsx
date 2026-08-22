"use client";

import {
  SimulationCanvas,
  type SimulationCanvasRenderInfo,
} from "@/features/simulation";
import type { CartEngine, CartSnapshot } from "../cart-engine";
import {
  createProjection,
  drawForceVector,
  drawLabel,
  drawPlatformSurface,
  drawRealisticObject,
  drawVelocityVector,
  type ObjectKind,
} from "./canvas-helpers";
import { FreeBodyDiagram } from "./free-body-diagram";
import { PersonDragHandle } from "./person-drag-handle";

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

const LEFT_COLOR = "#3D5AFE";
const RIGHT_COLOR = "#D97706";
const FRICTION_COLOR = "#E0524F";
const NET_COLOR = "#7C4FE0";
const VELOCITY_COLOR = "#2E9E5B";

function isDarkMode(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

/**
 * The cart rig's view: a fixed floor/background rendered on a canvas
 * whose own pan/zoom is switched off (`pointer-events-none`, see below),
 * with the box drawn on it, and two draggable person figures layered on
 * top as ordinary DOM elements. Dragging a person never touches the
 * canvas at all — it only ever changes `engine.rig.state.leftLean` /
 * `rightLean`, which the physics step (in `cart-engine.ts`) reads to
 * compute the applied force. The box's on-screen position comes
 * entirely from `engine.rig.cart.position`, updated by `World.step()` —
 * nothing here ever sets it directly, so it can't be dragged.
 */
export function CartCanvas({ engine, snapshot, options }: CartCanvasProps) {
  const { readouts } = snapshot;
  const isDark = isDarkMode();

  const render = (
    ctx: CanvasRenderingContext2D,
    info: SimulationCanvasRenderInfo,
  ) => {
    const { size, viewport } = info;
    const cart = engine.rig.cart;
    const dark = isDarkMode();

    const projection = createProjection(size, viewport, cart.position.x, 20);
    const surfaceLabel = (cart.userData.surfaceLabel as string) ?? undefined;
    drawPlatformSurface(ctx, size, projection, dark, surfaceLabel);

    let halfWidthM = 0.8;
    if (cart.shape.kind === "rect") {
      halfWidthM = cart.shape.width / 2;
      const screenCenter = projection.toScreen(cart.position);
      const widthPx = cart.shape.width * projection.pxPerMeter;
      const heightPx = cart.shape.height * projection.pxPerMeter;
      const kind = (cart.userData.key as ObjectKind) ?? "box";
      const color = (cart.userData.color as string) ?? "#7C4FE0";
      drawRealisticObject(ctx, screenCenter, widthPx, heightPx, kind, color, dark);
    }

    const vectorWidth = options.highlightVectors ? 4 : 2.5;
    const midHeight = cart.shape.kind === "rect" ? cart.shape.height / 2 : 0.5;
    const leftEdge = { x: cart.position.x - halfWidthM, y: midHeight };
    const rightEdge = { x: cart.position.x + halfWidthM, y: midHeight };

    if (options.showVectors) {
      // Left push — originates at the box's left edge, points right
      // (toward/into the box), sized by how hard the left person is
      // currently leaning in.
      if (readouts.leftForce > 0.5) {
        drawForceVector(
          ctx,
          projection,
          leftEdge,
          readouts.leftForce,
          0,
          LEFT_COLOR,
          vectorWidth,
        );
        if (options.showForceLabels) {
          const tip = projection.toScreen(leftEdge);
          drawLabel(
            ctx,
            `${readouts.leftForce.toFixed(0)} N`,
            { x: tip.x + readouts.leftForce * 0.3, y: tip.y - 10 },
            LEFT_COLOR,
          );
        }
      }
      // Right push — mirrors the left: originates at the box's right
      // edge, points left.
      if (readouts.rightForce > 0.5) {
        drawForceVector(
          ctx,
          projection,
          rightEdge,
          -readouts.rightForce,
          0,
          RIGHT_COLOR,
          vectorWidth,
        );
        if (options.showForceLabels) {
          const tip = projection.toScreen(rightEdge);
          drawLabel(
            ctx,
            `${readouts.rightForce.toFixed(0)} N`,
            { x: tip.x - readouts.rightForce * 0.3, y: tip.y - 10 },
            RIGHT_COLOR,
          );
        }
      }

      if (Math.abs(readouts.frictionForce) > 0.1) {
        drawForceVector(
          ctx,
          projection,
          { x: cart.position.x, y: midHeight },
          readouts.frictionForce,
          0,
          FRICTION_COLOR,
          vectorWidth,
        );
        if (options.showForceLabels) {
          const tip = projection.toScreen({ x: cart.position.x, y: midHeight });
          drawLabel(
            ctx,
            `Friction ${Math.abs(readouts.frictionForce).toFixed(0)} N`,
            { x: tip.x + readouts.frictionForce * 0.6, y: tip.y + 18 },
            FRICTION_COLOR,
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
          VELOCITY_COLOR,
          vectorWidth,
        );
      }

      // Net force — the one arrow the whole scene is building toward.
      // Drawn well above the box (clear of the two pushes) so "what's
      // the net force?" has one obvious answer, not something the
      // student has to compute by comparing the other arrows.
      if (Math.abs(readouts.netForce) > 0.1) {
        const netOrigin = { x: cart.position.x, y: midHeight + 0.6 };
        drawForceVector(
          ctx,
          projection,
          netOrigin,
          readouts.netForce,
          0,
          NET_COLOR,
          vectorWidth + 0.5,
        );
        if (options.showForceLabels) {
          const tip = projection.toScreen(netOrigin);
          drawLabel(
            ctx,
            `F_net = ${readouts.netForce.toFixed(0)} N`,
            { x: tip.x + readouts.netForce * 0.6, y: tip.y - 8 },
            NET_COLOR,
          );
        }
      }

      // Weight / normal — thin, since they're always present and equal
      // on level ground (the Law 1 "balanced forces" case), and only
      // shown alongside the other vectors so turning vectors off truly
      // clears the canvas.
      const base = { x: cart.position.x, y: 0 };
      const weightColor = dark ? "rgba(224,82,79,0.55)" : "rgba(224,82,79,0.5)";
      const normalColor = dark ? "rgba(61,90,254,0.55)" : "rgba(61,90,254,0.5)";
      drawForceVector(ctx, projection, { x: cart.position.x, y: midHeight }, 0, -readouts.weight, weightColor, 1.5, 0.04);
      drawForceVector(ctx, projection, base, 0, readouts.normalForce, normalColor, 1.5, 0.04);
    }
  };

  return (
    <div className="relative">
      {/*
        Pan/zoom is switched off for this canvas (`pointer-events-none`)
        so no pointer interaction on the canvas itself — background,
        floor, or box — can ever move the camera or relocate anything.
        `createProjection` always centers the box at the canvas's
        horizontal midpoint, so the two person overlays below (fixed
        percentages from each edge) stay correctly flanking the box
        without needing to track its world position themselves.
      */}
      <SimulationCanvas
        ariaLabel="A box on a surface, flanked by two people who push it from opposite sides"
        render={render}
        showGrid={false}
        showAxes={false}
        className="pointer-events-none min-h-[280px] sm:min-h-[360px]"
      />

      <PersonDragHandle
        side="left"
        lean={engine.leftLean}
        onLeanChange={engine.setLeftLean}
        forceLabel={`${readouts.leftForce.toFixed(0)} N`}
        color={LEFT_COLOR}
        isDark={isDark}
      />
      <PersonDragHandle
        side="right"
        lean={engine.rightLean}
        onLeanChange={engine.setRightLean}
        forceLabel={`${readouts.rightForce.toFixed(0)} N`}
        color={RIGHT_COLOR}
        isDark={isDark}
      />

      {options.showFreeBody ? (
        <div className="absolute right-3 top-3 rounded-lg border border-line bg-white/85 p-2 backdrop-blur dark:border-line-dark dark:bg-chalkboard/85">
          <FreeBodyDiagram
            forces={[
              {
                label: "Left push",
                value: readouts.leftForce,
                direction: "right",
                color: LEFT_COLOR,
              },
              {
                label: "Right push",
                value: readouts.rightForce,
                direction: "left",
                color: RIGHT_COLOR,
              },
              {
                label: "Friction",
                value: Math.abs(readouts.frictionForce),
                direction: readouts.frictionForce >= 0 ? "right" : "left",
                color: FRICTION_COLOR,
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
