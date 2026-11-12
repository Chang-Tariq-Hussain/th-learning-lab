import { chromatidKey, type MitosisPlan } from "../engine/plan";
import { shuffled, type ChallengeQuestion, type ChallengeRound, type IdentifyFeedback, type PredictEvent } from "../../meiosis/activities/model";
import type { StagePick } from "../types";

export { arrangeReducer, newArrange, arrangeCorrectCount, shuffled } from "../../meiosis/activities/model";
export type { IdentifyFeedback, PredictEvent, ChallengeRound, ChallengeQuestion } from "../../meiosis/activities/model";

/* ------------------------------------------------------------------ Predict */

export const PREDICT_EVENTS: PredictEvent[] = [
  {
    id: "replication",
    beat: 1,
    question: "The cell is getting ready to divide. What happens to its DNA during interphase?",
    options: [
      { id: "copied", label: "It is copied once, so every chromosome gets two sister chromatids" },
      { id: "half", label: "It is cut in half so each daughter cell can have half" },
      { id: "none", label: "Nothing. The DNA is copied during mitosis itself" },
      { id: "doubleN", label: "It is copied and the number of chromosomes doubles" },
    ],
    correct: "copied",
    explanation: "DNA replication happens in the S phase of interphase, before mitosis. Each chromosome gets a second copy of its DNA (a sister chromatid), but the chromosome number stays the same because the copies stay attached at one centromere.",
  },
  {
    id: "condense",
    beat: 2,
    question: "Prophase is starting. What will happen to the chromatin?",
    options: [
      { id: "condense", label: "It coils up (condenses) into compact, visible chromosomes" },
      { id: "spread", label: "It spreads out even more so the DNA can be read" },
      { id: "leave", label: "It leaves the cell" },
      { id: "split", label: "The two copies of each chromosome separate immediately" },
    ],
    correct: "condense",
    explanation: "Chromatin condenses into chromosomes so that they can be moved without tangling. The sister chromatids are still joined at the centromere.",
  },
  {
    id: "envelope",
    beat: 4,
    question: "The spindle fibers need to reach the chromosomes, but the chromosomes are inside the nucleus. What happens in prometaphase?",
    options: [
      { id: "break", label: "The nuclear envelope breaks into fragments" },
      { id: "stay", label: "The fibers pass through the intact nuclear envelope" },
      { id: "grow", label: "The nucleus grows bigger" },
      { id: "chromosomes-out", label: "The chromosomes leave through nuclear pores one at a time" },
    ],
    correct: "break",
    explanation: "The nuclear envelope breaks down in prometaphase. That gives the spindle microtubules access to the kinetochores.",
  },
  {
    id: "align",
    beat: 6,
    question: "How will the chromosomes line up along the middle of the cell in metaphase?",
    options: [
      { id: "single", label: "Individually, each chromosome on its own along the plate" },
      { id: "pairs", label: "As pairs of homologous chromosomes, side by side" },
      { id: "poles", label: "They stay near the poles" },
      { id: "clump", label: "In one clump in the center" },
    ],
    correct: "single",
    explanation: "In mitosis homologous chromosomes do not pair. Each chromosome (two sister chromatids) lines up on its own. Homologous pairs lining up together is metaphase I of meiosis.",
  },
  {
    id: "checkpoint",
    beat: 8,
    question: "Before the cell is allowed to start anaphase, the spindle checkpoint checks that...",
    options: [
      { id: "attached", label: "every chromosome is attached to spindle fibers from both poles" },
      { id: "size", label: "the cell has reached its full size" },
      { id: "membrane", label: "the nuclear envelope has re-formed" },
      { id: "furrow", label: "the cleavage furrow has started" },
    ],
    correct: "attached",
    explanation: "The cell waits until every kinetochore is attached and under tension. This helps make sure each daughter cell will get one copy of every chromosome.",
  },
  {
    id: "separate",
    beat: 9,
    question: "Anaphase is about to be revealed. What gets pulled apart?",
    options: [
      { id: "sisters", label: "Sister chromatids, as the centromeres split" },
      { id: "homologs", label: "Homologous chromosomes" },
      { id: "cell", label: "The whole cell splits first" },
      { id: "none", label: "Nothing moves until telophase" },
    ],
    correct: "sisters",
    explanation: "At anaphase the centromeres split and the sister chromatids separate. Each one is now a chromosome and moves to its own pole. Homologous chromosomes are not separated in mitosis (they were never paired).",
  },
  {
    id: "telophase",
    beat: 10,
    question: "The chromosomes have reached the poles. What happens around each set in telophase?",
    options: [
      { id: "envelope", label: "A nuclear envelope re-forms around it, forming a nucleus" },
      { id: "replicate", label: "The DNA is copied again" },
      { id: "pair", label: "The chromosomes pair up with their homologs" },
      { id: "spindle", label: "The spindle gets bigger" },
    ],
    correct: "envelope",
    explanation: "Telophase is roughly prophase in reverse: nuclear envelopes re-form, chromosomes decondense, and the spindle breaks down.",
  },
  {
    id: "cytokinesis",
    beat: 12,
    question: "The cell has two nuclei but is still one cell. In an animal cell, what divides the cytoplasm?",
    options: [
      { id: "ring", label: "A ring of actin and myosin pinches the membrane inward (cleavage furrow)" },
      { id: "wall", label: "A new cell wall grows across the middle" },
      { id: "spindle", label: "The spindle fibers cut through the cell" },
      { id: "nothing", label: "Nothing, the cell stays as one cell" },
    ],
    correct: "ring",
    explanation: "Animal cells divide by a cleavage furrow made by a contractile ring. Plant cells build a cell plate instead.",
  },
  {
    id: "result",
    beat: 14,
    question: "When cytokinesis finishes, how many cells are there, and how many chromosomes does each have compared with the parent cell?",
    options: [
      { id: "two-same", label: "Two cells, each with the same chromosome number as the parent" },
      { id: "two-half", label: "Two cells, each with half the chromosome number" },
      { id: "four-half", label: "Four cells, each with half the chromosome number" },
      { id: "two-double", label: "Two cells, each with twice the chromosome number" },
    ],
    correct: "two-same",
    explanation: "Mitosis makes two genetically identical daughter cells with the same chromosome number as the parent (2n). Halving the chromosome number is what meiosis does.",
  },
];

/** The unanswered event that blocks entering `beat`, if any. */
export function blockingEvent(beat: number, answered: ReadonlySet<string>): PredictEvent | null {
  return PREDICT_EVENTS.find((e) => e.beat === beat && !answered.has(e.id)) ?? null;
}

/* ------------------------------------------------------------------ Identify */

export type IdentifyTarget = "centromere" | "kinetochore" | "centrosome" | "plate" | "furrow" | "fiber";

export type IdentifyQuestion =
  | { id: string; kind: "sister"; beat: number; prompt: string; target: string; correct: string }
  | { id: string; kind: "chromosome"; beat: number; prompt: string; target: string[]; correctK: number }
  | { id: string; kind: "structure"; beat: number; prompt: string; target: IdentifyTarget }
  | { id: string; kind: "name"; beat: number; prompt: string; highlight: string[]; options: { id: string; label: string; why: string }[]; correct: string; explain: string };

export function buildIdentifyQuestions(plan: MitosisPlan): IdentifyQuestion[] {
  const key = (k: number, s: number) => chromatidKey({ k, s: s as 0 | 1 });
  const both = (k: number) => [key(k, 0), key(k, 1)];
  const kTarget = 0;
  const kOther = plan.n - 1;
  return [
    {
      id: "id-sister",
      kind: "sister",
      beat: 3,
      prompt: "One chromatid is glowing. Click its SISTER chromatid.",
      target: key(kTarget, 0),
      correct: key(kTarget, 1),
    },
    {
      id: "id-chromosome",
      kind: "name",
      beat: 3,
      prompt: "What is the glowing structure?",
      highlight: both(kTarget),
      options: [
        { id: "chromosome", label: "One chromosome made of two sister chromatids", why: "" },
        { id: "two", label: "Two separate chromosomes", why: "The two rods are joined at one centromere, so together they are ONE chromosome. After anaphase each chromatid is counted as its own chromosome." },
        { id: "homologs", label: "A pair of homologous chromosomes", why: "Homologous chromosomes are two different chromosomes (one maternal, one paternal). These two rods are identical copies of the same chromosome." },
        { id: "chromatid", label: "A single chromatid", why: "A single chromatid is just one of the two rods. The glowing structure includes both." },
      ],
      correct: "chromosome",
      explain: "A chromosome that has been replicated consists of two identical sister chromatids joined at the centromere. It is still counted as one chromosome.",
    },
    { id: "id-centromere", kind: "structure", beat: 6, prompt: "Click a centromere: the region where the two sister chromatids are joined.", target: "centromere" },
    { id: "id-kinetochore", kind: "structure", beat: 6, prompt: "Click a kinetochore: the small protein structure where a spindle fiber attaches.", target: "kinetochore" },
    { id: "id-fiber", kind: "structure", beat: 6, prompt: "Click a spindle fiber.", target: "fiber" },
    { id: "id-centrosome", kind: "structure", beat: 6, prompt: "Click a centrosome (a spindle pole).", target: "centrosome" },
    { id: "id-plate", kind: "structure", beat: 7, prompt: "Click the metaphase plate: the plane where the chromosomes line up.", target: "plate" },
    {
      id: "id-anaphase",
      kind: "name",
      beat: 9,
      prompt: "Two structures are glowing, one at each pole. What are they?",
      highlight: both(kOther),
      options: [
        { id: "copies", label: "The two former sister chromatids, now two separate chromosomes", why: "" },
        { id: "attached", label: "Sister chromatids still attached to each other", why: "They have separated: the centromeres split at the start of anaphase and the two are at opposite poles." },
        { id: "homologs", label: "A pair of homologous chromosomes being separated", why: "Homologous chromosomes do not separate in mitosis. These are identical copies, the two sister chromatids of one chromosome." },
        { id: "centrosomes", label: "The two centrosomes", why: "Centrosomes are the small star-like structures at the poles. These are chromosomes." },
      ],
      correct: "copies",
      explain: "Each chromatid is now an individual chromosome, and the two copies (identical to each other) go to opposite daughter cells.",
    },
    { id: "id-furrow", kind: "structure", beat: 13, prompt: "Click the cleavage furrow, where the membrane is pinching in.", target: "furrow" },
  ];
}

/** Whether a question can be answered for the current cell type (the furrow and centrosome are animal-cell structures). */
export function questionsFor(plan: MitosisPlan): IdentifyQuestion[] {
  const all = buildIdentifyQuestions(plan);
  if (!plan.plant) return all;
  return all
    .filter((q) => !(q.kind === "structure" && q.target === "centrosome"))
    .map((q) => (q.kind === "structure" && q.target === "furrow" ? { ...q, id: "id-plate-cell", prompt: "Click the cell plate, the new wall growing across the middle.", target: "furrow" as IdentifyTarget } : q));
}

const NAMES: Record<IdentifyTarget, string> = {
  centromere: "centromere",
  kinetochore: "kinetochore",
  centrosome: "centrosome",
  plate: "metaphase plate",
  furrow: "cleavage furrow",
  fiber: "spindle fiber",
};
const GOOD: Record<IdentifyTarget, string> = {
  centromere: "Yes. The centromere is where the sister chromatids are joined. Kinetochores assemble on it.",
  kinetochore: "Yes. A kinetochore is the attachment point for a spindle fiber. Each sister chromatid has one, facing opposite poles.",
  centrosome: "Yes. The centrosome sits at each pole and organizes the spindle fibers.",
  plate: "Yes. The metaphase plate is the plane halfway between the poles where the chromosomes line up.",
  furrow: "Yes. The contractile ring pulls the membrane inward here, dividing the cytoplasm.",
  fiber: "Yes. Spindle fibers (microtubules) run from the poles to the kinetochores.",
};

export function checkPick(q: IdentifyQuestion, p: StagePick, plant: boolean): IdentifyFeedback {
  if (q.kind === "sister") {
    if (p.kind !== "chromatid") return { ok: false, message: "Pick one of the chromatids." };
    const k = chromatidKey({ k: p.k, s: p.s });
    if (k === q.correct) return { ok: true, message: "Yes. Sister chromatids are identical copies joined at a centromere." };
    if (k === q.target) return { ok: false, message: "That is the glowing chromatid itself. Look for the one attached beside it." };
    return { ok: false, message: "That belongs to a different chromosome. A sister is the identical copy attached at the same centromere." };
  }
  if (q.kind === "structure") {
    const t = q.target;
    const ok = t === "fiber" ? p.kind === "fiber" : t === "furrow" ? p.kind === "structure" && (p.id === "furrow" || p.id === "cellplate") : p.kind === "structure" && p.id === t;
    if (ok) return { ok: true, message: t === "furrow" && plant ? "Yes. The cell plate grows outward from the middle and becomes the new wall between the daughter cells." : GOOD[t] };
    const what = p.kind === "chromatid" ? "That is a chromatid" : p.kind === "fiber" ? "That is a spindle fiber" : `That is the ${p.id === "centrosome" ? "centrosome" : p.id}`;
    return { ok: false, message: `${what}, not the ${t === "furrow" && plant ? "cell plate" : NAMES[t]}. Look again.` };
  }
  return { ok: false, message: "Pick the structure the question asks about." };
}

/* ------------------------------------------------------------------ Challenge */

export interface MitosisChallengeQuestion extends ChallengeQuestion {
  /** Index of the stage where the concept appears (STAGES). */
  stage: number;
  /** Animation beat to show it at. */
  beat: number;
}

const opt = (id: string, text: string, why = "") => ({ id, text, why });

export const CHALLENGE_BANK: MitosisChallengeQuestion[] = [
  {
    id: "c-rep", stage: 0, beat: 1,
    prompt: "When is the DNA copied before a cell divides by mitosis?",
    options: [
      opt("a", "In the S phase of interphase, before mitosis begins", ""),
      opt("b", "During prophase", "Prophase starts with chromosomes that are already two sister chromatids. The copying was finished earlier."),
      opt("c", "During anaphase, as the chromatids move apart", "Nothing is copied in anaphase. The two copies that already exist are separated."),
      opt("d", "During cytokinesis", "Cytokinesis divides the cytoplasm. DNA copying is long finished."),
    ],
    correct: "a",
    explanation: "DNA replication takes place in the S phase of interphase. Mitosis only shares out the copies.",
  },
  {
    id: "c-count-g2", stage: 0, beat: 1,
    prompt: "A cell with 2n = 8 has just finished copying its DNA. How many chromosomes and how many chromatids does it have?",
    options: [
      opt("a", "8 chromosomes, 16 chromatids", ""),
      opt("b", "16 chromosomes, 16 chromatids", "Copying does not create new chromosomes: each chromosome stays one chromosome (now with two sister chromatids)."),
      opt("c", "8 chromosomes, 8 chromatids", "That was the number before replication. After it, each chromosome has two chromatids."),
      opt("d", "16 chromosomes, 32 chromatids", "The chromosome number does not double when DNA is copied, and 32 chromatids is too many."),
    ],
    correct: "a",
    explanation: "Replication doubles the DNA (and the chromatids) but not the number of chromosomes. 8 chromosomes x 2 chromatids = 16.",
  },
  {
    id: "c-nucleus", stage: 2, beat: 4,
    prompt: "What happens to the nuclear envelope in prometaphase?",
    options: [
      opt("a", "It breaks into fragments", ""),
      opt("b", "It becomes thicker", "It does the opposite: it breaks down so that the spindle can reach the chromosomes."),
      opt("c", "It splits into two complete nuclei", "Two nuclei form later, in telophase."),
      opt("d", "Nothing happens to it until telophase", "It disappears in prometaphase and re-forms in telophase."),
    ],
    correct: "a",
    explanation: "Breaking down the envelope lets spindle microtubules attach to the kinetochores.",
  },
  {
    id: "c-kin", stage: 2, beat: 5,
    prompt: "What is a kinetochore?",
    options: [
      opt("a", "A protein structure at the centromere where a spindle fiber attaches", ""),
      opt("b", "The point where two chromosomes cross over", "Crossing over happens in meiosis, and a kinetochore is not an exchange point."),
      opt("c", "The part of the spindle at the pole", "The spindle pole is the centrosome. The kinetochore is on the chromosome."),
      opt("d", "Another name for a sister chromatid", "A chromatid is half of a duplicated chromosome. The kinetochore is a structure on it."),
    ],
    correct: "a",
    explanation: "Each sister chromatid has its own kinetochore, and the two face opposite poles.",
  },
  {
    id: "c-align", stage: 3, beat: 6,
    prompt: "How do the chromosomes line up at metaphase of mitosis?",
    options: [
      opt("a", "Individually along the metaphase plate", ""),
      opt("b", "In homologous pairs", "Homologous pairs line up together in metaphase I of meiosis. They do not pair in mitosis."),
      opt("c", "In two groups, one near each pole", "That is where they end up in telophase. At metaphase they are on the plate."),
      opt("d", "As single chromatids, already separated", "The chromatids are still joined at the centromere. They separate in anaphase."),
    ],
    correct: "a",
    explanation: "In mitosis each chromosome lines up on its own, with one sister chromatid facing each pole.",
  },
  {
    id: "c-count-meta", stage: 3, beat: 6,
    prompt: "At metaphase, a cell with 2n = 6 has how many chromosomes and chromatids?",
    options: [
      opt("a", "6 chromosomes, 12 chromatids", ""),
      opt("b", "6 chromosomes, 6 chromatids", "Each chromosome has two sister chromatids after replication, so there are 12."),
      opt("c", "3 chromosomes, 6 chromatids", "Mitosis does not halve the chromosome number: the cell is still 2n = 6."),
      opt("d", "12 chromosomes, 12 chromatids", "That count only happens after the sister chromatids separate, in anaphase."),
    ],
    correct: "a",
    explanation: "Chromosome number is counted by centromeres (6). Each one has two chromatids, so 12.",
  },
  {
    id: "c-checkpoint", stage: 3, beat: 7,
    prompt: "What does the spindle checkpoint do?",
    options: [
      opt("a", "It delays anaphase until every chromosome is properly attached to the spindle", ""),
      opt("b", "It checks that the DNA has been copied", "That is a different checkpoint, earlier in the cell cycle."),
      opt("c", "It makes the cell wall", "Cell walls are not made by checkpoints."),
      opt("d", "It splits the cell into two", "Cytokinesis does that, after the chromosomes are separated."),
    ],
    correct: "a",
    explanation: "Waiting for every chromosome to attach helps make sure each daughter gets one copy of every chromosome.",
  },
  {
    id: "c-sep", stage: 4, beat: 8,
    prompt: "What is separated in anaphase of mitosis?",
    options: [
      opt("a", "Sister chromatids", ""),
      opt("b", "Homologous chromosomes", "Homologs are not paired in mitosis. (They are separated in anaphase I of meiosis.)"),
      opt("c", "The two nuclei", "The nuclei do not exist yet: they form in telophase."),
      opt("d", "The centrosomes from the spindle", "The centrosomes stay at the poles. The chromosomes are what move."),
    ],
    correct: "a",
    explanation: "The centromeres split and each sister chromatid becomes a chromosome moving to a pole.",
  },
  {
    id: "c-count-ana", stage: 4, beat: 9,
    prompt: "A cell with 2n = 4 is in anaphase, just after the sister chromatids have separated. How many chromosomes are in the cell, counting each separated chromatid as a chromosome?",
    options: [
      opt("a", "8 (4 moving to each pole)", ""),
      opt("b", "4", "Before the centromeres split the cell had 4. After the split each chromatid counts as a chromosome, so there are 8."),
      opt("c", "2 (one at each pole)", "Each pole receives 4 chromosomes, one copy of each."),
      opt("d", "16", "There were 8 chromatids before separation and 8 chromosomes after: the count does not double again."),
    ],
    correct: "a",
    explanation: "4 chromosomes x 2 chromatids = 8 chromatids, and each separated chromatid is now a chromosome. The cell briefly has 8, with 4 at each pole.",
  },
  {
    id: "c-homologs", stage: 3, beat: 6,
    prompt: "Do homologous chromosomes pair up in mitosis?",
    options: [
      opt("a", "No. Each chromosome behaves independently", ""),
      opt("b", "Yes, in prophase, like in meiosis", "Pairing (synapsis) happens in prophase I of meiosis, not in mitosis."),
      opt("c", "Yes, but only at the metaphase plate", "They do not pair at the plate either: each chromosome lines up on its own."),
      opt("d", "Yes, in telophase", "Nothing pairs in telophase. The chromosomes uncoil."),
    ],
    correct: "a",
    explanation: "The maternal and paternal chromosomes of each kind are both present in the cell, but they act independently.",
  },
  {
    id: "c-telo", stage: 5, beat: 10,
    prompt: "What happens in telophase?",
    options: [
      opt("a", "Nuclear envelopes re-form around the two sets of chromosomes", ""),
      opt("b", "Sister chromatids separate", "That happened in anaphase."),
      opt("c", "The chromosomes attach to the spindle", "That happens in prometaphase."),
      opt("d", "DNA is copied a second time", "DNA is copied only in the S phase of interphase."),
    ],
    correct: "a",
    explanation: "Telophase is roughly the reverse of prophase: nuclei re-form, chromosomes decondense, and the spindle disappears.",
  },
  {
    id: "c-cyto", stage: 6, beat: 12,
    prompt: "Which statement about cytokinesis is correct?",
    options: [
      opt("a", "It divides the cytoplasm and is a different process from mitosis", ""),
      opt("b", "It is the first stage of mitosis", "The first stage of mitosis is prophase. Cytokinesis is the division of the cytoplasm, usually after anaphase."),
      opt("c", "It separates the sister chromatids", "That is anaphase."),
      opt("d", "It copies the DNA", "That is the S phase of interphase."),
    ],
    correct: "a",
    explanation: "Mitosis divides the nucleus. Cytokinesis divides the cell. They usually happen together but they are different events.",
  },
  {
    id: "c-furrow", stage: 6, beat: 13,
    prompt: "What forms the cleavage furrow of a dividing animal cell?",
    options: [
      opt("a", "A contractile ring of actin and myosin that tightens around the middle", ""),
      opt("b", "The spindle fibers", "Spindle fibers move chromosomes. They do not cut the cell."),
      opt("c", "A new cell wall", "That is how plant cells divide (by a cell plate)."),
      opt("d", "The nuclear envelope", "The nuclear envelope surrounds the chromosomes and plays no part in pinching the cell."),
    ],
    correct: "a",
    explanation: "The ring contracts like a drawstring and pinches the membrane inward.",
  },
  {
    id: "c-plant", stage: 6, beat: 13,
    prompt: "How does a plant cell divide its cytoplasm?",
    options: [
      opt("a", "A cell plate forms across the middle and becomes a new wall", ""),
      opt("b", "A cleavage furrow pinches it in two", "Plant cells have a rigid wall, so a furrow cannot pinch them."),
      opt("c", "The spindle cuts it", "The spindle does not divide the cytoplasm."),
      opt("d", "It does not divide: plant cells stay as one", "Plant cells do divide by mitosis and cytokinesis."),
    ],
    correct: "a",
    explanation: "Vesicles bring wall material to the middle, fuse into a cell plate, and the plate grows outward to the sides.",
  },
  {
    id: "c-notmitosis", stage: 0, beat: 0,
    prompt: "Which of these is NOT one of the phases of mitosis?",
    options: [
      opt("a", "Interphase", ""),
      opt("b", "Prometaphase", "Prometaphase is a phase of mitosis."),
      opt("c", "Anaphase", "Anaphase is a phase of mitosis."),
      opt("d", "Telophase", "Telophase is a phase of mitosis."),
    ],
    correct: "a",
    explanation: "Interphase is the preparation: growth and DNA copying. Mitosis is prophase, prometaphase, metaphase, anaphase and telophase (with cytokinesis following).",
  },
  {
    id: "c-daughter", stage: 6, beat: 14,
    prompt: "A parent cell has 2n = 10. After mitosis and cytokinesis, how many chromosomes does each daughter cell have?",
    options: [
      opt("a", "10", ""),
      opt("b", "5", "Mitosis does not halve the chromosome number. That is meiosis."),
      opt("c", "20", "The chromosome number is not doubled: the daughters are 2n, like the parent."),
      opt("d", "It depends on the cell", "Normally every daughter cell gets one copy of each of the 10 chromosomes."),
    ],
    correct: "a",
    explanation: "Each daughter gets one copy of every chromosome: 2n = 10, the same as the parent.",
  },
  {
    id: "c-dna", stage: 6, beat: 14,
    prompt: "A cell has 4C of DNA at metaphase. How much DNA does each daughter cell have right after cytokinesis?",
    options: [
      opt("a", "2C", ""),
      opt("b", "4C", "The 4C was shared between two cells. Each gets half."),
      opt("c", "1C", "That would be a haploid amount. The daughters are diploid."),
      opt("d", "8C", "Nothing is copied during cytokinesis."),
    ],
    correct: "a",
    explanation: "4C is shared equally between two cells: 2C each, the same as the parent had in G1.",
  },
  {
    id: "c-identical", stage: 6, beat: 14,
    prompt: "Compared with the parent cell, the two daughter cells made by mitosis are normally...",
    options: [
      opt("a", "genetically identical, with the same number of chromosomes", ""),
      opt("b", "genetically different, with half the chromosomes", "That describes the products of meiosis."),
      opt("c", "genetically different, with the same number of chromosomes", "Mitosis copies the DNA and shares the copies equally, so the daughters are identical (apart from rare mutations)."),
      opt("d", "identical, with twice the chromosomes", "The chromosome number stays the same."),
    ],
    correct: "a",
    explanation: "Replication followed by equal separation of sister chromatids gives two identical daughter cells.",
  },
  {
    id: "c-compare", stage: 4, beat: 8,
    prompt: "Which separation happens in anaphase of mitosis AND in anaphase II of meiosis?",
    options: [
      opt("a", "Sister chromatids", ""),
      opt("b", "Homologous chromosomes", "Homologs separate in anaphase I of meiosis only."),
      opt("c", "Tetrads", "Tetrads exist only in meiosis I."),
      opt("d", "Daughter nuclei", "Nuclei do not separate in anaphase."),
    ],
    correct: "a",
    explanation: "Meiosis II separates sister chromatids in the same way as mitosis does.",
  },
];

export const ROUND_SIZE = 8;

export function newChallengeRound(seed: number): ChallengeRound & { questions: MitosisChallengeQuestion[] } {
  const qs = shuffled(CHALLENGE_BANK, seed)
    .slice(0, ROUND_SIZE)
    .map((q, i) => ({ ...q, options: shuffled(q.options, seed + i * 31 + 5) }));
  return { seed, questions: qs, index: 0, picked: null, results: [], finished: false };
}

export type ChallengeAction = { type: "pick"; option: string } | { type: "next" } | { type: "restart" };

export function challengeReducer(s: ChallengeRound, a: ChallengeAction): ChallengeRound {
  switch (a.type) {
    case "pick": {
      if (s.finished || s.picked) return s;
      const q = s.questions[s.index]!;
      return { ...s, picked: a.option, results: [...s.results, a.option === q.correct] };
    }
    case "next": {
      if (!s.picked) return s;
      return s.index >= s.questions.length - 1 ? { ...s, finished: true } : { ...s, index: s.index + 1, picked: null };
    }
    case "restart":
      return newChallengeRound(s.seed + 101);
  }
}
