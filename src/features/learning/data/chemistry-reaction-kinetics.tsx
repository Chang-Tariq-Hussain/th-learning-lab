import type { TopicContent } from "../types";

/**
 * Reaction Kinetics — Chemistry Batch 3's third GLE topic, brought up
 * from the earlier `SimulationLearnMore` pattern to the full standard,
 * matching Reaction Builder and Equation Balancer above. The
 * simulation itself (`@/features/subjects/chemistry/reaction-kinetics`)
 * was already thorough — 11 levels covering collision theory,
 * successful vs. failed collisions, concentration, temperature,
 * surface area, catalysts, a live rate/progress graph, and a
 * side-by-side comparison mode — so nothing there needed rebuilding,
 * only this GLE wrapper and an expanded question bank
 * (`chemistry-reaction-kinetics` in `@/features/quiz-engine`, grown
 * from 5 to 15 questions).
 */
export const chemistryReactionKineticsContent: TopicContent = {
  subjectSlug: "chemistry",
  topicSlug: "reaction-kinetics",
  title: "Reaction Kinetics",
  subjectLabel: "Chemistry",
  topicLabel: "Reaction Kinetics",
  colorToken: "chemistry",
  simulationHref: "/dashboard/chemistry/reaction-kinetics",

  learn: {
    objectives: [
      "Explain collision theory: particles must collide with enough energy and the right orientation to react.",
      "Describe how temperature, concentration, surface area, and catalysts each affect reaction rate.",
      "Read a rate/progress-vs-time graph and connect its shape to what's happening at the particle level.",
      "Explain how a catalyst speeds up a reaction without being consumed by it.",
    ],
    concepts: [
      {
        term: "Collision theory",
        explanation:
          "For a reaction to happen, particles first have to physically collide. But not every collision succeeds — only a \"successful\" collision, one with enough energy (at least the activation energy) and the right orientation, actually breaks and forms bonds to make a new product. Most collisions just bounce apart.",
      },
      {
        term: "Reaction rate",
        explanation:
          "Reaction rate is how quickly reactants turn into products — how many successful collisions are happening per second, essentially. It's not a fixed property of a reaction; it changes with conditions like temperature and concentration.",
      },
      {
        term: "Temperature",
        explanation:
          "Raising the temperature speeds up a reaction two ways at once: particles move faster, so they collide more often, and each collision carries more energy on average, so a larger share of those collisions clear the activation-energy bar and succeed.",
      },
      {
        term: "Concentration",
        explanation:
          "More concentrated reactants means particles are packed more tightly together, so on average each one runs into another reactant particle sooner — more frequent collisions per second means a faster reaction.",
      },
      {
        term: "Surface area",
        explanation:
          "A solid reactant can only react where its surface is exposed to the other reactant. Breaking a solid into smaller pieces (like crushing a lump into powder) exposes far more total surface area without changing the amount of reactant, letting many more collisions happen at once.",
      },
      {
        term: "Catalysts",
        explanation:
          "A catalyst provides an alternative reaction pathway with a lower activation energy, so more collisions clear the bar and succeed. It comes out of the reaction chemically unchanged, so the same catalyst keeps working on more reactant rather than being used up.",
      },
    ],
    whyItMatters:
      "Controlling reaction rate is how chemists and engineers make chemistry practical: refrigeration slows the reactions that spoil food, catalytic converters in cars use catalysts to clean up exhaust fast enough to matter, and industrial processes carefully tune temperature and concentration to make products efficiently without wasting energy.",
    keyTerms: [
      { term: "Collision theory", definition: "The idea that a reaction requires particles to collide with sufficient energy and correct orientation." },
      { term: "Activation energy", definition: "The minimum energy a collision needs to actually result in a reaction." },
      { term: "Reaction rate", definition: "How quickly reactants are converted into products." },
      { term: "Catalyst", definition: "A substance that speeds up a reaction by lowering its activation energy, without being consumed." },
    ],
    misconceptions: [
      {
        id: "misconception-any-collision-reacts",
        misconception: "Every collision between reactant particles causes a reaction.",
        correction:
          "Most collisions actually fail — either the particles don't hit with enough energy to clear the activation-energy barrier, or they collide at the wrong angle for the right atoms to meet. Only a small fraction of collisions, the \"successful\" ones, actually result in a reaction.",
      },
      {
        id: "misconception-catalyst-consumed",
        misconception: "A catalyst gets used up during the reaction, just like a reactant.",
        correction:
          "A catalyst participates in the reaction pathway but comes out chemically unchanged at the end. It isn't consumed the way reactants are, which is why the same small amount of catalyst can keep speeding up reaction after reaction.",
      },
      {
        id: "misconception-temperature-only-frequency",
        misconception: "Raising the temperature only makes particles collide more often, nothing else.",
        correction:
          "Temperature affects rate two ways at once: particles do collide more frequently, but each collision also carries more energy on average, meaning a larger share of collisions succeed. Both effects combine to speed up the reaction — it's not frequency alone.",
      },
    ],
  },

  predict: {
    intro: "Commit to a prediction before running the simulation below — then test it and check your answer.",
    scenarios: [
      {
        id: "chemistry-reaction-kinetics-predict-001",
        scenario: "Two identical reaction mixtures are set up — one at 20°C, one at 60°C — with everything else the same.",
        question: "Which one reaches its final amount of product first?",
        options: [
          { id: "hot", label: "The 60°C mixture — higher temperature increases both collision frequency and the share of successful collisions" },
          { id: "cold", label: "The 20°C mixture — cooler particles react more predictably" },
          { id: "same", label: "Both finish at the same time — temperature doesn't affect the rate" },
        ],
        actualResultOptionId: "hot",
        explanation:
          "The hotter mixture reaches the same final amount of product sooner. Higher temperature gives particles more kinetic energy, so they collide more often, and a larger fraction of those collisions carry enough energy to succeed.",
        hint: "Think about what temperature does to both how often particles collide and how much energy each collision carries.",
      },
      {
        id: "chemistry-reaction-kinetics-predict-002",
        scenario: "A solid reactant is used in two trials: once as a single large lump, once crushed into fine powder — same total mass either time.",
        question: "Which trial reacts faster?",
        options: [
          { id: "powder", label: "The powder — far more surface area is exposed for collisions" },
          { id: "lump", label: "The lump — it's more concentrated in one place" },
          { id: "same", label: "Both react at the same rate, since it's the same total amount of reactant" },
        ],
        actualResultOptionId: "powder",
        explanation:
          "The powder reacts much faster. A solid can only react where its surface is exposed to the other reactant — breaking it into smaller pieces exposes far more total surface area, letting many more collisions happen at once, even though the total mass hasn't changed.",
        hint: "Where can a solid reactant actually react — only at its surface, or throughout its entire volume at once?",
      },
      {
        id: "chemistry-reaction-kinetics-predict-003",
        scenario: "A catalyst is added to a reaction mixture, and the reaction is run to completion.",
        question: "After the reaction finishes, what has happened to the catalyst?",
        options: [
          { id: "unchanged", label: "It's chemically unchanged and could be reused" },
          { id: "consumed", label: "It's fully consumed, just like a reactant" },
          { id: "product", label: "It became part of the final product molecules" },
        ],
        actualResultOptionId: "unchanged",
        explanation:
          "A defining feature of a catalyst is that it comes out of the reaction chemically unchanged. It speeds up the reaction by opening a lower-energy pathway, but it isn't consumed — the same catalyst is available to keep speeding up further reactions.",
        hint: "What's the key difference between how a catalyst behaves and how an actual reactant behaves?",
      },
    ],
  },

  explore: {
    howToUse: [
      "Work through the levels using the level navigation — each one builds on the previous idea.",
      "Watch the particle chamber closely: notice collisions that bounce apart versus ones that actually react.",
      "Use the sliders for temperature, concentration, and surface area to see their effect on the particle chamber and the rate graph in real time.",
      "Try the Catalyst level to see how the energy pathway changes with and without one.",
      "In the Compare level, run two conditions side by side and watch which reaches completion first.",
    ],
    tryThis: [
      "At the Collisions level, count how many collisions you see happen before one actually succeeds — is it every single one?",
      "Raise the temperature slider to its maximum and watch what happens to both the collision frequency and the rate graph's steepness.",
      "In the Compare level, set up matching conditions except for one variable (like temperature) and see how much of a difference that one change makes.",
    ],
  },

  explain: {
    questions: [
      {
        id: "chemistry-reaction-kinetics-explain-001",
        question: "Why do most particle collisions in the simulation not result in a reaction?",
        answer:
          "A collision only succeeds if it clears two requirements at once: it has enough energy (at least the activation energy) and the particles are oriented correctly for the right atoms to meet. Most random collisions fail one or both, so they just bounce apart without reacting — which is why the successful-collision fraction is usually small.",
      },
      {
        id: "chemistry-reaction-kinetics-explain-002",
        question: "Why does raising the temperature make the rate graph rise more steeply?",
        answer:
          "A steeper rate graph means product is forming faster. Higher temperature increases both how often particles collide and what fraction of those collisions carry enough energy to succeed — both effects combine to produce product more quickly per second, which shows up as a steeper early slope on the graph.",
      },
      {
        id: "chemistry-reaction-kinetics-explain-003",
        question: "Why does a catalyst speed up a reaction without changing the reactants' or products' total energy?",
        answer:
          "A catalyst only changes the pathway between reactants and products, opening up a route with a lower activation-energy peak — it doesn't change the energy of the starting reactants or the final products at all. More collisions clear this lower barrier, so the reaction goes faster, even though the overall energy released or absorbed by the reaction stays exactly the same.",
      },
      {
        id: "chemistry-reaction-kinetics-explain-004",
        question: "Why does a reaction's rate typically slow down as it proceeds, even without changing the temperature?",
        answer:
          "As reactants are converted into products, there are fewer reactant particles left in the mixture, which lowers their concentration. Lower concentration means less frequent collisions between reactant particles, so the rate naturally drops off over time — visible as the rate graph's curve flattening out as it approaches completion.",
      },
    ],
  },

  practice: {
    quizId: "chemistry-reaction-kinetics",
  },

  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice. Use the live simulation below to check your reasoning before answering.",
    scenarios: [
      {
        id: "chemistry-reaction-kinetics-challenge-001",
        title: "Speed Up a Sluggish Reaction",
        scenario:
          "An industrial reaction between a solid catalyst-free reactant and a gas is taking far too long to finish, and the factory needs it to go faster without changing what substances are used.",
        objective: "Identify which single change would most directly speed up the reaction, using only factors covered in this simulation.",
        constraints: [
          { id: "c1", label: "You can't add a different substance — only adjust physical conditions or the physical form of the existing reactant." },
        ],
        tools: [
          { id: "temp-slider", label: "Temperature slider" },
          { id: "surface-slider", label: "Surface area / particle-size control" },
          { id: "concentration-slider", label: "Concentration slider" },
        ],
        answer: {
          mode: "choice",
          options: [
            { id: "crush-and-heat", label: "Crush the solid into smaller pieces and raise the temperature — both increase collision frequency and successful-collision fraction" },
            { id: "cool-it", label: "Lower the temperature to make the reaction more controlled and therefore faster" },
            { id: "do-nothing", label: "Reaction rate can't be changed without adding a different substance" },
          ],
          correctOptionId: "crush-and-heat",
        },
        explanation:
          "Both crushing the solid (more surface area, more collisions possible) and raising the temperature (faster particles, higher share of successful collisions) directly increase reaction rate, and neither requires changing what substances are involved — just their physical form and conditions.",
        hints: [
          "Which factors from this simulation change the physical conditions of a reaction without introducing a new substance?",
          "Try the Surface Area and Temperature levels in the simulation and compare their effect on the rate graph.",
        ],
        maxAttempts: 4,
      },
      {
        id: "chemistry-reaction-kinetics-challenge-002",
        title: "Explain the Graph",
        scenario:
          "Two rate graphs are shown for the same reaction run under different conditions: Graph A rises steeply and flattens out quickly; Graph B rises gradually and takes much longer to flatten, but both graphs reach the same final height.",
        objective: "Determine what's most likely different between the two conditions that produced Graph A versus Graph B.",
        constraints: [
          { id: "c1", label: "Both trials use the same total amount of reactant, since they reach the same final height." },
        ],
        tools: [
          { id: "compare-level", label: "Compare level — set up two conditions side by side and watch their graphs" },
        ],
        answer: {
          mode: "choice",
          options: [
            { id: "faster-condition", label: "Graph A used a faster condition (like higher temperature or concentration) than Graph B" },
            { id: "different-reactant", label: "Graph A used a completely different reactant than Graph B" },
            { id: "cant-tell", label: "There's no way to tell anything about the conditions from a rate graph" },
          ],
          correctOptionId: "faster-condition",
        },
        explanation:
          "Since both graphs reach the same final amount of product, the amount of reactant was the same in both cases — what differs is the rate. A steeper, faster-flattening curve (Graph A) reflects a faster condition, like higher temperature, higher concentration, a catalyst, or more surface area, compared to Graph B's slower condition.",
        hints: [
          "If both graphs end at the same height, what does that tell you about how much product was ultimately made in each trial?",
          "Use the Compare level to set two different temperatures with everything else matching, and see which shape of graph that produces.",
        ],
        maxAttempts: 4,
      },
      {
        id: "chemistry-reaction-kinetics-challenge-003",
        title: "Real-World Mission: Why Refrigeration Works",
        scenario:
          "Food left at room temperature spoils (via chemical reactions caused by bacteria and enzymes) much faster than food kept in a refrigerator.",
        objective: "Using collision theory, explain why lowering the temperature slows down the reactions responsible for spoilage.",
        constraints: [
          { id: "c1", label: "Your explanation should reference collision frequency and/or collision energy specifically, not just 'cold slows things down.'" },
        ],
        tools: [
          { id: "temp-slider", label: "Temperature slider — compare a low-temperature run to a high-temperature run" },
        ],
        answer: {
          mode: "choice",
          options: [
            { id: "fewer-successful-collisions", label: "Lower temperature means particles move slower, so they collide less often, and fewer of those collisions carry enough energy to succeed — slowing the spoilage reactions" },
            { id: "reactants-freeze", label: "Cold temperature physically removes the reactants involved in spoilage" },
            { id: "no-connection", label: "Temperature doesn't actually affect the reactions responsible for spoilage" },
          ],
          correctOptionId: "fewer-successful-collisions",
        },
        explanation:
          "Refrigeration works by slowing down reaction rate, not by removing any reactants. Lower temperature means the particles involved in spoilage reactions move more slowly, colliding less often, and a smaller share of those collisions carry enough energy to succeed — both effects combine to dramatically slow down the reactions that cause food to spoil.",
        hints: [
          "Run the Temperature level at a low setting and a high setting, and compare both the collision frequency and the rate graph.",
          "Spoilage is just a set of chemical reactions — everything this simulation teaches about rate applies to it too.",
        ],
        maxAttempts: 4,
        requiresExperiment: false,
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "chemistry",
      topicSlug: "equation-balancer",
      label: "Equation Balancer",
      href: "/dashboard/chemistry/equation-balancer",
      reason: "A balanced equation tells you what a reaction produces — kinetics tells you how fast it gets there.",
    },
    {
      subjectSlug: "chemistry",
      topicSlug: "reaction-builder",
      label: "Chemical Reaction Builder",
      href: "/dashboard/chemistry/reaction-builder",
      reason: "Revisit what's actually happening to atoms and bonds during the reactions kinetics describes the speed of.",
    },
  ],
};
