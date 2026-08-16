/** Shared SVG scene geometry. One place for every coordinate so the ionic and covalent scenes line up on the same stage. */
export const SCENE_WIDTH = 700;
export const SCENE_HEIGHT = 360;
export const ATOM_Y = 180;
export const ATOM_RADIUS = 58;
export const RING_RADIUS = 82;

export const IONIC_NA_X = { separate: 150, close: 248 };
export const IONIC_CL_X = { separate: 550, close: 452 };

export const COVALENT_H_X = { separate: 180, close: 292 };
export const COVALENT_H2_X = { separate: 520, close: 408 };

/** Evenly spaced point on a ring of `total` slots around (cx, cy), index 0 starting at the top. */
export function ringSlot(cx: number, cy: number, index: number, total: number, radius = RING_RADIUS) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
}
