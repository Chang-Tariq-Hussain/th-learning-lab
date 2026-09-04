import type { TopicContent } from "../types";

/**
 * Bond Builder — Chemistry Batch 2's first GLE topic, brought up
 * from the earlier Learn + Explore + quiz-link pattern
 * (`SimulationLearnMore`) to the same full standard (Learn, Predict,
 * Explore, Explain, Practice, Challenge) as Molecule Builder
 * (`chemistry-molecular-geometry.tsx`) and the Physics/Mathematics
 * reference implementations. The simulation itself
 * (`@/features/subjects/chemistry/bond-builder`) was also extended
 * for this — it previously only ever showed Na+Cl (ionic) and H-H
 * (covalent); it now offers Mg+O (a second ionic pair, 2 transferred
 * electrons instead of 1) and O₂/N₂ (double- and triple-bond
 * covalent pairs, alongside H₂'s single bond) — so the content below
 * can properly cover bond order and multi-electron transfer using
 * the lab's real, selectable pairs, not just describe them in text.
 */
export const chemistryBondBuilderContent: TopicContent = {
  subjectSlug: "chemistry",
  topicSlug: "bond-builder",
  title: "Chemical Bonding",
  subjectLabel: "Chemistry",
  topicLabel: "Bond Builder",
  colorToken: "chemistry",
  simulationHref: "/dashboard/chemistry/bond-builder",

  learn: {
    objectives: [
      "Explain why atoms bond: to reach a stable, full outer (valence) shell of electrons.",
      "Distinguish ionic bonding (electron transfer) from covalent bonding (electron sharing).",
      "Count valence electrons and use them to predict whether two atoms will transfer or share.",
      "Describe what an ion is, and how its charge relates to how many electrons moved.",
      "Distinguish single, double, and triple covalent bonds by how many electron pairs are shared.",
    ],
    concepts: [
      {
        term: "Why atoms bond",
        explanation:
          "An atom with a full outer shell of electrons (8 for most atoms, 2 for hydrogen and helium) is in its most stable arrangement — the same reason the noble gases barely react with anything. Atoms that don't already have a full outer shell bond with other atoms — transferring or sharing electrons — as a way of reaching that stability.",
      },
      {
        term: "Valence electrons",
        explanation:
          "Only the electrons in an atom's outermost shell — its valence electrons — take part in bonding. Inner-shell electrons are shielded and stay out of it. How many valence electrons an atom has determines whether it tends to give electrons away (few valence electrons, like sodium's 1), take them (many, like chlorine's 7), or share (a middling number, like carbon's 4).",
      },
      {
        term: "Ionic bonding",
        explanation:
          "Happens when the difference in how strongly two atoms attract electrons is large enough that one atom simply gives an electron up completely, rather than sharing it. The donor becomes a positively charged ion (a cation); the atom that receives the electron becomes a negatively charged ion (an anion). Opposite charges then attract, holding the compound together — not a shared bond at all, but electrostatic attraction between two finished ions.",
      },
      {
        term: "Covalent bonding",
        explanation:
          "Happens between atoms that attract electrons similarly enough (typically two nonmetals) that neither one can pull an electron fully away from the other — so they share pairs of electrons instead. The shared pair sits between both nuclei and is attracted to both at once, which is what holds the atoms together.",
      },
      {
        term: "Bond order — single, double, triple",
        explanation:
          "Covalent atoms don't always share just one pair. A single bond shares 1 electron pair, a double bond shares 2, and a triple bond shares 3 — as many pairs as it takes, together with any leftover lone pairs, for both atoms to reach a full octet. More shared pairs pull the two atoms into a shorter, stronger bond.",
      },
    ],
    whyItMatters:
      "Nearly every material property you can name — melting point, solubility, electrical conductivity, even whether a substance is a gas, liquid, or solid at room temperature — traces back to whether ionic or covalent bonds (and which bond order) hold it together. Table salt dissolves in water and conducts electricity when it does because it's ionic; the nitrogen making up most of Earth's atmosphere is chemically unreactive largely because its N≡N triple bond is so strong it takes a huge amount of energy to break. Understanding bond formation is the foundation the rest of Chemistry Batch 2 — Lewis structures, molecular shape, and polarity — is built on.",
    keyTerms: [
      { term: "Valence electron", definition: "An electron in an atom's outermost shell — the only electrons that take part in bonding." },
      { term: "Octet rule", definition: "The tendency of atoms to bond in ways that leave each with 8 valence electrons (2 for hydrogen)." },
      { term: "Ion", definition: "An atom that has gained or lost electrons, giving it a net positive (cation) or negative (anion) charge." },
      { term: "Bond order", definition: "How many electron pairs are shared in a covalent bond — 1 (single), 2 (double), or 3 (triple)." },
      { term: "Lone pair", definition: "A pair of valence electrons that stays on one atom, unshared, but still counts toward that atom's octet." },
    ],
    misconceptions: [
      {
        id: "misconception-bonding-arbitrary",
        misconception: "Atoms just randomly stick together, or bond because of some attraction unrelated to electrons.",
        correction:
          "Bonding is entirely about electrons reaching a stable arrangement. Every bond in this lab — ionic or covalent — exists because it lets both atoms end up with (or share their way to) a full outer shell. Nothing about mass, size, or 'stickiness' decides it.",
      },
      {
        id: "misconception-double-bond-two-bonds",
        misconception: "A double bond is really just two separate single bonds between the same two atoms.",
        correction:
          "A double bond is one bond made of two shared electron pairs between the same two atoms — not two independent single bonds. That's why O₂'s double bond is shorter and stronger than a single O–O bond would be, not simply \"twice as much\" of the same thing.",
      },
      {
        id: "misconception-ionic-covalent-sharp-line",
        misconception: "Every bond is either purely ionic or purely covalent, with nothing in between.",
        correction:
          "This lab (and this level of chemistry) treats ionic and covalent as two clean categories — full transfer or equal sharing — which is the right simplification for learning the core idea. In reality bonding character is a spectrum based on how different the two atoms' electron-attracting strength is; Na+Cl (very different) and two identical O atoms (identical) sit at the two extremes this lab shows, with most real bonds falling somewhere between.",
      },
    ],
  },

  predict: {
    intro:
      "Commit to a prediction before bringing the atoms together in the lab below — then run it and check your answer.",
    scenarios: [
      {
        id: "chemistry-bond-builder-predict-001",
        scenario:
          "Sodium has 1 valence electron. Chlorine has 7 valence electrons and needs just 1 more to complete its octet.",
        question: "When sodium and chlorine bond, what happens to sodium's one valence electron?",
        options: [
          { id: "transfer", label: "It transfers completely to chlorine" },
          { id: "share", label: "It's shared equally between the two atoms" },
          { id: "stays", label: "It stays on sodium, unchanged" },
        ],
        actualResultOptionId: "transfer",
        explanation:
          "Sodium has almost nothing to lose by giving away its single valence electron, and chlorine is one electron short of a full octet. The electron transfers completely, leaving Na⁺ and Cl⁻ — an ionic bond, not a shared one.",
        hint: "Which atom has more to gain from ending the transaction with a full outer shell — the one giving up 1 electron, or the one that would need to gain 7?",
      },
      {
        id: "chemistry-bond-builder-predict-002",
        scenario:
          "Magnesium has 2 valence electrons. Oxygen has 6 valence electrons and needs 2 more to complete its octet.",
        question: "How many electrons transfer from magnesium to oxygen, and what charges result?",
        options: [
          { id: "one", label: "1 electron transfers; Mg⁺ and O⁻ form" },
          { id: "two", label: "2 electrons transfer; Mg²⁺ and O²⁻ form" },
          { id: "none", label: "No electrons transfer — they share instead" },
        ],
        actualResultOptionId: "two",
        explanation:
          "Magnesium has exactly 2 valence electrons to give away, and oxygen needs exactly 2 more to reach 8 — a perfect match. Both electrons transfer, leaving magnesium with a 2+ charge and oxygen with a 2− charge.",
        hint: "Magnesium and oxygen's electron counts line up differently than sodium and chlorine's did — how many electrons does magnesium actually have to offer?",
      },
      {
        id: "chemistry-bond-builder-predict-003",
        scenario:
          "Two hydrogen atoms, each with 1 valence electron, come together to form H₂.",
        question: "Since both atoms are identical, what happens to their electrons?",
        options: [
          { id: "transfer", label: "One hydrogen takes the other's electron, forming ions" },
          { id: "share", label: "Both electrons are shared equally between the two atoms" },
          { id: "nothing", label: "Nothing happens — identical atoms can't bond" },
        ],
        actualResultOptionId: "share",
        explanation:
          "Identical atoms attract electrons equally, so neither can pull an electron completely away from the other. Instead they share both electrons as one pair — a covalent bond — with neither atom becoming an ion.",
        hint: "Ionic bonding needs one atom to attract electrons much more strongly than the other. Is that true for two atoms of the exact same element?",
      },
      {
        id: "chemistry-bond-builder-predict-004",
        scenario:
          "Two oxygen atoms, each with 6 valence electrons needing 2 more, bond to form O₂. Two nitrogen atoms, each with 5 valence electrons needing 3 more, bond to form N₂.",
        question: "Which pair ends up sharing more electron pairs — and why?",
        options: [
          { id: "n2-more", label: "N₂ shares more pairs (3, a triple bond) because each nitrogen needs 3 more electrons" },
          { id: "o2-more", label: "O₂ shares more pairs, since oxygen has more valence electrons to start with" },
          { id: "equal", label: "They share the same number of pairs" },
        ],
        actualResultOptionId: "n2-more",
        explanation:
          "How many pairs get shared depends on how many more electrons each atom needs, not how many it starts with. Oxygen needs 2 more (a double bond), nitrogen needs 3 more (a triple bond) — nitrogen's bigger shortfall means more shared pairs, even though it starts with fewer valence electrons than oxygen.",
        hint: "It's not about how many valence electrons each atom starts with — it's about how many more each one needs to reach 8.",
      },
    ],
  },

  explore: {
    howToUse: [
      "Choose Ionic or Covalent mode from the top tabs.",
      "Pick an atom pair — Na+Cl or Mg+O for ionic; H₂, O₂, or N₂ for covalent.",
      "Click \"Bring Atoms Together\" and watch what happens to the electrons.",
      "Read the status line and the explanation panel once the bond forms.",
      "Reset and try a different pair — compare how many electrons move for Na+Cl vs Mg+O, or how many pairs are shared for H₂ vs O₂ vs N₂.",
    ],
    tryThis: [
      "Run Na+Cl, then Mg+O. Count how many electron dots actually travel across the gap in each case.",
      "Run H₂, then O₂, then N₂ in covalent mode. Watch how many electron pairs sit between the two atoms — and how many extra dots (lone pairs) stay attached to each atom's own ring for O₂ and N₂ but not H₂.",
      "Before clicking \"Bring Atoms Together,\" predict from the explanation panel's valence-electron counts whether the pair you picked will transfer or share.",
    ],
  },

  explain: {
    questions: [
      {
        id: "chemistry-bond-builder-explain-001",
        question: "Why does chlorine gain exactly 1 electron from sodium — not 2, not 0?",
        answer:
          "Chlorine already has 7 of the 8 valence electrons it needs for a full octet. Gaining exactly 1 more completes it. Gaining 0 would leave it short, and there's no reason for a second electron to transfer once the octet is already full — sodium only has 1 to give in the first place.",
      },
      {
        id: "chemistry-bond-builder-explain-002",
        question: "Why does magnesium form a 2+ ion instead of a 1+ ion like sodium?",
        answer:
          "Magnesium has 2 valence electrons, not 1. It reaches a full outer shell by losing both of them (the shell underneath is already full), which leaves it with 2 more protons than electrons — a 2+ charge, twice sodium's.",
      },
      {
        id: "chemistry-bond-builder-explain-003",
        question: "Why do O₂ and N₂ form double and triple bonds instead of single bonds like H₂?",
        answer:
          "Bond order is set by how many more electrons each atom needs to complete its octet. Hydrogen needs just 1 more (a single bond gets it there). Oxygen needs 2 more (a double bond). Nitrogen needs 3 more (a triple bond). Each atom shares exactly as many pairs as it takes to fill its own outer shell.",
      },
      {
        id: "chemistry-bond-builder-explain-004",
        question: "Why don't two oxygen atoms just transfer electrons the way sodium and chlorine do?",
        answer:
          "Ionic bonding needs a large difference in how strongly the two atoms attract electrons, so one can win a complete transfer. Two identical oxygen atoms attract electrons exactly equally — neither can out-pull the other — so they share pairs instead of one giving up electrons entirely.",
      },
      {
        id: "chemistry-bond-builder-explain-005",
        question: "Both O₂'s double bond and N₂'s triple bond leave some lone pairs. Why aren't all of oxygen's or nitrogen's valence electrons used in the shared bond?",
        answer:
          "Only enough electrons to reach a full octet need to be shared. Oxygen shares 2 of its 6 valence electrons (leaving 4, two lone pairs); nitrogen shares 3 of its 5 (leaving 2, one lone pair). The leftover lone-pair electrons already count toward that atom's own octet without needing to be shared at all.",
      },
    ],
  },

  practice: {
    quizId: "chemistry-chemical-bonding",
  },

  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice. Use the live lab below to check your reasoning before answering.",
    scenarios: [
      {
        id: "chemistry-bond-builder-challenge-001",
        title: "Predict the Pair",
        scenario:
          "Bond Builder has four atoms available across its pairs: sodium (1 valence electron), magnesium (2), oxygen (6), and chlorine (7).",
        objective: "Determine which two of these four would bond ionically with the smallest possible electron transfer — just 1 electron.",
        constraints: [
          { id: "c1", label: "The pair must actually appear in the lab's ionic mode." },
        ],
        tools: [
          { id: "mode-tabs", label: "Ionic mode — switch between the Na+Cl and Mg+O pairs" },
          { id: "explanation-panel", label: "Explanation panel — shows each pair's valence electron counts" },
        ],
        answer: {
          mode: "choice",
          options: [
            { id: "na-cl", label: "Sodium and Chlorine" },
            { id: "mg-o", label: "Magnesium and Oxygen" },
          ],
          correctOptionId: "na-cl",
        },
        explanation:
          "Sodium has just 1 valence electron to give, and chlorine needs just 1 more — a 1-electron transfer, the smallest possible. Magnesium and oxygen need 2 electrons to move, since magnesium has 2 to give and oxygen needs 2 more.",
        hints: [
          "Run both ionic pairs in the lab and count how many electron dots actually cross the gap in each.",
          "Sodium and magnesium have different numbers of valence electrons to offer — which one has fewer?",
        ],
      },
      {
        id: "chemistry-bond-builder-challenge-002",
        title: "Rank the Bond Orders",
        scenario:
          "The lab's three covalent pairs — H₂, O₂, and N₂ — form single, double, and triple bonds respectively.",
        objective: "Match each pair to its bond order, then determine which bond is generally the strongest.",
        constraints: [
          { id: "c1", label: "Base your ranking on how many electron pairs each pair actually shares, not on the element names alone." },
        ],
        tools: [
          { id: "mode-tabs", label: "Covalent mode — switch between the H₂, O₂, and N₂ pairs" },
        ],
        answer: {
          mode: "choice",
          options: [
            { id: "n2-strongest", label: "N₂ (triple bond) is the strongest of the three" },
            { id: "h2-strongest", label: "H₂ (single bond) is the strongest of the three" },
            { id: "equal", label: "All three bonds are equally strong" },
          ],
          correctOptionId: "n2-strongest",
        },
        explanation:
          "More shared electron pairs pull two atoms closer and hold them more tightly. N₂'s triple bond (3 shared pairs) is stronger than O₂'s double bond (2 pairs), which is stronger than H₂'s single bond (1 pair) — this is exactly why nitrogen gas is so chemically unreactive.",
        hints: [
          "Run each pair and count the shared electron pairs sitting between the two atoms.",
          "More shared pairs between the same two atoms generally means a shorter, stronger bond.",
        ],
        maxAttempts: 4,
      },
      {
        id: "chemistry-bond-builder-challenge-003",
        title: "Real-World Mission: Why Nitrogen Gas Barely Reacts",
        scenario:
          "About 78% of Earth's atmosphere is N₂, yet it takes enormous energy (lightning, or industrial processes) to get nitrogen to react and form other compounds — unlike, say, oxygen, which reacts readily with almost everything.",
        objective: "Use what the lab shows about N₂'s bond to explain why nitrogen gas is so unreactive compared to other diatomic gases.",
        constraints: [
          { id: "c1", label: "Reason from the actual bond order shown in the lab, not just \"nitrogen is special.\"" },
        ],
        tools: [
          { id: "mode-tabs", label: "Covalent mode — set to N₂, then compare against O₂" },
        ],
        answer: {
          mode: "choice",
          options: [
            { id: "triple-strong", label: "N₂'s triple bond shares 3 electron pairs, making it unusually strong and hard to break apart" },
            { id: "nitrogen-inert-element", label: "Nitrogen atoms are simply an inert element that can't form bonds at all" },
          ],
          correctOptionId: "triple-strong",
        },
        explanation:
          "N₂'s triple bond — 3 shared electron pairs — is one of the strongest bonds in chemistry. Breaking it apart to let nitrogen react with something else takes far more energy than breaking O₂'s double bond or H₂'s single bond, which is exactly why nitrogen gas sits mostly unreacted in the atmosphere while oxygen reacts constantly (rust, combustion, respiration).",
        hints: [
          "Compare N₂'s bond order to O₂'s and H₂'s in the lab — which one shares the most electron pairs?",
          "More shared pairs make a bond stronger and harder to break — what would that mean for how easily the molecule reacts?",
        ],
        maxAttempts: 4,
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "chemistry",
      topicSlug: "molecule-builder",
      label: "Molecule Builder",
      href: "/dashboard/chemistry/molecule-builder",
      reason: "Once you know how and why bonds form, see how multiple bonds around a central atom arrange themselves into a real 3D molecular shape.",
    },
  ],
};
