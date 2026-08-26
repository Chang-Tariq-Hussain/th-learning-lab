import type { CanvasSize, Point2D, Viewport } from "@/features/simulation";

/** Screen-centered projection, like `circular-motion/components/canvas-helpers.ts` — the central body sits at the world origin, which stays at the canvas center regardless of how far the satellite wanders. */
export interface OrbitProjection {
  toScreen: (world: Point2D) => Point2D;
  pxPerMeter: number;
  centerX: number;
  centerY: number;
}

const MARGIN = 40;
/** How many toy-unit "meters" the canvas should show edge-to-edge at zoom 1 — wide enough that a satellite escaping outward stays visible for a while before leaving frame. */
const VIEW_SPAN_UNITS = 18;

export function createProjection(size: CanvasSize, viewport: Viewport): OrbitProjection {
  const usable = Math.max(1, Math.min(size.width, size.height) - MARGIN * 2);
  const baseScale = usable / VIEW_SPAN_UNITS;
  const pxPerMeter = baseScale * viewport.zoom;

  const centerX = size.width / 2 + viewport.offset.x * pxPerMeter;
  const centerY = size.height / 2 - viewport.offset.y * pxPerMeter;

  const toScreen = (world: Point2D): Point2D => ({
    x: centerX + world.x * pxPerMeter,
    y: centerY - world.y * pxPerMeter,
  });

  return { toScreen, pxPerMeter, centerX, centerY };
}

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

export function drawLabel(
  ctx: CanvasRenderingContext2D,
  text: string,
  point: Point2D,
  color: string,
  align: CanvasTextAlign = "center",
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = "600 11px ui-monospace, monospace";
  ctx.textAlign = align;
  ctx.fillText(text, point.x, point.y);
  ctx.restore();
}
