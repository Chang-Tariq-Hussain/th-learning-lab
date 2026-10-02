"use client";

import { cn } from "@/lib/utils";
import { Callout } from "../../osi-model-explorer/components/ui";
import type { DnsLab } from "../hooks/use-dns-lab";
import { SCENARIOS, type DetailLevel } from "../model";
import { RunSurface } from "./run-surface";

/** Six conceptual troubleshooting scenarios. Picking one sets up the resolver's cache and clock, then you run the lookup. */
export function ScenariosLab({ lab, level }: { lab: DnsLab; level: DetailLevel }) {
  const active = SCENARIOS.find((s) => s.id === lab.scenarioId) ?? null;
  const status = lab.runDone ? lab.run?.result.status : null;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3" role="group" aria-label="Troubleshooting scenarios">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => lab.loadScenario(s)}
            aria-pressed={active?.id === s.id}
            className={cn("min-h-[44px] rounded-card border p-3 text-left transition-colors", active?.id === s.id ? "border-subject-it bg-subject-it-soft/60 dark:bg-subject-it/15" : "border-line hover:border-ink/30 dark:border-line-dark dark:hover:border-bone/30")}
          >
            <span className="font-mono text-[10px] uppercase tracking-wide text-subject-it">Scenario {s.number}</span>
            <span className="mt-0.5 block font-display text-sm font-medium text-ink dark:text-bone">{s.title}</span>
            <span className="mt-0.5 block text-xs leading-relaxed text-ink-soft dark:text-bone-soft">{s.summary}</span>
          </button>
        ))}
      </div>

      {!active ? (
        <div className="rounded-card border border-dashed border-line p-4 text-sm text-ink-soft dark:border-line-dark dark:text-bone-soft">Choose a scenario above. It sets up the resolver&apos;s cache, then you press Start and watch what happens.</div>
      ) : (
        <>
          <div className="rounded-card border border-line bg-white/60 p-3.5 dark:border-line-dark dark:bg-white/[0.03]">
            <p className="font-display text-base font-medium text-ink dark:text-bone">
              Scenario {active.number}: {active.title}
            </p>
            <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">
              Looking up <span className="font-mono font-semibold text-ink dark:text-bone">{active.domain}</span>. <span className="font-semibold text-ink dark:text-bone">What to watch:</span> {active.watch}
            </p>
          </div>
          <RunSurface lab={lab} level={level} fault={active.fault} idleText="Press Start to run the scenario, or Next step to go one message at a time." />
          {status && (
            <Callout tone={status === "timeout" ? "warn" : status === "nxdomain" ? "bad" : "good"} title="What this shows">
              {active.lesson}
            </Callout>
          )}
        </>
      )}
    </div>
  );
}
