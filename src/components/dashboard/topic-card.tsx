"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { resolveTopicIcon } from "@/features/subjects/topic-icons";
import { resolveSubjectColors } from "@/features/subjects/subject-colors";
import type { Topic } from "@/features/subjects/types";
import { cn } from "@/lib/utils";

export interface TopicCardProps {
  subjectSlug: string;
  colorToken: string;
  topic: Topic;
}

export function TopicCard({ subjectSlug, colorToken, topic }: TopicCardProps) {
  const Icon = resolveTopicIcon(topic.slug);
  const colors = resolveSubjectColors(colorToken);
  const activityCount = topic.visualizations.length;
  const isComingSoon = activityCount === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Link
        href={`/dashboard/${subjectSlug}/${topic.slug}`}
        className={cn(
          "group flex h-full flex-col gap-4 rounded-card border border-line bg-white/60 p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover dark:border-line-dark dark:bg-white/[0.03]",
          colors.border,
          isComingSoon && "opacity-70",
        )}
      >
        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-xl",
            colors.bg,
          )}
        >
          <Icon className={cn("h-7 w-7", colors.text)} strokeWidth={1.75} />
        </div>

        <div className="flex-1">
          <h3 className="font-display text-lg font-medium text-ink dark:text-bone">{topic.name}</h3>
          <p className="mt-1 font-mono text-xs uppercase tracking-wide text-ink-soft dark:text-bone-soft">
            {isComingSoon ? "Coming soon" : `${activityCount} ${activityCount === 1 ? "activity" : "activities"}`}
          </p>
        </div>

        {!isComingSoon ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-sm font-medium transition-transform group-hover:translate-x-0.5",
              colors.text,
            )}
          >
            Explore
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </span>
        ) : null}
      </Link>
    </motion.div>
  );
}
