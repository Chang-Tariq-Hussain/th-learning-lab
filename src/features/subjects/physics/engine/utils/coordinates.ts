import type { Point2D, CanvasSize, Viewport } from "@/features/simulation";

/**
 * A straightforward, reusable world↔screen transform: world (0,0) sits
 * at a configurable screen anchor (default: bottom-left with margins),
 * +y is up. Good enough for most engine demos and debug rendering.
 * Simulations with special needs (like projectile motion's auto-fit
 * bottom-anchored view) still define their own projection — this is a
 * convenience default, not a requirement.
 */
export interface CoordinateTransformOptions {
  anchor?: "bottom-left" | "center";
  marginPx?: number;
}

export function createCoordinateTransform(
  size: CanvasSize,
  viewport: Viewport,
  pxPerMeter: number,
  options: CoordinateTransformOptions = {},
) {
  const margin = options.marginPx ?? 0;
  const anchor = options.anchor ?? "bottom-left";

  const originScreen: Point2D =
    anchor === "bottom-left"
      ? { x: margin, y: size.height - margin }
      : { x: size.width / 2, y: size.height / 2 };

  const scale = pxPerMeter * viewport.zoom;

  const worldToScreen = (world: Point2D): Point2D => ({
    x: originScreen.x + (world.x + viewport.offset.x) * scale,
    y: originScreen.y - (world.y + viewport.offset.y) * scale,
  });

  const screenToWorld = (screen: Point2D): Point2D => ({
    x: (screen.x - originScreen.x) / scale - viewport.offset.x,
    y: -(screen.y - originScreen.y) / scale - viewport.offset.y,
  });

  return { worldToScreen, screenToWorld, scale };
}
