export type Vec3 = [number, number, number];

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const GOLDEN_RATIO_CONJ = 0.6180339887498949;

/** Centre-to-centre spacing scale and nucleon radius, in scene units. */
export const NUCLEON_RADIUS = 0.5;
/** Centre-to-centre scale: chosen so the closest two nucleons overlap by no more than a quarter of a diameter. */
const SPREAD = 1.28;

/**
 * Slot k of a solid-sphere packing: a 3D "sunflower" where the radius grows
 * with the cube root of k, so volume per slot is constant, and the direction
 * follows two golden-ratio sequences to spread slots evenly. A slot does not
 * depend on how many other slots are used, so adding a nucleon never moves the
 * existing ones.
 */
export function nucleonSlot(k: number): Vec3 {
  const radius = SPREAD * Math.cbrt(k + 0.5);
  const z = 1 - 2 * ((k * GOLDEN_RATIO_CONJ) % 1);
  const ring = Math.sqrt(Math.max(0, 1 - z * z));
  const theta = k * GOLDEN_ANGLE;
  return [Math.cos(theta) * ring * radius, z * radius, Math.sin(theta) * ring * radius];
}

/**
 * Protons and neutrons alternate through the slots so the nucleus reads as a
 * mixed cluster; whichever kind is left over takes the slots after the mixed
 * ones.
 */
export function nucleonPositions(protons: number, neutrons: number): { protons: Vec3[]; neutrons: Vec3[] } {
  const mixed = Math.min(protons, neutrons);
  const p: Vec3[] = [];
  const n: Vec3[] = [];
  for (let i = 0; i < protons; i++) p.push(nucleonSlot(i < mixed ? 2 * i : 2 * mixed + (i - mixed)));
  for (let j = 0; j < neutrons; j++) n.push(nucleonSlot(j < mixed ? 2 * j + 1 : 2 * mixed + (j - mixed)));
  return { protons: p, neutrons: n };
}

/** Radius of the sphere that contains `count` nucleons. */
export function nucleusRadius(count: number): number {
  if (count <= 0) return 0;
  const farthest = nucleonSlot(count - 1);
  return Math.max(NUCLEON_RADIUS, Math.hypot(...farthest) + NUCLEON_RADIUS);
}

/** Radius of shell i (0-based), in scene units: just outside the nucleus, then evenly spaced. */
export function shellRadius(i: number, nucleonCount: number): number {
  return Math.max(3.6, nucleusRadius(nucleonCount) + 1.5) + i * 1.9;
}
