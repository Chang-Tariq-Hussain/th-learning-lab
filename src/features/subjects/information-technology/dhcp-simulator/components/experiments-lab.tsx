"use client";

import { cn } from "@/lib/utils";
import { Callout, SectionHeading } from "../../osi-model-explorer/components/ui";
import type { DhcpLab } from "../hooks/use-dhcp-lab";
import { EXPERIMENTS, type Experiment } from "../model";
import { ActionButton, Collapsible } from "./parts";

/** Sticky reminder of the running experiment, with a live check of the student's own lab. */
export function ExperimentBanner({ exp, lab, onClose }: { exp: Experiment; lab: DhcpLab; onClose: () => void }) {
  const done = exp.check(lab.saved);
  return (
    <div className={cn("rounded-card border-2 p-3.5", done ? "border-emerald-500/70 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10" : "border-subject-it bg-subject-it-soft dark:bg-subject-it/15")} aria-live="polite">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Experiment in progress</p>
          <p className="text-sm font-semibold text-ink dark:text-bone">{exp.title}</p>
          <p className="mt-1 text-sm text-ink dark:text-bone">{exp.task}</p>
          <p className={cn("mt-2 text-sm font-semibold", done ? "text-emerald-700 dark:text-emerald-300" : "text-ink-soft dark:text-bone-soft")}>{done ? `✔ Goal reached: ${exp.goal}` : `Goal: ${exp.goal}`}</p>
          {done && <p className="mt-1 text-sm text-ink dark:text-bone">{exp.observation} {exp.explanation}</p>}
        </div>
        <ActionButton onClick={onClose}>Close</ActionButton>
      </div>
    </div>
  );
}

export function ExperimentsLab({ lab, active, onStart }: { lab: DhcpLab; active: string | null; onStart: (exp: Experiment) => void }) {
  return (
    <div className="flex flex-col gap-5">
      <SectionHeading title="Guided experiments">
        Each experiment sets the lab up for you, gives you a task and then checks your own result. Press Start, do the task in the tab it opens, and watch for the goal check.
      </SectionHeading>
      <ol className="flex flex-col gap-4">
        {EXPERIMENTS.map((e) => {
          const isActive = active === e.id;
          const done = isActive && e.check(lab.saved);
          return (
            <li key={e.id} className={cn("flex flex-col gap-3 rounded-card border p-4", isActive ? "border-subject-it" : "border-line dark:border-line-dark")}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="font-display text-lg font-medium text-ink dark:text-bone">{e.title}</h3>
                {done && <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-semibold text-paper">✔ Goal reached</span>}
              </div>
              <p className="text-sm text-ink dark:text-bone">{e.objective}</p>
              <dl className="grid gap-1 text-sm sm:grid-cols-[8rem_1fr]">
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-soft dark:text-bone-soft">Starting state</dt>
                <dd className="text-ink dark:text-bone">{e.startingState}</dd>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-soft dark:text-bone-soft">Your task</dt>
                <dd className="text-ink dark:text-bone">{e.task}</dd>
              </dl>
              <div className="flex flex-wrap gap-2">
                <ActionButton tone="primary" onClick={() => onStart(e)}>
                  {isActive ? "Restart experiment" : "Start experiment"} → {e.goToLabel}
                </ActionButton>
              </div>
              <Collapsible title="Hint, what you should see, and why" defaultOpen={done}>
                <p className="text-sm text-ink dark:text-bone">
                  <span className="font-semibold">Hint: </span>
                  {e.hint}
                </p>
                <p className="mt-2 text-sm text-ink dark:text-bone">
                  <span className="font-semibold">What you should see: </span>
                  {e.observation}
                </p>
                <p className="mt-2 text-sm text-ink-soft dark:text-bone-soft">{e.explanation}</p>
              </Collapsible>
            </li>
          );
        })}
      </ol>
      <Callout tone="neutral" title="Scope note">
        Everything here happens on one LAN. DHCP relay agents, which let a server answer clients on other subnets, exist in real networks but are not simulated.
      </Callout>
    </div>
  );
}
