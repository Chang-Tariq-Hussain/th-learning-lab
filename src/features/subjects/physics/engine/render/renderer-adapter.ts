import type { RigidBody } from "../core/rigid-body";
import type { World } from "../world/world";

/**
 * A `toScreen` function is the only coupling point between this engine
 * and any particular canvas/coordinate setup — the engine itself never
 * imports `CanvasRenderingContext2D` types or assumes a projection. Any
 * simulation can supply its own (e.g. the bottom-anchored projection in
 * `projectile-motion/canvas-helpers.ts`, or a screen-centered one for an
 * orbital-motion simulation).
 */
export type ToScreen = (world: { x: number; y: number }) => {
  x: number;
  y: number;
};

export interface BodyStyle {
  fill?: string;
  stroke?: string;
  lineWidth?: number;
}

export type StyleResolver = (body: RigidBody) => BodyStyle;

const defaultStyle: StyleResolver = (body) => ({
  fill: body.isStatic ? "#3D4A44" : "#3D5AFE",
  stroke: (body.userData.strokeColor as string) ?? "transparent",
  lineWidth: 1.5,
});

/**
 * Draws every body in a `World` — circles as circles (with a spoke
 * marking rotation, so spin is visible), rectangles as rotated
 * rectangles — using whatever `toScreen` projection and `pxPerMeter`
 * scale the calling simulation provides. This is the one place in the
 * engine that touches a `CanvasRenderingContext2D`; everything else
 * (`World`, forces, collisions) is renderer-agnostic on purpose so a
 * future simulation could swap in an SVG or WebGL adapter without
 * touching physics code.
 */
export function drawWorld(
  ctx: CanvasRenderingContext2D,
  world: World,
  toScreen: ToScreen,
  pxPerMeter: number,
  resolveStyle: StyleResolver = defaultStyle,
): void {
  for (const body of world.bodies) {
    const style = resolveStyle(body);
    const screenPos = toScreen(body.position);

    ctx.save();
    ctx.translate(screenPos.x, screenPos.y);
    // Canvas y grows downward while world y grows upward, so a
    // counter-clockwise world rotation must be drawn clockwise on screen.
    ctx.rotate(-body.rotation);

    ctx.fillStyle = style.fill ?? "#3D5AFE";
    ctx.strokeStyle = style.stroke ?? "transparent";
    ctx.lineWidth = style.lineWidth ?? 1.5;

    if (body.shape.kind === "circle") {
      const r = body.shape.radius * pxPerMeter;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      if (style.stroke && style.stroke !== "transparent") ctx.stroke();
      // Spoke from center to edge, so rolling/spinning is visible even on a plain circle.
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(r, 0);
      ctx.strokeStyle =
        style.stroke && style.stroke !== "transparent"
          ? style.stroke
          : "rgba(255,255,255,0.6)";
      ctx.stroke();
    } else {
      const w = body.shape.width * pxPerMeter;
      const h = body.shape.height * pxPerMeter;
      ctx.beginPath();
      ctx.rect(-w / 2, -h / 2, w, h);
      ctx.fill();
      if (style.stroke && style.stroke !== "transparent") ctx.stroke();
    }

    ctx.restore();
  }
}
