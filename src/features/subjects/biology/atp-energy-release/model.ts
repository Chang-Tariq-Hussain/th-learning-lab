import type { Q } from "../cellular-energy-shared/quiz-model";

/* --------------------------------------------------------------------------------------------------------------
 * ATP & Energy Release — pure data and maths (no React), so scripts/verify-atp.ts can check it.
 * ------------------------------------------------------------------------------------------------------------ */

export type PartId = "adenine" | "ribose" | "pAlpha" | "pBeta" | "pGamma" | "pi";
export type MoleculeKind = "ATP" | "ADP";

export interface Part {
  id: PartId;
  name: string;
  group: "base" | "sugar" | "phosphate";
  blurb: string;
  detail: string;
}

export const PARTS: Record<PartId, Part> = {
  adenine: { id: "adenine", name: "Adenine", group: "base", blurb: "A nitrogen-containing base (a purine).", detail: "The same base that appears in DNA and RNA. It identifies the molecule as an adenine nucleotide but is not the part that is changed during hydrolysis." },
  ribose: { id: "ribose", name: "Ribose", group: "sugar", blurb: "A five-carbon sugar.", detail: "Adenine + ribose together form adenosine. Ribose joins adenine on one side and the first phosphate on the other." },
  pAlpha: { id: "pAlpha", name: "α-phosphate", group: "phosphate", blurb: "The phosphate attached directly to ribose.", detail: "Joined to ribose by a phosphate ester bond. It stays attached to adenosine when ATP is hydrolyzed to ADP." },
  pBeta: { id: "pBeta", name: "β-phosphate", group: "phosphate", blurb: "The middle phosphate.", detail: "Joined to the α- and γ-phosphates by phosphoanhydride bonds. In ADP it becomes the terminal phosphate." },
  pGamma: { id: "pGamma", name: "γ-phosphate (terminal)", group: "phosphate", blurb: "The outermost phosphate of ATP.", detail: "This is the phosphate transferred to another molecule or released as inorganic phosphate (Pi) during hydrolysis. Four negative charges on the ATP molecule sit close together here." },
  pi: { id: "pi", name: "Inorganic phosphate (Pi)", group: "phosphate", blurb: "A free phosphate released by hydrolysis.", detail: "Pi is HPO₄²⁻ at cellular pH. It is more stable than the phosphate in ATP: it has resonance-stabilised forms and is well hydrated." },
};

export const PART_ORDER: Record<MoleculeKind, PartId[]> = {
  ATP: ["adenine", "ribose", "pAlpha", "pBeta", "pGamma"],
  ADP: ["adenine", "ribose", "pAlpha", "pBeta"],
};

export const PHOSPHATE_COUNT: Record<MoleculeKind, number> = { ATP: 3, ADP: 2 };
/** Approximate net charge of the free molecule at cellular pH (as ATP⁴⁻ and ADP³⁻). */
export const NET_CHARGE: Record<MoleculeKind, number> = { ATP: -4, ADP: -3 };

/** Standard-state free-energy change of ATP + H₂O → ADP + Pi, in kJ/mol (pH 7, 1 M standard states). */
export const DELTA_G_STANDARD = -30.5;
/** Typical range in living cells, where [ATP]/[ADP][Pi] is held far above equilibrium (kJ/mol). */
export const DELTA_G_CELL: [number, number] = [-65, -50];

/* ------------------------------------------------------------------ pseudo-3D projection */

export interface P3 {
  x: number;
  y: number;
  z: number;
}

export function rotate(p: P3, ry: number, rx: number): P3 {
  const cy = Math.cos(ry);
  const sy = Math.sin(ry);
  const x1 = p.x * cy + p.z * sy;
  const z1 = -p.x * sy + p.z * cy;
  const cx = Math.cos(rx);
  const sx = Math.sin(rx);
  return { x: x1, y: p.y * cx - z1 * sx, z: p.y * sx + z1 * cx };
}

/** Perspective projection: points nearer the viewer (larger z) are drawn larger. */
export function project(p: P3, ry: number, rx: number, cam = 620): { x: number; y: number; s: number; z: number } {
  const r = rotate(p, ry, rx);
  const s = cam / (cam - r.z);
  return { x: r.x * s, y: r.y * s, s, z: r.z };
}

/** Centres of the three phosphates, ribose and adenine in model space (units are SVG pixels at zoom 1). */
export const CENTRES: Record<Exclude<PartId, "pi">, P3> = {
  adenine: { x: -250, y: -8, z: 26 },
  ribose: { x: -118, y: 6, z: -14 },
  pAlpha: { x: -14, y: 14, z: 6 },
  pBeta: { x: 84, y: -10, z: 22 },
  pGamma: { x: 182, y: 12, z: -6 },
};
export const PHOSPHATE_R = 27;

/** Vertices of the adenine (six-membered ring + fused five-membered ring) and the ribose ring, tilted slightly in 3D. */
export function ringPoints(id: "adenine" | "ribose"): { hex?: P3[]; pent: P3[] } {
  if (id === "ribose") {
    const c = CENTRES.ribose;
    return { pent: Array.from({ length: 5 }, (_, i) => ({ x: c.x + 36 * Math.cos(-Math.PI / 2 + (i * 2 * Math.PI) / 5), y: c.y + 36 * Math.sin(-Math.PI / 2 + (i * 2 * Math.PI) / 5), z: c.z + 14 * Math.sin(i * 1.3) })) };
  }
  const c = CENTRES.adenine;
  const hex = Array.from({ length: 6 }, (_, i) => ({ x: c.x - 22 + 44 * Math.cos((i * Math.PI) / 3), y: c.y + 44 * Math.sin((i * Math.PI) / 3), z: c.z + 0.28 * 44 * Math.sin((i * Math.PI) / 3) }));
  // five-membered ring shares the hexagon's right-hand edge (vertices 5 and 0 → 0 and 1 with this ordering)
  const a = hex[0]!;
  const b = hex[1]!;
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, z: (a.z + b.z) / 2 };
  const out = { x: mid.x + 46, y: mid.y, z: mid.z + 4 };
  const p3 = { x: a.x + 30, y: a.y - 4, z: a.z };
  const p4 = { x: b.x + 30, y: b.y + 4, z: b.z };
  return { hex, pent: [a, p3, out, p4, b] };
}

/* ------------------------------------------------------------------ hydrolysis beats */

export interface Beat {
  title: string;
  short: string;
  text: string;
  advanced: string;
}

export const HYDROLYSIS_BEATS: Beat[] = [
  { title: "ATP before hydrolysis", short: "ATP", text: "ATP carries three phosphate groups in a row. At cellular pH they are strongly negatively charged and crowd close together, which makes the molecule less stable than its products.", advanced: "Free ATP is about ATP⁴⁻. The repulsion between negative charges is one reason ATP + H₂O sits at a higher free energy than ADP + Pi — it is not a 'high-energy bond' that stores energy in the bond itself." },
  { title: "Water and enzyme approach", short: "Water", text: "An ATPase enzyme positions a water molecule next to the terminal phosphoanhydride bond. Hydrolysis means 'splitting using water'.", advanced: "Uncatalysed, ATP hydrolysis is slow at body temperature. Enzymes (ATPases) speed it up and, crucially, link it to a specific job." },
  { title: "Water attacks the terminal phosphate", short: "Attack", text: "The oxygen of water attacks the γ-phosphate. The bond between the β- and γ-phosphates breaks while new bonds to oxygen form. Breaking a bond always costs energy — the energy release comes from the overall change.", advanced: "Bond breaking requires energy; bond making releases it. ATP hydrolysis is favourable because the products (ADP and Pi) are more stable overall: less charge repulsion, more resonance stabilisation of Pi, and better hydration." },
  { title: "ADP + Pi + H⁺ formed", short: "Products", text: "ATP + H₂O → ADP + Pi (+ H⁺). One phosphate leaves. ADP keeps two phosphates; Pi is released as a separate ion.", advanced: "Written fully: ATP⁴⁻ + H₂O → ADP³⁻ + HPO₄²⁻ + H⁺ near pH 7." },
  { title: "Free energy released", short: "Free energy", text: "The reaction has a negative change in Gibbs free energy: about −30.5 kJ/mol under standard conditions, and about −50 to −65 kJ/mol in a living cell where ATP is kept far above equilibrium.", advanced: "ΔG = ΔG°′ + RT ln([ADP][Pi] / [ATP]). Cells keep [ATP] high relative to [ADP][Pi], making ΔG more negative than the standard value. If nothing is coupled to it, the free energy is simply lost as heat." },
  { title: "Energy coupling", short: "Coupling", text: "A reaction that needs energy (ΔG > 0) cannot run alone. Coupled to ATP hydrolysis, the combined reaction has a negative ΔG, so the work can proceed.", advanced: "Coupling is usually through a shared intermediate: the phosphate is transferred to the reactant or to the protein, which changes its energy or shape (phosphorylation)." },
  { title: "Work done, Pi released", short: "Work", text: "The phosphorylated protein changes shape and does its job, then releases Pi and returns to its original shape, ready for another ATP.", advanced: "Each shape change is driven by the favourable transfer, not by heat. The ADP and Pi are now available to be recycled into ATP." },
];

/* ------------------------------------------------------------------ ATP cycle */

export interface CycleStep {
  label: string;
  text: string;
}

export const CYCLE_STEPS: CycleStep[] = [
  { label: "ATP is available", text: "ATP is present at the site of cellular work, such as a pump, a motor protein or a biosynthesis enzyme." },
  { label: "Hydrolysis couples to work", text: "ATP + H₂O → ADP + Pi. The negative ΔG is coupled to an energy-requiring process, which then proceeds." },
  { label: "ADP and Pi are released", text: "Work has been done. ADP and Pi are free again; the free energy that was available has been used or lost as heat." },
  { label: "Energy input rejoins ADP + Pi", text: "Rebuilding ATP is endergonic (ΔG about +30.5 kJ/mol standard). It needs an energy input, mostly from cellular respiration." },
  { label: "ATP is regenerated", text: "ATP is ready to power more work. The cycle repeats many times a minute: ATP is a carrier, not a store." },
];

export const REGENERATION_SOURCES = [
  { name: "Oxidative phosphorylation", where: "Inner mitochondrial membrane (eukaryotes)", note: "ATP synthase driven by the proton gradient; most ATP in aerobic cells." },
  { name: "Substrate-level phosphorylation", where: "Glycolysis (cytosol) and citric acid cycle (matrix)", note: "A phosphate is transferred to ADP directly from an intermediate molecule." },
  { name: "Photophosphorylation", where: "Thylakoid membrane of chloroplasts", note: "Light energy drives a proton gradient that ATP synthase uses." },
  { name: "Creatine phosphate (muscle)", where: "Muscle cytoplasm", note: "A short-term phosphate donor that quickly re-phosphorylates ADP." },
];

/** Simplified balance: fraction of the adenine-nucleotide pool that is ATP for a given supply and demand (0–10 each). Purely illustrative. */
export function atpFraction(supply: number, demand: number): number {
  if (supply <= 0 && demand <= 0) return 0.9;
  const frac = supply / (supply + demand * 0.8 + 1e-9);
  return Math.min(0.97, Math.max(0.02, frac));
}

/* ------------------------------------------------------------------ cellular work explorer */

export type WorkId = "pump" | "muscle" | "biosynthesis" | "motor";

export interface WorkExample {
  id: WorkId;
  title: string;
  summary: string;
  coupling: string;
  beats: { title: string; text: string }[];
}

export const WORK: WorkExample[] = [
  {
    id: "pump",
    title: "Active transport — Na⁺/K⁺ pump",
    summary: "Moves 3 Na⁺ out and 2 K⁺ in per ATP, against both concentration gradients.",
    coupling: "ATP phosphorylates the pump. The phosphate changes the pump's shape, which exposes the Na⁺ site to the outside. Pi leaving restores the shape.",
    beats: [
      { title: "Na⁺ binds inside", text: "Three Na⁺ bind to the pump from the cytosol, where Na⁺ is at low concentration." },
      { title: "ATP phosphorylates the pump", text: "ATP is hydrolysed on the pump; the γ-phosphate is attached to the protein and ADP is released." },
      { title: "Shape change: Na⁺ released outside", text: "The phosphorylated pump changes shape and releases the 3 Na⁺ into the high-Na⁺ outside." },
      { title: "K⁺ binds outside", text: "Two K⁺ bind from outside. This triggers release of the phosphate (Pi)." },
      { title: "Pump resets: K⁺ released inside", text: "With Pi gone, the pump returns to its first shape and releases 2 K⁺ into the cell." },
    ],
  },
  {
    id: "muscle",
    title: "Muscle contraction — myosin cross-bridge cycle",
    summary: "Each cycle uses one ATP per myosin head and slides actin filaments along.",
    coupling: "ATP binding releases the head from actin; hydrolysis re-cocks the head. Pi release then triggers the power stroke.",
    beats: [
      { title: "Myosin attached to actin", text: "At the end of a stroke the myosin head is bound tightly to actin with no nucleotide (the 'rigor' state)." },
      { title: "ATP binds: head detaches", text: "ATP binds myosin and the head lets go of actin." },
      { title: "ATP hydrolysed: head re-cocks", text: "Hydrolysis to ADP + Pi (both still bound) swings the head to its cocked position." },
      { title: "Head re-attaches; Pi leaves", text: "The cocked head binds a new site on actin and Pi is released." },
      { title: "Power stroke", text: "The head changes shape and pulls the actin filament; ADP is released and the cycle can repeat." },
    ],
  },
  {
    id: "biosynthesis",
    title: "Biosynthesis — building glutamine",
    summary: "Glutamate + NH₄⁺ → glutamine needs energy (ΔG > 0). ATP makes the combined reaction favourable.",
    coupling: "ATP donates a phosphate to glutamate, making an activated intermediate that NH₄⁺ can displace.",
    beats: [
      { title: "Uncoupled reaction does not proceed", text: "Glutamate + NH₄⁺ → glutamine on its own is endergonic (ΔG > 0): it will not run by itself." },
      { title: "ATP donates a phosphate", text: "On the enzyme, ATP transfers its γ-phosphate to glutamate, forming glutamyl phosphate and ADP." },
      { title: "Activated intermediate", text: "Phosphorylated glutamate is at a higher free energy and is easily attacked by NH₄⁺." },
      { title: "NH₄⁺ displaces the phosphate", text: "Ammonium bonds to the glutamate carbon, releasing Pi." },
      { title: "Glutamine made", text: "Net: glutamate + NH₄⁺ + ATP → glutamine + ADP + Pi. The overall ΔG is negative, so the synthesis proceeds." },
    ],
  },
  {
    id: "motor",
    title: "Cellular movement — kinesin on a microtubule",
    summary: "A motor protein 'walks' along a microtubule, using one ATP per 8 nm step to carry a vesicle.",
    coupling: "ATP binding and hydrolysis change the motor's shape in a cycle that swings the rear head forward.",
    beats: [
      { title: "Both heads on the track", text: "The kinesin motor stands on the microtubule, with a vesicle attached to its tail." },
      { title: "ATP binds the front head", text: "ATP binding locks the front head to the microtubule and swings the rear head forward." },
      { title: "Rear head passes the front", text: "The former rear head becomes the new front head, one step (about 8 nm) ahead." },
      { title: "ATP hydrolysed at the rear", text: "ATP is hydrolysed in the head now at the back, and Pi is released, weakening its grip." },
      { title: "Rear head detaches; cycle repeats", text: "The rear head lets go and the motor is ready to step again, carrying the vesicle forward." },
    ],
  },
];

/* ------------------------------------------------------------------ activities */

export interface IdentifyQ {
  prompt: string;
  target: PartId;
  molecule: MoleculeKind;
  why: string;
}

export const IDENTIFY: IdentifyQ[] = [
  { prompt: "Click the nitrogenous base of ATP.", target: "adenine", molecule: "ATP", why: "Adenine is the nitrogen-containing base." },
  { prompt: "Click the five-carbon sugar.", target: "ribose", molecule: "ATP", why: "Ribose is a five-carbon sugar (a pentose)." },
  { prompt: "Click the phosphate that is removed when ATP is hydrolysed to ADP.", target: "pGamma", molecule: "ATP", why: "The terminal (γ) phosphate is released as Pi." },
  { prompt: "Click the phosphate attached directly to ribose.", target: "pAlpha", molecule: "ATP", why: "The α-phosphate is joined to ribose by an ester bond." },
  { prompt: "Click the middle phosphate of ATP.", target: "pBeta", molecule: "ATP", why: "The β-phosphate lies between the α- and γ-phosphates." },
  { prompt: "In ADP, click the terminal phosphate.", target: "pBeta", molecule: "ADP", why: "ADP has two phosphates; the β-phosphate is now the outermost one." },
];

export const COMPARE_BANK: Q[] = [
  { id: "c1", prompt: "How many phosphate groups does ADP have?", options: [{ id: "a", label: "Two" }, { id: "b", label: "Three" }, { id: "c", label: "One" }], correct: "a", why: "ADP = adenosine diphosphate: two phosphates. ATP has three." },
  { id: "c2", prompt: "Which pair is at the higher free energy, under the same conditions?", options: [{ id: "a", label: "ATP + H₂O" }, { id: "b", label: "ADP + Pi" }, { id: "c", label: "They are exactly equal" }], correct: "a", why: "ATP + H₂O has the higher free energy; hydrolysis to ADP + Pi has a negative ΔG." },
  { id: "c3", prompt: "Which part is the same in ATP and ADP?", options: [{ id: "a", label: "Adenine and ribose" }, { id: "b", label: "The number of phosphates" }, { id: "c", label: "The net charge" }], correct: "a", why: "Both contain adenosine (adenine + ribose). They differ in phosphate number and therefore in charge." },
  { id: "c4", prompt: "At cellular pH, which carries the more negative charge?", options: [{ id: "a", label: "ATP (about 4−)" }, { id: "b", label: "ADP (about 3−)" }, { id: "c", label: "They carry the same charge" }], correct: "a", why: "Each phosphate adds negative charge: ATP is about 4−, ADP about 3−." },
  { id: "c5", prompt: "Which molecule is made when a phosphate is added back to ADP?", options: [{ id: "a", label: "ATP" }, { id: "b", label: "AMP" }, { id: "c", label: "Adenosine" }], correct: "a", why: "ADP + Pi → ATP (phosphorylation)." },
  { id: "c6", prompt: "A cell converts ATP to ADP + Pi at a pump. Which statement is correct?", options: [{ id: "a", label: "The ADP and Pi can be recycled into ATP" }, { id: "b", label: "ADP and Pi are waste that is never reused" }, { id: "c", label: "The adenine is destroyed" }], correct: "a", why: "ADP and Pi are recycled into ATP using energy from respiration or other energy-yielding processes." },
];

export const PREDICT_BANK: Q[] = [
  { id: "p1", prompt: "ATP is hydrolysed. What are the products?", options: [{ id: "a", label: "ADP + Pi (+ H⁺)" }, { id: "b", label: "AMP + glucose" }, { id: "c", label: "Adenine + three phosphates" }], correct: "a", why: "ATP + H₂O → ADP + Pi (+ H⁺).", hint: "One phosphate leaves." },
  { id: "p2", prompt: "Under cellular conditions, what is the sign of ΔG for ATP hydrolysis?", options: [{ id: "a", label: "Negative (free energy is released)" }, { id: "b", label: "Positive (free energy is absorbed)" }, { id: "c", label: "Exactly zero" }], correct: "a", why: "ΔG is negative: about −30.5 kJ/mol standard and −50 to −65 kJ/mol typically in cells." },
  { id: "p3", prompt: "ATP hydrolysis happens with nothing coupled to it. Where does the free energy go?", options: [{ id: "a", label: "Mostly lost as heat" }, { id: "b", label: "It is stored in the water" }, { id: "c", label: "It is destroyed" }], correct: "a", why: "Energy is conserved. Without coupling, it is dispersed as heat." },
  { id: "p4", prompt: "Which phosphate leaves first in normal ATP hydrolysis?", options: [{ id: "a", label: "The terminal (γ) phosphate" }, { id: "b", label: "The phosphate attached to ribose" }, { id: "c", label: "All three at once" }], correct: "a", why: "The γ-phosphate is removed, leaving ADP." },
  { id: "p5", prompt: "A cell stops respiring but keeps doing ATP-dependent work. What happens to its ATP pool?", options: [{ id: "a", label: "It falls quickly, because ATP is not stored in quantity" }, { id: "b", label: "It stays constant" }, { id: "c", label: "It rises" }], correct: "a", why: "A cell holds only a small ATP pool and recycles it constantly. Without regeneration it runs low in seconds to minutes.", hint: "Is ATP a long-term store?" },
  { id: "p6", prompt: "Cells keep ATP far above its equilibrium ratio to ADP + Pi. What does this do to ΔG of hydrolysis?", options: [{ id: "a", label: "Makes it more negative than the standard value" }, { id: "b", label: "Makes it less negative" }, { id: "c", label: "Has no effect" }], correct: "a", why: "ΔG = ΔG°′ + RT ln([ADP][Pi]/[ATP]); a high ATP ratio makes the log term more negative." },
];

export const WORK_BANK: Q[] = [
  { id: "w1", prompt: "Which of these is cellular work that directly uses ATP?", options: [{ id: "a", label: "A pump moving Na⁺ out of the cell against its gradient" }, { id: "b", label: "Oxygen diffusing into a cell" }, { id: "c", label: "Water moving by osmosis" }], correct: "a", why: "Active transport uses ATP. Diffusion and osmosis are passive." },
  { id: "w2", prompt: "Which process does NOT need ATP?", options: [{ id: "a", label: "Facilitated diffusion through a channel, down the gradient" }, { id: "b", label: "Muscle contraction" }, { id: "c", label: "Building a protein from amino acids" }], correct: "a", why: "Facilitated diffusion is passive: it follows the gradient." },
  { id: "w3", prompt: "In the myosin cycle, what does ATP binding do?", options: [{ id: "a", label: "Releases myosin from actin" }, { id: "b", label: "Locks myosin onto actin" }, { id: "c", label: "Makes actin" }], correct: "a", why: "ATP binding detaches the head; hydrolysis then re-cocks it." },
  { id: "w4", prompt: "How does ATP help a biosynthesis reaction that is endergonic on its own?", options: [{ id: "a", label: "By transferring a phosphate, so the combined reaction has a negative ΔG" }, { id: "b", label: "By heating the reactants" }, { id: "c", label: "By being used up as a building block of every product" }], correct: "a", why: "Energy coupling: phosphate transfer yields an activated intermediate." },
  { id: "w5", prompt: "A vesicle moves along a microtubule. What provides the energy?", options: [{ id: "a", label: "ATP hydrolysis by a motor protein such as kinesin" }, { id: "b", label: "Simple diffusion" }, { id: "c", label: "Osmosis" }], correct: "a", why: "Motor proteins use ATP to step along cytoskeletal tracks." },
  { id: "w6", prompt: "The Na⁺/K⁺ pump moves per ATP:", options: [{ id: "a", label: "3 Na⁺ out and 2 K⁺ in" }, { id: "b", label: "2 Na⁺ out and 3 K⁺ in" }, { id: "c", label: "1 Na⁺ out and 1 K⁺ in" }], correct: "a", why: "Three sodium ions leave and two potassium ions enter for each ATP hydrolysed." },
];

export const CHALLENGE_BANK: Q[] = [
  { id: "x1", prompt: "A student says: 'Breaking the bond in ATP releases energy.' What is the best correction?", options: [{ id: "a", label: "Breaking bonds costs energy; the overall hydrolysis has a negative ΔG because the products are more stable" }, { id: "b", label: "The statement is correct as written" }, { id: "c", label: "Energy is released only when the adenine is removed" }], correct: "a", why: "Bond breaking requires energy. The net reaction releases free energy because ADP + Pi are more stable overall." },
  { id: "x2", prompt: "Why do cells usually not spend glucose directly on pumping ions?", options: [{ id: "a", label: "Glucose is too chemically stable/slow; ATP is a rapidly available, shared energy-transfer molecule" }, { id: "b", label: "Glucose contains no energy" }, { id: "c", label: "Pumps are made of glucose" }], correct: "a", why: "Respiration captures part of glucose's energy in ATP; ATP couples to nearly every energy-requiring process." },
  { id: "x3", prompt: "ATP is best described as:", options: [{ id: "a", label: "An energy-transfer molecule that is continuously recycled" }, { id: "b", label: "A long-term energy store like fat or glycogen" }, { id: "c", label: "A waste product of metabolism" }], correct: "a", why: "Cells hold little ATP and turn it over constantly." },
  { id: "x4", prompt: "Regenerating ATP from ADP + Pi:", options: [{ id: "a", label: "Needs an energy input (ΔG > 0 on its own)" }, { id: "b", label: "Releases energy" }, { id: "c", label: "Happens spontaneously in water" }], correct: "a", why: "Synthesis is the reverse of hydrolysis, so it requires energy, for example from the proton gradient." },
  { id: "x5", prompt: "In energy coupling, what is the key requirement?", options: [{ id: "a", label: "The overall (combined) ΔG must be negative" }, { id: "b", label: "Both reactions must release heat" }, { id: "c", label: "The energy-requiring reaction must be fast" }], correct: "a", why: "The sum of the coupled reactions' free energy changes must be below zero." },
  { id: "x6", prompt: "An adult turns over roughly their own body mass of ATP each day yet holds only tens of grams at once. What does this show?", options: [{ id: "a", label: "ATP is used and regenerated very rapidly" }, { id: "b", label: "ATP is stored for months" }, { id: "c", label: "ATP is not made in the body" }], correct: "a", why: "Rapid recycling of ADP and Pi into ATP gives a very high turnover from a small pool." },
  { id: "x7", prompt: "Which statement about ATP hydrolysis is correct?", options: [{ id: "a", label: "ATP + H₂O → ADP + Pi, ΔG is negative in cells" }, { id: "b", label: "ATP → ADP + Pi + water, ΔG is positive" }, { id: "c", label: "ADP + Pi → ATP, ΔG is negative" }], correct: "a", why: "Hydrolysis uses a water molecule and releases free energy." },
  { id: "x8", prompt: "Which process most directly regenerates ATP in an aerobic cell's mitochondrion?", options: [{ id: "a", label: "ATP synthase driven by the proton gradient" }, { id: "b", label: "Osmosis" }, { id: "c", label: "Hydrolysis by myosin" }], correct: "a", why: "Oxidative phosphorylation couples proton flow through ATP synthase to ADP + Pi → ATP." },
  { id: "x9", prompt: "In the kinesin example, one ATP is used per:", options: [{ id: "a", label: "Step of about 8 nm" }, { id: "b", label: "Whole trip across the cell" }, { id: "c", label: "Vesicle made" }], correct: "a", why: "Each step along the microtubule is coupled to the hydrolysis of one ATP." },
  { id: "x10", prompt: "Which is an energy-requiring (endergonic) example that ATP can drive?", options: [{ id: "a", label: "Assembling a dipeptide from two amino acids" }, { id: "b", label: "Glucose rolling downhill in a gradient" }, { id: "c", label: "Water evaporating" }], correct: "a", why: "Biosynthesis builds larger molecules and requires energy input." },
];

export const CYCLE_ARRANGE_LABELS = CYCLE_STEPS.map((s) => ({ label: s.label }));
