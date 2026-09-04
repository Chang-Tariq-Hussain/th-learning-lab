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

export const MAGNESIUM: BondAtomInfo = {
  symbol: "Mg",
  name: "Magnesium",
  protons: 12,
  electrons: 12,
  valenceElectrons: 2,
};

export const OXYGEN: BondAtomInfo = {
  symbol: "O",
  name: "Oxygen",
  protons: 8,
  electrons: 8,
  valenceElectrons: 6,
};

export const NITROGEN: BondAtomInfo = {
  symbol: "N",
  name: "Nitrogen",
  protons: 7,
  electrons: 7,
  valenceElectrons: 5,
};

/**
 * IONIC PAIRS — each entry is one metal/nonmetal pair students can
 * choose between. `transferElectrons` is how many electrons move,
 * whole, from `donor` to `acceptor` — 1 for Na→Cl (each already one
 * electron from a full octet), 2 for Mg→O (magnesium has two valence
 * electrons to give away, oxygen needs two to complete its octet).
 * Both pairs end with the acceptor holding a full octet
 * (`acceptor.valenceElectrons + transferElectrons === 8`), which is
 * exactly why each pair works as a bond, not an arbitrary choice.
 */
export interface IonicPairConfig {
  id: "na-cl" | "mg-o";
  label: string;
  formula: string;
  donor: BondAtomInfo;
  acceptor: BondAtomInfo;
  transferElectrons: 1 | 2;
}

export const IONIC_PAIRS: Record<IonicPairConfig["id"], IonicPairConfig> = {
  "na-cl": {
    id: "na-cl",
    label: "Sodium + Chlorine",
    formula: "NaCl",
    donor: SODIUM,
    acceptor: CHLORINE,
    transferElectrons: 1,
  },
  "mg-o": {
    id: "mg-o",
    label: "Magnesium + Oxygen",
    formula: "MgO",
    donor: MAGNESIUM,
    acceptor: OXYGEN,
    transferElectrons: 2,
  },
};

export const IONIC_PAIR_ORDER: IonicPairConfig["id"][] = ["na-cl", "mg-o"];

/**
 * COVALENT PAIRS — one homonuclear diatomic per bond order, so
 * students see single, double, and triple bonds inside the same
 * simulation rather than only ever seeing H2's single bond. `order`
 * is how many electron pairs are shared; each atom also keeps
 * `(valenceElectrons - order) / 2` lone pairs of its own (0 for H2,
 * 2 for O2, 1 for N2) — the same simplified "just enough electrons
 * to reach a full outer shell" model `MAX_BONDS` in the Molecule
 * Builder's `build-model.ts` already uses, not a full quantum
 * treatment (see Part 15 of the Batch 2 brief).
 */
export interface CovalentPairConfig {
  id: "h-h" | "o-o" | "n-n";
  label: string;
  formula: string;
  atom: BondAtomInfo;
  order: 1 | 2 | 3;
  bondSymbol: string;
}

export const COVALENT_PAIRS: Record<CovalentPairConfig["id"], CovalentPairConfig> = {
  "h-h": {
    id: "h-h",
    label: "Hydrogen + Hydrogen",
    formula: "H₂",
    atom: HYDROGEN,
    order: 1,
    bondSymbol: "—",
  },
  "o-o": {
    id: "o-o",
    label: "Oxygen + Oxygen",
    formula: "O₂",
    atom: OXYGEN,
    order: 2,
    bondSymbol: "=",
  },
  "n-n": {
    id: "n-n",
    label: "Nitrogen + Nitrogen",
    formula: "N₂",
    atom: NITROGEN,
    order: 3,
    bondSymbol: "≡",
  },
};

export const COVALENT_PAIR_ORDER: CovalentPairConfig["id"][] = ["h-h", "o-o", "n-n"];

/** Lone (non-bonding) pairs remaining on each atom in a covalent pair, once `order` pairs are shared. */
export function lonePairsFor(pair: CovalentPairConfig): number {
  return (pair.atom.valenceElectrons - pair.order) / 2;
}

const BOND_ORDER_WORD: Record<1 | 2 | 3, string> = {
  1: "single",
  2: "double",
  3: "triple",
};

export function bondOrderWord(order: 1 | 2 | 3): string {
  return BOND_ORDER_WORD[order];
}

export const STATUS_TEXT: Record<BondStage, string> = {
  separate: "Atoms are separate.",
  bonding: "Electrons are moving…",
  bonded: "Bond formed!",
};

export const BOND_CAPTION: Record<BondMode, string> = {
  ionic: "Ionic Bond Formed!",
  covalent: "Covalent Bond Formed!",
};

/** Ionic charge label, e.g. "+" for one electron transferred, "2+" for two. */
export function ionicCharge(count: number, sign: "+" | "−"): string {
  return count === 1 ? sign : `${count}${sign}`;
}

/**
 * Pair-aware explanation text, replacing the old fixed per-mode
 * copy. Still just a couple of sentences (Part 15: educational
 * simplification, not a full electronegativity/formal-charge
 * treatment), but now names the actual atoms, the actual electron
 * count, and — for ionic — the resulting octet, so the explanation
 * changes meaningfully when the student switches pairs instead of
 * reading identically for Na+Cl and Mg+O.
 */
export function explanationFor(
  mode: BondMode,
  pair: IonicPairConfig | CovalentPairConfig,
): { title: string; points: string[] } {
  if (mode === "ionic") {
    const p = pair as IonicPairConfig;
    const donorCharge = ionicCharge(p.transferElectrons, "+");
    const acceptorCharge = ionicCharge(p.transferElectrons, "−");
    return {
      title: `How ${p.donor.name.toLowerCase()} and ${p.acceptor.name.toLowerCase()} form an ionic bond`,
      points: [
        `${p.donor.name} has ${p.donor.valenceElectrons} valence electron${p.donor.valenceElectrons === 1 ? "" : "s"} to give away; ${p.acceptor.name} needs ${p.transferElectrons} more to fill its outer shell.`,
        `${p.transferElectrons === 1 ? "One electron transfers" : `All ${p.transferElectrons} electrons transfer`} from ${p.donor.symbol} to ${p.acceptor.symbol}.`,
        `${p.donor.symbol} becomes ${p.donor.symbol}${donorCharge} and ${p.acceptor.symbol} becomes ${p.acceptor.symbol}${acceptorCharge} — now oppositely charged ions.`,
        `${p.acceptor.name} now has a full octet (${p.acceptor.valenceElectrons} + ${p.transferElectrons} = 8 electrons), and the opposite charges attract.`,
      ],
    };
  }
  const p = pair as CovalentPairConfig;
  const lone = lonePairsFor(p);
  return {
    title: `How ${p.atom.name.toLowerCase()} forms a ${bondOrderWord(p.order)} bond with itself`,
    points: [
      `Each ${p.atom.name.toLowerCase()} atom has ${p.atom.valenceElectrons} valence electrons and needs a full octet.`,
      `The two atoms share ${p.order} pair${p.order === 1 ? "" : "s"} of electrons — a ${bondOrderWord(p.order)} bond (${p.formula} is written ${p.atom.symbol}${p.bondSymbol}${p.atom.symbol}).`,
      lone > 0
        ? `The remaining ${lone} lone pair${lone === 1 ? "" : "s"} on each atom stay unshared, but still count toward its octet.`
        : `Neither atom has any electrons left over — the shared pair alone completes both atoms' outer shells.`,
      `Shared electrons count toward both atoms' octets at once, which is what holds the molecule together.`,
    ],
  };
}

/** Total time (ms) the "bonding" animation plays before settling into "bonded". Kept in one place so the visual transitions and the state-machine timer never drift apart. */
export const BONDING_DURATION_MS = 1300;
