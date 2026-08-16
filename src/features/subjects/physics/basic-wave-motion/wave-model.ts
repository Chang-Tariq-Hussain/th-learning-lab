/**
 * Basic Wave Motion — data model.
 *
 * A single transverse wave y(x) = A·sin(kx − φ), rendered as a smooth
 * SVG path. Only amplitude and wavelength are student-controllable;
 * the phase φ advances at a constant angular rate whenever the
 * simulation is playing, which is what makes the wave pattern travel
 * to the right while any one point on the medium just oscillates up
 * and down — exactly the idea this lesson is trying to build
 * intuition for, with no v = fλ, frequency, or period exposed.
 */

export const VIEW_WIDTH = 800;
export const VIEW_HEIGHT = 280;
export const EQUILIBRIUM_Y = VIEW_HEIGHT / 2;
/** Fixed screen-space reference the labeled crest/trough track near, so the diagram always has a legible example nearby instead of drifting off-screen. */
export const ANCHOR_X = VIEW_WIDTH * 0.3;

export const AMPLITUDE_MIN = 20;
export const AMPLITUDE_MAX = 90;
export const AMPLITUDE_STEP = 10;
export const AMPLITUDE_DEFAULT = 55;

export const WAVELENGTH_MIN = 120;
export const WAVELENGTH_MAX = 320;
export const WAVELENGTH_STEP = 20;
export const WAVELENGTH_DEFAULT = 200;

/** Constant angular phase rate (rad/s) while playing — deliberately not framed as "frequency" anywhere in the UI. */
export const ANGULAR_SPEED = 2.0;

export const PARTICLE_COUNT = 14;
export const PARTICLE_MARGIN = 24;

export function waveNumber(wavelengthPx: number): number {
  return (2 * Math.PI) / wavelengthPx;
}

export function waveY(x: number, phase: number, amplitudePx: number, wavelengthPx: number): number {
  return amplitudePx * Math.sin(waveNumber(wavelengthPx) * x - phase);
}

/** Builds a smooth SVG path for the wave across the full view width. */
export function buildWavePath(phase: number, amplitudePx: number, wavelengthPx: number, step = 5): string {
  const points: string[] = [];
  for (let x = 0; x <= VIEW_WIDTH; x += step) {
    const y = EQUILIBRIUM_Y - waveY(x, phase, amplitudePx, wavelengthPx);
    points.push(`${x === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return points.join(" ");
}

/** The x position of the real wave crest nearest ANCHOR_X, recomputed each frame so the label always sits on an actual peak. */
export function nearestCrestX(phase: number, wavelengthPx: number, anchorX = ANCHOR_X): number {
  const k = waveNumber(wavelengthPx);
  const crestBase = (Math.PI / 2 + phase) / k;
  const m = Math.round((anchorX - crestBase) / wavelengthPx);
  return crestBase + m * wavelengthPx;
}

/** The trough half a wavelength behind that same crest — guaranteed to be a real trough and to stay near the anchor too. */
export function nearestTroughX(phase: number, wavelengthPx: number, anchorX = ANCHOR_X): number {
  return nearestCrestX(phase, wavelengthPx, anchorX) - wavelengthPx / 2;
}

export type ExploreItem = "crest" | "trough" | "amplitude" | "wavelength" | "equilibrium";

export const EXPLORE_ITEMS: ExploreItem[] = ["crest", "trough", "amplitude", "wavelength", "equilibrium"];

export const EXPLORE_LABEL: Record<ExploreItem, string> = {
  crest: "Crest",
  trough: "Trough",
  amplitude: "Amplitude",
  wavelength: "Wavelength",
  equilibrium: "Equilibrium",
};

export const EXPLORE_EXPLANATION: Record<ExploreItem, string> = {
  crest: "The crest is the highest point of a transverse wave.",
  trough: "The trough is the lowest point of a transverse wave.",
  equilibrium: "The equilibrium position is the central/rest position around which the medium oscillates.",
  wavelength: "Wavelength is the distance between two corresponding points of consecutive waves, such as crest-to-crest.",
  amplitude: "Amplitude is the maximum displacement from the equilibrium position.",
};

export const LEARNING_PANEL_SECTIONS: { title: string; body: string }[] = [
  { title: "What is a wave?", body: "A wave is a disturbance that transfers energy from one place to another." },
  { title: "Crest", body: "Highest point." },
  { title: "Trough", body: "Lowest point." },
  { title: "Amplitude", body: "Maximum displacement from equilibrium." },
  { title: "Wavelength", body: "Distance between corresponding points of consecutive waves." },
];

// --- Mini challenge -----------------------------------------------------

export type ChallengeStep = "crest" | "trough" | "done";

export const CHALLENGE_PROMPT: Record<Exclude<ChallengeStep, "done">, string> = {
  crest: "Click the crest.",
  trough: "Click the trough.",
};

export const CHALLENGE_CORRECT: Record<Exclude<ChallengeStep, "done">, string> = {
  crest: "The crest is the highest point of the wave.",
  trough: "The trough is the lowest point of the wave.",
};

export const CHALLENGE_RETRY: Record<Exclude<ChallengeStep, "done">, string> = {
  crest: "Try again. Look for the highest point of the wave.",
  trough: "Try again. Look for the lowest point of the wave.",
};

/** Even spread of particle x-positions across the drawable width, each one only ever oscillates vertically at its own fixed x. */
export function particlePositions(count: number = PARTICLE_COUNT): number[] {
  const usable = VIEW_WIDTH - PARTICLE_MARGIN * 2;
  return Array.from({ length: count }, (_, i) => PARTICLE_MARGIN + (usable * i) / (count - 1));
}
