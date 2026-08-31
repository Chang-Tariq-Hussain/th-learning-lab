import type { TopicContent } from "../types";

/**
 * What Is a Cell? — Biology Batch 1 ("Cell Biology Foundations"),
 * topic 1 of 3 (see `@/features/learning-path/data/biology-cell-foundations`).
 *
 * This is the introductory topic: what a cell is, why it's the basic
 * unit of life, and unicellular vs multicellular organisms. There is
 * no dedicated simulation for this level of the concept, and per the
 * batch's scope one wasn't built — instead this topic's Explore step
 * reuses the existing Interactive Cell Explorer
 * (`@/features/subjects/biology/cell-explorer`), framed as a first,
 * light encounter ("notice a cell has a boundary and many working
 * parts inside") rather than the organelle-by-organelle study that
 * Topic 3 (Cell Organelles) covers in depth. `practice.quizId` points
 * at a new, dedicated 12-question bank
 * (`@/features/quiz-engine/data/biology-what-is-a-cell-quiz.ts`).
 */
export const biologyWhatIsACellContent: TopicContent = {
  subjectSlug: "biology",
  topicSlug: "what-is-a-cell",
  title: "What Is a Cell?",
  subjectLabel: "Biology",
  topicLabel: "Cell Structure",
  colorToken: "biology",
  simulationHref: "/dashboard/biology/what-is-a-cell",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Define a cell and explain why it's considered the basic unit of life.",
      "List characteristics that living cells share.",
      "Distinguish unicellular organisms from multicellular organisms, with examples of each.",
      "Explain what cell specialization means in a multicellular organism.",
    ],
    concepts: [
      {
        term: "Cell",
        explanation:
          "The smallest structure that can carry out all the basic functions of life on its own — taking in energy, growing, responding to its surroundings, and reproducing. Every living thing is built from one or more cells.",
      },
      {
        term: "The basic unit of life",
        explanation:
          "Cells are called the \"basic unit of life\" because they're the smallest level of organization where something can actually be considered alive. Break a cell apart into smaller pieces and none of those pieces are alive on their own anymore.",
      },
      {
        term: "Unicellular organisms",
        explanation:
          "Organisms made of just a single cell, which handles every job needed to stay alive by itself — feeding, responding, and reproducing. Bacteria and amoebas are classic examples.",
      },
      {
        term: "Multicellular organisms",
        explanation:
          "Organisms made of many cells working together, often billions of them. Instead of one cell doing every job, different groups of cells take on different jobs — this is where cell specialization comes in.",
      },
      {
        term: "Cell specialization",
        explanation:
          "In a multicellular organism, different cells develop different shapes and jobs to do one task especially well — a nerve cell is shaped for carrying signals, a red blood cell for carrying oxygen. No single cell tries to do everything.",
      },
    ],
    whyItMatters:
      "Every living thing you can name — from a single bacterium to a blue whale — is built from cells. Understanding what a cell is and how it counts as \"alive\" is the starting point for everything else in biology: how your body grows, how diseases spread, how a plant makes its own food, and how a single fertilized egg becomes a whole animal made of trillions of specialized cells.",
    keyTerms: [
      { term: "Organism", definition: "Any individual living thing, whether it's built from one cell or many." },
      { term: "Unicellular", definition: "\"Uni-\" means one — an organism made of a single cell." },
      { term: "Multicellular", definition: "\"Multi-\" means many — an organism made of many cells." },
      { term: "Specialization", definition: "A cell developing a specific shape and job rather than doing every job generally." },
    ],
    misconceptions: [
      {
        id: "misconception-cells-all-same",
        misconception: "All cells look and work the same way.",
        correction:
          "Cells come in an enormous range of shapes and sizes suited to their job — a nerve cell is long and thin to carry signals over distance, while a red blood cell is a small flexible disc built to squeeze through tiny blood vessels. Even within one organism, cells vary a lot.",
      },
      {
        id: "misconception-unicellular-simple",
        misconception: "Unicellular organisms are too simple to really be \"alive\" the way animals are.",
        correction:
          "A single-celled organism still does everything life requires — it feeds itself, responds to its environment, and reproduces — using only one cell to do it. That's not simpler in the sense of \"less alive\"; that one cell is just handling every job by itself instead of dividing the work among many cells.",
      },
      {
        id: "misconception-bigger-organism-bigger-cells",
        misconception: "A bigger organism, like an elephant, must be made of bigger cells than a smaller organism, like a mouse.",
        correction:
          "An elephant isn't built from giant cells — it simply has vastly more cells than a mouse does. Cell size stays roughly similar across most organisms; it's the cell count that scales up.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Predict first, then check your thinking in the Cell Explorer below.",
    scenarios: [
      {
        id: "biology-what-is-a-cell-predict-001",
        scenario: "A drop of pond water is placed under a microscope. A single round organism is seen moving around and feeding entirely on its own, with no other cells attached to it.",
        question: "Is this organism most likely unicellular or multicellular?",
        options: [
          { id: "unicellular", label: "Unicellular" },
          { id: "multicellular", label: "Multicellular" },
        ],
        actualResultOptionId: "unicellular",
        explanation:
          "An organism made of a single cell that independently feeds, moves, and survives on its own is unicellular — everything it needs to do to stay alive happens inside that one cell.",
        hint: "Count how many separate cells are described.",
      },
      {
        id: "biology-what-is-a-cell-predict-002",
        scenario: "You look at a tiny piece broken off from a single cell — too small to be a whole cell itself.",
        question: "Is this fragment still considered alive on its own?",
        options: [
          { id: "no", label: "No — it's no longer a living unit" },
          { id: "yes", label: "Yes — anything from a cell is still alive" },
        ],
        actualResultOptionId: "no",
        explanation:
          "The cell is the smallest unit that can carry out life's functions on its own. A fragment smaller than a whole cell can't perform all those functions by itself, so it isn't considered a living unit.",
        hint: "Think about what makes something count as \"the basic unit of life.\"",
      },
      {
        id: "biology-what-is-a-cell-predict-003",
        scenario: "A human body contains a nerve cell built to carry signals over long distances, and a red blood cell built to carry oxygen through narrow vessels — very different shapes for very different jobs.",
        question: "What does this difference in shape best demonstrate?",
        options: [
          { id: "specialization", label: "Cell specialization" },
          { id: "unicellular-life", label: "That the body is unicellular" },
          { id: "mistake", label: "A developmental error" },
        ],
        actualResultOptionId: "specialization",
        explanation:
          "Different cells taking on different shapes to do one job especially well — rather than every cell trying to do everything — is exactly what cell specialization means.",
        hint: "Which key term describes cells developing different shapes for different jobs?",
      },
      {
        id: "biology-what-is-a-cell-predict-004",
        scenario: "An elephant is compared to a mouse. The elephant is far larger overall.",
        question: "Are the elephant's individual cells much bigger than the mouse's individual cells?",
        options: [
          { id: "no-more-cells", label: "No — the elephant just has far more cells" },
          { id: "yes-bigger-cells", label: "Yes — its cells are proportionally larger" },
        ],
        actualResultOptionId: "no-more-cells",
        explanation:
          "Cell size stays roughly similar across most organisms. A larger organism is built from a much larger number of similarly-sized cells, not from bigger cells.",
        hint: "Does organism size scale by cell size, or by cell count?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Open the Cell Explorer below and take a first look at the Animal Cell view.",
      "Notice the outer boundary holding everything together, and the many small structures filling the inside.",
      "Click a few different structures just to see how many distinct parts one single cell contains.",
      "Switch to the Plant Cell view and compare — it's still one single cell, just with a few extra parts.",
    ],
    tryThis: [
      "Count roughly how many different clickable structures you can find inside just one cell.",
      "Based on what you see, does a single cell look \"simple,\" or does it look like it has a lot going on inside it?",
      "You'll return to this same Cell Explorer in the next two topics to learn what every one of these structures actually does.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "biology-what-is-a-cell-explain-001",
        question: "Why is the cell called the \"basic unit of life\" instead of, say, an organ or a molecule?",
        answer:
          "A molecule is too small to carry out life's functions on its own, and an organ is already made of many cells. The cell sits at exactly the smallest level where something can independently feed, respond, and reproduce — which is why it's the basic unit of life.",
      },
      {
        id: "biology-what-is-a-cell-explain-002",
        question: "Why doesn't a unicellular organism need cell specialization the way a multicellular organism does?",
        answer:
          "A unicellular organism only has one cell to work with, so that single cell has to handle every job itself. Specialization only becomes useful once there are many cells available to divide the work between — which is exactly the multicellular situation.",
      },
      {
        id: "biology-what-is-a-cell-explain-003",
        question: "Why might a single fertilized egg cell eventually produce hundreds of differently shaped, differently specialized cell types?",
        answer:
          "As that one starting cell divides again and again, different groups of the resulting cells take on different specialized jobs — some become nerve cells, some become muscle cells, and so on — which is how one starting cell becomes a whole multicellular organism with many specialized cell types.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "biology-what-is-a-cell",
  },

  relatedTopics: [
    {
      subjectSlug: "biology",
      topicSlug: "cell-structure-organization",
      label: "Cell Structure & Organization",
      href: "/dashboard/biology/cell-structure-organization",
      reason: "Builds on \"what a cell is\" by looking at the actual structures every cell is built from.",
    },
  ],
};
