import type { TopicContent } from "../types";

/**
 * Ecosystem Explorer — Biology GLE Batch 5 ("Ecology & Ecosystems"),
 * topic 1 of 2. Reuses the existing `EcosystemExplorer` simulation
 * (`@/features/subjects/biology/ecosystem-explorer`) exactly as-is —
 * it already models a ten-component pond/forest scene (Sun, Air,
 * Water, Soil, Tree, Grass, Insect, Rabbit, Bird, Fungus) with a
 * click-to-inspect Ecosystem Scene, a Biotic/Abiotic toggle, an
 * Explore Roles picker (Producer/Consumer/Decomposer), a two-lever
 * Balance Experiment (remove plants, reduce water), and a built-in
 * mini-challenge — so no simulation code changes were needed. Every
 * Learn, Predict, Explain, and Challenge item is grounded in the
 * simulation's own `COMPONENTS` list and role/category data in
 * `ecosystem-model.ts`, never an invented organism.
 */
export const biologyEcosystemExplorerContent: TopicContent = {
  subjectSlug: "biology",
  topicSlug: "ecosystem-explorer",
  title: "Ecosystem Explorer",
  subjectLabel: "Biology",
  topicLabel: "Ecology & Ecosystems",
  colorToken: "biology",
  simulationHref: "/dashboard/biology/ecosystem-explorer",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Define an ecosystem and distinguish its biotic components from its abiotic components.",
      "Explain the relationship between an organism, a population, a community, and an ecosystem.",
      "Identify producers, consumers, and decomposers, and explain the role each plays.",
      "Describe how energy moves through an ecosystem, starting from the Sun.",
      "Predict what happens to an ecosystem when one part of it changes.",
    ],
    concepts: [
      {
        term: "What is an ecosystem?",
        explanation:
          "An ecosystem is all the living things in an area interacting with each other and with the non-living parts of their environment — sunlight, water, air, and soil. The pond-and-forest scene in this simulation is one small example: ten components, living and non-living, all connected.",
      },
      {
        term: "Biotic vs. abiotic components",
        explanation:
          "Biotic components are the living parts of an ecosystem — in this scene, the Tree, Grass, Insect, Rabbit, Bird, and Fungus. Abiotic components are the non-living parts that living things depend on — here, the Sun, Air, Water, and Soil. Every biotic component in the scene depends on at least one abiotic component to survive.",
      },
      {
        term: "Organism, population, community, ecosystem",
        explanation:
          "An organism is a single living thing — one rabbit. A population is all the members of one species living in the same area — every rabbit in the scene. A community is every population of every species living together — the rabbits, birds, insects, trees, grass, and fungus, all at once. An ecosystem is that community plus the abiotic factors (sun, air, water, soil) it interacts with.",
      },
      {
        term: "Habitat",
        explanation:
          "A habitat is the specific place an organism lives and finds what it needs — food, water, shelter. The pond-and-forest scene itself is the habitat shared by every organism shown in it.",
      },
      {
        term: "Producers",
        explanation:
          "Producers make their own food, usually using sunlight through photosynthesis. In this scene, the Tree and Grass are producers — they don't need to eat anything else to get energy, and they're the entry point energy uses to get into the rest of the ecosystem.",
      },
      {
        term: "Consumers, including primary, secondary, and higher levels",
        explanation:
          "Consumers get their energy by eating other organisms rather than making their own food. A primary consumer eats producers directly — the Insect and Rabbit in this scene eat Grass. A secondary consumer eats primary consumers — the Bird here eats the Insect. Higher-level consumers continue the pattern, eating the consumers below them.",
      },
      {
        term: "Decomposers",
        explanation:
          "Decomposers break down dead organic matter — fallen leaves, dead animals — and return the nutrients locked inside it to the soil. The Fungus in this scene is a decomposer: its relationship chain runs Dead organic matter → Fungus → Soil nutrients, closing the loop so producers can use those nutrients again.",
      },
      {
        term: "Energy flow through the ecosystem",
        explanation:
          "Energy enters the ecosystem as sunlight, gets captured by producers, and then moves step by step as one organism eats another: Sunlight → Plants (Tree, Grass) → Animals that eat them (Insect, Rabbit) → Animals that eat those (Bird). Energy generally flows in one direction — it doesn't cycle back the way nutrients do.",
      },
      {
        term: "Nutrient cycling",
        explanation:
          "Unlike energy, nutrients do cycle. When decomposers break down dead organic matter, they release nutrients back into the soil, where producers can take them up again through their roots — the same cycle the Fungus's relationship chain shows: dead matter → decomposer → soil nutrients → (back to producers).",
      },
      {
        term: "Ecosystem balance and biodiversity",
        explanation:
          "An ecosystem stays balanced when its populations of producers, consumers, and decomposers can keep supporting each other. Biodiversity — having many different species playing different roles — makes an ecosystem more resilient, since the loss of one species is less likely to collapse the whole system. The Balance Experiment shows this directly: removing plants or reducing water disrupts the organisms that depend on them.",
      },
    ],
    whyItMatters:
      "Every real ecosystem — a backyard pond, a forest, a coral reef — runs on the same basic structure this scene models in miniature: abiotic factors support producers, producers support consumers, and decomposers recycle what's left so the cycle can continue. Understanding these roles and relationships is what lets ecologists predict what happens when a species disappears, a drought hits, or a new species is introduced somewhere it doesn't belong.",
    keyTerms: [
      { term: "Ecosystem", definition: "All the living things in an area, interacting with each other and with the non-living parts of their environment." },
      { term: "Biotic component", definition: "A living part of an ecosystem — plants, animals, fungi, and other organisms." },
      { term: "Abiotic component", definition: "A non-living part of an ecosystem, such as sunlight, water, air, or soil." },
      { term: "Population", definition: "All the members of one species living in the same area." },
      { term: "Community", definition: "All the populations of all the species living together in an area." },
      { term: "Habitat", definition: "The specific place an organism lives and finds what it needs to survive." },
      { term: "Producer", definition: "An organism that makes its own food, usually using sunlight through photosynthesis." },
      { term: "Consumer", definition: "An organism that gets energy by eating other organisms." },
      { term: "Decomposer", definition: "An organism that breaks down dead organic matter and returns nutrients to the environment." },
    ],
    misconceptions: [
      {
        id: "misconception-abiotic-not-important",
        misconception: "Abiotic factors like water and soil aren't really part of the ecosystem — only the living things are.",
        correction:
          "Abiotic factors are just as much a part of the ecosystem as living things. The Sun powers photosynthesis, water and soil support plant growth, and air supplies the carbon dioxide and oxygen organisms need. Without them, none of the biotic components could survive.",
      },
      {
        id: "misconception-decomposers-recycle-energy",
        misconception: "Decomposers put energy back into the ecosystem the same way they put nutrients back into the soil.",
        correction:
          "Decomposers recycle nutrients, not energy. Energy that's been used by living things (as heat, movement, or growth) is gone from the ecosystem for good — it doesn't get collected and reused. Only new sunlight captured by producers brings fresh energy in.",
      },
      {
        id: "misconception-population-community-same",
        misconception: "Population and community mean the same thing.",
        correction:
          "A population is every member of one species in an area — just the rabbits, for example. A community is every population of every species in that area together — the rabbits, birds, insects, trees, grass, and fungus all at once. A community is made up of many populations.",
      },
      {
        id: "misconception-consumers-only-eat-plants",
        misconception: "All consumers eat plants directly.",
        correction:
          "Only primary consumers eat producers directly, like the Insect and Rabbit eating Grass. Secondary and higher-level consumers eat other consumers instead — the Bird in this scene eats the Insect, not the Grass.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Commit to a prediction before checking a component's role in the Ecosystem Scene or running the Balance Experiment — then see what actually happens.",
    scenarios: [
      {
        id: "biology-ecosystem-explorer-predict-001",
        scenario: "You click on the Water component in the Ecosystem Scene.",
        question: "Which category does Water belong to?",
        options: [
          { id: "abiotic", label: "Abiotic — a non-living component" },
          { id: "biotic", label: "Biotic — a living component" },
          { id: "producer", label: "A producer" },
          { id: "decomposer", label: "A decomposer" },
        ],
        actualResultOptionId: "abiotic",
        explanation: "Water is an abiotic factor — a non-living part of the ecosystem that nearly every organism in the scene depends on.",
        hint: "Ask whether Water is alive.",
      },
      {
        id: "biology-ecosystem-explorer-predict-002",
        scenario: "You select the Tree in the scene and check its role.",
        question: "What role does the Tree play?",
        options: [
          { id: "producer", label: "Producer — it makes its own food" },
          { id: "consumer", label: "Consumer — it eats other organisms" },
          { id: "decomposer", label: "Decomposer — it breaks down dead matter" },
          { id: "abiotic", label: "Abiotic factor" },
        ],
        actualResultOptionId: "producer",
        explanation: "The Tree is a producer — it makes its own food using sunlight, water, and air, without needing to eat anything else.",
        hint: "Producers are the components that don't eat anything else to get energy.",
      },
      {
        id: "biology-ecosystem-explorer-predict-003",
        scenario: "You select the Bird and read its description: it gets energy by eating insects and seeds.",
        question: "What role does this make the Bird?",
        options: [
          { id: "consumer", label: "Consumer" },
          { id: "producer", label: "Producer" },
          { id: "decomposer", label: "Decomposer" },
          { id: "abiotic", label: "Abiotic factor" },
        ],
        actualResultOptionId: "consumer",
        explanation: "Eating other organisms to get energy — rather than making its own food — is exactly what makes the Bird a consumer.",
        hint: "Does the Bird make its own food, or get it from something else?",
      },
      {
        id: "biology-ecosystem-explorer-predict-004",
        scenario: "You select the Fungus and read its relationship chain: Dead organic matter → Fungus → Soil nutrients.",
        question: "What role does this relationship chain describe?",
        options: [
          { id: "decomposer", label: "Decomposer" },
          { id: "producer", label: "Producer" },
          { id: "primary-consumer", label: "Primary consumer" },
          { id: "abiotic", label: "Abiotic factor" },
        ],
        actualResultOptionId: "decomposer",
        explanation: "Breaking down dead organic matter and returning nutrients to the soil is exactly the decomposer's role — that's what the Fungus does.",
        hint: "This component isn't eating anything living — it's breaking down what's already dead.",
      },
      {
        id: "biology-ecosystem-explorer-predict-005",
        scenario: "In the Balance Experiment, you toggle 'Remove Plants.'",
        question: "What happens to organisms like the Insect and Rabbit that depend on plants for food?",
        options: [
          { id: "affected", label: "They're affected, since plants are an important food and energy source for them" },
          { id: "unaffected", label: "Nothing changes for them" },
          { id: "become-producers", label: "They become producers themselves" },
          { id: "become-decomposers", label: "They become decomposers instead" },
        ],
        actualResultOptionId: "affected",
        explanation: "Removing plants affects the organisms that depend on them for food and energy, since plants are the producers at the base of this scene's energy flow.",
        hint: "Trace which organisms' relationship chains start with a plant like Grass or Tree.",
      },
      {
        id: "biology-ecosystem-explorer-predict-006",
        scenario: "You click 'Explore Roles' and select the Decomposer role.",
        question: "Which component(s) get highlighted?",
        options: [
          { id: "fungus-only", label: "Only the Fungus" },
          { id: "tree-grass", label: "The Tree and Grass" },
          { id: "insect-rabbit-bird", label: "The Insect, Rabbit, and Bird" },
          { id: "sun-air-water-soil", label: "The Sun, Air, Water, and Soil" },
        ],
        actualResultOptionId: "fungus-only",
        explanation: "Fungus is the only component in this scene whose role is decomposer, so it's the only one highlighted when you select that role.",
        hint: "How many decomposers does this scene's component list actually include?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Click any of the ten components in the Ecosystem Scene — Sun, Air, Water, Soil, Tree, Grass, Insect, Rabbit, Bird, Fungus — to see its role and a one-line explanation.",
      "Use the Biotic vs Abiotic toggle to highlight every living component at once, then every non-living one.",
      "Use Explore Roles to highlight every Producer, then every Consumer, then the Decomposer, and compare group sizes.",
      "Select a component with a relationship chain (Sun, Soil, Tree, Grass, Insect, Rabbit, Bird, Fungus) and read the animated flow it shows.",
      "Run the Balance Experiment: toggle Remove Plants, then Reduce Water, and read what the simulation says happens to dependent organisms.",
      "Try the built-in Mini Challenge to test whether you can identify a producer, an abiotic factor, and a decomposer's role from memory.",
    ],
    tryThis: [
      "Pick one producer (Tree or Grass) and name every consumer in the scene that ultimately depends on it for energy.",
      "Compare the Biotic count to the Abiotic count in this scene — which category has more components?",
      "Toggle Remove Plants in the Balance Experiment, then explain out loud, in your own words, why that message appears.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "biology-ecosystem-explorer-explain-001",
        question: "Why does removing the Grass in the Balance Experiment affect organisms like the Insect and Rabbit, even though they aren't grass themselves?",
        answer:
          "The Insect and Rabbit are primary consumers whose relationship chains both start with Grass — it's their direct food source and, through it, their source of energy. Producers like Grass are the entry point for energy into the rest of the ecosystem, so removing them removes the energy source everything downstream of them depends on.",
      },
      {
        id: "biology-ecosystem-explorer-explain-002",
        question: "Why is the Fungus classified as a decomposer instead of a consumer, even though it's also getting energy from other organisms?",
        answer:
          "The distinction is what it's feeding on and what it does with it. Consumers eat living organisms (or parts of them) for energy — the Insect eats living Grass. Decomposers instead break down dead organic matter, and in doing so, they return the nutrients locked inside it to the soil, which is exactly what the Fungus's relationship chain (Dead organic matter → Fungus → Soil nutrients) shows. That nutrient-recycling role is unique to decomposers.",
      },
      {
        id: "biology-ecosystem-explorer-explain-003",
        question: "Why are abiotic factors like Sun, Air, Water, and Soil included in an ecosystem model at all, if they aren't alive?",
        answer:
          "Every biotic component in the scene depends on at least one abiotic factor to survive — the Tree and Grass need sunlight, water, and soil nutrients to grow; every animal needs air to breathe. An ecosystem isn't just the living things in an area, it's those living things together with the non-living conditions that make their survival possible, so leaving abiotic factors out would leave the model incomplete.",
      },
      {
        id: "biology-ecosystem-explorer-explain-004",
        question: "Why does the simulation only highlight one component (the Fungus) when you select the Decomposer role, but several when you select Producer or Consumer?",
        answer:
          "This is simply how many components in this ten-part scene actually hold each role — the Tree and Grass are Producers (2), the Insect, Rabbit, and Bird are Consumers (3), and only the Fungus is a Decomposer (1). A real ecosystem usually has many more decomposer species than this simplified scene shows, but the roles and relationships they demonstrate are the same.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    // Foreign key into the quiz-engine registry — all questions live
    // in @/features/quiz-engine/data/biology-ecosystem-gle-quiz.ts.
    // Deliberately a new id, not the pre-existing 6-question
    // "biology-ecosystem" bank (still used by the standalone
    // /dashboard/biology/ecosystem-quiz page), to avoid a duplicate
    // registration — same "-gle" precedent used for Meiosis and
    // Nervous System.
    quizId: "biology-ecosystem-gle",
  },

  // -------------------------------------------------------------
  // CHALLENGE
  // -------------------------------------------------------------
  challenge: {
    intro: "Harder, realistic problems than ordinary Practice. Use the Ecosystem Scene, Biotic/Abiotic toggle, Explore Roles picker, and Balance Experiment to check anything you're unsure of.",
    scenarios: [
      {
        id: "biology-ecosystem-explorer-challenge-001",
        title: "Classify the Component",
        scenario: "In the Ecosystem Scene, select Soil and read its description and relationship chain.",
        objective: "Determine which category — biotic or abiotic — Soil belongs to.",
        tools: [{ id: "ecosystem-scene", label: "Ecosystem Scene" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Abiotic" },
            { id: "b", label: "Biotic" },
            { id: "c", label: "It's both, depending on context" },
            { id: "d", label: "Neither — soil isn't part of an ecosystem" },
          ],
          correctOptionId: "a",
        },
        explanation: "Soil is a non-living abiotic factor. It holds nutrients and water that plant roots take up, and it's also where decomposers return nutrients from dead organic matter.",
        hints: ["Ask whether Soil is alive, the same way you would for Water or Air."],
      },
      {
        id: "biology-ecosystem-explorer-challenge-002",
        title: "Identify the Role",
        scenario: "The Rabbit's description says it obtains energy by eating plants.",
        objective: "Identify the Rabbit's role in this ecosystem.",
        tools: [{ id: "ecosystem-scene", label: "Ecosystem Scene" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Consumer" },
            { id: "b", label: "Producer" },
            { id: "c", label: "Decomposer" },
            { id: "d", label: "Abiotic factor" },
          ],
          correctOptionId: "a",
        },
        explanation: "The Rabbit gets its energy by eating grass rather than making its own food, which makes it a consumer — specifically a primary consumer, since it eats a producer directly.",
        hints: ["Does the Rabbit make its own food, or get it from another organism?"],
      },
      {
        id: "biology-ecosystem-explorer-challenge-003",
        title: "Predict the Ripple Effect",
        scenario: "You run the Balance Experiment and toggle Remove Plants.",
        objective: "Determine which organisms in this scene are most directly affected, and why.",
        tools: [{ id: "balance-experiment", label: "Balance Experiment" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "The Insect and Rabbit, since plants are their direct food and energy source" },
            { id: "b", label: "The Sun, since it also disappears" },
            { id: "c", label: "The Fungus, since decomposers eat plants directly" },
            { id: "d", label: "No organisms are affected" },
          ],
          correctOptionId: "a",
        },
        explanation: "The Insect and Rabbit are primary consumers whose food comes directly from plants (Grass and Tree). Removing plants removes their food and energy source.",
        hints: ["Look at which organisms' relationship chains start with Grass or Tree."],
      },
      {
        id: "biology-ecosystem-explorer-challenge-004",
        title: "Explain a Nutrient Cycle",
        scenario: "The Fungus's relationship chain reads: Dead organic matter → Fungus → Soil nutrients.",
        objective: "Explain what this chain shows about how nutrients move through the ecosystem.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Decomposers break down dead matter and return its nutrients to the soil, where producers can use them again" },
            { id: "b", label: "Decomposers convert dead matter directly into new sunlight energy" },
            { id: "c", label: "Nutrients disappear permanently once an organism dies" },
            { id: "d", label: "This chain shows a food chain, not a nutrient cycle" },
          ],
          correctOptionId: "a",
        },
        explanation: "This chain is the nutrient cycle in miniature: the Fungus (a decomposer) breaks down dead organic matter and releases its nutrients into the soil, where producers like Grass and Tree can take them up again through their roots.",
        hints: ["Think about the difference between energy flow, which doesn't cycle, and nutrient cycling, which does."],
      },
      {
        id: "biology-ecosystem-explorer-challenge-005",
        title: "Trace the Energy Path",
        scenario: "Consider the Bird, whose description says it gets energy by eating insects and seeds from plants.",
        objective: "Trace the shortest full energy path from the Sun to the Bird, using only organisms and factors in this scene.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Sun → Grass → Insect → Bird" },
            { id: "b", label: "Sun → Bird directly" },
            { id: "c", label: "Sun → Fungus → Bird" },
            { id: "d", label: "Soil → Bird directly" },
          ],
          correctOptionId: "a",
        },
        explanation: "Energy starts as sunlight, is captured by Grass (a producer), passes to the Insect (a primary consumer that eats Grass), and finally to the Bird (a secondary consumer that eats the Insect).",
        hints: ["Start from the Sun and follow only real feeding relationships shown in the scene, one step at a time."],
      },
      {
        id: "biology-ecosystem-explorer-challenge-006",
        title: "Diagnose the Incorrect Description",
        scenario: "A student says: \"Water is a biotic component because every living thing needs it to survive.\"",
        objective: "Identify what's wrong with this description.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Water is abiotic — being needed by living things doesn't make something itself alive" },
            { id: "b", label: "Nothing is wrong with this description" },
            { id: "c", label: "Water isn't part of an ecosystem at all" },
            { id: "d", label: "Water is a producer, not biotic or abiotic" },
          ],
          correctOptionId: "a",
        },
        explanation: "Being essential to living things doesn't make something biotic — biotic strictly means alive or once alive. Water is a non-living, abiotic factor, even though nearly every organism in the ecosystem depends on it.",
        hints: ["Biotic vs. abiotic is about whether the thing itself is alive, not about how important it is."],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "biology",
      topicSlug: "food-chain-web",
      label: "Food Chain & Food Web",
      href: "/dashboard/biology/food-chain-web",
      reason: "Take the producer/consumer/decomposer roles from this ecosystem and follow the exact path energy takes as it moves between them.",
    },
    {
      subjectSlug: "biology",
      topicSlug: "photosynthesis",
      label: "Photosynthesis",
      href: "/dashboard/biology/photosynthesis",
      reason: "See the cellular process — capturing sunlight to make food — that makes producers like the Tree and Grass the entry point for energy in this ecosystem.",
    },
  ],
};
