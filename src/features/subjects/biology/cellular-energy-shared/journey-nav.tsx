"use client";

import Link from "next/link";
import { ArrowRight, BatteryCharging, FlaskConical, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";

export type EnergyLab = "intro" | "atp" | "respiration";

const STEPS: { id: EnergyLab; href: string; title: string; goal: string; icon: React.ReactNode }[] = [
  { id: "intro", href: "/dashboard/biology/cellular-energy", title: "1 · Introduction to Cellular Energy", goal: "How cells transform and use energy", icon: <Sprout className="h-4 w-4" aria-hidden="true" /> },
  { id: "atp", href: "/dashboard/biology/atp-energy-release", title: "2 · ATP & Energy Release", goal: "ATP structure, hydrolysis and coupling", icon: <BatteryCharging className="h-4 w-4" aria-hidden="true" /> },
  { id: "respiration", href: "/dashboard/biology/cellular-respiration", title: "3 · Cellular Respiration", goal: "How glucose energy is captured in ATP", icon: <FlaskConical className="h-4 w-4" aria-hidden="true" /> },
];

/** The three-lab learning sequence. The current lab is marked; the others are plain links. */
export function JourneyNav({ current, className }: { current: EnergyLab; className?: string }) {
  return (
    <nav aria-label="Cellular energy learning sequence" className={cn("grid gap-2 sm:grid-cols-3", className)} data-testid="journey-nav">
      {STEPS.map((s) => {
        const on = s.id === current;
        const body = (
          <>
            <span className="flex items-center gap-1.5 text-sm font-semibold">
              {s.icon}
              {s.title}
            </span>
            <span className="mt-0.5 block text-xs text-ink-soft dark:text-bone-soft">{s.goal}</span>
          </>
        );
        const base = "block rounded-xl border px-3 py-2 min-h-11";
        return on ? (
          <div key={s.id} aria-current="page" className={cn(base, "border-subject-biology bg-subject-biology-soft text-ink dark:bg-subject-biology/15 dark:text-bone")}>
            {body}
          </div>
        ) : (
          <Link key={s.id} href={s.href} data-testid={`journey-${s.id}`} className={cn(base, "border-line text-ink hover:border-subject-biology focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink dark:border-line-dark dark:text-bone dark:focus-visible:outline-bone")}>
            {body}
          </Link>
        );
      })}
    </nav>
  );
}

/** One contextual link ("Next: …") used inside a lab's explanation. */
export function LabLink({ href, children, testId }: { href: string; children: React.ReactNode; testId?: string }) {
  return (
    <Link href={href} data-testid={testId} className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-subject-biology px-3 text-sm font-semibold text-subject-biology hover:bg-subject-biology-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink dark:hover:bg-subject-biology/10 dark:focus-visible:outline-bone">
      {children}
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}
