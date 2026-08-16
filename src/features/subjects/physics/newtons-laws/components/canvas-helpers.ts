import type { CanvasSize, Point2D, Viewport } from "@/features/simulation";

export interface Projection {
  toScreen: (world: Point2D) => Point2D;
  pxPerMeter: number;
  groundY: number;
}

const TOP_MARGIN = 32;
const GROUND_MARGIN = 44;

/** Centers the view horizontally on `focusX` (world meters) rather than anchoring at a fixed left edge — Newton's Laws scenes move both left and right, unlike Projectile Motion's always-rightward arc. */
export function createProjection(
  size: CanvasSize,
  viewport: Viewport,
  focusX: number,
  worldSpanMeters: number,
): Projection {
  const usableWidth = Math.max(1, size.width - 48);
  const baseScale = usableWidth / Math.max(worldSpanMeters, 4);
  const pxPerMeter = baseScale * viewport.zoom;
  const groundY = size.height - GROUND_MARGIN;
  const centerX = size.width / 2;

  const toScreen = (world: Point2D): Point2D => ({
    x: centerX + (world.x - focusX + viewport.offset.x) * pxPerMeter,
    y: groundY - (world.y + viewport.offset.y) * pxPerMeter,
  });

  return { toScreen, pxPerMeter, groundY };
}

export function drawGround(
  ctx: CanvasRenderingContext2D,
  size: CanvasSize,
  projection: Projection,
  isDark: boolean,
) {
  ctx.save();
  ctx.strokeStyle = isDark ? "rgba(231,236,232,0.35)" : "rgba(20,32,25,0.35)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, projection.groundY);
  ctx.lineTo(size.width, projection.groundY);
  ctx.stroke();

  // Hatching, the universal "this is a solid surface" cue.
  ctx.strokeStyle = isDark ? "rgba(231,236,232,0.15)" : "rgba(20,32,25,0.12)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = -20; x < size.width + 20; x += 14) {
    ctx.moveTo(x, projection.groundY + 4);
    ctx.lineTo(x - 8, projection.groundY + 14);
  }
  ctx.stroke();
  ctx.restore();
}

export function drawArrow(
  ctx: CanvasRenderingContext2D,
  from: Point2D,
  to: Point2D,
  color: string,
  lineWidth = 2.5,
) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (Math.hypot(dx, dy) < 1) return;
  const angle = Math.atan2(dy, dx);
  const headLength = 8;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(
    to.x - headLength * Math.cos(angle - Math.PI / 6),
    to.y - headLength * Math.sin(angle - Math.PI / 6),
  );
  ctx.lineTo(
    to.x - headLength * Math.cos(angle + Math.PI / 6),
    to.y - headLength * Math.sin(angle + Math.PI / 6),
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** Force vector in Newtons, scaled to stay legible across the slider's 0-200N range. */
export function drawForceVector(
  ctx: CanvasRenderingContext2D,
  projection: Projection,
  world: Point2D,
  forceX: number,
  forceY: number,
  color: string,
  lineWidth = 2.5,
  pxPerNewton = 0.6,
) {
  const from = projection.toScreen(world);
  const to = {
    x: from.x + forceX * pxPerNewton,
    y: from.y - forceY * pxPerNewton,
  };
  drawArrow(ctx, from, to, color, lineWidth);
}

export function drawVelocityVector(
  ctx: CanvasRenderingContext2D,
  projection: Projection,
  world: Point2D,
  vx: number,
  vy: number,
  color: string,
  lineWidth = 2.5,
  pxPerMS = 6,
) {
  const from = {
    x: projection.toScreen(world).x,
    y: projection.toScreen(world).y - 26,
  };
  const to = { x: from.x + vx * pxPerMS, y: from.y };
  drawArrow(ctx, from, to, color, lineWidth);
}

export function drawLabel(
  ctx: CanvasRenderingContext2D,
  text: string,
  screenPoint: Point2D,
  color: string,
  align: CanvasTextAlign = "center",
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = "600 11px ui-monospace, monospace";
  ctx.textAlign = align;
  ctx.fillText(text, screenPoint.x, screenPoint.y);
  ctx.restore();
}
