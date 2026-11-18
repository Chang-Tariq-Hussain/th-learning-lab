/* Cellular Respiration — pure data and accounting (no React) so scripts/verify-respiration.ts can check every number. */

export type StageId = "glycolysis" | "pyruvate" | "citric" | "etc" | "chemi";
export type Location = "cytosol" | "matrix" | "inner";

export interface BeatDef {
  title: string;
  text: string;
  advanced: string;
}

export interface StageDef {
  id: StageId;
  name: string;
  short: string;
  location: Location;
  locationLabel: string;
  perGlucose: string;
  beats: BeatDef[];
}

export const STAGES: StageDef[] = [
  {
    id: "glycolysis", name: "Glycolysis", short: "Glycolysis", location: "cytosol", locationLabel: "Cytosol",
    perGlucose: "Per glucose: 2 pyruvate, 2 ATP (net), 2 NADH",
    beats: [
      { title: "One glucose, six carbons", text: "Glycolysis starts with one glucose molecule (6 carbons) in the cytosol. It needs no oxygen.", advanced: "Glycolysis has ten enzyme-catalysed steps; this lab shows the key events." },
      { title: "Investment phase: 2 ATP spent", text: "Two ATP each donate a phosphate to the sugar. The cell spends 2 ATP to energise glucose before it can be split.", advanced: "Glucose → glucose-6-phosphate → fructose-6-phosphate → fructose-1,6-bisphosphate (hexokinase, PFK-1)." },
      { title: "The six-carbon sugar is split", text: "The phosphorylated sugar splits into two three-carbon molecules (G3P). 6 carbons → 2 × 3 carbons.", advanced: "Aldolase splits fructose-1,6-bisphosphate into G3P and DHAP; DHAP is converted to a second G3P." },
      { title: "Payoff: NAD⁺ is reduced to NADH", text: "Each three-carbon sugar is oxidised: electrons and a hydrogen are passed to NAD⁺, forming NADH. That makes 2 NADH per glucose.", advanced: "G3P dehydrogenase: G3P + NAD⁺ + Pi → 1,3-bisphosphoglycerate + NADH + H⁺." },
      { title: "Payoff: 4 ATP made", text: "Phosphate groups are transferred straight to ADP (substrate-level phosphorylation). 2 per three-carbon molecule gives 4 ATP produced in all.", advanced: "Phosphoglycerate kinase and pyruvate kinase steps. Net: 4 produced − 2 invested = 2 ATP." },
      { title: "Result: 2 pyruvate", text: "Net yield per glucose: 2 pyruvate, 2 ATP (4 made − 2 spent) and 2 NADH. Carbon check: 2 × 3 = 6 carbons.", advanced: "If oxygen is absent, pyruvate is fermented so NAD⁺ is regenerated and glycolysis can continue." },
    ],
  },
  {
    id: "pyruvate", name: "Pyruvate oxidation", short: "Pyruvate oxidation", location: "matrix", locationLabel: "Mitochondrial matrix (eukaryotes)",
    perGlucose: "Per glucose: 2 acetyl-CoA, 2 CO₂, 2 NADH",
    beats: [
      { title: "Pyruvate enters the mitochondrion", text: "Both pyruvate molecules cross the outer and inner mitochondrial membranes into the matrix.", advanced: "A mitochondrial pyruvate carrier moves pyruvate across the inner membrane." },
      { title: "A carbon is lost as CO₂", text: "Each pyruvate (3 C) loses one carbon as CO₂, and NAD⁺ is reduced to NADH. Per glucose: 2 CO₂ and 2 NADH.", advanced: "Catalysed by the pyruvate dehydrogenase complex." },
      { title: "Acetyl-CoA is formed", text: "The remaining two-carbon acetyl group is attached to coenzyme A, giving acetyl-CoA. Per glucose: 2 acetyl-CoA.", advanced: "Acetyl-CoA is the entry point to the citric acid cycle for carbohydrates, fats and some amino acids." },
      { title: "Totals for this stage", text: "Per glucose: 2 acetyl-CoA, 2 CO₂, 2 NADH. Carbon check: 2 × 2 (in acetyl) + 2 (CO₂) = 6.", advanced: "No ATP is made directly in this step." },
    ],
  },
  {
    id: "citric", name: "Citric acid cycle", short: "Citric acid cycle", location: "matrix", locationLabel: "Mitochondrial matrix",
    perGlucose: "Per glucose (2 turns): 4 CO₂, 6 NADH, 2 FADH₂, 2 ATP",
    beats: [
      { title: "Acetyl-CoA meets oxaloacetate", text: "Acetyl-CoA (2 C) is about to join oxaloacetate (4 C). The cycle turns once for each acetyl-CoA.", advanced: "Each glucose gives 2 acetyl-CoA, so the cycle turns twice per glucose." },
      { title: "Citrate (6 C)", text: "Acetyl joins oxaloacetate and coenzyme A is released, forming citrate (6 C).", advanced: "Citrate synthase." },
      { title: "Isocitrate (6 C)", text: "Citrate is rearranged into isocitrate. Nothing is released in this step.", advanced: "Aconitase." },
      { title: "α-Ketoglutarate (5 C): CO₂ and NADH", text: "The first carbon leaves as CO₂ and NAD⁺ becomes NADH.", advanced: "Isocitrate dehydrogenase." },
      { title: "Succinyl-CoA (4 C): CO₂ and NADH", text: "The second carbon leaves as CO₂ and another NADH forms. The two CO₂ released equal the two carbons that entered.", advanced: "α-Ketoglutarate dehydrogenase complex." },
      { title: "Succinate (4 C): ATP (or GTP)", text: "Energy from the thioester bond makes one ATP (or GTP, which is equivalent) by substrate-level phosphorylation.", advanced: "Succinyl-CoA synthetase. GTP can pass its phosphate to ADP." },
      { title: "Fumarate (4 C): FADH₂", text: "FAD is reduced to FADH₂ as succinate is oxidised.", advanced: "Succinate dehydrogenase, which is also Complex II of the electron transport chain." },
      { title: "Malate (4 C)", text: "Water is added to fumarate, giving malate.", advanced: "Fumarase." },
      { title: "Oxaloacetate regenerated: NADH", text: "Malate is oxidised, forming a third NADH and regenerating oxaloacetate so the cycle can continue.", advanced: "Malate dehydrogenase." },
      { title: "Totals", text: "Per turn: 2 CO₂, 3 NADH, 1 FADH₂, 1 ATP. Per glucose (2 turns): 4 CO₂, 6 NADH, 2 FADH₂, 2 ATP.", advanced: "Oxygen is not used directly in the cycle, but the cycle runs only while NAD⁺ and FAD are regenerated by the electron transport chain." },
    ],
  },
  {
    id: "etc", name: "Electron transport chain", short: "Electron transport", location: "inner", locationLabel: "Inner mitochondrial membrane",
    perGlucose: "Per glucose: 10 NADH and 2 FADH₂ donate electrons; O₂ → H₂O",
    beats: [
      { title: "Protein complexes in the inner membrane", text: "Complexes I–IV sit in the inner membrane. Electrons will move through them in a fixed order, not randomly.", advanced: "Mobile carriers ubiquinone (Q) and cytochrome c link the complexes." },
      { title: "NADH gives electrons to Complex I", text: "NADH is oxidised back to NAD⁺ at Complex I. Its electrons pass to ubiquinone (Q). Complex I pumps about 4 H⁺ into the intermembrane space.", advanced: "Pumping is driven by the energy released as electrons move to carriers with higher electron affinity." },
      { title: "FADH₂ gives electrons to Complex II", text: "FADH₂ (from the citric acid cycle) feeds electrons into Q at Complex II. Complex II does not pump protons, so FADH₂ supports less pumping than NADH.", advanced: "Complex II is succinate dehydrogenase." },
      { title: "Q → Complex III → cytochrome c", text: "Q delivers electrons to Complex III, which passes them to cytochrome c in the intermembrane space. Complex III pumps about 4 H⁺ (per 2 electrons).", advanced: "The Q cycle explains how Complex III pumps four protons per two electrons." },
      { title: "Cytochrome c → Complex IV", text: "Cytochrome c delivers electrons to Complex IV, which pumps about 2 H⁺ per 2 electrons.", advanced: "Cytochrome c oxidase." },
      { title: "Oxygen is the final electron acceptor", text: "At Complex IV, electrons combine with O₂ and H⁺ to form water: ½ O₂ + 2 e⁻ + 2 H⁺ → H₂O. Without oxygen, the chain backs up.", advanced: "4 e⁻ + O₂ + 4 H⁺ → 2 H₂O." },
      { title: "Result: a proton gradient", text: "About 10 H⁺ are pumped per NADH and about 6 per FADH₂. The ETC itself does not make ATP; it builds the gradient.", advanced: "Exact stoichiometries differ slightly between sources; these are the commonly used values." },
    ],
  },
  {
    id: "chemi", name: "Chemiosmosis and ATP synthase", short: "Chemiosmosis", location: "inner", locationLabel: "Inner mitochondrial membrane",
    perGlucose: "Oxidative phosphorylation: roughly 26–28 ATP per glucose",
    beats: [
      { title: "The proton-motive force", text: "Protons accumulate in the intermembrane space. That creates a gradient of concentration (pH) and of charge across the inner membrane: the proton-motive force.", advanced: "Electrochemical gradient = ΔpH + membrane potential." },
      { title: "Protons flow through ATP synthase", text: "H⁺ can only cross the membrane through ATP synthase, flowing down their gradient (chemiosmosis).", advanced: "Protons enter half-channels in the F₀ c-ring." },
      { title: "The rotor turns", text: "Each proton passing through turns the c-ring and the attached central shaft.", advanced: "About 8 protons turn the c-ring of human ATP synthase once." },
      { title: "ATP is synthesised", text: "The turning shaft changes the shape of the three catalytic sites in F₁: they bind ADP + Pi, form ATP, then release it. ATP synthesis is the reverse of ATP hydrolysis and is driven by proton flow.", advanced: "Binding-change mechanism: loose → tight → open. One full turn makes 3 ATP." },
      { title: "Oxidative phosphorylation", text: "ETC (oxidation) coupled to ATP synthase (phosphorylation) is called oxidative phosphorylation. About 4 H⁺ are needed per ATP, which gives ~2.5 ATP per NADH and ~1.5 per FADH₂.", advanced: "8 H⁺ per 3 ATP at the synthase plus about 1 H⁺ per ATP for moving ADP, Pi and ATP across the membrane." },
    ],
  },
];

export const BEAT_STAGE: number[] = STAGES.flatMap((s, i) => s.beats.map(() => i));
export const BEAT_COUNT = BEAT_STAGE.length;
export const STAGE_FIRST_BEAT: number[] = STAGES.map((_, i) => BEAT_STAGE.indexOf(i));
export const STAGE_LAST_BEAT: number[] = STAGES.map((_, i) => BEAT_STAGE.lastIndexOf(i));

/* ------------------------------------------------------------------ yields (per glucose unless stated) */

export const YIELD = {
  glycolysis: { atpInvested: 2, atpProduced: 4, atpNet: 2, nadh: 2, fadh2: 0, pyruvate: 2, co2: 0 },
  pyruvate: { acetylCoA: 2, co2: 2, nadh: 2, fadh2: 0, atp: 0 },
  citricPerTurn: { co2: 2, nadh: 3, fadh2: 1, atp: 1 },
  turnsPerGlucose: 2,
} as const;

export const CITRIC_PER_GLUCOSE = {
  co2: YIELD.citricPerTurn.co2 * YIELD.turnsPerGlucose,
  nadh: YIELD.citricPerTurn.nadh * YIELD.turnsPerGlucose,
  fadh2: YIELD.citricPerTurn.fadh2 * YIELD.turnsPerGlucose,
  atp: YIELD.citricPerTurn.atp * YIELD.turnsPerGlucose,
};

export const TOTAL_NADH = YIELD.glycolysis.nadh + YIELD.pyruvate.nadh + CITRIC_PER_GLUCOSE.nadh; // 10
export const TOTAL_FADH2 = YIELD.glycolysis.fadh2 + CITRIC_PER_GLUCOSE.fadh2; // 2
export const TOTAL_CO2 = YIELD.pyruvate.co2 + CITRIC_PER_GLUCOSE.co2; // 6
export const SUBSTRATE_ATP = YIELD.glycolysis.atpNet + CITRIC_PER_GLUCOSE.atp; // 4

/** H⁺ pumped per carrier (per pair of electrons). Complex II pumps none. */
export const PUMP = { complexI: 4, complexII: 0, complexIII: 4, complexIV: 2 } as const;
export const H_PER_NADH = PUMP.complexI + PUMP.complexIII + PUMP.complexIV; // 10
export const H_PER_FADH2 = PUMP.complexII + PUMP.complexIII + PUMP.complexIV; // 6
/** H⁺ per ATP: 8 per 3 ATP at ATP synthase (c8 ring) plus ~1 for substrate carriers. */
export const H_PER_ATP = 8 / 3 + 1; // ≈ 3.67 (commonly rounded to 4)
export const H_PER_ATP_ROUNDED = 4;

export interface ConditionOptions {
  /** NADH made in glycolysis enters via the malate–aspartate shuttle (≈2.5 ATP each) or the glycerol-3-phosphate shuttle (≈1.5). */
  shuttle: "malate-aspartate" | "glycerol-phosphate";
  /** "modern" = 2.5 / 1.5 ATP per NADH / FADH₂; "classic" = older textbook values 3 / 2. */
  ratios: "modern" | "classic";
  /** Fraction of oxidative phosphorylation lost to proton leak or other conditions (0–0.3). */
  leak: number;
}

export interface YieldBreakdown {
  glycolysis: number;
  pyruvate: number;
  citric: number;
  oxidative: number;
  total: number;
  perCarrier: { nadhMito: number; nadhCyto: number; fadh2: number };
}

export function atpYield(o: ConditionOptions): YieldBreakdown {
  const nadhATP = o.ratios === "modern" ? 2.5 : 3;
  const fadhATP = o.ratios === "modern" ? 1.5 : 2;
  const cytoATP = o.shuttle === "malate-aspartate" ? nadhATP : fadhATP;
  const nadhMito = (YIELD.pyruvate.nadh + CITRIC_PER_GLUCOSE.nadh) * nadhATP; // 8 NADH
  const nadhCyto = YIELD.glycolysis.nadh * cytoATP;
  const fadh2 = TOTAL_FADH2 * fadhATP;
  const oxidative = (nadhMito + nadhCyto + fadh2) * (1 - o.leak);
  const glycolysis = YIELD.glycolysis.atpNet;
  const citric = CITRIC_PER_GLUCOSE.atp;
  return { glycolysis, pyruvate: 0, citric, oxidative, total: glycolysis + citric + oxidative, perCarrier: { nadhMito, nadhCyto, fadh2 } };
}

/* ------------------------------------------------------------------ carbon accounting */

export interface CarbonRow {
  molecule: string;
  count: number;
  carbonsEach: number;
}

/** Carbon atoms present after each stage, tracking everything that carries carbon (per glucose). */
export function carbonLedger(stage: number): CarbonRow[] {
  switch (stage) {
    case -1:
      return [{ molecule: "Glucose", count: 1, carbonsEach: 6 }];
    case 0:
      return [{ molecule: "Pyruvate", count: 2, carbonsEach: 3 }];
    case 1:
      return [{ molecule: "Acetyl-CoA (acetyl part)", count: 2, carbonsEach: 2 }, { molecule: "CO₂", count: 2, carbonsEach: 1 }];
    default:
      return [{ molecule: "CO₂ (all stages)", count: TOTAL_CO2, carbonsEach: 1 }];
  }
}
export const carbonTotal = (rows: CarbonRow[]) => rows.reduce((s, r) => s + r.count * r.carbonsEach, 0);

/* ------------------------------------------------------------------ citric acid cycle nodes */

export interface CycleNode {
  id: string;
  name: string;
  carbons: number;
  beat: number; // beat (within the stage) at which this intermediate is formed
  simple: string;
  enzyme: string;
  gives: string;
}

export const CYCLE_NODES: CycleNode[] = [
  { id: "oaa", name: "Oxaloacetate", carbons: 4, beat: 0, simple: "The 4-carbon starting molecule. It is regenerated at the end, which is why this is a cycle.", enzyme: "Malate dehydrogenase makes it", gives: "NADH (when formed)" },
  { id: "citrate", name: "Citrate", carbons: 6, beat: 1, simple: "Acetyl (2 C) joins oxaloacetate (4 C).", enzyme: "Citrate synthase", gives: "Releases coenzyme A" },
  { id: "isocitrate", name: "Isocitrate", carbons: 6, beat: 2, simple: "Citrate is rearranged. No energy carrier made.", enzyme: "Aconitase", gives: "Nothing" },
  { id: "akg", name: "α-Ketoglutarate", carbons: 5, beat: 3, simple: "One carbon is lost as CO₂.", enzyme: "Isocitrate dehydrogenase", gives: "CO₂ + NADH" },
  { id: "succcoa", name: "Succinyl-CoA", carbons: 4, beat: 4, simple: "A second carbon is lost as CO₂.", enzyme: "α-Ketoglutarate dehydrogenase", gives: "CO₂ + NADH" },
  { id: "succinate", name: "Succinate", carbons: 4, beat: 5, simple: "Energy is used to make ATP (or GTP).", enzyme: "Succinyl-CoA synthetase", gives: "ATP / GTP" },
  { id: "fumarate", name: "Fumarate", carbons: 4, beat: 6, simple: "Succinate is oxidised, giving FADH₂.", enzyme: "Succinate dehydrogenase", gives: "FADH₂" },
  { id: "malate", name: "Malate", carbons: 4, beat: 7, simple: "Water is added.", enzyme: "Fumarase", gives: "Nothing" },
];

/** What has been produced by the cycle after reaching beat `b` (0–9) of one turn. */
export function cycleTally(b: number): { co2: number; nadh: number; fadh2: number; atp: number } {
  return { co2: (b >= 3 ? 1 : 0) + (b >= 4 ? 1 : 0), nadh: (b >= 3 ? 1 : 0) + (b >= 4 ? 1 : 0) + (b >= 8 ? 1 : 0), fadh2: b >= 6 ? 1 : 0, atp: b >= 5 ? 1 : 0 };
}
export const cycleCarbonAfter = (b: number) => (b <= 0 ? 4 : b === 1 || b === 2 ? 6 : b === 3 ? 5 : 4);

/* ------------------------------------------------------------------ glycolysis running tally */

export function glycolysisTally(b: number): { atpSpent: number; atpMade: number; nadh: number; carbonUnits: string } {
  return { atpSpent: b >= 1 ? 2 : 0, atpMade: b >= 4 ? 4 : 0, nadh: b >= 3 ? 2 : 0, carbonUnits: b >= 5 ? "2 × 3 C (pyruvate)" : b >= 2 ? "2 × 3 C (G3P)" : "1 × 6 C (glucose)" };
}

/* ------------------------------------------------------------------ overall equation */

export const EQUATION = "C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O + energy";
export const EQUATION_ATOMS = {
  left: { C: 6, H: 12, O: 6 + 12 },
  right: { C: 6, H: 12, O: 12 + 6 },
};

export const ATOM_FLOW: Record<"C" | "H" | "O", { title: string; text: string }> = {
  C: { title: "Carbon", text: "All 6 carbons of glucose end up in CO₂: 2 are released in pyruvate oxidation and 4 in the citric acid cycle. No CO₂ is made in glycolysis or in the electron transport chain." },
  H: { title: "Hydrogen", text: "Hydrogen atoms (as electrons plus protons) are carried by NADH and FADH₂ to the electron transport chain, where they end up in water. The 12 H of glucose balance the 12 H of 6 H₂O." },
  O: { title: "Oxygen", text: "The 6 O₂ you breathe in are used only at the end of the chain, where they accept electrons and form water. The oxygen atoms in CO₂ come from glucose and from water used in intermediate reactions, not directly from O₂." },
};

export const ENERGY_NOTE = "Some of the free energy released (very roughly 30–40%) is captured in ATP; the rest is released as heat. Energy is conserved.";

/* ------------------------------------------------------------------ aerobic vs fermentation */

export type FermentationType = "lactic" | "alcoholic";
export const FERMENTATION: Record<FermentationType, { name: string; where: string; steps: string; products: string; atp: number }> = {
  lactic: { name: "Lactic acid fermentation", where: "Muscle cells at high demand, many bacteria", steps: "pyruvate + NADH → lactate + NAD⁺", products: "lactate (lactic acid)", atp: 2 },
  alcoholic: { name: "Alcoholic fermentation", where: "Yeast and some plant tissues", steps: "pyruvate → acetaldehyde + CO₂; acetaldehyde + NADH → ethanol + NAD⁺", products: "ethanol + CO₂", atp: 2 },
};
export const ANAEROBIC_RESPIRATION_NOTE = "Anaerobic respiration is different from fermentation: some prokaryotes use an electron transport chain with a final acceptor other than O₂ (for example nitrate or sulfate). Fermentation uses no electron transport chain at all.";
