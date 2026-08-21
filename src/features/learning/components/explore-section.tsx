"use client";

import type { ReactNode } from "react";
import { FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InstructionsPanel } from "@/features/simulation";
import { cn } from "@/lib/utils";
import { resolveSubjectColors } from "@/features/subjects/subject-colors";
import { useLearningProgress } from "@/hooks/use-learning-progress";
import { SectionShell } from "./section-shell";
import type { ExploreSectionContent } from "../types";

export interface ExploreSectionProps {
  subjectSlug: string;
  topicSlug: string;
  colorToken: string;
  content: ExploreSectionContent;
  /** The live, interactive simulation for this topic. The Explore
   *  section is the only place the architecture asks a caller to
   *  supply a subject-specific component — everything else is fully
   *  generic. */
  children: ReactNode;
  className?: string;
}

/** EXPLORE — the guided experiment. Renders the caller's simulation,
 *  then the existing `InstructionsPanel` for how-to-use steps and an
 *  optional "try this" list, reusing both patterns from
 *  `SimulationLearnMore` rather than re-implementing them. */
export function ExploreSection({ subjectSlug, topicSlug, colorToken, content, children, className }: ExploreSectionProps) {
  const { completeStep, getTopicProgress } = useLearningProgress();
  const progress = getTopicProgress(subjectSlug, topicSlug);
  const done = progress.stepsCompleted.includes("explore");
  const colors = resolveSubjectColors(colorToken);

  return (
    <SectionShell
      icon={<FlaskConical className="h-4 w-4" strokeWidth={1.75} />}
      label="Explore — run the experiment"
      colorToken={colorToken}
      className={className}
    >
      {children}

      <InstructionsPanel title="How to use this simulation" steps={content.howToUse} defaultOpen={false} className="mt-4" />

      {content.tryThis && content.tryThis.length > 0 ? (
        <div className="mt-4 rounded-card border border-line bg-white/60 p-5 dark:border-line-dark dark:bg-white/[0.03] sm:p-6">
          <p className="mb-2 text-sm font-medium text-ink dark:text-bone">Try this</p>
          <ul className="flex flex-col gap-2 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
            {content.tryThis.map((prompt, index) => (
              <li key={index} className="flex gap-2">
                <span className={cn("mt-2 h-1 w-1 shrink-0 rounded-full", colors.bar)} aria-hidden="true" />
                {prompt}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <Button
        variant="secondary"
        size="sm"
        className="mt-4"
        disabled={done}
        onClick={() => completeStep(subjectSlug, topicSlug, "explore")}
      >
        {done ? "Explore step complete" : "I ran the experiment — mark Explore complete"}
      </Button>
    </SectionShell>
  );
}
