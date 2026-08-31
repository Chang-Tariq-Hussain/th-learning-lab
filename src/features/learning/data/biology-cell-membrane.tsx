import type { TopicContent } from "../types";

/**
 * Cell Membrane — Biology Batch 1 ("Cell Biology Foundations"), topic
 * 5 of 7 (see
 * `@/features/learning-path/data/biology-cell-foundations`).
 *
 * Reuses the existing Cell Membrane & Transport simulation
 * (`@/features/subjects/biology/membrane-transport`, the
 * `MembraneTransport` component already live at
 * `/dashboard/biology/membrane-transport`) rather than building
 * anything new. That simulation is a simplified particle-movement
 * demo with exactly two modes — Diffusion and Osmosis — a "Start
 * Diffusion"/"Start Osmosis" button, and a "Reset" button (see
 * `membrane-transport/components/mode-tabs.tsx` and
 * `transport-controls.tsx`, the single source of truth this content's
 * "how to use" instructions are kept consistent with). It does NOT
 * model membrane *structure* (no phospholipid bilayer or protein
 * detail to click) — only membrane *behavior* (things moving across
 * it). So this topic's Learn section covers structure and selective
 * permeability as taught content, while the Explore/Challenge sections
 * only ever ask the student to interact with the movement the
 * simulation actually shows.
 *
 * `practice.quizId` points at a new, dedicated 13-question bank
 * (`@/features/quiz-engine/data/biology-cell-membrane-quiz.ts`).
 */
export const biologyCellMembraneContent: TopicContent = {
  subjectSlug: "biology",
  topicSlug: "cell-membrane",
  title: "Cell Membrane",
  subjectLabel: "Biology",
  topicLabel: "Cell Structure",
  colorToken: "biology",
  simulationHref: "/dashboard/biology/cell-membrane",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Describe what the cell membrane is and where it sits on the cell.",
      "Explain what \"selectively permeable\" means and why it matters.",
      "Explain why a cell needs to control what enters and leaves it.",
      "Connect the concept of concentration to which direction substances move.",
    ],
    concepts: [
      {
        term: "Cell membrane",
        explanation:
          "The thin boundary surrounding every cell, separating its inside from its surroundings. Every cell — plant or animal — has one, even cells that also have a rigid cell wall outside it.",
      },
      {
        term: "Selectively permeable",
        explanation:
          "The membrane's defining property: it lets some substances cross while blocking others, rather than being either fully sealed or fully open. \"Selective\" is the key word — it's actively choosing what gets through, not just filtering by size.",
      },
      {
        term: "Why the cell controls what crosses",
        explanation:
          "A cell needs specific substances inside (like oxygen and nutrients) and needs to keep other substances out or move waste out. A membrane with no control at all would let the cell's contents mix freely with its surroundings — which would very quickly stop it from functioning.",
      },
      {
        term: "Concentration and movement",
        explanation:
          "\"Concentration\" describes how crowded a substance is in a given space. Left alone, most substances naturally move from where they're more concentrated toward where they're less concentrated — the same basic idea behind a smell spreading through a room.",
      },
    ],
    whyItMatters:
      "The cell membrane is the reason a cell can maintain an internal environment different from the world outside it — the same basic principle behind how your cells keep the right balance of salts and water, how a doctor picks an IV fluid that won't damage your blood cells, and how some medications are designed specifically to cross (or specifically not cross) particular membranes in your body.",
    keyTerms: [
      { term: "Concentration", definition: "How crowded a substance is within a given space or volume." },
      { term: "Concentration gradient", definition: "A difference in concentration between two areas — the basis for which direction a substance tends to move." },
      { term: "Permeable", definition: "Able to be crossed by a substance. \"Selectively\" permeable means only certain substances can cross." },
    ],
    misconceptions: [
      {
        id: "misconception-membrane-fully-sealed",
        misconception: "The cell membrane is a solid, sealed wall that nothing can cross.",
        correction:
          "A fully sealed membrane would starve the cell rather than protect it. The membrane is selectively permeable — it deliberately lets certain substances (like oxygen or nutrients) pass through while keeping others out.",
      },
      {
        id: "misconception-membrane-fully-open",
        misconception: "The cell membrane just lets everything through equally, like a loose net.",
        correction:
          "If the membrane let everything through freely, the cell couldn't maintain any internal environment different from its surroundings. \"Selective\" is the key idea — some things cross easily, others don't cross at all without help.",
      },
      {
        id: "misconception-only-plant-cells-have-membrane",
        misconception: "Only plant cells have a cell membrane, since animal cells don't have a cell wall.",
        correction:
          "Every cell has a cell membrane — plant cells just have an additional, separate rigid cell wall sitting outside it. The membrane itself is common to both.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Predict first, then confirm using the membrane simulation below.",
    scenarios: [
      {
        id: "biology-cell-membrane-predict-001",
        scenario: "A substance is much more concentrated outside a cell than inside it, and the membrane allows that substance through.",
        question: "Which direction will the substance tend to move?",
        options: [
          { id: "into-cell", label: "Into the cell" },
          { id: "out-of-cell", label: "Out of the cell" },
          { id: "no-movement", label: "It won't move either way" },
        ],
        actualResultOptionId: "into-cell",
        explanation: "Substances tend to move from where they're more concentrated toward where they're less concentrated — from outside (higher concentration) to inside (lower concentration) in this case.",
        hint: "Which side has the higher concentration, and which direction does movement usually go?",
      },
      {
        id: "biology-cell-membrane-predict-002",
        scenario: "A cell's membrane is damaged and stops controlling what crosses it at all.",
        question: "What's the most likely consequence?",
        options: [
          { id: "loses-control", label: "The cell loses control over its internal environment" },
          { id: "no-effect", label: "No effect — the membrane isn't very important" },
          { id: "stronger-wall", label: "The cell quickly grows a replacement cell wall" },
        ],
        actualResultOptionId: "loses-control",
        explanation: "The membrane's entire job is controlling what enters and leaves. Without that control, the cell can't maintain an internal environment different from its surroundings.",
        hint: "What is the membrane's main job?",
      },
      {
        id: "biology-cell-membrane-predict-003",
        scenario: "You're asked whether the cell membrane is the same thing as the cell wall.",
        question: "Is that correct?",
        options: [
          { id: "no-different", label: "No — they're two different structures" },
          { id: "yes-same", label: "Yes — they're two names for the same structure" },
        ],
        actualResultOptionId: "no-different",
        explanation: "They're different: every cell has a membrane, but only plant cells additionally have a rigid cell wall sitting just outside it.",
        hint: "Do animal cells have a cell wall?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "In the Cell Membrane & Transport simulation below, notice the dots on the \"Outside Cell\" and \"Inside Cell\" sides of the membrane band before pressing anything.",
      "Select the Diffusion tab, then press \"Start Diffusion,\" and watch which way the crowded side's particles move.",
      "Press \"Reset,\" then select the Osmosis tab and press \"Start Osmosis\" to watch water move instead.",
      "Compare the two: in both cases, something is moving across the membrane from one side to the other.",
    ],
    tryThis: [
      "Before pressing Start on either mode, predict which side has more dots — that's the higher-concentration side.",
      "After running Diffusion, describe in one sentence what \"more evenly distributed\" means based on what you just watched.",
      "Notice that this simulation only ever shows movement happening on its own — no button here makes something move against a concentration difference. Keep that in mind; it becomes important later in this course.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "biology-cell-membrane-explain-001",
        question: "Why is \"selectively permeable\" a better description of the membrane than just \"permeable\"?",
        answer:
          "\"Permeable\" alone would suggest everything can cross equally, like a loose net. \"Selectively\" is the important word — the membrane actively lets some substances through while blocking others, which is what lets the cell maintain a different internal environment from its surroundings.",
      },
      {
        id: "biology-cell-membrane-explain-002",
        question: "Why does a substance tend to move from higher to lower concentration when the membrane allows it through, rather than the other way around, or not at all?",
        answer:
          "This is the same basic pattern you'd see with a scent spreading through a room — with no other force involved, things naturally spread out from where they're crowded toward where they're not, simply because there's more open space to spread into on the less-crowded side.",
      },
      {
        id: "biology-cell-membrane-explain-003",
        question: "The membrane simulation only ever shows movement toward lower concentration. What would it mean for something to move the opposite way?",
        answer:
          "Moving toward higher concentration — against the natural direction — isn't something that happens on its own the way diffusion and osmosis do; it requires the cell to actively push the substance that direction, which takes energy. That's a different, later topic in this course: active transport.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "biology-cell-membrane",
  },

  // -------------------------------------------------------------
  // CHALLENGE — Cell Membrane Mission
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Use the Cell Membrane & Transport simulation above for each question below. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "biology-cell-membrane-challenge-001",
        requiresExperiment: false, // Explore above already embeds the live simulation on this page — a second copy would be redundant.
        title: "Cell Membrane Mission: Identify the Membrane",
        scenario: "Look at the simulation before pressing anything.",
        objective: "Identify which labeled band separates the \"Outside Cell\" and \"Inside Cell\" dots.",
        tools: [{ id: "membrane-transport-hero", label: "Cell Membrane & Transport — membrane band" }],
        answer: {
          mode: "choice",
          options: [
            { id: "cell-membrane", label: "The Cell Membrane band" },
            { id: "outside-cell-label", label: "The \"Outside Cell\" label" },
            { id: "inside-cell-label", label: "The \"Inside Cell\" label" },
          ],
          correctOptionId: "cell-membrane",
        },
        explanation: "The labeled band between the \"Outside Cell\" and \"Inside Cell\" dot groups is the cell membrane — the boundary everything in this simulation moves across.",
        hints: ["Which label sits directly between the two groups of dots?"],
      },
      {
        id: "biology-cell-membrane-challenge-002",
        requiresExperiment: false, // Explore above already embeds the live simulation on this page — a second copy would be redundant.
        title: "Cell Membrane Mission: Observe Movement",
        scenario: "Select the Diffusion tab and press \"Start Diffusion.\"",
        objective: "Observe which side's particles move, and identify the direction of movement.",
        tools: [{ id: "membrane-transport-diffusion", label: "Diffusion mode — Start Diffusion / Reset controls" }],
        answer: {
          mode: "choice",
          options: [
            { id: "crowded-to-sparse", label: "From the crowded side toward the sparse side" },
            { id: "sparse-to-crowded", label: "From the sparse side toward the crowded side" },
            { id: "no-movement", label: "Nothing moves" },
          ],
          correctOptionId: "crowded-to-sparse",
        },
        explanation: "Particles move from the crowded (higher-concentration) side toward the sparser (lower-concentration) side, spreading out until both sides are more evenly distributed.",
        hints: ["Which side starts with more dots packed together?"],
      },
      {
        id: "biology-cell-membrane-challenge-003",
        requiresExperiment: false, // Explore above already embeds the live simulation on this page — a second copy would be redundant.
        title: "Cell Membrane Mission: Compare With and Without Energy",
        scenario: "Think back on everything you just watched in both Diffusion and Osmosis.",
        objective: "Determine whether either mode you observed required the cell to spend energy to make the movement happen.",
        tools: [{ id: "membrane-transport-both-modes", label: "Diffusion and Osmosis modes" }],
        answer: {
          mode: "choice",
          options: [
            { id: "no-energy", label: "No — both happened on their own, without energy" },
            { id: "yes-energy", label: "Yes — the cell had to actively push the movement" },
          ],
          correctOptionId: "no-energy",
        },
        explanation: "Both diffusion and osmosis happen passively, on their own, without the cell spending any energy — movement that requires energy is a different process (active transport), covered in a later topic.",
        hints: ["Did anything in the simulation represent the cell \"working\" to move things?"],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "biology",
      topicSlug: "plant-vs-animal-cells",
      label: "Plant vs Animal Cells",
      href: "/dashboard/biology/plant-vs-animal-cells",
      reason: "Covers the cell membrane as one of the structures every cell type shares.",
    },
    {
      subjectSlug: "biology",
      topicSlug: "diffusion-osmosis",
      label: "Diffusion & Osmosis",
      href: "/dashboard/biology/diffusion-osmosis",
      reason: "Goes deeper into the two specific ways substances move across the membrane you just explored.",
    },
  ],
};
