import type { TopicContent } from "../types";

/**
 * Meiosis — Biology GLE Batch 3 ("Cell Division"), topic 2 of 2.
 * Reuses the existing `Meiosis` simulation
 * (`@/features/subjects/biology/meiosis`) exactly as-is: it already
 * models the correct nine-stage sequence (DNA Replication, then
 * Prophase I → Telophase I, then Prophase II → Telophase II), a
 * MEIOSIS I / MEIOSIS II / 4 Haploid Cells overview strip with the
 * 2n → n chromosome reminder, color-coded homologous pairs (by both
 * size and maternal/paternal color, satisfying the "matching
 * colors/shapes" visual requirement), key-concept callouts on the two
 * anaphase stages, a Why It Matters card, and a built-in four-row
 * Mitosis-vs-Meiosis comparison table linking back to the Mitosis
 * page — so no simulation code changes were needed. This topic's
 * Learn/Explain content below adds the two comparison rows (genetic
 * similarity, homologous pairing) the simulation's compact table
 * doesn't show, without touching the simulation itself.
 *
 * `practice.quizId` points at a new, dedicated 30-question bank,
 * `biology-meiosis-gle` (`@/features/quiz-engine/data/biology-
 * meiosis-gle-quiz.ts`) — deliberately a different id from the
 * pre-existing 5-question `biology-meiosis` bank (still linked from
 * the standalone `/dashboard/biology/meiosis-quiz` page, left
 * unmodified) so the two banks don't collide.
 */
export const biologyMeiosisContent: TopicContent = {
  subjectSlug: "biology",
  topicSlug: "meiosis",
  title: "Meiosis: How Sex Cells Are Formed",
  subjectLabel: "Biology",
  topicLabel: "Cell Division",
  colorToken: "biology",
  simulationHref: "/dashboard/biology/meiosis",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Explain the purpose of meiosis: producing gametes for sexual reproduction.",
      "Define diploid and haploid, and explain how meiosis converts one into the other.",
      "Distinguish homologous chromosomes from sister chromatids.",
      "Describe the two-division sequence: Meiosis I (homologous chromosomes separate) then Meiosis II (sister chromatids separate).",
      "Explain how crossing over and independent assortment create genetic variation.",
      "Compare mitosis and meiosis across purpose, number of divisions, final cell count, chromosome number, genetic similarity, and homologous pairing.",
    ],
    concepts: [
      {
        term: "The purpose of meiosis",
        explanation:
          "Meiosis is a specialized kind of cell division that produces gametes — eggs and sperm — the cells used in sexual reproduction. Unlike mitosis, its job isn't to make more identical body cells; it's to make genetically varied sex cells with half the usual chromosome number.",
      },
      {
        term: "Diploid and haploid",
        explanation:
          "A diploid cell (2n) has two full sets of chromosomes, one from each parent. A haploid cell (n) has just one set — half the diploid number. Meiosis takes a diploid starting cell and produces haploid gametes, so that when two gametes combine at fertilization, the full diploid number is restored.",
      },
      {
        term: "Homologous chromosomes vs. sister chromatids",
        explanation:
          "These are two different kinds of chromosome pairs, and mixing them up is one of the most common meiosis mistakes. Homologous chromosomes are a matched pair — one from each parent — carrying genes for the same traits, but not necessarily identical genetic information. Sister chromatids are identical copies of one chromosome, created by DNA replication.",
      },
      {
        term: "Meiosis I: homologous chromosomes separate",
        explanation:
          "In Prophase I, homologous chromosomes pair up and can exchange segments of DNA (crossing over). In Metaphase I, those paired homologs line up together. In Anaphase I, the homologous pairs separate — sister chromatids stay joined. By the end of Telophase I, there are two cells, each with one chromosome (still as two sister chromatids) from every original pair.",
      },
      {
        term: "Meiosis II: sister chromatids separate",
        explanation:
          "Meiosis II proceeds without any additional DNA replication — it doesn't need it, since the chromosomes still have their sister chromatids from before Meiosis I. In Anaphase II, sister chromatids finally separate, just like in mitosis. By the end of Telophase II, four haploid cells exist in total.",
      },
      {
        term: "Genetic variation",
        explanation:
          "Two mechanisms during meiosis shuffle genetic material: crossing over (homologous chromosomes exchanging DNA segments in Prophase I) and independent assortment (each homologous pair being distributed to gametes independently of the others). Together, these make the four final cells genetically different from each other and from the parent cell.",
      },
      {
        term: "Mitosis vs. meiosis, side by side",
        explanation:
          "Main purpose: growth/repair/replacement (mitosis) vs. gamete production (meiosis). Number of divisions: 1 vs. 2. Final cells: 2 vs. 4. Chromosome number: maintained vs. reduced by half. Genetic similarity: generally identical (mitosis) vs. genetically varied (meiosis). Homologous pairing: does not occur (mitosis) vs. occurs in Meiosis I (meiosis).",
      },
    ],
    whyItMatters:
      "Meiosis is the reason offspring resemble their parents without being exact copies of them. By halving the chromosome number and shuffling genetic material through crossing over and independent assortment, meiosis guarantees that when a sperm and egg combine at fertilization, the resulting cell has the correct diploid chromosome number — while still being a genetically unique individual, different from either parent. Without meiosis, chromosome numbers would double every generation, and offspring would be identical rather than unique.",
    keyTerms: [
      { term: "Diploid (2n)", definition: "Having two full sets of chromosomes, one from each parent." },
      { term: "Haploid (n)", definition: "Having a single set of chromosomes — half the diploid number." },
      { term: "Homologous chromosomes", definition: "A matched pair of chromosomes, one from each parent, carrying genes for the same traits." },
      { term: "Crossing over", definition: "The exchange of DNA segments between paired homologous chromosomes during Prophase I." },
      { term: "Independent assortment", definition: "The random distribution of which homologous chromosome (maternal or paternal) ends up in which gamete." },
      { term: "Gamete", definition: "A haploid sex cell (egg or sperm) produced by meiosis, used in sexual reproduction." },
    ],
    misconceptions: [
      {
        id: "misconception-homologs-separate-anaphase-2",
        misconception: "Homologous chromosomes separate during Anaphase II.",
        correction:
          "Homologous chromosomes separate during Anaphase I. By Anaphase II, each cell only has one chromosome from each original pair (now made of two sister chromatids) — what separates in Anaphase II is sister chromatids, not homologous chromosomes.",
      },
      {
        id: "misconception-chromatids-separate-anaphase-1",
        misconception: "Sister chromatids separate during Anaphase I.",
        correction:
          "Sister chromatids remain joined through Anaphase I — only the homologous chromosome pairs separate at that point. Sister chromatids don't separate until Anaphase II.",
      },
      {
        id: "misconception-dna-replicates-between-divisions",
        misconception: "DNA replicates again between Meiosis I and Meiosis II.",
        correction:
          "DNA replicates only once, before Meiosis I begins. There is no second replication between Meiosis I and Meiosis II — the chromosomes entering Meiosis II are still made of two sister chromatids from the original replication, which is exactly what Meiosis II needs to separate.",
      },
      {
        id: "misconception-meiosis-two-final-cells",
        misconception: "Meiosis produces two final cells.",
        correction:
          "Two cells is only the result after Meiosis I. A complete round of meiosis includes Meiosis II, which divides each of those two cells again — producing four final haploid cells in total.",
      },
      {
        id: "misconception-meiosis-identical-cells",
        misconception: "Meiosis produces genetically identical cells, the same as mitosis.",
        correction:
          "Meiosis's four final cells are genetically varied, not identical — crossing over and independent assortment shuffle genetic material so each of the four cells carries a different combination. This is a key difference from mitosis, whose daughter cells are genetically identical.",
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
        id: "biology-meiosis-predict-001",
        scenario: "The simulation is about to move from Prophase I (where homologous chromosomes are pairing up) into Anaphase I.",
        question: "What will separate during Anaphase I?",
        options: [
          { id: "homologs-separate", label: "The homologous chromosomes — sister chromatids stay joined" },
          { id: "chromatids-separate", label: "The sister chromatids — homologous chromosomes stay joined" },
          { id: "both-separate", label: "Both homologous chromosomes and sister chromatids separate at once" },
          { id: "nothing-separates", label: "Nothing separates during Anaphase I" },
        ],
        actualResultOptionId: "homologs-separate",
        explanation: "Anaphase I separates the paired homologous chromosomes from each other. Sister chromatids remain joined at this point — they won't separate until Anaphase II.",
        hint: "Meiosis I is specifically the division that separates homologous pairs.",
      },
      {
        id: "biology-meiosis-predict-002",
        scenario: "Telophase I has just completed, producing two cells.",
        question: "Will chromosome number remain the same, or change, going into these two cells compared to the original starting cell?",
        options: [
          { id: "number-reduced", label: "Each cell now has half the number of chromosomes the original cell had" },
          { id: "number-same", label: "Each cell has exactly the same chromosome number as the original cell" },
          { id: "number-doubled", label: "Each cell has double the chromosome number of the original cell" },
          { id: "number-random", label: "The chromosome number is different in each of the two cells, randomly" },
        ],
        actualResultOptionId: "number-reduced",
        explanation: "Since homologous pairs separated into different cells during Anaphase I, each of the two resulting cells has only one chromosome from every original pair — half the original number.",
        hint: "This is the point where the 2n → n reduction actually happens.",
      },
      {
        id: "biology-meiosis-predict-003",
        scenario: "The simulation is about to move from Metaphase II into Anaphase II.",
        question: "What structures separate during Anaphase II?",
        options: [
          { id: "sister-chromatids-separate", label: "Sister chromatids" },
          { id: "homologous-chromosomes-separate", label: "Homologous chromosomes" },
          { id: "whole-cells-separate", label: "Whole cells" },
          { id: "nothing", label: "Nothing — Anaphase II doesn't involve separation" },
        ],
        actualResultOptionId: "sister-chromatids-separate",
        explanation: "Anaphase II separates sister chromatids — the same kind of separation mitosis uses, but happening in the second meiotic division, on cells that already went through Meiosis I.",
        hint: "By this point, homologous pairs are long gone — what's left to separate?",
      },
      {
        id: "biology-meiosis-predict-004",
        scenario: "The simulation reaches Telophase II, the final stage.",
        question: "How many total cells will result, and will they be genetically identical to each other?",
        options: [
          { id: "four-varied", label: "Four cells, genetically varied from each other" },
          { id: "two-identical", label: "Two cells, genetically identical to each other" },
          { id: "four-identical", label: "Four cells, genetically identical to each other" },
          { id: "one-cell", label: "One final cell, unchanged from the original" },
        ],
        actualResultOptionId: "four-varied",
        explanation: "Meiosis produces four haploid cells total, and because of crossing over and independent assortment earlier in the process, they are genetically varied rather than identical — check the Final Result flow summary and the Mitosis comparison once it completes.",
        hint: "Recall how many total divisions meiosis involves, and why crossing over matters.",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Press Start to watch a diploid cell move automatically through all nine stages, or use Next Stage to step through them one at a time.",
      "Watch the MEIOSIS I / MEIOSIS II / 4 Haploid Cells overview strip at the top to track which phase you're in, and the 2n → n reminder underneath it.",
      "Notice the color-coded chromosome pairs — each homologous pair shares a size (large or small) but has two different colors, one for each parent's contribution.",
      "Read the 'What happens?' explanation for each stage, and watch for the amber Key Concept callouts on Anaphase I and Anaphase II — these mark the two most important separation events.",
      "Reach Telophase II and read the Final Result flow summary, the Why It Matters card, and the built-in Mitosis-vs-Meiosis comparison table.",
      "Use Reset to return to the start and try predicting each stage's outcome again before it happens.",
    ],
    tryThis: [
      "Step through Prophase I → Metaphase I → Anaphase I → Telophase I one click at a time, describing in your own words what happens to the homologous pairs.",
      "Once in Meiosis II, compare Metaphase II to Metaphase I — what's different about what's lining up in the middle of the cell?",
      "At the end, use the built-in comparison table's 'Open Mitosis' link to compare this whole process side by side with mitosis.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "biology-meiosis-explain-001",
        question: "Why does chromosome reduction happen in Anaphase I rather than Anaphase II?",
        answer:
          "Anaphase I is specifically when homologous chromosome pairs — two full sets — are pulled apart into two separate cells, so each resulting cell keeps only one chromosome from every original pair. That's the actual halving event. Anaphase II, by contrast, separates sister chromatids (identical copies of a single chromosome), which doesn't change how many distinct chromosomes are in each cell — it just finishes distributing what's already been reduced.",
      },
      {
        id: "biology-meiosis-explain-002",
        question: "Why doesn't DNA need to replicate again between Meiosis I and Meiosis II?",
        answer:
          "Each chromosome entering Meiosis II is still made of two sister chromatids — leftover from the single round of DNA replication that happened before Meiosis I even began. Meiosis II's whole job is to separate those existing sister chromatids, so there's nothing new to copy; another round of replication would be unnecessary and would actually produce the wrong final chromosome number.",
      },
      {
        id: "biology-meiosis-explain-003",
        question: "Why do crossing over and independent assortment together make the four final cells genetically different from each other?",
        answer:
          "Crossing over physically swaps segments of DNA between homologous chromosomes during Prophase I, so no chromosome that goes into a gamete is quite the same as either original parental chromosome. Independent assortment then randomly determines which homolog from each pair ends up in which cell. Combined, these two mechanisms make it astronomically unlikely that any two of the four final gametes carry the exact same genetic combination.",
      },
      {
        id: "biology-meiosis-explain-004",
        question: "Why does meiosis produce genetically varied cells while mitosis produces identical ones, even though both start from chromosome replication?",
        answer:
          "The difference isn't in the replication step — both processes start from replicated, identical sister chromatids. It's in what happens afterward: mitosis distributes matching copies straight to two cells with no pairing or shuffling step. Meiosis, by contrast, pairs up homologous chromosomes and gives them the chance to cross over and be independently assorted before anything is finally separated — those extra steps are exactly what mitosis skips, and exactly why meiosis's outcome is different.",
      },
      {
        id: "biology-meiosis-explain-005",
        question: "Why is it biologically necessary for gametes to be haploid rather than diploid?",
        answer:
          "If gametes were diploid, combining an egg and sperm at fertilization would double the chromosome number every single generation — quickly becoming unworkable. By making gametes haploid (half the usual number), meiosis ensures that fertilization restores exactly the normal diploid number, generation after generation, rather than compounding it.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    // Foreign key into the quiz-engine registry — all questions live in
    // @/features/quiz-engine/data/biology-meiosis-gle-quiz.ts (distinct
    // from the pre-existing, smaller "biology-meiosis" bank).
    quizId: "biology-meiosis-gle",
  },

  // -------------------------------------------------------------
  // CHALLENGE
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice. Use the simulation above to check visual and sequencing questions, and use the hints if you get stuck.",
    scenarios: [
      {
        id: "biology-meiosis-challenge-001",
        title: "Identify the Stage",
        scenario: "In the simulation, step to the stage where paired homologous chromosomes (matched by size and color) are lining up together in the middle of the cell, before any separation has happened.",
        objective: "Name the stage this describes.",
        tools: [{ id: "stage-controls", label: "Stage controls (Next Stage)" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Metaphase I" },
            { id: "b", label: "Metaphase II" },
            { id: "c", label: "Anaphase I" },
            { id: "d", label: "Prophase II" },
          ],
          correctOptionId: "a",
        },
        explanation: "Paired homologous chromosomes lining up together (not yet separated) is Metaphase I — in Metaphase II, only individual chromosomes line up, since the pairs have already separated.",
        hints: ["Are the aligned chromosomes still in matched pairs, or already individual?"],
      },
      {
        id: "biology-meiosis-challenge-002",
        title: "Sequence the Full Process",
        scenario: "Consider these stages, listed out of order: Telophase II, Anaphase I, Prophase I, Metaphase II.",
        objective: "Select the option listing all four (plus the two missing stages) in the correct overall sequence.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Prophase I, Anaphase I, Metaphase II, Telophase II" },
            { id: "b", label: "Anaphase I, Prophase I, Telophase II, Metaphase II" },
            { id: "c", label: "Prophase I, Telophase II, Anaphase I, Metaphase II" },
            { id: "d", label: "Metaphase II, Anaphase I, Prophase I, Telophase II" },
          ],
          correctOptionId: "a",
        },
        explanation: "The correct order is Prophase I, then Anaphase I (skipping over Metaphase I, Telophase I, and Prophase II which sit between them), then Metaphase II, then Telophase II.",
        hints: ["Everything with a 'I' happens before everything with a 'II'."],
      },
      {
        id: "biology-meiosis-challenge-003",
        title: "Predict the Next Event",
        scenario: "In the simulation, step to Metaphase I and observe the paired homologous chromosomes aligned together.",
        objective: "Determine what event happens next.",
        tools: [{ id: "stage-controls", label: "Stage controls (Next Stage)" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Anaphase I — the homologous pairs separate" },
            { id: "b", label: "Anaphase II — sister chromatids separate" },
            { id: "c", label: "Prophase II — chromosomes reorganize for a second division" },
            { id: "d", label: "The cell immediately produces four haploid cells" },
          ],
          correctOptionId: "a",
        },
        explanation: "Metaphase I is followed directly by Anaphase I, where the homologous pairs separate.",
        hints: ["What always immediately follows any Metaphase stage?"],
      },
      {
        id: "biology-meiosis-challenge-004",
        title: "Homologous Chromosome Analysis",
        scenario: "A diploid cell has 4 pairs of homologous chromosomes (8 chromosomes total) entering meiosis.",
        objective: "Determine how many chromosomes each cell will have immediately after Meiosis I completes (Telophase I).",
        requiresExperiment: false,
        answer: { mode: "numeric", target: 4, tolerance: 0.1 },
        explanation: "Meiosis I separates the 4 homologous pairs into two cells, so each cell ends up with 4 chromosomes (each still made of two sister chromatids) — half of the original 8.",
        hints: ["Meiosis I is the division that halves the chromosome number.", "8 chromosomes in 4 pairs, split between two cells."],
      },
      {
        id: "biology-meiosis-challenge-005",
        title: "Sister Chromatid Analysis",
        scenario: "Continuing from the same cell: each of the two cells from Meiosis I now goes through Meiosis II.",
        objective: "Determine how many chromosomes each of the four final haploid cells will have.",
        requiresExperiment: false,
        answer: { mode: "numeric", target: 4, tolerance: 0.1 },
        explanation: "Meiosis II separates sister chromatids, not homologous chromosomes — this changes each chromosome from two chromatids to one, but doesn't change the count of distinct chromosomes. Each final cell still has 4 chromosomes, now as single (unreplicated) chromosomes.",
        hints: ["Meiosis II separates sister chromatids, which doesn't reduce the chromosome count again — that reduction already happened in Meiosis I."],
      },
      {
        id: "biology-meiosis-challenge-006",
        title: "Chromosome-Number Reasoning",
        scenario: "A species has a diploid chromosome number of 20.",
        objective: "Determine the haploid chromosome number that this species' gametes will have.",
        requiresExperiment: false,
        answer: { mode: "numeric", target: 10, tolerance: 0.1 },
        explanation: "Meiosis halves the diploid number: 20 ÷ 2 = 10 chromosomes per gamete.",
        hints: ["Haploid number is always half the diploid number."],
      },
      {
        id: "biology-meiosis-challenge-007",
        title: "Mitosis vs. Meiosis Comparison",
        scenario: "A student is given two unlabeled diagrams: one cell divides once into two identical cells, the other divides twice into four genetically varied cells.",
        objective: "Determine which diagram represents mitosis and which represents meiosis.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "One division/two identical cells is mitosis; two divisions/four varied cells is meiosis" },
            { id: "b", label: "One division/two identical cells is meiosis; two divisions/four varied cells is mitosis" },
            { id: "c", label: "Both diagrams could represent either process equally well" },
            { id: "d", label: "Neither diagram represents a real biological process" },
          ],
          correctOptionId: "a",
        },
        explanation: "One division producing two identical cells is the signature of mitosis. Two divisions producing four genetically varied cells is the signature of meiosis.",
        hints: ["Which process is known for a single division, and which for two?"],
      },
      {
        id: "biology-meiosis-challenge-008",
        title: "Genetic Variation Reasoning",
        scenario: "A classmate says: 'Since all four cells from meiosis come from the exact same starting cell, they should all be genetically identical, just like mitosis produces.'",
        objective: "Explain what's wrong with this reasoning.",
        requiresExperiment: false,
        maxAttempts: 3,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Crossing over and independent assortment during meiosis shuffle genetic material, so the four cells end up genetically varied despite sharing the same starting cell" },
            { id: "b", label: "The classmate is correct — meiosis and mitosis both produce identical cells" },
            { id: "c", label: "The four cells are identical only in animals, not in plants" },
            { id: "d", label: "Genetic variation has nothing to do with meiosis" },
          ],
          correctOptionId: "a",
        },
        explanation: "Sharing a starting cell doesn't guarantee identical results — the crossing over (in Prophase I) and independent assortment (in Metaphase I) steps specific to meiosis actively shuffle genetic material along the way, which is exactly what makes meiosis's outcome different from mitosis's, despite both starting from one cell.",
        hints: ["What extra steps does meiosis have that mitosis doesn't — specifically around Prophase I and Metaphase I?"],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "biology",
      topicSlug: "mitosis",
      label: "Mitosis: How One Cell Becomes Two",
      href: "/dashboard/biology/mitosis",
      reason: "Compare this two-division, genetically-varied process against mitosis's single-division, identical-cell process.",
    },
    {
      subjectSlug: "biology",
      topicSlug: "what-is-a-cell",
      label: "What Is a Cell?",
      href: "/dashboard/biology/what-is-a-cell",
      reason: "Revisit the basic unit of life that meiosis's gametes ultimately combine to form.",
    },
  ],
};
