import type { SortItem } from "../cellular-energy-shared/sort-panel";
import type { Q } from "../cellular-energy-shared/quiz-model";

/* Introduction to Cellular Energy — pure data (no React) so scripts/verify-energy-intro.ts can check it. */

export interface FlowStep {
  id: string;
  short: string;
  title: string;
  text: string;
  advanced: string;
  where: string;
}

export const FLOW_STEPS: FlowStep[] = [
  { id: "stored", short: "Stored energy", title: "Energy stored in nutrients", where: "Food molecules (glucose, fats, amino acids)", text: "Nutrient molecules store chemical energy in the arrangement of their atoms and bonds. Plants and other producers captured that energy from light; consumers obtain it by eating.", advanced: "Chemical potential energy is what makes oxidation of a fuel molecule energetically favourable: the products (CO₂ and H₂O) are at lower free energy than glucose plus O₂." },
  { id: "oxidation", short: "Breakdown & oxidation", title: "Breakdown and oxidation of fuel molecules", where: "Cytosol and mitochondria", text: "Enzymes break fuel molecules into smaller pieces in many small steps. Electrons are removed (oxidation) and carbon ends up as CO₂. Doing it stepwise lets the cell capture energy instead of losing it all at once as heat.", advanced: "Oxidation = loss of electrons (often with hydrogen). The electrons are accepted by carriers such as NAD⁺, which becomes NADH." },
  { id: "transfer", short: "Energy transfer", title: "Transfer through metabolic reactions", where: "Electron carriers and membranes", text: "The energy released is carried forward in electron carriers (NADH, FADH₂) and, in mitochondria, as a proton gradient across a membrane.", advanced: "The Cellular Respiration lab follows these carriers through the electron transport chain; here it is enough to see that energy is passed from molecule to molecule." },
  { id: "atp", short: "ATP production", title: "ATP production", where: "Mostly the inner mitochondrial membrane (ATP synthase)", text: "Part of the released free energy is used to join ADP and Pi into ATP. The rest is released as heat. ATP is a shared, ready-to-use energy carrier.", advanced: "Under standard values roughly one third of the free energy of glucose oxidation ends up in ATP; under real cellular conditions the share is estimated to be higher. Either way, a large fraction is dissipated as heat." },
  { id: "work", short: "ATP powers work", title: "Use of ATP to power cellular work", where: "Anywhere in the cell", text: "ATP hydrolysis is coupled to energy-requiring processes: transport against gradients, movement, and building large molecules. ADP and Pi return to be recharged.", advanced: "Coupling makes the total ΔG negative. The ATP & Energy Release lab shows the molecular details." },
];

export const KEY_TERMS = [
  { term: "Chemical energy", def: "Energy stored in bonds and molecular arrangement, such as in glucose." },
  { term: "Free energy (G)", def: "The portion of a system's energy that can do work. ΔG < 0: releases free energy; ΔG > 0: needs it." },
  { term: "Metabolism", def: "All the chemical reactions of a cell." },
  { term: "Catabolism", def: "Breaking large molecules into smaller ones; usually releases free energy." },
  { term: "Anabolism", def: "Building large molecules from small ones; requires free energy." },
  { term: "ATP", def: "The shared energy carrier that couples energy-releasing to energy-requiring reactions." },
];

export interface MetaExample {
  id: string;
  label: string;
  from: string;
  to: string;
  note: string;
}

export const CATABOLIC_EXAMPLES: MetaExample[] = [
  { id: "glucose", label: "Glucose breakdown (cellular respiration)", from: "glucose + O₂", to: "CO₂ + H₂O", note: "Releases a large amount of free energy; part is captured in ATP. See the Cellular Respiration lab." },
  { id: "starch", label: "Starch digestion", from: "starch", to: "glucose units", note: "Hydrolysis of polymers into monomers." },
  { id: "fat", label: "Fatty acid oxidation", from: "fatty acid", to: "acetyl-CoA units", note: "Feeds the citric acid cycle." },
];
export const ANABOLIC_EXAMPLES: MetaExample[] = [
  { id: "protein", label: "Protein synthesis", from: "amino acids", to: "protein", note: "Peptide bonds form; ATP/GTP energy drives each step." },
  { id: "glycogen", label: "Glycogen synthesis", from: "glucose units", to: "glycogen", note: "Glucose is first activated using energy from ATP/UTP." },
  { id: "photosyn", label: "Sugar synthesis (Calvin cycle)", from: "CO₂", to: "sugar", note: "Uses ATP and NADPH made in the light reactions." },
];

export const COMPARE_ROWS: { feature: string; cat: string; ana: string }[] = [
  { feature: "Direction", cat: "Large molecules → smaller molecules", ana: "Small molecules → larger molecules" },
  { feature: "Free energy", cat: "Usually releases (ΔG < 0)", ana: "Requires input (ΔG > 0)" },
  { feature: "Role of ATP", cat: "ATP is made (some of the energy is captured)", ana: "ATP is used (hydrolysis coupled to the reaction)" },
  { feature: "Example", cat: "Glucose → CO₂ + H₂O", ana: "Amino acids → protein" },
  { feature: "Heat", cat: "Some free energy lost as heat", ana: "Some free energy lost as heat" },
];

/** Simplified energy ledger for aerobic oxidation of glucose, as shares of the free energy released. Illustrative: ranges are commonly cited. */
export const LEDGER = { atpLow: 0.34, atpHigh: 0.4 };

export const SORT_META: SortItem[] = [
  { id: "m1", text: "Glycolysis: glucose is split into two pyruvate", category: "cat", why: "A larger molecule is broken into smaller ones." },
  { id: "m2", text: "Linking amino acids into a protein", category: "ana", why: "Small molecules are assembled into a larger one." },
  { id: "m3", text: "Digesting starch into glucose", category: "cat", why: "A polymer is broken into monomers." },
  { id: "m4", text: "Making glycogen from glucose", category: "ana", why: "Many glucose units are joined; energy input is required." },
  { id: "m5", text: "Oxidising fatty acids to acetyl-CoA", category: "cat", why: "A long molecule is broken into two-carbon pieces." },
  { id: "m6", text: "Building a triglyceride from glycerol and fatty acids", category: "ana", why: "Larger lipid molecules are synthesised." },
  { id: "m7", text: "Copying DNA from nucleotides", category: "ana", why: "Nucleotides are assembled into a long polymer." },
  { id: "m8", text: "Breaking down proteins into amino acids", category: "cat", why: "A larger molecule is hydrolysed into smaller units." },
];

export const SORT_FREE: SortItem[] = [
  { id: "f1", text: "ATP + H₂O → ADP + Pi", category: "rel", why: "ΔG is negative: it releases free energy." },
  { id: "f2", text: "Oxidising glucose to CO₂ and H₂O", category: "rel", why: "The products are at much lower free energy." },
  { id: "f3", text: "Building a protein from amino acids", category: "req", why: "Synthesis increases order and free energy: it needs an input." },
  { id: "f4", text: "ADP + Pi → ATP", category: "req", why: "The reverse of hydrolysis: it needs energy." },
  { id: "f5", text: "Pumping Na⁺ out of a cell against its gradient", category: "req", why: "Active transport moves a substance uphill." },
  { id: "f6", text: "Oxygen diffusing into a cell down its gradient", category: "rel", why: "Moving down a gradient releases free energy." },
  { id: "f7", text: "Muscle fibres sliding to shorten the muscle", category: "req", why: "Mechanical work requires an input, supplied by ATP." },
  { id: "f8", text: "Making sugar from CO₂ in the Calvin cycle", category: "req", why: "Building sugar needs ATP and NADPH." },
];

export const SORT_COUPLING: SortItem[] = [
  { id: "c1", text: "Na⁺/K⁺ pump moving ions", category: "atp", why: "Active transport is powered by ATP hydrolysis." },
  { id: "c2", text: "Water moving across a membrane by osmosis", category: "no", why: "Osmosis is passive: it follows a water-potential gradient." },
  { id: "c3", text: "Kinesin carrying a vesicle", category: "atp", why: "Motor proteins use ATP at every step." },
  { id: "c4", text: "Oxygen diffusing from blood into a cell", category: "no", why: "Simple diffusion needs no ATP." },
  { id: "c5", text: "Synthesising a protein", category: "atp", why: "Charging tRNAs and peptide-bond formation use ATP/GTP." },
  { id: "c6", text: "Muscle contraction", category: "atp", why: "Myosin heads use ATP in the cross-bridge cycle." },
];

export const IDENTIFY_BANK: Q[] = [
  { id: "i1", prompt: "What is the original energy source for nearly all food chains?", options: [{ id: "a", label: "Sunlight, captured by photosynthesis" }, { id: "b", label: "ATP" }, { id: "c", label: "Heat" }], correct: "a", why: "Producers convert light energy to chemical energy; other organisms depend on it." },
  { id: "i2", prompt: "Which form of energy is stored in glucose?", options: [{ id: "a", label: "Chemical energy" }, { id: "b", label: "Thermal energy" }, { id: "c", label: "Kinetic energy" }], correct: "a", why: "Energy is stored in the arrangement of atoms and bonds." },
  { id: "i3", prompt: "What do NADH and FADH₂ do?", options: [{ id: "a", label: "Carry energy as high-energy electrons" }, { id: "b", label: "Store energy long term as fat" }, { id: "c", label: "Provide oxygen" }], correct: "a", why: "They are electron carriers that pass energy on to the electron transport chain." },
  { id: "i4", prompt: "A cell oxidises glucose. Where does most of the energy that is not captured in ATP go?", options: [{ id: "a", label: "Released as heat" }, { id: "b", label: "It is destroyed" }, { id: "c", label: "Stored in CO₂" }], correct: "a", why: "Energy is conserved: the uncaptured portion is dissipated as heat." },
  { id: "i5", prompt: "Which statement is consistent with the conservation of energy?", options: [{ id: "a", label: "Cells transform energy; they do not create it" }, { id: "b", label: "Cells create energy from nothing" }, { id: "c", label: "Cells destroy energy when making ATP" }], correct: "a", why: "Energy is neither created nor destroyed, only transformed." },
  { id: "i6", prompt: "What is ATP's main role?", options: [{ id: "a", label: "To transfer usable free energy to cellular work" }, { id: "b", label: "To be the cell's long-term fuel" }, { id: "c", label: "To make glucose" }], correct: "a", why: "ATP is an energy-transfer molecule, continually made and used." },
  { id: "i7", prompt: "Where is most ATP made in a typical aerobic eukaryotic cell?", options: [{ id: "a", label: "Mitochondria" }, { id: "b", label: "Ribosomes" }, { id: "c", label: "Nucleus" }], correct: "a", why: "Oxidative phosphorylation at the inner mitochondrial membrane makes most of the ATP." },
  { id: "i8", prompt: "Which pair is a correct match?", options: [{ id: "a", label: "Catabolism — releases free energy" }, { id: "b", label: "Anabolism — releases free energy" }, { id: "c", label: "Catabolism — builds large molecules" }], correct: "a", why: "Catabolism breaks molecules down and typically releases energy." },
];

export const PREDICT_BANK: Q[] = [
  { id: "p1", prompt: "A cell is building a protein. Will the overall process require or release free energy?", options: [{ id: "a", label: "Require — ATP-coupled" }, { id: "b", label: "Release" }, { id: "c", label: "Neither" }], correct: "a", why: "Anabolic reactions need a free-energy input." },
  { id: "p2", prompt: "A cell is deprived of nutrients. Predict what happens to its ATP production.", options: [{ id: "a", label: "It falls, because the fuel for ATP production is missing" }, { id: "b", label: "It rises" }, { id: "c", label: "It is unchanged" }], correct: "a", why: "Energy flows from fuel to ATP; no fuel, little ATP." },
  { id: "p3", prompt: "Glucose is oxidised in the cell. Which will be formed?", options: [{ id: "a", label: "CO₂, H₂O, ATP and heat" }, { id: "b", label: "More glucose" }, { id: "c", label: "Only heat" }], correct: "a", why: "Oxidation gives CO₂ and water, with part of the energy captured in ATP." },
  { id: "p3b", prompt: "ATP hydrolysis is coupled to a pump. What happens to ΔG of the combined process?", options: [{ id: "a", label: "It is negative overall" }, { id: "b", label: "It is positive overall" }, { id: "c", label: "It is meaningless" }], correct: "a", why: "Coupling works only if the combined ΔG is negative." },
];

export const CHALLENGE_BANK: Q[] = [
  ...IDENTIFY_BANK,
  { id: "x1", prompt: "A student says 'Cells make energy.' Best correction?", options: [{ id: "a", label: "Cells transform energy from one form to another" }, { id: "b", label: "That is correct" }, { id: "c", label: "Cells only store energy" }], correct: "a", why: "Energy is conserved. Cells transform chemical energy into ATP, work and heat." },
  { id: "x2", prompt: "Why does ATP matter to anabolism?", options: [{ id: "a", label: "Its hydrolysis is coupled to energy-requiring synthesis" }, { id: "b", label: "It becomes part of every product" }, { id: "c", label: "It removes heat" }], correct: "a", why: "ATP provides the energy input through coupling." },
];

export const ARRANGE_LABELS = FLOW_STEPS.map((s) => ({ label: s.title }));
