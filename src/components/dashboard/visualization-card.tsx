"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { resolveSubjectColors } from "@/features/subjects/subject-colors";
import type { Visualization } from "@/features/subjects/types";
import { cn } from "@/lib/utils";

export interface VisualizationCardProps {
  visualization: Visualization;
  icon: LucideIcon;
  colorToken: string;
}

export function VisualizationCard({
  visualization,
  icon: Icon,
  colorToken,
}: VisualizationCardProps) {
  const colors = resolveSubjectColors(colorToken);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
    >
      <Link
        href={visualization.href}
        className={cn(
          "group flex h-full flex-col gap-4 rounded-card border border-line bg-white/60 p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover dark:border-line-dark dark:bg-white/[0.03]",
          colors.border,
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
        <div>
          <h3 className="font-display text-lg font-medium text-ink dark:text-bone">
            {visualization.title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
            {visualization.description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
