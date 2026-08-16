/**
 * Wave Speed — v = fλ — data model.
 *
 * The traveling wave y(x, t) = A·sin(kx − ωt) is reused from
 * Frequency & Period, but here BOTH k (from wavelength) and ω (from
 * frequency) are student-controlled. The pattern's rightward crawl
 * speed in pixels/second is ω/k = f·λ_px = v_real · PX_PER_METER —
 * i.e. the animation's actual speed is always proportional to the
 * calculated wave speed, with no separate "visual speed" hack
 * required, just a fixed px-per-metre scale to keep it on screen.
 */

export const VIEW_WIDTH = 800;
export const VIEW_HEIGHT = 280;
export const EQUILIBRIUM_Y = VIEW_HEIGHT / 2;
export const AMPLITUDE_PX = 44;
export const PARTICLE_COUNT = 14;
export const PARTICLE_MARGIN = 24;
export const REFERENCE_PARTICLE_INDEX = 3;

/** Pixels representing one metre — keeps the animation smooth across the whole educational range. */
export const PX_PER_METER = 70;

export const FREQUENCY_MIN = 1;
export const FREQUENCY_MAX = 4;
export const FREQUENCY_STEP = 1;
export const FREQUENCY_DEFAULT = 2;

export const WAVELENGTH_MIN = 1;
export const WAVELENGTH_MAX = 4;
export const WAVELENGTH_STEP = 1;
export const WAVELENGTH_DEFAULT = 2;

export function wavelengthPx(wavelengthM: number): number {
  return wavelengthM * PX_PER_METER;
}

export function waveNumber(wavelengthM: number): number {
  return (2 * Math.PI) / wavelengthPx(wavelengthM);
}

/** v = fλ, in m/s. */
export function waveSpeed(frequencyHz: number, wavelengthM: number): number {
  return frequencyHz * wavelengthM;
}

export function waveY(x: number, phase: number, wavelengthM: number): number {
  return AMPLITUDE_PX * Math.sin(waveNumber(wavelengthM) * x - phase);
}

/** Smooth SVG path for the traveling wave at a given phase and wavelength. */
export function buildWavePath(phase: number, wavelengthM: number, step = 5): string {
  const points: string[] = [];
  for (let x = 0; x <= VIEW_WIDTH; x += step) {
    const y = EQUILIBRIUM_Y - waveY(x, phase, wavelengthM);
    points.push(`${x === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return points.join(" ");
}

/** Even spread of particle x-positions across the drawable width. */
export function particlePositions(count: number = PARTICLE_COUNT): number[] {
  const usable = VIEW_WIDTH - PARTICLE_MARGIN * 2;
  return Array.from({ length: count }, (_, i) => PARTICLE_MARGIN + (usable * i) / (count - 1));
}

/** Nearest crest (peak) x-position to `anchorX`, for measuring wavelength on screen. */
export function nearestCrestX(phase: number, wavelengthM: number, anchorX: number): number {
  const k = waveNumber(wavelengthM);
  const wlPx = wavelengthPx(wavelengthM);
  const base = (phase + Math.PI / 2) / k;
  const m = Math.round((anchorX - base) / wlPx);
  return base + m * wlPx;
}

// --- Learning panel ---------------------------------------------------------

export const LEARNING_PANEL_SECTIONS: { title: string; body: string; unit?: string }[] = [
  { title: "Wave speed", body: "How quickly the wave pattern travels.", unit: "m/s" },
  { title: "Frequency", body: "Number of complete cycles per second.", unit: "Hz" },
  { title: "Wavelength", body: "Distance between corresponding points of consecutive waves.", unit: "m" },
];

// --- Experiments ------------------------------------------------------------

export const FREQUENCY_EXPERIMENT_VALUES = [1, 2, 3, 4];
export const WAVELENGTH_EXPERIMENT_VALUES = [1, 2, 3, 4];
export const FREQUENCY_EXPERIMENT_WAVELENGTH = 2;
export const WAVELENGTH_EXPERIMENT_FREQUENCY = 2;

// --- Rearranged-equation explorer -------------------------------------------

export type SolveFor = "speed" | "frequency" | "wavelength";

export interface EquationExample {
  solveFor: SolveFor;
  label: string;
  formula: string;
  given: string;
  result: string;
}

export const EQUATION_EXAMPLES: EquationExample[] = [
  {
    solveFor: "speed",
    label: "Find Speed",
    formula: "v = f × λ",
    given: "f = 3 Hz, λ = 4 m",
    result: "v = 3 × 4 = 12 m/s",
  },
  {
    solveFor: "frequency",
    label: "Find Frequency",
    formula: "f = v / λ",
    given: "v = 10 m/s, λ = 2 m",
    result: "f = 10 / 2 = 5 Hz",
  },
  {
    solveFor: "wavelength",
    label: "Find Wavelength",
    formula: "λ = v / f",
    given: "v = 12 m/s, f = 4 Hz",
    result: "λ = 12 / 4 = 3 m",
  },
];

// --- Speed challenge ---------------------------------------------------------

export interface ChallengeQuestion {
  prompt: string;
  options: { label: string; correct: boolean }[];
  explanation: string;
}

export const CHALLENGE_QUESTIONS: ChallengeQuestion[] = [
  {
    prompt: "If f = 4 Hz and λ = 2 m, what is v?",
    options: [
      { label: "2 m/s", correct: false },
      { label: "6 m/s", correct: false },
      { label: "8 m/s", correct: true },
    ],
    explanation: "v = f × λ = 4 × 2 = 8 m/s.",
  },
  {
    prompt: "v = 12 m/s and f = 4 Hz. What is λ?",
    options: [
      { label: "2 m", correct: false },
      { label: "3 m", correct: true },
      { label: "4 m", correct: false },
    ],
    explanation: "λ = v / f = 12 / 4 = 3 m.",
  },
  {
    prompt: "v = 10 m/s and λ = 2 m. What is f?",
    options: [
      { label: "4 Hz", correct: false },
      { label: "5 Hz", correct: true },
      { label: "6 Hz", correct: false },
    ],
    explanation: "f = v / λ = 10 / 2 = 5 Hz.",
  },
];
