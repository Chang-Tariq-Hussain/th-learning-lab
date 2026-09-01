import type { TopicContent } from "../types";

/**
 * Photosynthesis — Biology Batch 2 ("Cellular Energy & Life
 * Processes"), topic 2 of 3 (see
 * `@/features/learning-path/data/biology-cellular-energy-life-processes`).
 *
 * Reuses the existing Photosynthesis simulation
 * (`@/features/subjects/biology/photosynthesis`) exactly as it
 * already behaved — this topic renders `<Photosynthesis />` with no
 * `showFactorControls`, so it's the same fixed-rate, ten-second
 * light → water → CO2 → reaction → glucose → oxygen scene the
 * standalone `/dashboard/biology/photosynthesis` page has always
 * shown. This page itself was upgraded from a bare simulation page to
 * the full `TopicExperience` shell (Quick Explore / Learn & Master),
 * matching every other Biology topic — see `app/dashboard/biology/
 * photosynthesis/page.tsx`.
 *
 * The Factors slider controls this same simulation supports
 * (`showFactorControls`) are deliberately NOT used here — that's the
 * next topic, Factors Affecting Photosynthesis, which needs the
 * student to manipulate variables rather than just observe a fixed
 * run.
 *
 * `practice.quizId` points at a new, dedicated 15-question bank
 * (`@/features/quiz-engine/data/biology-photosynthesis-quiz.ts`).
 */
export const biologyPhotosynthesisContent: TopicContent = {
  subjectSlug: "biology",
  topicSlug: "photosynthesis",
  title: "Photosynthesis",
  subjectLabel: "Biology",
  topicLabel: "Plant Biology",
  colorToken: "biology",
  simulationHref: "/dashboard/biology/photosynthesis",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Explain what photosynthesis is and why plants perform it.",
      "Name photosynthesis's raw materials and the products it creates.",
      "Explain the role light energy plays, and where in the plant it's captured.",
      "Read and interpret the simplified and balanced photosynthesis equations.",
    ],
    concepts: [
      {
        term: "What photosynthesis is",
        explanation:
          "Photosynthesis is the process a plant uses to make its own food — a sugar called glucose — using light energy, water, and carbon dioxide. It's how a plant captures energy from sunlight and stores it in a molecule its own cells (and any cell that eats the plant) can later use.",
      },
      {
        term: "The chloroplast",
        explanation:
          "Photosynthesis happens inside the chloroplast, an organelle found in plant cells (introduced back in Batch 1's Cell Organelles). The chloroplast is where light energy is actually captured and put to work — structure enabling function, the same idea Batch 1 built toward.",
      },
      {
        term: "What goes in",
        explanation:
          "Photosynthesis needs three raw materials: carbon dioxide, taken in from the air; water, drawn up from the soil; and light energy, captured by the chloroplast. Light provides the energy that powers the reaction — it isn't a material ingredient that ends up inside the glucose molecule the way CO2 and water are.",
      },
      {
        term: "What comes out",
        explanation:
          "Photosynthesis produces glucose, which the plant uses for energy and growth, and oxygen, released back into the air as a byproduct.",
      },
      {
        term: "The equation",
        explanation:
          "The whole process can be summarized in one equation: carbon dioxide plus water, powered by light energy, becomes glucose plus oxygen.",
        formula: "6CO_2 + 6H_2O + \\text{light energy} \\rightarrow C_6H_{12}O_6 + 6O_2",
        formulaCaption: "Photosynthesis, balanced equation",
      },
    ],
    whyItMatters:
      "Photosynthesis is the starting point of nearly every food chain on Earth, and the reason there's oxygen in the atmosphere to breathe. It's also the direct answer to the previous topic's question of where a cell's stored energy first comes from — a plant's own cells run on the glucose photosynthesis produces, the same way any other cell converts stored food energy into ATP.",
    keyTerms: [
      { term: "Chlorophyll", definition: "The green pigment inside a chloroplast that absorbs light energy and kicks off photosynthesis." },
      { term: "Glucose", definition: "The sugar photosynthesis produces — a food molecule that stores chemical energy the plant can use or convert." },
      { term: "Byproduct", definition: "A substance produced as a side effect of a process rather than being its main purpose — oxygen is photosynthesis's byproduct." },
    ],
    misconceptions: [
      {
        id: "misconception-light-is-material",
        misconception: "Light energy is one of the physical ingredients that ends up as part of the glucose molecule, the same way water and CO2 are.",
        correction:
          "Light provides the energy that powers the reaction — it's not a material reactant. Only carbon dioxide and water contribute the actual atoms that end up in glucose and oxygen.",
      },
      {
        id: "misconception-plants-dont-need-co2",
        misconception: "Plants only need water and sunlight to photosynthesize — carbon dioxide isn't really necessary.",
        correction:
          "Carbon dioxide is one of the two material raw materials (along with water) that photosynthesis actually needs — without it, there's no carbon available to build glucose out of, no matter how much light or water is available.",
      },
      {
        id: "misconception-oxygen-is-main-goal",
        misconception: "Producing oxygen is the main purpose of photosynthesis, from the plant's point of view.",
        correction:
          "From the plant's perspective, glucose — its food — is the point. Oxygen is a byproduct released because it's left over once the reaction is done, not the process's goal.",
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
        id: "biology-photosynthesis-predict-001",
        scenario: "A plant is kept in a completely dark room, with water and carbon dioxide both freely available.",
        question: "Will this plant be able to carry out photosynthesis?",
        options: [
          { id: "no-light-needed", label: "No — without light energy, the reaction can't run" },
          { id: "yes-not-needed", label: "Yes — light isn't actually required if water and CO2 are present" },
        ],
        actualResultOptionId: "no-light-needed",
        explanation: "Light energy is what powers photosynthesis. Without it, water and carbon dioxide being available isn't enough — the reaction has no energy source to run on.",
        hint: "What does light provide to the reaction — energy, or one of the physical ingredients?",
      },
      {
        id: "biology-photosynthesis-predict-002",
        scenario: "You're about to press Start on the Photosynthesis simulation. Light, water, and CO2 are positioned near the leaf.",
        question: "In what order will they be shown reaching the leaf?",
        options: [
          { id: "light-water-co2", label: "Light first, then water, then carbon dioxide" },
          { id: "all-at-once", label: "All three arrive at exactly the same instant, with no order" },
          { id: "co2-water-light", label: "Carbon dioxide first, then water, then light" },
        ],
        actualResultOptionId: "light-water-co2",
        explanation: "The simulation shows light reaching the leaf first, then water traveling up from the soil, then carbon dioxide entering from the air, before the reaction itself and its products.",
        hint: "Watch closely near the very start of the animation.",
      },
      {
        id: "biology-photosynthesis-predict-003",
        scenario: "The equation for photosynthesis is: 6CO2 + 6H2O + light energy → C6H12O6 + 6O2.",
        question: "Which side of this equation does light energy appear on?",
        options: [
          { id: "left-side", label: "The left side, with the raw materials" },
          { id: "right-side", label: "The right side, with the products" },
          { id: "both-sides", label: "Both sides equally" },
        ],
        actualResultOptionId: "left-side",
        explanation: "Light energy appears on the left, alongside carbon dioxide and water — it's one of the things going into the reaction, even though (unlike CO2 and water) it's energy rather than a material ingredient.",
        hint: "Which side of an equation lists what's needed to start the reaction?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Before pressing anything, look at where light, water, and carbon dioxide start around the leaf.",
      "Press Start and watch light, water, and carbon dioxide each travel to the leaf in turn.",
      "Watch the leaf's chloroplasts respond once all three have arrived — this is the reaction itself.",
      "Watch glucose and oxygen appear afterward, and follow oxygen as it's released into the air.",
      "Click the leaf to open a closer view of what's happening inside it.",
    ],
    tryThis: [
      "Before pressing Start, predict which raw material you think will arrive at the leaf first.",
      "After the run finishes, say the full equation out loud in your own words — what went in, what came out.",
      "Compare this simulation's equation to the one shown in the Cellular Respiration simulation from the previous topic — what's different, and what's flipped?",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "biology-photosynthesis-explain-001",
        question: "Why is light energy written into the photosynthesis equation if it isn't a material ingredient like water or CO2?",
        answer:
          "The equation shows everything the reaction needs to proceed, not only its physical ingredients. Light energy is required to power the reaction, so it's written on the input side alongside water and carbon dioxide, even though only water and CO2 contribute atoms to glucose and oxygen.",
      },
      {
        id: "biology-photosynthesis-explain-002",
        question: "Why does the simulation show carbon dioxide and water arriving from different places (air vs. soil)?",
        answer:
          "Because that's where a real plant actually gets each one: carbon dioxide enters through tiny pores in the leaves from the surrounding air, while water is absorbed by the roots from the soil and travels up through the plant. Showing two different paths reflects two different real sources.",
      },
      {
        id: "biology-photosynthesis-explain-003",
        question: "How does photosynthesis connect back to the previous topic, Introduction to Cellular Energy?",
        answer:
          "The previous topic explained that cells convert stored chemical energy (from food) into ATP to power their work. Photosynthesis is where that stored chemical energy first gets created — a plant cell captures light energy and stores it in glucose, which its own cells (and any cell that eats the plant) can later convert into ATP.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "biology-photosynthesis",
  },

  // -------------------------------------------------------------
  // CHALLENGE — guided Predict → Experiment → Explain mission
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Run the simulation above, then answer each question. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "biology-photosynthesis-challenge-001",
        title: "Identify the Raw Materials",
        scenario: "Before pressing Start, look at what's positioned around the leaf, ready to travel toward it.",
        objective: "Identify the three things photosynthesis needs to begin.",
        tools: [{ id: "photosynthesis-scene", label: "Plant scene, before pressing Start" }],
        requiresExperiment: false, // Explore above already embeds the live simulation on this page — a second copy would be redundant.
        answer: {
          mode: "choice",
          options: [
            { id: "light-water-co2-inputs", label: "Light, water, and carbon dioxide" },
            { id: "glucose-oxygen-inputs", label: "Glucose and oxygen" },
            { id: "chlorophyll-only", label: "Only chlorophyll, with nothing from outside the leaf" },
          ],
          correctOptionId: "light-water-co2-inputs",
        },
        explanation: "Light energy, water, and carbon dioxide are photosynthesis's three inputs — glucose and oxygen are what the reaction produces, not what it starts with.",
        hints: ["What three things does the simulation show traveling toward the leaf?"],
      },
      {
        id: "biology-photosynthesis-challenge-002",
        title: "Observe the Products",
        scenario: "Press Start and watch what happens once light, water, and carbon dioxide have all reached the leaf.",
        objective: "Identify what the reaction produces, and where each product goes.",
        tools: [{ id: "photosynthesis-products", label: "Plant scene, after the reaction step" }],
        requiresExperiment: false, // Explore above already embeds the live simulation on this page — a second copy would be redundant.
        answer: {
          mode: "choice",
          options: [
            { id: "glucose-stays-oxygen-leaves", label: "Glucose is produced for the plant to use; oxygen is released into the air" },
            { id: "both-released", label: "Both glucose and oxygen are released into the air" },
            { id: "co2-produced", label: "Carbon dioxide is produced and released" },
          ],
          correctOptionId: "glucose-stays-oxygen-leaves",
        },
        explanation: "Glucose is the food the plant produces for its own use, while oxygen is the byproduct released back into the surrounding air.",
        hints: ["Which product travels out of the leaf and away, and which one stays associated with the plant?"],
      },
      {
        id: "biology-photosynthesis-challenge-003",
        title: "Write the Equation",
        scenario: "You've now watched the full photosynthesis animation run at least once.",
        objective: "Identify the correctly balanced equation for photosynthesis.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "correct-equation", label: "6CO2 + 6H2O + light energy → C6H12O6 + 6O2" },
            { id: "reversed-equation", label: "C6H12O6 + 6O2 → 6CO2 + 6H2O + light energy" },
            { id: "missing-light", label: "6CO2 + 6H2O → C6H12O6 + 6O2" },
          ],
          correctOptionId: "correct-equation",
        },
        explanation: "Photosynthesis takes carbon dioxide, water, and light energy as inputs and produces glucose and oxygen — the reversed version is actually closer to cellular respiration, and the third option leaves out light energy, which the reaction can't run without.",
        hints: ["Which side of the equation should carbon dioxide, water, and light energy be on — inputs or outputs?"],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "biology",
      topicSlug: "cellular-energy",
      label: "Introduction to Cellular Energy",
      href: "/dashboard/biology/cellular-energy",
      reason: "Explains what happens to the glucose photosynthesis produces once a cell needs to spend its stored energy.",
    },
    {
      subjectSlug: "biology",
      topicSlug: "cell-organelles",
      label: "Cell Organelles",
      href: "/dashboard/biology/cell-organelles",
      reason: "Introduced the chloroplast, the organelle where photosynthesis actually takes place.",
    },
  ],
};
