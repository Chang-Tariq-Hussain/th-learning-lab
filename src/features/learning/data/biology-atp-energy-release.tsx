import type { TopicContent } from "../types";

/**
 * ATP & Energy Release — Biology Batch 2. Uses the dedicated ATP & Energy Release laboratory
 * (`@/features/subjects/biology/atp-energy-release`): a rotatable ATP/ADP model, a stepped hydrolysis animation
 * with free energy and energy coupling, the ATP cycle with regeneration, four cellular-work examples and practice.
 * `practice.quizId` points at the dedicated 30-question bank (`biology-atp-energy-release`).
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
  // PREDICT / EXPLORE / EXPLAIN
  // -------------------------------------------------------------
  predict: {
    intro: "Commit to a prediction, then check it in the ATP laboratory above.",
    scenarios: [
      {
        id: "biology-atp-energy-release-predict-001",
        scenario: "In the Hydrolysis section, ATP is about to react with a water molecule.",
        question: "What will the products be?",
        options: [
          { id: "adp-pi", label: "ADP and inorganic phosphate (Pi)" },
          { id: "amp-glucose", label: "AMP and glucose" },
          { id: "adenine-p3", label: "Adenine and three separate phosphates" },
        ],
        actualResultOptionId: "adp-pi",
        explanation: "ATP + H₂O → ADP + Pi (+ H⁺). Only the terminal phosphate leaves.",
        hint: "How many phosphates does ADP have?",
      },
      {
        id: "biology-atp-energy-release-predict-002",
        scenario: "A student says ATP hydrolysis releases energy 'because the bond breaks'.",
        question: "Which statement is the best correction?",
        options: [
          { id: "net-dg", label: "Breaking bonds costs energy; the overall reaction has a negative ΔG because the products are more stable" },
          { id: "student-right", label: "The student is correct" },
          { id: "only-heat", label: "Hydrolysis releases no free energy, only heat" },
        ],
        actualResultOptionId: "net-dg",
        explanation: "The overall reaction has a negative change in Gibbs free energy (about −30.5 kJ/mol standard; −50 to −65 kJ/mol in cells).",
        hint: "Does breaking a bond release or require energy?",
      },
      {
        id: "biology-atp-energy-release-predict-003",
        scenario: "The ATP cycle section is running with regeneration set to 0 and demand set to 5.",
        question: "What happens to the ATP share of the pool?",
        options: [
          { id: "falls", label: "It falls: ATP is not a long-term store" },
          { id: "rises", label: "It rises" },
          { id: "same", label: "It stays the same" },
        ],
        actualResultOptionId: "falls",
        explanation: "Without an energy input ADP + Pi are not rebuilt into ATP, so the ATP pool is used up.",
        hint: "Is ATP a store or a carrier?",
      },
    ],
  },
  explore: {
    howToUse: [
      "Open the ATP laboratory. Drag the molecule (or use the arrow keys) to rotate it, and use zoom to look closer.",
      "Select adenine, ribose and each phosphate. Use Highlight phosphates to see the terminal phosphate that hydrolysis removes.",
      "Switch to Compare ATP and ADP and note the number of phosphates and the net charge.",
      "In Hydrolysis, step through the seven steps. Read the free-energy diagram and the coupling step.",
      "In ATP cycle, change regeneration and demand. In Cellular work, play all four examples.",
    ],
    tryThis: [
      "Predict what the free-energy diagram will look like before you reach step 5.",
      "In the Na⁺/K⁺ pump, count the ions moved per ATP.",
      "Explain, in your own words, why ATP hydrolysis alone only produces heat but coupled hydrolysis does work.",
    ],
  },
  explain: {
    questions: [
      {
        id: "biology-atp-energy-release-explain-001",
        question: "Why isn't ATP hydrolysis simply 'a bond breaking and releasing energy'?",
        answer:
          "Breaking bonds requires energy. The overall reaction ATP + H₂O → ADP + Pi has a negative ΔG because the products are more stable (less charge repulsion, resonance stabilisation of Pi and better hydration).",
      },
      {
        id: "biology-atp-energy-release-explain-002",
        question: "Why does a cell keep ATP so far above equilibrium with ADP and Pi?",
        answer:
          "It makes ΔG of hydrolysis more negative in cells (about −50 to −65 kJ/mol) than the standard value, so ATP can drive more work.",
      },
      {
        id: "biology-atp-energy-release-explain-003",
        question: "Why is ATP regenerated constantly rather than stored?",
        answer:
          "Cells hold a small ATP pool and turn it over very rapidly. Fuel oxidation, mostly in respiration, supplies the energy to rebuild ATP from ADP and Pi.",
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
  // CHALLENGE
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Use the lab above to answer each question.",
    scenarios: [
      {
        id: "biology-atp-energy-release-challenge-001",
        title: "Count the phosphates",
        scenario: "Rotate the ATP model and compare it with ADP.",
        objective: "Identify how many phosphates ADP has and which one was removed.",
        requiresExperiment: false, // the live lab is already embedded in Explore above
        answer: {
          mode: "choice",
          options: [
            { id: "two-gamma", label: "Two; the terminal γ-phosphate was removed" },
            { id: "three", label: "Three; none removed" },
            { id: "one", label: "One; the β-phosphate was removed" },
          ],
          correctOptionId: "two-gamma",
        },
        explanation: "ADP has two phosphates. Hydrolysis removes the terminal (γ) phosphate as Pi.",
        hints: ["Compare the Compare view for ATP and ADP."],
      },
      {
        id: "biology-atp-energy-release-challenge-002",
        title: "Free energy sign",
        scenario: "In the Hydrolysis section, reach the free-energy diagram.",
        objective: "Decide the sign of ΔG for ATP hydrolysis under cellular conditions.",
        requiresExperiment: false, // the live lab is already embedded in Explore above
        answer: {
          mode: "choice",
          options: [
            { id: "negative", label: "Negative" },
            { id: "positive", label: "Positive" },
            { id: "zero", label: "Zero" },
          ],
          correctOptionId: "negative",
        },
        explanation: "ATP + H₂O sits at a higher free energy than ADP + Pi, so ΔG is negative.",
        hints: ["Does the arrow go up or down?"],
      },
      {
        id: "biology-atp-energy-release-challenge-003",
        title: "Why couple?",
        scenario: "In the Hydrolysis section, step 6 shows energy coupling.",
        objective: "Explain what coupling achieves.",
        requiresExperiment: false, // the live lab is already embedded in Explore above
        answer: {
          mode: "choice",
          options: [
            { id: "net-neg", label: "The combined reaction has a negative ΔG, so the energy-requiring process can proceed" },
            { id: "heat", label: "It converts all the energy to heat" },
            { id: "store", label: "It stores the ATP permanently" },
          ],
          correctOptionId: "net-neg",
        },
        explanation: "Coupling pairs an energy-requiring reaction with ATP hydrolysis so the total ΔG is negative.",
        hints: ["Think of the three bars in step 6."],
      },
      {
        id: "biology-atp-energy-release-challenge-004",
        title: "Regeneration",
        scenario: "In the ATP cycle section, set regeneration to 0.",
        objective: "Predict what this shows about ATP.",
        requiresExperiment: false, // the live lab is already embedded in Explore above
        answer: {
          mode: "choice",
          options: [
            { id: "not-store", label: "ATP is a carrier that must be regenerated, not a long-term store" },
            { id: "unlimited", label: "ATP is an unlimited supply" },
            { id: "irrelevant", label: "Regeneration has no effect" },
          ],
          correctOptionId: "not-store",
        },
        explanation: "With no energy input the ATP share of the pool collapses.",
        hints: ["Which slider did you change?"],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "biology",
      topicSlug: "cellular-energy",
      label: "Introduction to Cellular Energy",
      href: "/dashboard/biology/cellular-energy",
      reason: "The big picture of how cells obtain, transform and use energy, before and after the details of ATP.",
    },
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
