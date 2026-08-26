import type { CanvasSize, Point2D, Viewport } from "@/features/simulation";

/**
 * Circular motion is naturally center-anchored (the framework's
 * default `worldToScreen` already centers the origin), but this
 * simulation still defines its own projection — like
 * `projectile-motion/canvas-helpers.ts` does — so the circle always
 * scales to fit the canvas as the radius slider changes, with the
 * user's zoom applied on top.
 */
export interface CircularProjection {
  toScreen: (world: Point2D) => Point2D;
  pxPerMeter: number;
  centerX: number;
  centerY: number;
}

const MARGIN = 48;

export function createProjection(size: CanvasSize, viewport: Viewport, radiusM: number): CircularProjection {
  const usable = Math.max(1, Math.min(size.width, size.height) - MARGIN * 2);
  // Fit the circle (plus a little room for vector arrows extending past it) at zoom 1.
  const baseScale = usable / (radiusM * 2 * 1.35);
  const pxPerMeter = baseScale * viewport.zoom;

  const centerX = size.width / 2 + viewport.offset.x * pxPerMeter;
  const centerY = size.height / 2 - viewport.offset.y * pxPerMeter;

  const toScreen = (world: Point2D): Point2D => ({
    x: centerX + world.x * pxPerMeter,
    y: centerY - world.y * pxPerMeter,
  });

  return { toScreen, pxPerMeter, centerX, centerY };
}

/** Draws a simple arrowhead at `tip`, pointing along the direction from `tail` to `tip`. */
export function drawArrow(
  ctx: CanvasRenderingContext2D,
  tail: Point2D,
  tip: Point2D,
  color: string,
  lineWidth = 2.5,
) {
  const dx = tip.x - tail.x;
  const dy = tip.y - tail.y;
  const len = Math.hypot(dx, dy);
  if (len < 1) return;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(tail.x, tail.y);
  ctx.lineTo(tip.x, tip.y);
  ctx.stroke();

  const headLength = Math.min(10, len * 0.5);
  const angle = Math.atan2(dy, dx);
  ctx.beginPath();
  ctx.moveTo(tip.x, tip.y);
  ctx.lineTo(
    tip.x - headLength * Math.cos(angle - Math.PI / 6),
    tip.y - headLength * Math.sin(angle - Math.PI / 6),
  );
  ctx.lineTo(
    tip.x - headLength * Math.cos(angle + Math.PI / 6),
    tip.y - headLength * Math.sin(angle + Math.PI / 6),
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
