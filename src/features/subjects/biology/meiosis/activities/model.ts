import { STAGES } from "../data/stages";
import { chromatidKey, mulberry32, type MeiosisPlan } from "../engine/plan";

/* ------------------------------------------------------------------ Predict */

export interface PredictOption {
  id: string;
  label: string;
}
export interface PredictEvent {
  id: string;
  /** The beat the learner is about to reveal; the clock pauses on the beat before it. */
  beat: number;
  question: string;
  options: PredictOption[];
  correct: string;
  explanation: string;
}

export const PREDICT_EVENTS: PredictEvent[] = [
  {
    id: "replication",
    beat: 1,
    question: "The cell is about to prepare for meiosis. What happens to its DNA?",
    options: [
      { id: "once", label: "It is copied once, so each chromosome gets two sister chromatids" },
      { id: "half", label: "It is cut in half so the cell becomes haploid" },
      { id: "twice", label: "It is copied twice, once for each division" },
      { id: "none", label: "Nothing, the DNA is only copied later" },
    ],
    correct: "once",
    explanation: "DNA is replicated once, before meiosis I. The two copies stay joined as sister chromatids. There is no second replication between the divisions.",
  },
  {
    id: "synapsis",
    beat: 3,
    question: "What will the homologous chromosomes do in prophase I?",
    options: [
      { id: "pair", label: "Pair up side by side (synapsis) to form tetrads" },
      { id: "stay", label: "Stay apart, each acting alone" },
      { id: "split", label: "Split into single chromatids" },
      { id: "fuse", label: "Fuse into one long chromosome" },
    ],
    correct: "pair",
    explanation: "Homologous chromosomes pair along their length. Each pair of two chromosomes (four chromatids) is a tetrad. This pairing does not happen in mitosis.",
  },
  {
    id: "crossing",
    beat: 5,
    question: "Two non-sister chromatids are lying across each other. What happens next?",
    options: [
      { id: "swap", label: "They exchange matching segments of DNA" },
      { id: "nothing", label: "Nothing, they just touch" },
      { id: "sisters", label: "A chromatid swaps DNA with its own sister" },
      { id: "all", label: "Every chromatid swaps DNA at every position" },
    ],
    correct: "swap",
    explanation: "Crossing over swaps corresponding segments between non-sister chromatids. It happens at only a few places per pair, not everywhere, and it can differ from one meiosis to the next.",
  },
  {
    id: "metaphase-1",
    beat: 7,
    question: "How will the chromosomes line up at the middle of the cell in metaphase I?",
    options: [
      { id: "pairs", label: "As homologous pairs (tetrads), the two homologs facing opposite poles" },
      { id: "single", label: "In single file, one chromosome at a time" },
      { id: "poles", label: "They stay near the poles" },
      { id: "unpaired", label: "Each chromatid lines up separately" },
    ],
    correct: "pairs",
    explanation: "In metaphase I the tetrads line up as pairs. Which homolog faces which pole is random for each pair (independent assortment). Single-file alignment is metaphase II.",
  },
  {
    id: "anaphase-1",
    beat: 8,
    question: "What will be pulled apart in anaphase I?",
    options: [
      { id: "homologs", label: "Homologous chromosomes. Sister chromatids stay together" },
      { id: "sisters", label: "Sister chromatids. Homologs stay together" },
      { id: "both", label: "Both, all at the same time" },
      { id: "none", label: "Nothing separates yet" },
    ],
    correct: "homologs",
    explanation: "Anaphase I separates the homologous chromosomes. Each one is still made of two sister chromatids. That is why meiosis I halves the chromosome number.",
  },
  {
    id: "telophase-1",
    beat: 10,
    question: "After the cell divides, each new cell compared with the starting cell has...",
    options: [
      { id: "half-dup", label: "Half the chromosomes, each still with two sister chromatids" },
      { id: "same", label: "The same number of chromosomes" },
      { id: "half-single", label: "Half the chromosomes, each with a single chromatid" },
      { id: "double", label: "Twice as many chromosomes" },
    ],
    correct: "half-dup",
    explanation: "The cells are haploid (n), but the chromosomes are still duplicated. Sister chromatids are only separated in meiosis II.",
  },
  {
    id: "no-replication",
    beat: 11,
    question: "Meiosis II is about to begin. Will the DNA be replicated again first?",
    options: [
      { id: "no", label: "No. The chromosomes already have two chromatids" },
      { id: "yes", label: "Yes, each cell copies its DNA again" },
      { id: "half", label: "Only half of the chromosomes are copied" },
      { id: "depends", label: "Yes, but only the crossed-over chromosomes" },
    ],
    correct: "no",
    explanation: "There is no DNA replication between meiosis I and II. Meiosis II separates the sister chromatids that are already there.",
  },
  {
    id: "anaphase-2",
    beat: 13,
    question: "The chromosomes are lined up in single file in each cell. What separates in anaphase II?",
    options: [
      { id: "sisters", label: "Sister chromatids, as the centromeres split" },
      { id: "homologs", label: "Homologous chromosomes" },
      { id: "tetrads", label: "Whole tetrads" },
      { id: "none", label: "Nothing, they separate in telophase II" },
    ],
    correct: "sisters",
    explanation: "The centromeres split and each sister chromatid, now counted as a chromosome, moves to an opposite pole. The homologs were already separated in anaphase I.",
  },
  {
    id: "telophase-2",
    beat: 15,
    question: "When both cells divide, how many cells result and what are they?",
    options: [
      { id: "four", label: "Four haploid cells with unduplicated chromosomes" },
      { id: "two", label: "Two diploid cells" },
      { id: "four-dip", label: "Four diploid cells" },
      { id: "two-hap", label: "Two haploid cells with duplicated chromosomes" },
    ],
    correct: "four",
    explanation: "One diploid cell makes four haploid cells in the standard model. Each has one chromatid per chromosome, and they carry different allele combinations.",
  },
];

/** The unanswered event that blocks entering `beat`, if any. */
export function blockingEvent(beat: number, answered: ReadonlySet<string>): PredictEvent | null {
  return PREDICT_EVENTS.find((e) => e.beat === beat && !answered.has(e.id)) ?? null;
}

/* ------------------------------------------------------------------ Identify */

export type IdentifyQuestion =
  | { id: string; kind: "sister"; beat: number; prompt: string; target: string; correct: string }
  | { id: string; kind: "homolog"; beat: number; prompt: string; target: string[]; pair: number; homolog: 0 | 1 }
  | { id: string; kind: "fiber" | "centrosome"; beat: number; prompt: string }
  | { id: string; kind: "name"; beat: number; prompt: string; highlight: string[]; options: { id: string; label: string; why: string }[]; correct: string };

export function buildIdentifyQuestions(plan: MeiosisPlan): IdentifyQuestion[] {
  const hl = plan.leftHomolog[0]!;
  const key = (pair: number, homolog: number, sister: number) => chromatidKey({ pair, homolog: homolog as 0 | 1, sister: sister as 0 | 1 });
  const both = (pair: number, homolog: number) => [key(pair, homolog, 0), key(pair, homolog, 1)];
  const pairKeys = (pair: number) => [0, 1].flatMap((h) => both(pair, h));
  return [
    {
      id: "id-sister",
      kind: "sister",
      beat: 1,
      prompt: "One chromatid is glowing. Click its SISTER chromatid.",
      target: key(0, 0, 0),
      correct: key(0, 0, 1),
    },
    {
      id: "id-homolog",
      kind: "homolog",
      beat: 3,
      prompt: "The glowing chromosome is the maternal copy of pair 1. Click a chromatid of its HOMOLOGOUS partner.",
      target: both(0, 0),
      pair: 0,
      homolog: 1,
    },
    {
      id: "id-tetrad",
      kind: "name",
      beat: 4,
      prompt: "What is the glowing structure?",
      highlight: pairKeys(0),
      options: [
        { id: "tetrad", label: "A tetrad (a pair of homologous chromosomes, four chromatids)", why: "" },
        { id: "sisters", label: "One pair of sister chromatids", why: "Sister chromatids are only two. This glowing structure has four chromatids from two different chromosomes." },
        { id: "one", label: "A single unduplicated chromosome", why: "An unduplicated chromosome would be one chromatid. This one has four." },
        { id: "set", label: "A complete haploid set", why: "A haploid set has one chromosome of each pair. This is both chromosomes of a single pair." },
      ],
      correct: "tetrad",
    },
    { id: "id-fiber", kind: "fiber", beat: 7, prompt: "Click a spindle fiber." },
    { id: "id-centrosome", kind: "centrosome", beat: 7, prompt: "Click a centrosome (a spindle pole)." },
    {
      id: "id-anaphase1",
      kind: "name",
      beat: 8,
      prompt: "What is glowing here, moving to the left pole?",
      highlight: both(0, hl),
      options: [
        { id: "chromosome", label: "A whole chromosome made of two sister chromatids", why: "" },
        { id: "chromatid", label: "A single chromatid separated from its sister", why: "The two chromatids are still joined at their centromere. Sister chromatids do not separate until anaphase II." },
        { id: "tetrad", label: "A tetrad", why: "The tetrad has already come apart. The glowing structure is only one homolog." },
        { id: "set", label: "A complete diploid set", why: "It is a single chromosome. The whole diploid set is still in the one cell." },
      ],
      correct: "chromosome",
    },
    {
      id: "id-anaphase2",
      kind: "name",
      beat: 13,
      prompt: "The glowing pair is moving apart toward opposite poles. What is separating?",
      highlight: both(0, plan.leftHomolog[0]!),
      options: [
        { id: "sisters", label: "Sister chromatids", why: "" },
        { id: "homologs", label: "Homologous chromosomes", why: "These are two chromatids of the same chromosome. Homologous chromosomes were separated in anaphase I." },
        { id: "tetrads", label: "Tetrads", why: "Tetrads exist only in meiosis I, before anaphase I." },
        { id: "poles", label: "Spindle poles", why: "Spindle poles are the centrosomes at the ends of the spindle. They are not what is being pulled apart." },
      ],
      correct: "sisters",
    },
  ];
}

export interface IdentifyFeedback {
  ok: boolean;
  message: string;
}

export function checkChromatidPick(q: IdentifyQuestion, pick: { pair: number; homolog: number; sister: number }): IdentifyFeedback {
  const k = chromatidKey({ pair: pick.pair, homolog: pick.homolog as 0 | 1, sister: pick.sister as 0 | 1 });
  if (q.kind === "sister") {
    if (k === q.correct) return { ok: true, message: "Yes. Sister chromatids are identical copies joined at a centromere." };
    if (k === q.target) return { ok: false, message: "That is the glowing chromatid itself. Look for the one attached beside it." };
    const t = q.target.split("-").map(Number);
    if (pick.pair === t[0] && pick.homolog !== t[1]) return { ok: false, message: "That chromatid belongs to the homologous partner. It is a non-sister, not an identical copy." };
    return { ok: false, message: "That belongs to a different chromosome pair. A sister is the copy attached to the same centromere." };
  }
  if (q.kind === "homolog") {
    if (pick.pair === q.pair && pick.homolog === q.homolog) return { ok: true, message: "Yes. The paternal chromosome of the same pair is the homologous partner. It carries the same genes, possibly with different alleles." };
    if (pick.pair === q.pair) return { ok: false, message: "That is part of the glowing chromosome itself (one of its sister chromatids). The homolog is the other member of the pair." };
    return { ok: false, message: "That belongs to a different pair. Homologous partners have the same length and gene letters." };
  }
  return { ok: false, message: "Pick the structure the question asks about." };
}

/* ------------------------------------------------------------------ Arrange */

export function shuffled<T>(items: readonly T[], seed: number): T[] {
  const rnd = mulberry32(seed);
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export interface ArrangeState {
  seed: number;
  pool: number[];
  placed: number[];
  checked: boolean;
  attempts: number;
  solved: boolean;
}

export function newArrange(seed: number): ArrangeState {
  let pool = shuffled(STAGES.map((_, i) => i), seed);
  // never start already solved
  if (pool.every((v, i) => v === i)) pool = shuffled(pool, seed + 1);
  return { seed, pool, placed: [], checked: false, attempts: 0, solved: false };
}

export type ArrangeAction =
  | { type: "place"; stage: number }
  | { type: "remove"; stage: number }
  | { type: "check" }
  | { type: "retry" }
  | { type: "reshuffle" }
  | { type: "move"; stage: number; dir: -1 | 1 };

export function arrangeReducer(s: ArrangeState, a: ArrangeAction): ArrangeState {
  switch (a.type) {
    case "place":
      if (s.solved || !s.pool.includes(a.stage)) return s;
      return { ...s, pool: s.pool.filter((x) => x !== a.stage), placed: [...s.placed, a.stage], checked: false };
    case "remove":
      if (s.solved || !s.placed.includes(a.stage)) return s;
      return { ...s, placed: s.placed.filter((x) => x !== a.stage), pool: [...s.pool, a.stage], checked: false };
    case "move": {
      const i = s.placed.indexOf(a.stage);
      const j = i + a.dir;
      if (s.solved || i < 0 || j < 0 || j >= s.placed.length) return s;
      const placed = [...s.placed];
      [placed[i], placed[j]] = [placed[j]!, placed[i]!];
      return { ...s, placed, checked: false };
    }
    case "check": {
      if (s.placed.length !== STAGES.length) return s;
      const solved = s.placed.every((v, i) => v === i);
      return { ...s, checked: true, attempts: s.attempts + 1, solved };
    }
    case "retry":
      // keep nothing: return every card to the pool so the learner can try again
      return { ...s, pool: shuffled(STAGES.map((_, i) => i), s.seed + s.attempts + 1), placed: [], checked: false, solved: false };
    case "reshuffle":
      return { ...newArrange(s.seed + 17), attempts: 0 };
  }
}

export const arrangeCorrectCount = (placed: number[]): number => placed.filter((v, i) => v === i).length;

/* ------------------------------------------------------------------ Challenge */

export interface ChallengeOption {
  id: string;
  text: string;
  /** Why this option is wrong (empty for the correct one). */
  why: string;
}
export interface ChallengeQuestion {
  id: string;
  prompt: string;
  options: ChallengeOption[];
  correct: string;
  explanation: string;
}

const opt = (id: string, text: string, why = ""): ChallengeOption => ({ id, text, why });

export const CHALLENGE_BANK: ChallengeQuestion[] = [
  {
    id: "c-sep-1",
    prompt: "Which event happens in meiosis I but NOT in meiosis II?",
    options: [
      opt("a", "Homologous chromosomes separate", ""),
      opt("b", "Sister chromatids separate", "Sister chromatids separate in meiosis II (anaphase II), not in meiosis I."),
      opt("c", "The cell divides by cytokinesis", "Both meiosis I and meiosis II end with cytokinesis."),
      opt("d", "Spindle fibers attach to chromosomes", "Spindle fibers are used in both divisions."),
    ],
    correct: "a",
    explanation: "Homologous chromosomes are separated in anaphase I. Meiosis II separates sister chromatids, like mitosis does.",
  },
  {
    id: "c-rep",
    prompt: "How many times is DNA replicated during a complete meiosis?",
    options: [
      opt("a", "Once, before meiosis I", ""),
      opt("b", "Twice, once before each division", "There is only one replication. Meiosis II follows meiosis I without a new S phase."),
      opt("c", "Once, between meiosis I and meiosis II", "The DNA was already copied before meiosis I. Nothing is copied between the divisions."),
      opt("d", "Never, because chromosomes are already doubled", "Chromosomes are not duplicated until the S phase of interphase copies them."),
    ],
    correct: "a",
    explanation: "One replication, two divisions. That is why the final cells have half as much DNA as the starting cell after replication, and a quarter of it.",
  },
  {
    id: "c-count-1",
    prompt: "A cell has 2n = 6 chromosomes before replication. How many chromosomes does each cell have after telophase I?",
    options: [
      opt("a", "3, each made of two sister chromatids", ""),
      opt("b", "6, each made of one chromatid", "Meiosis I halves the chromosome number to 3. And the chromatids are still joined."),
      opt("c", "3, each made of one chromatid", "The sister chromatids are not separated until meiosis II, so each chromosome still has two."),
      opt("d", "12, each made of one chromatid", "Replication doubles chromatids, not the chromosome count. And no cell has more than 6 chromosomes."),
    ],
    correct: "a",
    explanation: "Meiosis I reduces 2n = 6 to n = 3. Each of those 3 chromosomes still has two sister chromatids.",
  },
  {
    id: "c-count-2",
    prompt: "A cell with 2n = 8 completes meiosis. How many cells are made, and how many chromosomes does each have?",
    options: [
      opt("a", "4 cells, 4 chromosomes each", ""),
      opt("b", "2 cells, 4 chromosomes each", "Two cells is the result after meiosis I only. Meiosis II divides each of them again."),
      opt("c", "4 cells, 8 chromosomes each", "That would not reduce the chromosome number. The cells are haploid."),
      opt("d", "4 cells, 2 chromosomes each", "Each cell is n = 4, half of 8, not a quarter."),
    ],
    correct: "a",
    explanation: "4 haploid cells with n = 4 unduplicated chromosomes each.",
  },
  {
    id: "c-cross",
    prompt: "Crossing over occurs between...",
    options: [
      opt("a", "non-sister chromatids of homologous chromosomes", ""),
      opt("b", "sister chromatids of the same chromosome", "Exchanging DNA between identical copies would not create new combinations."),
      opt("c", "chromosomes of different pairs", "Only homologous chromosomes pair and exchange segments."),
      opt("d", "two cells after cytokinesis", "Crossing over happens inside one cell, in prophase I."),
    ],
    correct: "a",
    explanation: "A crossover swaps corresponding segments between one maternal and one paternal chromatid in prophase I.",
  },
  {
    id: "c-ia",
    prompt: "Independent assortment is the result of...",
    options: [
      opt("a", "the random orientation of homologous pairs at metaphase I", ""),
      opt("b", "chromatids exchanging segments in prophase I", "That describes crossing over, a different source of variation."),
      opt("c", "DNA replication", "Replication makes identical copies. It does not shuffle anything."),
      opt("d", "sister chromatids separating at anaphase II", "That separates identical copies, so it does not by itself create new combinations."),
    ],
    correct: "a",
    explanation: "Each pair lines up with the maternal homolog facing either pole, independently of the other pairs.",
  },
  {
    id: "c-ana2",
    prompt: "What moves apart in anaphase II?",
    options: [
      opt("a", "Sister chromatids", ""),
      opt("b", "Homologous chromosomes", "These separated in anaphase I."),
      opt("c", "Tetrads", "Tetrads disappear at the end of metaphase I."),
      opt("d", "Centrosomes only", "Centrosomes are already at the poles. The chromosomes are what move."),
    ],
    correct: "a",
    explanation: "The centromeres split, and each chromatid becomes a chromosome moving to a pole.",
  },
  {
    id: "c-tetrad",
    prompt: "A tetrad contains...",
    options: [
      opt("a", "two homologous chromosomes, four chromatids", ""),
      opt("b", "four homologous chromosomes", "A tetrad has two chromosomes, not four."),
      opt("c", "two sister chromatids", "That would be a single duplicated chromosome."),
      opt("d", "four cells", "A tetrad is a group of chromatids, not cells."),
    ],
    correct: "a",
    explanation: "'Tetrad' means four: the four chromatids of a pair of homologs.",
  },
  {
    id: "c-reduction",
    prompt: "Why is meiosis I called the reduction division?",
    options: [
      opt("a", "It halves the chromosome number (2n to n)", ""),
      opt("b", "It halves the amount of DNA per chromatid", "Chromatids do not change size. The number of chromosomes per cell halves."),
      opt("c", "It makes the cell smaller than the original", "Cell size is not the point. The chromosome number is."),
      opt("d", "It removes the sister chromatids", "Sister chromatids separate in meiosis II."),
    ],
    correct: "a",
    explanation: "Homologs go to different cells, so each cell receives one chromosome from every pair.",
  },
  {
    id: "c-orient",
    prompt: "Ignoring crossing over, how many different ways can 3 pairs of homologous chromosomes orient at metaphase I?",
    options: [
      opt("a", "8 (2 × 2 × 2)", ""),
      opt("b", "6 (3 × 2)", "Each pair has 2 possible orientations, and they multiply: 2 × 2 × 2."),
      opt("c", "3", "Each pair has two possible orientations, so the answer is bigger than the number of pairs."),
      opt("d", "9 (3 × 3)", "Each pair has only two ways to face the poles."),
    ],
    correct: "a",
    explanation: "The number of combinations is 2 to the power of the number of pairs: 2³ = 8. In humans, 2²³ is about 8.4 million.",
  },
  {
    id: "c-haploid-dup",
    prompt: "Which cell is haploid but still has duplicated chromosomes?",
    options: [
      opt("a", "A cell just after telophase I", ""),
      opt("b", "A cell in G1 before meiosis", "That cell is diploid and its chromosomes are not duplicated yet."),
      opt("c", "A final cell after telophase II", "Its chromosomes are unduplicated (one chromatid each)."),
      opt("d", "A cell in metaphase I", "It is still one diploid cell, with both homologs of every pair."),
    ],
    correct: "a",
    explanation: "After meiosis I each cell has n chromosomes, each with two chromatids (2C DNA).",
  },
  {
    id: "c-meta2",
    prompt: "At metaphase II, each chromosome in a cell consists of...",
    options: [
      opt("a", "two sister chromatids, lined up individually", ""),
      opt("b", "one chromatid, lined up in pairs", "Chromatids are not separated yet, and homologs are not paired in meiosis II."),
      opt("c", "two chromatids paired with a homolog", "The homologs were separated in anaphase I. There are no tetrads in meiosis II."),
      opt("d", "four chromatids", "Four chromatids is a tetrad, which exists only in meiosis I."),
    ],
    correct: "a",
    explanation: "Because of crossing over, the two sister chromatids may no longer be identical in their alleles.",
  },
  {
    id: "c-outside",
    prompt: "A crossover happens in a region that does NOT lie between two genes. What is the effect on the combination of those two genes?",
    options: [
      opt("a", "The gene combination on each chromatid is unchanged", ""),
      opt("b", "The two genes always become linked", "Where the crossover lands decides whether the genes are shuffled."),
      opt("c", "The alleles mutate", "Crossing over swaps existing segments. It does not change the alleles."),
      opt("d", "The chromatid is lost", "Crossing over exchanges equal segments, so nothing is lost."),
    ],
    correct: "a",
    explanation: "DNA was exchanged, but both genes were on the same side of the crossover, so they stay together. Only a crossover between the genes makes a new combination.",
  },
  {
    id: "c-compare",
    prompt: "Compared with mitosis, meiosis produces...",
    options: [
      opt("a", "four genetically different haploid cells", ""),
      opt("b", "two identical diploid cells", "That describes mitosis."),
      opt("c", "four identical haploid cells", "Crossing over and independent assortment make them different."),
      opt("d", "two haploid cells", "Two cells is the stage after meiosis I only."),
    ],
    correct: "a",
    explanation: "Two divisions, one replication, four haploid cells that differ from each other and from the parent cell.",
  },
  {
    id: "c-notsource",
    prompt: "Which of these does NOT create genetic variation during meiosis?",
    options: [
      opt("a", "DNA replication in interphase", ""),
      opt("b", "Crossing over", "It creates new allele combinations on chromatids."),
      opt("c", "Independent assortment", "It creates new combinations of maternal and paternal chromosomes."),
      opt("d", "Both of the others", "Both are sources of variation."),
    ],
    correct: "a",
    explanation: "Replication makes identical copies. Variation comes from crossing over and independent assortment (and, later, from random fertilization).",
  },
];

export interface ChallengeRound {
  seed: number;
  questions: ChallengeQuestion[];
  index: number;
  picked: string | null;
  results: boolean[];
  finished: boolean;
}

export const ROUND_SIZE = 8;

export function newChallengeRound(seed: number): ChallengeRound {
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
      const last = s.index >= s.questions.length - 1;
      return last ? { ...s, finished: true } : { ...s, index: s.index + 1, picked: null };
    }
    case "restart":
      return newChallengeRound(s.seed + 101);
  }
}
