"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { SearchMatch } from "@/lib/search-index";

const subjectDot: Record<string, string> = {
  physics: "bg-subject-physics",
  chemistry: "bg-subject-chemistry",
  biology: "bg-subject-biology",
  mathematics: "bg-subject-math",
};

const kindLabel: Record<SearchMatch["kind"], string> = {
  subject: "Subject",
  topic: "Topic",
  visualization: "Simulation",
};

export interface SearchResultsListProps {
  matches: SearchMatch[];
  activeId: string | null;
  onSelect: (href: string) => void;
  emptyLabel?: string;
  className?: string;
}

/** A flat, keyboard-highlightable list of search results. Used inline by the desktop dropdown and, grouped by subject, by the mobile modal. */
export function SearchResultsList({ matches, activeId, onSelect, emptyLabel, className }: SearchResultsListProps) {
  if (matches.length === 0 && emptyLabel) {
    return <p className={cn("px-4 py-6 text-center text-sm text-ink-soft dark:text-bone-soft", className)}>{emptyLabel}</p>;
  }

  return (
    <ul role="listbox" className={cn("flex flex-col gap-0.5", className)}>
      {matches.map((match) => (
        <li key={match.id} role="option" aria-selected={activeId === match.id}>
          <Link
            href={match.href}
            id={`search-option-${match.id}`}
            onClick={() => onSelect(match.href)}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
              activeId === match.id
                ? "bg-ink/[0.05] text-ink dark:bg-bone/[0.08] dark:text-bone"
                : "text-ink-soft hover:bg-ink/[0.04] hover:text-ink dark:text-bone-soft dark:hover:bg-bone/[0.06] dark:hover:text-bone",
            )}
          >
            <span aria-hidden="true" className={cn("h-1.5 w-1.5 shrink-0 rounded-full", subjectDot[match.subjectSlug])} />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium">{match.label}</span>
              <span className="block truncate text-xs text-ink-soft/80 dark:text-bone-soft/80">{match.subtitle}</span>
            </span>
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-wide text-ink-soft/60 dark:text-bone-soft/60">
              {kindLabel[match.kind]}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
