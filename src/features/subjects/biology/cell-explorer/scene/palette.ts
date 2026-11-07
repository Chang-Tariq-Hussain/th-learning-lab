import { ORGANELLES } from "../data/organelles";
import type { OrganelleId } from "../types";

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

export interface Tones {
  light: string;
  base: string;
  dark: string;
}

/** Light / base / dark tones for a structure, derived from its one legend colour so the scene and legend always agree. */
export function tones(id: OrganelleId): Tones {
  const base = ORGANELLES[id].color;
  return { light: mix(base, "#FFFFFF", 0.55), base, dark: mix(base, "#1F1030", 0.45) };
}

/** Stable gradient id for a structure. */
export const gradId = (id: OrganelleId) => `ce-g-${id}`;
