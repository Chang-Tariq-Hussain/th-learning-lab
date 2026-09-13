import type { LearningPath } from "../types";

/**
 * First Information Technology learning path. Per the batch brief,
 * Computer Fundamentals is meant to sequence Computer Components
 * Explorer -> CPU–RAM–Storage Data Flow ("first understand the
 * physical components, then how they work together"). Only Data Flow
 * is built so far this session, so this path currently has a single
 * node with no prerequisites; add the Components Explorer node ahead
 * of it (as its prerequisite) once that simulation exists, without
 * otherwise restructuring this file.
 */
export const informationTechnologyComputerFundamentalsPath: LearningPath = {
  id: "information-technology-computer-fundamentals",
  subjectSlug: "information-technology",
  title: "Computer Fundamentals",
  description: "Understand what a computer's core components are and how they work together.",
  colorToken: "it",
  topics: [
    {
      subjectSlug: "information-technology",
      topicSlug: "cpu-ram-storage-data-flow",
      title: "CPU–RAM–Storage Data Flow",
      description: "How the CPU, RAM, and storage work together when a computer does something.",
      href: "/dashboard/information-technology/cpu-ram-storage-data-flow",
      prerequisites: [],
    },
  ],
};
