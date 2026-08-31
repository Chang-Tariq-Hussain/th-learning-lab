import type { TopicContent } from "../types";

/**
 * Cell Structure & Organization — Biology Batch 1 ("Cell Biology
 * Foundations"), topic 2 of 3 (see
 * `@/features/learning-path/data/biology-cell-foundations`).
 *
 * This is where the existing Interactive Cell Explorer
 * (`@/features/subjects/biology/cell-explorer`) becomes a purposeful
 * part of the lesson rather than a plain "open simulation" link: the
 * Explore step's `howToUse` and this topic's Challenge scenarios send
 * the student to find specific structures. The mission is deliberately
 * scoped to what the simulation actually supports — the Animal Cell
 * view only exposes 5 clickable organelles (nucleus, mitochondria,
 * ribosomes, rough ER, Golgi apparatus) and doesn't have separately
 * clickable membrane/cytoplasm hotspots, while the Plant Cell view
 * additionally exposes the cell wall, cell membrane, cytoplasm, and
 * plasmodesmata as their own clickable regions (see
 * `cell-explorer/components/animal-cell-organelles.tsx` and
 * `plant-cell-body.tsx`) — so the "find the boundary and the fluid
 * interior" mission below is written for the Plant Cell view
 * specifically, where those structures actually exist as separate
 * targets.
 *
 * `practice.quizId` points at a new, dedicated 13-question bank
 * (`@/features/quiz-engine/data/biology-cell-structure-organization-quiz.ts`).
 */
export const biologyCellStructureOrganizationContent: TopicContent = {
  subjectSlug: "biology",
  topicSlug: "cell-structure-organization",
  title: "Cell Structure & Organization",
  subjectLabel: "Biology",
  topicLabel: "Cell Structure",
  colorToken: "biology",
  simulationHref: "/dashboard/biology/cell-structure-organization",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Name the three basic structures every cell has: a boundary, cytoplasm, and genetic material.",
      "Explain what the cell membrane, cytoplasm, and organelles each contribute to a working cell.",
      "Describe, at a basic level, the difference between a prokaryotic cell and a eukaryotic cell.",
      "Explain why a cell's structures need to work together rather than function in isolation.",
    ],
    concepts: [
      {
        term: "Cell boundary (cell membrane)",
        explanation:
          "Every cell is wrapped in a membrane that separates its inside from its surroundings and controls what enters and leaves. Without a boundary, a cell couldn't keep its contents together at all.",
      },
      {
        term: "Cytoplasm",
        explanation:
          "The gel-like fluid that fills the inside of a cell, holding every organelle in place. Many of a cell's everyday chemical reactions happen directly in the cytoplasm.",
      },
      {
        term: "Genetic material",
        explanation:
          "The instructions a cell uses to build and run itself, in the form of DNA. In the cells this course focuses on, that DNA is kept inside the nucleus.",
      },
      {
        term: "Organelles",
        explanation:
          "Specialized internal structures, each with its own job — much like organs inside a body, but at the scale of a single cell. Topic 3 (Cell Organelles) covers what each one does in detail.",
      },
      {
        term: "Prokaryotic vs eukaryotic cells",
        explanation:
          "Cells that keep their DNA loose inside the cytoplasm (with no nucleus) are called prokaryotic — most bacteria are built this way. Cells that keep their DNA enclosed inside a nucleus, like the ones in the Cell Explorer, are called eukaryotic.",
      },
    ],
    whyItMatters:
      "A cell isn't just a bag holding random parts — its boundary, its cytoplasm, and its organelles each do a specific job, and the cell only works because those jobs happen together, at the same time, in the same small space. Understanding this basic organization is what makes it possible to later understand what goes wrong when one part fails, like a damaged cell membrane in a burn injury or a nucleus that stops correctly controlling cell division.",
    keyTerms: [
      { term: "Selectively permeable", definition: "A membrane property that lets some substances through while blocking others, rather than being fully open or fully sealed." },
      { term: "Nucleus", definition: "The organelle that encloses a eukaryotic cell's DNA and directs the cell's activities." },
      { term: "Prokaryote", definition: "An organism whose cells have no nucleus — their DNA sits loose in the cytoplasm." },
      { term: "Eukaryote", definition: "An organism whose cells have a nucleus enclosing their DNA." },
    ],
    misconceptions: [
      {
        id: "misconception-membrane-solid-wall",
        misconception: "The cell membrane is a solid, sealed wall that nothing can cross.",
        correction:
          "The cell membrane is selectively permeable — it deliberately lets certain substances (like oxygen or nutrients) pass through while keeping others out. A completely sealed membrane would starve the cell rather than protect it.",
      },
      {
        id: "misconception-cytoplasm-empty-space",
        misconception: "The cytoplasm is just empty space between the \"important\" organelles.",
        correction:
          "The cytoplasm is an active, gel-like fluid, and a great deal of a cell's everyday chemical activity happens directly within it — it isn't passive filler, it's a working part of the cell.",
      },
      {
        id: "misconception-all-cells-have-nucleus",
        misconception: "Every cell has a nucleus.",
        correction:
          "Only eukaryotic cells have a nucleus. Prokaryotic cells, like most bacteria, keep their DNA loose in the cytoplasm with no nucleus enclosing it.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Predict first, then confirm using the Cell Explorer mission below.",
    scenarios: [
      {
        id: "biology-cell-structure-organization-predict-001",
        scenario: "A cell's membrane is damaged and can no longer control what passes in or out.",
        question: "What is the most likely consequence for the cell?",
        options: [
          { id: "loses-control", label: "It loses control over its internal environment" },
          { id: "no-effect", label: "No real effect — the membrane isn't very important" },
          { id: "makes-more-dna", label: "It starts producing extra DNA" },
        ],
        actualResultOptionId: "loses-control",
        explanation:
          "The membrane's whole job is controlling what enters and leaves. Without that control, substances the cell needs to keep out can flood in, and substances it needs to keep in can leak out.",
        hint: "What does the cell membrane normally control?",
      },
      {
        id: "biology-cell-structure-organization-predict-002",
        scenario: "Two cells are compared: one keeps its DNA loose in the cytoplasm, and the other keeps its DNA enclosed inside a nucleus.",
        question: "Which term describes the cell with the DNA enclosed inside a nucleus?",
        options: [
          { id: "eukaryotic", label: "Eukaryotic" },
          { id: "prokaryotic", label: "Prokaryotic" },
        ],
        actualResultOptionId: "eukaryotic",
        explanation:
          "A cell that encloses its DNA inside a nucleus is eukaryotic. A cell with DNA loose in the cytoplasm and no nucleus is prokaryotic.",
        hint: "Which term did you learn for \"has a nucleus\"?",
      },
      {
        id: "biology-cell-structure-organization-predict-003",
        scenario: "You're asked where most of a cell's everyday chemical reactions physically take place.",
        question: "Which structure is that?",
        options: [
          { id: "cytoplasm", label: "Cytoplasm" },
          { id: "membrane", label: "Cell membrane" },
          { id: "boundary-only", label: "Nowhere — reactions only happen in organelles" },
        ],
        actualResultOptionId: "cytoplasm",
        explanation:
          "The cytoplasm is where a great deal of a cell's everyday chemical activity happens, in addition to holding the organelles in place.",
        hint: "Which structure fills the inside of the cell around the organelles?",
      },
      {
        id: "biology-cell-structure-organization-predict-004",
        scenario: "A cell has a working membrane and cytoplasm, but its nucleus has stopped functioning correctly.",
        question: "What is most directly affected?",
        options: [
          { id: "directing-activities", label: "The cell's ability to direct its own activities" },
          { id: "boundary-integrity", label: "The strength of its outer boundary" },
          { id: "nothing", label: "Nothing — the nucleus is optional" },
        ],
        actualResultOptionId: "directing-activities",
        explanation:
          "The nucleus stores the cell's DNA and directs its activities. If it stops working correctly, the cell loses its ability to properly control and direct what it does — even if its boundary and cytoplasm are fine.",
        hint: "What did you learn the nucleus is responsible for directing?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Switch to the Plant Cell view in the Cell Explorer — its boundary and interior are separately clickable, unlike the Animal Cell view.",
      "Click the cell wall and cell membrane, one at a time, to see the two layers that make up a plant cell's boundary.",
      "Click the cytoplasm to see the fluid that fills the space around every organelle.",
      "Click the nucleus to find where the genetic material is kept.",
      "Click at least three more organelles you haven't identified yet, and read what each one does.",
    ],
    tryThis: [
      "Explain, in your own words, the difference between what the cell wall does and what the cell membrane does — they're two separate structures right next to each other.",
      "Switch back to the Animal Cell view and notice it doesn't have a separately clickable membrane or cytoplasm the way the Plant Cell does — every animal cell still has both, they're just not individually highlighted here.",
      "Turn on \"Show labels\" to see every structure's name at once, then quiz yourself by covering the labels and trying to remember what's where.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "biology-cell-structure-organization-explain-001",
        question: "Why does a cell need a boundary, cytoplasm, and genetic material all at once, rather than just one of the three?",
        answer:
          "Each piece does something the others can't: the boundary keeps the cell's contents together and controls what crosses in or out, the cytoplasm is where much of the cell's chemistry actually happens, and the genetic material stores the instructions directing all of it. Remove any one and the cell can't function as a complete, living unit.",
      },
      {
        id: "biology-cell-structure-organization-explain-002",
        question: "Why do plant cells have both a cell wall and a cell membrane, when animal cells only need a membrane?",
        answer:
          "The cell wall is a rigid outer layer that gives a plant cell structural support and shape — something a plant needs since it can't move around to protect itself. The cell membrane sits just inside it and still does the actual job of controlling what enters and leaves. Animal cells don't need the extra rigid support layer, so they only have the membrane.",
      },
      {
        id: "biology-cell-structure-organization-explain-003",
        question: "Why does keeping DNA inside a nucleus (eukaryotic) versus loose in the cytoplasm (prokaryotic) matter?",
        answer:
          "Enclosing DNA inside its own nucleus keeps the cell's genetic instructions organized and separated from the rest of the cell's activity in the cytoplasm — it's one more way a eukaryotic cell divides up its internal organization, the same idea behind having distinct organelles at all.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "biology-cell-structure-organization",
  },

  // -------------------------------------------------------------
  // CHALLENGE — Cell Explorer Mission
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Use the Cell Explorer above (switch to the Plant Cell view) to find each structure, read what it does, then answer the question about it. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "biology-cell-structure-organization-challenge-001",
        requiresExperiment: false, // Explore above already embeds the live simulation on this page — a second copy would be redundant.
        title: "Cell Explorer Mission: Find the Boundary",
        scenario: "In the Plant Cell view, the outermost layer sits just outside a second, thinner layer.",
        objective: "Click the outermost structure and identify which layer of the boundary it is.",
        tools: [{ id: "plant-cell-boundary", label: "Plant Cell view — cell wall and cell membrane hotspots" }],
        answer: {
          mode: "choice",
          options: [
            { id: "cell-wall", label: "Cell wall" },
            { id: "cell-membrane", label: "Cell membrane" },
            { id: "nucleus", label: "Nucleus" },
          ],
          correctOptionId: "cell-wall",
        },
        explanation: "The rigid outer layer you click first is the cell wall — it gives the plant cell its shape and protection, sitting just outside the cell membrane.",
        hints: ["Which layer is on the very outside — the rigid one, or the one just inside it?"],
      },
      {
        id: "biology-cell-structure-organization-challenge-002",
        requiresExperiment: false, // Explore above already embeds the live simulation on this page — a second copy would be redundant.
        title: "Cell Explorer Mission: Find the Genetic Material",
        scenario: "Somewhere inside the Plant Cell view is the structure that stores the cell's DNA.",
        objective: "Click the structure that holds the cell's genetic material.",
        tools: [{ id: "plant-cell-nucleus", label: "Plant Cell view — nucleus hotspot" }],
        answer: {
          mode: "choice",
          options: [
            { id: "nucleus", label: "Nucleus" },
            { id: "mitochondria", label: "Mitochondria" },
            { id: "cell-wall", label: "Cell wall" },
          ],
          correctOptionId: "nucleus",
        },
        explanation: "The nucleus stores the cell's DNA and directs the cell's activities.",
        hints: ["It's the large, rounded structure often near the center or edge of the cell."],
      },
      {
        id: "biology-cell-structure-organization-challenge-003",
        requiresExperiment: false, // Explore above already embeds the live simulation on this page — a second copy would be redundant.
        title: "Cell Explorer Mission: Find the Fluid Interior",
        scenario: "Between the boundary and the organelles, the whole cell is filled with a gel-like fluid.",
        objective: "Click that fluid interior and identify it.",
        tools: [{ id: "plant-cell-cytoplasm", label: "Plant Cell view — cytoplasm hotspot" }],
        answer: {
          mode: "choice",
          options: [
            { id: "cytoplasm", label: "Cytoplasm" },
            { id: "cell-wall", label: "Cell wall" },
            { id: "vacuole", label: "Large central vacuole" },
          ],
          correctOptionId: "cytoplasm",
        },
        explanation: "The cytoplasm is the fluid that fills the cell and holds all its organelles in place.",
        hints: ["It fills the space around every organelle, not just one specific spot."],
      },
      {
        id: "biology-cell-structure-organization-challenge-004",
        requiresExperiment: false, // Explore above already embeds the live simulation on this page — a second copy would be redundant.
        title: "Cell Explorer Mission: Three More Structures",
        scenario: "Beyond the boundary, cytoplasm, and nucleus, the Plant Cell view has several more distinct organelles to click.",
        objective: "Click at least three organelles you haven't identified yet, then identify one that helps the plant capture sunlight.",
        tools: [{ id: "plant-cell-organelles", label: "Plant Cell view — all organelle hotspots" }],
        answer: {
          mode: "choice",
          options: [
            { id: "chloroplast", label: "Chloroplast" },
            { id: "ribosomes", label: "Ribosomes" },
            { id: "golgi", label: "Golgi apparatus" },
          ],
          correctOptionId: "chloroplast",
        },
        explanation: "The chloroplast is the organelle that captures sunlight and turns it into food through photosynthesis — the next topic, Cell Organelles, covers this and the others in full detail.",
        hints: ["Its green color is a clue — it's named after the pigment that captures light."],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "biology",
      topicSlug: "what-is-a-cell",
      label: "What Is a Cell?",
      href: "/dashboard/biology/what-is-a-cell",
      reason: "Covers the basic idea of a cell that this topic's structures belong to.",
    },
    {
      subjectSlug: "biology",
      topicSlug: "cell-organelles",
      label: "Cell Organelles",
      href: "/dashboard/biology/cell-organelles",
      reason: "Goes into detail on what each individual organelle introduced here actually does.",
    },
  ],
};
