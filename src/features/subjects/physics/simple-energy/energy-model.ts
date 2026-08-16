/**
 * Tiny, self-contained model for the Simple Energy visualization. Same
 * spirit as Simple Motion and Simple Forces: no engine/, no real
 * gravity or velocity numbers — just one fraction that flows from
 * "potential" to "kinetic" as the ball rolls down a fixed hill, with
 * nothing lost along the way (no friction, per the spec).
 */

/** Height slider range, in meters — how far up the hill the ball starts. */
export const HEIGHT_MIN = 2;
export const HEIGHT_MAX = 10;
export const HEIGHT_STEP = 1;
export const DEFAULT_HEIGHT = 6;

export interface EnergyPlan {
  heightM: number;
}

export interface EnergyState extends EnergyPlan {
  running: boolean;
  /** Real playback clock in seconds, counting up to PLAYBACK_DURATION_S. */
  playbackSeconds: number;
}

export const INITIAL_ENERGY_STATE: EnergyState = {
  running: false,
  playbackSeconds: 0,
  heightM: DEFAULT_HEIGHT,
};

export const PLAYBACK_DURATION_S = 2.5;

export function progressFor(
  state: Pick<EnergyState, "playbackSeconds">,
): number {
  return Math.min(1, Math.max(0, state.playbackSeconds / PLAYBACK_DURATION_S));
}

export function hasFinished(
  state: Pick<EnergyState, "playbackSeconds">,
): boolean {
  return state.playbackSeconds >= PLAYBACK_DURATION_S;
}

/** How high the chosen starting point is, as a fraction of the tallest the hill ever gets (0–1). This is the one number the whole lesson turns on. */
export function heightFraction(plan: EnergyPlan): number {
  return plan.heightM / HEIGHT_MAX;
}

/**
 * The ball's current height, as that same 0–1 fraction, at a given
 * point in the roll. Starts at the chosen height fraction and falls
 * straight to 0 by the time progress reaches 1 — nothing fancier than
 * that; this one value drives both the ball's position on the hill
 * and both energy bars, so they can never disagree with each other.
 */
export function currentHeightFraction(
  plan: EnergyPlan,
  progress: number,
): number {
  return heightFraction(plan) * (1 - progress);
}

/**
 * Potential and Kinetic energy, each as a 0–1 fraction of the tallest
 * hill possible. With no friction, they always add back up to the
 * starting height fraction — energy just moves from one bar to the
 * other, it never appears or disappears.
 */
export function energyFractions(
  plan: EnergyPlan,
  progress: number,
): { potential: number; kinetic: number } {
  const potential = currentHeightFraction(plan, progress);
  const kinetic = heightFraction(plan) - potential;
  return { potential, kinetic };
}
