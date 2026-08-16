/**
 * Tiny, self-contained model for the Simple Motion visualization.
 * Deliberately has none of the machinery the advanced Physics
 * visualizations use (no engine/, no schema.ts, no challenges) — this
 * feature is a single constant-speed object on a straight track.
 *
 * The student picks ONE of Speed, Distance, or Time to be the
 * "unknown". The other two are plain sliders with fixed ranges; the
 * unknown is always solved live from Speed = Distance ÷ Time, the
 * same way the Math subject's Proportion Builder highlights a single
 * missing value instead of letting every quantity drift at once.
 */

export type UnknownQuantity = "speed" | "time" | "distance";

/** Speed slider range, in meters per second. */
export const SPEED_MIN = 1;
export const SPEED_MAX = 10;
export const SPEED_STEP = 1;
export const DEFAULT_SPEED = 4;

/** Time slider range, in seconds. */
export const TIME_MIN = 1;
export const TIME_MAX = 20;
export const TIME_STEP = 1;
export const DEFAULT_TIME = 10;

/** Distance slider range, in meters. */
export const DISTANCE_MIN = 10;
export const DISTANCE_MAX = 100;
export const DISTANCE_STEP = 5;
export const DEFAULT_DISTANCE = 40;

export const DEFAULT_UNKNOWN: UnknownQuantity = "speed";

export interface MotionPlan {
  unknown: UnknownQuantity;
  /** The two knowns keep whatever value their slider was last set to. */
  speedMps: number;
  timeSec: number;
  distanceM: number;
}

export interface MotionState extends MotionPlan {
  /** Whether the object is currently animating. */
  running: boolean;
  /** Real playback clock in seconds, counting up to PLAYBACK_DURATION_S. */
  playbackSeconds: number;
}

export const INITIAL_MOTION_STATE: MotionState = {
  running: false,
  playbackSeconds: 0,
  unknown: DEFAULT_UNKNOWN,
  speedMps: DEFAULT_SPEED,
  timeSec: DEFAULT_TIME,
  distanceM: DEFAULT_DISTANCE,
};

/**
 * Solve the unknown quantity from the other two, given the two known
 * slider values currently held in state. The known values themselves
 * are never touched here — only the unknown slot is recalculated.
 * Generic over T so callers can pass either a bare MotionPlan or a
 * full MotionState and get the same shape back, no casting needed.
 */
export function solve<T extends MotionPlan>(plan: T): T {
  if (plan.unknown === "speed") {
    return { ...plan, speedMps: plan.distanceM / plan.timeSec };
  }
  if (plan.unknown === "time") {
    return { ...plan, timeSec: plan.distanceM / plan.speedMps };
  }
  return { ...plan, distanceM: plan.speedMps * plan.timeSec };
}

/**
 * The playback animation always takes a fixed, comfortable real-world
 * duration to watch, regardless of how large or small the solved Time
 * turns out to be — the readouts still show the true numbers.
 */
export const PLAYBACK_DURATION_S = 4;

/** Fraction of the trip covered, 0 to 1 — used to position the object. */
export function progressFor(
  state: Pick<MotionState, "playbackSeconds">,
): number {
  return Math.min(1, Math.max(0, state.playbackSeconds / PLAYBACK_DURATION_S));
}

/** Whether the object has reached the end of the trip. */
export function hasFinished(
  state: Pick<MotionState, "playbackSeconds">,
): boolean {
  return state.playbackSeconds >= PLAYBACK_DURATION_S;
}

/**
 * The unknown's display value while the car is en route. Rather than
 * handing the student the solved answer up front, Distance and Time
 * grow in step with the car's progress (0 at the start line, the true
 * value exactly at the finish line) — the reading is "earned" by
 * watching the trip play out. Speed isn't cumulative like the other
 * two, so once the car has moved at all, distance-covered ÷
 * time-elapsed already equals the true (constant) speed; it just
 * stays hidden until the car actually starts moving.
 *
 * Returns null before the car has moved (progress <= 0), so callers
 * can show a "?" instead of a number that hasn't been earned yet.
 */
export function liveUnknownValue(
  state: MotionPlan,
  progress: number,
): number | null {
  if (progress <= 0) return null;
  if (state.unknown === "distance") return state.distanceM * progress;
  if (state.unknown === "time") return state.timeSec * progress;
  return state.distanceM / state.timeSec;
}
