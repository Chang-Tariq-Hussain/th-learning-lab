import type { TopicContent } from "../types";

/**
 * Lewis Acid–Base Theory — Chemistry Batch 5, fourth topic (Acids &
 * Bases GLE Part 2). Brought up from the earlier `SimulationLearnMore`
 * pattern to the full standard, same as the three Part 1 topics.
 *
 * The existing simulation (`@/features/subjects/chemistry/lewis-acid-base`)
 * already covered the whole spec — a reaction picker (NH₃ + BF₃ /
 * H⁺ + NH₃), a shared 5-step "before → highlight lone pair → transfer
 * → bond forms → explain" electron-transfer sequence with
 * Start/Pause/Next Step/Reset controls, a small in-sim "Which is the
 * Lewis acid/base?" practice, and a compact Arrhenius/Brønsted–Lowry/
 * Lewis comparison table — so nothing there needed rebuilding.
 * Predict and Explain both refer directly to the actual step sequence
 * and the two reactions (one with no proton involved at all) rather
 * than inventing new chemistry.
 */
export const chemistryLewisAcidBaseContent: TopicContent = {
  subjectSlug: "chemistry",
  topicSlug: "lewis-acid-base",
  title: "Lewis Acid–Base Theory",
  subjectLabel: "Chemistry",
  topicLabel: "Acids & Bases",
  colorToken: "chemistry",
  simulationHref: "/dashboard/chemistry/lewis-acid-base",

  learn: {
    objectives: [
      "Define a Lewis acid as an electron-pair acceptor and a Lewis base as an electron-pair donor.",
      "Track where an electron pair moves during a Lewis acid-base reaction.",
      "Explain how a coordinate covalent bond forms from that electron-pair transfer.",
      "Explain how the Lewis definition is broader than the Brønsted–Lowry definition.",
    ],
    concepts: [
      {
        term: "Lewis acid = electron-pair acceptor",
        explanation:
          "A species that accepts a pair of electrons to form a new bond. It doesn't need to contain hydrogen at all — what matters is that it has room to accept an electron pair, often because it's missing a full outer shell (like BF₃) or has no electrons of its own to offer (like H⁺).",
      },
      {
        term: "Lewis base = electron-pair donor",
        explanation:
          "A species that donates a pair of electrons to form a new bond. It needs a lone pair available to share — NH₃'s lone pair on nitrogen is the one this simulation's reactions both use.",
      },
      {
        term: "Coordinate covalent bond",
        explanation:
          "A covalent bond where both shared electrons come from the same atom — the Lewis base supplies the whole pair, and the Lewis acid supplies an empty spot to receive it. Once formed, it behaves exactly like any other covalent bond.",
        formula: "A + :B \\rightarrow A{-}B",
        formulaCaption: "Lewis acid A accepts a lone pair from base B",
      },
      {
        term: "Lewis vs. Brønsted–Lowry",
        explanation:
          "Every Brønsted–Lowry acid-base reaction is also a Lewis acid-base reaction — donating a proton and accepting an electron pair happen to the same H⁺ at once. But the Lewis definition goes further: it also describes reactions like NH₃ + BF₃, where no proton moves at all, as long as an electron pair is being shared.",
      },
    ],
    whyItMatters:
      "The Lewis definition is what lets chemists explain reactions that don't fit neatly into the proton-transfer picture, like how metal ions bond with surrounding molecules to form complexes, or how catalysts work in many industrial reactions. It's the broadest of the acid-base theories, and it's the one that connects most directly to bonding and molecular structure.",
    keyTerms: [
      { term: "Electron pair", definition: "Two electrons shared or transferred together — the unit a Lewis acid accepts and a Lewis base donates." },
      { term: "Lone pair", definition: "A pair of electrons on an atom not already used in a bond — what a Lewis base offers up." },
      { term: "Coordinate (dative) bond", definition: "A covalent bond where both electrons originated from the same atom, the Lewis base." },
      { term: "Electron-deficient", definition: "Having fewer than a full outer shell of electrons, and so room to accept a donated pair — true of BF₃'s boron atom." },
    ],
    misconceptions: [
      {
        id: "misconception-lewis-acid-needs-hydrogen",
        misconception: "A Lewis acid must contain hydrogen, the same way a Brønsted–Lowry acid does.",
        correction:
          "A Lewis acid only needs room to accept an electron pair — BF₃ has no hydrogen at all and is still a Lewis acid, because boron's outer shell has an open spot for NH₃'s lone pair.",
      },
      {
        id: "misconception-coordinate-bond-is-weaker",
        misconception: "A coordinate covalent bond is a weaker or different kind of bond than an ordinary covalent bond.",
        correction:
          "Once formed, a coordinate bond is identical to any other covalent bond — the only thing distinguishing it is where the two shared electrons came from (both from the base) rather than one from each atom.",
      },
      {
        id: "misconception-lewis-replaces-bronsted-lowry",
        misconception: "Lewis theory replaces Brønsted–Lowry theory because Brønsted–Lowry theory was incomplete or wrong.",
        correction:
          "Every Brønsted–Lowry acid-base reaction is still a valid Lewis acid-base reaction — Lewis theory simply extends the idea further, to reactions like NH₃ + BF₃ where no proton is involved at all.",
      },
    ],
  },

  predict: {
    intro: "Commit to a prediction before running the reaction below — then step through it and check your answer.",
    scenarios: [
      {
        id: "chemistry-lewis-acid-base-predict-001",
        scenario: "You select the NH₃ + BF₃ reaction and are about to press Start.",
        question: "Which species will end up donating the electron pair?",
        options: [
          { id: "nh3-donates", label: "NH₃ — it carries the lone pair that gets shared" },
          { id: "bf3-donates", label: "BF₃ — it always donates in Lewis reactions" },
          { id: "neither", label: "Neither — nothing moves between them" },
        ],
        actualResultOptionId: "nh3-donates",
        explanation:
          "NH₃'s lone pair on nitrogen is highlighted first, then moves across to boron. NH₃ donates the electron pair (the Lewis base) and BF₃ accepts it (the Lewis acid), forming a new coordinate bond.",
        hint: "Look at which molecule has a lone pair of electrons available to share.",
      },
      {
        id: "chemistry-lewis-acid-base-predict-002",
        scenario: "You switch the reaction picker to H⁺ + NH₃ instead of NH₃ + BF₃.",
        question: "In this second reaction, does NH₃ still play the same role as before?",
        options: [
          { id: "nh3-still-base", label: "Yes — NH₃ still donates its lone pair; H⁺ accepts it this time" },
          { id: "nh3-now-acid", label: "No — NH₃ becomes the Lewis acid in this reaction" },
          { id: "roles-random", label: "Roles are assigned differently each time, unrelated to lone pairs" },
        ],
        actualResultOptionId: "nh3-still-base",
        explanation:
          "NH₃ still has a lone pair available, so it donates again and remains the Lewis base — the same role it played against BF₃. This time H⁺, which has no electrons of its own, accepts the pair and becomes NH₄⁺.",
        hint: "Does NH₃'s lone pair disappear just because the other reactant changed?",
      },
      {
        id: "chemistry-lewis-acid-base-predict-003",
        scenario: "You finish stepping through the H⁺ + NH₃ sequence to the final \"explain\" step.",
        question: "How will the final step describe H⁺ and NH₃'s roles?",
        options: [
          { id: "h-acid-nh3-base", label: "H⁺ acted as the Lewis acid; NH₃ acted as the Lewis base" },
          { id: "both-acids", label: "Both acted as Lewis acids, since H⁺ is positively charged" },
          { id: "no-lewis-acid", label: "There's no Lewis acid here since no full molecule is accepting anything" },
        ],
        actualResultOptionId: "h-acid-nh3-base",
        explanation:
          "NH₃ donated the electron pair, so it acted as the Lewis base. H⁺ accepted it, so it acted as the Lewis acid — the same donor/acceptor pattern the NH₃ + BF₃ reaction demonstrated, just with H⁺ playing the acceptor role instead of BF₃.",
        hint: "Whichever species supplies the electron pair is the base; whichever receives it is the acid.",
      },
    ],
  },

  explore: {
    howToUse: [
      "Pick a reaction from the reaction picker: NH₃ + BF₃, or H⁺ + NH₃.",
      "Press Start and watch the electron-transfer scene step through automatically, or use Next Step to advance one step at a time.",
      "Read the explanation panel at each step — it names what's happening and why.",
      "Once finished, check which species donated the electron pair (the Lewis base) and which accepted it (the Lewis acid).",
      "Switch to the other reaction and repeat — notice NH₃ keeps the same role in both.",
      "Try the in-sim \"Which is the Lewis acid/base?\" practice once you've stepped through both reactions.",
      "Open the theory comparison table and compare how Arrhenius, Brønsted–Lowry, and Lewis theory each define acid and base.",
    ],
    tryThis: [
      "Before pressing Start on each reaction, predict which species has the lone pair and which has the open spot to accept it.",
      "Compare the H⁺ + NH₃ reaction here to the same reaction in the Brønsted–Lowry simulation — is it classified as an acid-base reaction under both theories?",
      "Using the theory comparison table, explain why NH₃ + BF₃ can only be classified by Lewis theory, not by Arrhenius or Brønsted–Lowry theory.",
    ],
  },

  explain: {
    questions: [
      {
        id: "chemistry-lewis-acid-base-explain-001",
        question: "Why is BF₃ able to accept an electron pair even though it contains no hydrogen?",
        answer:
          "Boron in BF₃ has only six electrons in its outer shell, one short of the usual eight — that open spot is exactly what NH₃'s lone pair can fill. Being a Lewis acid only requires room to accept an electron pair, not a hydrogen atom to donate.",
      },
      {
        id: "chemistry-lewis-acid-base-explain-002",
        question: "Why does the new bond in NH₃ + BF₃ count as a coordinate covalent bond specifically?",
        answer:
          "Both electrons in the new N–B bond came from the same atom — nitrogen's lone pair. In an ordinary covalent bond each atom contributes one electron; here nitrogen contributes both, and boron contributes the empty space to receive them.",
      },
      {
        id: "chemistry-lewis-acid-base-explain-003",
        question: "Is the H⁺ + NH₃ reaction classified as an acid-base reaction under Brønsted–Lowry theory too, or only under Lewis theory?",
        answer:
          "Both. NH₃ donates a proton-accepting site while H⁺ is literally the proton being accepted, so Brønsted–Lowry theory classifies this as a proton transfer. Lewis theory describes the exact same event as an electron-pair transfer — the two views agree here because this particular reaction genuinely involves proton motion.",
      },
      {
        id: "chemistry-lewis-acid-base-explain-004",
        question: "Why can't Arrhenius or Brønsted–Lowry theory classify the NH₃ + BF₃ reaction the way Lewis theory can?",
        answer:
          "Arrhenius theory needs water and H⁺/OH⁻ production, and Brønsted–Lowry theory needs a proton to move — neither happens here. Lewis theory only requires an electron pair being shared, which is exactly what NH₃ + BF₃ does, making it the one definition broad enough to cover this reaction.",
      },
    ],
  },

  practice: {
    quizId: "chemistry-lewis-acid-base",
  },

  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice. Use the live simulation below — step through each reaction — to check your reasoning before answering.",
    scenarios: [
      {
        id: "chemistry-lewis-acid-base-challenge-001",
        title: "Metal Ion Complex",
        scenario:
          "A copper(II) ion, Cu²⁺, is dissolved in water and immediately becomes surrounded by water molecules, each bonding to the copper through one of oxygen's lone pairs: Cu²⁺ + 6 H₂O → [Cu(H₂O)₆]²⁺.",
        objective: "Determine which species acts as the Lewis acid and which acts as the Lewis base in this reaction.",
        constraints: [
          { id: "c1", label: "Base your answer only on which species donates the electron pair and which accepts it." },
        ],
        tools: [
          { id: "step-sequence", label: "Step through NH₃ + BF₃ and H⁺ + NH₃ in the simulation as reference examples" },
        ],
        answer: {
          mode: "choice",
          options: [
            { id: "cu-acid-water-base", label: "Cu²⁺ is the Lewis acid (accepts electron pairs); H₂O is the Lewis base (donates a lone pair from oxygen)" },
            { id: "cu-base-water-acid", label: "Cu²⁺ is the Lewis base; H₂O is the Lewis acid" },
            { id: "neither-lewis", label: "This isn't a Lewis acid-base reaction since no bond actually forms" },
          ],
          correctOptionId: "cu-acid-water-base",
        },
        explanation:
          "Cu²⁺ has empty orbitals with room to accept electron pairs, just like BF₃ or H⁺ in the simulation. Water's oxygen has lone pairs available to donate, just like nitrogen in NH₃. The metal ion accepts six donated lone pairs total, making it the Lewis acid while water acts as the Lewis base.",
        hints: [
          "Which species in the simulation's reactions has an open spot to accept electrons, and which has a lone pair to give?",
          "Water's oxygen atom has lone pairs, the same way nitrogen does in NH₃ — which role does that suggest for H₂O here?",
        ],
        maxAttempts: 3,
      },
      {
        id: "chemistry-lewis-acid-base-challenge-002",
        title: "Where Only Lewis Theory Applies",
        scenario:
          "A chemist wants to classify the NH₃ + BF₃ reaction using each of the three acid-base theories covered so far: Arrhenius, Brønsted–Lowry, and Lewis.",
        objective: "Determine which of the three theories can actually classify this specific reaction.",
        constraints: [
          { id: "c1", label: "Your answer must address why the other two theories can't, not just state the Lewis classification alone." },
        ],
        tools: [
          { id: "theory-comparison", label: "Theory comparison table in the simulation — compares all three definitions side by side" },
        ],
        answer: {
          mode: "choice",
          options: [
            { id: "only-lewis", label: "Only Lewis theory — there's no water and no proton moving, which the other two theories require" },
            { id: "all-three", label: "All three theories classify it identically" },
            { id: "only-arrhenius", label: "Only Arrhenius theory, since BF₃ contains boron" },
          ],
          correctOptionId: "only-lewis",
        },
        explanation:
          "Arrhenius theory requires water and H⁺/OH⁻ production — absent here. Brønsted–Lowry theory requires a proton to transfer — no proton moves in NH₃ + BF₃ at all. Lewis theory only requires an electron pair being shared, which this reaction does, making it the only one of the three that applies.",
        hints: [
          "Does this reaction involve water? Does it involve a proton moving from one species to another?",
          "Re-check the theory comparison table's requirements for each theory before answering.",
        ],
        maxAttempts: 3,
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
      reason: "Compare proton transfer to electron-pair transfer — see where the two definitions agree and where Lewis theory goes further.",
    },
    {
      subjectSlug: "chemistry",
      topicSlug: "bond-builder",
      label: "Bond Builder",
      href: "/dashboard/chemistry/bond-builder",
      reason: "Revisit ordinary covalent and ionic bonds to compare against the coordinate covalent bond formed here.",
    },
  ],
};
