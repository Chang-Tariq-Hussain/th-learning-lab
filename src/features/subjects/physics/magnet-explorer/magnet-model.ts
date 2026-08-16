/**
 * Plain geometry + types for the magnet playground. Kept free of React
 * and of any attract/repel rules — this file only ever answers "where
 * is this magnet's pole" and "where should it be allowed to sit",
 * never "what force does it feel" (that's `magnet-physics.ts`).
 */

export type MagnetId = "a" | "b";

export interface Point {
  x: number;
  y: number;
}

export interface MagnetState {
  id: MagnetId;
  x: number;
  y: number;
  /** Degrees, 0 = north pole points along +x (screen right). */
  rotation: number;
}

/** Playground viewBox — fixed so pointer math stays simple; the SVG itself scales responsively via CSS. */
export const PLAYGROUND_WIDTH = 800;
export const PLAYGROUND_HEIGHT = 460;

export const MAGNET_LENGTH = 176;
export const MAGNET_WIDTH = 60;
const HALF_LENGTH = MAGNET_LENGTH / 2;

/** Distance from the magnet's center out to the little rotate handle past the north tip. */
export const ROTATE_HANDLE_OFFSET = HALF_LENGTH + 26;

export const START_STATE: Record<MagnetId, MagnetState> = {
  a: { id: "a", x: PLAYGROUND_WIDTH * 0.28, y: PLAYGROUND_HEIGHT * 0.5, rotation: 0 },
  b: { id: "b", x: PLAYGROUND_WIDTH * 0.72, y: PLAYGROUND_HEIGHT * 0.5, rotation: 0 },
};

export function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/** World-space position of a magnet's two poles, derived from its center + rotation. */
export function getPoles(magnet: MagnetState): { north: Point; south: Point } {
  const rad = toRadians(magnet.rotation);
  const dx = Math.cos(rad) * HALF_LENGTH;
  const dy = Math.sin(rad) * HALF_LENGTH;
  return {
    north: { x: magnet.x + dx, y: magnet.y + dy },
    south: { x: magnet.x - dx, y: magnet.y - dy },
  };
}

/** Keeps a magnet's center far enough from every edge that its body never leaves the playground, at any rotation. */
export function clampToPlayground(x: number, y: number): Point {
  const margin = MAGNET_LENGTH / 2 + 6;
  return {
    x: Math.min(Math.max(x, margin), PLAYGROUND_WIDTH - margin),
    y: Math.min(Math.max(y, margin), PLAYGROUND_HEIGHT - margin),
  };
}

/** Converts a pointer event's client coordinates into playground (viewBox) space, accounting for the SVG's responsive CSS scaling. */
export function pointerToPlaygroundPoint(
  e: { clientX: number; clientY: number },
  svg: SVGSVGElement,
): Point {
  const rect = svg.getBoundingClientRect();
  const scaleX = PLAYGROUND_WIDTH / rect.width;
  const scaleY = PLAYGROUND_HEIGHT / rect.height;
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
  };
}

export function angleBetween(center: Point, target: Point): number {
  return (Math.atan2(target.y - center.y, target.x - center.x) * 180) / Math.PI;
}
