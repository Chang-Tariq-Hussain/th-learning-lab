import type { TopicContent } from "../types";

/**
 * Diffusion & Osmosis — Biology Batch 1 ("Cell Biology Foundations"),
 * topic 6 of 7 (see
 * `@/features/learning-path/data/biology-cell-foundations`).
 *
 * Reuses the same Cell Membrane & Transport simulation as Topic 5
 * (`@/features/subjects/biology/membrane-transport`), this time going
 * deep on the two modes it actually has — Diffusion and Osmosis —
 * rather than treating the membrane as a single concept. The Explore
 * and Challenge sections follow a predict → run → observe → explain
 * loop around the simulation's real "Start Diffusion"/"Start Osmosis"
 * + "Reset" controls (see `membrane-transport/model.ts`: Diffusion
 * spreads one kind of particle from crowded to sparse; Osmosis moves a
 * few water dots toward the side with more solute, with the chamber's
 * water level visibly shifting). Nothing here asks the student to
 * adjust a concentration or watch a solute cross — the simulation
 * doesn't support either, so this content doesn't pretend it does.
 *
 * `practice.quizId` points at a new, dedicated 15-question bank
 * (`@/features/quiz-engine/data/biology-diffusion-osmosis-quiz.ts`).
 */
export const biologyDiffusionOsmosisContent: TopicContent = {
  subjectSlug: "biology",
  topicSlug: "diffusion-osmosis",
  title: "Diffusion & Osmosis",
  subjectLabel: "Biology",
  topicLabel: "Cell Structure",
  colorToken: "biology",
  simulationHref: "/dashboard/biology/diffusion-osmosis",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Define diffusion and explain which direction particles move.",
      "Define dynamic equilibrium and explain what it means for particle movement to continue at equilibrium.",
      "Define osmosis and explain how it's different from diffusion in general.",
      "Predict the direction water will move in a basic osmosis scenario.",
    ],
    concepts: [
      {
        term: "Diffusion",
        explanation:
          "The movement of particles from an area of higher concentration toward an area of lower concentration, until they're spread roughly evenly. No pump or energy is required — it happens simply because there's more open space to spread into on the less-crowded side.",
      },
      {
        term: "Concentration gradient",
        explanation:
          "The difference in concentration between two areas. A bigger gradient (a bigger difference) generally means faster diffusion; once the gradient disappears, so does the net movement.",
      },
      {
        term: "Dynamic equilibrium",
        explanation:
          "The point where a substance is evenly distributed and there's no more NET movement in either direction — but individual particles are still moving randomly the whole time. \"No net movement\" doesn't mean \"no movement at all.\"",
      },
      {
        term: "Osmosis",
        explanation:
          "A specific, narrower case of diffusion: the movement of water — specifically water — across a selectively permeable membrane, from an area of low solute concentration toward an area of high solute concentration.",
      },
      {
        term: "Diffusion vs osmosis",
        explanation:
          "Diffusion is the general pattern (any particle moving from more concentrated to less concentrated). Osmosis is one specific case of that pattern: it's always about water, always across a membrane, and it moves toward more solute rather than away from more of itself.",
      },
    ],
    whyItMatters:
      "Diffusion and osmosis explain everyday things you've already noticed — why a drop of food coloring spreads through water on its own, why a wilted lettuce leaf perks back up in a bowl of water, and why a doctor picks a specific IV fluid concentration so it doesn't cause your blood cells to swell or shrink. They're also the foundation the next topic, active transport, is defined against — active transport is essentially \"the opposite of diffusion.\"",
    keyTerms: [
      { term: "Solute", definition: "A substance dissolved in a liquid — in osmosis, it's the solute's concentration that determines which way the water moves." },
      { term: "Net movement", definition: "The overall direction of movement once you account for particles moving both ways — at equilibrium, net movement is zero even though individual particles keep moving." },
      { term: "Selectively permeable membrane", definition: "A membrane that lets some substances (like water) cross while blocking others — required for osmosis specifically." },
    ],
    misconceptions: [
      {
        id: "misconception-equilibrium-means-stopped",
        misconception: "Once diffusion reaches equilibrium, all particle movement stops completely.",
        correction:
          "Individual particles keep moving randomly even at equilibrium — what stops is the NET movement in one direction, because roughly equal numbers are now moving each way at any given moment.",
      },
      {
        id: "misconception-osmosis-any-substance",
        misconception: "Osmosis describes any substance moving across a membrane.",
        correction:
          "Osmosis specifically describes water movement across a selectively permeable membrane. Any other substance diffusing across a membrane is just diffusion, not osmosis — osmosis is one narrow, water-specific case of the broader diffusion pattern.",
      },
      {
        id: "misconception-osmosis-toward-more-water",
        misconception: "In osmosis, water moves toward the side that already has more water.",
        correction:
          "It's the opposite: water moves toward the side with MORE solute (and therefore less water proportionally), diluting the more concentrated side rather than adding to whichever side has more water.",
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
        id: "biology-diffusion-osmosis-predict-001",
        scenario: "A gas is released in the corner of a sealed, still room. No one opens a door or turns on a fan.",
        question: "What will the gas do over time?",
        options: [
          { id: "spread-evenly", label: "Spread out until it's roughly evenly distributed through the room" },
          { id: "stay-in-corner", label: "Stay concentrated in that corner indefinitely" },
          { id: "leave-room", label: "Automatically leave through the walls" },
        ],
        actualResultOptionId: "spread-evenly",
        explanation: "This is diffusion at room scale — the gas moves from where it's crowded (the corner) toward where it's not (the rest of the room) until it's roughly evenly spread.",
        hint: "Which direction does diffusion always move — toward more crowding or away from it?",
      },
      {
        id: "biology-diffusion-osmosis-predict-002",
        scenario: "Diffusion has been running long enough that a substance is now evenly distributed and there's no more net movement in either direction.",
        question: "What's happening to the individual particles at this point?",
        options: [
          { id: "still-moving", label: "They're still moving randomly, just with no net direction" },
          { id: "completely-stopped", label: "They've completely stopped moving" },
        ],
        actualResultOptionId: "still-moving",
        explanation: "This is dynamic equilibrium — individual particles never stop moving, but with roughly equal numbers moving each direction at any moment, there's no more NET movement overall.",
        hint: "Does \"no net movement\" mean the same thing as \"no movement\"?",
      },
      {
        id: "biology-diffusion-osmosis-predict-003",
        scenario: "A cell is placed in a solution with a much higher solute concentration than the inside of the cell, and water can freely cross the cell's membrane.",
        question: "Which direction will water move?",
        options: [
          { id: "out-of-cell", label: "Out of the cell, into the surrounding solution" },
          { id: "into-cell", label: "Into the cell" },
          { id: "no-movement", label: "Water won't move" },
        ],
        actualResultOptionId: "out-of-cell",
        explanation: "In osmosis, water moves toward the side with MORE solute. Since the surrounding solution has the higher solute concentration here, water moves out of the cell and into that solution.",
        hint: "Which side has more solute — inside or outside the cell?",
      },
      {
        id: "biology-diffusion-osmosis-predict-004",
        scenario: "You're asked whether osmosis is a completely different process from diffusion, or a specific case of it.",
        question: "Which is correct?",
        options: [
          { id: "specific-case", label: "Osmosis is a specific case of diffusion, just for water across a membrane" },
          { id: "completely-different", label: "They're completely unrelated processes" },
        ],
        actualResultOptionId: "specific-case",
        explanation: "Osmosis follows the same basic higher-to-lower-concentration idea as diffusion — it's just specifically about water, and specifically across a selectively permeable membrane.",
        hint: "Do both processes involve movement from higher to lower concentration?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Select the Diffusion tab in the Cell Membrane & Transport simulation and look at the dots before pressing anything — one side is crowded, one is sparse.",
      "Press \"Start Diffusion\" and watch the particles spread out.",
      "Press \"Reset,\" then select the Osmosis tab, and look at the water dots and the fixed solute dots before pressing anything.",
      "Press \"Start Osmosis\" and watch which way the water dots move, and what happens to the water level in each chamber.",
    ],
    tryThis: [
      "Before running Osmosis, predict which chamber has more solute — that's the side water should move toward.",
      "After running Osmosis, describe in your own words what changed about the water level in each chamber.",
      "Run Diffusion again and try to identify the moment it looks like it's reached dynamic equilibrium.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "biology-diffusion-osmosis-explain-001",
        question: "Why does diffusion eventually slow down and stop showing net movement, instead of continuing forever?",
        answer:
          "As particles spread out, the concentration difference between the two sides shrinks. Diffusion's net movement depends on that gradient — once both sides are roughly equally concentrated, there's no gradient left to drive further net movement, even though individual particles keep moving.",
      },
      {
        id: "biology-diffusion-osmosis-explain-002",
        question: "Why does water move toward the side with MORE solute in osmosis, rather than the side with more water?",
        answer:
          "More solute on one side means proportionally less water on that side relative to the other. Water moves to even out that imbalance, diluting the more concentrated side — which means it moves toward wherever the solute concentration is higher.",
      },
      {
        id: "biology-diffusion-osmosis-explain-003",
        question: "The simulation you just used never shows solute itself crossing the membrane in Osmosis mode — only water does. Why might that be a reasonable simplification?",
        answer:
          "Osmosis is specifically defined as water movement across a selectively permeable membrane — the whole point of the concept is that water crosses while (in this simplified case) the solute doesn't, which is exactly why concentration differences on either side of the membrane can exist and drive the water's movement in the first place.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "biology-diffusion-osmosis",
  },

  // -------------------------------------------------------------
  // CHALLENGE — Diffusion Experiment + Osmosis Challenge
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Run each experiment in the Cell Membrane & Transport simulation above, then answer the question. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "biology-diffusion-osmosis-challenge-001",
        title: "Diffusion Experiment: Predict the Direction",
        scenario: "Before pressing anything, look at the Diffusion tab — one side starts with far more dots than the other.",
        objective: "Predict which direction the crowded side's particles will move once you press \"Start Diffusion.\"",
        tools: [{ id: "membrane-transport-diffusion-tab", label: "Diffusion tab — Start Diffusion / Reset" }],
        requiresExperiment: false, // Explore above already embeds the live simulation on this page — a second copy would be redundant.
        answer: {
          mode: "choice",
          options: [
            { id: "toward-sparse", label: "Toward the sparser side" },
            { id: "toward-crowded", label: "Deeper into the already-crowded side" },
            { id: "stay-put", label: "They won't move" },
          ],
          correctOptionId: "toward-sparse",
        },
        explanation: "Diffusion moves particles from higher concentration toward lower concentration — the crowded side's particles spread toward the sparser side until both are more evenly distributed.",
        hints: ["Which direction does diffusion always move — toward more crowding, or away from it?"],
      },
      {
        id: "biology-diffusion-osmosis-challenge-002",
        title: "Diffusion Experiment: Explain the Result",
        scenario: "After running \"Start Diffusion,\" the particles end up roughly evenly spread across both sides.",
        objective: "Explain why the particles stopped showing net movement once they were evenly spread, rather than continuing to move in one direction.",
        tools: [{ id: "membrane-transport-diffusion-result", label: "Diffusion tab, after pressing Start" }],
        requiresExperiment: false, // Explore above already embeds the live simulation on this page — a second copy would be redundant.
        answer: {
          mode: "choice",
          options: [
            { id: "no-gradient", label: "There's no concentration gradient left to drive further net movement" },
            { id: "particles-stopped", label: "The individual particles physically stopped moving" },
            { id: "membrane-closed", label: "The membrane closed and blocked further movement" },
          ],
          correctOptionId: "no-gradient",
        },
        explanation: "Once both sides are roughly equally concentrated, the concentration gradient that drove diffusion's net movement is gone — this is dynamic equilibrium, where individual particles keep moving but there's no more net direction to that movement.",
        hints: ["What does diffusion's net movement actually depend on?"],
      },
      {
        id: "biology-diffusion-osmosis-challenge-003",
        title: "Osmosis Challenge: Predict Water Movement",
        scenario: "Before pressing anything, look at the Osmosis tab — one chamber has far more fixed solute dots than the other.",
        objective: "Predict which chamber the water dots will move toward once you press \"Start Osmosis.\"",
        tools: [{ id: "membrane-transport-osmosis-tab", label: "Osmosis tab — Start Osmosis / Reset" }],
        requiresExperiment: false, // Explore above already embeds the live simulation on this page — a second copy would be redundant.
        answer: {
          mode: "choice",
          options: [
            { id: "toward-more-solute", label: "Toward the chamber with more solute" },
            { id: "toward-less-solute", label: "Toward the chamber with less solute" },
            { id: "no-movement", label: "The water won't move" },
          ],
          correctOptionId: "toward-more-solute",
        },
        explanation: "In osmosis, water moves toward the side with more solute — you should see several water dots cross toward the more-crowded-with-solute chamber, and that chamber's water level rise.",
        hints: ["Which chamber starts with more fixed solute dots?"],
      },
      {
        id: "biology-diffusion-osmosis-challenge-004",
        title: "Osmosis Challenge: Explain the Water Level Change",
        scenario: "After running \"Start Osmosis,\" one chamber's water level visibly rises and the other's visibly falls.",
        objective: "Explain why the water level changed the way it did, connecting it back to where the solute was concentrated.",
        tools: [{ id: "membrane-transport-osmosis-result", label: "Osmosis tab, after pressing Start" }],
        requiresExperiment: false, // Explore above already embeds the live simulation on this page — a second copy would be redundant.
        answer: {
          mode: "choice",
          options: [
            { id: "water-followed-solute", label: "Water moved toward the higher-solute chamber, raising its level" },
            { id: "water-followed-water", label: "Water moved toward the chamber that already had more water" },
            { id: "random", label: "The water level change was random and unrelated to solute" },
          ],
          correctOptionId: "water-followed-solute",
        },
        explanation: "The chamber with more solute drew water in through osmosis, which is exactly why its water level visibly rose while the lower-solute chamber's level fell.",
        hints: ["Which chamber's water level went up — the one with more or less solute?"],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "biology",
      topicSlug: "cell-membrane",
      label: "Cell Membrane",
      href: "/dashboard/biology/cell-membrane",
      reason: "Covers the selectively permeable membrane that both diffusion and osmosis cross.",
    },
  ],
};
