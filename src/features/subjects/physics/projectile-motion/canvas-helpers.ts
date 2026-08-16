import type { CanvasSize, Point2D, Viewport } from "@/features/simulation";
import type { Trajectory } from "./physics";

/**
 * The framework's default `worldToScreen` centers the origin in the
 * middle of the canvas, which suits simulations that move in every
 * direction. Projectile motion only ever moves up-and-right from the
 * launch point, so this simulation defines its own bottom-left-anchored
 * projection instead of fighting the centered default. Pan/zoom
 * (`viewport`) still comes from the shared `useCanvasViewport` — only the
 * anchor point changes.
 */
export interface ProjectileProjection {
  toScreen: (world: Point2D) => Point2D;
  /** World-space width of one screen pixel — useful for hit-testing. */
  pxPerMeter: number;
  groundY: number;
}

const LEFT_MARGIN = 56;
const TOP_MARGIN = 32;
const GROUND_MARGIN = 40;

export function createProjection(
  size: CanvasSize,
  viewport: Viewport,
  trajectory: Trajectory
): ProjectileProjection {
  const usableWidth = Math.max(1, size.width - LEFT_MARGIN - 24);
  const usableHeight = Math.max(1, size.height - TOP_MARGIN - GROUND_MARGIN);

  const maxX = Math.max(trajectory.range, 10);
  const maxY = Math.max(trajectory.maxHeight, 5);

  // Fit the whole trajectory with ~15% headroom, then apply the user's zoom on top.
  const baseScale = Math.min(usableWidth / (maxX * 1.15), usableHeight / (maxY * 1.3));
  const pxPerMeter = baseScale * viewport.zoom;

  const groundY = size.height - GROUND_MARGIN;

  const toScreen = (world: Point2D): Point2D => ({
    x: LEFT_MARGIN + (world.x + viewport.offset.x) * pxPerMeter,
    y: groundY - (world.y + viewport.offset.y) * pxPerMeter,
  });

  return { toScreen, pxPerMeter, groundY };
}

const gridColor = (isDark: boolean) => (isDark ? "rgba(231,236,232,0.08)" : "rgba(20,32,25,0.06)");
const axisColor = (isDark: boolean) => (isDark ? "rgba(231,236,232,0.35)" : "rgba(20,32,25,0.35)");

export function drawGroundAndGrid(
  ctx: CanvasRenderingContext2D,
  size: CanvasSize,
  projection: ProjectileProjection,
  options: { showGrid: boolean; showLabels: boolean; isDark: boolean; maxX: number; maxY: number }
) {
  const { showGrid, showLabels, isDark, maxX, maxY } = options;
  const step = niceStep(Math.max(maxX, maxY) / 8);

  if (showGrid) {
    ctx.save();
    ctx.strokeStyle = gridColor(isDark);
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= maxX * 1.2; x += step) {
      const p = projection.toScreen({ x, y: 0 });
      ctx.moveTo(p.x, TOP_MARGIN);
      ctx.lineTo(p.x, projection.groundY);
    }
    for (let y = 0; y <= maxY * 1.3; y += step) {
      const p = projection.toScreen({ x: 0, y });
      ctx.moveTo(LEFT_MARGIN, p.y);
      ctx.lineTo(size.width - 12, p.y);
    }
    ctx.stroke();
    ctx.restore();
  }

  // Ground line
  ctx.save();
  ctx.strokeStyle = axisColor(isDark);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(LEFT_MARGIN, projection.groundY);
  ctx.lineTo(size.width - 12, projection.groundY);
  ctx.stroke();
  // Vertical axis
  ctx.beginPath();
  ctx.moveTo(LEFT_MARGIN, TOP_MARGIN);
  ctx.lineTo(LEFT_MARGIN, projection.groundY);
  ctx.stroke();
  ctx.restore();

  if (showLabels) {
    ctx.save();
    ctx.fillStyle = axisColor(isDark);
    ctx.font = "10px var(--font-mono), monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    for (let x = step; x <= maxX * 1.2; x += step) {
      const p = projection.toScreen({ x, y: 0 });
      ctx.fillText(`${Math.round(x)}`, p.x, projection.groundY + 6);
    }
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (let y = step; y <= maxY * 1.3; y += step) {
      const p = projection.toScreen({ x: 0, y });
      ctx.fillText(`${Math.round(y)}`, LEFT_MARGIN - 8, p.y);
    }
    ctx.restore();
  }
}

function niceStep(rough: number): number {
  if (rough <= 0) return 1;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rough)));
  const residual = rough / magnitude;
  const nice = residual < 1.5 ? 1 : residual < 3.5 ? 2 : residual < 7.5 ? 5 : 10;
  return nice * magnitude;
}

export function drawTrail(
  ctx: CanvasRenderingContext2D,
  projection: ProjectileProjection,
  trajectory: Trajectory,
  upToTime: number,
  color: string
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.setLineDash([]);
  ctx.beginPath();
  let started = false;
  for (const point of trajectory.points) {
    if (point.t > upToTime) break;
    const p = projection.toScreen(point);
    if (!started) {
      ctx.moveTo(p.x, p.y);
      started = true;
    } else {
      ctx.lineTo(p.x, p.y);
    }
  }
  ctx.stroke();
  ctx.restore();
}

export function drawFullPathGhost(
  ctx: CanvasRenderingContext2D,
  projection: ProjectileProjection,
  trajectory: Trajectory,
  color: string
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([3, 5]);
  ctx.beginPath();
  trajectory.points.forEach((point, i) => {
    const p = projection.toScreen(point);
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.stroke();
  ctx.restore();
}

export function drawProjectile(
  ctx: CanvasRenderingContext2D,
  projection: ProjectileProjection,
  world: Point2D,
  color: string,
  radiusPx = 7
) {
  const p = projection.toScreen(world);
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(p.x, p.y, radiusPx, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  from: Point2D,
  to: Point2D,
  color: string,
  lineWidth = 2.5
) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
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
    to.y - headLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    to.x - headLength * Math.cos(angle + Math.PI / 6),
    to.y - headLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** Velocity vector, scaled in screen pixels per (m/s) so it stays legible at any speed. */
export function drawVelocityVector(
  ctx: CanvasRenderingContext2D,
  projection: ProjectileProjection,
  world: Point2D,
  vx: number,
  vy: number,
  color: string,
  pxPerMS = 2.2
) {
  const from = projection.toScreen(world);
  const to = { x: from.x + vx * pxPerMS, y: from.y - vy * pxPerMS };
  drawArrow(ctx, from, to, color);
}

/** Acceleration vector — always straight down for gravity-only motion (drag bends it slightly). */
export function drawAccelerationVector(
  ctx: CanvasRenderingContext2D,
  projection: ProjectileProjection,
  world: Point2D,
  ax: number,
  ay: number,
  color: string,
  pxPerMS2 = 3.2
) {
  const from = projection.toScreen(world);
  const to = { x: from.x + ax * pxPerMS2, y: from.y - ay * pxPerMS2 };
  drawArrow(ctx, from, to, color);
}

export function drawMaxHeightMarker(
  ctx: CanvasRenderingContext2D,
  projection: ProjectileProjection,
  world: Point2D,
  color: string
) {
  const peak = projection.toScreen(world);
  const ground = projection.toScreen({ x: world.x, y: 0 });
  ctx.save();
  ctx.strokeStyle = color;
  ctx.setLineDash([2, 4]);
  ctx.lineWidth = 1.25;
  ctx.beginPath();
  ctx.moveTo(peak.x, peak.y);
  ctx.lineTo(ground.x, ground.y);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.arc(peak.x, peak.y, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

export function drawLandingMarker(
  ctx: CanvasRenderingContext2D,
  projection: ProjectileProjection,
  world: Point2D,
  color: string
) {
  const p = projection.toScreen(world);
  const size = 6;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(p.x - size, p.y - size);
  ctx.lineTo(p.x + size, p.y + size);
  ctx.moveTo(p.x + size, p.y - size);
  ctx.lineTo(p.x - size, p.y + size);
  ctx.stroke();
  ctx.restore();
}

/** Target ring for Challenge Mode — drawn on the ground at a given x, with an optional radius band showing the hit tolerance. */
export function drawTarget(
  ctx: CanvasRenderingContext2D,
  projection: ProjectileProjection,
  x: number,
  toleranceMeters: number,
  color: string
) {
  const center = projection.toScreen({ x, y: 0 });
  const bandWidth = toleranceMeters * projection.pxPerMeter;
  ctx.save();
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.18;
  ctx.beginPath();
  ctx.ellipse(center.x, center.y, Math.max(bandWidth, 6), 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(center.x, center.y, Math.max(bandWidth, 6), 6, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}
