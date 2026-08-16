/**
 * Frequency & Period — data model.
 *
 * One transverse wave y(x, t) = A·sin(kx − ωt) with a FIXED
 * wavelength (k constant) — only the angular rate ω = 2πf changes
 * with the student's frequency control. That's deliberate: it lets
 * the wave's animation genuinely speed up/slow down with frequency
 * (as the spec asks) while keeping "wavelength" out of the lesson
 * entirely and never touching v = fλ.
 *
 * `phase` is integrated every frame as `phase += 2π·f·dt`, so
 * `phase / 2π` is exactly ∫f·dt — the true number of cycles elapsed
 * even while frequency changes mid-run. Cycle count is simply
 * `Math.floor(phase / 2π)`.
 */

export const VIEW_WIDTH = 800;
export const VIEW_HEIGHT = 280;
export const EQUILIBRIUM_Y = VIEW_HEIGHT / 2;
export const AMPLITUDE_PX = 46;
export const WAVELENGTH_PX = 200;
export const PARTICLE_COUNT = 14;
export const PARTICLE_MARGIN = 24;
/** Index of the emphasized "watch this particle" particle. */
export const REFERENCE_PARTICLE_INDEX = Math.floor(PARTICLE_COUNT / 2);

export const FREQUENCY_MIN = 0.5;
export const FREQUENCY_MAX = 5;
export const FREQUENCY_STEP = 0.5;
export const FREQUENCY_DEFAULT = 2;

export const LOW_FREQUENCY = 2;
export const HIGH_FREQUENCY = 4;

export const TARGET_EXPERIMENT_FREQUENCY = 3;

export function waveNumber(): number {
  return (2 * Math.PI) / WAVELENGTH_PX;
}

export function period(frequencyHz: number): number {
  return 1 / frequencyHz;
}

export function waveY(x: number, phase: number): number {
  return AMPLITUDE_PX * Math.sin(waveNumber() * x - phase);
}

/** Builds a smooth SVG path for the traveling wave at a given phase. */
export function buildWavePath(phase: number, step = 5): string {
  const points: string[] = [];
  for (let x = 0; x <= VIEW_WIDTH; x += step) {
    const y = EQUILIBRIUM_Y - waveY(x, phase);
    points.push(`${x === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return points.join(" ");
}

/** Even spread of particle x-positions across the drawable width. */
export function particlePositions(count: number = PARTICLE_COUNT): number[] {
  const usable = VIEW_WIDTH - PARTICLE_MARGIN * 2;
  return Array.from({ length: count }, (_, i) => PARTICLE_MARGIN + (usable * i) / (count - 1));
}

/** Point on the small "cycle clock" for a given phase — a rotating phasor, one full turn per cycle. */
export function cycleClockPoint(phase: number, radius: number) {
  const angle = phase % (Math.PI * 2);
  return {
    x: radius * Math.sin(angle),
    y: -radius * Math.cos(angle),
  };
}

/** Static SVG path showing exactly `frequencyHz` complete cycles across `width` px — the "watch for 1 second" reference. */
export function buildOneSecondPath(frequencyHz: number, width: number, amplitude: number, midY: number, step = 4): string {
  const cycleWidth = width / frequencyHz;
  const k = (2 * Math.PI) / cycleWidth;
  const points: string[] = [];
  for (let x = 0; x <= width; x += step) {
    const y = midY - amplitude * Math.sin(k * x);
    points.push(`${x === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return points.join(" ");
}

// --- Learning panel ---------------------------------------------------------

export const LEARNING_PANEL_SECTIONS: { title: string; body: string; unit?: string }[] = [
  { title: "Frequency", body: "Number of complete cycles per second.", unit: "Hz" },
  { title: "Period", body: "Time taken for one complete cycle.", unit: "seconds" },
  { title: "Relationship", body: "T = 1 / f    and    f = 1 / T" },
];

// --- Period challenge -----------------------------------------------------

export interface ChallengeQuestion {
  prompt: string;
  options: { label: string; correct: boolean }[];
  explanation: string;
}

export const CHALLENGE_QUESTIONS: ChallengeQuestion[] = [
  {
    prompt: "If the frequency is 2 Hz, what is the period?",
    options: [
      { label: "2 s", correct: false },
      { label: "0.5 s", correct: true },
      { label: "4 s", correct: false },
    ],
    explanation: "T = 1 / f = 1 / 2 = 0.5 s.",
  },
  {
    prompt: "If the period is 0.25 s, what is the frequency?",
    options: [
      { label: "0.25 Hz", correct: false },
      { label: "2 Hz", correct: false },
      { label: "4 Hz", correct: true },
    ],
    explanation: "f = 1 / T = 1 / 0.25 = 4 Hz.",
  },
];
