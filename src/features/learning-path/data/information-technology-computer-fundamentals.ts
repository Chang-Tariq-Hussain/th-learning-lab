import type { LearningPath } from "../types";

/**
 * Information Technology learning path. Sequenced Computer
 * Components Explorer -> CPU–RAM–Storage Data Flow -> Binary & Data
 * Representation -> Computer Boot Process ("first understand the
 * physical components, then how they work together, then how data
 * is represented, then how the machine starts"). Computer Components
 * Explorer is now built and sits at the front as the path's only
 * no-prerequisite node. Per the brief, prerequisites here are
 * advisory only (this path/its UI recommends an order) — they never
 * lock or gate direct access to a topic's simulation route.
 */
export const informationTechnologyComputerFundamentalsPath: LearningPath = {
  id: "information-technology-computer-fundamentals",
  subjectSlug: "information-technology",
  title: "Computer Fundamentals",
  description: "Understand what a computer's core components are, how they work together, how data is represented, and how the machine starts.",
  colorToken: "it",
  topics: [
    {
      subjectSlug: "information-technology",
      topicSlug: "computer-components-explorer",
      title: "Computer Components & Hardware Explorer",
      description: "What the major physical components of a computer are, where they sit, and how they connect.",
      href: "/dashboard/information-technology/computer-components-explorer",
      prerequisites: [],
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "cpu-ram-storage-data-flow",
      title: "CPU–RAM–Storage Data Flow",
      description: "How the CPU, RAM, and storage work together when a computer does something.",
      href: "/dashboard/information-technology/cpu-ram-storage-data-flow",
      // Omitted: falls back to the default linear chain (depends on
      // the topic immediately before it, computer-components-explorer).
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "binary-data-representation",
      title: "Binary & Data Representation",
      description: "How computers represent numbers and characters using bits and bytes.",
      href: "/dashboard/information-technology/binary-data-representation",
      // Omitted: falls back to the default linear chain (depends on
      // the topic immediately before it, cpu-ram-storage-data-flow).
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "computer-boot-process",
      title: "Computer Boot Process",
      description: "The conceptual sequence a computer follows from power-on to a usable desktop.",
      href: "/dashboard/information-technology/computer-boot-process",
      // Omitted: falls back to the default linear chain (depends on
      // the topic immediately before it, binary-data-representation).
    },
  ],
};
