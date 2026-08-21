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
];
