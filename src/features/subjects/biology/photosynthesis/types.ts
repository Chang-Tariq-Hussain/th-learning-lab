/** The six visible beats of the animation, in order. Purely for status text — the scene itself is driven by continuous progress, not discrete steps. */
export type StepId = "light" | "water" | "co2" | "reaction" | "glucose" | "oxygen";

/**
 * Environmental factors the "Factors Affecting Photosynthesis" topic
 * lets a student adjust — added alongside the original playback state
 * rather than replacing it. Each is a 0–100 slider value; see
 * `DEFAULT_FACTORS` in `model.ts` for what "optimal" means for each
 * one, and `factorRate` for how they combine into a single rate
 * multiplier. Every existing caller of `Photosynthesis` (the plain
 * simulation page, and the Photosynthesis topic's Explore step) never
 * touches this — it stays at `DEFAULT_FACTORS` (rate = 1×), so the
 * original 10-second playback is completely unchanged unless a caller
 * opts into `showFactorControls`.
 */
export interface PhotosynthesisFactors {
  /** Light intensity, 0 (darkness) to 100 (bright, optimal). */
  light: number;
  /** Carbon dioxide availability, 0 (none) to 100 (plentiful, optimal). */
  co2: number;
  /** Temperature, 0 (cold) to 100 (hot) — 50 is the optimal midpoint;
   *  the rate falls off toward either extreme rather than rising with
   *  temperature the way light and CO2 do. */
  temperature: number;
}

export interface PhotosynthesisState {
  running: boolean;
  /** Real playback clock in seconds, counting up to PLAYBACK_DURATION_S. */
  playbackSeconds: number;
  /** Current environmental factor settings — see `PhotosynthesisFactors`. */
  factors: PhotosynthesisFactors;
}
