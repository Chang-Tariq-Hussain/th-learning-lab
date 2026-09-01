import type { TopicContent } from "../types";

/**
 * Photosynthesis vs Cellular Respiration — Biology Batch 2
 * ("Cellular Energy & Life Processes"), topic 6 of 6, and the
 * capstone that connects the first six topics of the batch (see
 * `@/features/learning-path/data/biology-cell-foundations`).
 *
 * Uses a new, deliberately lightweight interactive comparison
 * component (`@/features/subjects/biology/photosynthesis-vs-
 * respiration`) rather than either simulation on its own — the brief
 * is explicit that this should be "a lightweight comparison
 * interaction using existing components," not a large new framework.
 * It's built from three small, mostly-static pieces (a quick
 * always-visible comparison table, a click-to-reveal process detail
 * toggle, and a static matter/energy cycle diagram) rather than a new
 * playback-driven simulation — see that component's own doc comment
 * for why. No physics-style simulation engine was built for this
 * topic.
 *
 * `practice.quizId` points at a new, dedicated 15-question bank
 * (`@/features/quiz-engine/data/biology-photosynthesis-vs-
 * respiration-quiz.ts`).
 */
export const biologyPhotosynthesisVsRespirationContent: TopicContent = {
  subjectSlug: "biology",
  topicSlug: "photosynthesis-vs-respiration",
  title: "Photosynthesis vs Cellular Respiration",
  subjectLabel: "Biology",
  topicLabel: "Plant Biology",
  colorToken: "biology",
  simulationHref: "/dashboard/biology/photosynthesis-vs-respiration",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Compare photosynthesis and cellular respiration's inputs, outputs, and associated organelles.",
      "Explain how the two processes' inputs and outputs connect to each other.",
      "Explain how matter cycles between the two processes, while energy is transformed rather than recycled the same way.",
      "Given a scenario, determine which process (or both) is occurring.",
    ],
    concepts: [
      {
        term: "Photosynthesis, recapped",
        explanation:
          "Photosynthesis uses light energy, carbon dioxide, and water to produce glucose and oxygen. It occurs in photosynthetic organisms and is associated with the chloroplast.",
      },
      {
        term: "Cellular respiration, recapped",
        explanation:
          "Cellular respiration breaks down glucose, using oxygen, to release usable energy as ATP, producing carbon dioxide and water as byproducts. It happens in the cells of most living organisms, and is strongly associated with the mitochondrion.",
      },
      {
        term: "How the two connect",
        explanation:
          "Photosynthesis produces glucose and oxygen — exactly what cellular respiration uses as inputs. Cellular respiration produces carbon dioxide and water — exactly what photosynthesis uses as inputs. The two processes' inputs and outputs are largely mirrored.",
      },
      {
        term: "Matter cycles; energy transforms",
        explanation:
          "The atoms in carbon dioxide and water can be reused by photosynthesis — that's matter cycling between the two processes. Energy doesn't cycle the same way: light energy is captured once, transferred into glucose, then released and spent as ATP during cellular work. It isn't recycled back into light.",
      },
      {
        term: "One important caveat",
        explanation:
          "Cellular respiration is strongly associated with mitochondria, but it isn't accurate to say it happens exclusively inside them. It's also worth noting that only photosynthetic organisms carry out photosynthesis, while cellular respiration happens in the cells of most living things — plants included.",
      },
    ],
    whyItMatters:
      "This connection is one of the most important ideas in the entire batch: it's why a plant cell isn't just doing one energy process, but running both, using each other's outputs as inputs. Seeing photosynthesis and cellular respiration as one connected story — rather than two separate lessons — is what this whole batch, from Introduction to Cellular Energy through here, has been building toward.",
    keyTerms: [
      { term: "Matter cycling", definition: "Atoms (like carbon and oxygen) being reused by different processes over time, rather than being permanently consumed." },
      { term: "Energy transformation", definition: "Energy changing from one form to another (light → chemical energy in glucose → ATP) as it moves through a system, rather than being recycled unchanged." },
    ],
    misconceptions: [
      {
        id: "misconception-energy-cycles-like-matter",
        misconception: "Energy cycles between photosynthesis and cellular respiration the same way matter (atoms) does.",
        correction:
          "Matter — the atoms in CO2 and H2O — can cycle between the two processes. Energy is different: it's transformed at each step (light → glucose → ATP → cellular work) and isn't recycled back into light the way matter is reused.",
      },
      {
        id: "misconception-plants-only-photosynthesize",
        misconception: "Plants only perform photosynthesis, and never perform cellular respiration.",
        correction:
          "Plant cells carry out both processes. Photosynthesis makes glucose using light energy; cellular respiration then breaks that glucose down (along with glucose from other sources) to produce usable ATP, the same as it does in other organisms' cells.",
      },
      {
        id: "misconception-only-one-at-a-time",
        misconception: "A plant can only be doing one of the two processes at any given moment, never both.",
        correction:
          "A plant cell can carry out cellular respiration continuously, while photosynthesis only happens when light is available. During the day, both processes can be happening in the same plant at the same time.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Predict first, then confirm using the comparison tools below.",
    scenarios: [
      {
        id: "biology-photosynthesis-vs-respiration-predict-001",
        scenario: "A cell is observed using glucose and oxygen, while releasing carbon dioxide and water.",
        question: "Which process does this match?",
        options: [
          { id: "matches-respiration", label: "Cellular respiration" },
          { id: "matches-photosynthesis", label: "Photosynthesis" },
        ],
        actualResultOptionId: "matches-respiration",
        explanation: "Using glucose and oxygen while releasing carbon dioxide and water matches cellular respiration's inputs and outputs, not photosynthesis's.",
        hint: "Which process's outputs are carbon dioxide and water?",
      },
      {
        id: "biology-photosynthesis-vs-respiration-predict-002",
        scenario: "You're about to click between the Photosynthesis and Cellular Respiration toggle buttons below.",
        question: "Will the 'Purpose' shown for each process be identical, or different?",
        options: [
          { id: "purposes-differ", label: "Different — one makes food using light, the other releases usable energy from food" },
          { id: "purposes-identical", label: "Identical — both processes serve exactly the same purpose" },
        ],
        actualResultOptionId: "purposes-differ",
        explanation: "The two processes serve different purposes: photosynthesis lets a plant make its own food using sunlight, while cellular respiration gives a cell usable energy (ATP) from that food.",
        hint: "What did Topics 2 and 4 each say these processes were for?",
      },
      {
        id: "biology-photosynthesis-vs-respiration-predict-003",
        scenario: "Consider the carbon dioxide and water that cellular respiration releases as byproducts.",
        question: "Can these byproducts be used again by photosynthesis?",
        options: [
          { id: "yes-reused", label: "Yes — they're exactly the raw materials photosynthesis needs" },
          { id: "no-lost-forever", label: "No — once released, they can never be used by any process again" },
        ],
        actualResultOptionId: "yes-reused",
        explanation: "Carbon dioxide and water, cellular respiration's byproducts, are exactly what photosynthesis needs as inputs — this is the matter-cycling connection between the two processes.",
        hint: "What does photosynthesis need as raw materials?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Start with the Quick Comparison table — notice how Energy, Main Inputs, Main Outputs, and Major Organelle line up (or contrast) between the two processes.",
      "Read the Cycle Diagram, tracing light energy through photosynthesis, into glucose and oxygen, through cellular respiration, and back out as carbon dioxide and water.",
      "Click the Photosynthesis and Cellular Respiration buttons below to reveal each process's full Inputs, Outputs, Energy, Organelle, and Purpose.",
      "Compare the two detail cards side by side — what's mirrored, and what's genuinely different (like Purpose)?",
    ],
    tryThis: [
      "🔬 Energy Pathway Challenge — given a biological scenario, determine: (1) Is photosynthesis occurring? (2) Is cellular respiration occurring? (3) What are the inputs? (4) What are the outputs? (5) Where does the energy come from? (6) Where does usable cellular energy come from?",
      "Explain in your own words why the Cycle Diagram's caption says energy doesn't cycle the same way matter does.",
      "Pick one row of the Quick Comparison table and explain why photosynthesis and cellular respiration have opposite values for it.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "biology-photosynthesis-vs-respiration-explain-001",
        question: "Why are photosynthesis's outputs exactly cellular respiration's inputs, and vice versa?",
        answer:
          "The two processes evolved to run in complementary directions: photosynthesis builds glucose and releases oxygen using light energy, and cellular respiration breaks that glucose back down using that oxygen. Each process's products are exactly what the other one consumes.",
      },
      {
        id: "biology-photosynthesis-vs-respiration-explain-002",
        question: "Why does the Cycle Diagram's caption distinguish between matter cycling and energy transforming?",
        answer:
          "It's a scientifically important distinction: the actual atoms in CO2 and H2O do get reused by photosynthesis, over and over. Energy, though, is captured once (as light), converted into glucose, then converted again into ATP and spent on cellular work — it doesn't loop back into light the way the matter loops back into new glucose.",
      },
      {
        id: "biology-photosynthesis-vs-respiration-explain-003",
        question: "Why can a plant cell be carrying out both photosynthesis and cellular respiration in daylight, at the same time?",
        answer:
          "Cellular respiration happens continuously in a plant's cells, the same as in any other organism's, using glucose (including glucose the plant made itself). Photosynthesis only happens when light is available. During the day, both can be running at once — they aren't mutually exclusive.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "biology-photosynthesis-vs-respiration",
  },

  // -------------------------------------------------------------
  // CHALLENGE — Energy Pathway Challenge (scenario-based reasoning)
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Use the comparison tools above to reason through each scenario, then answer the question.",
    scenarios: [
      {
        id: "biology-photosynthesis-vs-respiration-challenge-001",
        title: "🔬 Energy Pathway Challenge: The Sunlit Leaf",
        scenario: "A leaf is exposed to bright sunlight, with plenty of carbon dioxide and water available to it.",
        objective: "Determine which process is definitely being supplied with everything it needs to run, given these conditions.",
        tools: [{ id: "quick-comparison-table-tool", label: "Quick Comparison table" }],
        requiresExperiment: false, // Explore above already embeds the comparison tools on this page — a second copy would be redundant.
        answer: {
          mode: "choice",
          options: [
            { id: "photosynthesis-supplied", label: "Photosynthesis — light, CO2, and water are all available" },
            { id: "respiration-only-supplied", label: "Only cellular respiration, with photosynthesis unable to occur" },
            { id: "neither-supplied", label: "Neither process is occurring" },
          ],
          correctOptionId: "photosynthesis-supplied",
        },
        explanation: "Bright light, CO2, and water are exactly photosynthesis's inputs — this scenario describes the conditions it needs. (Cellular respiration continues too, but the scenario specifically supplies photosynthesis's requirements.)",
        hints: ["What three things does photosynthesis need to occur?"],
      },
      {
        id: "biology-photosynthesis-vs-respiration-challenge-002",
        title: "🔬 Energy Pathway Challenge: The Cell in the Dark",
        scenario: "A plant cell is kept in complete darkness but has glucose and oxygen available inside it.",
        objective: "Determine which process this cell can still carry out.",
        tools: [{ id: "process-toggle-tool", label: "Photosynthesis / Cellular Respiration toggle" }],
        requiresExperiment: false, // Explore above already embeds the comparison tools on this page — a second copy would be redundant.
        answer: {
          mode: "choice",
          options: [
            { id: "respiration-continues", label: "Cellular respiration — it doesn't require light" },
            { id: "photosynthesis-continues", label: "Photosynthesis — it doesn't require light" },
            { id: "neither-continues", label: "Neither process can occur in the dark" },
          ],
          correctOptionId: "respiration-continues",
        },
        explanation: "Cellular respiration doesn't need light — with glucose and oxygen available, it can continue in the dark. Photosynthesis, which does need light, cannot.",
        hints: ["Which process's inputs include light energy, and which one's don't?"],
      },
      {
        id: "biology-photosynthesis-vs-respiration-challenge-003",
        title: "🔬 Energy Pathway Challenge: Tracing the Outputs",
        scenario: "A student observes carbon dioxide and water being released by a cell.",
        objective: "Determine what usable form of cellular energy this same cell would have produced alongside those byproducts.",
        tools: [{ id: "process-detail-tool", label: "Process detail card (Cellular Respiration)" }],
        requiresExperiment: false, // Explore above already embeds the comparison tools on this page — a second copy would be redundant.
        answer: {
          mode: "choice",
          options: [
            { id: "atp-produced", label: "ATP" },
            { id: "glucose-produced", label: "Glucose" },
            { id: "oxygen-produced", label: "Oxygen" },
          ],
          correctOptionId: "atp-produced",
        },
        explanation: "Carbon dioxide and water being released points to cellular respiration — and ATP is the usable energy it produces alongside those byproducts.",
        hints: ["Which process releases CO2 and water, and what does that same process produce as its useful output?"],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "biology",
      topicSlug: "photosynthesis",
      label: "Photosynthesis",
      href: "/dashboard/biology/photosynthesis",
      reason: "Covers the process this topic compares against cellular respiration in full.",
    },
    {
      subjectSlug: "biology",
      topicSlug: "cellular-respiration",
      label: "Cellular Respiration",
      href: "/dashboard/biology/cellular-respiration",
      reason: "Covers the other half of this topic's comparison in full.",
    },
    {
      subjectSlug: "biology",
      topicSlug: "atp-energy-release",
      label: "ATP & Energy Release",
      href: "/dashboard/biology/atp-energy-release",
      reason: "A closer look at what happens to the ATP this topic's comparison identifies as cellular respiration's output.",
    },
  ],
};
