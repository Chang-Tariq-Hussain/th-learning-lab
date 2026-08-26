"use client";

import {
  SimulationCanvas,
  useCanvasViewport,
  type SimulationCanvasRenderInfo,
} from "@/features/simulation";
import { useEffect, useRef, useState } from "react";
import type { CartEngine, CartSnapshot } from "../cart-engine";
import { CART_HALF_WIDTH_M, CART_TRACK_LIMIT_M } from "../physics";
import {
  createProjection,
  drawForceVector,
  drawLabel,
  drawPlatformSurface,
  drawRealisticObject,
  drawTrackWalls,
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

// Kept in sync with the world span passed to `createProjection` inside
// `render` below — both the canvas draw and the person overlays need to
// agree on exactly how world meters map to screen space, or the two
// people will drift out of sync with the box they're supposed to be
// touching.
const WORLD_SPAN_METERS = (CART_TRACK_LIMIT_M + 1.5) * 2;
// How far (meters) a person's foot anchor sits outside the box's edge
// at rest, closing in as they lean further into their push/pull — the
// same "lean closes the gap" idea the old fixed REST_PCT/ENGAGE_PCT
// percentages used, just measured from the box's real edge now instead
// of a fixed screen position.
const STANDOFF_REST_M = 0.6;
const STANDOFF_ENGAGED_M = 0.35;

function isDarkMode(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

/** World x (meters) → percent from the container's left edge, using the
 *  exact same mapping `createProjection` uses (fixed focus at 0, same
 *  world span, same margin) so a person anchored here lines up with
 *  where the canvas actually draws the box's edge. */
function worldXToPercent(
  worldX: number,
  containerWidthPx: number,
  zoom: number,
  offsetX: number,
): number {
  if (containerWidthPx <= 0) return 50;
  const usableWidth = Math.max(1, containerWidthPx - 48);
  const pxPerMeter = (usableWidth / WORLD_SPAN_METERS) * zoom;
  const centerX = containerWidthPx / 2;
  const screenX = centerX + (worldX + offsetX) * pxPerMeter;
  return Math.max(0, Math.min(100, (screenX / containerWidthPx) * 100));
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
 *
 * The projection's focus point is fixed at world x = 0 (the track's
 * center), never at `cart.position.x` — a camera that re-centers on
 * the box every frame would keep it visually glued to the middle of
 * the screen no matter how fast it's actually moving, which is exactly
 * the "diagram, not experiment" problem this redesign fixes. With a
 * fixed focus, the box's screen position is a direct, undisguised
 * readout of its physics state, and it visibly travels toward the
 * track walls drawn by `drawTrackWalls` (see `CART_TRACK_LIMIT_M` in
 * `physics.ts`), which is also where `cart-engine.ts` physically stops
 * it, so the wall the student sees is the same wall the physics obeys.
 *
 * Because the box now really moves, the two person overlays can no
 * longer sit at fixed screen stations (that was the old camera-follows
 * design, where the box never left the center) — a fixed-station
 * person would have the box slide past or behind them the moment it
 * traveled more than a few centimeters. Instead each person's screen
 * position is recomputed from `readouts.positionX` (the box's live
 * world x) every ~100ms tick via `worldXToPercent`, so they stay
 * visually attached to whichever edge of the box they're push/pulling.
 */
export function CartCanvas({ engine, snapshot, options }: CartCanvasProps) {
  const { readouts } = snapshot;
  const isDark = isDarkMode();
  const { viewport } = useCanvasViewport();

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) setContainerWidth(width);
    });
    observer.observe(el);
    setContainerWidth(el.clientWidth);
    return () => observer.disconnect();
  }, []);

  const render = (
    ctx: CanvasRenderingContext2D,
    info: SimulationCanvasRenderInfo,
  ) => {
    const { size, viewport } = info;
    const cart = engine.rig.cart;
    const dark = isDarkMode();

    // Fixed focus (world x = 0), NOT cart.position.x — see doc comment
    // above. World span covers the track plus a small margin past each
    // wall so the walls themselves stay on-screen at the limit.
    const projection = createProjection(size, viewport, 0, WORLD_SPAN_METERS);
    const surfaceLabel = (cart.userData.surfaceLabel as string) ?? undefined;
    drawPlatformSurface(ctx, size, projection, dark, surfaceLabel);
    drawTrackWalls(ctx, projection, dark, CART_TRACK_LIMIT_M);

    let halfWidthM = CART_HALF_WIDTH_M;
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

    // Push points the arrow into the box (away from that person); pull
    // points it out toward the person (the direction of the tension
    // actually pulling the box) — see `signedForce` in physics.ts,
    // which this mirrors exactly so the arrow can never disagree with
    // what the physics is doing.
    const leftArrowX = readouts.leftForce * (engine.leftMode === "push" ? 1 : -1);
    const rightArrowX = readouts.rightForce * (engine.rightMode === "push" ? -1 : 1);

    if (options.showVectors) {
      // Left force — originates at the box's left edge.
      if (readouts.leftForce > 0.5) {
        drawForceVector(
          ctx,
          projection,
          leftEdge,
          leftArrowX,
          0,
          LEFT_COLOR,
          vectorWidth,
        );
        if (options.showForceLabels) {
          const tip = projection.toScreen(leftEdge);
          drawLabel(
            ctx,
            `${readouts.leftForce.toFixed(0)} N`,
            { x: tip.x + leftArrowX * 0.3, y: tip.y - 10 },
            LEFT_COLOR,
          );
        }
      }
      // Right force — mirrors the left: originates at the box's right edge.
      if (readouts.rightForce > 0.5) {
        drawForceVector(
          ctx,
          projection,
          rightEdge,
          rightArrowX,
          0,
          RIGHT_COLOR,
          vectorWidth,
        );
        if (options.showForceLabels) {
          const tip = projection.toScreen(rightEdge);
          drawLabel(
            ctx,
            `${readouts.rightForce.toFixed(0)} N`,
            { x: tip.x + rightArrowX * 0.3, y: tip.y - 10 },
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

  const leftStandoff = STANDOFF_REST_M - engine.leftLean * (STANDOFF_REST_M - STANDOFF_ENGAGED_M);
  const rightStandoff = STANDOFF_REST_M - engine.rightLean * (STANDOFF_REST_M - STANDOFF_ENGAGED_M);
  const leftWorldX = readouts.positionX - CART_HALF_WIDTH_M - leftStandoff;
  const rightWorldX = readouts.positionX + CART_HALF_WIDTH_M + rightStandoff;
  const leftPersonPercent = worldXToPercent(leftWorldX, containerWidth, viewport.zoom, viewport.offset.x);
  const rightPersonPercent = worldXToPercent(rightWorldX, containerWidth, viewport.zoom, viewport.offset.x);

  return (
    <div ref={containerRef} className="relative">
      {/*
        Pan/zoom is switched off for this canvas (`pointer-events-none`)
        so no pointer interaction on the canvas itself — background,
        floor, or box — can ever move the camera or relocate anything.
        The two person overlays below track the box's real screen
        position (via `worldXToPercent`, computed from `readouts.positionX`)
        rather than sitting at a fixed station, so the box can never
        visually slide past or behind either of them.
      */}
      <SimulationCanvas
        ariaLabel="A box on a surface, flanked by two people who push or pull it from opposite sides"
        render={render}
        showGrid={false}
        showAxes={false}
        className="pointer-events-none min-h-[280px] sm:min-h-[360px]"
      />

      <PersonDragHandle
        side="left"
        lean={engine.leftLean}
        onLeanChange={engine.setLeftLean}
        mode={engine.leftMode}
        onModeChange={engine.setLeftMode}
        leftPercent={leftPersonPercent}
        forceLabel={`${readouts.leftForce.toFixed(0)} N`}
        color={LEFT_COLOR}
        isDark={isDark}
      />
      <PersonDragHandle
        side="right"
        lean={engine.rightLean}
        onLeanChange={engine.setRightLean}
        mode={engine.rightMode}
        onModeChange={engine.setRightMode}
        leftPercent={rightPersonPercent}
        forceLabel={`${readouts.rightForce.toFixed(0)} N`}
        color={RIGHT_COLOR}
        isDark={isDark}
      />

      {options.showFreeBody ? (
        <div className="absolute right-3 top-3 rounded-lg border border-line bg-white/85 p-2 backdrop-blur dark:border-line-dark dark:bg-chalkboard/85">
          <FreeBodyDiagram
            forces={[
              {
                label: engine.leftMode === "push" ? "Left push" : "Left pull",
                value: readouts.leftForce,
                direction: leftArrowXSign(engine, readouts.leftForce),
                color: LEFT_COLOR,
              },
              {
                label: engine.rightMode === "push" ? "Right push" : "Right pull",
                value: readouts.rightForce,
                direction: rightArrowXSign(engine, readouts.rightForce),
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

function leftArrowXSign(engine: CartEngine, magnitude: number): "left" | "right" {
  if (magnitude <= 0) return "right";
  return engine.leftMode === "push" ? "right" : "left";
}

function rightArrowXSign(engine: CartEngine, magnitude: number): "left" | "right" {
  if (magnitude <= 0) return "left";
  return engine.rightMode === "push" ? "left" : "right";
}
