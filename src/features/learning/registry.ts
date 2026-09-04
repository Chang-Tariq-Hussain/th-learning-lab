import type { TopicContent } from "./types";
import { biologyWhatIsACellContent } from "./data/biology-what-is-a-cell";
import { biologyCellStructureOrganizationContent } from "./data/biology-cell-structure-organization";
import { biologyCellOrganellesContent } from "./data/biology-cell-organelles";
import { biologyPlantVsAnimalCellsContent } from "./data/biology-plant-vs-animal-cells";
import { biologyCellMembraneContent } from "./data/biology-cell-membrane";
import { biologyDiffusionOsmosisContent } from "./data/biology-diffusion-osmosis";
import { biologyActiveTransportContent } from "./data/biology-active-transport";
import { biologyCellularEnergyContent } from "./data/biology-cellular-energy";
import { biologyPhotosynthesisContent } from "./data/biology-photosynthesis";
import { biologyPhotosynthesisFactorsContent } from "./data/biology-photosynthesis-factors";
import { biologyCellularRespirationContent } from "./data/biology-cellular-respiration";
import { biologyAtpEnergyReleaseContent } from "./data/biology-atp-energy-release";
import { biologyPhotosynthesisVsRespirationContent } from "./data/biology-photosynthesis-vs-respiration";
import { physicsSimpleMotionContent } from "./data/physics-simple-motion";
import { physicsVelocityContent } from "./data/physics-velocity";
import { physicsAccelerationContent } from "./data/physics-acceleration";
import { physicsProjectileMotionContent } from "./data/physics-projectile-motion";
import { physicsSimpleForcesContent } from "./data/physics-simple-forces";
import { physicsNewtonsLawsContent } from "./data/physics-newtons-laws";
import { physicsSimpleEnergyContent } from "./data/physics-simple-energy";
import { physicsWorkEnergyPowerContent } from "./data/physics-work-energy-power";
import { physicsMomentumContent } from "./data/physics-momentum";
import { physicsCircularMotionContent } from "./data/physics-circular-motion";
import { physicsGravitationContent } from "./data/physics-gravitation";
import { mathematicsNumberLineContent } from "./data/mathematics-number-line";
import { mathematicsEvenOddContent } from "./data/mathematics-even-odd";
import { mathematicsFactorsMultiplesContent } from "./data/mathematics-factors-multiples";
import { mathematicsFractionsContent } from "./data/mathematics-fractions";
import { mathematicsFractionOperationsContent } from "./data/mathematics-fraction-operations";
import { mathematicsRatioContent } from "./data/mathematics-ratio";
import { mathematicsRatioComparisonContent } from "./data/mathematics-ratio-comparison";
import { mathematicsProportionContent } from "./data/mathematics-proportion";
import { mathematicsCrossMultiplicationContent } from "./data/mathematics-cross-multiplication";
import { mathematicsRealLifeRatiosContent } from "./data/mathematics-real-life-ratios";
import { mathematicsMeasurementContent } from "./data/mathematics-measurement";
import { mathematicsPerimeterAreaContent } from "./data/mathematics-perimeter-area";
import { mathematicsCoordinatePlaneContent } from "./data/mathematics-coordinate-plane";
import { mathematicsPlottingPointsContent } from "./data/mathematics-plotting-points";
import { mathematicsDistanceContent } from "./data/mathematics-distance";
import { mathematicsMidpointContent } from "./data/mathematics-midpoint";
import { mathematicsSlopeContent } from "./data/mathematics-slope";
import { mathematicsEquationOfLineContent } from "./data/mathematics-equation-of-line";
import { mathematicsDataCollectionContent } from "./data/mathematics-data-collection";
import { mathematicsGraphBuilderContent } from "./data/mathematics-graph-builder";
import { mathematicsStatisticsFoundationsContent } from "./data/mathematics-statistics-foundations";
import { mathematicsMeasuresOfDispersionContent } from "./data/mathematics-measures-of-dispersion";
import { mathematicsCentralTendencyContent } from "./data/mathematics-central-tendency";
import { mathematicsDataComparisonContent } from "./data/mathematics-data-comparison";
import { chemistryBuildAnAtomContent } from "./data/chemistry-build-an-atom";
import { chemistryPeriodicTrendsContent } from "./data/chemistry-periodic-trends";
import { chemistryBondBuilderContent } from "./data/chemistry-bond-builder";
import { chemistryMolecularGeometryContent } from "./data/chemistry-molecular-geometry";

/**
 * Every registered topic's learning content. Add a new topic by
 * creating a `TopicContent` in `data/` (see
 * `data/physics-simple-motion.ts` for the pattern) and listing it
 * here — mirrors `features/subjects/data/subjects.ts` and
 * `features/quiz-engine/registry.ts`: one array, read by getters,
 * instead of scattered lookups.
 *
 * Simple Motion is the full reference implementation. Velocity,
 * Acceleration, Newton's Laws, and Projectile Motion are brought up
 * to that same full standard (Learn, Predict, Explore, Explain,
 * Practice, Challenge) — Velocity and Acceleration reuse the Newton's
 * Laws Lab simulation as their Explore experience (see their `data/`
 * files for why that simulation is the right fit); Newton's Laws and
 * Projectile Motion are each that same standard applied to their own
 * home simulation, each with its own dedicated question bank
 * (`physics-newtons-laws` / `physics-projectile-motion` in
 * `@/features/quiz-engine`) rather than a quiz shared across sibling
 * topics. Simple Forces and Simple Energy remain Learn + Explore only
 * for now — enough to make their progress trackable, which is what
 * the `physics-foundations` learning path (`@/features/learning-path`)
 * is built on. Work, Energy & Power is that same full standard again,
 * applied to its own dedicated `WorkEnergyPower` lab and its own
 * question bank (`physics-work-energy-power` in `@/features/quiz-engine`).
 * Momentum is that same full standard once more, reusing Newton's
 * Laws' existing "Law 3" rig as its own `Momentum` lab (see that
 * component's doc comment) rather than a new physics engine, with its
 * own dedicated question bank (`physics-momentum`).
 *
 * Mathematics Batch 1 (Number Sense & Fractions) follows the same
 * pattern, but per the Mathematics design principle it's framed as
 * visualize → manipulate → discover a pattern → reason → solve,
 * rather than physics' observe → understand → apply. Number Line and
 * Fractions reuse the pre-existing `NumberLine` and `FractionPizza`
 * simulations as-is. Even & Odd Numbers and Factors & Multiples had
 * no existing simulation, so minimal new ones were built — the Even
 * & Odd Explorer and Factor Finder (see their own doc comments in
 * `@/features/subjects/mathematics/`) — reusing the existing
 * challenge-banner/confetti/chime conventions from `number-line`
 * rather than inventing new ones. Fraction Operations is likewise a
 * new minimal simulation, the Fraction Operations Lab, with a
 * dedicated visual per operation (common-denominator bars for
 * add/subtract, an area-model grid for multiply, a grouped-chunk bar
 * for divide). Each of these five topics has its own 30-question
 * bank in `@/features/quiz-engine/data/mathematics-*-quiz.ts`.
 *
 * Mathematics Batch 2 (Ratio, Proportion & Measurement) follows the
 * same pattern and design principle, reusing the pre-existing Ratio
 * Explorer, Ratio Comparison, Proportion Builder, Cross Multiplication
 * Explorer, Real-Life Ratios, Measurement Explorer, and Perimeter &
 * Area Explorer simulations as-is — no new simulations were built for
 * this batch. Each topic has its own 30-question bank, except
 * Measurement, which reuses the pre-existing `mathematics-measurement`
 * bank rather than duplicating it.
 *
 * Biology Batch 1 (Cell Biology Foundations) is up to six of its
 * seven planned topics: What Is a Cell?, Cell Structure &
 * Organization, and Cell Organelles reuse the Interactive Cell
 * Explorer (`@/features/subjects/biology/cell-explorer`); Plant vs
 * Animal Cells also reuses the Cell Explorer, this time built around
 * its Animal/Plant switch; Cell Membrane and Diffusion & Osmosis both
 * reuse the existing Cell Membrane & Transport simulation
 * (`@/features/subjects/biology/membrane-transport`). No new
 * simulation was built for any of these six topics. Cell Structure &
 * Organization, Cell Organelles, Plant vs Animal Cells, and Cell
 * Membrane all use Challenge scenarios as a guided "mission" — find or
 * observe something specific in the simulation, then answer a question
 * about it — scoped strictly to what each simulation actually supports
 * (see each file's own doc comment for exactly what). Topic 7 (Active
 * Transport) is not yet implemented. Each topic has its own dedicated
 * question bank in `@/features/quiz-engine` (`biology-what-is-a-cell`,
 * `biology-cell-structure-organization`, `biology-cell-organelles`,
 * `biology-plant-vs-animal-cells`, `biology-cell-membrane`,
 * `biology-diffusion-osmosis`).
 *
 * Biology Batch 2 ("Cellular Energy & Life Processes") begins with
 * its first three (of three) planned topics: Introduction to
 * Cellular Energy, Photosynthesis, and Factors Affecting
 * Photosynthesis. Introduction to Cellular Energy reuses the
 * existing Cellular Respiration simulation
 * (`@/features/subjects/biology/cellular-respiration`) purely for its
 * energy-release visual, staying at an introductory ATP level rather
 * than teaching the full respiration pathway. Photosynthesis reuses
 * the existing Photosynthesis simulation
 * (`@/features/subjects/biology/photosynthesis`) as-is. Factors
 * Affecting Photosynthesis reuses that same simulation with its new
 * `showFactorControls` prop (a minimal, additive extension — see that
 * component's doc comment), which reveals Light/CO2/Temperature
 * sliders that scale the existing scene's playback rate rather than
 * introducing a second simulation. No new simulation was built for
 * any of these three topics. Each has its own dedicated 15-question
 * bank (`biology-cellular-energy`, `biology-photosynthesis`,
 * `biology-photosynthesis-factors`).
 *
 * Mathematics Batch 3 (Coordinate Geometry) is complete: Coordinate
 * Plane, Plotting Points, Distance Between Two Points, Midpoint,
 * Slope of a Line, and Equation of a Straight Line all have full
 * `TopicContent` and their own dedicated 30-question banks
 * (`mathematics-coordinate-plane` / `mathematics-plotting-points` /
 * `mathematics-distance` / `mathematics-midpoint` /
 * `mathematics-slope` / `mathematics-equation-of-line` in
 * `@/features/quiz-engine`) — 180 questions total. Five of the six
 * topics reuse a pre-existing simulation as-is: Coordinate Plane
 * Explorer, Plot a Point, Distance Between Two Points, Midpoint of a
 * Line Segment, and Slope of a Line. The sixth, Equation of a
 * Straight Line, uses a new Line Designer simulation
 * (`@/features/subjects/mathematics/line-designer`) — the Learning
 * Path previously pointed this topic at Equation Playground, which
 * turned out on inspection to be an unrelated arithmetic simulation
 * with no slope/intercept graphing at all; see the correction and
 * full explanation in
 * `@/features/learning-path/data/mathematics-foundations.ts`.
 *
 * Chemistry Batch 1 (Foundations) is Chemistry's first Golden
 * Learning Experience content, brought up to the same full standard
 * (Learn, Predict, Explore, Explain, Practice, Challenge) as the
 * Physics/Mathematics reference implementations above. Build an Atom
 * and Periodic Trends both reuse their existing, pre-built
 * simulations as-is (`@/features/subjects/chemistry/build-an-atom`
 * and `@/features/subjects/chemistry/periodic-trends`) — no new
 * simulation or 3D upgrade was needed for either: Build an Atom's
 * existing 2D shell diagram already makes isotopes and ions directly
 * interactive, and Periodic Trends' table/compare-panel format is
 * inherently 2D. Each has its own dedicated question bank
 * (`chemistry-atom`, `chemistry-periodic-trends` in
 * `@/features/quiz-engine`).
 *
 * Chemistry Batch 2 (Chemical Bonding & Molecules) brings Bond
 * Builder up from its earlier Learn + Explore + quiz-link pattern
 * (`SimulationLearnMore`) to that same full standard. The Batch 2
 * audit found the underlying simulation itself too thin to teach
 * bond order (it only ever showed Na+Cl and H–H), so it was extended
 * with a second ionic pair (Mg+O — two electrons transfer instead of
 * one) and two more covalent pairs (O₂'s double bond, N₂'s triple
 * bond), all reusing the same scene/electron-animation components,
 * just parametrized by pair instead of hardcoded
 * (`@/features/subjects/chemistry/bond-builder`). Its question bank
 * was expanded from 5 to the standard 30 questions to actually cover
 * valence electrons, the octet rule, bond order, and lone pairs
 * (`chemistry-chemical-bonding` in `@/features/quiz-engine`) — not
 * just ionic-vs-covalent recognition. Molecule Builder was already a
 * full, high-quality GLE topic with real 3D VSEPR geometry
 * (`chemistry-molecular-geometry` below) and needed no further
 * upgrade for this batch beyond the cross-link added to Bond
 * Builder's `relatedTopics`.
 */
export const topicContentList: TopicContent[] = [
  biologyWhatIsACellContent,
  biologyCellStructureOrganizationContent,
  biologyCellOrganellesContent,
  biologyPlantVsAnimalCellsContent,
  biologyCellMembraneContent,
  biologyDiffusionOsmosisContent,
  biologyActiveTransportContent,
  biologyCellularEnergyContent,
  biologyPhotosynthesisContent,
  biologyPhotosynthesisFactorsContent,
  biologyCellularRespirationContent,
  biologyAtpEnergyReleaseContent,
  biologyPhotosynthesisVsRespirationContent,
  physicsSimpleMotionContent,
  physicsVelocityContent,
  physicsAccelerationContent,
  physicsProjectileMotionContent,
  physicsSimpleForcesContent,
  physicsNewtonsLawsContent,
  physicsSimpleEnergyContent,
  physicsWorkEnergyPowerContent,
  physicsMomentumContent,
  physicsCircularMotionContent,
  physicsGravitationContent,
  mathematicsNumberLineContent,
  mathematicsEvenOddContent,
  mathematicsFactorsMultiplesContent,
  mathematicsFractionsContent,
  mathematicsFractionOperationsContent,
  mathematicsRatioContent,
  mathematicsRatioComparisonContent,
  mathematicsProportionContent,
  mathematicsCrossMultiplicationContent,
  mathematicsRealLifeRatiosContent,
  mathematicsMeasurementContent,
  mathematicsPerimeterAreaContent,
  mathematicsCoordinatePlaneContent,
  mathematicsPlottingPointsContent,
  mathematicsDistanceContent,
  mathematicsMidpointContent,
  mathematicsSlopeContent,
  mathematicsEquationOfLineContent,
  mathematicsDataCollectionContent,
  mathematicsGraphBuilderContent,
  mathematicsStatisticsFoundationsContent,
  mathematicsMeasuresOfDispersionContent,
  mathematicsCentralTendencyContent,
  mathematicsDataComparisonContent,
  chemistryBuildAnAtomContent,
  chemistryPeriodicTrendsContent,
  chemistryBondBuilderContent,
  chemistryMolecularGeometryContent,
];

export function getTopicContent(subjectSlug: string, topicSlug: string): TopicContent | undefined {
  return topicContentList.find((topic) => topic.subjectSlug === subjectSlug && topic.topicSlug === topicSlug);
}
