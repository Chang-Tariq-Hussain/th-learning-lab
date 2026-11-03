import type { AtomState } from "./atom-model";

export type PresetGroup = "Neutral atoms" | "Isotopes" | "Positive ions" | "Negative ions";

export interface AtomPreset {
  id: string;
  label: string;
  group: PresetGroup;
  atom: AtomState;
  note: string;
}

const P = (id: string, label: string, group: PresetGroup, protons: number, neutrons: number, electrons: number, note: string): AtomPreset => ({
  id,
  label,
  group,
  atom: { protons, neutrons, electrons },
  note,
});

/** Preset atoms, isotopes and ions. Neutron counts are those of the most common isotope unless the preset is an isotope. */
export const PRESETS: AtomPreset[] = [
  P("h", "Hydrogen", "Neutral atoms", 1, 0, 1, "The simplest atom: one proton and one electron."),
  P("he", "Helium-4", "Neutral atoms", 2, 2, 2, "Its first shell is full with 2 electrons."),
  P("c12", "Carbon-12", "Neutral atoms", 6, 6, 6, "Six protons, six neutrons, six electrons."),
  P("o16", "Oxygen-16", "Neutral atoms", 8, 8, 8, "Equal protons and electrons make it neutral."),
  P("ne20", "Neon-20", "Neutral atoms", 10, 10, 10, "Its outer shell is full."),
  P("na23", "Sodium-23", "Neutral atoms", 11, 12, 11, "One electron alone in its outer shell."),
  P("h2", "Hydrogen-2 (deuterium)", "Isotopes", 1, 1, 1, "Same element as hydrogen, but with 1 neutron."),
  P("h3", "Hydrogen-3 (tritium)", "Isotopes", 1, 2, 1, "A radioactive isotope of hydrogen."),
  P("c13", "Carbon-13", "Isotopes", 6, 7, 6, "A stable, heavier isotope of carbon."),
  P("c14", "Carbon-14", "Isotopes", 6, 8, 6, "A radioactive isotope of carbon."),
  P("cl37", "Chlorine-37", "Isotopes", 17, 20, 17, "Chlorine also occurs as chlorine-35."),
  P("li+", "Lithium ion (Li⁺)", "Positive ions", 3, 4, 2, "Lost 1 electron: charge +1."),
  P("na+", "Sodium ion (Na⁺)", "Positive ions", 11, 12, 10, "Lost its single outer electron: 2, 8."),
  P("mg2+", "Magnesium ion (Mg²⁺)", "Positive ions", 12, 12, 10, "Lost 2 electrons: charge +2."),
  P("al3+", "Aluminium ion (Al³⁺)", "Positive ions", 13, 14, 10, "Lost 3 electrons: charge +3."),
  P("ca2+", "Calcium ion (Ca²⁺)", "Positive ions", 20, 20, 18, "Lost 2 electrons: charge +2."),
  P("f-", "Fluoride ion (F⁻)", "Negative ions", 9, 10, 10, "Gained 1 electron: charge −1."),
  P("o2-", "Oxide ion (O²⁻)", "Negative ions", 8, 8, 10, "Gained 2 electrons: charge −2."),
  P("cl-", "Chloride ion (Cl⁻)", "Negative ions", 17, 18, 18, "Gained 1 electron: charge −1."),
  P("s2-", "Sulfide ion (S²⁻)", "Negative ions", 16, 16, 18, "Gained 2 electrons: charge −2."),
];

export const PRESET_GROUPS: PresetGroup[] = ["Neutral atoms", "Isotopes", "Positive ions", "Negative ions"];
