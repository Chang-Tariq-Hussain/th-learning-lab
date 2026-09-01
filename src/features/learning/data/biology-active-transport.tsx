import type { TopicContent } from "../types";

/**
 * Active Transport — Biology Batch 1 ("Cell Biology Foundations"),
 * topic 7 of 7, and the batch's final topic (see
 * `@/features/learning-path/data/biology-cell-foundations`).
 *
 * Reuses the existing Cell Membrane & Transport simulation
 * (`@/features/subjects/biology/membrane-transport`) — the same
 * component Cell Membrane and Diffusion & Osmosis already reuse —
 * rather than building a new one. Concretely, this topic is why that
 * simulation grew a third mode: it previously only supported
 * "diffusion" and "osmosis" (see that component's own doc comment),
 * and Active Transport has no analogous existing visual to reuse
 * as-is. The new "active-transport" mode was added as a minimal,
 * additive extension — a third tab, following the same particle/
 * membrane visual language as the other two modes, plus a small "ATP
 * used" counter that's the one thing genuinely new about it. Every
 * existing caller of `<MembraneTransport />` (Cell Membrane, the
 * standalone simulation page) is unaffected beyond gaining the extra
 * tab; nothing about Diffusion or Osmosis's own behavior changed.
 *
 * This page opens the simulation with `initialMode="active-transport"`
 * so the student lands directly on this topic's tab.
 *
 * `practice.quizId` points at a new, dedicated 15-question bank
 * (`@/features/quiz-engine/data/biology-active-transport-quiz.ts`).
 */
export const biologyActiveTransportContent: TopicContent = {
  subjectSlug: "biology",
  topicSlug: "active-transport",
  title: "Active Transport",
  subjectLabel: "Biology",
  topicLabel: "Cell Structure",
  colorToken: "biology",
  simulationHref: "/dashboard/biology/active-transport",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Define active transport and how it differs from diffusion.",
      "Explain why active transport requires energy.",
      "Identify real examples of active transport.",
      "Connect active transport to ATP, the cell's energy carrier.",
    ],
    concepts: [
      {
        term: "What active transport is",
        explanation:
          "Active transport is the movement of substances across a membrane against their concentration gradient — from an area of lower concentration to an area of higher concentration.",
      },
      {
        term: "Against the gradient",
        explanation:
          "This is the opposite direction from diffusion, which moves particles down their gradient (high to low) on its own. Moving a substance the other way — toward where it's already more concentrated — goes against how particles naturally tend to spread out, so it doesn't happen for free.",
      },
      {
        term: "Why it requires energy",
        explanation:
          "Because active transport works against the natural tendency of particles to spread out evenly, it requires an outside energy input to happen at all. A cell spends that energy through pump proteins embedded in its membrane.",
      },
      {
        term: "ATP",
        explanation:
          "ATP is the form of energy a cell typically spends to power active transport — the same immediate energy carrier Batch 2 covers in full. This topic is where the connection first gets flagged, before ATP itself is explained in depth.",
      },
      {
        term: "Structure enabling function",
        explanation:
          "Active transport depends on specific pump proteins built into the cell membrane's structure — without that structure, this particular function wouldn't be possible, the same structure-to-function idea Cell Organelles and Cell Membrane built toward.",
      },
    ],
    whyItMatters:
      "Active transport is what lets a cell get substances where it needs them, even when the natural direction of diffusion works against it — nerve cells use it to maintain the electrical differences they need to fire, and root cells use it to pull in nutrients from soil that's already more dilute than the root itself. It's also the missing piece connecting this batch to the next: it's the clearest example of why a cell needs the energy story Batch 2 (Cellular Energy & Life Processes) tells in full.",
    keyTerms: [
      { term: "Concentration gradient", definition: "The difference in concentration of a substance between two areas — diffusion moves substances down this gradient; active transport moves them up it." },
      { term: "Pump protein", definition: "A protein embedded in the cell membrane that actively moves specific substances across it, spending energy to do so." },
    ],
    misconceptions: [
      {
        id: "misconception-active-transport-like-diffusion",
        misconception: "Active transport is basically the same as diffusion, just with a different name.",
        correction:
          "They move substances in opposite directions relative to the concentration gradient: diffusion moves them down the gradient (high to low) without energy; active transport moves them up the gradient (low to high) and requires energy.",
      },
      {
        id: "misconception-active-transport-always-full",
        misconception: "A single round of active transport always moves every particle from the low-concentration side across to the high-concentration side.",
        correction:
          "A pump moves a limited number of particles at a time, not the entire side's worth in one instant — some particles can remain on the low-concentration side after active transport has taken place.",
      },
      {
        id: "misconception-no-energy-needed",
        misconception: "Since a cell membrane already lets some things pass through on their own (diffusion), active transport shouldn't need any extra energy either.",
        correction:
          "Passing through on their own (diffusion) and being pumped against the gradient (active transport) are fundamentally different — the second one works against the natural tendency of particles to spread out evenly, which is exactly why it requires an outside energy input that diffusion doesn't.",
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
        id: "biology-active-transport-predict-001",
        scenario: "You're about to press Start on the Active Transport tab. The Outside chamber already has more particles than the Inside chamber.",
        question: "After pressing Start, will the imbalance between Outside and Inside get smaller or greater?",
        options: [
          { id: "imbalance-greater", label: "Greater — the pump moves more particles to the already-crowded Outside side" },
          { id: "imbalance-smaller", label: "Smaller — the two sides will even out, the same as diffusion" },
        ],
        actualResultOptionId: "imbalance-greater",
        explanation: "Unlike diffusion, active transport pumps particles from the sparse side to the already-crowded side — making the imbalance greater, not smaller.",
        hint: "Which direction does active transport move particles relative to diffusion?",
      },
      {
        id: "biology-active-transport-predict-002",
        scenario: "Watch the 'ATP used' counter in the top-right of the stage before pressing Start.",
        question: "What will happen to that counter once you press Start?",
        options: [
          { id: "atp-counter-increases", label: "It will increase, since the pump spends ATP to move particles" },
          { id: "atp-counter-stays-zero", label: "It will stay at zero — this process doesn't use ATP" },
        ],
        actualResultOptionId: "atp-counter-increases",
        explanation: "The ATP used counter rises as the pump moves particles — a visible reminder that, unlike diffusion or osmosis, this process spends energy.",
        hint: "What makes active transport different from diffusion and osmosis?",
      },
      {
        id: "biology-active-transport-predict-003",
        scenario: "After the pump finishes running once, look at the Inside (low-concentration) chamber.",
        question: "Will every single particle have moved out of the Inside chamber, or will some remain?",
        options: [
          { id: "some-remain", label: "Some will remain — the pump only moves a limited number of particles per run" },
          { id: "all-move", label: "All of them will have moved to the Outside" },
        ],
        actualResultOptionId: "some-remain",
        explanation: "A pump moves specific particles at a time rather than instantly sweeping a whole side empty — some particles remain on the low-concentration side after one run.",
        hint: "Does a real pump move everything at once, or work through particles one (or a few) at a time?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "The simulation opens on the Active Transport tab — notice the Outside chamber already has more particles than the Inside chamber, and the ATP used counter reads 0.",
      "Press Start Pump and watch which particles move, and which direction they move.",
      "Watch the ATP used counter rise as the pump works.",
      "Switch to the Diffusion tab, reset it, and press Start there too — compare which direction particles move in each mode.",
      "Read the status message under the stage for each mode — notice which one mentions energy, and which doesn't.",
    ],
    tryThis: [
      "Before pressing Start Pump, predict how many particles you think will move, and which direction.",
      "After it finishes, explain in your own words why this movement needed ATP but diffusion didn't.",
      "Switch back and forth between Diffusion and Active Transport a few times — say out loud what's different about the starting picture versus the ending picture in each.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "biology-active-transport-explain-001",
        question: "Why does the simulation show the Outside side becoming even more crowded, rather than the two sides evening out?",
        answer:
          "That's the entire point of active transport: it moves particles from where they're scarce toward where they're already plentiful — the opposite of diffusion. Showing the imbalance grow, rather than shrink, is what makes that direction visible.",
      },
      {
        id: "biology-active-transport-explain-002",
        question: "Why does the ATP used counter only appear in Active Transport mode, and not in Diffusion or Osmosis?",
        answer:
          "Diffusion and osmosis are passive — they happen on their own, without the cell spending any energy. Active transport is the one mode of the three that requires energy, so it's the only one with something to count.",
      },
      {
        id: "biology-active-transport-explain-003",
        question: "How does this topic set up Batch 2 (Cellular Energy & Life Processes)?",
        answer:
          "This topic establishes that active transport needs energy, without yet fully explaining where that energy comes from. Batch 2 answers that directly: Introduction to Cellular Energy introduces ATP, and later topics explain exactly how a cell produces it and spends it on jobs like this one.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "biology-active-transport",
  },

  // -------------------------------------------------------------
  // CHALLENGE — Predict → Run → Explain mission
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Run the simulation above, then answer each question. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "biology-active-transport-challenge-001",
        title: "Identify the Direction",
        scenario: "Compare the Diffusion tab and the Active Transport tab, both before pressing Start.",
        objective: "Identify which direction particles move in Active Transport, relative to Diffusion.",
        tools: [{ id: "active-transport-tabs", label: "Diffusion and Active Transport tabs" }],
        requiresExperiment: false, // Explore above already embeds the live simulation on this page — a second copy would be redundant.
        answer: {
          mode: "choice",
          options: [
            { id: "opposite-direction", label: "The opposite direction — toward higher concentration instead of toward lower" },
            { id: "same-direction", label: "The same direction as diffusion" },
            { id: "no-clear-direction", label: "No particular direction in either mode" },
          ],
          correctOptionId: "opposite-direction",
        },
        explanation: "Diffusion moves particles toward lower concentration; active transport moves them toward higher concentration — genuinely opposite directions.",
        hints: ["Which side gets more crowded in Active Transport — the one that started crowded, or the one that started sparse?"],
      },
      {
        id: "biology-active-transport-challenge-002",
        title: "Observe the Energy Cost",
        scenario: "Press Start Pump and watch the ATP used counter.",
        objective: "Determine what the counter demonstrates about active transport.",
        tools: [{ id: "active-transport-atp-counter", label: "ATP used counter" }],
        requiresExperiment: false, // Explore above already embeds the live simulation on this page — a second copy would be redundant.
        answer: {
          mode: "choice",
          options: [
            { id: "demonstrates-energy-cost", label: "That moving particles against their gradient costs the cell energy" },
            { id: "demonstrates-no-cost", label: "That this process actually costs nothing" },
            { id: "unrelated-to-energy", label: "Something unrelated to energy" },
          ],
          correctOptionId: "demonstrates-energy-cost",
        },
        explanation: "The rising ATP used counter demonstrates exactly what makes active transport different: it spends energy to move particles, unlike the passive modes.",
        hints: ["Why does only this mode, out of the three, have a counter like this?"],
      },
      {
        id: "biology-active-transport-challenge-003",
        title: "Real-World Example",
        scenario: "A root cell needs to absorb a mineral nutrient that's already more concentrated inside the root than in the surrounding soil.",
        objective: "Identify which process the root cell would need to use.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "needs-active-transport", label: "Active transport, since the nutrient must move against its concentration gradient" },
            { id: "needs-diffusion", label: "Diffusion, since nutrients always move into cells that way" },
            { id: "needs-nothing", label: "No process is needed — it would happen automatically" },
          ],
          correctOptionId: "needs-active-transport",
        },
        explanation: "Moving a substance into a region where it's already more concentrated is moving against the gradient — exactly the situation active transport, not diffusion, is needed for.",
        hints: ["Is the nutrient moving toward lower or higher concentration in this scenario?"],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "biology",
      topicSlug: "diffusion-osmosis",
      label: "Diffusion & Osmosis",
      href: "/dashboard/biology/diffusion-osmosis",
      reason: "The passive counterpart to active transport — same simulation, opposite direction, no energy required.",
    },
    {
      subjectSlug: "biology",
      topicSlug: "cellular-energy",
      label: "Introduction to Cellular Energy",
      href: "/dashboard/biology/cellular-energy",
      reason: "Explains ATP in full — the energy this topic identifies active transport as spending.",
    },
    {
      subjectSlug: "biology",
      topicSlug: "atp-energy-release",
      label: "ATP & Energy Release",
      href: "/dashboard/biology/atp-energy-release",
      reason: "Revisits active transport specifically as an example of cellular work ATP powers.",
    },
  ],
};
