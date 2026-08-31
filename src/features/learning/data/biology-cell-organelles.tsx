import type { TopicContent } from "../types";

/**
 * Cell Organelles — Biology Batch 1 ("Cell Biology Foundations"),
 * topic 3 of 3 (see
 * `@/features/learning-path/data/biology-cell-foundations`).
 *
 * Covers every organelle the existing Interactive Cell Explorer
 * actually models — no organelle is introduced here that isn't a real
 * clickable structure in the simulation (see
 * `cell-explorer/data/organelle-info.ts`, the single source of truth
 * this content's facts are kept consistent with): nucleus, nucleolus,
 * mitochondria, ribosomes, rough ER, smooth ER, Golgi apparatus, cell
 * wall, cell membrane, cytoplasm, large central vacuole, and
 * chloroplast. Lysosomes are intentionally NOT covered — the
 * simulation has no lysosome hotspot, and inventing one here would
 * describe a structure the student can never actually find or click.
 *
 * `practice.quizId` points at a new, dedicated 15-question bank
 * (`@/features/quiz-engine/data/biology-cell-organelles-quiz.ts`).
 */
export const biologyCellOrganellesContent: TopicContent = {
  subjectSlug: "biology",
  topicSlug: "cell-organelles",
  title: "Cell Organelles",
  subjectLabel: "Biology",
  topicLabel: "Cell Structure",
  colorToken: "biology",
  simulationHref: "/dashboard/biology/cell-organelles",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Name the major organelles found in animal and plant cells.",
      "Describe the main function of each organelle covered in this topic.",
      "Identify which structures appear only in plant cells, and explain why.",
      "Explain how a cell's organelles work together to keep the whole cell alive.",
    ],
    concepts: [
      {
        term: "Nucleus",
        explanation: "Stores the cell's DNA and directs almost everything the cell does — often called the cell's control center.",
      },
      {
        term: "Nucleolus",
        explanation: "A dense region inside the nucleus dedicated to building ribosomes. A busy cell's nucleolus can assemble thousands of new ribosomes every minute.",
      },
      {
        term: "Mitochondria",
        explanation: "Produces the energy the cell runs on — commonly nicknamed the \"powerhouse of the cell.\"",
      },
      {
        term: "Ribosomes",
        explanation: "Builds the proteins a cell needs to function. A single busy cell can contain millions of them at once.",
      },
      {
        term: "Rough endoplasmic reticulum (rough ER)",
        explanation: "Folds and processes proteins made by the ribosomes dotted across its surface — that studded surface is why it's called \"rough.\"",
      },
      {
        term: "Smooth endoplasmic reticulum (smooth ER)",
        explanation: "Builds lipids and helps break down toxins. It's called \"smooth\" because, unlike its neighbor, it has no ribosomes attached.",
      },
      {
        term: "Golgi apparatus",
        explanation: "Packages and ships proteins to wherever they're needed in the cell — think of it as the cell's post office.",
      },
      {
        term: "Cell wall (plant only)",
        explanation: "A rigid outer layer, built mainly from cellulose, that gives a plant cell its shape and protects it.",
      },
      {
        term: "Cell membrane",
        explanation: "Controls what enters and leaves the cell. In a plant cell it sits just inside the rigid cell wall.",
      },
      {
        term: "Cytoplasm",
        explanation: "The fluid that fills the cell and holds every organelle in place — and where much of the cell's everyday chemistry happens.",
      },
      {
        term: "Large central vacuole (plant only)",
        explanation: "Stores water and helps keep a plant cell firm and upright. It can take up to 90% of a mature plant cell's total volume.",
      },
      {
        term: "Chloroplast (plant only)",
        explanation: "Captures sunlight and turns it into food through photosynthesis. Its green color comes from chlorophyll, the pigment that absorbs sunlight.",
      },
    ],
    whyItMatters:
      "Every organelle covered here explains real biology you've probably already heard of: mitochondrial problems are linked to fatigue and certain diseases, chloroplasts are the reason plants (and the oxygen you breathe) exist at all, and ribosomes are the target of many antibiotics that stop bacteria from building proteins without harming your own cells. Understanding what's inside a single cell is the starting point for understanding how your body heals a cut, how a plant grows, and how a single fertilized egg becomes an entire organism.",
    keyTerms: [
      { term: "Organelle", definition: "A specialized internal structure inside a cell, each with its own specific job — like organs inside a body, but at cell scale." },
      { term: "Photosynthesis", definition: "The process, carried out by chloroplasts, of turning sunlight into food (glucose)." },
      { term: "Selectively permeable", definition: "A membrane property that lets some substances through while blocking others." },
    ],
    misconceptions: [
      {
        id: "misconception-mitochondria-only-humans",
        misconception: "Only animal cells have mitochondria.",
        correction:
          "Both animal and plant cells have mitochondria — nearly every eukaryotic cell needs them to produce usable energy. Chloroplasts are the organelle unique to plant cells, not mitochondria.",
      },
      {
        id: "misconception-golgi-makes-proteins",
        misconception: "The Golgi apparatus is where proteins are built.",
        correction:
          "Proteins are built by ribosomes, then often processed by the rough ER. The Golgi apparatus's job comes after that — packaging and shipping those already-built proteins to wherever they're needed.",
      },
      {
        id: "misconception-vacuole-cell-wall-same",
        misconception: "The large central vacuole and the cell wall do the same job for a plant cell.",
        correction:
          "They're two separate structures with two separate jobs: the cell wall is a rigid outer layer providing shape and protection, while the large central vacuole is an internal sac storing water and helping keep the cell firm from the inside.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Predict first, then confirm using the Cell Explorer Challenge below.",
    scenarios: [
      {
        id: "biology-cell-organelles-predict-001",
        scenario: "A cell's mitochondria stop functioning properly.",
        question: "What is the most direct consequence for the cell?",
        options: [
          { id: "less-energy", label: "The cell can't produce enough usable energy" },
          { id: "no-dna", label: "The cell loses its DNA" },
          { id: "no-boundary", label: "The cell loses its outer boundary" },
        ],
        actualResultOptionId: "less-energy",
        explanation: "Mitochondria produce the cell's usable energy, so a mitochondria failure most directly limits how much energy the cell has to work with.",
        hint: "What is the mitochondria's main job?",
      },
      {
        id: "biology-cell-organelles-predict-002",
        scenario: "A cell is going to build and ship out a large amount of a particular protein.",
        question: "Put these organelles in the order that protein passes through: Golgi apparatus, ribosomes, rough ER.",
        options: [
          { id: "ribosomes-first", label: "Ribosomes → rough ER → Golgi apparatus" },
          { id: "golgi-first", label: "Golgi apparatus → ribosomes → rough ER" },
          { id: "rough-er-first", label: "Rough ER → Golgi apparatus → ribosomes" },
        ],
        actualResultOptionId: "ribosomes-first",
        explanation: "Ribosomes build the protein first, the rough ER (studded with ribosomes) folds and processes it, and the Golgi apparatus packages and ships the finished protein last.",
        hint: "Which organelle actually builds the protein first?",
      },
      {
        id: "biology-cell-organelles-predict-003",
        scenario: "You compare a plant cell to an animal cell.",
        question: "Which organelle would you expect to find only in the plant cell?",
        options: [
          { id: "chloroplast", label: "Chloroplast" },
          { id: "nucleus", label: "Nucleus" },
          { id: "mitochondria", label: "Mitochondria" },
        ],
        actualResultOptionId: "chloroplast",
        explanation: "Chloroplasts capture sunlight for photosynthesis, which only plants need to do to produce their own food — animal cells don't have them.",
        hint: "Which organelle is tied to photosynthesis?",
      },
      {
        id: "biology-cell-organelles-predict-004",
        scenario: "A mature plant cell's large central vacuole is holding a very large volume of water.",
        question: "What does this help the plant cell do?",
        options: [
          { id: "stay-firm", label: "Stay firm and upright" },
          { id: "build-proteins", label: "Build proteins" },
          { id: "produce-energy", label: "Produce energy" },
        ],
        actualResultOptionId: "stay-firm",
        explanation: "The large central vacuole stores water and helps keep a plant cell firm and upright — it can take up as much as 90% of the cell's total volume.",
        hint: "What did you learn the large central vacuole is mainly responsible for?",
      },
      {
        id: "biology-cell-organelles-predict-005",
        scenario: "The rough ER and the smooth ER sit right next to each other in a cell, but look different under a microscope.",
        question: "What causes the rough ER to look \"rough\"?",
        options: [
          { id: "ribosomes-on-surface", label: "Ribosomes dotted across its surface" },
          { id: "thicker-membrane", label: "A naturally thicker, bumpy membrane" },
          { id: "damage", label: "Damage from processing toxins" },
        ],
        actualResultOptionId: "ribosomes-on-surface",
        explanation: "The rough ER looks rough under a microscope specifically because ribosomes are dotted all over its surface — the smooth ER has no ribosomes attached, which is why it looks smooth by comparison.",
        hint: "What structure is described as being \"dotted\" on the rough ER's surface?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Switch between the Animal Cell and Plant Cell views in the Cell Explorer.",
      "Click each organelle to open its info panel and read its function and memorable fact.",
      "Turn on \"Show labels\" to see every organelle's name at once instead of only on click.",
      "Use the zoom controls to get a closer look at any organelle you've selected.",
    ],
    tryThis: [
      "Find every organelle in the Plant Cell view — there are nine organelles, plus the cell wall, cell membrane, and cytoplasm around them.",
      "Compare the Animal Cell and Plant Cell views: which organelles appear in both, and which appear only in the plant cell?",
      "Pick any organelle and explain, in one sentence, what would go wrong for the cell if it stopped working.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "biology-cell-organelles-explain-001",
        question: "Why do plant cells have chloroplasts while animal cells don't?",
        answer:
          "Plants make their own food through photosynthesis, which chloroplasts carry out. Animals get their energy by eating other organisms instead, so animal cells don't need the organelle that captures sunlight.",
      },
      {
        id: "biology-cell-organelles-explain-002",
        question: "Why does it make sense that ribosomes, rough ER, and the Golgi apparatus are often described together as a \"production line\"?",
        answer:
          "Each one hands off work to the next: ribosomes build the protein, the rough ER folds and processes it, and the Golgi apparatus packages and ships the finished result — the same protein passes through all three in sequence, like stations on a production line.",
      },
      {
        id: "biology-cell-organelles-explain-003",
        question: "Why do plant cells need both a rigid cell wall and a large central vacuole to stay firm, rather than just one or the other?",
        answer:
          "They provide firmness in two different ways: the cell wall is a rigid outer structure that resists being crushed from outside, while the water-filled central vacuole pushes outward from the inside to keep the cell plump. A plant wilts when the vacuole loses water pressure, even though the cell wall is still intact — showing both are needed together.",
      },
      {
        id: "biology-cell-organelles-explain-004",
        question: "Why is the nucleolus described as being inside the nucleus rather than as its own separate organelle?",
        answer:
          "The nucleolus is a dense region within the nucleus itself, specialized for building ribosomes — it doesn't have its own separate membrane the way the nucleus or mitochondria do, so it's treated as a structure inside the nucleus rather than a standalone organelle.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "biology-cell-organelles",
  },

  // -------------------------------------------------------------
  // CHALLENGE — Cell Explorer Organelle Challenge
  // -------------------------------------------------------------
  challenge: {
    intro:
      "For each structure below, find it in the Cell Explorer, read its function, then answer the question about it. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "biology-cell-organelles-challenge-001",
        title: "Cell Explorer Challenge: Nucleus",
        scenario: "Find the organelle that stores the cell's DNA and directs its activities.",
        objective: "Identify which organelle this description matches.",
        tools: [{ id: "cell-explorer-nucleus", label: "Nucleus hotspot (Animal or Plant Cell view)" }],
        answer: {
          mode: "choice",
          options: [
            { id: "nucleus", label: "Nucleus" },
            { id: "mitochondria", label: "Mitochondria" },
            { id: "golgi", label: "Golgi apparatus" },
            { id: "ribosomes", label: "Ribosomes" },
          ],
          correctOptionId: "nucleus",
        },
        explanation: "The nucleus stores the cell's DNA and directs all of its activities — often called the cell's control center.",
        hints: ["Which organelle is often called the \"control center\" of the cell?"],
      },
      {
        id: "biology-cell-organelles-challenge-002",
        title: "Cell Explorer Challenge: Mitochondria",
        scenario: "Find the organelle nicknamed the \"powerhouse of the cell.\"",
        objective: "Identify which organelle this description matches.",
        tools: [{ id: "cell-explorer-mitochondria", label: "Mitochondria hotspot (Animal or Plant Cell view)" }],
        answer: {
          mode: "choice",
          options: [
            { id: "mitochondria", label: "Mitochondria" },
            { id: "chloroplast", label: "Chloroplast" },
            { id: "nucleus", label: "Nucleus" },
            { id: "vacuole", label: "Large central vacuole" },
          ],
          correctOptionId: "mitochondria",
        },
        explanation: "Mitochondria produce the energy the cell runs on — that's why they're nicknamed the \"powerhouse of the cell.\"",
        hints: ["What is this organelle's famous nickname?"],
      },
      {
        id: "biology-cell-organelles-challenge-003",
        title: "Cell Explorer Challenge: Ribosomes",
        scenario: "Find the tiny structures responsible for building the proteins a cell needs.",
        objective: "Identify which organelle this description matches.",
        tools: [{ id: "cell-explorer-ribosomes", label: "Ribosomes hotspot (Animal or Plant Cell view)" }],
        answer: {
          mode: "choice",
          options: [
            { id: "ribosomes", label: "Ribosomes" },
            { id: "golgi", label: "Golgi apparatus" },
            { id: "smooth-er", label: "Smooth endoplasmic reticulum" },
            { id: "cytoplasm", label: "Cytoplasm" },
          ],
          correctOptionId: "ribosomes",
        },
        explanation: "Ribosomes build the proteins the cell needs to function — a single busy cell can contain millions of them at once.",
        hints: ["This organelle can number in the millions inside just one busy cell."],
      },
      {
        id: "biology-cell-organelles-challenge-004",
        title: "Cell Explorer Challenge: Golgi Apparatus",
        scenario: "Find the organelle that packages and ships proteins to wherever they're needed in the cell.",
        objective: "Identify which organelle this description matches.",
        tools: [{ id: "cell-explorer-golgi", label: "Golgi apparatus hotspot (Animal or Plant Cell view)" }],
        answer: {
          mode: "choice",
          options: [
            { id: "golgi", label: "Golgi apparatus" },
            { id: "rough-er", label: "Rough endoplasmic reticulum" },
            { id: "nucleolus", label: "Nucleolus" },
            { id: "ribosomes", label: "Ribosomes" },
          ],
          correctOptionId: "golgi",
        },
        explanation: "The Golgi apparatus packages and ships proteins to wherever they're needed in the cell — think of it as the cell's post office.",
        hints: ["Which organelle is often compared to a post office?"],
      },
      {
        id: "biology-cell-organelles-challenge-005",
        title: "Cell Explorer Challenge: Chloroplast",
        scenario: "In the Plant Cell view, find the organelle that captures sunlight for photosynthesis.",
        objective: "Identify which organelle this description matches, and note that it doesn't appear in the Animal Cell view.",
        tools: [{ id: "cell-explorer-chloroplast", label: "Chloroplast hotspot (Plant Cell view only)" }],
        answer: {
          mode: "choice",
          options: [
            { id: "chloroplast", label: "Chloroplast" },
            { id: "vacuole", label: "Large central vacuole" },
            { id: "cell-wall", label: "Cell wall" },
            { id: "mitochondria", label: "Mitochondria" },
          ],
          correctOptionId: "chloroplast",
        },
        explanation: "The chloroplast captures sunlight and turns it into food through photosynthesis — its green color comes from chlorophyll, and it only appears in plant cells.",
        hints: ["Its green color comes from the light-absorbing pigment it contains."],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "biology",
      topicSlug: "cell-structure-organization",
      label: "Cell Structure & Organization",
      href: "/dashboard/biology/cell-structure-organization",
      reason: "Covers the basic boundary/cytoplasm/genetic-material organization these organelles fit into.",
    },
  ],
};
