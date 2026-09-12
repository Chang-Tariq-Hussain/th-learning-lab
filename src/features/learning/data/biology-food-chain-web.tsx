import type { TopicContent } from "../types";

/**
 * Food Chain & Food Web — Biology GLE Batch 5 ("Ecology &
 * Ecosystems"), topic 2 of 2. Reuses the existing `FoodChainWeb`
 * simulation (`@/features/subjects/biology/food-chain-web`) exactly
 * as-is — it already models a grassland Food Chain mode (Sun → Grass
 * → Grasshopper → Frog → Snake → Hawk, with an illustrative Energy
 * Flow ladder), a Food Web mode (the same organisms plus Rabbit and
 * Bird, connected by eight feeding edges), a Trophic Level picker, a
 * Remove Grasshoppers experiment, a Decomposers panel, and a built-in
 * mini-challenge — so no simulation code changes were needed. Every
 * Learn, Predict, Explain, and Challenge item is grounded in the
 * simulation's own `ORGANISMS`, `CHAIN_SEQUENCE`, `WEB_EDGES`, and
 * `ENERGY_LADDER` data in `food-web-model.ts`, never an invented
 * organism or connection. Arrows throughout follow the simulation's
 * own convention: from what's eaten to what eats it.
 */
export const biologyFoodChainWebContent: TopicContent = {
  subjectSlug: "biology",
  topicSlug: "food-chain-web",
  title: "Food Chain & Food Web",
  subjectLabel: "Biology",
  topicLabel: "Ecology & Ecosystems",
  colorToken: "biology",
  simulationHref: "/dashboard/biology/food-chain-web",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Explain what a food chain shows and in which direction its arrows point.",
      "Identify producers, primary consumers, secondary consumers, and tertiary/higher-level consumers in a chain.",
      "Explain why a food web is a more realistic model of feeding relationships than a single food chain.",
      "Describe how energy decreases as it moves to higher trophic levels.",
      "Predict what happens to a food web when one organism's population is removed or increases.",
    ],
    concepts: [
      {
        term: "Food chain",
        explanation:
          "A food chain is a single pathway showing who eats whom, in order. This simulation's chain is Sun → Grass → Grasshopper → Frog → Snake → Hawk. Each arrow points from the organism being eaten to the organism that eats it — the direction energy is transferred, not the direction of an attack.",
        formula: "\\text{Grass} \\rightarrow \\text{Grasshopper} \\rightarrow \\text{Frog}",
        formulaCaption: "Arrows point from what's eaten to what eats it",
      },
      {
        term: "Trophic levels",
        explanation:
          "A trophic level is an organism's position in the feeding sequence. Level 1 is Producers (Grass). Level 2 is Primary consumers, which eat producers directly (Grasshopper, Rabbit). Level 3 is Secondary consumers, which eat primary consumers (Frog, Bird). Level 4 is Tertiary/higher-level consumers, which eat secondary consumers (Snake, Hawk).",
      },
      {
        term: "Producers and consumers, by level",
        explanation:
          "Grass is the producer, making its own food from sunlight. Grasshopper and Rabbit are primary consumers, eating Grass directly. Frog and Bird are secondary consumers — the Frog eats insects like the Grasshopper, and the Bird eats insects too. Snake and Hawk are the highest-level consumers here, each obtaining energy by eating other animals.",
      },
      {
        term: "Energy transfer and energy loss",
        explanation:
          "Energy enters this food chain as sunlight, is captured by Grass, and then transfers step by step as each organism eats the one before it. At every step, a large share of the energy is lost — used for movement, growth, and given off as heat — so only a small fraction passes on to the next level. The simulation's Energy Flow ladder shows this dropping sharply: roughly 100% at the Sun, ~10% at Grass, ~1% at Grasshopper, and so on, each step down by about a factor of ten.",
      },
      {
        term: "Food web",
        explanation:
          "A food web is a network of many overlapping food chains, since most real organisms eat more than one thing and get eaten by more than one predator. In Food Web mode, the same organisms are connected by eight feeding edges instead of one straight line: Grass feeds both Grasshopper and Rabbit; Grasshopper feeds both Frog and Bird; Rabbit and Frog both feed Snake; Bird and Snake both feed Hawk.",
      },
      {
        term: "Why food webs are more realistic than food chains",
        explanation:
          "A single food chain only shows one possible path energy could take. The food web shows that Grasshoppers aren't only eaten by Frogs — Birds eat them too — and that Snakes aren't only fed by Rabbits — Frogs feed them as well. Real ecosystems always look like this tangle of connections rather than one isolated line, which is why removing a single organism can affect many others at once, not just the one 'next' organism in a single chain.",
      },
      {
        term: "Removing or increasing a population",
        explanation:
          "Because organisms in a food web are connected to more than one other organism, a change to one population ripples outward. The simulation's Remove Grasshoppers experiment shows this directly: taking Grasshoppers out of the web means less food is available for the Frog and Bird (which both ate Grasshoppers), while Grass experiences less grazing pressure, since one of its consumers is gone.",
      },
      {
        term: "Decomposers close the loop",
        explanation:
          "Decomposers sit outside the food chain/web itself, but they're what closes the nutrient loop: Dead organic matter → Decomposers → Nutrients → Producers. They break down dead organisms from any trophic level and return the nutrients to the soil, where producers like Grass can take them up again. Decomposers recycle nutrients, not the energy itself — energy that's already been used doesn't return to the system this way.",
      },
    ],
    whyItMatters:
      "Ecologists use food chains and food webs to trace how energy moves through an ecosystem and to predict the ripple effects of change — a new predator being introduced, a species going extinct, a population crashing. A real grassland or forest never actually runs on a single food chain the way a textbook diagram might suggest; it's always a food web, and that's exactly why removing even one species can have consequences that reach well past its most obvious predator or prey.",
    keyTerms: [
      { term: "Food chain", definition: "A single pathway showing the order in which organisms eat one another, with energy flowing from producer to consumer." },
      { term: "Food web", definition: "A network of overlapping food chains showing how organisms are connected through multiple feeding relationships." },
      { term: "Trophic level", definition: "An organism's position in a feeding sequence — producer, primary consumer, secondary consumer, and so on." },
      { term: "Primary consumer", definition: "An organism that eats producers directly." },
      { term: "Secondary consumer", definition: "An organism that eats primary consumers." },
      { term: "Tertiary consumer", definition: "A higher-level consumer that eats secondary consumers." },
      { term: "Decomposer", definition: "An organism that breaks down dead organic matter and returns nutrients — not energy — to the ecosystem." },
    ],
    misconceptions: [
      {
        id: "misconception-arrow-direction",
        misconception: "A food chain's arrows point from the predator to its prey, showing 'who attacks whom.'",
        correction:
          "Arrows point the opposite way: from the organism being eaten to the organism that eats it — the direction energy is transferred. Grass → Grasshopper means the Grasshopper eats Grass, not the reverse.",
      },
      {
        id: "misconception-energy-increases",
        misconception: "Energy increases as it moves up to higher trophic levels, since predators need more energy to hunt.",
        correction:
          "Energy actually decreases sharply at each step up the chain. Most of the energy an organism takes in is used for its own life processes or lost as heat, so only a small fraction passes on to whatever eats it next — the simulation's Energy Flow ladder drops by roughly a factor of ten at every level.",
      },
      {
        id: "misconception-decomposers-recycle-energy",
        misconception: "Decomposers recycle energy back into the food chain, the same way they recycle nutrients.",
        correction:
          "Decomposers recycle nutrients, not energy. They break down dead organic matter and return nutrients like nitrogen and minerals to the soil for producers to reuse — but the energy that living things already used is gone from the system, not recovered.",
      },
      {
        id: "misconception-food-chain-realistic",
        misconception: "A single food chain is a complete, accurate picture of feeding relationships in an ecosystem.",
        correction:
          "A food chain only shows one possible path. Real organisms usually eat more than one thing and are eaten by more than one predator — which is exactly what Food Web mode shows: Grasshoppers are eaten by both Frogs and Birds, and Snakes are fed by both Rabbits and Frogs. A food web is the more realistic model.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Commit to a prediction before checking the Food Chain, switching to Food Web mode, or running the Remove Grasshoppers experiment — then see what actually happens.",
    scenarios: [
      {
        id: "biology-food-chain-web-predict-001",
        scenario: "You're looking at the food chain arrow between Grass and Grasshopper: Grass → Grasshopper.",
        question: "What does this arrow mean?",
        options: [
          { id: "grasshopper-eats-grass", label: "The Grasshopper eats the Grass" },
          { id: "grass-eats-grasshopper", label: "The Grass eats the Grasshopper" },
          { id: "grasshopper-attacks-grass", label: "The Grasshopper attacks the Grass" },
          { id: "no-relationship", label: "They have no feeding relationship" },
        ],
        actualResultOptionId: "grasshopper-eats-grass",
        explanation: "The arrow points from what's eaten to what eats it — Grass is eaten by the Grasshopper, so the arrow runs Grass → Grasshopper.",
        hint: "Arrows show the direction energy moves, from the eaten organism to the eater.",
      },
      {
        id: "biology-food-chain-web-predict-002",
        scenario: "You check the Trophic Level Picker and select Level 2.",
        question: "Which organisms get highlighted at Level 2 (Primary consumers)?",
        options: [
          { id: "grasshopper-rabbit", label: "Grasshopper and Rabbit" },
          { id: "grass-only", label: "Grass only" },
          { id: "frog-bird", label: "Frog and Bird" },
          { id: "snake-hawk", label: "Snake and Hawk" },
        ],
        actualResultOptionId: "grasshopper-rabbit",
        explanation: "Grasshopper and Rabbit are both primary consumers — they eat Grass, the producer, directly, which places them at trophic level 2.",
        hint: "Primary consumers are the organisms that eat the producer.",
      },
      {
        id: "biology-food-chain-web-predict-003",
        scenario: "You switch from Food Chain mode to Food Web mode.",
        question: "What changes about the Grasshopper's connections?",
        options: [
          { id: "more-connections", label: "It gains a connection to the Bird, in addition to the Frog" },
          { id: "no-change", label: "Nothing changes" },
          { id: "loses-connections", label: "It loses its connection to Grass" },
          { id: "becomes-producer", label: "It becomes a producer" },
        ],
        actualResultOptionId: "more-connections",
        explanation: "In Food Web mode, the Grasshopper connects to both the Frog and the Bird — the single food chain only ever showed the Frog connection.",
        hint: "The web has more edges than the chain — think about who else eats a Grasshopper.",
      },
      {
        id: "biology-food-chain-web-predict-004",
        scenario: "You look at the Energy Flow ladder from Sun to Hawk.",
        question: "What happens to the amount of energy available at each step up the ladder?",
        options: [
          { id: "decreases", label: "It decreases sharply at each step" },
          { id: "increases", label: "It increases at each step" },
          { id: "stays-same", label: "It stays exactly the same at each step" },
          { id: "resets", label: "It resets back to 100% at each step" },
        ],
        actualResultOptionId: "decreases",
        explanation: "The Energy Flow ladder drops sharply at each step — roughly 100% at the Sun down to a tiny fraction by the time it reaches the Hawk — since most energy is lost as heat or used for life processes at each level.",
        hint: "Think about why top predators like the Hawk are always much rarer than producers like Grass.",
      },
      {
        id: "biology-food-chain-web-predict-005",
        scenario: "You run the Remove Grasshoppers experiment.",
        question: "Which organisms does the simulation say are affected?",
        options: [
          { id: "frog-bird-grass", label: "Frog and Bird (less food) and Grass (less grazing pressure)" },
          { id: "hawk-only", label: "Only the Hawk" },
          { id: "nothing", label: "Nothing is affected" },
          { id: "sun", label: "The Sun" },
        ],
        actualResultOptionId: "frog-bird-grass",
        explanation: "Removing Grasshoppers reduces the food available to Frog and Bird, which both ate Grasshoppers, while Grass experiences less grazing pressure since it's no longer being eaten by Grasshoppers.",
        hint: "Look for organisms directly connected to the Grasshopper in the web.",
      },
      {
        id: "biology-food-chain-web-predict-006",
        scenario: "You check the Decomposers panel: Dead organic matter → Decomposers → Nutrients → Producers.",
        question: "What does this chain show decomposers recycling?",
        options: [
          { id: "nutrients", label: "Nutrients, which return to producers" },
          { id: "energy", label: "Energy, which returns to the top of the chain" },
          { id: "oxygen", label: "Oxygen, which returns to the air" },
          { id: "nothing", label: "Nothing — decomposers don't recycle anything" },
        ],
        actualResultOptionId: "nutrients",
        explanation: "This chain shows nutrient cycling: decomposers break down dead matter and release nutrients that producers can take up again — not energy, which is used up rather than recycled.",
        hint: "Compare this to the Energy Flow ladder, which only ever goes down, never back up.",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Start in Food Chain mode and click through each organism — Sun, Grass, Grasshopper, Frog, Snake, Hawk — reading its role and description.",
      "Open the Trophic Level Picker and select each level in turn (1 through 4) to see which organisms occupy it.",
      "Use the Energy Flow panel's Play control to watch the Energy Flow ladder animate from Sun to Hawk, and note how sharply the percentage drops at each step.",
      "Switch to Food Web mode and compare: click the same organisms and notice how many more connections most of them now have.",
      "Run the Remove Grasshoppers experiment and read which organisms the simulation identifies as affected, and why.",
      "Open the Decomposers panel and read the Dead organic matter → Decomposers → Nutrients → Producers cycle.",
      "Try the built-in Mini Challenge to test whether you can identify a trophic level and describe what a food web shows.",
    ],
    tryThis: [
      "In Food Web mode, click the Snake and count how many organisms connect directly to it — compare that to how many connected to it in Food Chain mode.",
      "Narrate the full Food Chain out loud, in order, saying 'eaten by' between each pair: 'Grass, eaten by Grasshopper, eaten by Frog...' and so on to the Hawk.",
      "After running Remove Grasshoppers, predict out loud what you think would happen if Rabbits were removed instead, then check your reasoning against the web's actual connections.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "biology-food-chain-web-explain-001",
        question: "Why does the amount of energy available drop so sharply at each step of the Energy Flow ladder, instead of transferring fully from one organism to the next?",
        answer:
          "Every organism uses most of the energy it takes in for its own life processes — moving, growing, maintaining body temperature — and a large share of it is given off as heat rather than stored in a form the next consumer could eat. Only the energy actually stored in an organism's body is available to whatever eats it next, which is why the ladder drops by roughly a factor of ten at each step: from Sun, to Grass, to Grasshopper, and onward to the Hawk.",
      },
      {
        id: "biology-food-chain-web-explain-002",
        question: "Why does removing the Grasshoppers from the food web affect both the Frog/Bird and the Grass, even though those are on opposite 'sides' of the Grasshopper?",
        answer:
          "The Grasshopper sits between the Grass and its own predators in the web, so removing it breaks connections in both directions. Frog and Bird lose one of their food sources, since both ate Grasshoppers — that's the effect moving 'up' the web. At the same time, Grass loses one of the organisms that was grazing on it, meaning less grazing pressure — that's the effect moving 'down.' A single organism's removal ripples in both directions whenever it's connected to more than one neighbor.",
      },
      {
        id: "biology-food-chain-web-explain-003",
        question: "Why is a food web considered more realistic than a single food chain, if the food chain is easier to follow?",
        answer:
          "A single food chain is easier to follow precisely because it leaves things out — it only shows one path, like Grass → Grasshopper → Frog, when in reality the Grasshopper is also eaten by the Bird, and the Frog is also eaten by the Snake. Real ecosystems have exactly this kind of overlap: most organisms eat more than one thing and get eaten by more than one predator. The food web keeps all of those real connections instead of picking just one strand, which is what makes it the more accurate model, even though it's more complex to read.",
      },
      {
        id: "biology-food-chain-web-explain-004",
        question: "Why do decomposers recycle nutrients but not energy?",
        answer:
          "Nutrients — like the minerals locked in a dead organism's body — are physical matter that decomposers can break down and release back into the soil largely unchanged, ready for a producer to take up again through its roots. Energy isn't matter in that same reusable sense: once an organism has used its stored energy for movement, growth, or heat, that energy has already dissipated and can't be collected and handed back into the system. Decomposers close the nutrient loop, but energy only ever flows one direction through the chain, and each ecosystem needs a constant new supply of it from the Sun.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    // Foreign key into the quiz-engine registry — all questions live
    // in @/features/quiz-engine/data/biology-food-chain-web-quiz.ts.
    // No pre-existing quiz for this topic, so this is a brand-new id
    // rather than a "-gle" variant of an older bank.
    quizId: "biology-food-chain-web",
  },

  // -------------------------------------------------------------
  // CHALLENGE
  // -------------------------------------------------------------
  challenge: {
    intro: "Harder, realistic problems than ordinary Practice. Use Food Chain mode, Food Web mode, the Trophic Level Picker, the Energy Flow panel, and the Remove Grasshoppers experiment to check anything you're unsure of.",
    scenarios: [
      {
        id: "biology-food-chain-web-challenge-001",
        title: "Order the Chain",
        scenario: "Consider this scrambled list of organisms from the simulation's food chain: Hawk, Grass, Grasshopper, Frog, Snake.",
        objective: "Identify the correct feeding order, from producer to top consumer.",
        tools: [{ id: "food-chain-mode", label: "Food Chain mode" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Grass → Grasshopper → Frog → Snake → Hawk" },
            { id: "b", label: "Hawk → Snake → Frog → Grasshopper → Grass" },
            { id: "c", label: "Grass → Frog → Grasshopper → Hawk → Snake" },
            { id: "d", label: "Grasshopper → Grass → Frog → Snake → Hawk" },
          ],
          correctOptionId: "a",
        },
        explanation: "The correct order, and the simulation's own chain, is Grass → Grasshopper → Frog → Snake → Hawk — each arrow pointing from what's eaten to what eats it.",
        hints: ["Start with the producer — the only organism here that doesn't eat anything else."],
      },
      {
        id: "biology-food-chain-web-challenge-002",
        title: "Assign the Trophic Level",
        scenario: "The Bird eats insects such as Grasshoppers for energy.",
        objective: "Determine the Bird's trophic level.",
        tools: [{ id: "trophic-level-picker", label: "Trophic Level Picker" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Level 3 — Secondary consumer" },
            { id: "b", label: "Level 1 — Producer" },
            { id: "c", label: "Level 2 — Primary consumer" },
            { id: "d", label: "Level 4 — Tertiary consumer" },
          ],
          correctOptionId: "a",
        },
        explanation: "Since the Bird eats a primary consumer (the Grasshopper, which itself eats Grass), the Bird is a secondary consumer at trophic level 3.",
        hints: ["Trace the Bird's food back one step at a time: what does it eat, and what did that organism eat?"],
      },
      {
        id: "biology-food-chain-web-challenge-003",
        title: "Repair an Incorrect Chain",
        scenario: "A student writes the food chain as: Hawk → Grass → Snake.",
        objective: "Identify what's wrong with this chain and how it should actually read, using only organisms from this simulation.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "The arrows are backwards and skip steps — it should read Grass → Grasshopper → Frog → Snake → Hawk" },
            { id: "b", label: "Nothing is wrong with this chain" },
            { id: "c", label: "Hawk should come first because it's the strongest" },
            { id: "d", label: "Grass doesn't belong in a food chain at all" },
          ],
          correctOptionId: "a",
        },
        explanation: "The student's chain has the arrow direction reversed (it should start from the producer, not the top predator) and skips intermediate organisms. The correct chain is Grass → Grasshopper → Frog → Snake → Hawk.",
        hints: ["Check both the direction of the arrows and whether any organisms are missing from the sequence."],
      },
      {
        id: "biology-food-chain-web-challenge-004",
        title: "Explore a Food Web",
        scenario: "In Food Web mode, select the Snake and look at every organism it directly connects to.",
        objective: "Identify all of the Snake's direct connections in the web.",
        tools: [{ id: "food-web-mode", label: "Food Web mode" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Rabbit and Frog (which it eats) and Hawk (which eats it)" },
            { id: "b", label: "Only the Hawk" },
            { id: "c", label: "Only the Grass" },
            { id: "d", label: "Every organism in the web" },
          ],
          correctOptionId: "a",
        },
        explanation: "The Snake's web edges connect it to Rabbit and Frog (both of which it eats) and Hawk (which eats the Snake) — three direct connections total.",
        hints: ["Look for every edge that touches the Snake, in either direction."],
      },
      {
        id: "biology-food-chain-web-challenge-005",
        title: "Predict a Population Effect",
        scenario: "Imagine the Rabbit population in this food web increases sharply.",
        objective: "Predict the most direct effects on the organisms connected to the Rabbit.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "More grazing pressure on Grass, and more food available for the Snake" },
            { id: "b", label: "Less food available for the Hawk directly" },
            { id: "c", label: "The Sun's energy output decreases" },
            { id: "d", label: "No organisms are affected, since Rabbit only appears in Food Web mode" },
          ],
          correctOptionId: "a",
        },
        explanation: "The Rabbit is connected to Grass (which it eats) and Snake (which eats it). More Rabbits means more grazing pressure on Grass and more available food for the Snake — the same kind of ripple effect the Remove Grasshoppers experiment demonstrates in reverse.",
        hints: ["Use the Rabbit's two web connections — one producer, one predator — the same way the Remove Grasshoppers experiment traces effects."],
      },
      {
        id: "biology-food-chain-web-challenge-006",
        title: "Explain Energy vs. Nutrients",
        scenario: "A student claims: \"Decomposers put energy back into the food chain the same way they put nutrients back into the soil.\"",
        objective: "Determine whether this claim is accurate.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Inaccurate — decomposers recycle nutrients, not energy, which isn't recovered once used" },
            { id: "b", label: "Accurate — decomposers recycle both equally" },
            { id: "c", label: "Inaccurate — decomposers don't recycle anything" },
            { id: "d", label: "Accurate, but only for producers, not consumers" },
          ],
          correctOptionId: "a",
        },
        explanation: "Decomposers do recycle nutrients back into the soil, as the Decomposers panel's Dead organic matter → Decomposers → Nutrients → Producers chain shows — but energy that's already been used by an organism is gone from the system, not collected and reused. Only new sunlight brings fresh energy into the ecosystem.",
        hints: ["Compare the Decomposers panel's cycle to the Energy Flow ladder — does the ladder ever go back up?"],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "biology",
      topicSlug: "ecosystem-explorer",
      label: "Ecosystem Explorer",
      href: "/dashboard/biology/ecosystem-explorer",
      reason: "Review the biotic, abiotic, producer, consumer, and decomposer roles this food chain and web are built from.",
    },
    {
      subjectSlug: "biology",
      topicSlug: "cellular-respiration",
      label: "Cellular Respiration",
      href: "/dashboard/biology/cellular-respiration",
      reason: "See how an individual organism actually uses the energy it gains from eating — most of what's 'lost' at each trophic level is spent here.",
    },
  ],
};
