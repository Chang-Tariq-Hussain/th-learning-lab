"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveSubjectColors } from "@/features/subjects/subject-colors";
import { getTopicContent } from "@/features/learning/registry";
import { useLearningProgress } from "@/hooks/use-learning-progress";
import { findPathTopicByHref } from "../registry";

export interface LearningPathNextTopicProps {
  className?: string;
}

/**
 * The "NEXT TOPIC →" navigation for a topic page — one component,
 * mounted once per topic page, that:
 *
 * 1. Figures out which Learning Path (if any) the current page
 *    belongs to by matching the *current URL* against every
 *    registered path's topic `href`s (`findPathTopicByHref`) —
 *    deliberately not by `(subjectSlug, topicSlug)`, since a handful
 *    of topics have a route slug that differs from their progress
 *    tracking slug (see `data/mathematics-foundations.ts`). A page
 *    never needs to know its own content slug for this to work.
 * 2. For topics that don't have a full Golden Learning Experience
 *    (and so have no other way to record progress — `TopicLearning
 *    Experience` already records a "learn" step when its content
 *    exists), marks the topic started the moment the page mounts.
 *    This is the "topic visited" signal `PART 8` of the unlocking
 *    brief calls out as the simplest reliable option for topics
 *    without a richer one — and it's what unlocks the *next* topic
 *    (see `../engine.ts`'s `isStarted`).
 * 3. Renders a link to the next topic in that path's order (`PART
 *    10`: found by position, never hard-coded per-topic), or a
 *    "Learning Path Complete" state back to the subject's path when
 *    this is the last topic (`PART 11`).
 *
 * Renders nothing if the current page isn't part of any registered
 * learning path (e.g. Chemistry/Biology topics, or quiz pages) — safe
 * to mount unconditionally from a shared component like
 * `TopicLearningExperience`.
 *
 * Deliberately never gated on mastery or on every section being
 * complete — it's available on this page the same moment the next
 * topic itself unlocks, per the brief's testing-mode requirement.
 */
export function LearningPathNextTopic({ className }: LearningPathNextTopicProps) {
  const pathname = usePathname();
  const { completeStep, hydrated } = useLearningProgress();
  const found = pathname ? findPathTopicByHref(pathname) : undefined;

  // Auto-record a "started" signal for topics with no Golden Learning
  // Experience of their own to click through — the only such signal
  // available for them. Topics *with* registered content already get
  // a real "learn" step from `LearnSection`'s own button, so this is
  // skipped for them rather than recording a second, weaker signal.
  useEffect(() => {
    if (!hydrated || !found) return;
    const { subjectSlug, topicSlug } = found.ref;
    if (getTopicContent(subjectSlug, topicSlug)) return;
    completeStep(subjectSlug, topicSlug, "learn");
  }, [hydrated, found, completeStep]);

  if (!found) return null;

  const colors = resolveSubjectColors(found.path.colorToken);
  const next = found.path.topics[found.index + 1];

  return (
    <div className={cn("flex justify-end border-t border-line pt-6 dark:border-line-dark", className)}>
      {next ? (
        <Link
          href={next.href}
          className={cn(
            "group inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors",
            colors.border,
            colors.text,
            "border-line dark:border-line-dark",
          )}
        >
          Next Topic: {next.title}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={2} aria-hidden="true" />
        </Link>
      ) : (
        <Link
          href={`/dashboard/${found.path.subjectSlug}`}
          className={cn(
            "group inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors",
            colors.bg,
            colors.text,
          )}
        >
          <PartyPopper className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
          Learning Path Complete — Return to {found.path.title}
        </Link>
      )}
    </div>
  );
}
