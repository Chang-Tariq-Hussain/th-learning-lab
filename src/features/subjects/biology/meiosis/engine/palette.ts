function hexToRgb(hex: string): [number, number, number] {
  const n = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16)) as [number, number, number];
}

/** Blend `hex` toward `toward` by `t` (0 = hex, 1 = toward). */
export function mix(hex: string, toward: string, t: number): string {
  const a = hexToRgb(hex);
  const b = hexToRgb(toward);
  const c = a.map((v, i) => Math.round(v + (b[i]! - v) * t));
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

/**
 * Homolog colours, the same in every stage and every panel: maternal homologs are blue, paternal homologs are
 * orange. (Blue/orange stay distinguishable for the common kinds of colour-blindness; the pair number, the gene
 * letters and the rod length are extra cues that never rely on colour.)
 */
export const HOMOLOG_COLOR = ["#2F6FEB", "#F0662B"] as const;
export const HOMOLOG_NAME = ["maternal", "paternal"] as const;
export const HOMOLOG_TAG = ["M", "P"] as const;
export const SELECT_COLOR = "#F5B800";
