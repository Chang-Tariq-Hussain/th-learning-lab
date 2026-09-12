import type { TopicContent } from "../types";

/**
 * Digestive System — Journey of Food & Nutrient Absorption. Biology GLE
 * Batch 4, topic 1 of 2 ("Human Physiology"). Reuses the existing
 * `DigestiveSystem` simulation (`@/features/subjects/biology/digestive-system`)
 * — food journey animation, organ explorer, villi zoom, nutrient types,
 * digestion-vs-absorption comparison — with one addition: a new
 * `AccessoryOrgans` panel (liver, gallbladder, pancreas), since the
 * simulation previously had no accessory-organ content at all. The
 * rectum stage caption was also updated to explicitly name the anus as
 * the tract's final opening.
 */
export const biologyDigestiveSystemContent: TopicContent = {
  subjectSlug: "biology",
  topicSlug: "digestive-system",
  title: "Digestive System: The Journey of Food",
  subjectLabel: "Biology",
  topicLabel: "Human Physiology",
  colorToken: "biology",
  simulationHref: "/dashboard/biology/digestive-system",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Explain the digestive system's purpose: breaking food down and absorbing nutrients the body can use.",
      "Distinguish mechanical digestion from chemical digestion.",
      "Trace the full pathway of food: mouth → esophagus → stomach → small intestine → large intestine → rectum → anus.",
      "Explain why the liver, gallbladder, and pancreas are accessory organs — not part of the tract food travels through.",
      "Distinguish digestion (breaking food down) from absorption (nutrients entering the bloodstream).",
      "Explain how villi increase the small intestine's surface area for absorption.",
    ],
    concepts: [
      {
        term: "Mechanical vs. chemical digestion",
        explanation:
          "Mechanical digestion is the physical breakup of food — chewing in the mouth, churning in the stomach — into smaller pieces. Chemical digestion is the breakdown of those pieces at the molecular level, using enzymes and acids, into molecules small enough for the body to absorb. Both happen throughout the digestive tract, often at the same time.",
      },
      {
        term: "The main pathway",
        explanation:
          "Food travels through one continuous tract: mouth → esophagus → stomach → small intestine → large intestine → rectum → anus. Each organ has a specific job along the way — nothing is skipped, and nothing is repeated.",
      },
      {
        term: "The mouth and saliva",
        explanation:
          "Digestion starts in the mouth: teeth mechanically break food apart, and saliva begins chemical digestion of starches while also moistening food so it can be swallowed.",
      },
      {
        term: "The stomach churns and breaks down",
        explanation:
          "The stomach mechanically churns food and chemically breaks it down with acid and enzymes, turning it into a semi-liquid mixture before releasing it gradually into the small intestine.",
      },
      {
        term: "The small intestine is where most absorption happens",
        explanation:
          "Digestion finishes in the small intestine, and this is also where most nutrient absorption occurs — glucose, amino acids, and fatty acids all pass from here into the bloodstream, largely thanks to villi lining its walls.",
      },
      {
        term: "The large intestine absorbs water",
        explanation:
          "By the time food residue reaches the large intestine, most nutrients have already been absorbed. Its main job is absorbing water from what's left, which turns the remaining material into solid waste.",
      },
      {
        term: "Accessory organs support digestion without food passing through them",
        explanation:
          "The liver, gallbladder, and pancreas all contribute to digestion — the liver produces bile, the gallbladder stores and releases it, and the pancreas supplies digestive enzymes — but food never physically travels through any of them. Their secretions are delivered into the small intestine, not into a path food follows.",
      },
      {
        term: "Villi and surface area",
        explanation:
          "The small intestine's inner wall is covered in villi — tiny, finger-like projections that dramatically increase its surface area. More surface area means more room for nutrients to be absorbed into the bloodstream at once.",
      },
    ],
    whyItMatters:
      "Every meal has to be broken down into molecules small enough to cross into the bloodstream before the body can use any of its energy or building blocks. Understanding this pathway explains why digestive problems in one organ (like the pancreas or gallbladder) affect digestion elsewhere, why some nutrients are absorbed better with certain foods, and how the body turns something as ordinary as a sandwich into usable fuel.",
    keyTerms: [
      { term: "Mechanical digestion", definition: "The physical breakup of food into smaller pieces, such as chewing or churning." },
      { term: "Chemical digestion", definition: "The molecular breakdown of food using enzymes and acids into absorbable nutrients." },
      { term: "Villi", definition: "Tiny, finger-like projections lining the small intestine that increase its surface area for absorption." },
      { term: "Absorption", definition: "The movement of nutrients from the digestive system into the bloodstream." },
      { term: "Accessory organ", definition: "An organ (liver, gallbladder, or pancreas) that supports digestion but that food does not pass through." },
      { term: "Bile", definition: "A substance produced by the liver and stored by the gallbladder that helps break down fats." },
    ],
    misconceptions: [
      {
        id: "misconception-digestion-equals-absorption",
        misconception: "Digestion and absorption are the same process.",
        correction:
          "Digestion is breaking food down into smaller molecules. Absorption is a separate step: moving those molecules from the digestive system into the bloodstream. Food can be fully digested in a spot where little absorption happens, and vice versa.",
      },
      {
        id: "misconception-food-through-liver",
        misconception: "Food passes through the liver, gallbladder, or pancreas on its way through the digestive tract.",
        correction:
          "Food never enters these organs. They are accessory organs: the liver makes bile, the gallbladder stores and releases it, and the pancreas supplies enzymes — but all of these secretions are delivered into the small intestine, while food itself stays inside the actual tract (mouth → esophagus → stomach → small intestine → large intestine → rectum → anus).",
      },
      {
        id: "misconception-stomach-absorbs-most",
        misconception: "Most nutrient absorption happens in the stomach.",
        correction:
          "The stomach's main job is digestion — churning and chemically breaking food down — not absorption. Most nutrient absorption happens later, in the small intestine, where villi provide the surface area needed for it.",
      },
      {
        id: "misconception-large-intestine-digests",
        misconception: "The large intestine's main job is digesting food.",
        correction:
          "By the time food residue reaches the large intestine, digestion is essentially finished. The large intestine's main job is absorbing water from the remaining material, not breaking food down further.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Commit to a prediction before starting the food journey or exploring an organ — then check what actually happens.",
    scenarios: [
      {
        id: "biology-digestive-system-predict-001",
        scenario: "Food has just left the stomach.",
        question: "Where does it go next?",
        options: [
          { id: "small-intestine", label: "The small intestine" },
          { id: "large-intestine", label: "The large intestine" },
          { id: "liver", label: "The liver" },
          { id: "esophagus", label: "Back up the esophagus" },
        ],
        actualResultOptionId: "small-intestine",
        explanation: "After the stomach, food moves into the small intestine, where digestion finishes and most nutrient absorption occurs.",
        hint: "The digestive tract only moves in one direction, organ by organ.",
      },
      {
        id: "biology-digestive-system-predict-002",
        scenario: "You're asked where most nutrient absorption occurs in the digestive system.",
        question: "Which organ is it?",
        options: [
          { id: "stomach", label: "The stomach" },
          { id: "small-intestine", label: "The small intestine" },
          { id: "large-intestine", label: "The large intestine" },
          { id: "esophagus", label: "The esophagus" },
        ],
        actualResultOptionId: "small-intestine",
        explanation: "The small intestine, lined with villi, is where most nutrient absorption happens.",
        hint: "Look for the organ with the surface-area-boosting structures.",
      },
      {
        id: "biology-digestive-system-predict-003",
        scenario: "You're deciding what the small intestine's main role is.",
        question: "What best describes it?",
        options: [
          { id: "digest-absorb", label: "Finishing digestion and absorbing most nutrients" },
          { id: "storage-only", label: "Only storing food temporarily" },
          { id: "water-only", label: "Only absorbing water" },
          { id: "mechanical-only", label: "Only mechanically breaking food apart" },
        ],
        actualResultOptionId: "digest-absorb",
        explanation: "The small intestine both finishes chemical digestion and absorbs most nutrients into the bloodstream.",
        hint: "Two things happen here, not just one.",
      },
      {
        id: "biology-digestive-system-predict-004",
        scenario: "You're asked which organ stores bile until it's needed.",
        question: "Which organ is it?",
        options: [
          { id: "gallbladder", label: "The gallbladder" },
          { id: "liver", label: "The liver" },
          { id: "pancreas", label: "The pancreas" },
          { id: "stomach", label: "The stomach" },
        ],
        actualResultOptionId: "gallbladder",
        explanation: "The gallbladder stores bile (made by the liver) and releases it when needed to help digest fat.",
        hint: "One organ makes bile; a different organ stores it.",
      },
      {
        id: "biology-digestive-system-predict-005",
        scenario: "You're asked which organ produces bile in the first place.",
        question: "Which organ is it?",
        options: [
          { id: "liver", label: "The liver" },
          { id: "gallbladder", label: "The gallbladder" },
          { id: "pancreas", label: "The pancreas" },
          { id: "small-intestine", label: "The small intestine" },
        ],
        actualResultOptionId: "liver",
        explanation: "The liver produces bile, which the gallbladder then stores and releases.",
        hint: "This organ also handles many other metabolic jobs for the body.",
      },
      {
        id: "biology-digestive-system-predict-006",
        scenario: "Food has just entered the stomach.",
        question: "What happens to it there?",
        options: [
          { id: "mechanical-chemical", label: "It's mechanically churned and chemically broken down by acid and enzymes" },
          { id: "absorbed-directly", label: "Its nutrients are absorbed directly into the bloodstream" },
          { id: "unchanged", label: "It passes through unchanged" },
          { id: "water-removed", label: "Water is removed from it" },
        ],
        actualResultOptionId: "mechanical-chemical",
        explanation: "The stomach both mechanically churns food and chemically digests it with acid and enzymes — but does very little absorption itself.",
        hint: "Think about both kinds of digestion happening at once.",
      },
      {
        id: "biology-digestive-system-predict-007",
        scenario: "You're asked why villi are useful.",
        question: "What's their main purpose?",
        options: [
          { id: "surface-area", label: "They increase surface area for nutrient absorption" },
          { id: "produce-acid", label: "They produce stomach acid" },
          { id: "mechanical-digestion", label: "They mechanically grind food" },
          { id: "store-waste", label: "They store waste before elimination" },
        ],
        actualResultOptionId: "surface-area",
        explanation: "Villi are tiny, finger-like projections that dramatically increase the small intestine's surface area, allowing more nutrients to be absorbed.",
        hint: "It's about the amount of surface exposed to nutrients.",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Press Start to send food on its journey through the digestive tract, and watch which organ lights up at each stage.",
      "Use the Organ Explorer to click any tract organ directly and read what happens there.",
      "Open the Accessory Organs panel to see how the liver, gallbladder, and pancreas each support digestion without food passing through them.",
      "Use the villi zoom to see how the small intestine's surface is structured for absorption, and trigger the nutrient exchange animation.",
      "Click each nutrient type to see what it's used for once absorbed.",
      "Review the digestion-vs-absorption comparison, then try the simulation's built-in mini-challenge.",
    ],
    tryThis: [
      "Run the full journey once without pausing, narrating each organ as food reaches it.",
      "Open all three accessory-organ cards and explain, without looking again, what each one contributes and why none of them are part of the tract itself.",
      "Zoom into the villi and explain in your own words why more surface area means more absorption.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "biology-digestive-system-explain-001",
        question: "Why do the liver, gallbladder, and pancreas count as accessory organs rather than part of the digestive tract?",
        answer:
          "Food itself never physically enters any of them. The digestive tract is the continuous path food actually travels — mouth, esophagus, stomach, small intestine, large intestine, rectum, anus. The liver, gallbladder, and pancreas instead deliver their products (bile and enzymes) into the small intestine from the outside, supporting digestion without ever having food pass through them.",
      },
      {
        id: "biology-digestive-system-explain-002",
        question: "Why does most nutrient absorption happen in the small intestine rather than the stomach?",
        answer:
          "The stomach's job is mostly digestion — mechanically churning food and chemically breaking it down with acid and enzymes — not absorption. By the time food reaches the small intestine, it's been broken down small enough to absorb, and the small intestine's villi-covered walls provide the enormous surface area needed to actually move those nutrients into the bloodstream efficiently.",
      },
      {
        id: "biology-digestive-system-explain-003",
        question: "Why are digestion and absorption considered two separate processes rather than one?",
        answer:
          "Digestion is about breaking food down into smaller molecules; absorption is about moving those molecules out of the digestive system and into the bloodstream. An organ can do a lot of one without much of the other — the stomach digests heavily but absorbs very little, while the small intestine both finishes digestion and does most of the absorbing. Treating them as the same step would miss why different organs specialize in different jobs.",
      },
      {
        id: "biology-digestive-system-explain-004",
        question: "Why does the large intestine mainly absorb water instead of continuing to digest food?",
        answer:
          "By the time material reaches the large intestine, digestion is essentially complete and most nutrients have already been absorbed in the small intestine. What's left is largely water and undigested residue, so the large intestine's main remaining job is reclaiming that water — which is also what turns the leftover material into solid waste.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    // Foreign key into the quiz-engine registry — all questions live in
    // @/features/quiz-engine/data/biology-digestive-system-quiz.ts.
    quizId: "biology-digestive-system",
  },

  // -------------------------------------------------------------
  // CHALLENGE
  // -------------------------------------------------------------
  challenge: {
    intro: "Harder, realistic problems than ordinary Practice. Use the Organ Explorer and Accessory Organs panel to check anything you're unsure of.",
    scenarios: [
      {
        id: "biology-digestive-system-challenge-001",
        title: "Order the Pathway",
        scenario: "Food is about to begin its journey through the digestive tract.",
        objective: "Identify the organ food reaches immediately after the stomach.",
        tools: [{ id: "organ-explorer", label: "Organ Explorer" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Small intestine" },
            { id: "b", label: "Large intestine" },
            { id: "c", label: "Liver" },
            { id: "d", label: "Esophagus" },
          ],
          correctOptionId: "a",
        },
        explanation: "After the stomach, food moves into the small intestine, not the large intestine or any accessory organ.",
        hints: ["The digestive tract only ever moves forward, one organ at a time."],
      },
      {
        id: "biology-digestive-system-challenge-002",
        title: "Digestion or Absorption?",
        scenario: "Stomach acid is breaking down a piece of food into smaller molecules.",
        objective: "Identify which process this describes.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Digestion" },
            { id: "b", label: "Absorption" },
            { id: "c", label: "Both equally" },
            { id: "d", label: "Neither" },
          ],
          correctOptionId: "a",
        },
        explanation: "Breaking food into smaller molecules is digestion. Absorption is the separate step of moving those molecules into the bloodstream.",
        hints: ["Absorption always involves the molecule leaving the digestive tract and entering the blood."],
      },
      {
        id: "biology-digestive-system-challenge-003",
        title: "Match the Organ to the Function",
        scenario: "You need to identify which accessory organ stores and releases bile — but does not produce it.",
        objective: "Identify this organ.",
        tools: [{ id: "accessory-organs", label: "Accessory Organs panel" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Gallbladder" },
            { id: "b", label: "Liver" },
            { id: "c", label: "Pancreas" },
            { id: "d", label: "Small intestine" },
          ],
          correctOptionId: "a",
        },
        explanation: "The liver produces bile; the gallbladder's job is to store it and release it when needed.",
        hints: ["Production and storage are two different organs' jobs here."],
      },
      {
        id: "biology-digestive-system-challenge-004",
        title: "Diagnose the Incorrect Pathway",
        scenario: "A student writes this pathway: Mouth → Esophagus → Stomach → Liver → Small Intestine → Large Intestine → Rectum → Anus.",
        objective: "Identify what's wrong with this pathway.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Food never passes through the liver — it's an accessory organ" },
            { id: "b", label: "The order of the stomach and esophagus is reversed" },
            { id: "c", label: "The large intestine should come before the small intestine" },
            { id: "d", label: "Nothing is wrong with this pathway" },
          ],
          correctOptionId: "a",
        },
        explanation: "The liver is an accessory organ. It delivers bile into the small intestine, but food itself never travels through it — the actual tract skips straight from the stomach to the small intestine.",
        hints: ["Which of these organs is an accessory organ rather than part of the tract?"],
      },
      {
        id: "biology-digestive-system-challenge-005",
        title: "Explain Why Villi Matter",
        scenario: "Two students argue about why villi are important for digestion.",
        objective: "Identify the best explanation.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "They increase the small intestine's surface area, allowing more nutrient absorption" },
            { id: "b", label: "They produce digestive enzymes" },
            { id: "c", label: "They mechanically grind food into smaller pieces" },
            { id: "d", label: "They store bile until it's needed" },
          ],
          correctOptionId: "a",
        },
        explanation: "Villi dramatically increase the surface area of the small intestine's inner wall, which is what allows so much nutrient absorption to happen there.",
        hints: ["Think about how much surface is exposed to nutrients at once."],
      },
      {
        id: "biology-digestive-system-challenge-006",
        title: "Identify the Process Location",
        scenario: "Most of the water remaining in digested material is absorbed in one particular organ.",
        objective: "Identify this organ.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Large intestine" },
            { id: "b", label: "Small intestine" },
            { id: "c", label: "Stomach" },
            { id: "d", label: "Esophagus" },
          ],
          correctOptionId: "a",
        },
        explanation: "The large intestine's main job is absorbing water from what's left after the small intestine has finished absorbing nutrients.",
        hints: ["This organ comes after the small intestine, near the end of the tract."],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "biology",
      topicSlug: "blood-circulation",
      label: "Blood Circulation: How the Heart Moves Blood",
      href: "/dashboard/biology/blood-circulation",
      reason: "See what carries absorbed nutrients from the small intestine out to the rest of the body.",
    },
  ],
};
