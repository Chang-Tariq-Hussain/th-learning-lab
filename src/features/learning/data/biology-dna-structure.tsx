import type { TopicContent } from "../types";

/**
 * DNA Structure & Base Pairing — Biology GLE Batch 4 ("DNA & Cell
 * Exploration"), topic 1 of 2.
 *
 * Reuses the existing `DnaStructure` simulation
 * (`@/features/subjects/biology/dna-structure`) exactly as-is: it
 * already models the double helix as a two-strand ladder with a
 * sugar-phosphate backbone, lets a student click any revealed base to
 * see its pairing partner, and doubles as the "complete the strand"
 * interactive base-pairing activity (the still-blank bottom strand),
 * with immediate correct/incorrect feedback and a "New Sequence"
 * control for repeated practice — so no simulation code changes were
 * needed beyond a small `InfoPanel` wording addition calling out the
 * nucleotide's three parts (sugar, phosphate, base) and naming the
 * hydrogen bonds explicitly, so the existing visualization's already-
 * present backbone/base/pairing structure is easier to read as those
 * specific concepts.
 *
 * `practice.quizId` points at the new, dedicated 30-question bank in
 * `@/features/quiz-engine/data/biology-dna-structure-quiz.ts` — no
 * quiz previously existed for this topic.
 */
export const biologyDnaStructureContent: TopicContent = {
  subjectSlug: "biology",
  topicSlug: "dna-structure",
  title: "DNA Structure & Base Pairing",
  subjectLabel: "Biology",
  topicLabel: "Cell Structure",
  colorToken: "biology",
  simulationHref: "/dashboard/biology/dna-structure",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Describe what DNA is and explain its role in storing genetic information.",
      "Name the three parts of a nucleotide: sugar, phosphate, and a nitrogenous base.",
      "List DNA's four nitrogenous bases and state the base-pairing rule: A with T, and C with G.",
      "Explain that DNA is double-stranded, with hydrogen bonds holding the paired bases together.",
      "Describe DNA's overall double-helix shape and distinguish the backbone from the bases.",
      "Given one strand's sequence, determine its exact complementary strand.",
    ],
    concepts: [
      {
        term: "What DNA is, and what it does",
        explanation:
          "DNA (deoxyribonucleic acid) is the molecule that stores an organism's genetic information — the instructions a cell needs to build proteins and carry out its functions. Every cell in your body carries a copy of the same DNA, and it's passed from parent to offspring, which is why traits run in families.",
      },
      {
        term: "Nucleotides: DNA's building blocks",
        explanation:
          "DNA is built from repeating units called nucleotides. Each nucleotide has exactly three parts: a sugar, a phosphate group, and one of four nitrogenous bases. Millions of nucleotides link together, one after another, to form a single DNA strand.",
      },
      {
        term: "The four bases: A, T, C, G",
        explanation:
          "The nitrogenous base attached to each nucleotide is one of four kinds: adenine (A), thymine (T), cytosine (C), or guanine (G). The order these bases appear in along a strand is what actually encodes genetic information — like letters spelling out instructions.",
      },
      {
        term: "The sugar-phosphate backbone",
        explanation:
          "Each strand's sugars and phosphates link together end-to-end into a repeating chain — the backbone — that runs the length of the strand. The backbone is purely structural; the bases attached to it carry the genetic information. In the visualization, the backbone is the curved rail on each side, distinct from the paired bases in the middle.",
      },
      {
        term: "Complementary base pairing",
        explanation:
          "Bases don't pair randomly — adenine (A) always pairs with thymine (T), and cytosine (C) always pairs with guanine (G). This rule is fixed and specific: A never pairs with C or G, and C never pairs with A or T. Because of this rule, one strand's sequence always tells you the other strand's exact sequence — the two strands are complementary, not identical.",
        formula: "A \\equiv T \\quad\\quad C \\equiv G",
        formulaCaption: "Complementary base pairs",
      },
      {
        term: "Hydrogen bonds and the double helix",
        explanation:
          "Each base pair is held together by hydrogen bonds — weaker than the strong bonds within the backbone, which is what lets the two strands separate for processes like copying DNA. With base pairs stacked one after another, the whole two-stranded structure twists into a spiral shape called a double helix.",
      },
    ],
    whyItMatters:
      "The base-pairing rule is what makes DNA replication possible — when a cell divides, it can separate the two strands and rebuild a perfect complementary partner for each one, every single time, using the same A-T, C-G rule. That same predictable pairing is the foundation of real technologies you may have heard of: paternity testing, forensic DNA analysis, and PCR tests all work because a strand's sequence can be read and matched with total reliability.",
    keyTerms: [
      { term: "Nucleotide", definition: "A DNA building block made of a sugar, a phosphate group, and one nitrogenous base." },
      { term: "Nitrogenous base", definition: "One of DNA's four information-carrying units: adenine (A), thymine (T), cytosine (C), or guanine (G)." },
      { term: "Sugar-phosphate backbone", definition: "The repeating chain of sugars and phosphates that forms the structural rail of each DNA strand." },
      { term: "Complementary base pairing", definition: "The fixed rule that A only pairs with T, and C only pairs with G." },
      { term: "Hydrogen bond", definition: "The relatively weak bond joining two paired bases, holding the two DNA strands together." },
      { term: "Double helix", definition: "The twisted, ladder-like spiral shape formed by DNA's two paired, complementary strands." },
    ],
    misconceptions: [
      {
        id: "misconception-dna-single-strand",
        misconception: "DNA is a single strand, like a chain with one side.",
        correction:
          "DNA is double-stranded — two complementary strands wound around each other into a double helix. A single strand alone is only half of a complete DNA molecule.",
      },
      {
        id: "misconception-any-base-pairs-any-base",
        misconception: "Any of the four bases can pair with any other base.",
        correction:
          "Base pairing is specific and fixed: A only ever pairs with T, and C only ever pairs with G. No other combination occurs in DNA's normal structure.",
      },
      {
        id: "misconception-complementary-means-identical",
        misconception: "A DNA strand's 'complementary strand' means an identical copy of it.",
        correction:
          "Complementary means related by the pairing rule, not identical. Building a complementary strand means swapping every base for its partner (A↔T, C↔G) — the two strands read differently, even though each determines the other exactly.",
      },
      {
        id: "misconception-backbone-carries-information",
        misconception: "The sugar-phosphate backbone is what carries the genetic information.",
        correction:
          "The backbone is structural — it holds the strand together but doesn't vary in a way that encodes information. The sequence of bases attached to the backbone is what actually carries the genetic code.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Commit to a prediction using the base-pairing rule before checking the simulation.",
    scenarios: [
      {
        id: "biology-dna-predict-001",
        scenario: "You're looking at a single base, adenine (A), on one strand of a DNA molecule.",
        question: "Which base pairs with adenine on the opposite strand?",
        options: [
          { id: "t", label: "Thymine (T)" },
          { id: "c", label: "Cytosine (C)" },
          { id: "g", label: "Guanine (G)" },
          { id: "a", label: "Another adenine (A)" },
        ],
        actualResultOptionId: "t",
        explanation: "Adenine always pairs with thymine (A-T) — click the base in the simulation to confirm its highlighted partner.",
        hint: "Remember the two fixed pairs: A-T and C-G.",
      },
      {
        id: "biology-dna-predict-002",
        scenario: "You're looking at a single base, cytosine (C), on one strand of a DNA molecule.",
        question: "Which base pairs with cytosine on the opposite strand?",
        options: [
          { id: "g", label: "Guanine (G)" },
          { id: "a", label: "Adenine (A)" },
          { id: "t", label: "Thymine (T)" },
          { id: "c", label: "Another cytosine (C)" },
        ],
        actualResultOptionId: "g",
        explanation: "Cytosine always pairs with guanine (C-G) — the second of the two fixed pairing rules.",
        hint: "A pairs with T; the other two bases pair with each other.",
      },
      {
        id: "biology-dna-predict-003",
        scenario: "You're given one strand's sequence: A-C-G-T.",
        question: "What is the exact complementary strand?",
        options: [
          { id: "correct", label: "T-G-C-A" },
          { id: "same", label: "A-C-G-T (identical to the original)" },
          { id: "reversed-same", label: "T-G-C-A reversed to A-C-G-T" },
          { id: "wrong-pairs", label: "T-C-G-A" },
        ],
        actualResultOptionId: "correct",
        explanation: "Swap each base for its partner in order (A→T, C→G, G→C, T→A) to get T-G-C-A — the complementary strand is never identical to the original.",
        hint: "Go base by base, applying A↔T and C↔G to each one.",
      },
      {
        id: "biology-dna-predict-004",
        scenario: "Imagine a mutation caused thymine to pair with cytosine instead of adenine at one position.",
        question: "What would this mean for the DNA at that position?",
        options: [
          { id: "broken-rule", label: "The normal base-pairing rule would be broken, creating a mismatched pair" },
          { id: "nothing", label: "Nothing — any base can substitute for any other without consequence" },
          { id: "stronger", label: "The strands would bond more strongly than usual" },
          { id: "new-base", label: "A fifth type of base would be created" },
        ],
        actualResultOptionId: "broken-rule",
        explanation: "Since T-C isn't one of DNA's fixed pairs (only A-T and C-G occur normally), this would be a mismatched, incorrect base pair — the kind of error DNA-repair processes normally catch.",
        hint: "Check the sequence change against the two rules you already know: A-T and C-G.",
      },
      {
        id: "biology-dna-predict-005",
        scenario: "You look at the DNA visualization's two curved rails running along the outside of each strand.",
        question: "What do those two rails represent, as opposed to the rungs connecting them?",
        options: [
          { id: "backbone", label: "The sugar-phosphate backbone — the structural part of each strand" },
          { id: "bases", label: "The nitrogenous bases that carry genetic information" },
          { id: "bonds", label: "The hydrogen bonds holding the strands together" },
          { id: "chromosome", label: "A separate chromosome, unrelated to the strand" },
        ],
        actualResultOptionId: "backbone",
        explanation: "The two rails are each strand's sugar-phosphate backbone; the rungs connecting them are the paired bases, held together by hydrogen bonds.",
        hint: "The backbone is structural and runs the full length of a strand — think 'rail,' not 'rung.'",
      },
      {
        id: "biology-dna-predict-006",
        scenario: "Consider a longer strand: A-A-T-C-G-T.",
        question: "What would happen to the length of the complementary strand compared to the original?",
        options: [
          { id: "same-length", label: "It would be exactly the same length — one complementary base for every original base" },
          { id: "shorter", label: "It would be shorter, since some bases don't need a partner" },
          { id: "longer", label: "It would be longer, since each base pairs with two partners" },
          { id: "no-relation", label: "Its length wouldn't relate to the original strand at all" },
        ],
        actualResultOptionId: "same-length",
        explanation: "Every single base gets exactly one complementary partner, so the two strands of a DNA molecule are always the same length.",
        hint: "Base pairing is one-to-one — think about what that means for the total count.",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Look at the given (top) strand and the still-blank (bottom) strand — the blank positions are your complementary-strand activity.",
      "Click a blank position on the bottom strand, then pick a base from the base picker below to answer it.",
      "Watch the immediate feedback: a correct pick fills in that position and moves you to the next blank; an incorrect pick tells you to try again.",
      "Once already-answered, click any position (top or bottom) to see it highlighted alongside its paired partner.",
      "Press 'New Sequence' for a fresh strand to pair, or 'Reset' to clear your answers on the current one and try again.",
      "Use the info panel's pairing rule (A↔T, C↔G) as your reference the whole time — you shouldn't need to guess.",
    ],
    tryThis: [
      "Before clicking a blank position's answer, say out loud which base you expect, then check yourself against the pairing rule.",
      "Complete an entire strand without any incorrect attempts, working left to right.",
      "Generate a new sequence and, before touching the base picker, write out the full complementary strand on paper — then check your work against the simulation.",
      "Pick any already-answered pair and explain in one sentence why that specific base combination is correct and no other combination would be.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "biology-dna-explain-001",
        question: "Why does DNA pair its bases specifically (A-T, C-G) instead of allowing any combination?",
        answer:
          "The specific shapes and hydrogen-bonding patterns of each base only fit correctly with one partner: adenine's shape and bonding sites match thymine's, and cytosine's match guanine's. This specificity is what makes DNA replication reliable — a cell can separate the two strands and rebuild an exact partner for each one every time, because there's only ever one correct base to place at each position.",
      },
      {
        id: "biology-dna-explain-002",
        question: "Why are the two strands of DNA described as complementary rather than identical?",
        answer:
          "Complementary means each strand's sequence is determined by, but different from, the other strand's sequence — following the A-T, C-G rule. If you know one strand reads A-C-G-T, the other strand must read T-G-C-A, not another copy of A-C-G-T. The two strands carry the same overall information, but their actual letter-by-letter sequences are not the same.",
      },
      {
        id: "biology-dna-explain-003",
        question: "Why is it useful to separate the roles of the backbone (structural) and the bases (information-carrying)?",
        answer:
          "Splitting these roles lets DNA be both stable and flexible: the backbone's job is to hold each strand together as one continuous molecule, and it doesn't need to vary to do that. The bases, meanwhile, can vary freely in their order, which is exactly what lets a huge amount of different genetic information be encoded along an otherwise structurally uniform molecule.",
      },
      {
        id: "biology-dna-explain-004",
        question: "Why are hydrogen bonds — rather than a stronger type of bond — used to hold the two strands' bases together?",
        answer:
          "Hydrogen bonds are strong enough to hold the double helix together under normal conditions, but weak enough that they can be broken and reformed when needed, such as when a cell separates the two strands to copy its DNA. If the bases were joined by a much stronger bond, separating the strands for replication would be far more difficult for the cell to do reliably.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    // Foreign key into the quiz-engine registry — all questions live
    // in @/features/quiz-engine/data/biology-dna-structure-quiz.ts.
    quizId: "biology-dna-structure",
  },

  // -------------------------------------------------------------
  // CHALLENGE
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice. Use the simulation above to check yourself where useful, and use the hints if you get stuck.",
    scenarios: [
      {
        id: "biology-dna-challenge-001",
        title: "Identify the Missing Base",
        scenario: "One strand reads A-?-G-T, and its known complementary strand reads T-A-C-A.",
        objective: "Determine the missing base (marked '?') on the first strand.",
        tools: [{ id: "pairing-rule", label: "Base-pairing rule (A-T, C-G)" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "T" },
            { id: "b", label: "A" },
            { id: "c", label: "G" },
            { id: "d", label: "C" },
          ],
          correctOptionId: "a",
        },
        explanation: "The complementary strand's second position is A, and A pairs with T — so the missing base on the first strand must be T.",
        hints: ["Look at the second position of the complementary strand, and work the pairing rule backwards from there."],
      },
      {
        id: "biology-dna-challenge-002",
        title: "Complete a Complementary Sequence",
        scenario: "A given strand reads G-A-T-T-C-A.",
        objective: "Select the option that shows the correct, complete complementary strand.",
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "C-T-A-A-G-T" },
            { id: "b", label: "G-A-T-T-C-A" },
            { id: "c", label: "C-T-A-A-G-A" },
            { id: "d", label: "C-A-T-T-G-T" },
          ],
          correctOptionId: "a",
        },
        explanation: "Swapping each base for its partner (G→C, A→T, T→A, T→A, C→G, A→T) gives C-T-A-A-G-T.",
        hints: ["Work through the strand one base at a time, applying A↔T and C↔G to each."],
      },
      {
        id: "biology-dna-challenge-003",
        title: "Identify the Nucleotide's Components",
        scenario: "You're asked to describe everything that makes up a single DNA nucleotide.",
        objective: "Select the option listing all three correct components.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "A sugar, a phosphate group, and a nitrogenous base" },
            { id: "b", label: "Two nitrogenous bases and a phosphate group" },
            { id: "c", label: "A sugar, a protein, and a lipid" },
            { id: "d", label: "A backbone and a helix" },
          ],
          correctOptionId: "a",
        },
        explanation: "Every nucleotide has exactly three parts: a sugar, a phosphate group, and one nitrogenous base.",
        hints: ["Think of the term 'nucleotide' as naming three separate physical pieces, not two."],
      },
      {
        id: "biology-dna-challenge-004",
        title: "Analyze a DNA Diagram",
        scenario:
          "A diagram shows two curved backbones with several rungs between them. One rung is labeled A on the top strand and G on the bottom strand.",
        objective: "Determine what's wrong with this diagram.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "A and G is not a valid base pair — A should be paired with T" },
            { id: "b", label: "Nothing is wrong; A and G is a valid pair" },
            { id: "c", label: "The backbones are drawn in the wrong location" },
            { id: "d", label: "DNA diagrams never show more than one rung" },
          ],
          correctOptionId: "a",
        },
        explanation: "A only pairs with T, never with G — this diagram shows an invalid, mismatched base pair.",
        hints: ["Check this pairing against the two rules you know: A-T and C-G."],
      },
      {
        id: "biology-dna-challenge-005",
        title: "Determine a Longer Complementary Strand",
        scenario: "A given strand reads T-G-G-A-C-T-A-C.",
        objective: "Select the correct complementary strand for this eight-base sequence.",
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "A-C-C-T-G-A-T-G" },
            { id: "b", label: "A-C-C-T-G-A-T-C" },
            { id: "c", label: "T-G-G-A-C-T-A-C" },
            { id: "d", label: "A-C-C-A-G-A-T-G" },
          ],
          correctOptionId: "a",
        },
        explanation: "Swapping every base (T→A, G→C, G→C, A→T, C→G, T→A, A→T, C→G) gives A-C-C-T-G-A-T-G.",
        hints: ["Work through all eight positions carefully, one at a time — a single mistake changes the whole answer."],
        maxAttempts: 3,
      },
      {
        id: "biology-dna-challenge-006",
        title: "Identify an Incorrect Base Pair",
        scenario: "A partially built strand shows the following pairs: A-T, C-G, G-C, T-C, A-T.",
        objective: "Identify which pair in this list is incorrect.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "T-C (fourth pair)" },
            { id: "b", label: "A-T (first pair)" },
            { id: "c", label: "C-G (second pair)" },
            { id: "d", label: "G-C (third pair)" },
          ],
          correctOptionId: "a",
        },
        explanation: "T should pair with A, not C — the fourth pair (T-C) breaks the base-pairing rule.",
        hints: ["Check each pair one at a time against A-T and C-G."],
      },
      {
        id: "biology-dna-challenge-007",
        title: "Explain Why a Pairing Is Incorrect",
        scenario: "Someone claims that G correctly pairs with T in DNA.",
        objective: "Select the best explanation for why this claim is wrong.",
        requiresExperiment: false,
        maxAttempts: 2,
        answer: {
          mode: "choice",
          options: [
            {
              id: "a",
              label: "DNA's pairing rule is fixed to A-T and C-G; G's only correct partner is C, not T",
            },
            { id: "b", label: "G and T are actually a valid third pairing rule, alongside A-T and C-G" },
            { id: "c", label: "G cannot pair with any base at all" },
            { id: "d", label: "T can pair with any base except A" },
          ],
          correctOptionId: "a",
          },
        explanation: "DNA has exactly two valid pairing rules — A-T and C-G. G's only correct complementary base is C; G-T is not a valid pair.",
        hints: ["There are only two valid pairing rules in DNA — list them both, then check whether G-T matches either one."],
      },
    ],
  },
};
