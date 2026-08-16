"use client";

import Link from "next/link";
import { subjects } from "@/features/subjects/data/subjects";
import { cn } from "@/lib/utils";

const subjectDot: Record<string, string> = {
  physics: "bg-subject-physics",
  chemistry: "bg-subject-chemistry",
  biology: "bg-subject-biology",
  mathematics: "bg-subject-math",
};

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

/**
 * Persistent section navigation for the dashboard. Rendered as a
 * static column on desktop; consumers can drop it into a sheet/drawer
 * on smaller screens using the same markup.
 */
export function Sidebar({ className, onNavigate }: SidebarProps) {
  return (
    <nav
      aria-label="Subjects"
      className={cn(
        "flex h-full w-full flex-col gap-6 border-r border-line px-5 py-8 dark:border-line-dark",
        className
      )}
    >
      <div>
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft dark:text-bone-soft">
          Subjects
        </p>
        <ul className="flex flex-col gap-1">
          {subjects.map((subject) => (
            <li key={subject.slug}>
              <Link
                href={`/dashboard/${subject.slug}`}
                onClick={onNavigate}
                className="group flex items-center gap-3 rounded-md px-2.5 py-2 text-sm text-ink-soft transition-colors hover:bg-ink/[0.04] hover:text-ink dark:text-bone-soft dark:hover:bg-bone/[0.06] dark:hover:text-bone"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-1.5 w-1.5 shrink-0 rounded-full",
                    subjectDot[subject.slug]
                  )}
                />
                {subject.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto rounded-card border border-dashed border-ink/15 p-4 dark:border-bone/20">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft dark:text-bone-soft">
          Status
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
          Simulations are in development. Subject pages will light up as
          each one ships.
        </p>
      </div>
    </nav>
  );
}
