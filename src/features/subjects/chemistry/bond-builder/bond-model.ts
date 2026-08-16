export type BondMode = "ionic" | "covalent";

/**
 * Three-stage state machine, deliberately coarse — this feature is about
 * the *concept* of bond formation, not a physically accurate simulation.
 * `separate`: nothing has happened yet.
 * `bonding`: atoms are sliding together and electrons are mid-transfer/share.
 * `bonded`: final resting state — charges/shared pair shown, caption revealed.
 */
export type BondStage = "separate" | "bonding" | "bonded";

export interface BondAtomInfo {
  symbol: string;
  name: string;
  protons: number;
  electrons: number;
  valenceElectrons: number;
}

export const SODIUM: BondAtomInfo = {
  symbol: "Na",
  name: "Sodium",
  protons: 11,
  electrons: 11,
  valenceElectrons: 1,
};

export const CHLORINE: BondAtomInfo = {
  symbol: "Cl",
  name: "Chlorine",
  protons: 17,
  electrons: 17,
  valenceElectrons: 7,
};

export const HYDROGEN: BondAtomInfo = {
  symbol: "H",
  name: "Hydrogen",
  protons: 1,
  electrons: 1,
  valenceElectrons: 1,
};

export const STATUS_TEXT: Record<BondStage, string> = {
  separate: "Atoms are separate.",
  bonding: "Electrons are moving…",
  bonded: "Bond formed!",
};

export const BOND_CAPTION: Record<BondMode, string> = {
  ionic: "Ionic Bond Formed!",
  covalent: "Covalent Bond Formed!",
};

export const EXPLANATION: Record<BondMode, { title: string; points: string[] }> = {
  ionic: {
    title: "How an ionic bond forms",
    points: [
      "An electron is transferred from one atom to another.",
      "The atoms become oppositely charged ions.",
      "Opposite charges attract.",
    ],
  },
  covalent: {
    title: "How a covalent bond forms",
    points: [
      "Atoms share electrons.",
      "The shared electrons help hold the atoms together.",
    ],
  },
};

/** Total time (ms) the "bonding" animation plays before settling into "bonded". Kept in one place so the visual transitions and the state-machine timer never drift apart. */
export const BONDING_DURATION_MS = 1300;
