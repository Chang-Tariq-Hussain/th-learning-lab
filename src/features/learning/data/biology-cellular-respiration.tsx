import type { TopicContent } from "../types";

/**
 * Cellular Respiration — Biology Batch 2. Uses the dedicated Cellular Respiration laboratory
 * (`@/features/subjects/biology/cellular-respiration`): five stages with zoom levels, a citric-acid-cycle explorer,
 * electron transport and chemiosmosis, ATP yield explorer, overall equation with carbon accounting, aerobic vs
 * fermentation and practice. `practice.quizId` points at the existing dedicated bank.
 */
export const biologyCellularRespirationContent: TopicContent = {
  subjectSlug: "biology",
  topicSlug: "cellular-respiration",
  title: "Cellular Respiration",
  subjectLabel: "Biology",
  topicLabel: "Cell Structure",
  colorToken: "biology",
  simulationHref: "/dashboard/biology/cellular-respiration",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Explain what cellular respiration is and why cells perform it.",
      "Name cellular respiration's inputs and outputs.",
      "Explain the roles glucose, oxygen, and the mitochondrion each play.",
      "Read and interpret the simplified and balanced cellular respiration equations.",
    ],
    concepts: [
      {
        term: "What cellular respiration is",
        explanation:
          "Cellular respiration is the process a cell uses to release the chemical energy stored in glucose and capture usable energy from it as ATP. It's how the food energy introduced back in Introduction to Cellular Energy actually becomes spendable.",
      },
      {
        term: "The core idea",
        explanation:
          "Cells use the chemical energy stored in glucose to produce usable energy in ATP. Glucose and oxygen go in; ATP, carbon dioxide, and water come out.",
        formula: "\\text{Glucose} + \\text{Oxygen} \\rightarrow \\text{Cellular Respiration} \\rightarrow \\text{ATP} + \\text{Carbon Dioxide} + \\text{Water}",
        formulaCaption: "Cellular respiration, conceptual flow",
      },
      {
        term: "Glucose's role",
        explanation:
          "Glucose is the fuel — the molecule storing the chemical energy cellular respiration releases. It's the same glucose photosynthesis produces, or that comes from food a cell's organism has eaten.",
      },
      {
        term: "Oxygen and aerobic respiration",
        explanation:
          "This kind of respiration is called \"aerobic\" specifically because it requires oxygen to proceed. Without oxygen available, a cell can't carry out this process — it would have to rely on separate, much less efficient pathways instead.",
      },
      {
        term: "The mitochondrion",
        explanation:
          "The mitochondrion, introduced in Batch 1's Cell Organelles, is strongly associated with cellular respiration — its structure is well suited to the role. It isn't accurate, though, to say every single step of cellular respiration happens exclusively inside it.",
      },
      {
        term: "The equation",
        explanation:
          "The balanced equation summarizes the whole process: one glucose molecule plus six oxygen molecules become six carbon dioxide, six water, and captured energy.",
        formula: "C_6H_{12}O_6 + 6O_2 \\rightarrow 6CO_2 + 6H_2O + \\text{ATP/energy}",
        formulaCaption: "Cellular respiration, balanced equation",
      },
    ],
    whyItMatters:
      "Cellular respiration is how nearly every living cell — plant or animal — turns the food energy it has access to into a form it can actually spend. It's also the direct answer to where a cell's ATP, introduced in Introduction to Cellular Energy, actually comes from, and it's the process that uses up exactly what photosynthesis produces — the connection Topic 6 builds toward.",
    keyTerms: [
      { term: "Aerobic respiration", definition: "Cellular respiration that specifically requires oxygen to proceed." },
      { term: "Mitochondrion", definition: "The organelle strongly associated with cellular respiration, first introduced in Batch 1's Cell Organelles." },
      { term: "Byproduct", definition: "A substance produced as a side effect of a process — carbon dioxide and water are cellular respiration's byproducts." },
    ],
    misconceptions: [
      {
        id: "misconception-atp-from-nothing",
        misconception: "ATP is simply created from nothing during cellular respiration.",
        correction:
          "Energy already stored in glucose is released and captured in ATP — it's a conversion, not a creation. Cellular respiration doesn't manufacture new energy; it transfers energy that already existed into a more immediately usable form.",
      },
      {
        id: "misconception-respiration-only-mitochondria",
        misconception: "Every single step of cellular respiration happens exclusively inside the mitochondrion, with no exceptions.",
        correction:
          "Cellular respiration is strongly associated with mitochondria, and that's a fair general shorthand — but it isn't accurate to say every step of the process is confined exclusively to them.",
      },
      {
        id: "misconception-respiration-equals-breathing",
        misconception: "Cellular respiration and breathing are the same thing.",
        correction:
          "Breathing moves air (including oxygen) in and out of the body — it's how the oxygen cellular respiration needs gets delivered to cells in the first place. Cellular respiration itself is the chemical process happening inside individual cells that actually uses that oxygen.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT / EXPLORE / EXPLAIN
  // -------------------------------------------------------------
  predict: {
    intro: "Commit to a prediction, then step through the laboratory above to check it.",
    scenarios: [
      {
        id: "biology-cellular-respiration-predict-001",
        scenario: "Glycolysis is about to begin in the cytosol.",
        question: "What is the net ATP yield per glucose?",
        options: [
          { id: "two", label: "2 ATP (4 made − 2 invested)" },
          { id: "thirty", label: "30 ATP" },
          { id: "zero", label: "0 ATP" },
        ],
        actualResultOptionId: "two",
        explanation: "Glycolysis invests 2 ATP and makes 4: net 2 ATP, 2 NADH and 2 pyruvate.",
        hint: "Invest first, then pay off.",
      },
      {
        id: "biology-cellular-respiration-predict-002",
        scenario: "Pyruvate enters the mitochondrial matrix and is oxidised to acetyl-CoA.",
        question: "What is released?",
        options: [
          { id: "co2-nadh", label: "CO₂ and NADH (one of each per pyruvate)" },
          { id: "o2", label: "O₂" },
          { id: "atp-30", label: "About 30 ATP" },
        ],
        actualResultOptionId: "co2-nadh",
        explanation: "Each pyruvate loses a carbon as CO₂ and reduces NAD⁺ to NADH.",
        hint: "Which carbon-containing gas appears?",
      },
      {
        id: "biology-cellular-respiration-predict-003",
        scenario: "Electrons reach the end of the electron transport chain.",
        question: "What accepts them?",
        options: [
          { id: "oxygen", label: "Oxygen, forming water" },
          { id: "glucose", label: "Glucose" },
          { id: "co2", label: "CO₂" },
        ],
        actualResultOptionId: "oxygen",
        explanation: "Oxygen is the final electron acceptor. Without it the chain stops and the gradient cannot be maintained.",
        hint: "Which gas does an aerobic cell need?",
      },
    ],
  },
  explore: {
    howToUse: [
      "Press Play or use the stage list to go through glycolysis, pyruvate oxidation, the citric acid cycle, the electron transport chain and chemiosmosis.",
      "Use Whole cell, Mitochondrion and Molecular zoom to see where each stage happens; click a stage badge on the mitochondrion.",
      "In the citric acid cycle, select intermediates and switch between Per turn and Per glucose.",
      "In Chemiosmosis choose Take control, change the proton flow and remove oxygen to see what happens to the gradient and ATP.",
      "Open ATP yield, Overall equation and Aerobic vs no oxygen to compare totals, carbon accounting and fermentation.",
    ],
    tryThis: [
      "Use the Carbon overlay to follow all 6 carbons of glucose to CO₂.",
      "Switch Predict mode on and answer before each key step.",
      "Change the shuttle system in ATP yield and explain why the total changes between 30 and 32.",
    ],
  },
  explain: {
    questions: [
      {
        id: "biology-cellular-respiration-explain-001",
        question: "Why is oxygen necessary for the full process?",
        answer:
          "Oxygen is the final electron acceptor of the electron transport chain. Without it the chain backs up, NADH and FADH₂ are not recycled and oxidative phosphorylation stops.",
      },
      {
        id: "biology-cellular-respiration-explain-002",
        question: "Why is the ATP yield given as 30–32 rather than an exact number?",
        answer:
          "The yield depends on how glycolytic NADH enters mitochondria, proton leak and the cost of moving ADP, Pi and ATP. 30–32 per glucose is a commonly taught estimate, not a constant.",
      },
      {
        id: "biology-cellular-respiration-explain-003",
        question: "How is fermentation different from anaerobic respiration?",
        answer:
          "Fermentation regenerates NAD⁺ without an electron transport chain, so glycolysis can continue (2 ATP per glucose). Anaerobic respiration uses an electron transport chain with a final acceptor other than oxygen.",
      },
    ],
  },


  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "biology-cellular-respiration",
  },

  // -------------------------------------------------------------
  // CHALLENGE
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Use the laboratory above to answer each question.",
    scenarios: [
      {
        id: "biology-cellular-respiration-challenge-001",
        title: "Carbon accounting",
        scenario: "Follow the carbon overlay from glucose through all stages.",
        objective: "How do all 6 carbons of glucose leave?",
        requiresExperiment: false, // the live lab is already embedded in Explore above
        answer: {
          mode: "choice",
          options: [
            { id: "six-co2", label: "As 6 CO₂: 2 in pyruvate oxidation and 4 in the citric acid cycle" },
            { id: "water", label: "As water" },
            { id: "atp", label: "As ATP" },
          ],
          correctOptionId: "six-co2",
        },
        explanation: "2 CO₂ leave in pyruvate oxidation and 2 per turn × 2 turns in the cycle.",
        hints: ["Count the CO₂ chips in the carbon tracker."],
      },
      {
        id: "biology-cellular-respiration-challenge-002",
        title: "Citric acid cycle yield",
        scenario: "Switch the cycle to Per glucose.",
        objective: "What does the cycle produce per glucose?",
        requiresExperiment: false, // the live lab is already embedded in Explore above
        answer: {
          mode: "choice",
          options: [
            { id: "per-glucose", label: "4 CO₂, 6 NADH, 2 FADH₂, 2 ATP" },
            { id: "per-turn", label: "2 CO₂, 3 NADH, 1 FADH₂, 1 ATP" },
            { id: "none", label: "Nothing" },
          ],
          correctOptionId: "per-glucose",
        },
        explanation: "The cycle turns twice per glucose; the per-turn values are half these.",
        hints: ["Check the unit selector."],
      },
      {
        id: "biology-cellular-respiration-challenge-003",
        title: "Proton pumping",
        scenario: "In the electron transport chain, compare Complex I and Complex II.",
        objective: "Which complex does not pump protons?",
        requiresExperiment: false, // the live lab is already embedded in Explore above
        answer: {
          mode: "choice",
          options: [
            { id: "complex-ii", label: "Complex II" },
            { id: "complex-i", label: "Complex I" },
            { id: "complex-iv", label: "Complex IV" },
          ],
          correctOptionId: "complex-ii",
        },
        explanation: "Complex II passes electrons to ubiquinone without pumping, so FADH₂ supports fewer protons pumped than NADH.",
        hints: ["Read the labels under each complex."],
      },
      {
        id: "biology-cellular-respiration-challenge-004",
        title: "No oxygen",
        scenario: "In Chemiosmosis, switch to Take control and remove oxygen.",
        objective: "What happens to ATP production over time?",
        requiresExperiment: false, // the live lab is already embedded in Explore above
        answer: {
          mode: "choice",
          options: [
            { id: "falls", label: "It stops as the gradient is used up and not rebuilt" },
            { id: "rises", label: "It rises" },
            { id: "same", label: "It is unchanged" },
          ],
          correctOptionId: "falls",
        },
        explanation: "Without oxygen the chain stops pumping, so the gradient cannot be maintained.",
        hints: ["Watch the gradient readout."],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "biology",
      topicSlug: "cellular-energy",
      label: "Introduction to Cellular Energy",
      href: "/dashboard/biology/cellular-energy",
      reason: "Introduced the same simulation at a conceptual level — this topic gives it the full lesson.",
    },
    {
      subjectSlug: "biology",
      topicSlug: "photosynthesis",
      label: "Photosynthesis",
      href: "/dashboard/biology/photosynthesis",
      reason: "Produces exactly the glucose and oxygen cellular respiration uses as its inputs.",
    },
    {
      subjectSlug: "biology",
      topicSlug: "atp-energy-release",
      label: "ATP & Energy Release",
      href: "/dashboard/biology/atp-energy-release",
      reason: "Looks more closely at the ATP this topic's simulation produces, and how a cell spends it.",
    },
  ],
};
