"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle, Lock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveSubjectColors } from "@/features/subjects/subject-colors";
import { useLearningPath } from "@/hooks/use-learning-path";
import { pathTopicKeyId } from "../types";
import type { LearningPathTopicState } from "../engine";
import type { LearningPath } from "../types";

export interface LearningPathTrackProps {
  path: LearningPath;
  className?: string;
}

/**
 * Renders one `LearningPath` as an ordered, locked/unlocked progress
 * track plus a recommendation callout — the "turn topics into a
 * structured progression" UI the brief asks for. Entirely generic:
 * every string it renders comes from `path`/`state`, so this same
 * component works for any subject's path with no changes here.
 */
export function LearningPathTrack({ path, className }: LearningPathTrackProps) {
  const state = useLearningPath(path);
  const colors = resolveSubjectColors(path.colorToken);
  const coreTopics = state.topics.filter((t) => !t.ref.isChallenge);
  const challengeTopics = state.topics.filter((t) => t.ref.isChallenge);

  return (
    <section
      className={cn(
        "rounded-card border border-line bg-white/60 p-6 shadow-card dark:border-line-dark dark:bg-white/[0.03] sm:p-8",
        className,
      )}
      aria-label={`${path.title} learning path`}
    >
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-xl">
          <p className={cn("font-mono text-[11px] uppercase tracking-[0.2em]", colors.text)}>Learning Path</p>
          <h2 className="mt-1 font-display text-xl font-medium text-ink dark:text-bone sm:text-2xl">{path.title}</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{path.description}</p>
        </div>

        <div className="flex flex-col items-end gap-1 text-right">
          <span className="font-mono text-2xl font-semibold text-ink dark:text-bone">
            {state.startedCoreCount}/{state.totalCoreCount}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">
            topics started
          </span>
        </div>
      </div>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-line dark:bg-line-dark" role="presentation">
        <div
          className={cn("h-full rounded-full transition-all duration-500", colors.bar)}
          style={{ width: `${state.totalCoreCount === 0 ? 0 : Math.round((state.startedCoreCount / state.totalCoreCount) * 100)}%` }}
        />
      </div>
      <p className="mt-1.5 font-mono text-[11px] uppercase tracking-wide text-ink-soft/70 dark:text-bone-soft/60">
        {state.completedCoreCount}/{state.totalCoreCount} fully complete · {state.pathMasteryPercent}% average mastery
      </p>

      <ol className="mt-7 flex flex-col" aria-label="Path topics, in order">
        {coreTopics.map((topicState, index) => (
          <TrackNode
            key={pathTopicKeyId(topicState.ref)}
            topicState={topicState}
            colors={colors}
            isLast={index === coreTopics.length - 1}
          />
        ))}
      </ol>

      {challengeTopics.length > 0 ? (
        <div className="mt-6 border-t border-dashed border-line pt-5 dark:border-line-dark">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">
            Challenge topics
          </p>
          <div className="flex flex-wrap gap-2">
            {challengeTopics.map((topicState) => (
              <ChallengeChip key={pathTopicKeyId(topicState.ref)} topicState={topicState} colors={colors} />
            ))}
          </div>
        </div>
      ) : null}

      {state.recommendation ? (
        <div className={cn("mt-6 flex items-start gap-3 rounded-lg px-4 py-3", colors.bg)}>
          <Sparkles className={cn("mt-0.5 h-4 w-4 shrink-0", colors.text)} strokeWidth={1.75} aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="text-sm text-ink dark:text-bone">{state.recommendation.reason}</p>
            {state.recommendation.topic ? (
              <Link
                href={state.recommendation.topic.href}
                className={cn("mt-1 inline-flex items-center gap-1 text-sm font-medium hover:underline", colors.text)}
              >
                Go to {state.recommendation.topic.title}
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}

interface TrackColors {
  text: string;
  bg: string;
  border: string;
  bar: string;
}

function TrackNode({
  topicState,
  colors,
  isLast,
}: {
  topicState: LearningPathTopicState;
  colors: TrackColors;
  isLast: boolean;
}) {
  const { ref, status, masteryPercent } = topicState;
  const isLocked = status === "locked";

  const icon =
    status === "completed" ? (
      <CheckCircle2 className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
    ) : isLocked ? (
      <Lock className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
    ) : (
      <Circle className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
    );

  const nodeClasses = cn(
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors",
    status === "completed" && cn("border-transparent", colors.bg, colors.text),
    status === "current" && cn("border-2", colors.text, "border-current"),
    status === "unlocked" && "border-ink/25 text-ink-soft dark:border-bone/30 dark:text-bone-soft",
    isLocked && "border-line text-ink-soft/60 dark:border-line-dark dark:text-bone-soft/50",
  );

  const body = (
    <div className="flex flex-1 items-center gap-3 py-1.5">
      <div>
        <p
          className={cn(
            "font-display text-base font-medium",
            isLocked ? "text-ink-soft/70 dark:text-bone-soft/60" : "text-ink dark:text-bone",
          )}
        >
          {ref.title}
        </p>
        <p className="text-xs leading-relaxed text-ink-soft dark:text-bone-soft">{ref.description}</p>
        {isLocked && topicState.unmetPrerequisites.length > 0 ? (
          <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wide text-ink-soft/70 dark:text-bone-soft/60">
            Locked · finish {topicState.unmetPrerequisites.map((p) => p.title).join(" & ")} first
          </p>
        ) : null}
        {!isLocked && status !== "completed" ? (
          <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">
            {masteryPercent}% mastery
          </p>
        ) : null}
      </div>
    </div>
  );

  return (
    <li className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={nodeClasses}>{icon}</div>
        {!isLast ? <span className="my-1 w-px flex-1 bg-line dark:bg-line-dark" aria-hidden="true" /> : null}
      </div>
      {isLocked ? (
        <div className="flex-1 pb-6">{body}</div>
      ) : (
        <Link href={ref.href} className="group flex-1 rounded-md pb-6 transition-opacity hover:opacity-80">
          {body}
        </Link>
      )}
    </li>
  );
}

function ChallengeChip({ topicState, colors }: { topicState: LearningPathTopicState; colors: TrackColors }) {
  const { ref, status } = topicState;
  const isLocked = status === "locked";

  const content = (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide",
        status === "completed" ? cn("border-transparent", colors.bg, colors.text) : "border-line dark:border-line-dark",
        isLocked && "text-ink-soft/60 dark:text-bone-soft/50",
        !isLocked && status !== "completed" && "text-ink dark:text-bone",
      )}
    >
      {status === "completed" ? (
        <CheckCircle2 className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
      ) : isLocked ? (
        <Lock className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
      ) : (
        <Sparkles className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
      )}
      {ref.title}
    </span>
  );

  return isLocked ? content : <Link href={ref.href}>{content}</Link>;
}
