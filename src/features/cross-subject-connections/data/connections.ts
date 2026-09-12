import type { CrossSubjectConnection } from "../types";

/**
 * A deliberately small, hand-picked set of connections — enough to
 * validate the architecture across all four subjects (including a
 * chained example: chemistry → biology → a bare concept node), not
 * an attempt at exhaustive coverage. Add more here as high-quality
 * examples come up; nothing else needs to change to pick them up.
 */
export const crossSubjectConnections: CrossSubjectConnection[] = [
  {
    id: "derivatives-velocity-acceleration",
    source: {
      subject: "math",
      label: "Derivatives",
      href: "/dashboard/mathematics/derivative-explorer",
    },
    destination: {
      subject: "physics",
      label: "Velocity & Acceleration",
      href: "/dashboard/physics/simple-motion",
    },
    explanation:
      "Velocity is the derivative of position with respect to time, and acceleration is the derivative of velocity — the same tangent-line slope explored in the Derivative Explorer is exactly how physicists define the instantaneous speed of a moving object.",
    reason:
      "Seeing a derivative show up as a real, measurable quantity — speed — turns an abstract slope-of-a-curve idea into something concrete, and explains why physics leans on calculus so heavily.",
    prerequisite: {
      subject: "math",
      label: "Calculus Foundations",
      href: "/dashboard/mathematics/calculus-foundations",
    },
  },
  {
    id: "chemical-energy-cellular-respiration",
    source: {
      subject: "chemistry",
      label: "Chemical Energy",
      href: "/dashboard/chemistry/reaction-builder",
    },
    destination: {
      subject: "biology",
      label: "Cellular Respiration",
      href: "/dashboard/biology/cellular-respiration",
    },
    explanation:
      "Chemical bonds store potential energy, and breaking or forming them releases or absorbs that energy — cellular respiration is a cell running exactly this chemistry, breaking down glucose to release the energy stored in its bonds.",
    reason:
      "Bridges an abstract idea from chemistry (energy stored in bonds) to a concrete biological payoff (why cells, and therefore we, need food and oxygen).",
  },
  {
    id: "cellular-respiration-atp",
    source: {
      subject: "biology",
      label: "Cellular Respiration",
      href: "/dashboard/biology/cellular-respiration",
    },
    destination: {
      subject: "biology",
      label: "ATP",
    },
    explanation:
      "The energy cellular respiration releases from glucose isn't used directly — it's captured by attaching a phosphate group to ADP, producing ATP, the molecule cells spend to power nearly everything they do.",
    reason:
      "Completes the energy chain from 'bonds store energy' to 'cells actually use that energy', so the payoff of respiration isn't just heat — it's a usable, portable energy currency.",
    prerequisite: {
      subject: "chemistry",
      label: "Chemical Energy",
      href: "/dashboard/chemistry/reaction-builder",
    },
  },
  {
    id: "statistics-ecosystem-sampling",
    source: {
      subject: "math",
      label: "Statistics — Sampling",
      href: "/dashboard/mathematics/statistics-foundations",
    },
    destination: {
      subject: "biology",
      label: "Ecosystem Explorer",
      href: "/dashboard/biology/ecosystem-explorer",
    },
    explanation:
      "Ecologists can't count every organism in a habitat, so they count a sample — a small plot or timed survey — and use it to estimate the whole population, the exact population-vs-sample idea from statistics.",
    reason:
      "Shows statistics as a tool scientists actually reach for in the field, not just a classroom topic — and explains why a good sample matters for a trustworthy ecosystem estimate.",
  },
  {
    id: "respiration-circulation-oxygen-transport",
    source: {
      subject: "biology",
      label: "Respiratory System",
      href: "/dashboard/biology/respiratory-system",
    },
    destination: {
      subject: "biology",
      label: "Blood Circulation",
      href: "/dashboard/biology/blood-circulation",
    },
    explanation:
      "The respiratory system provides oxygen to the blood and removes carbon dioxide from it at the alveoli; the circulatory system is what actually transports that oxygen and carbon dioxide between the lungs and every other tissue in the body.",
    reason:
      "Neither system does much good without the other — gas exchange in the lungs would be pointless if circulation couldn't carry the oxygen anywhere, and circulation would have nothing to deliver without the lungs replenishing it.",
  },
  {
    id: "digestion-circulation-nutrient-transport",
    source: {
      subject: "biology",
      label: "Digestive System",
      href: "/dashboard/biology/digestive-system",
    },
    destination: {
      subject: "biology",
      label: "Blood Circulation",
      href: "/dashboard/biology/blood-circulation",
    },
    explanation:
      "The digestive system breaks food down and absorbs nutrients like glucose and amino acids into the bloodstream through the small intestine's villi; the circulatory system is what actually carries those absorbed nutrients from the gut to every tissue that needs them.",
    reason:
      "Absorption is only the first half of the story — without circulation to distribute what's absorbed, nutrients would just accumulate near the small intestine instead of reaching the rest of the body.",
  },
  {
    id: "nervous-system-digestion-regulation",
    source: {
      subject: "biology",
      label: "Nervous System",
      href: "/dashboard/biology/nervous-system",
    },
    destination: {
      subject: "biology",
      label: "Digestive System",
      href: "/dashboard/biology/digestive-system",
    },
    explanation:
      "Neurons don't just carry sensory and motor signals — nerves also regulate digestion, controlling the muscle contractions that move food along the tract and signaling glands to release digestive secretions at the right time.",
    reason:
      "Shows the nervous system's job isn't limited to the brain and obvious movement — it's quietly coordinating internal processes like digestion in the background the whole time.",
  },
  {
    id: "photosynthesis-producers-ecosystem-explorer",
    source: {
      subject: "biology",
      label: "Photosynthesis",
      href: "/dashboard/biology/photosynthesis",
    },
    destination: {
      subject: "biology",
      label: "Ecosystem Explorer",
      href: "/dashboard/biology/ecosystem-explorer",
    },
    explanation:
      "Photosynthesis is the cellular process producers use to make their own food from sunlight — it's exactly what makes the Tree and Grass in Ecosystem Explorer producers, the entry point energy uses to get into the rest of the ecosystem.",
    reason:
      "Connects a cellular-level process to its ecosystem-level payoff: understanding photosynthesis explains why producers, specifically, are the base every food chain depends on.",
  },
  {
    id: "cellular-respiration-food-chain-energy-loss",
    source: {
      subject: "biology",
      label: "Cellular Respiration",
      href: "/dashboard/biology/cellular-respiration",
    },
    destination: {
      subject: "biology",
      label: "Food Chain & Food Web",
      href: "/dashboard/biology/food-chain-web",
    },
    explanation:
      "Cellular respiration is how an organism actually spends the energy it gains from eating — most of what's 'lost' at each step of the Energy Flow ladder in Food Chain & Food Web is energy an organism used through respiration for movement, growth, and heat.",
    reason:
      "Explains, at the cellular level, why energy transfer between trophic levels is so lossy — a question the ecosystem-level simulation shows but doesn't answer on its own.",
  },
];
