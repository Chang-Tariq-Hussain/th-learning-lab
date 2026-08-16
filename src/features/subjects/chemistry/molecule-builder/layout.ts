/** Shared SVG scene geometry — every molecule is drawn on the same horizontal axis. */
export const SCENE_WIDTH = 700;
export const SCENE_HEIGHT = 300;
export const ATOM_Y = 150;
export const ATOM_RADIUS = 52;
/** Perpendicular offset (px) between the two parallel lines of a double bond. */
export const DOUBLE_BOND_GAP = 6;

/** Trims a straight line between two atom centers back to each atom's edge, so bond lines don't run underneath the spheres. */
export function trimToEdges(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  radius: number,
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;
  return {
    x1: x1 + ux * radius,
    y1: y1 + uy * radius,
    x2: x2 - ux * radius,
    y2: y2 - uy * radius,
  };
}
