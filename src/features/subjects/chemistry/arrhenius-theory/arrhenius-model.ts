/**
 * Arrhenius Theory — data model.
 *
 * Deliberately narrow: this simulation only teaches the Arrhenius
 * definition (a substance is classed by what it produces when
 * dissolved in water). Brønsted–Lowry, conjugate pairs, and any
 * numerical chemistry belong in a later visualization.
 */

export type IonKind = "h-plus" | "oh-minus" | "spectator";

export interface ArrheniusExample {
  slug: string;
  formula: string;
  name: string;
  /** "acid" | "base" | "neutral-reference" — the Arrhenius classification this example teaches. */
  role: "acid" | "base" | "neutral-reference";
  classificationLabel: string;
  blurb: string;
}

export const EXAMPLES: ArrheniusExample[] = [
  {
    slug: "hcl",
    formula: "HCl",
    name: "Hydrochloric acid",
    role: "acid",
    classificationLabel: "Arrhenius acid",
    blurb: "HCl dissolves in water and produces H⁺ ions — the defining behavior of an Arrhenius acid.",
  },
  {
    slug: "naoh",
    formula: "NaOH",
    name: "Sodium hydroxide",
    role: "base",
    classificationLabel: "Arrhenius base",
    blurb: "NaOH dissolves in water and produces OH⁻ ions — the defining behavior of an Arrhenius base.",
  },
  {
    slug: "h2o",
    formula: "H₂O",
    name: "Water",
    role: "neutral-reference",
    classificationLabel: "Neutral reference",
    blurb: "On its own, water doesn't add extra H⁺ or OH⁻ — in this basic model it's the neutral reference point.",
  },
];

export function getExample(slug: string): ArrheniusExample | undefined {
  return EXAMPLES.find((e) => e.slug === slug);
}

export const ION_COLOR: Record<IonKind, string> = {
  "h-plus": "#E0663D", // matches CLASSIFICATION_COLOR.acidic in acids-bases-basics
  "oh-minus": "#3D6FE0", // matches CLASSIFICATION_COLOR.basic in acids-bases-basics
  spectator: "#8A8578",
};

export const ION_LABEL: Record<IonKind, string> = {
  "h-plus": "H⁺",
  "oh-minus": "OH⁻",
  spectator: "",
};

export const MIN_DOSE = 1;
export const MAX_DOSE = 5;

export const ARRHENIUS_ACID_DEFINITION = "Produces H⁺ in aqueous solution.";
export const ARRHENIUS_BASE_DEFINITION = "Produces OH⁻ in aqueous solution.";

export const FOCUS_STATEMENT =
  "The Arrhenius definition focuses on what a substance produces when it dissolves in water.";
