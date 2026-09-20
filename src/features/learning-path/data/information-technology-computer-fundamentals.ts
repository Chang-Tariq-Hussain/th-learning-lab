import type { LearningPath } from "../types";

/**
 * Information Technology learning path. Sequenced Computer
 * Components Explorer -> CPU Architecture & Instruction Cycle ->
 * Cache Memory Explorer -> CPU–RAM–Storage Data Flow -> Binary & Data
 * Representation -> Computer Boot Process -> I/O & Interrupts ("first understand the
 * physical components, then what happens inside the CPU when it
 * executes an instruction, then how small fast memory keeps the CPU
 * fed, then how the CPU/RAM/storage work together, then how data is
 * represented, then how the machine starts, then how devices get the CPU's attention before Operating Systems"). Computer Components
 * Explorer sits at the front as the path's only no-prerequisite node.
 * Per the brief, prerequisites here are advisory only (this path/its
 * UI recommends an order) — they never lock or gate direct access to
 * a topic's simulation route.
 */
export const informationTechnologyComputerFundamentalsPath: LearningPath = {
  id: "information-technology-computer-fundamentals",
  subjectSlug: "information-technology",
  title: "Computer Fundamentals",
  description: "Understand what a computer's core components are, how they work together, how data is represented, how the machine starts, and how devices communicate with the CPU.",
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
      topicSlug: "cpu-architecture-instruction-cycle",
      title: "CPU Architecture & Instruction Cycle",
      description: "What happens inside the CPU when it executes one instruction — Fetch, Decode, Execute, Write Back.",
      href: "/dashboard/information-technology/cpu-architecture-instruction-cycle",
      // Omitted: falls back to the default linear chain (depends on
      // the topic immediately before it, computer-components-explorer).
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "cache-memory-explorer",
      title: "Cache Memory Explorer",
      description: "Why CPUs use cache, and how hits, misses, locality, cache lines, and eviction decide how fast memory feels.",
      href: "/dashboard/information-technology/cache-memory-explorer",
      // Omitted: falls back to the default linear chain (depends on
      // the topic immediately before it, cpu-architecture-instruction-cycle).
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "cpu-ram-storage-data-flow",
      title: "CPU–RAM–Storage Data Flow",
      description: "How the CPU, RAM, and storage work together when a computer does something.",
      href: "/dashboard/information-technology/cpu-ram-storage-data-flow",
      // Explicit, on purpose. Cache Memory Explorer was inserted
      // *before* this topic, so leaving this omitted would have
      // silently re-pointed the default chain at it — and a student who
      // had already started this topic but never opened Cache would
      // suddenly see it locked in the path panel. Keeping the original
      // prerequisite preserves existing progress and keeps Cache a
      // recommended step rather than a gate; the displayed order (and
      // the "Next topic" navigation) is still Cache -> Data Flow.
      prerequisites: [{ subjectSlug: "information-technology", topicSlug: "cpu-architecture-instruction-cycle" }],
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
    {
      subjectSlug: "information-technology",
      topicSlug: "io-interrupts-explorer",
      title: "I/O & Interrupts",
      description: "How the CPU and software communicate with devices, and how devices and events get the CPU's attention.",
      href: "/dashboard/information-technology/io-interrupts-explorer",
      // Omitted: falls back to the default linear chain (depends on
      // the topic immediately before it, computer-boot-process).
    },
  ],
};
