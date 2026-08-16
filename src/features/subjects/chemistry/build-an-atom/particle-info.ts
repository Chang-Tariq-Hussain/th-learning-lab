export type ParticleKind = "proton" | "neutron" | "electron";

export interface ParticleInfo {
  title: string;
  color: string;
  facts: string[];
}

export const PARTICLE_INFO: Record<ParticleKind, ParticleInfo> = {
  proton: {
    title: "Proton",
    color: "#E0524F",
    facts: ["Positive charge (+1)", "Found in the nucleus", "Determines which element this is"],
  },
  neutron: {
    title: "Neutron",
    color: "#8B95A1",
    facts: ["No charge (neutral)", "Found in the nucleus", "Adds mass without changing the element"],
  },
  electron: {
    title: "Electron",
    color: "#3D5AFE",
    facts: ["Negative charge (−1)", "Moves around the nucleus in shells", "Responsible for chemical bonding"],
  },
};

export type ChangeKind = "proton+" | "proton-" | "neutron+" | "neutron-" | "electron+" | "electron-";

const HINTS: Record<ChangeKind, string[]> = {
  "proton+": [
    "Adding a proton changes the element itself — you've made something new.",
    "More protons means a higher atomic number. What element is this now?",
  ],
  "proton-": [
    "Removing a proton changes the element — you're going backward on the periodic table.",
    "Fewer protons, lower atomic number — a different element entirely.",
  ],
  "neutron+": [
    "Neutrons add mass but don't change the element or the charge.",
    "This is now a heavier version of the same element — an isotope.",
  ],
  "neutron-": [
    "Removing a neutron makes this isotope lighter, but it's still the same element.",
    "Same protons, same element — just less mass.",
  ],
  "electron+": [
    "More electrons than protons now — that makes a negative ion.",
    "Extra electrons add negative charge without changing the element.",
  ],
  "electron-": [
    "Fewer electrons than protons now — that makes a positive ion.",
    "Removing electrons leaves the atom with a positive charge.",
  ],
};

let hintCursor = 0;

/** Cycles through a couple of phrasings per change type so repeated clicks don't show the exact same sentence every time. */
export function getExperimentHint(change: ChangeKind): string {
  const options = HINTS[change];
  hintCursor = (hintCursor + 1) % options.length;
  return options[hintCursor]!;
}
