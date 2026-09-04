import type { TopicContent } from "../types";

/**
 * Molecular Geometry — Chemistry Batch 2's second GLE topic. Its
 * Explore experience is the 3D `Molecule Builder` lab
 * (`@/features/subjects/chemistry/molecule-builder`): a real VSEPR
 * viewer (react-three-fiber) covering all four core geometries —
 * linear (H₂, CO₂), bent (H₂O), trigonal planar (BF₃), and
 * tetrahedral (CH₄) — with rotate/zoom/select-atom interaction and an
 * always-visible geometry panel (name, bond angle, and the electron-
 * group reasoning) below the canvas. All content below is grounded in
 * that lab's real molecule set, geometry names, and bond angles — no
 * molecule or angle mentioned here is outside what's actually
 * selectable in the simulation.
 */
export const chemistryMolecularGeometryContent: TopicContent = {
  subjectSlug: "chemistry",
  topicSlug: "molecule-builder",
  title: "Molecular Geometry",
  subjectLabel: "Chemistry",
  topicLabel: "Molecule Builder",
  colorToken: "chemistry",
  simulationHref: "/dashboard/chemistry/molecule-builder",

  learn: {
    objectives: [
      "Describe a covalent bond as a shared pair of electrons between two atoms.",
      "Explain VSEPR theory: electron groups around a central atom repel each other and spread apart to minimize that repulsion.",
      "Predict a molecule's shape from its number of bonding and lone electron pairs.",
      "Recognize and name linear, bent, trigonal planar, and tetrahedral geometries, with their approximate bond angles.",
      "Explain why lone pairs compress bond angles compared to a molecule with none.",
    ],
    concepts: [
      {
        term: "VSEPR theory",
        explanation:
          "Valence Shell Electron Pair Repulsion: the electron groups (bonds and lone pairs) around a central atom repel each other and spread out as far apart as possible. That spacing is what determines a molecule's 3D shape — nothing more mysterious than electrons avoiding each other.",
      },
      {
        term: "Counting electron groups",
        explanation:
          "Each bonded neighbor counts as one electron group, no matter whether it's a single, double, or triple bond — a double bond is still one region of electron density pointing toward one neighbor. Lone pairs on the central atom count as electron groups too, even though they don't point toward another atom.",
      },
      {
        term: "Electron-group geometry vs. molecular geometry",
        explanation:
          "Electron-group geometry describes how all the electron groups (bonds and lone pairs) are arranged. Molecular geometry only names the positions of the atoms — so water's electron groups are tetrahedral, but its molecular geometry is called 'bent' because two of those four groups are invisible lone pairs.",
      },
      {
        term: "Bond angle",
        explanation:
          "The angle between two bonds at a central atom, set almost entirely by the number of electron groups: 180° for two groups, 120° for three, and 109.5° for four — nudged smaller wherever a lone pair is doing some of the pushing.",
        formula: "\\text{H-O-H} \\approx 104.5^\\circ",
        formulaCaption:
          "Water's bond angle, compressed from the ideal 109.5° by its two lone pairs",
      },
    ],
    whyItMatters:
      "A molecule's shape isn't decoration — it's function. Water's bent shape is why it's a polar solvent that dissolves salts and sugars, and why ice floats instead of sinking. A protein folding into the wrong shape is the difference between it working and causing disease. VSEPR is the simple rule — electron groups repel, so they spread out — that explains an enormous range of chemistry, from why oil and water don't mix to how an enzyme recognizes exactly one molecule out of thousands.",
    keyTerms: [
      { term: "VSEPR", definition: "Valence Shell Electron Pair Repulsion — the theory that electron groups around a central atom arrange themselves to minimize repulsion." },
      { term: "Electron group", definition: "A region of electron density around a central atom: either a bond (single, double, or triple, counted once) or a lone pair." },
      { term: "Lone pair", definition: "A pair of valence electrons on an atom that isn't shared in a bond, but still occupies space and repels other electron groups." },
      { term: "Molecular geometry", definition: "The 3D arrangement of a molecule's atoms, named by shape (linear, bent, trigonal planar, tetrahedral, etc.) — describes atom positions, not lone pairs." },
      { term: "Bond angle", definition: "The angle formed between two bonds sharing a central atom." },
    ],
    misconceptions: [
      {
        id: "misconception-lone-pairs-dont-matter",
        misconception: "Lone pairs don't affect a molecule's shape, since they're not part of any bond.",
        correction:
          "Lone pairs are invisible to the shape's name, but not to the shape itself. They still occupy space around the central atom and push bonding pairs together — that's exactly why water is bent rather than linear, and why its bond angle (104.5°) is smaller than methane's (109.5°), which has no lone pairs on carbon.",
      },
      {
        id: "misconception-double-bond-two-groups",
        misconception: "A double bond counts as two separate electron groups for VSEPR purposes.",
        correction:
          "VSEPR counts each bonded neighbor as one electron group regardless of bond order — a double bond is still one region of electron density pointing at one atom. That's why CO₂'s carbon, with two double bonds, has just 2 electron groups and is linear, not something more crowded.",
      },
      {
        id: "misconception-flat-drawing-is-accurate",
        misconception: "A molecule's structural formula, drawn flat on paper, shows its real shape.",
        correction:
          "A flat skeletal formula is a convenient shorthand, not a geometry. Methane's four bonds genuinely point toward the corners of a tetrahedron — 109.5° apart in three dimensions — which simply cannot be drawn honestly as a flat cross implying 90° angles. That's why rotating the real 3D model matters.",
      },
    ],
  },

  predict: {
    intro:
      "Commit to a prediction before rotating the model below — then select the matching molecule in the lab and check your answer.",
    scenarios: [
      {
        id: "chemistry-molecular-geometry-predict-001",
        scenario:
          "You compare carbon dioxide (CO₂, carbon has 2 electron groups) and boron trifluoride (BF₃, boron has 3 electron groups). Neither central atom has any lone pairs.",
        question: "Which molecule has the larger bond angle?",
        options: [
          { id: "co2", label: "CO₂ — fewer electron groups means less crowding, so they spread wider" },
          { id: "bf3", label: "BF₃ — more electron groups always means a wider angle" },
          { id: "equal", label: "They're equal, since neither has lone pairs" },
        ],
        actualResultOptionId: "co2",
        explanation:
          "With only 2 electron groups, CO₂'s carbon spreads them to exactly opposite sides — 180°. BF₃'s boron has 3 groups to fit around itself, so they settle at 120° apart instead — smaller, not larger, because there's more crowding to share the same space around the atom.",
        hint: "More electron groups around the same atom means each one has less room — does that make the angle between any two of them bigger or smaller?",
      },
      {
        id: "chemistry-molecular-geometry-predict-002",
        scenario:
          "Oxygen in water (H₂O) has 2 bonding pairs (to each hydrogen) and 2 lone pairs — 4 electron groups total, arranged tetrahedrally.",
        question: "What shape does the water molecule itself — just the three atoms — actually take?",
        options: [
          { id: "linear", label: "Linear — the two O–H bonds point in opposite directions" },
          { id: "tetrahedral", label: "Tetrahedral — the molecule matches all four electron groups" },
          { id: "bent", label: "Bent — only the two O–H bonds are visible in the molecule's shape" },
        ],
        actualResultOptionId: "bent",
        explanation:
          "All four electron groups (2 bonds + 2 lone pairs) arrange tetrahedrally around oxygen, but molecular geometry only names where the atoms are — and only two of those four groups are atoms. With two bonding positions left after the lone pairs claim their space, the molecule reads as bent, at about 104.5°.",
        hint: "Molecular geometry names atom positions, not electron-group positions — how many of oxygen's four electron groups actually connect to another atom?",
      },
      {
        id: "chemistry-molecular-geometry-predict-003",
        scenario:
          "Carbon in methane (CH₄) has 4 bonding pairs and 0 lone pairs, arranged tetrahedrally.",
        question: "Compared to BF₃'s 120° bond angle, is methane's bond angle larger or smaller?",
        options: [
          { id: "larger", label: "Larger — 4 bonds push each other apart more than 3 do" },
          { id: "smaller", label: "Smaller — fitting one more electron group in means less room per angle" },
          { id: "same", label: "The same — neither molecule has lone pairs, so the angle should match" },
        ],
        actualResultOptionId: "smaller",
        explanation:
          "Methane's bond angle is 109.5°, smaller than BF₃'s 120°. Going from 3 to 4 electron groups around the same central atom means each group has less room, the same pattern as comparing CO₂ (2 groups, 180°) to BF₃ (3 groups, 120°) — more groups around one atom always means a tighter angle between any two of them.",
        hint: "This is the same pattern as comparing CO₂ to BF₃, just one step further — more electron groups around one atom means what for the angle between them?",
      },
    ],
  },

  explore: {
    howToUse: [
      "Choose a molecule — H₂, H₂O, CO₂, BF₃, or CH₄ — from the selector.",
      "Drag to rotate the 3D model and scroll or pinch to zoom.",
      "Tap any atom to see its element, how many appear in the molecule, and whether it's the central atom.",
      "Read the geometry panel below the model for the shape's name, its bond angle, and why it forms.",
      "Compare BF₃ (flat, no lone pairs) against H₂O (bent, two lone pairs) to see what a lone pair does to a shape.",
    ],
    tryThis: [
      "Rotate CH₄ until you can see all four hydrogens spread evenly around the carbon. Could you draw that honestly on flat paper?",
      "Compare CO₂'s bond angle to BF₃'s. Both have no lone pairs — why is one 180° and the other 120°?",
      "Before checking the geometry panel, predict H₂O's shape from its electron groups, then rotate the model to check yourself.",
    ],
  },

  explain: {
    questions: [
      {
        id: "chemistry-molecular-geometry-explain-001",
        question: "Why does the number of electron groups alone predict a molecule's bond angle so reliably?",
        answer:
          "Every electron group around a central atom carries roughly the same amount of negative charge, so they repel each other with roughly the same force. The only thing that changes from molecule to molecule is how many groups have to share the space around that one atom — 2, 3, or 4 — and geometry alone (not the specific elements involved) determines the least-repulsive way to arrange that many points around a sphere.",
      },
      {
        id: "chemistry-molecular-geometry-explain-002",
        question: "Why does a lone pair compress bond angles more than a bonding pair would in the same position?",
        answer:
          "A bonding pair is stretched between two nuclei, which pulls its electron density away from the central atom somewhat. A lone pair belongs to just one nucleus, so it stays closer and 'fatter,' taking up more angular space and pushing harder on its neighbors — which is why each lone pair squeezes the remaining bond angles down further than an ordinary bond would.",
      },
      {
        id: "chemistry-molecular-geometry-explain-003",
        question: "Why does VSEPR count a double bond as one electron group instead of two?",
        answer:
          "VSEPR is about electron density pointing in a direction, not about counting individual electron pairs. A single and a double bond to the same neighboring atom both point in exactly the same direction — toward that neighbor — so they occupy the same angular position around the central atom and are treated as one group, not two.",
      },
      {
        id: "chemistry-molecular-geometry-explain-004",
        question: "Why can't a tetrahedral molecule like methane be drawn accurately as a flat plus-sign?",
        answer:
          "A flat cross places four bonds 90° apart in a single plane. Methane's actual bonds are 109.5° apart and point toward the four corners of a tetrahedron — a shape that only exists once you allow a third dimension. Any flat drawing of it is a stylized shorthand, not a literal picture of the geometry.",
      },
    ],
  },

  practice: {
    quizId: "chemistry-molecular-geometry",
  },

  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice. Rotate the live 3D model to check your reasoning before answering.",
    scenarios: [
      {
        id: "chemistry-molecular-geometry-challenge-001",
        title: "Angle Ranking",
        scenario:
          "Three molecules are loaded into the lab: CO₂ (2 electron groups), BF₃ (3 electron groups), and CH₄ (4 electron groups) — none of their central atoms have lone pairs.",
        objective: "Determine which of the three has the smallest bond angle.",
        constraints: [
          { id: "c1", label: "None of the three central atoms has a lone pair — this is purely about electron-group count." },
        ],
        tools: [
          { id: "molecule-selector", label: "Molecule selector — switch between CO₂, BF₃, and CH₄" },
          { id: "geometry-panel", label: "Geometry panel — shows each molecule's bond angle" },
        ],
        answer: {
          mode: "choice",
          options: [
            { id: "co2", label: "CO₂" },
            { id: "bf3", label: "BF₃" },
            { id: "ch4", label: "CH₄" },
          ],
          correctOptionId: "ch4",
        },
        explanation:
          "More electron groups around the same central atom means less room per angle: CO₂'s 2 groups spread to 180°, BF₃'s 3 groups settle at 120°, and CH₄'s 4 groups are the most crowded at 109.5° — the smallest of the three.",
        hints: [
          "None of these three has a lone pair — the only variable is how many electron groups each central atom has.",
          "More electron groups sharing the same space around one atom means each pair of them has less room.",
          "Rank them by electron-group count: CO₂ has 2, BF₃ has 3, CH₄ has 4.",
        ],
      },
      {
        id: "chemistry-molecular-geometry-challenge-002",
        title: "Predict the Lone-Pair Effect",
        scenario:
          "Water's oxygen has 4 electron groups (2 bonds, 2 lone pairs) and a 104.5° bond angle. Methane's carbon also has 4 electron groups (4 bonds, 0 lone pairs) and a 109.5° bond angle.",
        objective:
          "Determine which factor — the total electron-group count, or the presence of lone pairs — explains the angle difference between these two specific molecules.",
        constraints: [
          { id: "c1", label: "Both central atoms have exactly 4 electron groups — count is not what differs here." },
        ],
        tools: [
          { id: "molecule-selector", label: "Molecule selector — switch between H₂O and CH₄" },
          { id: "geometry-panel", label: "Geometry panel — shows each molecule's explanation text" },
        ],
        answer: {
          mode: "choice",
          options: [
            { id: "count", label: "Electron-group count — water simply has fewer groups than methane" },
            { id: "lone-pairs", label: "Lone pairs — water's two lone pairs repel more strongly than bonding pairs, compressing its angle below methane's" },
          ],
          correctOptionId: "lone-pairs",
        },
        explanation:
          "Both molecules have exactly 4 electron groups, so count isn't the difference. What differs is that 2 of water's are lone pairs, which repel more strongly than bonding pairs and squeeze the remaining O–H bonds together — dropping the angle from methane's 109.5° baseline down to water's 104.5°.",
        hints: [
          "Compare the electron-group count for both molecules first — is it actually different?",
          "If the count is the same, what's the one structural difference between water and methane?",
          "Lone pairs repel more strongly than bonding pairs — what would that do to the remaining bond angle?",
        ],
        maxAttempts: 4,
      },
      {
        id: "chemistry-molecular-geometry-challenge-003",
        title: "Real-World Mission: Why Water Dissolves Salt",
        scenario:
          "Table salt (NaCl) dissolves readily in water but not in a nonpolar liquid like oil. Water's bent shape, with its oxygen pulling harder on the shared electrons than hydrogen does, gives the molecule a partial negative charge near oxygen and partial positive charges near the hydrogens.",
        objective:
          "Use what the 3D model shows about water's shape to determine why that bent geometry — rather than a hypothetical linear H–O–H — is essential to water acting as a polar solvent.",
        constraints: [
          { id: "c1", label: "Reason from the actual 3D shape shown in the lab, not just the chemical formula." },
        ],
        tools: [
          { id: "molecule-selector", label: "Molecule selector — set to H₂O" },
          { id: "rotate", label: "Rotate the model to see the bent shape from multiple angles" },
        ],
        answer: {
          mode: "choice",
          options: [
            { id: "bent-uneven", label: "Because the bent shape makes the partial charges uneven across the molecule, giving it a positive side and a negative side" },
            { id: "linear-would-work", label: "A linear H–O–H would work just as well, since it has the same atoms and bonds" },
          ],
          correctOptionId: "bent-uneven",
        },
        explanation:
          "If water were linear, the two O–H bond polarities would point in exactly opposite directions and cancel out, leaving no net charge separation — nonpolar, like CO₂. Because water is bent, the two bond polarities add up instead of canceling, giving the molecule a genuine negative side (near oxygen) and positive side (near the hydrogens). That charge separation is exactly what lets water surround and pull apart an ionic solid like NaCl.",
        hints: [
          "Compare this to CO₂: it has polar bonds too, but is completely nonpolar overall. Why?",
          "In a linear molecule, do two opposite bond polarities add up or cancel out?",
          "Water's bent shape means its two O–H bond polarities point in similar-enough directions to reinforce rather than cancel.",
        ],
        maxAttempts: 4,
      },
      {
        id: "chemistry-molecular-geometry-challenge-004",
        title: "Build It Yourself: Water",
        scenario:
          "Everything so far has been about reading a shape someone else built. This time, build one yourself: water is one oxygen bonded to two hydrogens, with two lone pairs left on the oxygen that this lab doesn't render but that you already know are there from Learn.",
        objective: "Switch the lab above to \"Build your own\" and construct H₂O — one oxygen, two hydrogens, both O–H bonds single.",
        constraints: [
          { id: "c1", label: "Exactly one oxygen atom and two hydrogen atoms — no extras left unbonded." },
          { id: "c2", label: "Both O–H bonds must be single bonds." },
        ],
        tools: [
          { id: "palette", label: "Atom palette — add one O and two H atoms" },
          { id: "bonding", label: "Select two atoms to bond them, choose Single" },
        ],
        answer: {
          mode: "interactive",
          instructions:
            "Add the atoms, position and bond them, then click below — the lab checks your actual structure, not just whether you clicked the right multiple-choice option.",
          verifyLabel: "Check my build",
        },
        explanation:
          "H₂O is one oxygen bonded to two separate hydrogens by single bonds — not a hydrogen-to-hydrogen chain, and not a double bond anywhere (oxygen's bonding capacity here is 2, exactly used up by two single bonds). This is the same molecule the geometry panel calls 'bent': two bonding pairs plus two lone pairs on oxygen, arranged tetrahedrally, with only the two O–H bonds visible in the final shape.",
        hints: [
          "Add one O and two H atoms from the palette first.",
          "Select the oxygen and one hydrogen, then choose Single to bond them — repeat for the second hydrogen.",
          "Both bonds should go from O to an H, not from H to H.",
        ],
        maxAttempts: 6,
      },
    ],
  },

  relatedTopics: [],
};
