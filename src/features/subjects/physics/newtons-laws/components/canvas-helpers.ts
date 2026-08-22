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

// ---------------------------------------------------------------------------
// Realistic experiment surface + object — a solid platform (reads as a
// lab bench/table) and a shaded, textured object standing on it, so the
// cart is a recognizable physical thing rather than a flat colored
// rectangle. Drawn with canvas gradients/paths only, matching the
// Projectile Motion redesign's approach — no external image assets.
// ---------------------------------------------------------------------------

/** Solid platform slab beneath the ground line, giving the surface visible thickness/material instead of a bare stroke. */
export function drawPlatformSurface(
  ctx: CanvasRenderingContext2D,
  size: CanvasSize,
  projection: Projection,
  isDark: boolean,
  surfaceLabel?: string,
) {
  ctx.save();
  const slabHeight = Math.max(10, Math.min(18, size.height * 0.035));
  const slab = ctx.createLinearGradient(
    0,
    projection.groundY,
    0,
    projection.groundY + slabHeight,
  );
  if (isDark) {
    slab.addColorStop(0, "#23342E");
    slab.addColorStop(1, "#141F1A");
  } else {
    slab.addColorStop(0, "#D9E0D6");
    slab.addColorStop(1, "#C3CDC0");
  }
  ctx.fillStyle = slab;
  ctx.fillRect(0, projection.groundY, size.width, slabHeight);

  ctx.strokeStyle = isDark ? "rgba(231,236,232,0.4)" : "rgba(20,32,25,0.32)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, projection.groundY);
  ctx.lineTo(size.width, projection.groundY);
  ctx.stroke();

  if (surfaceLabel) {
    ctx.fillStyle = isDark
      ? "rgba(231,236,232,0.4)"
      : "rgba(20,32,25,0.4)";
    ctx.font = "600 10px ui-monospace, monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(
      surfaceLabel.toUpperCase(),
      8,
      projection.groundY + slabHeight + 4,
    );
  }
  ctx.restore();
}

export type ObjectKind = "box" | "crate" | "sled";

/**
 * The pushed/pulled object itself, drawn as one of three recognizable
 * physical things (chosen by the Object selector) rather than a flat
 * rectangle — a cardboard box with tape and flaps, a wooden crate with
 * plank seams and corner brackets, or a steel cart on small wheels.
 * `widthPx`/`heightPx` come from the body's actual rect shape, so the
 * drawing always matches the collision box the physics is using.
 */
export function drawRealisticObject(
  ctx: CanvasRenderingContext2D,
  screenCenter: Point2D,
  widthPx: number,
  heightPx: number,
  kind: ObjectKind,
  baseColor: string,
  isDark: boolean,
) {
  const x = -widthPx / 2;
  const y = -heightPx / 2;

  ctx.save();
  ctx.translate(screenCenter.x, screenCenter.y);

  // Soft contact shadow, common to all three objects.
  ctx.save();
  ctx.globalAlpha = isDark ? 0.35 : 0.22;
  ctx.fillStyle = isDark ? "#000000" : "#142019";
  ctx.beginPath();
  ctx.ellipse(0, heightPx / 2 + 3, widthPx * 0.55, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  if (kind === "crate") {
    drawWoodenCrate(ctx, x, y, widthPx, heightPx, baseColor, isDark);
  } else if (kind === "sled") {
    drawSteelCart(ctx, x, y, widthPx, heightPx, baseColor, isDark);
  } else {
    drawCardboardBox(ctx, x, y, widthPx, heightPx, baseColor, isDark);
  }

  ctx.restore();
}

function shadeBody(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  baseColor: string,
  isDark: boolean,
) {
  const grad = ctx.createLinearGradient(x, y, x, y + h);
  grad.addColorStop(0, lighten(baseColor, isDark ? 0.18 : 0.28));
  grad.addColorStop(0.55, baseColor);
  grad.addColorStop(1, lighten(baseColor, -0.22));
  ctx.fillStyle = grad;
  ctx.fillRect(x, y, w, h);
}

function lighten(hex: string, amount: number): string {
  const c = hex.replace("#", "");
  const num = parseInt(c.length === 3 ? c.split("").map((ch) => ch + ch).join("") : c, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  const adjust = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v + (amount >= 0 ? (255 - v) * amount : v * amount))));
  r = adjust(r);
  g = adjust(g);
  b = adjust(b);
  return `rgb(${r}, ${g}, ${b})`;
}

/** Cardboard box: kraft-brown body, a darker seam line down the middle (box flap join) and a strip of tape. */
function drawCardboardBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  accent: string,
  isDark: boolean,
) {
  const cardboard = isDark ? "#8A6B47" : "#C69C6D";
  shadeBody(ctx, x, y, w, h, cardboard, isDark);

  ctx.save();
  ctx.strokeStyle = isDark ? "rgba(20,15,8,0.55)" : "rgba(90,60,25,0.45)";
  ctx.lineWidth = 1;
  // Flap seam down the center.
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y);
  ctx.lineTo(x + w / 2, y + h);
  ctx.stroke();
  // Top flap fold lines.
  ctx.beginPath();
  ctx.moveTo(x, y + h * 0.18);
  ctx.lineTo(x + w, y + h * 0.18);
  ctx.stroke();
  ctx.restore();

  // Tape strip in the accent color, so the Object selector's color still reads at a glance.
  ctx.save();
  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.85;
  ctx.fillRect(x + w / 2 - Math.max(2, w * 0.045), y, Math.max(4, w * 0.09), h);
  ctx.restore();

  ctx.strokeStyle = isDark ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.28)";
  ctx.lineWidth = 1.25;
  ctx.strokeRect(x, y, w, h);
}

/** Wooden crate: plank seams, a knot or two, and small corner brackets. */
function drawWoodenCrate(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  accent: string,
  isDark: boolean,
) {
  const wood = isDark ? "#8A5A2B" : "#B47A3C";
  shadeBody(ctx, x, y, w, h, wood, isDark);

  ctx.save();
  ctx.strokeStyle = isDark ? "rgba(20,10,0,0.55)" : "rgba(70,40,10,0.4)";
  ctx.lineWidth = 1;
  const planks = 3;
  for (let i = 1; i < planks; i++) {
    const px = x + (w / planks) * i;
    ctx.beginPath();
    ctx.moveTo(px, y);
    ctx.lineTo(px, y + h);
    ctx.stroke();
  }
  // A couple of knots for texture.
  ctx.fillStyle = isDark ? "rgba(20,10,0,0.4)" : "rgba(70,40,10,0.3)";
  ctx.beginPath();
  ctx.ellipse(x + w * 0.2, y + h * 0.35, 2, 3, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Corner brackets in the accent color (steel-blue by default, but this
  // reflects whatever the Object selector's accent is).
  ctx.save();
  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.9;
  const bracket = Math.max(3, w * 0.07);
  for (const [cx, cy] of [
    [x, y],
    [x + w - bracket, y],
    [x, y + h - bracket],
    [x + w - bracket, y + h - bracket],
  ] as const) {
    ctx.fillRect(cx, cy, bracket, bracket);
  }
  ctx.restore();

  ctx.strokeStyle = isDark ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.3)";
  ctx.lineWidth = 1.25;
  ctx.strokeRect(x, y, w, h);
}

/** Steel cart: a metal body on two small wheels, riveted edges — the "trolley" reading, and the only preset that visibly rolls. */
function drawSteelCart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  accent: string,
  isDark: boolean,
) {
  const bodyH = h * 0.78;
  shadeBody(ctx, x, y, w, bodyH, accent, isDark);

  ctx.save();
  ctx.strokeStyle = isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)";
  ctx.lineWidth = 1;
  // Horizontal ribbing, a common sheet-metal cue.
  for (let i = 1; i < 3; i++) {
    const ly = y + (bodyH / 3) * i;
    ctx.beginPath();
    ctx.moveTo(x + 2, ly);
    ctx.lineTo(x + w - 2, ly);
    ctx.stroke();
  }
  ctx.restore();
  ctx.strokeStyle = isDark ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.3)";
  ctx.lineWidth = 1.25;
  ctx.strokeRect(x, y, w, bodyH);

  // Wheels, tucked under the body — small enough to read as detail, not
  // a vehicle, and static (not rotated) since this rig has no wheel
  // angular-velocity model; they're a visual "this rolls" cue only.
  const wheelR = Math.max(3, h * 0.14);
  const wheelY = y + bodyH;
  for (const wx of [x + w * 0.22, x + w * 0.78]) {
    ctx.save();
    ctx.fillStyle = isDark ? "#1A1F1C" : "#2A2F2C";
    ctx.beginPath();
    ctx.arc(wx, wheelY, wheelR, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = isDark ? "#6B7A73" : "#8A968E";
    ctx.beginPath();
    ctx.arc(wx, wheelY, wheelR * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
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
