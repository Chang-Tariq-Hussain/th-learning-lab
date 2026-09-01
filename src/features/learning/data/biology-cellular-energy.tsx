import type { TopicContent } from "../types";

/**
 * Introduction to Cellular Energy — Biology Batch 2 ("Cellular Energy
 * & Life Processes"), topic 1 of 3 (see
 * `@/features/learning-path/data/biology-cellular-energy-life-processes`).
 *
 * Reuses the existing Cellular Respiration simulation
 * (`@/features/subjects/biology/cellular-respiration`) as this
 * topic's Explore experience — that simulation already shows exactly
 * what this topic needs (glucose + oxygen enter a cell, the
 * mitochondrion lights up, an Energy bar fills, CO2 and water are
 * produced) and its own doc comment confirms it was deliberately kept
 * simplified with "no glycolysis/Krebs-cycle detail." This topic's
 * authored content stays at that same conceptual altitude — cells
 * need energy, food stores it, cells convert it, ATP is the usable
 * form — and does not teach the full cellular respiration pathway.
 * The dedicated Cellular Respiration *topic* (with its own deeper
 * lesson reusing this same simulation) is future work, not part of
 * this one.
 *
 * `practice.quizId` points at a new, dedicated 15-question bank
 * (`@/features/quiz-engine/data/biology-cellular-energy-quiz.ts`).
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
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Predict first, then confirm by running the experiment below.",
    scenarios: [
      {
        id: "biology-cellular-energy-predict-001",
        scenario: "A cell has plenty of glucose stored, but none of it has been converted into ATP yet.",
        question: "Can the cell immediately use that stored glucose to power a task like moving a substance across its membrane?",
        options: [
          { id: "no-needs-conversion", label: "No — the energy needs to be converted into a usable form like ATP first" },
          { id: "yes-directly", label: "Yes — glucose can power cellular work directly, with no conversion needed" },
        ],
        actualResultOptionId: "no-needs-conversion",
        explanation: "Cells convert the chemical energy in food molecules into ATP before spending it — glucose itself isn't the form of energy most cellular work runs on directly.",
        hint: "What did the Learn section say has to happen to food energy before a cell can spend it?",
      },
      {
        id: "biology-cellular-energy-predict-002",
        scenario: "The Cellular Respiration simulation below is about to run: glucose and oxygen are positioned near the cell, and the Energy bar reads empty.",
        question: "What will happen to the Energy bar once you press Start?",
        options: [
          { id: "fills-as-energy-released", label: "It will fill as the cell releases usable energy from glucose" },
          { id: "stays-empty", label: "It will stay empty — the simulation only shows glucose entering, not energy being released" },
          { id: "empties-further", label: "It's already empty and has nowhere further to go" },
        ],
        actualResultOptionId: "fills-as-energy-released",
        explanation: "As glucose and oxygen reach the mitochondrion, the cell releases usable energy — the Energy bar fills to represent that, standing in for ATP being made available to the cell.",
        hint: "What does an empty-to-full bar usually represent in these simulations?",
      },
      {
        id: "biology-cellular-energy-predict-003",
        scenario: "Recall Active Transport from Batch 1: moving substances against their concentration gradient, which — unlike diffusion — requires the cell to spend energy.",
        question: "Where would that spent energy most directly come from?",
        options: [
          { id: "atp", label: "ATP, the cell's immediate energy carrier" },
          { id: "directly-from-sunlight", label: "Sunlight, absorbed directly by the membrane" },
          { id: "no-source-needed", label: "No energy source is actually needed for active transport" },
        ],
        actualResultOptionId: "atp",
        explanation: "Active transport needs energy precisely because it moves substances against their gradient — and ATP is the form of energy a cell typically spends to do that kind of work.",
        hint: "What's the cell's usual \"spendable\" form of energy?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Before pressing anything, notice where glucose and oxygen start, and that the Energy bar reads empty.",
      "Press Start and watch glucose and oxygen travel toward the mitochondrion.",
      "Watch the mitochondrion highlight, and watch the Energy bar fill as usable energy is released.",
      "Notice what else appears once energy has been released: carbon dioxide and water leaving the cell.",
      "Read the connection note comparing this process to photosynthesis — you'll explore photosynthesis itself next.",
    ],
    tryThis: [
      "Before pressing Start, predict what the Energy bar will do.",
      "After it finishes, describe in your own words what the cell converted, and into what.",
      "Compare the two equations in the connection note — what's the same about them, and what's reversed?",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "biology-cellular-energy-explain-001",
        question: "Why can't a cell just use the chemical energy in glucose directly, without converting any of it?",
        answer:
          "A cell's machinery is built to run on ATP, not on glucose itself. Converting glucose's stored energy into ATP puts that energy into a form the cell's existing machinery can actually spend on its immediate jobs.",
      },
      {
        id: "biology-cellular-energy-explain-002",
        question: "The simulation's Energy bar only fills once — it doesn't drain back out afterward. What does that represent?",
        answer:
          "It represents that usable energy has been produced and is now available to the cell, not that it's being spent moment-to-moment in the scene. The simulation is deliberately simplified to show \"energy was released,\" not a full accounting of every ATP molecule made and spent.",
      },
      {
        id: "biology-cellular-energy-explain-003",
        question: "How does this topic connect back to Active Transport from Batch 1?",
        answer:
          "Active transport is defined by needing energy — it's what makes it different from diffusion. This topic explains where that energy ultimately comes from: food molecules are converted, and the resulting ATP is what active transport (and other cellular work) actually spends.",
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
  // CHALLENGE — guided mission on the Cellular Respiration simulation
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Run the simulation above, then answer each question. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "biology-cellular-energy-challenge-001",
        title: "Identify the Inputs",
        scenario: "Before pressing Start, look at what's positioned near the cell, ready to travel toward the mitochondrion.",
        objective: "Identify the two substances the cell is about to use to release energy.",
        tools: [{ id: "cellular-respiration-scene", label: "Cell scene, before pressing Start" }],
        requiresExperiment: false, // Explore above already embeds the live simulation on this page — a second copy would be redundant.
        answer: {
          mode: "choice",
          options: [
            { id: "glucose-oxygen", label: "Glucose and oxygen" },
            { id: "co2-water", label: "Carbon dioxide and water" },
            { id: "atp-adp", label: "ATP and ADP" },
          ],
          correctOptionId: "glucose-oxygen",
        },
        explanation: "Glucose (the stored food energy) and oxygen are the two inputs the cell uses — carbon dioxide and water are what come out afterward.",
        hints: ["Which two substances are shown entering the cell, before anything is produced?"],
      },
      {
        id: "biology-cellular-energy-challenge-002",
        title: "Observe the Energy Release",
        scenario: "Press Start and watch the Energy bar as glucose and oxygen reach the mitochondrion.",
        objective: "Observe what happens to the Energy bar, and connect it to what the cell is doing with the ATP it produces.",
        tools: [{ id: "cellular-respiration-energy-bar", label: "Energy bar, during and after the run" }],
        requiresExperiment: false, // Explore above already embeds the live simulation on this page — a second copy would be redundant.
        answer: {
          mode: "choice",
          options: [
            { id: "fills-represents-atp", label: "It fills, representing usable energy (ATP) the cell can now spend on cellular work" },
            { id: "unrelated", label: "It fills for a reason unrelated to energy" },
            { id: "stays-empty-observed", label: "It stays empty throughout" },
          ],
          correctOptionId: "fills-represents-atp",
        },
        explanation: "The Energy bar filling represents the cell releasing usable energy from glucose — conceptually, this is where ATP becomes available for the cell to spend on jobs like active transport.",
        hints: ["What did the Energy bar do once glucose and oxygen reached the mitochondrion?"],
      },
      {
        id: "biology-cellular-energy-challenge-003",
        title: "Connect to Active Transport",
        scenario: "Recall from Batch 1 that active transport — unlike diffusion — requires the cell to spend energy to move substances against their concentration gradient.",
        objective: "Explain which molecule most directly supplies the energy active transport spends.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "atp-supplies", label: "ATP — the cell's immediate, spendable energy carrier" },
            { id: "glucose-directly-supplies", label: "Glucose, spent directly with no conversion" },
            { id: "co2-supplies", label: "Carbon dioxide, released during the process" },
          ],
          correctOptionId: "atp-supplies",
        },
        explanation: "ATP is the form of energy a cell typically spends on jobs like active transport — this is exactly why active transport requires energy in the first place, while diffusion doesn't.",
        hints: ["What did this topic identify as the cell's immediate, spendable form of energy?"],
      },
    ],
  },

  relatedTopics: [
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
