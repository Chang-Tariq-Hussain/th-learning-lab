export type AngleType = "acute" | "right" | "obtuse" | "straight" | "reflex";

export interface AngleTypeInfo {
  label: string;
  color: string;
  softColor: string;
}

/**
 * Colors match the brief exactly for the four it specifies (acute
 * green, right blue, obtuse orange, reflex purple — the last two reuse
 * this app's existing `subject.math`/accent tokens for consistency).
 * "Straight" isn't given a color in the brief but the brief also asks
 * to *display* it as a category, so it gets a fifth, distinct color
 * rather than defaulting to something already used above.
 */
export const ANGLE_TYPES: Record<AngleType, AngleTypeInfo> = {
  acute: { label: "Acute", color: "#22C55E", softColor: "#DCFCE7" },
  right: { label: "Right", color: "#3D5AFE", softColor: "#E8EBFF" },
  obtuse: { label: "Obtuse", color: "#F2A65A", softColor: "#FDECD8" },
  straight: { label: "Straight", color: "#0D9488", softColor: "#DFF5F2" },
  reflex: { label: "Reflex", color: "#7C4FE0", softColor: "#EFE7FB" },
};

/** Degrees at which the arm "clicks" into an exact, celebration-worthy angle. */
export const MILESTONES = [90, 180, 360] as const;
export const SNAP_TOLERANCE_DEG = 1.5;

export function classifyAngle(degrees: number): AngleType | null {
  if (degrees <= 0) return null;
  if (degrees < 90) return "acute";
  if (degrees === 90) return "right";
  if (degrees < 180) return "obtuse";
  if (degrees === 180) return "straight";
  return "reflex"; // 180 < degrees <= 360
}

/** Snaps to the nearest milestone if the drag ended close enough to feel intentional, otherwise returns the value unchanged. */
export function snapToMilestone(degrees: number): number {
  for (const milestone of MILESTONES) {
    if (Math.abs(degrees - milestone) <= SNAP_TOLERANCE_DEG) return milestone;
  }
  return degrees;
}

export function isMilestone(degrees: number): boolean {
  return MILESTONES.includes(degrees as (typeof MILESTONES)[number]);
}

/**
 * Shortest signed angular delta from `from` to `to`, in (-180, 180].
 * The building block for continuous-rotation dragging: summing these
 * deltas (rather than re-deriving an absolute angle each move) is what
 * lets the arm keep turning past 360°→0° without jumping, and lets a
 * full turn land on exactly 360 instead of wrapping back to 0.
 */
export function shortestDelta(from: number, to: number): number {
  return ((((to - from) % 360) + 540) % 360) - 180;
}

export function clampAngle(degrees: number): number {
  return Math.min(360, Math.max(0, degrees));
}
