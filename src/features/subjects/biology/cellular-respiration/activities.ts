import type { PredictEvent } from "../meiosis/activities/model";
import type { Q } from "../cellular-energy-shared/quiz-model";
import type { SortItem } from "../cellular-energy-shared/sort-panel";
import { STAGES, STAGE_FIRST_BEAT } from "./model";

const first = (s: number, off = 0) => STAGE_FIRST_BEAT[s]! + off;

/** Predict mode: the clock pauses just before `beat` and asks what will happen. */
export const PREDICT_EVENTS: PredictEvent[] = [
  { id: "gly-invest", beat: first(0, 1), question: "Glycolysis is about to start. What does the cell do with ATP first?", options: [{ id: "spend", label: "Spends 2 ATP to energise the glucose" }, { id: "make", label: "Makes 4 ATP immediately" }, { id: "none", label: "Nothing — ATP is not involved yet" }], correct: "spend", explanation: "The investment phase uses 2 ATP. The payoff phase later makes 4, so the net gain is 2." },
  { id: "gly-split", beat: first(0, 2), question: "The 6-carbon sugar is about to be split. What will the products be?", options: [{ id: "two3", label: "Two 3-carbon molecules" }, { id: "three2", label: "Three 2-carbon molecules" }, { id: "six1", label: "Six 1-carbon molecules (CO₂)" }], correct: "two3", explanation: "6 C → 2 × 3 C. No carbon is lost as CO₂ in glycolysis." },
  { id: "pdh-co2", beat: first(1, 1), question: "Pyruvate (3 C) is converted to acetyl-CoA (2 C acetyl). Where does the extra carbon go?", options: [{ id: "co2", label: "Released as CO₂" }, { id: "atp", label: "Becomes part of ATP" }, { id: "water", label: "Becomes water" }], correct: "co2", explanation: "One carbon per pyruvate leaves as CO₂ (2 CO₂ per glucose)." },
  { id: "cycle-co2", beat: first(2, 3), question: "In the citric acid cycle, citrate (6 C) is converted to a 5-carbon molecule. What is released?", options: [{ id: "co2nadh", label: "CO₂ and NADH" }, { id: "fadh", label: "FADH₂ only" }, { id: "o2", label: "O₂" }], correct: "co2nadh", explanation: "Isocitrate dehydrogenase releases CO₂ and reduces NAD⁺ to NADH." },
  { id: "etc-o2", beat: first(3, 5), question: "Electrons reach the end of the electron transport chain. What accepts them?", options: [{ id: "o2", label: "Oxygen, forming water" }, { id: "co2", label: "Carbon dioxide" }, { id: "glucose", label: "Glucose" }], correct: "o2", explanation: "Oxygen is the final electron acceptor; ½ O₂ + 2 e⁻ + 2 H⁺ → H₂O." },
  { id: "synthase", beat: first(4, 2), question: "What makes the ATP synthase rotor turn?", options: [{ id: "flow", label: "Protons flowing down their gradient through it" }, { id: "atp", label: "ATP hydrolysis" }, { id: "o2", label: "Oxygen binding to it" }], correct: "flow", explanation: "Proton flow (chemiosmosis) drives rotation, which drives ATP synthesis." },
];

export const blockingEvent = (beat: number, answered: ReadonlySet<string>) => PREDICT_EVENTS.find((e) => e.beat === beat && !answered.has(e.id)) ?? null;

export const ARRANGE_LABELS = STAGES.map((s) => ({ label: `${s.name} (${s.locationLabel.split(" (")[0]})` }));

export const SORT_LOCATION: SortItem[] = [
  { id: "l1", text: "Glucose is split into two pyruvate", category: "cytosol", why: "Glycolysis happens in the cytosol." },
  { id: "l2", text: "Pyruvate is converted to acetyl-CoA, releasing CO₂", category: "matrix", why: "Pyruvate oxidation takes place in the mitochondrial matrix." },
  { id: "l3", text: "Oxaloacetate is regenerated", category: "matrix", why: "The citric acid cycle runs in the matrix." },
  { id: "l4", text: "Electrons are passed from Complex I to ubiquinone", category: "inner", why: "The electron transport chain is in the inner mitochondrial membrane." },
  { id: "l5", text: "ATP synthase makes ATP from ADP + Pi", category: "inner", why: "ATP synthase spans the inner mitochondrial membrane." },
  { id: "l6", text: "2 ATP are invested in the sugar", category: "cytosol", why: "The investment phase of glycolysis is in the cytosol." },
  { id: "l7", text: "FAD is reduced to FADH₂ as succinate becomes fumarate", category: "matrix", why: "This citric acid cycle step happens in the matrix (the enzyme is attached to the inner membrane)." },
];

export const CHALLENGE_BANK: Q[] = [
  { id: "r1", prompt: "Where does glycolysis occur?", options: [{ id: "a", label: "Cytosol" }, { id: "b", label: "Mitochondrial matrix" }, { id: "c", label: "Inner mitochondrial membrane" }], correct: "a", why: "Glycolysis is cytosolic and does not need oxygen." },
  { id: "r2", prompt: "What is the net ATP yield of glycolysis per glucose?", options: [{ id: "a", label: "2 ATP (4 made − 2 spent)" }, { id: "b", label: "4 ATP" }, { id: "c", label: "36 ATP" }], correct: "a", why: "2 ATP are invested and 4 are produced: net 2." },
  { id: "r3", prompt: "How many NADH are made in glycolysis per glucose?", options: [{ id: "a", label: "2" }, { id: "b", label: "1" }, { id: "c", label: "6" }], correct: "a", why: "One NADH per three-carbon sugar, two per glucose." },
  { id: "r4", prompt: "Per glucose, pyruvate oxidation gives:", options: [{ id: "a", label: "2 acetyl-CoA, 2 CO₂, 2 NADH" }, { id: "b", label: "1 acetyl-CoA, 1 CO₂, 1 NADH" }, { id: "c", label: "2 acetyl-CoA, 4 CO₂, 6 NADH" }], correct: "a", why: "Each of the 2 pyruvates gives 1 acetyl-CoA, 1 CO₂ and 1 NADH." },
  { id: "r5", prompt: "Per turn of the citric acid cycle:", options: [{ id: "a", label: "2 CO₂, 3 NADH, 1 FADH₂, 1 ATP" }, { id: "b", label: "4 CO₂, 6 NADH, 2 FADH₂, 2 ATP" }, { id: "c", label: "1 CO₂, 1 NADH, 3 FADH₂, 0 ATP" }], correct: "a", why: "The second option is per glucose (two turns)." },
  { id: "r6", prompt: "Per glucose, how many CO₂ are released in the citric acid cycle?", options: [{ id: "a", label: "4" }, { id: "b", label: "2" }, { id: "c", label: "6" }], correct: "a", why: "2 per turn × 2 turns." },
  { id: "r7", prompt: "Which molecule is regenerated at the end of each cycle turn?", options: [{ id: "a", label: "Oxaloacetate" }, { id: "b", label: "Acetyl-CoA" }, { id: "c", label: "Pyruvate" }], correct: "a", why: "Oxaloacetate combines with the next acetyl-CoA." },
  { id: "r8", prompt: "What is the role of oxygen in cellular respiration?", options: [{ id: "a", label: "Final electron acceptor in the electron transport chain" }, { id: "b", label: "It is split to make CO₂" }, { id: "c", label: "It is the fuel" }], correct: "a", why: "Oxygen accepts electrons at Complex IV and forms water." },
  { id: "r9", prompt: "Does Complex II pump protons?", options: [{ id: "a", label: "No" }, { id: "b", label: "Yes, 4 H⁺" }, { id: "c", label: "Yes, 2 H⁺" }], correct: "a", why: "Complex II passes electrons to Q without pumping, so FADH₂ yields fewer protons pumped than NADH." },
  { id: "r10", prompt: "What does the electron transport chain directly produce?", options: [{ id: "a", label: "A proton gradient (and water)" }, { id: "b", label: "ATP directly at each complex" }, { id: "c", label: "Glucose" }], correct: "a", why: "ATP synthase, not the chain itself, makes ATP using the gradient." },
  { id: "r11", prompt: "What drives ATP synthase?", options: [{ id: "a", label: "Proton flow down the electrochemical gradient" }, { id: "b", label: "NADH binding to it" }, { id: "c", label: "ATP hydrolysis" }], correct: "a", why: "Chemiosmosis: protons flow through ATP synthase and turn its rotor." },
  { id: "r12", prompt: "How does ATP synthesis by ATP synthase differ from ATP hydrolysis?", options: [{ id: "a", label: "Synthesis needs energy (proton flow); hydrolysis releases free energy" }, { id: "b", label: "They are the same reaction" }, { id: "c", label: "Hydrolysis builds ATP" }], correct: "a", why: "ADP + Pi → ATP is energy-requiring; ATP + H₂O → ADP + Pi releases free energy." },
  { id: "r13", prompt: "A commonly taught ATP yield per glucose in many eukaryotic cells is:", options: [{ id: "a", label: "About 30–32, an estimate that varies" }, { id: "b", label: "Exactly 38 in every cell" }, { id: "c", label: "Exactly 2" }], correct: "a", why: "The value depends on shuttles, proton leak and ATP/ADP transport costs." },
  { id: "r14", prompt: "Why does fermentation occur when oxygen is unavailable?", options: [{ id: "a", label: "It regenerates NAD⁺ so glycolysis can continue" }, { id: "b", label: "It makes most of the ATP" }, { id: "c", label: "It uses an electron transport chain with nitrate" }], correct: "a", why: "Without NAD⁺, glycolysis stops. Fermentation makes only the 2 ATP of glycolysis." },
  { id: "r15", prompt: "Which statement is correct?", options: [{ id: "a", label: "Fermentation is not the same as anaerobic respiration" }, { id: "b", label: "Fermentation and anaerobic respiration are identical" }, { id: "c", label: "Fermentation uses oxygen" }], correct: "a", why: "Anaerobic respiration uses an electron transport chain with an acceptor other than O₂." },
  { id: "r16", prompt: "All 6 carbons of glucose leave the body as:", options: [{ id: "a", label: "CO₂ (2 from pyruvate oxidation, 4 from the cycle)" }, { id: "b", label: "Water" }, { id: "c", label: "ATP" }], correct: "a", why: "Carbon accounting: 2 + 4 = 6 CO₂." },
  { id: "r17", prompt: "Roughly how many H⁺ are pumped per NADH by the chain?", options: [{ id: "a", label: "About 10" }, { id: "b", label: "About 2" }, { id: "c", label: "About 40" }], correct: "a", why: "4 (I) + 4 (III) + 2 (IV)." },
  { id: "r18", prompt: "What happens to ATP production if oxygen is removed from a cell using the electron transport chain?", options: [{ id: "a", label: "It falls sharply: the chain stalls and the gradient cannot be maintained" }, { id: "b", label: "It rises" }, { id: "c", label: "It is unchanged" }], correct: "a", why: "Without a final electron acceptor the chain backs up." },
];
