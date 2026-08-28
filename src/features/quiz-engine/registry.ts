import type { QuizMeta } from "./types";
import { biologyCellExplorerQuiz } from "./data/biology-cell-explorer-quiz";
import { biologyCellularRespirationQuiz } from "./data/biology-cellular-respiration-quiz";
import { biologyEcosystemQuiz } from "./data/biology-ecosystem-quiz";
import { biologyMeiosisQuiz } from "./data/biology-meiosis-quiz";
import { biologyNervousSystemQuiz } from "./data/biology-nervous-system-quiz";
import { chemistryAcidsBasesQuiz } from "./data/chemistry-acids-bases-quiz";
import { chemistryAtomQuiz } from "./data/chemistry-atom-quiz";
import { chemistryChemicalBondingQuiz } from "./data/chemistry-chemical-bonding-quiz";
import { chemistryPeriodicTrendsQuiz } from "./data/chemistry-periodic-trends-quiz";
import { chemistryReactionKineticsQuiz } from "./data/chemistry-reaction-kinetics-quiz";
import { mathematicsCalculusQuiz } from "./data/mathematics-calculus-quiz";
import { mathematicsCoordinateGeometryQuiz } from "./data/mathematics-coordinate-geometry-quiz";
import { mathematicsCoordinatePlaneQuiz } from "./data/mathematics-coordinate-plane-quiz";
import { mathematicsPlottingPointsQuiz } from "./data/mathematics-plotting-points-quiz";
import { mathematicsDistanceQuiz } from "./data/mathematics-distance-quiz";
import { mathematicsMeasurementQuiz } from "./data/mathematics-measurement-quiz";
import { mathematicsNumberLineQuiz } from "./data/mathematics-number-line-quiz";
import { mathematicsEvenOddQuiz } from "./data/mathematics-even-odd-quiz";
import { mathematicsFactorsMultiplesQuiz } from "./data/mathematics-factors-multiples-quiz";
import { mathematicsFractionsQuiz } from "./data/mathematics-fractions-quiz";
import { mathematicsFractionOperationsQuiz } from "./data/mathematics-fraction-operations-quiz";
import { mathematicsRatioQuiz } from "./data/mathematics-ratio-quiz";
import { mathematicsRatioComparisonQuiz } from "./data/mathematics-ratio-comparison-quiz";
import { mathematicsProportionQuiz } from "./data/mathematics-proportion-quiz";
import { mathematicsCrossMultiplicationQuiz } from "./data/mathematics-cross-multiplication-quiz";
import { mathematicsRealLifeRatiosQuiz } from "./data/mathematics-real-life-ratios-quiz";
import { mathematicsPerimeterAreaQuiz } from "./data/mathematics-perimeter-area-quiz";
import { mathematicsStatisticsQuiz } from "./data/mathematics-statistics-quiz";
import { mathematicsStraightLineQuiz } from "./data/mathematics-straight-line-quiz";
import { physicsElectromagnetismQuiz } from "./data/physics-electromagnetism-quiz";
import { physicsMotionQuiz } from "./data/physics-motion-quiz";
import { physicsSimpleMotionQuiz } from "./data/physics-simple-motion-quiz";
import { physicsVelocityQuiz } from "./data/physics-velocity-quiz";
import { physicsAccelerationQuiz } from "./data/physics-acceleration-quiz";
import { physicsMomentumQuiz } from "./data/physics-momentum-quiz";
import { physicsCircularMotionQuiz } from "./data/physics-circular-motion-quiz";
import { physicsGravitationQuiz } from "./data/physics-gravitation-quiz";
import { physicsNewtonianMechanicsQuiz } from "./data/physics-newtonian-mechanics-quiz";
import { physicsNewtonsLawsQuiz } from "./data/physics-newtons-laws-quiz";
import { physicsProjectileMotionQuiz } from "./data/physics-projectile-motion-quiz";
import { physicsWorkEnergyPowerQuiz } from "./data/physics-work-energy-power-quiz";
import { physicsWaveMotionQuiz } from "./data/physics-wave-motion-quiz";

/**
 * Every registered quiz. Add a new quiz by creating a `QuizMeta` in
 * `data/` (see `physics-motion-quiz.ts` for the pattern) and listing
 * it here — nothing else needs to change. This mirrors
 * `features/subjects/data/subjects.ts`: a single array, read by
 * getter functions, instead of scattered lookups.
 */
export const quizzes: QuizMeta[] = [
  biologyCellExplorerQuiz,
  biologyCellularRespirationQuiz,
  biologyEcosystemQuiz,
  biologyMeiosisQuiz,
  biologyNervousSystemQuiz,
  chemistryAcidsBasesQuiz,
  chemistryAtomQuiz,
  chemistryChemicalBondingQuiz,
  chemistryPeriodicTrendsQuiz,
  chemistryReactionKineticsQuiz,
  mathematicsCalculusQuiz,
  mathematicsCoordinateGeometryQuiz,
  mathematicsCoordinatePlaneQuiz,
  mathematicsPlottingPointsQuiz,
  mathematicsDistanceQuiz,
  mathematicsMeasurementQuiz,
  mathematicsStatisticsQuiz,
  mathematicsStraightLineQuiz,
  mathematicsNumberLineQuiz,
  mathematicsEvenOddQuiz,
  mathematicsFactorsMultiplesQuiz,
  mathematicsFractionsQuiz,
  mathematicsFractionOperationsQuiz,
  mathematicsRatioQuiz,
  mathematicsRatioComparisonQuiz,
  mathematicsProportionQuiz,
  mathematicsCrossMultiplicationQuiz,
  mathematicsRealLifeRatiosQuiz,
  mathematicsPerimeterAreaQuiz,
  physicsElectromagnetismQuiz,
  physicsMotionQuiz,
  physicsSimpleMotionQuiz,
  physicsVelocityQuiz,
  physicsAccelerationQuiz,
  physicsNewtonianMechanicsQuiz,
  physicsNewtonsLawsQuiz,
  physicsProjectileMotionQuiz,
  physicsWorkEnergyPowerQuiz,
  physicsMomentumQuiz,
  physicsCircularMotionQuiz,
  physicsGravitationQuiz,
  physicsWaveMotionQuiz,
];

export function getQuizById(id: string): QuizMeta | undefined {
  return quizzes.find((quiz) => quiz.id === id);
}

export function getQuizzesBySubject(subjectSlug: string): QuizMeta[] {
  return quizzes.filter((quiz) => quiz.subjectSlug === subjectSlug);
}
