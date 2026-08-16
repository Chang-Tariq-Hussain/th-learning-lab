"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { subjectGlyphs } from "@/features/subjects/glyphs";
import { getSubjectActivityCount } from "@/features/subjects/data/subjects";
import { resolveSubjectColors } from "@/features/subjects/subject-colors";
import type { Subject } from "@/features/subjects/types";
import { cn } from "@/lib/utils";

interface SubjectCardProps {
  subject: Subject;
}

/**
 * A short summary, not a full topic listing — with dozens of topics
 * and potentially hundreds of visualizations per subject, this card's
 * only job is to get a student to the right Subject Hub
 * (`/dashboard/{subject}`), which is where topics actually live now.
 */
export function SubjectCard({ subject }: SubjectCardProps) {
  const Glyph = subjectGlyphs[subject.slug];
  const colors = resolveSubjectColors(subject.colorToken);
  const activityCount = getSubjectActivityCount(subject);
  const topicCount = subject.topics.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Link
        href={`/dashboard/${subject.slug}`}
        className={cn(
          "group relative flex h-full scroll-mt-24 flex-col gap-5 rounded-card border border-line bg-white/60 p-6 pt-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover dark:border-line-dark dark:bg-white/[0.03]",
          colors.border,
        )}
      >
        {/* specimen-card corner tab */}
        <div
          aria-hidden="true"
          className={cn(
            "absolute -top-2.5 left-6 rounded-t-sm px-2.5 py-1 font-mono text-[10px] font-medium tracking-wide text-white/90",
            colors.bar,
          )}
        >
          {subject.code}
        </div>

        <div className="flex items-start justify-between">
          <div
            className={cn(
              "relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg",
              colors.bg,
            )}
          >
            <Glyph
              className={cn(
                "h-7 w-7 transition-all duration-300 group-hover:-translate-y-6 group-hover:opacity-0",
                colors.text,
              )}
            />
            <span
              aria-hidden="true"
              className={cn(
                "absolute translate-y-6 font-mono text-sm font-medium opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
                colors.text,
              )}
            >
              {subject.notation}
            </span>
          </div>
          <span className="font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">
            {activityCount > 0 ? `${activityCount} activities` : "In development"}
          </span>
        </div>

        <div>
          <h3 className="font-display text-xl font-medium text-ink dark:text-bone">{subject.name}</h3>
          <p className={cn("mt-1 text-sm font-medium", colors.text)}>{subject.tagline}</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
            {subject.description}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-xs text-ink-soft dark:text-bone-soft">
            {topicCount} {topicCount === 1 ? "topic" : "topics"}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1 text-sm font-medium transition-transform group-hover:translate-x-0.5",
              colors.text,
            )}
          >
            Explore
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
