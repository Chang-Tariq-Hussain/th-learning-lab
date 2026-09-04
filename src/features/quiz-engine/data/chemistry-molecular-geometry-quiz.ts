import type { QuizMeta, QuizQuestion } from "../types";

/** Matches Molecule Builder's Practice step. */
const questions: QuizQuestion[] = [
  {
    id: "chemistry-molecular-geometry-001",
    type: "multiple-choice",
    question: "According to VSEPR theory, what determines a molecule's shape?",
    options: [
      "Electron groups around the central atom repelling each other and spreading as far apart as possible",
      "The relative masses of the atoms involved",
      "The order in which atoms were added to the molecule",
      "The color of each element",
    ],
    correctAnswer:
      "Electron groups around the central atom repelling each other and spreading as far apart as possible",
    explanation:
      "VSEPR stands for Valence Shell Electron Pair Repulsion — electron groups (bonds and lone pairs) around a central atom push each other away, and that spacing is what produces the molecule's shape.",
    difficulty: "easy",
    subject: "chemistry",
    topic: "molecule-builder",
    concept: "VSEPR theory",
  },
  {
    id: "chemistry-molecular-geometry-002",
    type: "multiple-choice",
    question: "A central atom with two electron groups and no lone pairs has what geometry?",
    options: ["Linear", "Bent", "Trigonal planar", "Tetrahedral"],
    correctAnswer: "Linear",
    explanation:
      "With only two electron groups, they push as far apart as possible — directly opposite each other — giving a straight, 180° molecule.",
    difficulty: "easy",
    subject: "chemistry",
    topic: "molecule-builder",
    concept: "Geometry from electron groups",
  },
  {
    id: "chemistry-molecular-geometry-003",
    type: "multiple-choice",
    question: "What is the approximate bond angle in a linear molecule like CO₂?",
    options: ["180°", "120°", "109.5°", "90°"],
    correctAnswer: "180°",
    explanation:
      "Two electron groups with no lone pairs spread to opposite sides of the central atom, giving a bond angle of 180°.",
    difficulty: "easy",
    subject: "chemistry",
    topic: "molecule-builder",
    concept: "Bond angles",
  },
  {
    id: "chemistry-molecular-geometry-004",
    type: "multiple-choice",
    question: "Why is water (H₂O) bent rather than linear, even though oxygen only bonds to two hydrogens?",
    options: [
      "Oxygen's two lone pairs also take up space around it, pushing the two O–H bonds together into a bent shape",
      "Hydrogen atoms repel each other more strongly than they bond to oxygen",
      "Water is actually linear, but drawn bent for convenience",
      "Oxygen is too small to hold two hydrogens in a straight line",
    ],
    correctAnswer:
      "Oxygen's two lone pairs also take up space around it, pushing the two O–H bonds together into a bent shape",
    explanation:
      "Oxygen has four electron groups total — two bonds and two lone pairs. All four arrange tetrahedrally, but only the two bonds are 'visible' in the shape, so the molecule reads as bent rather than straight.",
    difficulty: "medium",
    subject: "chemistry",
    topic: "molecule-builder",
    concept: "Lone pairs and shape",
    misconceptionTag: "lone-pairs-invisible-to-shape",
  },
  {
    id: "chemistry-molecular-geometry-005",
    type: "multiple-choice",
    question: "Water's H–O–H bond angle (about 104.5°) is smaller than methane's H–C–H angle (109.5°). Why?",
    options: [
      "Water's two lone pairs repel more strongly than bonding pairs, squeezing the two O–H bonds closer together",
      "Oxygen atoms are smaller than carbon atoms, so its bonds naturally sit closer",
      "Hydrogen bonds to oxygen more weakly than to carbon",
      "The two angles are actually the same; 104.5° is a rounding difference",
    ],
    correctAnswer:
      "Water's two lone pairs repel more strongly than bonding pairs, squeezing the two O–H bonds closer together",
    explanation:
      "Lone-pair electron density is held closer to the nucleus than a bonding pair, so lone pairs repel neighboring electron groups more strongly than bonds do — compressing the angle between the two O–H bonds from the ideal 109.5° down to about 104.5°.",
    difficulty: "hard",
    subject: "chemistry",
    topic: "molecule-builder",
    concept: "Lone pairs and shape",
  },
  {
    id: "chemistry-molecular-geometry-006",
    type: "multiple-choice",
    question: "A central atom with three electron groups and no lone pairs (like boron in BF₃) has what geometry?",
    options: ["Trigonal planar", "Tetrahedral", "Bent", "Linear"],
    correctAnswer: "Trigonal planar",
    explanation:
      "Three electron groups with no lone pairs spread out evenly in a flat plane, 120° apart from each other — a trigonal planar shape.",
    difficulty: "easy",
    subject: "chemistry",
    topic: "molecule-builder",
    concept: "Geometry from electron groups",
  },
  {
    id: "chemistry-molecular-geometry-007",
    type: "multiple-choice",
    question: "What is the approximate bond angle in a trigonal planar molecule like BF₃?",
    options: ["120°", "180°", "109.5°", "104.5°"],
    correctAnswer: "120°",
    explanation:
      "Three electron groups spread evenly in a plane sit 120° apart from each other.",
    difficulty: "easy",
    subject: "chemistry",
    topic: "molecule-builder",
    concept: "Bond angles",
  },
  {
    id: "chemistry-molecular-geometry-008",
    type: "multiple-choice",
    question: "A central atom with four electron groups and no lone pairs (like carbon in CH₄) has what geometry?",
    options: ["Tetrahedral", "Trigonal planar", "Bent", "Linear"],
    correctAnswer: "Tetrahedral",
    explanation:
      "Four electron groups with no lone pairs spread into three dimensions as far apart as possible, forming a tetrahedron with 109.5° between every pair of bonds.",
    difficulty: "easy",
    subject: "chemistry",
    topic: "molecule-builder",
    concept: "Geometry from electron groups",
  },
  {
    id: "chemistry-molecular-geometry-009",
    type: "multiple-choice",
    question: "Why can't methane's true shape be drawn accurately as a flat cross on paper?",
    options: [
      "Because its four bonds point toward the corners of a tetrahedron, which is inherently three-dimensional",
      "Because carbon only forms three real bonds; the fourth is decorative",
      "Because methane's shape actually is flat, and a cross is a fair drawing",
      "Because hydrogen atoms are too small to draw accurately",
    ],
    correctAnswer:
      "Because its four bonds point toward the corners of a tetrahedron, which is inherently three-dimensional",
    explanation:
      "A flat drawing (like a plus sign) implies 90° angles between neighboring bonds, but methane's actual bond angles are 109.5°, which only exists in three dimensions — you have to rotate the true 3D structure to see it honestly.",
    difficulty: "medium",
    subject: "chemistry",
    topic: "molecule-builder",
    concept: "3D shape vs. flat drawings",
  },
  {
    id: "chemistry-molecular-geometry-010",
    type: "multiple-choice",
    question: "CO₂ has two double bonds and no lone pairs on carbon. How many electron groups does carbon have, for VSEPR purposes?",
    options: [
      "2 — VSEPR counts each bonded atom as one electron group, regardless of bond order",
      "4 — because each double bond counts as two separate groups",
      "0 — double bonds don't count as electron groups",
      "6 — counting every individual electron pair in both double bonds",
    ],
    correctAnswer:
      "2 — VSEPR counts each bonded atom as one electron group, regardless of bond order",
    explanation:
      "VSEPR treats a double or triple bond to one neighboring atom as a single electron group (a single region of electron density), not multiple groups — so CO₂'s carbon has 2 electron groups (to each oxygen) and is linear, not something more crowded.",
    difficulty: "hard",
    subject: "chemistry",
    topic: "molecule-builder",
    concept: "Counting electron groups",
    misconceptionTag: "double-bonds-count-as-two-groups",
  },
  {
    id: "chemistry-molecular-geometry-011",
    type: "multiple-choice",
    question: "Which of these correctly ranks bond angle from largest to smallest, for central atoms with no lone pairs?",
    options: [
      "Linear (180°) > Trigonal planar (120°) > Tetrahedral (109.5°)",
      "Tetrahedral (109.5°) > Trigonal planar (120°) > Linear (180°)",
      "Trigonal planar (120°) > Linear (180°) > Tetrahedral (109.5°)",
      "All three have the same bond angle",
    ],
    correctAnswer: "Linear (180°) > Trigonal planar (120°) > Tetrahedral (109.5°)",
    explanation:
      "As the number of electron groups increases from 2 to 3 to 4, each group has to make room for more neighbors, so the angle between any two of them shrinks: 180° → 120° → 109.5°.",
    difficulty: "medium",
    subject: "chemistry",
    topic: "molecule-builder",
    concept: "Bond angles",
  },
  {
    id: "chemistry-molecular-geometry-012",
    type: "multiple-choice",
    question: "A molecule's geometry name (like 'bent' or 'tetrahedral') describes the arrangement of:",
    options: [
      "The atoms — not necessarily all the electron groups, since lone pairs are invisible to the shape's name",
      "The electron groups, always including any lone pairs in the name",
      "Only the central atom's protons",
      "The molecule's overall electric charge",
    ],
    correctAnswer:
      "The atoms — not necessarily all the electron groups, since lone pairs are invisible to the shape's name",
    explanation:
      "Electron-group geometry (how the electron groups arrange themselves) and molecular geometry (the name given to the shape) can differ when lone pairs are present — water's electron groups are tetrahedral, but its molecular geometry is named 'bent' because only the atom positions are described.",
    difficulty: "hard",
    subject: "chemistry",
    topic: "molecule-builder",
    concept: "Electron-group vs. molecular geometry",
  },
  {
    id: "chemistry-molecular-geometry-013",
    type: "multiple-choice",
    question: "In the 3D molecule viewer, rotating BF₃ shows all three fluorine atoms and the boron atom lying in the same flat plane. What does that confirm?",
    options: [
      "Boron has three electron groups and no lone pairs, giving a trigonal planar shape",
      "Fluorine atoms are incapable of forming 3D structures",
      "BF₃ is actually two separate molecules overlapping",
      "The simulation has a rendering error, since real molecules are never flat",
    ],
    correctAnswer:
      "Boron has three electron groups and no lone pairs, giving a trigonal planar shape",
    explanation:
      "Trigonal planar is, by definition, flat — three electron groups with no lone pairs spread out evenly in a single plane, which is exactly what a full rotation of BF₃ shows.",
    difficulty: "medium",
    subject: "chemistry",
    topic: "molecule-builder",
    concept: "3D shape vs. flat drawings",
  },
  {
    id: "chemistry-molecular-geometry-014",
    type: "multiple-choice",
    question: "If a hypothetical central atom had four bonding groups and one lone pair (five electron groups total), would you expect its bond angles to be closer to 109.5° or smaller?",
    options: [
      "Smaller than 109.5° — the extra lone pair pushes harder on its neighbors than a bonding pair would",
      "Exactly 109.5° — lone pairs never affect bond angles",
      "Larger than 109.5° — lone pairs push electron groups farther apart",
      "There's no way to predict this from VSEPR",
    ],
    correctAnswer:
      "Smaller than 109.5° — the extra lone pair pushes harder on its neighbors than a bonding pair would",
    explanation:
      "The same lone-pair-repels-more-strongly effect that compresses water's angle to 104.5° applies generally: any lone pair on the central atom tends to compress the angles between the remaining bonding groups below the 'ideal' value for that electron-group count.",
    difficulty: "hard",
    subject: "chemistry",
    topic: "molecule-builder",
    concept: "Lone pairs and shape",
  },
];

export const chemistryMolecularGeometryQuiz: QuizMeta = {
  id: "chemistry-molecular-geometry",
  title: "Molecular Geometry Quiz",
  subjectSlug: "chemistry",
  subjectLabel: "Chemistry",
  topicLabel: "Molecule Builder",
  colorToken: "chemistry",
  backHref: "/dashboard/chemistry/molecule-builder",
  description:
    "Test your understanding of VSEPR theory and how electron-group repulsion determines molecular shape.",
  difficulty: "medium",
  estimatedTime: 8,
  questions,
};
