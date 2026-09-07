import type { TopicContent } from "../types";

/**
 * Brønsted–Lowry Theory — Chemistry Batch 5, second topic. Brought up
 * from the earlier `SimulationLearnMore` pattern to the full standard.
 *
 * The existing simulation (`@/features/subjects/chemistry/bronsted-lowry`)
 * already covered the whole spec — a reaction picker (HCl + H₂O /
 * NH₃ + H₂O), a shared 5-step "before → highlight → transfer → after
 * → explain" proton-transfer sequence with Start/Pause/Next Step/
 * Reset controls, a small in-sim "Who donates the proton?" quick
 * check, and an Arrhenius-connection callout — so nothing there
 * needed rebuilding. Predict and Explain both refer to the actual
 * step sequence and the two reactions (H₂O plays base in one,
 * acid in the other) rather than inventing new chemistry. Practice
 * below is a full 30-question bank, distinct from the sim's own
 * tiny in-place quick check, which stays as immediate low-stakes
 * reinforcement during Explore.
 */
export const chemistryBronstedLowryContent: TopicContent = {
  subjectSlug: "chemistry",
  topicSlug: "bronsted-lowry",
  title: "Brønsted–Lowry Theory",
  subjectLabel: "Chemistry",
  topicLabel: "Acids & Bases",
  colorToken: "chemistry",
  simulationHref: "/dashboard/chemistry/bronsted-lowry",

  learn: {
    objectives: [
      "Define a Brønsted–Lowry acid as a proton (H⁺) donor and a base as a proton acceptor.",
      "Track where a proton moves during an acid-base reaction.",
      "Identify the acid and base in a given proton-transfer reaction.",
      "Explain how the Brønsted–Lowry definition is broader than the Arrhenius definition.",
    ],
    concepts: [
      {
        term: "Brønsted–Lowry acid = proton donor",
        explanation:
          "A substance that donates a proton (H⁺) to another substance. It doesn't need to contain a metal, taste sour, or have any particular formula — what matters is whether it gives up an H⁺ during the reaction.",
      },
      {
        term: "Brønsted–Lowry base = proton acceptor",
        explanation:
          "A substance that accepts a proton (H⁺) from an acid. The base grabs the H⁺ that the acid lets go of — nothing about its formula has to contain OH⁻.",
      },
      {
        term: "Proton transfer",
        explanation:
          "A Brønsted–Lowry reaction is really just one particle — H⁺ — moving from the acid to the base. Everything else about the two molecules stays the same during that handoff.",
        formula: "HA + B \\rightarrow A^- + HB^+",
        formulaCaption: "Acid HA donates H⁺ to base B",
      },
      {
        term: "Arrhenius vs. Brønsted–Lowry",
        explanation:
          "Arrhenius theory only classifies acids and bases by what they produce in water. Brønsted–Lowry theory looks at proton transfer directly, so it works with any solvent — or none at all — and explains substances like ammonia, which act as bases without ever containing OH⁻.",
      },
    ],
    whyItMatters:
      "The Brønsted–Lowry definition is what lets chemists classify substances as acids and bases even when they don't fit the simple \"tastes sour, tastes bitter\" picture. It explains how ammonia can act as a base without containing any OH⁻, and it's the framework behind buffer systems in your blood, which rely on rapid proton transfers to keep your pH stable even as your body produces acid all day long.",
    keyTerms: [
      { term: "Proton", definition: "In acid-base chemistry, another name for H⁺ — a bare hydrogen nucleus with no electron." },
      { term: "Proton donor", definition: "The Brønsted–Lowry definition of an acid — the species that gives up H⁺." },
      { term: "Proton acceptor", definition: "The Brønsted–Lowry definition of a base — the species that gains H⁺." },
      { term: "Amphoteric", definition: "Able to act as either an acid or a base depending on what it reacts with — water is the clearest example." },
    ],
    misconceptions: [
      {
        id: "misconception-water-is-always-base",
        misconception: "Water always acts as a base in acid-base reactions.",
        correction:
          "Water is amphoteric — it can act as either the acid or the base, depending on what it's reacting with. In HCl + H₂O, water accepts a proton and acts as the base. In NH₃ + H₂O, water donates a proton and acts as the acid instead.",
      },
      {
        id: "misconception-arrhenius-and-bl-conflict",
        misconception: "Brønsted–Lowry theory replaces the Arrhenius definition because Arrhenius theory was wrong.",
        correction:
          "Arrhenius theory isn't wrong — it's just narrower. Every Arrhenius acid and base is still a Brønsted–Lowry acid and base; Brønsted–Lowry theory simply extends the idea to cover reactions Arrhenius theory can't, like ones with no water at all.",
      },
      {
        id: "misconception-acid-must-look-different",
        misconception: "You can tell which molecule is the acid just by looking at its formula, before the reaction happens.",
        correction:
          "Being a Brønsted–Lowry acid depends on what a molecule does in a specific reaction, not a fixed label on the formula. The same molecule (like water) can be the acid in one reaction and the base in another — what matters is which way the proton actually moves.",
      },
    ],
  },

  predict: {
    intro: "Commit to a prediction before running the reaction below — then step through it and check your answer.",
    scenarios: [
      {
        id: "chemistry-bronsted-lowry-predict-001",
        scenario: "You select the HCl + H₂O reaction and are about to press Start.",
        question: "Which molecule will end up donating the proton?",
        options: [
          { id: "hcl-donates", label: "HCl — it carries the H⁺ that gets released" },
          { id: "h2o-donates", label: "H₂O — water always donates protons" },
          { id: "neither", label: "Neither — nothing moves between them" },
        ],
        actualResultOptionId: "hcl-donates",
        explanation:
          "HCl carries the proton it's about to give away in this reaction. Stepping through the sequence shows the H⁺ moving from HCl to H₂O, turning HCl into Cl⁻ (the acid, having lost H⁺) and H₂O into H₃O⁺ (the base, having gained H⁺).",
        hint: "Look at which molecule is described as \"carrying\" the proton in the first step of the sequence.",
      },
      {
        id: "chemistry-bronsted-lowry-predict-002",
        scenario: "You switch the reaction picker to NH₃ + H₂O instead of HCl + H₂O.",
        question: "In this second reaction, which molecule now donates the proton?",
        options: [
          { id: "h2o-donates-here", label: "H₂O — the same molecule that was the base a moment ago" },
          { id: "nh3-donates", label: "NH₃ — it always plays the same role as HCl did" },
          { id: "still-hcl", label: "Whichever role HCl had before carries over automatically" },
        ],
        actualResultOptionId: "h2o-donates-here",
        explanation:
          "This time water carries the proton it's about to give away, acting as the acid — the opposite of its role in the HCl + H₂O reaction. Water isn't locked into one role; what matters is which way the proton moves in this specific reaction.",
        hint: "Water is amphoteric — it doesn't have a single fixed role across every reaction.",
      },
      {
        id: "chemistry-bronsted-lowry-predict-003",
        scenario: "You finish stepping through the HCl + H₂O sequence to the final \"explain\" step.",
        question: "How will the final step describe HCl and H₂O's roles?",
        options: [
          { id: "hcl-acid-h2o-base", label: "HCl acted as the acid; H₂O acted as the base" },
          { id: "both-acids", label: "Both acted as acids, since HCl is a strong acid" },
          { id: "roles-unclear", label: "Their roles can't be determined from this reaction alone" },
        ],
        actualResultOptionId: "hcl-acid-h2o-base",
        explanation:
          "HCl donated the proton, so by definition it acted as the acid. H₂O accepted it, so it acted as the base. Acid = proton donor, base = proton acceptor — that's the whole Brønsted–Lowry definition, and the final step names both roles explicitly.",
        hint: "Whichever molecule gave the proton away is the acid; whichever gained it is the base.",
      },
    ],
  },

  explore: {
    howToUse: [
      "Pick a reaction from the reaction picker: HCl + H₂O, or NH₃ + H₂O.",
      "Press Start and watch the proton-transfer scene step through automatically, or use Next Step to advance one step at a time.",
      "Read the explanation panel at each step — it names what's happening and why.",
      "Once finished, check which molecule donated the proton (the acid) and which accepted it (the base).",
      "Switch to the other reaction and repeat — notice that water swaps roles between the two.",
      "Try the in-sim \"Who donates the proton?\" quick check once you've stepped through both reactions.",
    ],
    tryThis: [
      "Before pressing Start, predict which molecule will end up as the acid in each reaction.",
      "After finishing both reactions, list all four species formed (Cl⁻, H₃O⁺, NH₄⁺, OH⁻) and match each to the conjugate acid or conjugate base it became.",
      "Compare the Brønsted–Lowry connection panel's summary to the Arrhenius definition — what can this simulation explain that Arrhenius theory couldn't?",
    ],
  },

  explain: {
    questions: [
      {
        id: "chemistry-bronsted-lowry-explain-001",
        question: "Why does H₂O act as a base in one reaction and an acid in the other?",
        answer:
          "Being an acid or a base under Brønsted–Lowry theory depends on which way the proton actually moves in a specific reaction, not on a fixed label. Against HCl (a stronger proton donor), water accepts the proton and acts as the base. Against NH₃ (a stronger proton acceptor), water gives up the proton and acts as the acid instead.",
      },
      {
        id: "chemistry-bronsted-lowry-explain-002",
        question: "What actually changes about HCl and H₂O during the proton transfer, atom by atom?",
        answer:
          "Only the single H⁺ moves — nothing else about either molecule is created or destroyed. HCl loses one H⁺ and becomes Cl⁻; H₂O gains that same H⁺ and becomes H₃O⁺. The reaction is entirely that one proton changing hands.",
      },
      {
        id: "chemistry-bronsted-lowry-explain-003",
        question: "Why can Brønsted–Lowry theory classify the NH₃ + H₂O reaction when Arrhenius theory struggles with it?",
        answer:
          "Arrhenius theory needs a substance to directly produce OH⁻ to count as a base, and NH₃'s formula contains no OH⁻ at all. Brønsted–Lowry theory instead asks only whether a substance accepts a proton — NH₃ clearly does, gaining H⁺ to become NH₄⁺ — so it's classified as a base without any need for OH⁻ to appear anywhere in its formula.",
      },
      {
        id: "chemistry-bronsted-lowry-explain-004",
        question: "In the HCl + H₂O reaction, why is H₃O⁺ formed instead of just H⁺ floating on its own?",
        answer:
          "The proton doesn't just detach and sit alone — Brønsted–Lowry theory describes it moving directly to a proton acceptor. Here that acceptor is H₂O, so the H⁺ attaches to it immediately, forming H₃O⁺ rather than existing as a free, unattached proton.",
      },
    ],
  },

  practice: {
    quizId: "chemistry-bronsted-lowry",
  },

  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice. Use the live simulation below — step through each reaction — to check your reasoning before answering.",
    scenarios: [
      {
        id: "chemistry-bronsted-lowry-challenge-001",
        title: "Identify the Acid and Base",
        scenario:
          "A new reaction is proposed: HF + NH₃ → F⁻ + NH₄⁺. A proton has clearly moved from HF to NH₃.",
        objective: "Determine which reactant acted as the Brønsted–Lowry acid and which acted as the base.",
        constraints: [
          { id: "c1", label: "Base your answer only on which molecule donated the proton and which accepted it." },
        ],
        tools: [
          { id: "step-sequence", label: "Step through HCl + H₂O and NH₃ + H₂O in the simulation as reference examples" },
        ],
        answer: {
          mode: "choice",
          options: [
            { id: "hf-acid-nh3-base", label: "HF is the acid (donates H⁺); NH₃ is the base (accepts H⁺)" },
            { id: "hf-base-nh3-acid", label: "HF is the base; NH₃ is the acid" },
            { id: "both-acids", label: "Both are acids, since HF and NH₄⁺ both contain hydrogen" },
          ],
          correctOptionId: "hf-acid-nh3-base",
        },
        explanation:
          "HF loses an H⁺ to become F⁻, so it donated the proton and acted as the acid. NH₃ gains that H⁺ to become NH₄⁺, so it accepted the proton and acted as the base — the same donor/acceptor pattern the simulation's two reactions both demonstrate.",
        hints: [
          "Which reactant has one fewer H in its product — that one gave a proton away.",
          "Compare this reaction's pattern to the NH₃ + H₂O reaction in the simulation, where NH₃ also ends up as NH₄⁺.",
        ],
        maxAttempts: 3,
      },
      {
        id: "chemistry-bronsted-lowry-challenge-002",
        title: "Water's Double Life",
        scenario:
          "A student insists that water can't be classified consistently, since it acts as a base in one of the simulation's reactions and an acid in the other.",
        objective: "Explain why this isn't a contradiction under Brønsted–Lowry theory.",
        constraints: [
          { id: "c1", label: "Your explanation should reference the term \"amphoteric\" or describe the same idea directly." },
        ],
        tools: [
          { id: "reaction-picker", label: "Reaction picker — switch between HCl + H₂O and NH₃ + H₂O to compare water's role in each" },
        ],
        answer: {
          mode: "choice",
          options: [
            { id: "amphoteric-explanation", label: "Water is amphoteric — its role depends on which way the proton moves in each specific reaction, not on a fixed label" },
            { id: "water-is-random", label: "Water's role is essentially random and unpredictable" },
            { id: "one-reaction-wrong", label: "One of the two reactions must be classified incorrectly" },
          ],
          correctOptionId: "amphoteric-explanation",
        },
        explanation:
          "Brønsted–Lowry classification isn't a fixed property of a molecule — it's determined by what actually happens in a given reaction. Water is amphoteric: capable of donating a proton (acid) or accepting one (base) depending on what it's reacting with. Both classifications in the simulation are correct, just for different reactions.",
        hints: [
          "Step through both reactions again and note exactly which molecule gains vs. loses H⁺ each time.",
          "The Learn section's \"Amphoteric\" key term describes exactly this situation.",
        ],
        maxAttempts: 3,
        requiresExperiment: false,
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "chemistry",
      topicSlug: "arrhenius-theory",
      label: "Arrhenius Theory",
      href: "/dashboard/chemistry/arrhenius-theory",
      reason: "Compare the narrower, water-only definition this theory replaces.",
    },
    {
      subjectSlug: "chemistry",
      topicSlug: "conjugate-acid-base-pairs",
      label: "Conjugate Acid–Base Pairs",
      href: "/dashboard/chemistry/conjugate-acid-base-pairs",
      reason: "Every proton transfer here creates a conjugate pair — go deeper into what that partnership means.",
    },
  ],
};
