import type { TopicContent } from "../types";

/**
 * Conjugate Acid–Base Pairs — Chemistry Batch 5, third topic. Brought
 * up from the earlier `SimulationLearnMore` pattern to the full
 * standard.
 *
 * The existing simulation (`@/features/subjects/chemistry/conjugate-acid-base-pairs`)
 * already covered the whole spec — a pair picker across three real
 * pairs (HCl/Cl⁻, H₂O/OH⁻, NH₄⁺/NH₃), a transformation diagram that
 * highlights the conjugate partner the moment either member is
 * clicked, an explanation panel, and a small two-question practice
 * activity — so nothing there needed rebuilding. Predict and Explain
 * both refer to the actual three pairs and the pair-picker
 * interaction rather than inventing new chemistry.
 */
export const chemistryConjugateAcidBasePairsContent: TopicContent = {
  subjectSlug: "chemistry",
  topicSlug: "conjugate-acid-base-pairs",
  title: "Conjugate Acid–Base Pairs",
  subjectLabel: "Chemistry",
  topicLabel: "Acids & Bases",
  colorToken: "chemistry",
  simulationHref: "/dashboard/chemistry/conjugate-acid-base-pairs",

  learn: {
    objectives: [
      "Define a conjugate acid-base pair as two species that differ by exactly one proton.",
      "Find the conjugate base of a given acid, and the conjugate acid of a given base.",
      "Explain the proton donation/acceptance relationship that connects every conjugate pair.",
      "Identify the conjugate partner of a molecule shown in the simulation.",
    ],
    concepts: [
      {
        term: "Conjugate base",
        explanation:
          "What's left of an acid after it donates a proton (H⁺). It has exactly one fewer H than the acid it came from — Cl⁻ is the conjugate base of HCl.",
        formula: "HA \\rightarrow H^+ + A^-",
        formulaCaption: "A⁻ is the conjugate base of HA",
      },
      {
        term: "Conjugate acid",
        explanation:
          "What a base becomes after it accepts a proton (H⁺). It has exactly one more H than the base it came from — NH₄⁺ is the conjugate acid of NH₃.",
        formula: "B + H^+ \\rightarrow HB^+",
        formulaCaption: "HB⁺ is the conjugate acid of B",
      },
      {
        term: "One proton, always",
        explanation:
          "No matter which pair you look at — HCl/Cl⁻, H₂O/OH⁻, or NH₄⁺/NH₃ — the acid and its conjugate base always differ by a single H⁺, and nothing else about the molecule changes. That one-proton difference is what defines the pair.",
      },
      {
        term: "Identifying the conjugate partner",
        explanation:
          "Given any acid, its conjugate base is what remains once you remove one H⁺. Given any base, its conjugate acid is what results once you add one H⁺. The pair picker's transformation view is exactly this: click either member, and its partner — one proton away — lights up automatically.",
      },
    ],
    whyItMatters:
      "Conjugate acid-base pairs are the working parts behind every buffer solution, including the ones in your own blood that keep its pH from swinging even as your body constantly produces and removes acid. Recognizing a conjugate pair on sight is also what makes it possible to predict which side of an acid-base reaction is favored, since equilibrium always shifts toward the weaker acid and weaker base in the pair.",
    keyTerms: [
      { term: "Conjugate pair", definition: "An acid and a base that differ from each other by exactly one H⁺." },
      { term: "Protonated form", definition: "The member of a conjugate pair that carries the extra H⁺ — the acid." },
      { term: "Deprotonated form", definition: "The member of a conjugate pair with one fewer H⁺ — the conjugate base." },
      { term: "Buffer", definition: "A solution that resists pH change, built from a conjugate acid-base pair working together." },
    ],
    misconceptions: [
      {
        id: "misconception-conjugate-is-different-substance-family",
        misconception: "A conjugate base is a completely different, unrelated substance from the acid it came from.",
        correction:
          "A conjugate base is the same molecule as its acid, just missing exactly one H⁺. Cl⁻ isn't some separate substance from HCl — it's what HCl becomes the instant it donates its proton.",
      },
      {
        id: "misconception-any-two-species-can-pair",
        misconception: "Any acid and any base can be called a conjugate pair.",
        correction:
          "Only two species that differ by exactly one H⁺ — and are otherwise identical — form a conjugate pair. HCl and NH₃, for example, aren't a conjugate pair; they're unrelated molecules that happen to both be acids or bases.",
      },
      {
        id: "misconception-strong-acid-strong-conjugate-base",
        misconception: "A strong acid produces a strong conjugate base.",
        correction:
          "Strength runs opposite across a conjugate pair. A strong acid gives up its proton so easily that its conjugate base has very little pull to grab it back, making that conjugate base weak — not strong.",
      },
    ],
  },

  predict: {
    intro: "Commit to a prediction before selecting the pair below — then check it against what lights up.",
    scenarios: [
      {
        id: "chemistry-conjugate-pairs-predict-001",
        scenario: "You're about to click NH₄⁺ in the pair picker.",
        question: "Which molecule will light up as its conjugate partner?",
        options: [
          { id: "nh3", label: "NH₃ — one fewer H⁺ than NH₄⁺" },
          { id: "nh5", label: "A molecule with one more H⁺ than NH₄⁺" },
          { id: "oh-minus", label: "OH⁻, unrelated to NH₄⁺'s own formula" },
        ],
        actualResultOptionId: "nh3",
        explanation:
          "NH₄⁺ is the protonated (acid) form of the pair. Removing its extra H⁺ gives NH₃ — its conjugate base — which is exactly the partner that lights up.",
        hint: "A conjugate base always has exactly one fewer H⁺ than its acid.",
      },
      {
        id: "chemistry-conjugate-pairs-predict-002",
        scenario: "You click OH⁻ instead, on the H₂O / OH⁻ pair.",
        question: "Is OH⁻ acting as the acid or the base member of this pair, and what's its conjugate partner?",
        options: [
          { id: "oh-is-base", label: "OH⁻ is the conjugate base; H₂O (one more H⁺) is its partner" },
          { id: "oh-is-acid", label: "OH⁻ is the acid; something with two fewer H⁺ is its partner" },
          { id: "no-partner", label: "OH⁻ has no conjugate partner in this simulation" },
        ],
        actualResultOptionId: "oh-is-base",
        explanation:
          "OH⁻ has one fewer H than H₂O, making it the conjugate base of the pair. H₂O — with one more H⁺ than OH⁻ — is its conjugate acid, and that's the partner the diagram highlights.",
        hint: "Compare the H count in OH⁻ to the H count in H₂O — which one is missing a proton?",
      },
      {
        id: "chemistry-conjugate-pairs-predict-003",
        scenario: "You look at all three pairs in the simulation — HCl/Cl⁻, H₂O/OH⁻, and NH₄⁺/NH₃ — side by side.",
        question: "What do all three pairs have in common, structurally?",
        options: [
          { id: "one-proton-each", label: "Each pair's two members differ by exactly one H⁺" },
          { id: "same-charge", label: "Each pair's two members always carry the same overall charge" },
          { id: "same-element-count", label: "Each pair's two members contain the same number of every element, H included" },
        ],
        actualResultOptionId: "one-proton-each",
        explanation:
          "Despite looking very different — a neutral molecule, a charged ion, different elements entirely — all three pairs share the same underlying structure: the acid form has exactly one more H⁺ than the conjugate base form.",
        hint: "Count the hydrogens in each acid and compare it to its listed conjugate base.",
      },
    ],
  },

  explore: {
    howToUse: [
      "Pick any molecule from the pair picker — HCl, Cl⁻, H₂O, OH⁻, NH₄⁺, or NH₃.",
      "Watch the transformation diagram highlight its conjugate partner automatically.",
      "Read the explanation panel's note on how the acid loses H⁺ to become the conjugate base.",
      "Click the conjugate partner itself and confirm it points right back to the molecule you started with.",
      "Try the two practice questions at the bottom for a quick, no-stakes check.",
    ],
    tryThis: [
      "Pick an acid, find its conjugate base, then click that conjugate base — do you end up back where you started?",
      "Count the hydrogens in each acid/conjugate-base pair and confirm the difference is exactly one, every time.",
      "Look at NH₄⁺/NH₃ specifically — which member showed up as the base in the Brønsted–Lowry simulation's second reaction?",
    ],
  },

  explain: {
    questions: [
      {
        id: "chemistry-conjugate-pairs-explain-001",
        question: "Why does clicking either member of a pair always highlight the other one?",
        answer:
          "Every conjugate pair is a fixed, one-to-one relationship — each acid has exactly one conjugate base, and each base has exactly one conjugate acid. Clicking either member identifies the pair itself, so the simulation always resolves to the same single partner regardless of which side you start from.",
      },
      {
        id: "chemistry-conjugate-pairs-explain-002",
        question: "Why is Cl⁻ the conjugate base of HCl, and not some other chlorine-containing ion?",
        answer:
          "A conjugate base is defined as exactly what remains after removing one H⁺ — nothing more, nothing less. HCl minus one H⁺ is precisely Cl⁻, so that's the only species that qualifies as HCl's conjugate base.",
      },
      {
        id: "chemistry-conjugate-pairs-explain-003",
        question: "How does the NH₄⁺/NH₃ pair here connect to the NH₃ + H₂O reaction in the Brønsted–Lowry simulation?",
        answer:
          "In that reaction, NH₃ accepts a proton from H₂O and becomes NH₄⁺ — exactly the conjugate acid-base relationship shown here. Every proton transfer produces a conjugate pair like this one; this simulation isolates that single relationship instead of animating the whole reaction.",
      },
      {
        id: "chemistry-conjugate-pairs-explain-004",
        question: "Why does a strong acid have a weak conjugate base?",
        answer:
          "A strong acid gives up its proton very easily, which means once it has, the resulting conjugate base has very little pull left to grab that proton back — making it a weak base. The two properties run in opposite directions because they describe the same underlying tendency to hold onto (or release) H⁺, viewed from either side of the pair.",
      },
    ],
  },

  practice: {
    quizId: "chemistry-conjugate-acid-base-pairs",
  },

  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice. Use the live simulation below — the pair picker and transformation diagram — to check your reasoning before answering.",
    scenarios: [
      {
        id: "chemistry-conjugate-pairs-challenge-001",
        title: "Find the Missing Partner",
        scenario:
          "A textbook lists HSO₄⁻ as an acid but doesn't name its conjugate base.",
        objective: "Determine the formula of HSO₄⁻'s conjugate base.",
        constraints: [
          { id: "c1", label: "The conjugate base must have exactly one fewer H⁺ than HSO₄⁻, with every other atom unchanged." },
        ],
        tools: [
          { id: "pair-picker", label: "Pair picker — use HCl/Cl⁻ and NH₄⁺/NH₃ as worked examples of removing one H⁺" },
        ],
        answer: {
          mode: "choice",
          options: [
            { id: "so4", label: "SO₄²⁻ — same atoms as HSO₄⁻ minus one H⁺" },
            { id: "h2so4", label: "H₂SO₄ — adding a proton instead of removing one" },
            { id: "so3", label: "SO₃ — removing an oxygen instead of a proton" },
          ],
          correctOptionId: "so4",
        },
        explanation:
          "A conjugate base is always the acid minus exactly one H⁺, with no other atoms changed. HSO₄⁻ minus one H⁺ is SO₄²⁻ — the same sulfate skeleton, just missing one proton (and one less positive charge in the total, making it more negative).",
        hints: [
          "Look at how Cl⁻ relates to HCl — only the H⁺ is removed, nothing else changes.",
          "Remove exactly one H from HSO₄⁻'s formula and adjust only the charge.",
        ],
        maxAttempts: 3,
      },
      {
        id: "chemistry-conjugate-pairs-challenge-002",
        title: "Real-World Mission: Blood Buffers",
        scenario:
          "Human blood stays remarkably close to pH 7.4 even though the body constantly produces CO₂, which reacts with water to form carbonic acid (H₂CO₃). The main buffer pair responsible is H₂CO₃ and its conjugate base, HCO₃⁻ (bicarbonate).",
        objective: "Explain, in terms of conjugate pairs, how having both H₂CO₃ and HCO₃⁻ present helps resist a pH swing when acid is added to the blood.",
        constraints: [
          { id: "c1", label: "Your explanation should reference the conjugate base (HCO₃⁻) accepting a proton, not just \"it neutralizes the acid.\"" },
        ],
        tools: [
          { id: "conjugate-concept", label: "Learn section — \"One proton, always\" and \"Buffer\" key term" },
        ],
        answer: {
          mode: "choice",
          options: [
            { id: "base-absorbs-h", label: "HCO₃⁻, the conjugate base, accepts the extra H⁺ and becomes H₂CO₃ again — soaking up the added acid" },
            { id: "acid-blocks", label: "H₂CO₃ physically blocks new acid from dissolving" },
            { id: "no-mechanism", label: "There's no chemical mechanism — blood pH is just naturally stable" },
          ],
          correctOptionId: "base-absorbs-h",
        },
        explanation:
          "When extra H⁺ is added, the conjugate base HCO₃⁻ is available to accept it, turning back into H₂CO₃ — exactly the same proton-acceptance relationship this simulation's pairs demonstrate. Because the conjugate base is already present in solution, it can immediately soak up added acid before the pH has a chance to swing.",
        hints: [
          "Which member of a conjugate pair is the one that accepts a proton?",
          "H₂CO₃ and HCO₃⁻ differ by exactly one H⁺ — same relationship as HCl/Cl⁻ or H₂O/OH⁻.",
        ],
        maxAttempts: 4,
        requiresExperiment: false,
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "chemistry",
      topicSlug: "bronsted-lowry",
      label: "Brønsted–Lowry Theory",
      href: "/dashboard/chemistry/bronsted-lowry",
      reason: "Revisit the proton-transfer reactions that produce the conjugate pairs seen here.",
    },
    {
      subjectSlug: "chemistry",
      topicSlug: "lewis-acid-base",
      label: "Lewis Acid–Base Theory",
      href: "/dashboard/chemistry/lewis-acid-base",
      reason: "Go even broader — see acids and bases defined by electron pairs rather than protons alone.",
    },
  ],
};
