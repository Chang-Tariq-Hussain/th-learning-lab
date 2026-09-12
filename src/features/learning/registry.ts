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
import { biologyMitosisContent } from "./data/biology-mitosis";
import { biologyMeiosisContent } from "./data/biology-meiosis";
import { biologyDnaStructureContent } from "./data/biology-dna-structure";
import { biologyCellExplorerContent } from "./data/biology-cell-explorer";
import { biologyBloodCirculationContent } from "./data/biology-blood-circulation";
import { biologyRespiratorySystemContent } from "./data/biology-respiratory-system";
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
import { physicsMagnetExplorerContent } from "./data/physics-magnet-explorer";
import { physicsCompassExplorerContent } from "./data/physics-compass-explorer";
import { physicsBasicWaveMotionContent } from "./data/physics-basic-wave-motion";
import { physicsTransverseLongitudinalWavesContent } from "./data/physics-transverse-longitudinal-waves";
import { physicsFrequencyPeriodContent } from "./data/physics-frequency-period";
import { physicsWaveSpeedContent } from "./data/physics-wave-speed";
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
import { mathematicsEquationPlaygroundContent } from "./data/mathematics-equation-playground";
import { mathematicsAngleSpinnerContent } from "./data/mathematics-angle-spinner";
import { mathematicsTriangleExplorerContent } from "./data/mathematics-triangle-explorer";
import { mathematicsSymmetryMirrorContent } from "./data/mathematics-symmetry-mirror";
import { mathematicsCalculusFoundationsContent } from "./data/mathematics-calculus-foundations";
import { mathematicsDerivativeExplorerContent } from "./data/mathematics-derivative-explorer";
import { mathematicsDerivativeRulesContent } from "./data/mathematics-derivative-rules";
import { mathematicsChainRuleExplorerContent } from "./data/mathematics-chain-rule-explorer";
import { mathematicsApplicationsOfDerivativesContent } from "./data/mathematics-applications-of-derivatives";
import { mathematicsRatioChallengeContent } from "./data/mathematics-ratio-challenge";
import { chemistryBuildAnAtomContent } from "./data/chemistry-build-an-atom";
import { chemistryPeriodicTrendsContent } from "./data/chemistry-periodic-trends";
import { chemistryBondBuilderContent } from "./data/chemistry-bond-builder";
import { chemistryMolecularGeometryContent } from "./data/chemistry-molecular-geometry";
import { chemistryReactionBuilderContent } from "./data/chemistry-reaction-builder";
import { chemistryEquationBalancerContent } from "./data/chemistry-equation-balancer";
import { chemistryReactionKineticsContent } from "./data/chemistry-reaction-kinetics";
import { chemistryAcidsBasesContent } from "./data/chemistry-acids-bases";
import { chemistryArrheniusTheoryContent } from "./data/chemistry-arrhenius-theory";
import { chemistryBronstedLowryContent } from "./data/chemistry-bronsted-lowry";
import { chemistryConjugateAcidBasePairsContent } from "./data/chemistry-conjugate-acid-base-pairs";
import { chemistryLewisAcidBaseContent } from "./data/chemistry-lewis-acid-base";
import { chemistryStrongWeakAcidsBasesContent } from "./data/chemistry-strong-weak-acids-bases";

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
 * topics. Simple Forces and Simple Energy were previously Learn +
 * Explore only (enough to make their progress trackable on the
 * `physics-foundations` learning path in `@/features/learning-path`)
 * and, per the Physics GLE audit, have since been brought up to that
 * same full standard (Learn, Predict, Explore, Explain, Practice,
 * Challenge) — each grounded strictly in its own lab's real controls
 * (Simple Forces' two 0-10 N sliders; Simple Energy's single 2-10 m
 * height slider and its fraction-based energy model), with its own
 * dedicated question bank (`physics-simple-forces` /
 * `physics-simple-energy` in `@/features/quiz-engine`) rather than
 * the older shared `physics-newtonian-mechanics` bank. Work, Energy &
 * Power is that same full standard again,
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
 *
 * Chemistry Batch 3 (Chemical Reactions) brings Reaction Builder and
 * Reaction Kinetics up from the older `SimulationLearnMore` pattern
 * to this same full standard, and adds one new topic, Equation
 * Balancer, to sit between them — see
 * `@/features/subjects/chemistry/equation-balancer` for why that
 * simulation didn't already exist and what it reuses. All three keep
 * their own dedicated question banks in `@/features/quiz-engine`
 * (`chemistry-reaction-builder`, `chemistry-equation-balancer`, and
 * an expanded `chemistry-reaction-kinetics`).
 *
 * Chemistry Batch 4 (Acids, Bases & pH) brings Acids & Bases — The
 * Basics up from the older `SimulationLearnMore` pattern to this same
 * full standard. Its existing simulation already covered picking a
 * substance and reading a 2D pH scale, so that part reused as-is; it
 * was extended with two new modes on the same shell — an interactive
 * pH slider (drag 0–14, watch classification/ion balance respond
 * live) and a Neutralization lab (mix an acid and base, watch H⁺/OH⁻
 * combine into water) — rather than new, separate simulations. Strong
 * vs. weak is covered only at an introductory level here, since a
 * full particle-level treatment already exists as its own topic
 * (`strong-weak-acids-bases`, cross-linked via `relatedTopics`) — no
 * need to duplicate that simulation's ionized-fraction visuals. Its
 * question bank was expanded from 5 to the standard 30 questions
 * (`chemistry-acids-bases` in `@/features/quiz-engine`).
 *
 * Chemistry Batch 5 (Acid-Base Theories) brings Arrhenius Theory,
 * Brønsted–Lowry Theory, and Conjugate Acid–Base Pairs up from the
 * older `SimulationLearnMore` pattern to this same full standard.
 * All three simulations already had complete, working interactions —
 * Arrhenius Theory's dissociation containers and dose controls,
 * Brønsted–Lowry's step-through proton-transfer scene, and Conjugate
 * Acid–Base Pairs' pair picker/transformation diagram — so no
 * simulation was rebuilt or extended; Predict/Explore/Explain/
 * Challenge were all written to refer directly to those existing
 * controls. Each has its own small, focused question bank — quality
 * over quantity, per spec, rather than the standard 30 — covering
 * exactly what its Learn section teaches (`chemistry-arrhenius-theory`,
 * `chemistry-bronsted-lowry`, `chemistry-conjugate-acid-base-pairs`
 * in `@/features/quiz-engine`).
 *
 * Batch 5 Part 2 completes the Acids & Bases section with its
 * remaining two topics, Lewis Acid–Base Theory and Strong vs Weak
 * Acids and Bases, brought up to the same standard from the same
 * older pattern. Lewis Acid–Base Theory reuses its existing
 * reaction-picker/step-through electron-transfer simulation exactly
 * as-is (same "one discrete stepIndex" pattern as Brønsted–Lowry).
 * Strong vs Weak Acids and Bases reuses its existing Acid/Base
 * toggle + Ionize/Reset particle-view simulation as-is; its Explore
 * section documents the simulation's real controls (a fixed
 * ionized-fraction split per example, no concentration slider) rather
 * than the older `SimulationLearnMore` copy's inaccurate mention of
 * "adjusting concentration." Each has its own small, focused question
 * bank (`chemistry-lewis-acid-base`, `chemistry-strong-weak-acids-bases`
 * in `@/features/quiz-engine`). This completes GLE coverage for all
 * six Acids & Bases topics.
 *
 * Mathematics Batch 5 (Algebra & Geometry Basics) brings three
 * existing, previously unregistered simulations up to the same full
 * standard: Equation Playground, Angle Spinner, and Symmetry Mirror.
 * Equation Playground is a distinct Algebra topic from Equation of a
 * Straight Line (`line-designer`) — see the correction note in
 * `@/features/learning-path/data/mathematics-foundations.ts` for the
 * full history of why those two were previously (incorrectly)
 * conflated; this batch adds Equation Playground to the Learning Path
 * for the first time, as its own Algebra entry, without touching
 * Line Designer or its topic. Angle Spinner and Symmetry Mirror were
 * already present in the Learning Path's "Geometry Basics" unit but
 * had no registered `TopicContent`; both reuse their existing
 * simulations exactly as-is — Angle Spinner's drag-to-rotate dial
 * with live degree/classification readout, and Symmetry Mirror's
 * click-to-fill grid whose right half is always derived as the live
 * mirror image of the left half. No simulation was modified for any
 * of the three topics. Each has its own dedicated 30-question bank
 * (`mathematics-equation-playground`, `mathematics-angle-spinner`,
 * `mathematics-symmetry-mirror` in `@/features/quiz-engine`), and
 * Challenge scenarios follow the existing "Slope Target" pattern —
 * manipulate the live simulation toward a described target, then
 * answer a question about it — since none of the three simulations
 * expose an `onVerify`-style hook for automated interactive checking.
 *
 * Mathematics Batch 6 (Calculus) brings Calculus Foundations and
 * Derivative Explorer up from the older `SimulationLearnMore` pattern
 * to this same full standard — the first two topics in the Calculus
 * unit. Both reuse their existing, already-multi-level simulations
 * exactly as-is (`@/features/subjects/mathematics/calculus-foundations`
 * and `@/features/subjects/mathematics/derivative-explorer`); neither
 * needed any changes, since each already has its own nine- or
 * ten-level guided progression and a small internal mini-challenge —
 * this batch wraps that existing depth in the shared GLE
 * Learn/Predict/Explore/Explain/Practice/Challenge shell rather than
 * rebuilding it. Every Predict, Explain, and Challenge item is
 * grounded in each simulation's own fixed worked examples (Calculus
 * Foundations' f(x) = x² limit at x → 2, its jump and hole examples;
 * Derivative Explorer's two functions, f(x) = x² and f(x) = x³) —
 * neither simulation was extended with new functions or examples.
 * Challenge scenarios follow the same "Slope Target" pattern as
 * Mathematics Batch 5, since neither simulation exposes an
 * `onVerify`-style hook. Calculus Foundations' `practice.quizId`
 * points at the pre-existing `mathematics-calculus` bank, which
 * already had the full 30 questions covering exactly this content,
 * rather than duplicating it under a new id. Derivative Explorer gets
 * a new, dedicated 30-question bank (`mathematics-derivative-explorer`
 * in `@/features/quiz-engine`), since no bank previously covered
 * derivatives. Derivative Rules, the next topic in the Calculus unit,
 * is intentionally left unimplemented this batch.
 *
 * Mathematics Batch 7 (Geometry: Triangle Explorer) adds a brand-new
 * simulation — the first new Mathematics simulation since Batch 3 —
 * rather than wrapping an existing one. Triangle Explorer
 * (`@/features/subjects/mathematics/triangle-explorer`) is a freeform
 * SVG canvas where all three vertices are independently draggable
 * (pointer-capture drag, same convention as Angle Spinner's dial and
 * Distance Between Two Points' plane), with live side lengths,
 * interior angles, perimeter, area, side/angle classification badges,
 * a right-angle marker, five quick-load presets plus a randomizer,
 * and two animated demonstrations built with Framer Motion: an "Angle
 * Sum" proof (the triangle's three corners animate to share one point
 * on a line, visibly completing a straight 180° angle) and a
 * "Pythagorean Theorem" panel (animated squares grown on each side of
 * a right triangle, with the real a² + b² = c² numbers plugged in).
 * All geometry (side lengths via the distance formula, angles via the
 * Law of Cosines, area via the shoelace formula) lives in a pure,
 * React-free `model.ts`. Complements Angle Spinner, which teaches a
 * single isolated angle, by combining three angles into a real shape
 * and showing what constrains them together. Has its own dedicated
 * 30-question bank (`mathematics-triangle-explorer` in
 * `@/features/quiz-engine`), and its Challenge scenarios follow the
 * same "manipulate the live simulation, then answer" pattern as Angle
 * Spinner, plus one `interactive`-mode scenario that has the student
 * open the Pythagorean panel and confirm the equation balances.
 *
 * Mathematics Batch 8 (Calculus) brings Derivative Rules and Chain
 * Rule Explorer up from the older `SimulationLearnMore` pattern to
 * this same full standard — topics 3 and 4 of 5 in the Calculus
 * unit. Both reuse their existing, already-multi-level simulations
 * exactly as-is (`@/features/subjects/mathematics/derivative-rules`,
 * nine levels covering the Constant, Power, Constant Multiple,
 * Sum/Difference, Product, and Quotient rules; and
 * `@/features/subjects/mathematics/chain-rule-explorer`, seven
 * levels covering composite functions, inner/outer identification,
 * the Chain Rule itself, a step-by-step workspace, a Chain-Rule-vs-
 * Power-Rule comparison, and nested functions); neither needed any
 * changes. Every Predict, Explain, and Challenge item is grounded in
 * each simulation's own fixed worked examples (Derivative Rules'
 * f(x) = x³, 4x², 3x³ + 2x² − 5x + 7, x²(x + 1), and x²/(x + 1);
 * Chain Rule Explorer's three composite functions, its (3x² + 2)⁴
 * workspace, its x⁵-vs-(x+2)⁵ and x³+2x-vs-(3x²+1)⁴ comparisons, and
 * its ((x+1)² + 2)³ nested example) — neither simulation was
 * extended with new expressions. Challenge scenarios use `choice`
 * mode throughout, rather than the `numeric` "Slope Target" pattern
 * of earlier Calculus batches, since both topics' worked answers are
 * full symbolic expressions rather than single numbers. Each topic
 * gets a new, dedicated 30-question bank (`mathematics-derivative-
 * rules` and `mathematics-chain-rule` in `@/features/quiz-engine`),
 * since no bank previously covered either topic. Applications of
 * Derivatives, the next topic in the Calculus unit, was left
 * unimplemented that batch and is completed below.
 *
 * Mathematics Batch 9 completes the Calculus unit (5 of 5) with
 * Applications of Derivatives, brought up from the older
 * `SimulationLearnMore` pattern to the same full standard. Its
 * existing nine-level simulation
 * (`@/features/subjects/mathematics/applications-of-derivatives`)
 * reuses exactly as-is — Increasing & Decreasing, Derivative Sign,
 * Critical Points, two Turning Point levels, Maximum vs Minimum (with
 * its togglable Profit note), Critical Point Finder, Sign Chart, and
 * its own mini Practice panel — no simulation changes were needed.
 * Every Learn, Predict, Explain, and Challenge item is grounded in the
 * simulation's own three fixed functions from `applications-model.ts`
 * (f(x) = x², f(x) = -x², and f(x) = x³ - 3x), never an invented
 * expression, and Challenge scenarios use `choice` mode for the same
 * reason as Batch 8. Gets a new, dedicated 30-question bank
 * (`mathematics-applications-of-derivatives` in
 * `@/features/quiz-engine`), since no bank previously covered it —
 * completing GLE coverage for the entire Calculus unit.
 *
 * This same batch also completes Ratio Challenge, the Ratio &
 * Proportion unit's advanced consolidation/challenge topic (already
 * present in the Learning Path, marked `isChallenge: true`, since an
 * earlier batch). Its existing self-scaling challenge simulation
 * (`@/features/subjects/mathematics/ratio-challenge`) — five
 * generated question kinds across three auto-adjusting difficulty
 * levels, with a streak-based level-up/level-down and instant worked
 * feedback — reuses exactly as-is; it already functions as its own
 * practice engine, so Learn stays deliberately brief (a review, not a
 * re-teach of the topics that precede it: Ratio, Ratio Comparison,
 * Proportion Builder, Cross Multiplication, and Real-Life Ratios,
 * which already own those full lessons). Its Challenge section is a
 * small, hand-picked set of harder, multi-step problems — a step up
 * from what the simulation generates on its own — rather than
 * duplicating the endless generator. Gets a new, dedicated
 * 30-question bank (`mathematics-ratio-challenge` in
 * `@/features/quiz-engine`) that deliberately mixes concepts across
 * problems rather than duplicating any single-concept question
 * already in the five earlier ratio banks.
 *
 * Physics Batch 4 (Electromagnetism) completes both of its planned
 * topics: Interactive Magnet Explorer and Interactive Compass
 * Explorer, in that recommended order. Both reuse their existing
 * simulations (`@/features/subjects/physics/magnet-explorer` and
 * `@/features/subjects/physics/compass-explorer`) exactly as-is — a
 * draggable, rotatable pair of bar magnets with live field-line
 * arcs and four presets for Magnet Explorer; a draggable compass
 * whose needle continuously realigns with a draggable, rotatable
 * magnet's field, plus a fading field-strength wedge and four presets
 * for Compass Explorer — no simulation code changes were needed for
 * either. Magnet Explorer's `practice.quizId` reuses the pre-existing
 * `physics-electromagnetism` bank (30 questions, already written to
 * match both simulations combined, and already linked from the
 * standalone `/dashboard/physics/electromagnetism-quiz` page from an
 * earlier batch) rather than duplicating it; Compass Explorer gets
 * its own newly-authored 30-question bank (`physics-compass-explorer`
 * in `@/features/quiz-engine`) scoped to what that shared bank doesn't
 * already cover in depth — investigating field direction with a
 * compass, and Earth's field including the geographic-vs-magnetic-
 * north distinction. Both topics also get a new, dedicated
 * `physics-electromagnetism` Learning Path
 * (`@/features/learning-path/data/physics-electromagnetism.ts`) — a
 * second, separate path for the Physics subject alongside the
 * existing `physics-foundations` path, rather than being inserted
 * into the Mechanics sequence they have no prerequisite relationship
 * with.
 *
 * Physics Batch 2 (Wave Motion Foundations) brings its first two
 * topics up to the full standard: Basic Wave Motion and Transverse
 * vs Longitudinal Waves. Both reuse their existing simulations
 * (`@/features/subjects/physics/basic-wave-motion` and
 * `@/features/subjects/physics/transverse-longitudinal-waves`)
 * exactly as-is — each already labels its key features (crest,
 * trough, equilibrium, amplitude, wavelength for the first;
 * propagation/particle-motion direction indicators and a comparison
 * panel for the second) directly on the simulation, so no simulation
 * code changes were needed. Each gets its own new, dedicated
 * 30-question bank (`physics-basic-wave-motion` /
 * `physics-transverse-longitudinal-waves` in
 * `@/features/quiz-engine`), distinct from the pre-existing shared
 * `physics-wave-motion` bank (which still covers all four Wave
 * Motion simulations together and remains linked from the standalone
 * `/dashboard/physics/wave-motion-quiz` page). Both topics also get
 * a new, dedicated `physics-wave-motion` Learning Path
 * (`@/features/learning-path/data/physics-wave-motion.ts`), a third
 * separate Physics path alongside `physics-foundations` and
 * `physics-electromagnetism`, since Wave Motion has no prerequisite
 * relationship with either. Frequency & Period and Wave Speed — the
 * other two topics in this simulation group — were intentionally left
 * for a future batch.
 *
 * Physics Batch 2 (Wave Motion Foundations), continued: Frequency &
 * Period and Wave Speed — v = fλ complete the Wave Motion branch's
 * four topics. Both reuse their existing simulations
 * (`@/features/subjects/physics/frequency-period` and
 * `@/features/subjects/physics/wave-speed`) exactly as-is — each
 * already has live readouts, a guided built-in experiment, and its
 * own short concept check, so no simulation code changes were needed.
 * Each gets its own new, dedicated 30-question bank
 * (`physics-frequency-period` / `physics-wave-speed` in
 * `@/features/quiz-engine`), distinct from the pre-existing shared
 * `physics-wave-motion` bank. Both topics are appended to the same
 * `physics-wave-motion` Learning Path as Basic Wave Motion and
 * Transverse vs Longitudinal Waves, completing that path's intended
 * four-topic sequence.
 *
 * Biology Batch 3 ("Cell Division") is complete: Mitosis and Meiosis
 * both reuse their existing simulations
 * (`@/features/subjects/biology/mitosis` and
 * `@/features/subjects/biology/meiosis`) exactly as-is — each already
 * modeled the correct stage sequence (Mitosis: Interphase, then
 * Prophase through Cytokinesis; Meiosis: DNA Replication, then
 * Prophase I through Telophase II), with stage controls, a per-stage
 * explanation panel, and (for Meiosis) a built-in four-row Mitosis-
 * vs-Meiosis comparison table — so no simulation code changes were
 * needed. Each gets its own new, dedicated 30-question bank
 * (`biology-mitosis` / `biology-meiosis-gle` in
 * `@/features/quiz-engine`) — Meiosis's uses the `-gle` suffix
 * specifically to avoid colliding with the pre-existing, smaller
 * `biology-meiosis` bank (5 questions, still linked from the
 * standalone `/dashboard/biology/meiosis-quiz` page, left
 * unmodified). Both topics are appended to the existing, single,
 * ever-growing `biology-cell-foundations` Learning Path
 * (`@/features/learning-path/data/biology-cell-foundations.ts`) as a
 * new "Cell Division" batch, rather than a new competing path.
 *
 * Biology GLE Batch 4 ("Human Physiology") is complete: Blood
 * Circulation and Respiratory System are both brought up to the full
 * standard (Learn, Predict, Explore, Explain, Practice, Challenge).
 * Blood Circulation reuses its existing simulation
 * (`@/features/subjects/biology/blood-circulation`) exactly as-is —
 * it already modeled the correct four-chamber sequence, a pulmonary/
 * systemic circuit toggle, Trace Blood, Follow-the-Blood, and a valve
 * explanation — so no simulation code changes were needed; the Learn
 * content carries the general artery/vein/capillary definitions and
 * the pulmonary-vessel oxygen-content exceptions. Respiratory System
 * reuses its existing simulation
 * (`@/features/subjects/biology/respiratory-system`) with one
 * additive change: it previously had no diaphragm, chest-volume, or
 * pressure mechanics at all, so an animated diaphragm and a new
 * `BreathingMechanics` panel were added, driven by the same `phase`
 * value already controlling lung size. Each topic gets its own new,
 * dedicated 30-question bank (`biology-blood-circulation` /
 * `biology-respiratory-system` in `@/features/quiz-engine`). Both
 * topics form a new, dedicated `biology-human-physiology` Learning
 * Path (`@/features/learning-path/data/biology-human-physiology.ts`),
 * separate from `biology-cell-foundations` since physiology has no
 * prerequisite relationship with cell biology topics.
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
  biologyMitosisContent,
  biologyMeiosisContent,
  biologyDnaStructureContent,
  biologyCellExplorerContent,
  biologyBloodCirculationContent,
  biologyRespiratorySystemContent,
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
  physicsMagnetExplorerContent,
  physicsCompassExplorerContent,
  physicsBasicWaveMotionContent,
  physicsTransverseLongitudinalWavesContent,
  physicsFrequencyPeriodContent,
  physicsWaveSpeedContent,
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
  mathematicsRatioChallengeContent,
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
  mathematicsEquationPlaygroundContent,
  mathematicsAngleSpinnerContent,
  mathematicsTriangleExplorerContent,
  mathematicsSymmetryMirrorContent,
  mathematicsCalculusFoundationsContent,
  mathematicsDerivativeExplorerContent,
  mathematicsDerivativeRulesContent,
  mathematicsChainRuleExplorerContent,
  mathematicsApplicationsOfDerivativesContent,
  chemistryBuildAnAtomContent,
  chemistryPeriodicTrendsContent,
  chemistryBondBuilderContent,
  chemistryMolecularGeometryContent,
  chemistryReactionBuilderContent,
  chemistryEquationBalancerContent,
  chemistryReactionKineticsContent,
  chemistryAcidsBasesContent,
  chemistryArrheniusTheoryContent,
  chemistryBronstedLowryContent,
  chemistryConjugateAcidBasePairsContent,
  chemistryLewisAcidBaseContent,
  chemistryStrongWeakAcidsBasesContent,
];

export function getTopicContent(subjectSlug: string, topicSlug: string): TopicContent | undefined {
  return topicContentList.find((topic) => topic.subjectSlug === subjectSlug && topic.topicSlug === topicSlug);
}
