/**
 * Positive → blue, negative → red, zero → gold, per the brief. Kept as
 * plain hex (not Tailwind's `subject.*` tokens) since these colors mean
 * "positive/negative/zero" here, not "this belongs to Mathematics" —
 * a different, number-specific palette that happens to live alongside
 * the subject-color system rather than reusing it.
 */
export const POSITIVE_COLOR = "#3D5AFE";
export const NEGATIVE_COLOR = "#E0524F";
export const ZERO_COLOR = "#E8B923";

export function colorForValue(value: number): string {
  if (value > 0) return POSITIVE_COLOR;
  if (value < 0) return NEGATIVE_COLOR;
  return ZERO_COLOR;
}
