/**
 * Authored content for the nine meiosis stages, the 16 animation sub-steps and the selectable structures.
 * Wording follows standard introductory biology texts (OpenStax Biology 2e ch. 11, Campbell Biology ch. 13).
 */
export type StageId =
  | "interphase"
  | "prophase-1"
  | "metaphase-1"
  | "anaphase-1"
  | "telophase-1"
  | "prophase-2"
  | "metaphase-2"
  | "anaphase-2"
  | "telophase-2";

export interface StageInfo {
  id: StageId;
  /** 1-indexed. */
  number: number;
  label: string;
  /** Compact label for small chips. */
  short: string;
  phase: "prep" | "I" | "II";
  /** Beginner-friendly: what is happening. */
  whatHappening: string;
  /** Which chromosomes / structures are moving. */
  moving: string;
  whyMatters: string;
  /** What this stage produces. */
  result: string;
  /** Optional deeper detail. */
  deeper: string;
  keyConcept?: string;
}

export const STAGES: StageInfo[] = [
  {
    id: "interphase",
    number: 1,
    label: "Interphase",
    short: "Interphase",
    phase: "prep",
    whatHappening:
      "Before meiosis begins, the cell copies its DNA once. Every chromosome becomes two identical sister chromatids joined at a centromere.",
    moving: "Nothing is pulled apart yet. Each chromosome makes an identical copy of itself right beside it, inside the intact nucleus.",
    whyMatters: "Copying first gives the cell enough DNA to share out among four cells later.",
    result: "Each chromosome now has two sister chromatids. The chromosome number has not changed (still 2n).",
    deeper:
      "DNA replication happens once, in the S phase of interphase, before meiosis I. There is no second round of replication between meiosis I and meiosis II. Replication doubles the DNA (2C → 4C) but not the chromosome number, because the two copies stay joined at one centromere and count as one chromosome.",
    keyConcept: "DNA is copied once, before meiosis I — not between the two divisions.",
  },
  {
    id: "prophase-1",
    number: 2,
    label: "Prophase I",
    short: "Prophase I",
    phase: "I",
    whatHappening:
      "Chromosomes condense. Each chromosome finds its homologous partner and pairs up with it (synapsis), forming a tetrad. Non-sister chromatids then swap matching pieces of DNA: crossing over.",
    moving:
      "Homologous chromosomes move together side by side. Two non-sister chromatids cross and exchange segments. The nuclear envelope breaks down and the spindle starts to form.",
    whyMatters: "Crossing over creates chromatids with new combinations of alleles. It is one of the two main sources of genetic variation in meiosis.",
    result: "Tetrads (four chromatids each) that include recombinant chromatids. The cell is still 2n.",
    deeper:
      "Synapsis is held together by a protein scaffold called the synaptonemal complex. The X-shaped crossing points, chiasmata, mark where crossovers happened and help hold the homologs together until anaphase I. Crossovers form between non-sister chromatids, at matching positions, and usually only a few per chromosome pair. Their positions and number vary from one meiosis to the next, and some pairs may have none in a given cell. If a crossover falls between two genes, the allele combination changes; if it falls outside them, the DNA is exchanged but the combination of those genes does not change.",
    keyConcept: "Crossing over happens between NON-sister chromatids of a homologous pair.",
  },
  {
    id: "metaphase-1",
    number: 3,
    label: "Metaphase I",
    short: "Metaphase I",
    phase: "I",
    whatHappening: "Tetrads line up at the middle of the cell, the metaphase plate. The two homologs of each pair face opposite poles.",
    moving:
      "Spindle fibers from opposite poles attach to the centromere of each homolog. Both sister chromatids of a homolog attach to the same pole.",
    whyMatters:
      "Which homolog faces which pole is random for every pair, independent of the other pairs. This is independent assortment, the second main source of variation.",
    result: "Homologous pairs (tetrads) aligned side by side across the plate, not in single file.",
    deeper:
      "With n pairs of chromosomes there are 2ⁿ possible orientations, so 4 for 2 pairs, 8 for 3 and 16 for 4. In humans, with 23 pairs, that is 2²³ ≈ 8.4 million combinations even before crossing over is counted.",
    keyConcept: "Pairs line up together at metaphase I. Their random orientation = independent assortment.",
  },
  {
    id: "anaphase-1",
    number: 4,
    label: "Anaphase I",
    short: "Anaphase I",
    phase: "I",
    whatHappening:
      "The homologous chromosomes separate and are pulled toward opposite poles. The sister chromatids of each chromosome stay joined.",
    moving: "Each whole homolog (still two sister chromatids held at one centromere) moves to one pole while the cell elongates.",
    whyMatters: "This is the step that reduces the chromosome number. Each pole receives one chromosome from every pair.",
    result: "Two sets of duplicated chromosomes, one at each end of the elongated cell. Still one cell.",
    deeper:
      "The protein 'glue' (cohesin) holding sister chromatids together is released along the arms, which lets the crossed-over homologs come apart, but it is protected at the centromere so sister chromatids stay together until anaphase II.",
    keyConcept: "Homologous chromosomes separate in anaphase I. Sister chromatids do not.",
  },
  {
    id: "telophase-1",
    number: 5,
    label: "Telophase I & Cytokinesis",
    short: "Telophase I",
    phase: "I",
    whatHappening: "The cell divides into two cells. Each new cell is haploid: it has one chromosome from every pair, but each chromosome still has two sister chromatids.",
    moving: "Chromosomes arrive at the poles and the cell pinches in two at the middle (the cleavage furrow in animal cells).",
    whyMatters: "The first division halves the chromosome number: 2n → n.",
    result: "Two haploid cells. Chromosomes are still duplicated (two chromatids each).",
    deeper:
      "In some species a nuclear envelope briefly re-forms and the chromosomes partly uncoil; in others the cells go straight into meiosis II. Either way, there is no DNA replication in this short gap (interkinesis). Each cell is haploid in chromosome number but still has the 2C amount of DNA.",
    keyConcept: "After meiosis I the cells are haploid, but the chromosomes are still duplicated.",
  },
  {
    id: "prophase-2",
    number: 6,
    label: "Prophase II",
    short: "Prophase II",
    phase: "II",
    whatHappening: "In both cells, a new spindle forms and the chromosomes (still two sister chromatids each) move toward the middle. DNA is NOT copied again.",
    moving: "Centrosomes move to opposite ends of each cell and spindle fibers grow. Chromosomes drift toward the cell's center.",
    whyMatters: "Meiosis II is a division that works like mitosis: it separates sister chromatids. No new DNA is needed.",
    result: "Two haploid cells getting ready to divide again.",
    deeper:
      "The spindles in meiosis II usually sit at right angles to the first spindle, which is why the second division in this model splits each cell top-to-bottom. The cells are haploid (n) throughout meiosis II.",
  },
  {
    id: "metaphase-2",
    number: 7,
    label: "Metaphase II",
    short: "Metaphase II",
    phase: "II",
    whatHappening: "In each cell, the chromosomes line up one by one along the metaphase plate.",
    moving: "The two sister chromatids of every chromosome attach to spindle fibers from opposite poles.",
    whyMatters: "Attaching to opposite poles makes sure each sister chromatid goes to a different cell.",
    result: "Single-file chromosomes in each cell, ready to be split into chromatids.",
    deeper:
      "Unlike metaphase I, chromosomes are not paired: there are no tetrads, only n individual chromosomes in each cell, each made of two sister chromatids. Because of crossing over, the two sister chromatids of a chromosome may no longer be genetically identical.",
  },
  {
    id: "anaphase-2",
    number: 8,
    label: "Anaphase II",
    short: "Anaphase II",
    phase: "II",
    whatHappening: "The centromeres split and the sister chromatids are pulled apart toward opposite poles. Each separated chromatid is now a chromosome.",
    moving: "Sister chromatids move apart, each led by its centromere.",
    whyMatters: "This final separation gives every future cell a single copy of each chromosome.",
    result: "At each pole, a haploid set of unduplicated chromosomes.",
    deeper:
      "Cohesin at the centromeres is finally cleaved. Right after the split each cell briefly contains twice the chromosome number (2p separated chromatids), but they are heading to opposite poles and end up in different cells.",
    keyConcept: "Sister chromatids separate in anaphase II.",
  },
  {
    id: "telophase-2",
    number: 9,
    label: "Telophase II & Cytokinesis",
    short: "Telophase II",
    phase: "II",
    whatHappening:
      "Both cells divide, giving four haploid daughter cells. Nuclear envelopes re-form, and each chromosome now consists of just one chromatid.",
    moving: "Chromosomes reach the poles, the spindles disappear, and each cell pinches in two.",
    whyMatters: "The four cells can become gametes (eggs or sperm). Each has half the original chromosome number and a different mix of alleles.",
    result: "Four genetically different haploid cells with unduplicated chromosomes (n, 1C).",
    deeper:
      "In the standard model, one diploid cell gives four haploid cells. In many animals, though, egg formation is uneven: one large egg and small polar bodies. After fertilization, two haploid gametes combine to restore 2n.",
    keyConcept: "Meiosis makes four haploid cells with unduplicated chromosomes.",
  },
];

export interface BeatInfo {
  stage: number;
  title: string;
  caption: string;
}

export const BEATS: BeatInfo[] = [
  { stage: 0, title: "Before replication", caption: "Before replication, each chromosome is a single, unduplicated chromatid (G1)." },
  { stage: 0, title: "DNA replication", caption: "DNA replication (S phase): every chromosome is copied once, so it has two sister chromatids joined at a centromere." },
  { stage: 1, title: "Condensation", caption: "Chromosomes condense. Each homologous pair, one blue (maternal) and one orange (paternal), moves together." },
  { stage: 1, title: "Synapsis", caption: "Synapsis: homologs pair side by side. Each pair is now a tetrad of four chromatids." },
  { stage: 1, title: "Chiasma forms", caption: "Crossing over begins: two NON-sister chromatids cross at matching points (a chiasma)." },
  { stage: 1, title: "Segments exchanged", caption: "The chromatids swap the DNA beyond the crossing point: they now carry new allele combinations." },
  { stage: 1, title: "Late prophase I", caption: "The nuclear envelope breaks down, the spindle forms, and the tetrads move toward the middle." },
  { stage: 2, title: "Metaphase I", caption: "Tetrads line up at the plate. Each homolog is attached to one pole." },
  { stage: 3, title: "Anaphase I", caption: "Homologous chromosomes are pulled apart. Sister chromatids stay joined." },
  { stage: 4, title: "Telophase I", caption: "Chromosomes reach the poles and the cell begins to pinch in two." },
  { stage: 4, title: "Cytokinesis I", caption: "Two haploid cells. Each chromosome still has two sister chromatids." },
  { stage: 5, title: "Prophase II", caption: "A new spindle forms in each cell. There is no DNA replication." },
  { stage: 6, title: "Metaphase II", caption: "Chromosomes line up single file at each cell's plate." },
  { stage: 7, title: "Anaphase II", caption: "Centromeres split: sister chromatids are pulled to opposite poles." },
  { stage: 8, title: "Telophase II", caption: "Chromatids (now chromosomes) reach the poles and both cells begin to divide." },
  { stage: 8, title: "Cytokinesis II", caption: "Four haploid cells, each with unduplicated chromosomes." },
];

export type StructureId =
  | "membrane"
  | "nucleus"
  | "centrosome"
  | "spindle"
  | "plate"
  | "centromere"
  | "tetrad"
  | "chiasma"
  | "furrow";

export interface StructureInfo {
  id: StructureId;
  name: string;
  what: string;
  role: string;
  /** Beats in which it is on screen. */
  beats: number[];
}

const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

export const STRUCTURES: Record<StructureId, StructureInfo> = {
  membrane: {
    id: "membrane",
    name: "Cell membrane",
    what: "The boundary of the cell. It pinches inward to divide the cell in cytokinesis.",
    role: "Divides one cell into two (after meiosis I) and then four (after meiosis II).",
    beats: range(0, 15),
  },
  nucleus: {
    id: "nucleus",
    name: "Nucleus (nuclear envelope)",
    what: "The compartment that holds the chromosomes during interphase. The envelope breaks down in late prophase I and re-forms around each haploid set at the end.",
    role: "Protects the DNA during interphase and is rebuilt around each set of chromosomes.",
    beats: [0, 1, 2, 3, 4, 5, 6, 15],
  },
  centrosome: {
    id: "centrosome",
    name: "Centrosome (spindle pole)",
    what: "A pair of centrioles surrounded by a halo of microtubules. Centrosomes move to opposite ends of the cell and organize the spindle.",
    role: "Marks the spindle poles and organizes the spindle fibers.",
    beats: range(0, 14),
  },
  spindle: {
    id: "spindle",
    name: "Spindle fibers",
    what: "Protein microtubules that reach from the poles to the chromosomes' centromeres.",
    role: "Pull chromosomes into place and then pull them apart: homologs in meiosis I, sister chromatids in meiosis II.",
    beats: [6, 7, 8, 9, 11, 12, 13, 14],
  },
  plate: {
    id: "plate",
    name: "Metaphase plate",
    what: "The imaginary plane across the middle of the cell where chromosomes line up.",
    role: "Lining up on the plate lets spindle fibers pull equal sets to the two sides.",
    beats: [7, 12],
  },
  centromere: {
    id: "centromere",
    name: "Centromere",
    what: "The constricted region where sister chromatids are joined. Spindle fibers attach to it.",
    role: "Holds sister chromatids together and gives the spindle something to pull on. A chromosome is counted by its centromere.",
    beats: range(1, 15),
  },
  tetrad: {
    id: "tetrad",
    name: "Tetrad (bivalent)",
    what: "A pair of homologous chromosomes held together: 2 chromosomes = 4 chromatids.",
    role: "Lets homologs exchange DNA and then be pulled to opposite poles in anaphase I.",
    beats: range(3, 7),
  },
  chiasma: {
    id: "chiasma",
    name: "Chiasma (crossover site)",
    what: "The point where two non-sister chromatids have crossed and exchanged DNA segments.",
    role: "Creates recombinant chromatids with new allele combinations and helps hold the homologs together until anaphase I.",
    beats: [4, 5, 6],
  },
  furrow: {
    id: "furrow",
    name: "Cleavage furrow",
    what: "The pinching-in of the cell membrane during cytokinesis (animal cells).",
    role: "Splits the cytoplasm so each new nucleus ends up in its own cell.",
    beats: [9, 14],
  },
};

export const STRUCTURE_ORDER: StructureId[] = ["membrane", "nucleus", "centrosome", "spindle", "plate", "centromere", "tetrad", "chiasma", "furrow"];

export function structuresAt(beat: number): StructureInfo[] {
  return STRUCTURE_ORDER.map((id) => STRUCTURES[id]).filter((s) => s.beats.includes(beat));
}
