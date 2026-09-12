import type { TopicContent } from "../types";

/**
 * Mitosis — Biology GLE Batch 3 ("Cell Division"), topic 1 of 2.
 * Reuses the existing `Mitosis` simulation
 * (`@/features/subjects/biology/mitosis`) exactly as-is: it already
 * models the correct five-stage sequence (Prophase → Metaphase →
 * Anaphase → Telophase → Cytokinesis) plus Interphase as a clearly
 * separate, earlier stage rather than a stage of mitosis itself, with
 * Start/Pause/Next Stage/Previous Stage/Reset controls, a per-stage
 * "What happens?" explanation panel, click-to-inspect structures
 * (chromosome, spindle fibers, centrosome, nucleus), and a final
 * "one parent cell → two daughter cells" summary — so no simulation
 * code changes were needed.
 */
export const biologyMitosisContent: TopicContent = {
  subjectSlug: "biology",
  topicSlug: "mitosis",
  title: "Mitosis: How One Cell Becomes Two",
  subjectLabel: "Biology",
  topicLabel: "Cell Division",
  colorToken: "biology",
  simulationHref: "/dashboard/biology/mitosis",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Explain why cells divide, and what mitosis accomplishes for growth and repair.",
      "State what mitosis produces: two genetically identical daughter cells.",
      "Explain that DNA replication happens during interphase, before mitosis begins — not during mitosis itself.",
      "Describe a sister chromatid and how it relates to a duplicated chromosome.",
      "List the five stages of mitosis in the correct order: Prophase, Metaphase, Anaphase, Telophase, Cytokinesis.",
      "Describe what happens to chromosomes at each of those five stages.",
    ],
    concepts: [
      {
        term: "Why cells divide",
        explanation:
          "Organisms need new cells to grow, to replace worn-out or damaged cells, and to heal wounds. Mitosis is the process that produces those new cells — every skin cell replacing a scraped-off one, and every cell added as you grew from a single fertilized egg into trillions of cells, came from mitosis.",
      },
      {
        term: "Interphase comes first — and isn't a stage of mitosis",
        explanation:
          "Before mitosis begins, the cell spends time in interphase: growing, carrying out its normal functions, and — critically — copying (replicating) its entire set of DNA. By the time mitosis actually starts, every chromosome already exists as two identical sister chromatids. Interphase is preparation for division, not part of the division itself.",
      },
      {
        term: "Sister chromatids",
        explanation:
          "Once DNA replicates, each chromosome consists of two identical copies — sister chromatids — joined together at a point called the centromere. They stay joined through prophase and metaphase, and are only pulled apart from each other during anaphase.",
      },
      {
        term: "The five stages, in order",
        explanation:
          "Prophase (chromosomes condense and become visible), Metaphase (chromosomes line up along the cell's middle), Anaphase (sister chromatids separate and move to opposite poles), Telophase (two new nuclei form around each set of chromosomes), and Cytokinesis (the cell physically splits into two).",
      },
      {
        term: "The result: two identical daughter cells",
        explanation:
          "Mitosis produces exactly two daughter cells, each with the same number and type of chromosomes as the original parent cell — genetically identical to it and to each other.",
      },
    ],
    whyItMatters:
      "Mitosis is happening in your body right now. It's how a single fertilized egg became the trillions of cells that make up your body, and it's how your skin heals after a cut, your blood cells get replaced, and your bones repair after a fracture. Anywhere an organism needs more of the exact same kind of cell — never a different kind, never a mix of kinds — mitosis is the process making that happen.",
    keyTerms: [
      { term: "Chromosome", definition: "A structure made of tightly packaged DNA that carries an organism's genetic information." },
      { term: "Sister chromatid", definition: "One of two identical copies of a chromosome, produced by DNA replication and joined at the centromere until anaphase." },
      { term: "Centromere", definition: "The region where two sister chromatids are joined together." },
      { term: "Spindle fibers", definition: "Microtubule strands that attach to chromosomes and pull them toward opposite poles of the dividing cell." },
      { term: "Cytokinesis", definition: "The physical division of the cell's cytoplasm into two separate daughter cells." },
    ],
    misconceptions: [
      {
        id: "misconception-dna-replicates-during-mitosis",
        misconception: "DNA replication happens during mitosis, as one of its stages.",
        correction:
          "DNA replication happens during interphase, before mitosis begins. By the time prophase — the first stage of mitosis — starts, every chromosome is already duplicated into two sister chromatids. There is no DNA-copying stage inside mitosis itself.",
      },
      {
        id: "misconception-mitosis-produces-four-cells",
        misconception: "Mitosis produces four daughter cells.",
        correction:
          "Mitosis is a single division that produces two daughter cells. Four daughter cells is the result of meiosis, which involves two rounds of division rather than one.",
      },
      {
        id: "misconception-mitosis-reduces-chromosome-number",
        misconception: "Mitosis reduces the chromosome number in the daughter cells, the way meiosis does.",
        correction:
          "Mitosis maintains the chromosome number — each daughter cell ends up with exactly the same number of chromosomes as the parent cell. Reducing chromosome number by half is specific to meiosis.",
      },
      {
        id: "misconception-chromatids-separate-metaphase",
        misconception: "Sister chromatids separate from each other during metaphase, once they're lined up.",
        correction:
          "During metaphase, sister chromatids are still joined together at the centromere — they're simply aligned at the cell's middle. They don't actually separate until anaphase, the stage right after metaphase.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Commit to a prediction before advancing the simulation to the next stage — then check what actually happens.",
    scenarios: [
      {
        id: "biology-mitosis-predict-001",
        scenario: "You're looking at a cell in Interphase, before the simulation's Start button has been pressed.",
        question: "What happens to the cell's DNA before mitosis actually begins?",
        options: [
          { id: "dna-replicates", label: "It's copied (replicated), so each chromosome ends up with two sister chromatids" },
          { id: "dna-stays-same", label: "Nothing happens to the DNA until prophase starts" },
          { id: "dna-is-destroyed", label: "Half of the DNA is destroyed to prepare for division" },
          { id: "dna-splits-now", label: "The DNA is already split into two cells at this point" },
        ],
        actualResultOptionId: "dna-replicates",
        explanation: "During interphase, the cell replicates its DNA so that each chromosome consists of two identical sister chromatids — this happens before mitosis's stages begin.",
        hint: "Interphase is preparation, and copying the DNA is the most important part of that preparation.",
      },
      {
        id: "biology-mitosis-predict-002",
        scenario: "The simulation moves from Prophase to Metaphase.",
        question: "What will the chromosomes do during Metaphase?",
        options: [
          { id: "line-up-middle", label: "Line up along the middle of the cell" },
          { id: "separate-poles", label: "Separate and move to opposite poles" },
          { id: "disappear", label: "Disappear entirely" },
          { id: "start-condensing", label: "Begin condensing for the first time" },
        ],
        actualResultOptionId: "line-up-middle",
        explanation: "Metaphase is defined by the chromosomes aligning along the cell's midline, ready to be evenly divided.",
        hint: "Metaphase gets its name from being in the 'middle' of the process.",
      },
      {
        id: "biology-mitosis-predict-003",
        scenario: "The simulation is about to move from Metaphase to Anaphase.",
        question: "What happens to the sister chromatids during Anaphase?",
        options: [
          { id: "chromatids-separate", label: "They separate from each other and move to opposite poles" },
          { id: "chromatids-pair-up", label: "They pair up with a partner for the first time" },
          { id: "chromatids-condense", label: "They condense into visible structures for the first time" },
          { id: "chromatids-stay-together", label: "They stay joined together and move as a single unit" },
        ],
        actualResultOptionId: "chromatids-separate",
        explanation: "Anaphase is exactly when sister chromatids finally separate from each other, each one now becoming its own chromosome, pulled toward opposite ends of the cell.",
        hint: "This is the one stage where chromatids stop being 'sister' pairs and become independent.",
      },
      {
        id: "biology-mitosis-predict-004",
        scenario: "The simulation reaches Cytokinesis, the final stage.",
        question: "How will the two resulting daughter cells compare to the original parent cell?",
        options: [
          { id: "identical", label: "Genetically identical to the parent cell and to each other" },
          { id: "half-chromosomes", label: "Each will have half the chromosome number of the parent cell" },
          { id: "genetically-varied", label: "Genetically different from the parent cell and from each other" },
          { id: "no-chromosomes", label: "Neither daughter cell will have any chromosomes at all" },
        ],
        actualResultOptionId: "identical",
        explanation: "Since both daughter cells received a complete, identical set of chromosomes, they end up genetically identical to the original parent cell and to each other — check the Final Result summary once cytokinesis completes.",
        hint: "Think about what mitosis's purpose (growth and repair) requires the new cells to be like.",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Press Start to watch a cell move automatically through all six stages (Interphase through Cytokinesis), or use Next Stage / Previous Stage to step through them one at a time.",
      "Read the 'Current Stage' and 'What happens?' panel each time the stage changes.",
      "Click on chromosomes, spindle fibers, the centrosome, or the nucleus in the scene to open the structure info panel and read what each one is and does.",
      "Watch specifically what the chromosomes are doing at each stage — condensing, aligning, separating, or being enclosed in new nuclei.",
      "Reach Cytokinesis and read the Final Result card describing the two daughter cells.",
      "Use Reset to return to Interphase and try predicting each stage's outcome again before it happens.",
    ],
    tryThis: [
      "Step through Prophase → Metaphase → Anaphase → Telophase one click at a time, narrating in your own words what changes about the chromosomes at each step.",
      "Click each of the four inspectable structures (chromosome, spindle fibers, centrosome, nucleus) at least once and note one fact about each.",
      "Predict, before pressing Next Stage from Telophase, exactly what Cytokinesis will look like — then check.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "biology-mitosis-explain-001",
        question: "Why does DNA need to replicate before mitosis begins, rather than during it?",
        answer:
          "Mitosis's job is to distribute an already-complete, duplicated set of chromosomes evenly into two new cells — it isn't the step that creates the duplicate copies in the first place. If DNA replication happened during mitosis instead of before it, there would be no guarantee each daughter cell received a full, matching set; doing the copying first, during interphase, is what makes an even, accurate split possible.",
      },
      {
        id: "biology-mitosis-explain-002",
        question: "Why do sister chromatids stay joined through prophase and metaphase, only separating in anaphase?",
        answer:
          "Staying joined at the centromere through prophase and metaphase keeps each pair of identical copies together while the cell organizes and aligns them — this is what lets the cell's machinery treat each pair as a single unit until everything is correctly positioned. Only once every chromosome is properly attached and aligned does the cell trigger anaphase, separating all the pairs at the same coordinated moment.",
      },
      {
        id: "biology-mitosis-explain-003",
        question: "Why are the two daughter cells produced by mitosis genetically identical to each other and to the parent cell?",
        answer:
          "Because DNA replication during interphase produced two identical sister chromatids for every chromosome, and mitosis's whole function is to give one full identical set to each new cell — no genetic material is added, removed, or shuffled along the way, unlike in meiosis.",
      },
      {
        id: "biology-mitosis-explain-004",
        question: "Why is mitosis well-suited for growth and repair, specifically because it produces identical cells rather than varied ones?",
        answer:
          "Growth and repair need new cells that behave exactly like the surrounding tissue they're joining or replacing — a new skin cell needs to function like a skin cell, not something genetically different. Producing identical copies is exactly what makes mitosis suitable for that role, in contrast to meiosis, which serves a completely different purpose that specifically benefits from genetic variation.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    // Foreign key into the quiz-engine registry — all questions live in
    // @/features/quiz-engine/data/biology-mitosis-quiz.ts.
    quizId: "biology-mitosis",
  },

  // -------------------------------------------------------------
  // CHALLENGE
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice. Use the simulation above to check visual questions, and use the hints if you get stuck.",
    scenarios: [
      {
        id: "biology-mitosis-challenge-001",
        title: "Identify the Stage",
        scenario: "In the simulation, step to the stage where chromosomes are lined up neatly in a single row down the middle of the cell.",
        objective: "Name the stage this describes.",
        tools: [{ id: "stage-controls", label: "Stage controls (Next Stage / Previous Stage)" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Metaphase" },
            { id: "b", label: "Prophase" },
            { id: "c", label: "Anaphase" },
            { id: "d", label: "Telophase" },
          ],
          correctOptionId: "a",
        },
        explanation: "Chromosomes aligning at the cell's middle is the defining feature of metaphase.",
        hints: ["Which stage's name literally suggests being 'in the middle'?"],
      },
      {
        id: "biology-mitosis-challenge-002",
        title: "Put the Stages in Order",
        scenario: "Consider these four stages, listed out of order: Telophase, Prophase, Anaphase, Metaphase.",
        objective: "Select the option that lists them in the correct biological sequence.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Prophase, Metaphase, Anaphase, Telophase" },
            { id: "b", label: "Prophase, Anaphase, Metaphase, Telophase" },
            { id: "c", label: "Metaphase, Prophase, Telophase, Anaphase" },
            { id: "d", label: "Telophase, Anaphase, Metaphase, Prophase" },
          ],
          correctOptionId: "a",
        },
        explanation: "The correct order is Prophase, Metaphase, Anaphase, Telophase — chromosomes condense, align, separate, then new nuclei form.",
        hints: ["Chromosomes must condense (Prophase) before they can align (Metaphase)."],
      },
      {
        id: "biology-mitosis-challenge-003",
        title: "Predict the Next Stage",
        scenario: "In the simulation, step to Anaphase and observe the chromosomes actively separating toward opposite poles.",
        objective: "Determine what the very next stage will show.",
        tools: [{ id: "stage-controls", label: "Stage controls (Next Stage / Previous Stage)" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Telophase — two new nuclei forming around each set of chromosomes" },
            { id: "b", label: "Prophase — chromosomes condensing for the first time" },
            { id: "c", label: "Metaphase — chromosomes lining up at the middle" },
            { id: "d", label: "Interphase — the cell growing and preparing to divide again" },
          ],
          correctOptionId: "a",
        },
        explanation: "Telophase follows anaphase: once chromosomes reach the poles, new nuclear envelopes form around each set.",
        hints: ["What comes right after Anaphase in the five-stage sequence?"],
      },
      {
        id: "biology-mitosis-challenge-004",
        title: "What Happens to the Chromosomes",
        scenario: "A cell has just finished cytokinesis, producing two daughter cells.",
        objective: "Determine how the chromosome content of each daughter cell compares to the original parent cell.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Each daughter cell has the same number and type of chromosomes as the parent cell" },
            { id: "b", label: "Each daughter cell has half the chromosome number of the parent cell" },
            { id: "c", label: "Each daughter cell has double the chromosome number of the parent cell" },
            { id: "d", label: "The daughter cells have no chromosomes at all" },
          ],
          correctOptionId: "a",
        },
        explanation: "Mitosis preserves chromosome number — each daughter cell ends up with the same set the parent cell had.",
        hints: ["Mitosis is used for growth and repair — what would happen if the new cells had the wrong number of chromosomes?"],
      },
      {
        id: "biology-mitosis-challenge-005",
        title: "Analyze a Cell-Division Scenario",
        scenario: "A biologist observes a cell where the nuclear envelope has just broken down and chromosomes are visibly condensing, but nothing is aligned yet.",
        objective: "Identify the stage, and explain what should happen next.",
        requiresExperiment: false,
        maxAttempts: 3,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Prophase — next, the chromosomes will align at the cell's middle in metaphase" },
            { id: "b", label: "Metaphase — next, the chromosomes will separate in anaphase" },
            { id: "c", label: "Anaphase — next, two new nuclei will form in telophase" },
            { id: "d", label: "Telophase — next, the cell will physically divide in cytokinesis" },
          ],
          correctOptionId: "a",
        },
        explanation: "A breaking-down nuclear envelope and condensing (but not yet aligned) chromosomes describes prophase; metaphase comes next.",
        hints: ["Which stage is defined by the nuclear envelope breaking down and chromosomes condensing?"],
      },
      {
        id: "biology-mitosis-challenge-006",
        title: "Correct a Deliberately Wrong Claim",
        scenario: "A classmate says: 'Since sister chromatids look joined together in metaphase, they must already be separating by that point.'",
        objective: "Explain what's wrong with this reasoning.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Sister chromatids remain fully joined at the centromere through metaphase — separation doesn't begin until anaphase" },
            { id: "b", label: "The classmate is correct — separation begins in metaphase" },
            { id: "c", label: "Sister chromatids are never joined at any point during mitosis" },
            { id: "d", label: "Sister chromatids separate during prophase, before metaphase" },
          ],
          correctOptionId: "a",
        },
        explanation: "Being visually lined up together in metaphase does not mean separation has started — chromatids stay joined at the centromere until anaphase actively pulls them apart.",
        hints: ["What is the specific event that defines anaphase, if not metaphase?"],
      },
      {
        id: "biology-mitosis-challenge-007",
        title: "Explain the Final Result",
        scenario: "A student asks why mitosis matters for a person's everyday life, beyond the biology classroom.",
        objective: "Choose the best real-world explanation of mitosis's importance.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "It's how the body grows, heals wounds, and replaces worn-out cells with identical new ones" },
            { id: "b", label: "It's how the body produces eggs and sperm for reproduction" },
            { id: "c", label: "It's how the body reduces its chromosome number as it ages" },
            { id: "d", label: "It has no practical importance outside of a biology classroom" },
          ],
          correctOptionId: "a",
        },
        explanation: "Mitosis is responsible for growth, wound healing, and the ongoing replacement of cells throughout a person's life — all real, everyday biological processes.",
        hints: ["Think back to the 'Why it matters' section — growth and repair are the key words."],
      },
      {
        id: "biology-mitosis-challenge-008",
        title: "Multi-Step: Counting Chromosomes Through Mitosis",
        scenario: "A cell enters interphase with 6 unreplicated chromosomes. DNA replication then occurs, and the cell proceeds through mitosis.",
        objective: "Determine how many chromosomes each of the two final daughter cells will have.",
        requiresExperiment: false,
        maxAttempts: 3,
        answer: { mode: "numeric", target: 6, tolerance: 0.1 },
        explanation: "Replication doesn't change the chromosome count — it duplicates each chromosome into two sister chromatids, which are then separated in anaphase to become individual chromosomes again. Each daughter cell ends up with the same number the parent started with: 6.",
        hints: ["Replication turns each chromosome into two sister chromatids of the same chromosome — it does not create new, separate chromosomes until anaphase.", "Mitosis maintains chromosome number rather than changing it."],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "biology",
      topicSlug: "meiosis",
      label: "Meiosis: How Sex Cells Are Formed",
      href: "/dashboard/biology/meiosis",
      reason: "Compare this single-division, identical-cell process against meiosis's two-division, genetically-varied process.",
    },
    {
      subjectSlug: "biology",
      topicSlug: "what-is-a-cell",
      label: "What Is a Cell?",
      href: "/dashboard/biology/what-is-a-cell",
      reason: "Revisit the basic unit of life that mitosis produces more of.",
    },
  ],
};
