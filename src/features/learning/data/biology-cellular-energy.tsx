import type { TopicContent } from "../types";

/**
 * Introduction to Cellular Energy — Biology Batch 2. Uses the dedicated Introduction to Cellular Energy
 * laboratory (`@/features/subjects/biology/cellular-energy`): an animated energy-system cell, transformation explorer,
 * catabolism/anabolism comparison, ATP-as-currency link to the ATP lab and an Energy Flow Challenge.
 * `practice.quizId` points at the dedicated 30-question bank (`biology-cellular-energy`).
 */
export const biologyCellularEnergyContent: TopicContent = {
  subjectSlug: "biology",
  topicSlug: "cellular-energy",
  title: "Introduction to Cellular Energy",
  subjectLabel: "Biology",
  topicLabel: "Cell Structure",
  colorToken: "biology",
  simulationHref: "/dashboard/biology/cellular-energy",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Explain why cells need a constant supply of energy.",
      "Describe where a cell's energy ultimately comes from.",
      "Explain what ATP is and why cells use it as an immediate energy carrier.",
      "Connect cellular energy to a process already studied: active transport.",
    ],
    concepts: [
      {
        term: "Why cells need energy",
        explanation:
          "A cell isn't idle — it's constantly building molecules, moving substances across its membrane, and carrying out repair and growth. None of that happens for free: every one of those jobs requires a usable supply of energy, the same way a car needs fuel to run rather than just to exist.",
      },
      {
        term: "Where the energy comes from",
        explanation:
          "Food molecules — like glucose — store chemical energy in their bonds. A cell doesn't use that stored energy directly; it has to convert it into a form it can actually spend, the same way a bank note has to be converted into coins before it works in a vending machine.",
      },
      {
        term: "Energy conversion in cells",
        explanation:
          "Cells break down food molecules and capture some of the energy that's released in a more immediately usable form. This is a conversion, not a creation — energy isn't manufactured from nothing, it's transferred from the food molecule into a form the cell can spend on its own activities.",
      },
      {
        term: "ATP (adenosine triphosphate)",
        explanation:
          "ATP is the molecule cells commonly use as an immediate energy carrier — think of it as the cell's spendable \"coin\" rather than its long-term savings. When a cell needs energy for a job right now, it's very often ATP supplying it.",
        formula: "\\text{Energy source} \\;\\rightarrow\\; \\text{ATP} \\;\\rightarrow\\; \\text{Cellular work}",
        formulaCaption: "Energy flow through a cell, simplified",
      },
      {
        term: "Cellular work ATP powers",
        explanation:
          "ATP's energy gets spent on many different jobs: moving the cell or substances within it, transporting materials across the membrane, and building larger molecules out of smaller ones. Different job, same currency.",
      },
    ],
    whyItMatters:
      "Every visible thing a living cell does — growing, moving, repairing itself, pumping substances where they're needed — is paid for with energy. Understanding that energy has to be converted into a usable form (ATP) before a cell can spend it is the idea the next two topics, Photosynthesis and its factors, build directly on: photosynthesis is how a plant cell first captures energy from sunlight into a food molecule in the first place.",
    keyTerms: [
      { term: "ATP", definition: "Adenosine triphosphate — the molecule cells commonly use as an immediate, spendable form of energy." },
      { term: "Chemical energy", definition: "Energy stored in the bonds of a molecule, like glucose, that's released when those bonds are broken." },
      { term: "Energy conversion", definition: "Changing energy from one form or carrier into another — here, from the chemical energy in food into ATP." },
    ],
    misconceptions: [
      {
        id: "misconception-cells-use-food-directly",
        misconception: "Cells use the energy in food molecules directly, without converting it into anything else.",
        correction:
          "Cells convert the chemical energy stored in food molecules into ATP first. ATP, not the food molecule itself, is what actually powers most of a cell's immediate activities.",
      },
      {
        id: "misconception-atp-only-source",
        misconception: "ATP is the only form of energy that exists inside a cell.",
        correction:
          "ATP is the most common immediate energy carrier a cell spends, but it isn't the only form of energy present — food molecules still store their own chemical energy until it's converted, for instance. ATP is best understood as the cell's spendable currency, not its only asset.",
      },
      {
        id: "misconception-energy-created",
        misconception: "Cells create new energy out of nothing when they need it.",
        correction:
          "Cells don't create energy — they convert energy that already exists (chemical energy stored in food) into a more immediately usable form (ATP). The total amount of energy isn't increasing; it's changing form.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT / EXPLORE / EXPLAIN
  // -------------------------------------------------------------
  predict: {
    intro: "Commit to a prediction, then check it in the cellular energy system above.",
    scenarios: [
      {
        id: "biology-cellular-energy-predict-001",
        scenario: "In the Energy system section a nutrient molecule is about to enter the cell.",
        question: "Where is the energy stored in that molecule?",
        options: [
          { id: "bonds", label: "In its chemical bonds (chemical energy)" },
          { id: "heat", label: "As heat" },
          { id: "none", label: "It stores no energy" },
        ],
        actualResultOptionId: "bonds",
        explanation: "Nutrients such as glucose store chemical energy in the arrangement of their atoms and bonds.",
        hint: "What type of energy does food contain?",
      },
      {
        id: "biology-cellular-energy-predict-002",
        scenario: "The animation reaches the ATP step.",
        question: "Part of the released energy is captured in ATP. What happens to the rest?",
        options: [
          { id: "heat", label: "It is released as heat" },
          { id: "destroyed", label: "It is destroyed" },
          { id: "created", label: "It becomes new energy" },
        ],
        actualResultOptionId: "heat",
        explanation: "Energy is conserved. Whatever is not captured in ATP or used for work is released as heat.",
        hint: "Can energy be destroyed?",
      },
      {
        id: "biology-cellular-energy-predict-003",
        scenario: "In the Metabolism section you choose Anabolism.",
        question: "Will the building-up process require or release free energy?",
        options: [
          { id: "require", label: "Require it (coupled to ATP)" },
          { id: "release", label: "Release it" },
          { id: "neither", label: "Neither" },
        ],
        actualResultOptionId: "require",
        explanation: "Anabolic reactions build larger molecules and need an energy input, which ATP hydrolysis provides.",
        hint: "Which direction is more ordered: small pieces or one large molecule?",
      },
    ],
  },
  explore: {
    howToUse: [
      "Open Energy system and press Play. Follow nutrients, mitochondria, ATP and cellular work through five steps.",
      "Select the nutrient, mitochondrion, ATP, cellular work and heat in the picture to read what each does.",
      "In Transformations, click each of the five boxes and switch the free-energy diagram between alone and coupled.",
      "In Metabolism, compare catabolism and anabolism side by side.",
      "In ATP currency, step through production, hydrolysis, recycling and coupling, then open the ATP & Energy Release lab.",
    ],
    tryThis: [
      "Before step 4, predict what share of the energy goes to heat.",
      "Decide for ten processes whether each releases or requires free energy.",
      "Explain how a cell can build a protein even though building needs energy.",
    ],
  },
  explain: {
    questions: [
      {
        id: "biology-cellular-energy-explain-001",
        question: "Why do we say cells transform energy rather than make it?",
        answer:
          "Energy is conserved. Cells change chemical energy in nutrients into ATP, work and heat.",
      },
      {
        id: "biology-cellular-energy-explain-002",
        question: "What is the difference between catabolism and anabolism?",
        answer:
          "Catabolism breaks large molecules into smaller ones and usually releases free energy; anabolism builds large molecules from small ones and requires free energy.",
      },
      {
        id: "biology-cellular-energy-explain-003",
        question: "Why do cells use ATP as an energy currency?",
        answer:
          "ATP couples energy-releasing reactions to energy-requiring ones: it is made where energy is released and spent where work is done, then recycled as ADP and Pi.",
      },
    ],
  },


  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "biology-cellular-energy",
  },

  // -------------------------------------------------------------
  // CHALLENGE
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Use the lab above to answer each question.",
    scenarios: [
      {
        id: "biology-cellular-energy-challenge-001",
        title: "Source of energy",
        scenario: "Look at the first step of the energy flow.",
        objective: "Identify where the energy that is eventually used comes from.",
        requiresExperiment: false, // the live lab is already embedded in Explore above
        answer: {
          mode: "choice",
          options: [
            { id: "nutrients", label: "Chemical energy stored in nutrient molecules" },
            { id: "atp-first", label: "ATP made from nothing" },
            { id: "heat-first", label: "Heat from the cell" },
          ],
          correctOptionId: "nutrients",
        },
        explanation: "Energy starts as chemical energy in nutrients.",
        hints: ["What enters the cell at the start?"],
      },
      {
        id: "biology-cellular-energy-challenge-002",
        title: "Where does it go?",
        scenario: "Watch the heat symbol.",
        objective: "Identify what happens to energy not captured in ATP.",
        requiresExperiment: false, // the live lab is already embedded in Explore above
        answer: {
          mode: "choice",
          options: [
            { id: "lost-heat", label: "Released as heat" },
            { id: "destroyed", label: "Destroyed" },
            { id: "stored-co2", label: "Stored in CO₂" },
          ],
          correctOptionId: "lost-heat",
        },
        explanation: "Energy is conserved; the uncaptured part is dissipated as heat.",
        hints: ["Which symbol appears in steps 3 to 5?"],
      },
      {
        id: "biology-cellular-energy-challenge-003",
        title: "Release or require?",
        scenario: "In Transformations, compare the two free-energy diagrams.",
        objective: "Decide which reaction type needs ATP coupling.",
        requiresExperiment: false, // the live lab is already embedded in Explore above
        answer: {
          mode: "choice",
          options: [
            { id: "endergonic", label: "Energy-requiring (endergonic) reactions" },
            { id: "exergonic", label: "Energy-releasing (exergonic) reactions" },
            { id: "both-same", label: "Both equally" },
          ],
          correctOptionId: "endergonic",
        },
        explanation: "Endergonic reactions (ΔG > 0) are made possible by coupling to ATP hydrolysis.",
        hints: ["Which diagram goes up?"],
      },
      {
        id: "biology-cellular-energy-challenge-004",
        title: "Catabolic or anabolic?",
        scenario: "In Metabolism, look at the comparison table.",
        objective: "Classify glucose breakdown during cellular respiration.",
        requiresExperiment: false, // the live lab is already embedded in Explore above
        answer: {
          mode: "choice",
          options: [
            { id: "catabolic", label: "Catabolic — it breaks a large molecule down and releases energy" },
            { id: "anabolic", label: "Anabolic — it builds a large molecule" },
            { id: "neither", label: "Neither" },
          ],
          correctOptionId: "catabolic",
        },
        explanation: "Glucose is broken down into smaller molecules (CO₂ and H₂O), releasing free energy.",
        hints: ["Is a large molecule being built or broken?"],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "biology",
      topicSlug: "atp-energy-release",
      label: "ATP & Energy Release",
      href: "/dashboard/biology/atp-energy-release",
      reason: "Next in the sequence: ATP's structure, hydrolysis, free energy and energy coupling in detail.",
    },
    {
      subjectSlug: "biology",
      topicSlug: "cellular-respiration",
      label: "Cellular Respiration",
      href: "/dashboard/biology/cellular-respiration",
      reason: "Follows glucose through glycolysis, the citric acid cycle and the electron transport chain to ATP.",
    },
    {
      subjectSlug: "biology",
      topicSlug: "active-transport",
      label: "Active Transport",
      href: "/dashboard/biology/active-transport",
      reason: "The clearest example of cellular work that needs energy — this topic explains the ATP that powers it.",
    },
    {
      subjectSlug: "biology",
      topicSlug: "diffusion-osmosis",
      label: "Diffusion & Osmosis",
      href: "/dashboard/biology/diffusion-osmosis",
      reason: "Diffusion moves particles without energy — active transport, defined against it, is why cells need the ATP this topic introduces.",
    },
    {
      subjectSlug: "biology",
      topicSlug: "photosynthesis",
      label: "Photosynthesis",
      href: "/dashboard/biology/photosynthesis",
      reason: "Photosynthesis is how a plant cell first captures energy into a food molecule — the energy this topic explains cells then convert into ATP.",
    },
  ],
};
