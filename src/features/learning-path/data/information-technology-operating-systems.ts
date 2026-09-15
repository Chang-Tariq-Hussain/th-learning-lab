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
 * Future topics (Memory Management, Virtual Memory, File Systems,
 * Deadlocks) are named only in this file's comments, matching the
 * brief's "should eventually allow future topics to follow naturally" —
 * they are NOT implemented or linked here.
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
    // Future (not implemented here): Memory Management, Virtual
    // Memory, File Systems, Deadlocks would continue this sequence.
  ],
};
