import type { LearningPath } from "../types";

/**
 * Operating Systems branch of the Information Technology learning
 * path — a sibling path to `information-technology-computer-fundamentals`,
 * not a modification of it (Information Technology now has two
 * registered paths; a subject can have more than one). Recommended
 * order is CPU Scheduling before Process Management, per the brief.
 * As with every path in this app, `prerequisites` are advisory only —
 * they drive the Learning Path UI's recommended order, but never
 * lock or gate direct access to a topic's simulation route.
 *
 * Paging now follows Virtual Memory: Virtual Memory answers "why does
 * a process get an address space larger than RAM?", and Paging answers
 * "how is that actually implemented?". Remaining future topics
 * (Deadlocks) are named only in this file's comments — they are NOT
 * implemented or linked here.
 */
export const informationTechnologyOperatingSystemsPath: LearningPath = {
  id: "information-technology-operating-systems",
  subjectSlug: "information-technology",
  title: "Operating Systems",
  description: "How an operating system decides which process runs next, and how it tracks each process's state along the way.",
  colorToken: "it",
  topics: [
    {
      subjectSlug: "information-technology",
      topicSlug: "cpu-scheduling-simulator",
      title: "CPU Scheduling",
      description: "How the operating system decides which ready process gets the CPU next.",
      href: "/dashboard/information-technology/cpu-scheduling-simulator",
      prerequisites: [],
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "process-management-simulator",
      title: "Process Management",
      description: "What a process is, and how the OS tracks and manages its state and resources.",
      href: "/dashboard/information-technology/process-management-simulator",
      // Omitted: falls back to the default linear chain (depends on
      // the topic immediately before it, cpu-scheduling-simulator).
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "memory-management-simulator",
      title: "Memory Management",
      description: "How the OS allocates and frees RAM across multiple processes, and what fragmentation is.",
      href: "/dashboard/information-technology/memory-management-simulator",
      // Omitted: falls back to the default linear chain (depends on
      // process-management-simulator, immediately before it).
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "virtual-memory-simulator",
      title: "Virtual Memory",
      description: "How a process gets a large virtual address space even when physical RAM is limited.",
      href: "/dashboard/information-technology/virtual-memory-simulator",
      // Omitted: falls back to the default linear chain (depends on
      // memory-management-simulator, immediately before it).
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "paging-simulator",
      title: "Paging",
      description: "How the OS maps virtual pages onto physical frames using page tables, and what happens on a page fault.",
      href: "/dashboard/information-technology/paging-simulator",
      // Omitted: falls back to the default linear chain (depends on
      // virtual-memory-simulator, immediately before it). Advisory
      // only — the Paging route stays directly accessible regardless.
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "file-system-explorer",
      title: "File System Explorer",
      description: "How an operating system organizes files and directories on persistent storage.",
      href: "/dashboard/information-technology/file-system-explorer",
      // Omitted: falls back to the default linear chain (depends on
      // paging-simulator, immediately before it).
    },
    // Future (not implemented here): Deadlocks would continue this
    // sequence.
  ],
};
