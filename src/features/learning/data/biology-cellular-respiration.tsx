import type { TopicContent } from "../types";

/**
 * Cellular Respiration — Biology Batch 2 ("Cellular Energy & Life
 * Processes"), topic 4 of 6 (see
 * `@/features/learning-path/data/biology-cell-foundations`).
 *
 * Reuses the existing Cellular Respiration simulation
 * (`@/features/subjects/biology/cellular-respiration`) — the same
 * component Topic 1 (Introduction to Cellular Energy) already reused
 * for an introductory glimpse. This topic is where that simulation
 * gets its full, dedicated lesson: the complete glucose + oxygen →
 * ATP + CO2 + H2O story, the balanced equation, and the mitochondria
 * connection back to Batch 1 — still without glycolysis/Krebs-cycle
 * detail, matching the simulation's own doc comment ("no glycolysis/
 * Krebs-cycle detail"). No new simulation was built for this topic.
 *
 * `practice.quizId` points at the existing
 * `biology-cellular-respiration` quiz bank (already registered from
 * an earlier pass), extended from 5 to 15 questions for this topic
 * rather than creating a second, duplicate bank for the same simulation.
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
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Predict first, then confirm by running the simulation below.",
    scenarios: [
      {
        id: "biology-cellular-respiration-predict-001",
        scenario: "A cell has plenty of glucose available, but no oxygen at all.",
        question: "Can this cell carry out aerobic cellular respiration?",
        options: [
          { id: "no-oxygen-required", label: "No — aerobic respiration specifically requires oxygen to proceed" },
          { id: "yes-glucose-enough", label: "Yes — glucose alone is enough, oxygen isn't actually needed" },
        ],
        actualResultOptionId: "no-oxygen-required",
        explanation: "This process is called \"aerobic\" precisely because it requires oxygen — without it, a cell can't carry it out, no matter how much glucose is available.",
        hint: "What does the word \"aerobic\" itself tell you this process needs?",
      },
      {
        id: "biology-cellular-respiration-predict-002",
        scenario: "You're about to press Start on the Cellular Respiration simulation. Glucose and oxygen are positioned near the cell, and the Energy bar reads empty.",
        question: "What will happen once glucose and oxygen reach the mitochondrion?",
        options: [
          { id: "mitochondrion-highlights-energy-fills", label: "The mitochondrion highlights, and the Energy bar fills" },
          { id: "nothing-visible", label: "Nothing visible happens at that point" },
          { id: "glucose-and-oxygen-vanish", label: "Glucose and oxygen simply vanish with no further effect" },
        ],
        actualResultOptionId: "mitochondrion-highlights-energy-fills",
        explanation: "As glucose and oxygen reach the mitochondrion, it highlights to show respiration taking place, and the Energy bar fills to represent the cell releasing usable energy.",
        hint: "What usually happens at the moment two inputs reach the \"reaction\" step in these simulations?",
      },
      {
        id: "biology-cellular-respiration-predict-003",
        scenario: "After the mitochondrion highlights and the Energy bar fills, the simulation continues.",
        question: "What two substances will appear next, as byproducts?",
        options: [
          { id: "co2-and-water", label: "Carbon dioxide and water" },
          { id: "more-glucose-and-oxygen", label: "More glucose and oxygen" },
          { id: "atp-and-adp", label: "ATP and ADP, shown as separate visible particles" },
        ],
        actualResultOptionId: "co2-and-water",
        explanation: "Carbon dioxide and water are cellular respiration's byproducts, released once the usable energy has been captured.",
        hint: "What does the balanced equation list on the output side, alongside ATP/energy?",
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
      "Watch carbon dioxide and water appear and leave the cell afterward.",
      "Read the connection note comparing this process to photosynthesis.",
    ],
    tryThis: [
      "🔬 Cellular Respiration Mission — identify each of these as you watch: (1) What molecule provides stored chemical energy? (2) What gas is required? (3) Where is the process strongly associated within the cell? (4) What usable energy carrier is produced? (5) Which waste products are formed?",
      "Before pressing Start, predict what the Energy bar will do.",
      "After it finishes, say the full equation out loud in your own words — what went in, what came out.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "biology-cellular-respiration-explain-001",
        question: "Why is oxygen specifically necessary for this process, and not just helpful?",
        answer:
          "This is aerobic respiration, defined by requiring oxygen. Without it, the chemical steps that release glucose's energy this way can't proceed — a cell would have to fall back on separate, much less efficient pathways instead.",
      },
      {
        id: "biology-cellular-respiration-explain-002",
        question: "Why does the topic say the mitochondrion is 'strongly associated with' respiration, rather than simply 'where respiration happens'?",
        answer:
          "It's scientifically more careful: the mitochondrion is central to cellular respiration and a fair shorthand for where it happens, but not every single step of the process occurs exclusively inside it.",
      },
      {
        id: "biology-cellular-respiration-explain-003",
        question: "How does cellular respiration connect back to Batch 1's Cell Organelles topic?",
        answer:
          "Cell Organelles introduced the mitochondrion as a structure; this topic explains its function — why that particular organelle's structure makes it so central to releasing usable energy from glucose. Structure enabling function, the same idea Batch 1 built toward.",
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
  // CHALLENGE — Predict → Observe → Explain mission
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Run the simulation above, then answer each question. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "biology-cellular-respiration-challenge-001",
        title: "Identify the Inputs",
        scenario: "Before pressing Start, look at what's positioned near the cell, ready to travel toward the mitochondrion.",
        objective: "Identify the two substances the cell is about to use.",
        tools: [{ id: "cellular-respiration-scene-inputs", label: "Cell scene, before pressing Start" }],
        requiresExperiment: false, // Explore above already embeds the live simulation on this page — a second copy would be redundant.
        answer: {
          mode: "choice",
          options: [
            { id: "glucose-oxygen-inputs", label: "Glucose and oxygen" },
            { id: "co2-water-inputs", label: "Carbon dioxide and water" },
            { id: "atp-adp-inputs", label: "ATP and ADP" },
          ],
          correctOptionId: "glucose-oxygen-inputs",
        },
        explanation: "Glucose (stored food energy) and oxygen are cellular respiration's two inputs.",
        hints: ["Which two substances are shown entering the cell, before anything is produced?"],
      },
      {
        id: "biology-cellular-respiration-challenge-002",
        title: "Observe the Mitochondrion",
        scenario: "Press Start and watch what happens once glucose and oxygen reach the mitochondrion.",
        objective: "Identify what the mitochondrion's highlight, together with the filling Energy bar, represents.",
        tools: [{ id: "cellular-respiration-mitochondrion", label: "Mitochondrion, during the reaction step" }],
        requiresExperiment: false, // Explore above already embeds the live simulation on this page — a second copy would be redundant.
        answer: {
          mode: "choice",
          options: [
            { id: "respiration-releasing-energy", label: "Cellular respiration taking place, releasing usable energy" },
            { id: "unrelated-highlight", label: "A highlight unrelated to energy or respiration" },
            { id: "photosynthesis-occurring", label: "Photosynthesis, occurring inside the mitochondrion" },
          ],
          correctOptionId: "respiration-releasing-energy",
        },
        explanation: "The mitochondrion highlighting represents cellular respiration actively taking place there, releasing usable energy from glucose.",
        hints: ["What process is this simulation named after, and what organelle is it strongly associated with?"],
      },
      {
        id: "biology-cellular-respiration-challenge-003",
        title: "Identify the Waste Products",
        scenario: "Continue watching the simulation after the Energy bar fills.",
        objective: "Identify the two substances released as the process's byproducts.",
        tools: [{ id: "cellular-respiration-byproducts", label: "Cell scene, after the reaction step" }],
        requiresExperiment: false, // Explore above already embeds the live simulation on this page — a second copy would be redundant.
        answer: {
          mode: "choice",
          options: [
            { id: "co2-water-byproducts", label: "Carbon dioxide and water" },
            { id: "glucose-oxygen-byproducts", label: "Glucose and oxygen" },
            { id: "atp-byproduct", label: "ATP, released as a waste product" },
          ],
          correctOptionId: "co2-water-byproducts",
        },
        explanation: "Carbon dioxide and water are the byproducts released once the usable energy has been captured — ATP is the useful product, not a waste product.",
        hints: ["Which two substances does the balanced equation list on the output side, alongside ATP/energy?"],
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
