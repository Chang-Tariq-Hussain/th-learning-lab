import { shapeAABB } from "../core/shape";
import type { World } from "../world/world";
import type { Contact } from "../collision/detection";
import type { ToScreen } from "../render/renderer-adapter";

export interface DebugOverlayOptions {
  showBoundingBoxes?: boolean;
  showVelocityVectors?: boolean;
  showAccelerationVectors?: boolean;
  showObjectIds?: boolean;
  showFps?: boolean;
  /** Contacts from the most recently processed step (e.g. captured via `world.events.on("collision", ...)`) — pass an empty array to skip drawing contact points. */
  recentContacts?: Contact[];
  /** Rolling FPS, typically tracked by the caller from consecutive frame timestamps. */
  fps?: number;
  frameTimeMs?: number;
}

const VELOCITY_SCALE = 0.15; // screen px per (m/s), keeps arrows readable at typical simulation speeds
const ACCEL_SCALE = 0.02; // screen px per (m/s^2) — accelerations are usually numerically larger than velocities

/**
 * An entirely optional diagnostic layer for building and debugging a
 * simulation — draws over whatever `renderer-adapter.drawWorld` already
 * produced. None of this is required for a finished lesson; toggle it
 * on while developing a new simulation, or expose it as a "Debug mode"
 * switch for advanced students.
 */
export function drawDebugOverlay(
  ctx: CanvasRenderingContext2D,
  world: World,
  toScreen: ToScreen,
  pxPerMeter: number,
  options: DebugOverlayOptions = {},
): void {
  ctx.save();
  ctx.font = "10px var(--font-mono), monospace";
  ctx.lineWidth = 1;

  for (const body of world.bodies) {
    const screenPos = toScreen(body.position);

    if (options.showBoundingBoxes) {
      const aabb = shapeAABB(body.position, body.shape, body.rotation);
      const topLeft = toScreen({ x: aabb.minX, y: aabb.maxY });
      const bottomRight = toScreen({ x: aabb.maxX, y: aabb.minY });
      ctx.strokeStyle = "rgba(224,82,79,0.8)";
      ctx.setLineDash([3, 3]);
      ctx.strokeRect(
        topLeft.x,
        topLeft.y,
        bottomRight.x - topLeft.x,
        bottomRight.y - topLeft.y,
      );
      ctx.setLineDash([]);
    }

    if (
      options.showVelocityVectors &&
      (body.velocity.x !== 0 || body.velocity.y !== 0)
    ) {
      drawArrow(
        ctx,
        screenPos,
        {
          x: screenPos.x + body.velocity.x * VELOCITY_SCALE * pxPerMeter,
          y: screenPos.y - body.velocity.y * VELOCITY_SCALE * pxPerMeter,
        },
        "#3D5AFE",
      );
    }

    if (
      options.showAccelerationVectors &&
      (body.acceleration.x !== 0 || body.acceleration.y !== 0)
    ) {
      drawArrow(
        ctx,
        screenPos,
        {
          x: screenPos.x + body.acceleration.x * ACCEL_SCALE * pxPerMeter,
          y: screenPos.y - body.acceleration.y * ACCEL_SCALE * pxPerMeter,
        },
        "#E0524F",
      );
    }

    if (options.showObjectIds) {
      ctx.fillStyle = "rgba(20,32,25,0.85)";
      ctx.textAlign = "center";
      ctx.fillText(`#${body.id}`, screenPos.x, screenPos.y - 14);
    }
  }

  if (options.recentContacts) {
    ctx.fillStyle = "#F0A54A";
    for (const contact of options.recentContacts) {
      const p = toScreen(contact.point);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (options.showFps) {
    ctx.fillStyle = "rgba(20,32,25,0.85)";
    ctx.textAlign = "left";
    ctx.fillText(
      `${(options.fps ?? 0).toFixed(0)} fps · ${(options.frameTimeMs ?? 0).toFixed(1)} ms/frame · ${world.bodies.length} bodies`,
      8,
      14,
    );
  }

  ctx.restore();
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  from: { x: number; y: number },
  to: { x: number; y: number },
  color: string,
) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  const headLength = 6;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2;
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
}
