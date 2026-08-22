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

// ---------------------------------------------------------------------------
// Realistic experiment scene — platform, launcher device, physical ball,
// ground shadow, and a fading motion trail. Everything is drawn with
// canvas primitives (gradients/arcs/paths) rather than external images so
// the visual stays crisp at any size and themes with the existing design
// tokens. Kept in this file, alongside the existing draw* helpers, so the
// scene composition lives in one place and `projectile-canvas.tsx` stays a
// thin "what to draw, in what order" list.
// ---------------------------------------------------------------------------

/** Muted platform + soft backdrop so the trajectory reads as a real tabletop experiment, not a graph. */
export function drawPlatform(
  ctx: CanvasRenderingContext2D,
  size: CanvasSize,
  projection: ProjectileProjection,
  isDark: boolean
) {
  ctx.save();

  // Faint backdrop wash above the ground — a hint of depth, not a scene.
  const backdrop = ctx.createLinearGradient(0, 0, 0, projection.groundY);
  backdrop.addColorStop(0, isDark ? "rgba(231,236,232,0.02)" : "rgba(20,32,25,0.015)");
  backdrop.addColorStop(1, isDark ? "rgba(231,236,232,0)" : "rgba(20,32,25,0)");
  ctx.fillStyle = backdrop;
  ctx.fillRect(0, 0, size.width, projection.groundY);

  // Solid platform slab below the ground line — reads as a lab bench/table edge.
  const slabHeight = Math.max(10, Math.min(18, size.height * 0.035));
  const slab = ctx.createLinearGradient(0, projection.groundY, 0, projection.groundY + slabHeight);
  if (isDark) {
    slab.addColorStop(0, "#23342E");
    slab.addColorStop(1, "#141F1A");
  } else {
    slab.addColorStop(0, "#D9E0D6");
    slab.addColorStop(1, "#C3CDC0");
  }
  ctx.fillStyle = slab;
  ctx.fillRect(0, projection.groundY, size.width, slabHeight);

  // Crisp top edge of the platform (the "ground line" the ball rolls/lands on).
  ctx.strokeStyle = isDark ? "rgba(231,236,232,0.4)" : "rgba(20,32,25,0.32)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, projection.groundY);
  ctx.lineTo(size.width, projection.groundY);
  ctx.stroke();

  ctx.restore();
}

/**
 * A simple launcher device (angled ramp/barrel on a stand) at the origin,
 * rotated to match the launch angle so direction and angle are visible at
 * a glance rather than left to the student's imagination.
 */
export function drawLauncher(
  ctx: CanvasRenderingContext2D,
  projection: ProjectileProjection,
  angleRad: number,
  isDark: boolean
) {
  const origin = projection.toScreen({ x: 0, y: 0 });
  const barrelLength = 46;
  const barrelWidth = 13;

  const metal = isDark ? "#6B7A73" : "#8A968E";
  const metalDark = isDark ? "#3A4A43" : "#5B665F";
  const accent = isDark ? "#818CF8" : "#3D5AFE";

  ctx.save();
  ctx.translate(origin.x, origin.y);

  // Base/stand — a small trapezoid sitting on the platform.
  ctx.fillStyle = metalDark;
  ctx.beginPath();
  ctx.moveTo(-16, 0);
  ctx.lineTo(16, 0);
  ctx.lineTo(10, -10);
  ctx.lineTo(-10, -10);
  ctx.closePath();
  ctx.fill();

  // Pivot hub.
  ctx.beginPath();
  ctx.arc(0, -10, 6, 0, Math.PI * 2);
  ctx.fillStyle = metal;
  ctx.fill();
  ctx.strokeStyle = metalDark;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Barrel, rotated to the launch angle (screen y is flipped vs. world y).
  ctx.rotate(-angleRad);
  const barrel = ctx.createLinearGradient(0, -barrelWidth / 2, 0, barrelWidth / 2);
  barrel.addColorStop(0, metal);
  barrel.addColorStop(0.5, isDark ? "#8F9C95" : "#AEB8AB");
  barrel.addColorStop(1, metalDark);
  ctx.fillStyle = barrel;
  const r = barrelWidth / 2;
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.lineTo(barrelLength, -r * 0.7);
  ctx.lineTo(barrelLength, r * 0.7);
  ctx.lineTo(0, r);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = metalDark;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Muzzle ring — a small accent to mark the exact launch point / direction.
  ctx.beginPath();
  ctx.ellipse(barrelLength, 0, r * 0.72, r * 0.72, 0, 0, Math.PI * 2);
  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.85;
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.restore();
}

/**
 * The projectile itself, drawn as a shaded sphere (radial gradient +
 * rim light) rather than a flat dot, with a faint rolling seam so it
 * reads as a physical ball rather than an abstract marker. Rotation is
 * derived from horizontal distance travelled purely as a visual cue for
 * "this object is really moving," not a physics claim.
 */
export function drawBall(
  ctx: CanvasRenderingContext2D,
  projection: ProjectileProjection,
  world: Point2D,
  radiusPx: number,
  isDark: boolean,
  spinRad: number
) {
  const p = projection.toScreen(world);

  ctx.save();
  ctx.translate(p.x, p.y);

  // Soft contact shadow directly beneath, independent of rotation.
  ctx.restore();
  ctx.save();

  const base = isDark ? "#E7ECE8" : "#142019";
  const highlight = isDark ? "#FFFFFF" : "#5B6A62";

  const grad = ctx.createRadialGradient(
    p.x - radiusPx * 0.35,
    p.y - radiusPx * 0.4,
    radiusPx * 0.15,
    p.x,
    p.y,
    radiusPx * 1.15
  );
  grad.addColorStop(0, highlight);
  grad.addColorStop(0.55, base);
  grad.addColorStop(1, isDark ? "#9AA7A0" : "#0A100D");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(p.x, p.y, radiusPx, 0, Math.PI * 2);
  ctx.fill();

  // Rolling seam — a thin ellipse that rotates with travelled distance,
  // the same visual language as a spinning ball, to make continuous
  // motion (vs. teleporting between frames) legible.
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(spinRad);
  ctx.strokeStyle = isDark ? "rgba(20,32,25,0.45)" : "rgba(231,236,232,0.55)";
  ctx.lineWidth = Math.max(1, radiusPx * 0.12);
  ctx.beginPath();
  ctx.ellipse(0, 0, radiusPx * 0.85, radiusPx * 0.32, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

/** Contact shadow projected straight down onto the ground/platform, shrinking with height for a cheap but effective depth cue. */
export function drawGroundShadow(
  ctx: CanvasRenderingContext2D,
  projection: ProjectileProjection,
  world: Point2D,
  radiusPx: number,
  isDark: boolean
) {
  const ground = projection.toScreen({ x: world.x, y: 0 });
  const heightPx = Math.max(0, projection.groundY - projection.toScreen(world).y);
  const falloff = 1 / (1 + heightPx / 140);
  const shadowW = radiusPx * (1.3 + falloff * 0.9);
  const shadowH = Math.max(2, radiusPx * 0.32 * falloff);

  ctx.save();
  ctx.globalAlpha = 0.28 * falloff + 0.06;
  ctx.fillStyle = isDark ? "#000000" : "#142019";
  ctx.beginPath();
  ctx.ellipse(ground.x, ground.y, shadowW, shadowH, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Fading dot trail (rather than a uniform solid line) — dot spacing visibly compresses near the peak and stretches on the way down, echoing the projectile's changing speed. */
export function drawMotionTrail(
  ctx: CanvasRenderingContext2D,
  projection: ProjectileProjection,
  trajectory: Trajectory,
  upToTime: number,
  color: string,
  isDark: boolean
) {
  const stepSeconds = Math.max(trajectory.timeOfFlight / 22, 0.02);
  ctx.save();
  let nextT = 0;
  for (const point of trajectory.points) {
    if (point.t > upToTime) break;
    if (point.t < nextT) continue;
    nextT += stepSeconds;
    const age = upToTime > 0 ? 1 - point.t / upToTime : 0;
    const p = projection.toScreen(point);
    ctx.globalAlpha = Math.max(0.08, 0.55 - age * 0.45);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  void isDark;
}

/** Small flag marking where the ball lands — reads immediately as "landing point" without a legend. */
export function drawLandingFlag(
  ctx: CanvasRenderingContext2D,
  projection: ProjectileProjection,
  world: Point2D,
  color: string
) {
  const base = projection.toScreen(world);
  const poleHeight = 26;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(base.x, base.y);
  ctx.lineTo(base.x, base.y - poleHeight);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(base.x, base.y - poleHeight);
  ctx.lineTo(base.x + 14, base.y - poleHeight + 5);
  ctx.lineTo(base.x, base.y - poleHeight + 10);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();

  // Small ground mark so the exact landing x is unambiguous even if the
  // flag is visually tall relative to a short flight.
  ctx.beginPath();
  ctx.ellipse(base.x, base.y, 5, 2, 0, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();
}

/** Dashed guide from the trajectory's peak down to the ground, labeled with the max-height value so the number sits next to what it measures. */
export function drawMaxHeightGuide(
  ctx: CanvasRenderingContext2D,
  projection: ProjectileProjection,
  world: Point2D,
  color: string,
  isDark: boolean
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
  ctx.arc(peak.x, peak.y, 3, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
  void isDark;
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
