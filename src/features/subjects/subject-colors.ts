/**
 * Tailwind class names per `colorToken`, shared by every card that
 * needs to tint itself to match its subject — `SubjectCard`,
 * `TopicCard`, and `VisualizationCard` all read from this one map
 * instead of each keeping its own copy.
 */
export interface SubjectColorSet {
  text: string;
  bg: string;
  border: string;
  bar: string;
}

export const subjectColorMap: Record<string, SubjectColorSet> = {
  physics: {
    text: "text-subject-physics",
    bg: "bg-subject-physics-soft dark:bg-subject-physics/10",
    border: "group-hover:border-subject-physics/40",
    bar: "bg-subject-physics",
  },
  chemistry: {
    text: "text-subject-chemistry",
    bg: "bg-subject-chemistry-soft dark:bg-subject-chemistry/10",
    border: "group-hover:border-subject-chemistry/40",
    bar: "bg-subject-chemistry",
  },
  biology: {
    text: "text-subject-biology",
    bg: "bg-subject-biology-soft dark:bg-subject-biology/10",
    border: "group-hover:border-subject-biology/40",
    bar: "bg-subject-biology",
  },
  math: {
    text: "text-subject-math",
    bg: "bg-subject-math-soft dark:bg-subject-math/10",
    border: "group-hover:border-subject-math/40",
    bar: "bg-subject-math",
  },
};

export function resolveSubjectColors(colorToken: string): SubjectColorSet {
  return subjectColorMap[colorToken] ?? subjectColorMap.physics!;
}
