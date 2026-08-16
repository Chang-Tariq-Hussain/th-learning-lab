"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { VisualizationCard } from "./visualization-card";
import type { Visualization } from "@/features/subjects/types";
import { resolveTopicIcon } from "@/features/subjects/topic-icons";
export interface TopicVisualizationsSectionProps {
  visualizations: Visualization[];
  icon: string;
  colorToken: string;
}

/**
 * Owns the search box's state and filters instantly (no debounce, no
 * network round-trip needed — this is a client-side filter over
 * however many visualizations one topic has, which stays small even
 * as the platform scales to hundreds, since visualizations are always
 * scoped to a single topic here, never the whole site).
 */
export function TopicVisualizationsSection({
  visualizations,
  icon,
  colorToken,
}: TopicVisualizationsSectionProps) {
  const [query, setQuery] = useState("");
  const Icon = resolveTopicIcon(icon);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return visualizations;
    return visualizations.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q),
    );
  }, [visualizations, query]);

  if (visualizations.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-ink/15 p-10 text-center dark:border-bone/20">
        <p className="text-sm text-ink-soft dark:text-bone-soft">
          No activities here yet — check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="relative max-w-sm">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft dark:text-bone-soft"
          strokeWidth={1.75}
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search this topic…"
          aria-label="Search visualizations in this topic"
          className="w-full rounded-full border border-line bg-white/70 py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-ink/30 dark:border-line-dark dark:bg-white/[0.03] dark:text-bone dark:placeholder:text-bone-soft/50 dark:focus:border-bone/30"
        />
      </div>

      <div aria-live="polite">
        {filtered.length === 0 ? (
          <p className="py-10 text-center text-sm text-ink-soft dark:text-bone-soft">
            No visualizations match &ldquo;{query}&rdquo;.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((visualization) => (
                <VisualizationCard
                  key={visualization.slug}
                  visualization={visualization}
                  icon={Icon}
                  colorToken={colorToken}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
