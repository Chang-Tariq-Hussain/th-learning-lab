import type { CanvasSize, Point2D, Viewport } from "../types";

/**
 * Convert a point in "world" (simulation) space to screen/pixel space,
 * given the current pan/zoom viewport and canvas size. World space is
 * centered at the canvas midpoint with the y-axis pointing up, which
 * matches how most physics/math diagrams are conventionally drawn.
 */
export function worldToScreen(
  point: Point2D,
  viewport: Viewport,
  size: CanvasSize
): Point2D {
  return {
    x: size.width / 2 + (point.x + viewport.offset.x) * viewport.zoom,
    y: size.height / 2 - (point.y + viewport.offset.y) * viewport.zoom,
  };
}

/** Inverse of `worldToScreen` — used to translate pointer clicks into world coordinates. */
export function screenToWorld(
  point: Point2D,
  viewport: Viewport,
  size: CanvasSize
): Point2D {
  return {
    x: (point.x - size.width / 2) / viewport.zoom - viewport.offset.x,
    y: -((point.y - size.height / 2) / viewport.zoom - viewport.offset.y),
  };
}

/** Scale a length (not a point) from world units to screen pixels. */
export function worldLengthToScreen(length: number, viewport: Viewport): number {
  return length * viewport.zoom;
}

/**
 * Set a canvas's backing-store resolution to match its CSS size times
 * devicePixelRatio, so drawings stay crisp on high-DPI screens. Returns
 * the 2D context with the transform already applied — draw using CSS
 * pixel coordinates after calling this.
 */
export function configureCanvasForDPR(
  canvas: HTMLCanvasElement,
  size: CanvasSize
): CanvasRenderingContext2D | null {
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  canvas.width = Math.max(1, Math.round(size.width * dpr));
  canvas.height = Math.max(1, Math.round(size.height * dpr));
  canvas.style.width = `${size.width}px`;
  canvas.style.height = `${size.height}px`;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

/** Draw a light grid across the canvas, honoring the current viewport. */
export function drawGrid(
  ctx: CanvasRenderingContext2D,
  size: CanvasSize,
  viewport: Viewport,
  options: { spacing?: number; color?: string } = {}
): void {
  const spacing = (options.spacing ?? 40) * viewport.zoom;
  if (spacing < 8) return; // avoid a solid mess when zoomed far out

  const color = options.color ?? "rgba(20, 32, 25, 0.08)";
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;

  const offsetX = ((size.width / 2 + viewport.offset.x * viewport.zoom) % spacing + spacing) % spacing;
  const offsetY = ((size.height / 2 - viewport.offset.y * viewport.zoom) % spacing + spacing) % spacing;

  ctx.beginPath();
  for (let x = offsetX; x < size.width; x += spacing) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size.height);
  }
  for (let y = offsetY; y < size.height; y += spacing) {
    ctx.moveTo(0, y);
    ctx.lineTo(size.width, y);
  }
  ctx.stroke();
  ctx.restore();
}

/** Draw x/y axes through the world origin. */
export function drawAxes(
  ctx: CanvasRenderingContext2D,
  size: CanvasSize,
  viewport: Viewport,
  options: { color?: string; lineWidth?: number } = {}
): void {
  const origin = worldToScreen({ x: 0, y: 0 }, viewport, size);
  ctx.save();
  ctx.strokeStyle = options.color ?? "rgba(20, 32, 25, 0.35)";
  ctx.lineWidth = options.lineWidth ?? 1.5;
  ctx.beginPath();
  ctx.moveTo(0, origin.y);
  ctx.lineTo(size.width, origin.y);
  ctx.moveTo(origin.x, 0);
  ctx.lineTo(origin.x, size.height);
  ctx.stroke();
  ctx.restore();
}
