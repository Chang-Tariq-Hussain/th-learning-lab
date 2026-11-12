/**
 * Authored content for the seven mitosis steps (interphase, then the five phases of mitosis, then cytokinesis),
 * the 15 animation sub-steps and the selectable cell structures. Wording follows standard introductory biology
 * texts (OpenStax Biology 2e ch. 10, Campbell Biology ch. 12).
 *
 * Interphase is not part of mitosis itself (it is the preparation), and cytokinesis is the division of the
 * cytoplasm, a separate process from the division of the nucleus (mitosis proper). The navigator labels both.
 */
export type StageId = "interphase" | "prophase" | "prometaphase" | "metaphase" | "anaphase" | "telophase" | "cytokinesis";

export interface StageInfo {
  id: StageId;
  /** 1-indexed. */
  number: number;
  label: string;
  short: string;
  /** prep = before mitosis, M = nuclear division, C = cytoplasmic division. */
  phase: "prep" | "M" | "C";
  whatHappening: string;
  moving: string;
  whyMatters: string;
  result: string;
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
      "Before mitosis the cell grows and copies its DNA. After copying, every chromosome consists of two identical sister chromatids joined at a centromere. The centrosome is copied too.",
    moving: "Nothing is pulled apart. Each chromosome makes an identical copy of itself beside it, inside the intact nucleus. The DNA is spread out as thin chromatin, so individual chromosomes cannot be seen.",
    whyMatters: "Copying first gives each daughter cell a complete set of DNA later.",
    result: "Same number of chromosomes, twice the DNA: each chromosome now has two sister chromatids.",
    deeper:
      "DNA replication happens in the S phase of interphase, between the G1 and G2 gaps. Replication doubles the DNA (2C to 4C) but not the chromosome number, because the two copies stay attached at one centromere and count as one chromosome. Mitosis (M phase) starts only after G2.",
    keyConcept: "DNA is copied in interphase, before mitosis begins. Copying doubles the DNA, not the chromosome number.",
  },
  {
    id: "prophase",
    number: 2,
    label: "Prophase",
    short: "Prophase",
    phase: "M",
    whatHappening:
      "The chromatin coils up (condenses) into compact chromosomes that can be seen. Each chromosome is two sister chromatids. The two centrosomes move to opposite sides of the cell and the spindle begins to form.",
    moving: "Chromatin condenses inside the nucleus. Centrosomes move apart toward opposite poles, growing microtubules as they go. The nuclear envelope is still in place.",
    whyMatters: "Compact chromosomes can be moved without tangling or breaking. Opposite spindle poles set up the two directions the chromatids will travel.",
    result: "Visible chromosomes (each two sister chromatids with a kinetochore on each at the centromere) and a growing spindle.",
    deeper:
      "Condensation is driven by proteins called condensins. Cohesin proteins hold the sister chromatids together along their length and especially at the centromere. Kinetochores, protein complexes that assemble at each centromere (one per sister chromatid), appear late in prophase. In animal cells the nucleolus disappears. Plant cells have no centrosomes with centrioles, but still build a spindle.",
    keyConcept: "Each chromosome is still two sister chromatids. They are not separated until anaphase.",
  },
  {
    id: "prometaphase",
    number: 3,
    label: "Prometaphase",
    short: "Prometaphase",
    phase: "M",
    whatHappening:
      "The nuclear envelope breaks into fragments. Spindle microtubules reach into the nuclear region and attach to the kinetochores. Tugged from both sides, the chromosomes jostle toward the center of the cell.",
    moving: "Fibers from the two poles capture the kinetochores. One sister chromatid is attached to a pole on its side, the other chromatid to the opposite pole. Chromosomes move toward the middle.",
    whyMatters: "Attaching each sister chromatid to the opposite pole is what makes a clean, equal separation possible.",
    result: "Every chromosome is attached to spindle fibers from both poles and is moving to the cell's equator.",
    deeper:
      "Microtubules grow and shrink, 'searching' until one catches a kinetochore. Kinetochore microtubules attach to the kinetochore of each chromatid; the two sister kinetochores face opposite directions so that they are captured by opposite poles. Wrong attachments are corrected before anaphase.",
    keyConcept: "Sister chromatids attach to opposite poles. That is how each daughter cell will get exactly one copy.",
  },
  {
    id: "metaphase",
    number: 4,
    label: "Metaphase",
    short: "Metaphase",
    phase: "M",
    whatHappening:
      "All the chromosomes line up along the middle of the cell, the metaphase plate, each one individually (not in pairs). Each sister chromatid is attached to a fiber from its own pole.",
    moving: "Chromosomes are pushed and pulled until their centromeres sit on the plate halfway between the poles. Tension on the fibers is balanced from both sides.",
    whyMatters: "The spindle checkpoint waits until every chromosome is attached to both poles and under tension. Only then does the cell go on to anaphase, which helps prevent daughter cells getting the wrong number of chromosomes.",
    result: "Chromosomes in single file at the equator: one chromatid facing each pole.",
    deeper:
      "The metaphase plate is an imaginary plane, not a structure. In mitosis homologous chromosomes do not pair, so each chromosome (two sister chromatids) lines up on its own. This is different from metaphase I of meiosis, where homologous pairs line up together. The spindle checkpoint (the spindle assembly checkpoint) delays the start of anaphase while any kinetochore is unattached.",
    keyConcept: "Chromosomes line up one by one, not in homologous pairs. The checkpoint waits until every one is attached.",
  },
  {
    id: "anaphase",
    number: 5,
    label: "Anaphase",
    short: "Anaphase",
    phase: "M",
    whatHappening:
      "The cohesion at the centromeres is cut, so sister chromatids separate. Each chromatid is now an individual chromosome and is pulled toward its pole, centromere first. The cell elongates.",
    moving: "Kinetochore fibers shorten and pull the new chromosomes toward opposite poles, with their arms trailing behind. The poles move farther apart as the cell lengthens.",
    whyMatters: "Every chromosome has been copied and is now split equally: each pole receives exactly one copy of every chromosome.",
    result: "Two identical sets of chromosomes, one at each pole. The cell briefly holds twice as many chromosomes as before (counted by centromeres).",
    deeper:
      "An enzyme called separase cuts cohesin at the centromeres, and all the sister chromatid pairs separate at about the same time. Chromosomes move partly because the kinetochore fibers shorten (anaphase A) and partly because the poles move apart (anaphase B). Once the sister chromatids have separated, each is called a chromosome. The number of chromosomes in the whole cell is temporarily doubled (for example 8 instead of 4), but each end of the cell holds the original number.",
    keyConcept: "Sister chromatids separate. Each one is now a chromosome, and each pole gets one copy of every chromosome.",
  },
  {
    id: "telophase",
    number: 6,
    label: "Telophase",
    short: "Telophase",
    phase: "M",
    whatHappening:
      "The chromosomes arrive at the poles. A nuclear envelope re-forms around each set, so there are now two nuclei in one elongated cell. The chromosomes begin to decondense back into chromatin and the spindle breaks down.",
    moving: "Nothing is pulled any more. Nuclear envelope pieces assemble around each group of chromosomes; chromosomes uncoil; spindle fibers disappear; nucleoli reappear.",
    whyMatters: "Each future daughter cell now has its own complete nucleus with the same chromosomes as the parent.",
    result: "Two nuclei, each with the same chromosome number as the parent cell (2n), in one cell that is not yet divided.",
    deeper:
      "Telophase is roughly the reverse of prophase. Mitosis (division of the nucleus) is complete when the two nuclei have formed. Cytokinesis usually overlaps with late anaphase and telophase.",
    keyConcept: "Mitosis divides the nucleus. The cell itself has not divided yet.",
  },
  {
    id: "cytokinesis",
    number: 7,
    label: "Cytokinesis",
    short: "Cytokinesis",
    phase: "C",
    whatHappening:
      "The cytoplasm divides. In an animal cell a ring of actin and myosin filaments tightens around the middle and pinches the membrane inward, forming a cleavage furrow until two separate daughter cells remain. A plant cell builds a cell plate across the middle instead.",
    moving: "The contractile ring shrinks like a drawstring. Each daughter cell receives one nucleus and about half of the cytoplasm and organelles. In plants, vesicles carry cell-wall material to the center and the plate grows outward until it reaches the sides.",
    whyMatters: "Cytokinesis finishes the division, producing two separate cells.",
    result: "Two genetically identical daughter cells, each with the same chromosome number as the parent (2n) and each with one copy of every chromosome.",
    deeper:
      "Cytokinesis is a different process from mitosis. Mitosis is the division of the nucleus; cytokinesis is the division of the cell. They normally occur together but can be separated: some cells divide the nucleus without dividing the cell. Each daughter cell starts in G1 with unreplicated chromosomes (2C DNA), and will replicate its DNA again in its own S phase before its next division.",
    keyConcept: "Cytokinesis is a different step from mitosis. It splits the cytoplasm and gives two daughter cells.",
  },
];

export interface BeatInfo {
  stage: number;
  title: string;
  caption: string;
}

export const BEATS: BeatInfo[] = [
  { stage: 0, title: "Cell growth (G1)", caption: "Interphase: the cell grows. Each chromosome is still a single chromatid (2n), spread out as thin chromatin." },
  { stage: 0, title: "DNA replication (S) and G2", caption: "DNA is copied: every chromosome now has two sister chromatids. The chromosome number has not changed." },
  { stage: 1, title: "Chromatin condenses", caption: "Prophase: chromatin coils into visible chromosomes. Centrosomes move apart and start to build the spindle." },
  { stage: 1, title: "Condensed chromosomes", caption: "Late prophase: each chromosome is two sister chromatids, with a kinetochore on each at the centromere." },
  { stage: 2, title: "Nuclear envelope breaks down", caption: "Prometaphase: the nuclear envelope fragments and spindle fibers reach the kinetochores." },
  { stage: 2, title: "Chromosomes move to the center", caption: "Fibers from opposite poles attach to the sister chromatids of every chromosome, pulling them toward the middle." },
  { stage: 3, title: "Chromosomes align", caption: "Metaphase: every chromosome lines up individually on the metaphase plate." },
  { stage: 3, title: "Spindle checkpoint satisfied", caption: "All kinetochores are attached to fibers from opposite poles, so the cell is allowed to go on to anaphase." },
  { stage: 4, title: "Sister chromatids separate", caption: "Anaphase: the centromeres split. Each chromatid is now its own chromosome and is pulled toward a pole." },
  { stage: 4, title: "Chromosomes reach the poles", caption: "Late anaphase: one copy of every chromosome is at each pole and the cell has lengthened." },
  { stage: 5, title: "Nuclear envelopes re-form", caption: "Telophase: a nuclear envelope forms around each set of chromosomes; the spindle breaks down." },
  { stage: 5, title: "Two nuclei", caption: "Two nuclei are visible and the chromosomes decondense. The cell is still one cell." },
  { stage: 6, title: "Cleavage furrow begins", caption: "Cytokinesis: a contractile ring pinches the membrane inward at the middle of the cell." },
  { stage: 6, title: "Furrow deepens", caption: "The furrow deepens until the cell is nearly pinched in two." },
  { stage: 6, title: "Two daughter cells", caption: "Two genetically identical daughter cells, each with the same chromosome number as the parent cell." },
];

export type StructureId = "membrane" | "nucleus" | "centrosome" | "spindle" | "kinetochore" | "plate" | "centromere" | "furrow" | "cellplate";

export interface StructureInfo {
  id: StructureId;
  name: string;
  what: string;
  role: string;
}

export const STRUCTURES: Record<StructureId, StructureInfo> = {
  membrane: {
    id: "membrane",
    name: "Cell membrane",
    what: "The thin boundary around the cytoplasm.",
    role: "It pinches in two during cytokinesis so that each daughter cell has its own membrane.",
  },
  nucleus: {
    id: "nucleus",
    name: "Nucleus (nuclear envelope)",
    what: "The compartment that holds the chromosomes, surrounded by a double membrane (nuclear envelope).",
    role: "The envelope breaks down in prometaphase so the spindle can reach the chromosomes, and re-forms around each set in telophase.",
  },
  centrosome: {
    id: "centrosome",
    name: "Centrosome (spindle pole)",
    what: "In animal cells, a pair of centrioles surrounded by material that organizes microtubules. It is copied in interphase.",
    role: "The two centrosomes move to opposite poles and organize the spindle fibers. (Plant cells form spindle poles without centrioles.)",
  },
  spindle: {
    id: "spindle",
    name: "Spindle fibers (microtubules)",
    what: "Thin protein tubes (microtubules) that run from the spindle poles toward the middle of the cell.",
    role: "Fibers attach to the kinetochores and pull the chromosomes into line, then pull the separated chromatids to opposite poles.",
  },
  kinetochore: {
    id: "kinetochore",
    name: "Kinetochore",
    what: "A protein structure on the centromere of each chromatid. A duplicated chromosome has two, facing opposite directions.",
    role: "It is the attachment point for the spindle fiber. Each sister chromatid is attached to the pole on its own side.",
  },
  plate: {
    id: "plate",
    name: "Metaphase plate",
    what: "The imaginary plane halfway between the two spindle poles.",
    role: "Chromosomes line up here at metaphase, each one on its own, so the chromatids can be split equally.",
  },
  centromere: {
    id: "centromere",
    name: "Centromere",
    what: "The constricted region where the two sister chromatids are joined. It is where the kinetochores assemble.",
    role: "Cohesion at the centromere is released in anaphase, so the sister chromatids separate and each becomes a chromosome.",
  },
  furrow: {
    id: "furrow",
    name: "Cleavage furrow",
    what: "An inward pinching of the cell membrane at the middle of a dividing animal cell, made by a contractile ring of actin and myosin.",
    role: "The furrow deepens until the cell is divided into two daughter cells.",
  },
  cellplate: {
    id: "cellplate",
    name: "Cell plate",
    what: "In plant cells, a new wall that forms across the middle of the dividing cell from vesicles that fuse.",
    role: "It grows outward until it reaches the existing wall, dividing the cell in two.",
  },
};

/** Structures that can be seen and selected at a beat. */
export function structuresAt(beat: number, plant: boolean): StructureInfo[] {
  const ids: StructureId[] = ["membrane"];
  if (beat <= 5 || beat >= 10) ids.push("nucleus");
  if (!plant) ids.push("centrosome");
  if (beat >= 2 && beat <= 11) ids.push("spindle");
  if (beat >= 3 && beat <= 11) ids.push("kinetochore");
  if (beat >= 1 && beat <= 11) ids.push("centromere");
  if (beat >= 5 && beat <= 8) ids.push("plate");
  if (beat >= 12) ids.push(plant ? "cellplate" : "furrow");
  return ids.map((i) => STRUCTURES[i]);
}
