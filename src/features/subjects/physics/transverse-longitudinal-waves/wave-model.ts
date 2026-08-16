/**
 * Transverse vs Longitudinal Waves — data model.
 *
 * Deliberately has no amplitude / wavelength / frequency controls —
 * those are reserved for later wave-motion lessons. The whole point
 * here is the direction a medium particle moves relative to the
 * direction the wave travels, so the only thing a student can change
 * is playback speed.
 *
 * Both modes share one traveling-wave phase: y/x-displacement =
 * D·sin(kx − φ), φ increasing over time — the same convention Basic
 * Wave Motion uses, so the pattern always travels to the right.
 */

export const VIEW_WIDTH = 800;
export const VIEW_HEIGHT = 280;
export const EQUILIBRIUM_Y = VIEW_HEIGHT / 2;
export const PARTICLE_MARGIN = 28;

export const WAVELENGTH_PX = 160;

export const TRANSVERSE_PARTICLE_COUNT = 16;
export const TRANSVERSE_AMPLITUDE_PX = 46;

export const LONGITUDINAL_PARTICLE_COUNT = 30;
/** Max horizontal sway of a particle from its resting spot. Kept well under one wavelength/particle-spacing so particles never swap order. */
export const LONGITUDINAL_DISPLACEMENT_PX = 14;

/** Angular phase rate (rad/s) at speed = 1×. */
export const BASE_ANGULAR_SPEED = 1.6;

export const SPEED_MIN = 0.5;
export const SPEED_MAX = 2.5;
export const SPEED_STEP = 0.5;
export const SPEED_DEFAULT = 1;

export type WaveMode = "transverse" | "longitudinal";

export function waveNumber(): number {
  return (2 * Math.PI) / WAVELENGTH_PX;
}

/** Even spread of resting x-positions across the drawable width. */
export function particlePositions(count: number): number[] {
  const usable = VIEW_WIDTH - PARTICLE_MARGIN * 2;
  return Array.from({ length: count }, (_, i) => PARTICLE_MARGIN + (usable * i) / (count - 1));
}

/** Vertical offset of a transverse particle resting at x0. */
export function transverseOffset(x0: number, phase: number): number {
  return TRANSVERSE_AMPLITUDE_PX * Math.sin(waveNumber() * x0 - phase);
}

/** Horizontal offset of a longitudinal particle resting at x0. */
export function longitudinalOffset(x0: number, phase: number): number {
  return LONGITUDINAL_DISPLACEMENT_PX * Math.sin(waveNumber() * x0 - phase);
}

/** Smooth SVG path tracing the transverse wave through all particle positions. */
export function buildTransversePath(phase: number, step = 5): string {
  const points: string[] = [];
  for (let x = PARTICLE_MARGIN; x <= VIEW_WIDTH - PARTICLE_MARGIN; x += step) {
    const y = EQUILIBRIUM_Y - transverseOffset(x, phase);
    points.push(`${x === PARTICLE_MARGIN ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return points.join(" ");
}

/** Nearest x0 (to `anchorX`) where longitudinal particles are most tightly bunched together. */
export function nearestCompressionX(phase: number, anchorX = VIEW_WIDTH * 0.28): number {
  const k = waveNumber();
  const base = (phase + Math.PI) / k;
  const m = Math.round((anchorX - base) / WAVELENGTH_PX);
  return base + m * WAVELENGTH_PX;
}

/** Nearest x0 (to `anchorX`) where longitudinal particles are most spread apart. */
export function nearestRarefactionX(phase: number, anchorX = VIEW_WIDTH * 0.66): number {
  const k = waveNumber();
  const base = phase / k;
  const m = Math.round((anchorX - base) / WAVELENGTH_PX);
  return base + m * WAVELENGTH_PX;
}

// --- Comparison panel -----------------------------------------------------

export interface WaveSummary {
  label: string;
  motionLabel: string;
  motionArrow: string;
  description: string;
  examples: string[];
}

export const WAVE_SUMMARY: Record<WaveMode, WaveSummary> = {
  transverse: {
    label: "Transverse",
    motionLabel: "Perpendicular",
    motionArrow: "↕",
    description: "Particles move perpendicular to the direction of wave travel.",
    examples: ["Waves on a rope", "Surface water waves (simplified model)"],
  },
  longitudinal: {
    label: "Longitudinal",
    motionLabel: "Parallel",
    motionArrow: "↔",
    description: "Particles move parallel to the direction of wave travel.",
    examples: ["Sound waves in air", "Compression waves in a spring"],
  },
};

// --- Learning panel ---------------------------------------------------------

export const LEARNING_PANEL_SECTIONS: { title: string; body: string }[] = [
  { title: "Transverse wave", body: "Particles oscillate perpendicular to the direction of wave travel." },
  { title: "Longitudinal wave", body: "Particles oscillate parallel to the direction of wave travel." },
  { title: "Compression", body: "A region where particles are closer together." },
  { title: "Rarefaction", body: "A region where particles are farther apart." },
];

// --- Mini challenge -----------------------------------------------------

export interface ChallengeQuestion {
  prompt: string;
  options: { label: string; correct: boolean }[];
  explanation: string;
}

export const CHALLENGE_QUESTIONS: ChallengeQuestion[] = [
  {
    prompt: "In which direction do particles move in a transverse wave?",
    options: [
      { label: "Parallel to wave", correct: false },
      { label: "Perpendicular to wave", correct: true },
    ],
    explanation: "In a transverse wave, particles oscillate perpendicular to the direction of wave propagation.",
  },
  {
    prompt: "In which direction do particles move in a longitudinal wave?",
    options: [
      { label: "Parallel to wave", correct: true },
      { label: "Perpendicular to wave", correct: false },
    ],
    explanation: "In a longitudinal wave, particles oscillate parallel to the direction of wave propagation.",
  },
  {
    prompt: "A region where particles are closer together is called a...",
    options: [
      { label: "Rarefaction", correct: false },
      { label: "Compression", correct: true },
    ],
    explanation: "A compression is a region where particles are closer together than usual.",
  },
];
