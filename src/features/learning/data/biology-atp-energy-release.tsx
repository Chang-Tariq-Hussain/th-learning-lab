import type { TopicContent } from "../types";

/**
 * ATP & Energy Release — Biology Batch 2 ("Cellular Energy & Life
 * Processes"), topic 5 of 6 (see
 * `@/features/learning-path/data/biology-cell-foundations`).
 *
 * Reuses the same Cellular Respiration simulation as Topic 4 — not a
 * new "ATP visualization." The brief's rule 19 says to reuse an
 * existing ATP/energy visualization if one exists; the simulation's
 * own `EnergyBar` component *is* that visualization (it's what
 * represents ATP becoming available as the mitochondrion releases
 * energy). Rather than building a second, parallel "ATP simulator,"
 * this topic revisits the identical simulation with its lesson
 * content and Explore guidance shifted to focus specifically on the
 * Energy bar / ATP step and where that energy goes afterward —
 * active transport, movement, building molecules — building on Topic
 * 4's full-process lesson instead of repeating it. No new simulation
 * was built for this topic.
 *
 * `practice.quizId` points at a new, dedicated 15-question bank
 * (`@/features/quiz-engine/data/biology-atp-energy-release-quiz.ts`),
 * since this topic tests different material (ATP's role and its
 * connections) than Topic 4's full-process quiz.
 */
export const biologyAtpEnergyReleaseContent: TopicContent = {
  subjectSlug: "biology",
  topicSlug: "atp-energy-release",
  title: "ATP & Energy Release",
  subjectLabel: "Biology",
  topicLabel: "Cell Structure",
  colorToken: "biology",
  simulationHref: "/dashboard/biology/atp-energy-release",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Explain ATP's role as a cell's immediate energy carrier.",
      "Explain how ATP relates to glucose and cellular respiration.",
      "Name examples of cellular work ATP powers.",
      "Explain why ATP is continually used and regenerated, rather than a fixed one-time supply.",
    ],
    concepts: [
      {
        term: "ATP as an energy carrier",
        explanation:
          "ATP is the molecule cells commonly use as an immediate, spendable energy carrier — first introduced back in Introduction to Cellular Energy. It's the form of energy a cell's own machinery is built to run on.",
      },
      {
        term: "Why cells use ATP",
        explanation:
          "A cell's machinery doesn't run on glucose directly — it runs on ATP. Cellular respiration (Topic 4) is what converts the chemical energy stored in glucose into this usable form.",
        formula: "\\text{Glucose} \\rightarrow \\text{Cellular Respiration} \\rightarrow \\text{ATP} \\rightarrow \\text{Cellular Work}",
        formulaCaption: "From stored energy to cellular work",
      },
      {
        term: "ATP powering cellular work",
        explanation:
          "ATP's energy gets spent on a range of jobs: active transport, movement, building larger molecules out of smaller ones, and maintaining ongoing cellular processes.",
      },
      {
        term: "ATP and active transport",
        explanation:
          "Active transport, from Batch 1, moves substances against their concentration gradient — unlike diffusion, that takes energy. ATP is the form of energy a cell typically spends to do it.",
      },
      {
        term: "Used and regenerated, not a permanent battery",
        explanation:
          "ATP isn't a one-time charge that lasts a cell's whole life. It's continually spent on cellular work and continually regenerated through cellular respiration — closer to a rechargeable battery in constant use than a fixed, permanent supply.",
      },
    ],
    whyItMatters:
      "Every energy-requiring activity a cell carries out — including active transport, which Batch 1 flagged as needing energy without yet explaining where that energy comes from — ultimately runs on ATP. Understanding that ATP is continually spent and remade also sets up an important idea for later topics: a cell's energy supply is a constant cycle, not a stockpile it slowly drains.",
    keyTerms: [
      { term: "Energy carrier", definition: "A molecule, like ATP, that transports usable energy from where it's released to where it's spent." },
      { term: "Regeneration", definition: "Remaking a spent resource — here, cellular respiration regenerating ATP after it's used." },
    ],
    misconceptions: [
      {
        id: "misconception-atp-permanent-battery",
        misconception: "Once a cell makes ATP, that supply lasts indefinitely, like a battery charged once and never needing to be recharged.",
        correction:
          "ATP is continually used and regenerated. A cell doesn't run on a single, fixed supply — it constantly spends ATP on ongoing work and constantly makes more through cellular respiration.",
      },
      {
        id: "misconception-atp-only-active-transport",
        misconception: "ATP is only ever used for active transport, and nothing else.",
        correction:
          "Active transport is one clear example, but ATP's energy is spent on a range of cellular work, including movement and building larger molecules out of smaller ones.",
      },
      {
        id: "misconception-glucose-and-atp-same",
        misconception: "Glucose and ATP are essentially the same thing, just called by different names.",
        correction:
          "Glucose is the longer-term stored energy source; ATP is the immediate, spendable form a cell converts it into through cellular respiration. They're related, not interchangeable — a cell doesn't spend glucose directly.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Predict first, then confirm by running the simulation below.",
    scenarios: [
      {
        id: "biology-atp-energy-release-predict-001",
        scenario: "A cell has just used up the ATP it had available on an energy-requiring task.",
        question: "What happens to the cell's ATP supply after that?",
        options: [
          { id: "regenerated-via-respiration", label: "It gets regenerated, mainly through cellular respiration" },
          { id: "gone-forever", label: "It's gone forever — the cell can never make more ATP" },
          { id: "instantly-refills-from-nothing", label: "It refills instantly from nothing, with no process required" },
        ],
        actualResultOptionId: "regenerated-via-respiration",
        explanation: "ATP is continually used and regenerated — cellular respiration is the process that remakes a cell's ATP supply after it's spent.",
        hint: "What process, covered in the previous topic, produces ATP?",
      },
      {
        id: "biology-atp-energy-release-predict-002",
        scenario: "You're about to press Start on the same Cellular Respiration simulation from Topic 4. This time, focus on the Energy bar specifically.",
        question: "What will the Energy bar represent as it fills?",
        options: [
          { id: "atp-becoming-available", label: "Usable energy (ATP) becoming available to the cell" },
          { id: "amount-of-glucose-remaining", label: "How much glucose is left in the cell" },
          { id: "unrelated-to-atp", label: "Something unrelated to ATP" },
        ],
        actualResultOptionId: "atp-becoming-available",
        explanation: "The Energy bar filling represents usable energy — conceptually, ATP — becoming available to the cell to spend on its work.",
        hint: "What did Topic 4 say the Energy bar represents?",
      },
      {
        id: "biology-atp-energy-release-predict-003",
        scenario: "Recall Active Transport from Batch 1: moving substances against their concentration gradient, unlike diffusion.",
        question: "What form of energy does active transport most directly spend?",
        options: [
          { id: "atp-spent", label: "ATP" },
          { id: "glucose-spent-directly", label: "Glucose, spent directly with no conversion" },
          { id: "no-energy-needed", label: "No energy is actually needed" },
        ],
        actualResultOptionId: "atp-spent",
        explanation: "ATP is the form of energy a cell typically spends on active transport — exactly why active transport requires energy in the first place.",
        hint: "What's the cell's immediate, spendable form of energy?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Press Start and this time, follow the energy specifically: watch where it begins, and where it ends up.",
      "Notice the Energy bar filling once glucose and oxygen reach the mitochondrion — this is the ATP-becoming-available step.",
      "Notice that the bar stays full afterward rather than draining — a simplified way of showing energy has been made available, not a full accounting of every ATP molecule made and spent.",
      "Reread the connection note, this time focusing on what happens to that energy next, beyond this one scene.",
    ],
    tryThis: [
      "⚡ ATP Mission — Follow the energy: (1) Identify where stored chemical energy begins. (2) Identify how it becomes available to the cell. (3) Identify ATP. (4) Identify a cellular process that uses ATP. (5) Explain why ATP is important.",
      "Before pressing Start, predict exactly when the Energy bar will begin to fill.",
      "After it finishes, name one specific example of cellular work this energy could go on to power.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "biology-atp-energy-release-explain-001",
        question: "Why doesn't the simulation show the Energy bar draining back down after it fills?",
        answer:
          "The simulation is a simplified way to show that usable energy has been released and made available — not a full accounting of every ATP molecule made and individually spent afterward. In a real cell, that available energy would then be spent on various jobs, which is what the ATP Mission above asks you to reason through.",
      },
      {
        id: "biology-atp-energy-release-explain-002",
        question: "Why is it more accurate to describe ATP as 'continually used and regenerated' rather than as a permanent battery?",
        answer:
          "A cell doesn't make one fixed batch of ATP that lasts indefinitely. It constantly spends ATP on ongoing work and constantly remakes more through cellular respiration — an ongoing cycle rather than a one-time charge.",
      },
      {
        id: "biology-atp-energy-release-explain-003",
        question: "How does this topic finally answer a question Batch 1 left open about active transport?",
        answer:
          "Batch 1 established that active transport requires energy, without fully explaining where that energy comes from. This topic makes the answer explicit: ATP, produced through cellular respiration, is the form of energy active transport spends.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "biology-atp-energy-release",
  },

  // -------------------------------------------------------------
  // CHALLENGE — Follow-the-energy mission
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Run the simulation above, then answer each question, following the energy from start to finish.",
    scenarios: [
      {
        id: "biology-atp-energy-release-challenge-001",
        title: "Where Stored Energy Begins",
        scenario: "Before pressing Start, look at what's positioned near the cell.",
        objective: "Identify which of the two inputs is the source of stored chemical energy.",
        tools: [{ id: "atp-energy-release-scene", label: "Cell scene, before pressing Start" }],
        requiresExperiment: false, // Explore above already embeds the live simulation on this page — a second copy would be redundant.
        answer: {
          mode: "choice",
          options: [
            { id: "glucose-source", label: "Glucose" },
            { id: "oxygen-source", label: "Oxygen" },
            { id: "co2-source", label: "Carbon dioxide" },
          ],
          correctOptionId: "glucose-source",
        },
        explanation: "Glucose is the molecule storing chemical energy — oxygen is needed for the reaction to proceed, but it isn't itself the energy source.",
        hints: ["Which of the two inputs stores energy in its chemical bonds?"],
      },
      {
        id: "biology-atp-energy-release-challenge-002",
        title: "Identify ATP",
        scenario: "Press Start and watch the Energy bar as glucose and oxygen reach the mitochondrion.",
        objective: "Identify what the Energy bar filling represents.",
        tools: [{ id: "atp-energy-release-bar", label: "Energy bar, during and after the run" }],
        requiresExperiment: false, // Explore above already embeds the live simulation on this page — a second copy would be redundant.
        answer: {
          mode: "choice",
          options: [
            { id: "atp-available", label: "Usable energy (ATP) becoming available to the cell" },
            { id: "co2-produced-bar", label: "The amount of carbon dioxide produced" },
            { id: "unrelated-bar", label: "Something unrelated to energy" },
          ],
          correctOptionId: "atp-available",
        },
        explanation: "The Energy bar represents usable energy — conceptually, ATP — becoming available to the cell once respiration has taken place.",
        hints: ["What did Topic 4's Cellular Respiration lesson say this bar stands for?"],
      },
      {
        id: "biology-atp-energy-release-challenge-003",
        title: "A Process That Uses ATP",
        scenario: "Recall active transport from Batch 1 — moving substances against their concentration gradient.",
        objective: "Identify why active transport is a process that requires ATP specifically.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "against-gradient-needs-energy", label: "It moves substances against their gradient, which takes energy that ATP supplies" },
            { id: "diffusion-similarity", label: "It works exactly like diffusion, so it needs no extra energy" },
            { id: "atp-unrelated-active-transport", label: "Active transport doesn't actually use ATP" },
          ],
          correctOptionId: "against-gradient-needs-energy",
        },
        explanation: "Active transport moves substances against their concentration gradient — unlike diffusion, that takes energy, and ATP is the form of energy a cell typically spends to do it.",
        hints: ["What makes active transport different from diffusion?"],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "biology",
      topicSlug: "cellular-respiration",
      label: "Cellular Respiration",
      href: "/dashboard/biology/cellular-respiration",
      reason: "Covers the full process that produces the ATP this topic focuses on.",
    },
    {
      subjectSlug: "biology",
      topicSlug: "active-transport",
      label: "Active Transport",
      href: "/dashboard/biology/active-transport",
      reason: "The energy-requiring process this topic explains the energy source for.",
    },
    {
      subjectSlug: "biology",
      topicSlug: "photosynthesis-vs-respiration",
      label: "Photosynthesis vs Cellular Respiration",
      href: "/dashboard/biology/photosynthesis-vs-respiration",
      reason: "Connects the energy story this topic tells back to where the glucose came from in the first place.",
    },
  ],
};
