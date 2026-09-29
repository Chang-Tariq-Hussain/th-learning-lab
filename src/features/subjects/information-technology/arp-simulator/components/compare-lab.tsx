"use client";

import { cn } from "@/lib/utils";
import { Callout, Panel, SectionHeading } from "../../osi-model-explorer/components/ui";
import type { ArpLab } from "../hooks/use-arp-lab";
import type { DetailLevel } from "../model";
import { RunPanel } from "./run-panel";

const MISS = ["ARP Request", "ARP Reply", "Cache Update", "Send Data"];
const HIT = ["Cache Lookup", "MAC Found", "Send Data"];

function Flow({ title, items, active, tone }: { title: string; items: string[]; active: boolean; tone: "amber" | "emerald" }) {
  return (
    <div
      className={cn(
        "rounded-card border-2 p-4 transition-colors",
        active ? (tone === "amber" ? "border-amber-400 bg-amber-50 dark:border-amber-500/60 dark:bg-amber-500/10" : "border-emerald-400 bg-emerald-50 dark:border-emerald-500/60 dark:bg-emerald-500/10") : "border-line opacity-70 dark:border-line-dark",
      )}
    >
      <p className="font-mono text-xs font-semibold uppercase tracking-wide text-ink dark:text-bone">{title}</p>
      <ol className="mt-3 flex flex-col items-start gap-1">
        {items.map((it, i) => (
          <li key={it} className="flex flex-col items-start">
            <span className="rounded-lg border border-line bg-white/80 px-3 py-1.5 text-sm font-medium text-ink dark:border-line-dark dark:bg-white/[0.06] dark:text-bone">{it}</span>
            {i < items.length - 1 && <span className="pl-4 text-ink-soft dark:text-bone-soft" aria-hidden>↓</span>}
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Cache miss vs. cache hit, side by side, with a toggle that loads the matching live scenario. */
export function CompareLab({ lab, level }: { lab: ArpLab; level: DetailLevel }) {
  const isHit = lab.scenario === "hit";
  return (
    <div className="flex flex-col gap-5">
      <SectionHeading title="Cache miss vs. cache hit">
        The first message to an unfamiliar address needs ARP. Later messages find the answer in the cache. Toggle between the two and run each one.
      </SectionHeading>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Cache miss or cache hit">
        {([["first", "Cache miss"], ["hit", "Cache hit"]] as const).map(([id, label]) => (
          <button
            key={id}
            role="radio"
            aria-checked={lab.scenario === id}
            onClick={() => lab.setScenario(id)}
            className={cn(
              "min-h-[44px] rounded-full border px-5 py-2 text-sm font-medium transition-colors",
              lab.scenario === id ? "border-subject-it bg-subject-it text-paper" : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Flow title="Cache miss" items={MISS} active={!isHit} tone="amber" />
        <Flow title="Cache hit" items={HIT} active={isHit} tone="emerald" />
      </div>
      <Callout tone="neutral" title="Why not ARP every time?">
        A broadcast interrupts every device on the LAN and adds a delay. Remembering the answer in the ARP cache means ARP is only needed the first time — until the entry is cleared or (in real systems) ages out.
      </Callout>
      <Panel title="Run it">
        <RunPanel lab={lab} level={level} scenarios={["first", "hit"]} />
      </Panel>
    </div>
  );
}
