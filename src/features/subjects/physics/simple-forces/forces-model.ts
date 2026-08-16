/**
 * Tiny, self-contained model for the Simple Forces visualization.
 * Same spirit as Simple Motion: no engine/, no vectors beyond a single
 * signed number, no acceleration curve — just two forces pulling a
 * box left or right, and whichever is bigger wins.
 */

/** Force slider range, in newtons. Small and easy to read at a glance. */
export const FORCE_MIN = 0;
export const FORCE_MAX = 10;
export const FORCE_STEP = 1;
export const DEFAULT_LEFT_FORCE = 3;
export const DEFAULT_RIGHT_FORCE = 3;

export interface ForcesPlan {
  leftForce: number;
  rightForce: number;
}

export interface ForcesState extends ForcesPlan {
  running: boolean;
  /** Real playback clock in seconds, counting up to PLAYBACK_DURATION_S. */
  playbackSeconds: number;
}

export const INITIAL_FORCES_STATE: ForcesState = {
  running: false,
  playbackSeconds: 0,
  leftForce: DEFAULT_LEFT_FORCE,
  rightForce: DEFAULT_RIGHT_FORCE,
};

/** Positive = net push to the right, negative = net push to the left, 0 = balanced. */
export function netForce(plan: ForcesPlan): number {
  return plan.rightForce - plan.leftForce;
}

export function isBalanced(plan: ForcesPlan): boolean {
  return netForce(plan) === 0;
}

/** The short, plain-language reading the spec calls for — nothing more. */
export function balanceLabel(
  plan: ForcesPlan,
): "Balanced forces" | "Unbalanced forces" {
  return isBalanced(plan) ? "Balanced forces" : "Unbalanced forces";
}

/** How long the box takes to slide to its resting position once Start is pressed. */
export const PLAYBACK_DURATION_S = 2.5;

/** Fraction of the trip elapsed, 0 to 1. */
export function progressFor(
  state: Pick<ForcesState, "playbackSeconds">,
): number {
  return Math.min(1, Math.max(0, state.playbackSeconds / PLAYBACK_DURATION_S));
}

export function hasFinished(
  state: Pick<ForcesState, "playbackSeconds">,
): boolean {
  return state.playbackSeconds >= PLAYBACK_DURATION_S;
}

/** Gentle ease-out so the box visibly settles rather than snapping to a stop. */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * How far the box has slid from center, as a fraction of the track's
 * available travel (-1 = as far left as it goes, 1 = as far right).
 * A stronger net force produces a bigger displacement — that's the
 * one, deliberately simple stand-in this lesson uses for "a stronger
 * force causes a bigger change in motion", rather than modeling real
 * acceleration. Balanced forces (net 0) never move the box at all,
 * regardless of progress.
 */
export function boxOffsetFraction(plan: ForcesPlan, progress: number): number {
  const net = netForce(plan);
  if (net === 0) return 0;
  const magnitude = Math.min(1, Math.abs(net) / FORCE_MAX);
  const sign = net > 0 ? 1 : -1;
  return sign * magnitude * easeOutCubic(progress);
}
