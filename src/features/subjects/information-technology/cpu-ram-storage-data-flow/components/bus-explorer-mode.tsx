"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { BUS_WALKTHROUGHS, type ComponentId } from "../model";
import { FlowLayout } from "./flow-layout";
import { InspectPanel } from "./inspect-panel";

export function BusExplorerMode() {
  const [selected, setSelected] = useState(0);
  const [inspected, setInspected] = useState<ComponentId | null>(null);
  const [running, setRunning] = useState(false);

  const walkthrough = BUS_WALKTHROUGHS[selected]!;

  return (
    <div className="flex flex-col gap-6">
      <FlowLayout
        stageLabel="CPU, cache, RAM and storage diagram"
        runState={running ? "running" : "idle"}
        statusDetail={running ? walkthrough.title : undefined}
        diagram={{
          activeComponents: running ? walkthrough.example.activeComponents : [],
          from: running ? walkthrough.example.from : undefined,
          to: running ? walkthrough.example.to : undefined,
          packetLabel: running ? walkthrough.example.packetLabel : undefined,
          busSignal: running ? walkthrough.example.busSignal : undefined,
          stepKey: `${walkthrough.bus}-${running}`,
          inspectedId: inspected,
          onInspect: setInspected,
        }}
        actions={
          <button
            onClick={() => setRunning((r) => !r)}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-subject-it px-5 text-sm font-medium text-paper hover:opacity-90"
          >
            {running ? "Hide example" : "Show example"}
          </button>
        }
        explanation={{
          activeLabel: running ? walkthrough.title : undefined,
          text: running ? walkthrough.example.explanation : undefined,
          idleText: `Press "Show example" to see a real ${walkthrough.title.toLowerCase()} signal in context.`,
        }}
        controls={
          <div className="grid gap-3 sm:grid-cols-3">
            {BUS_WALKTHROUGHS.map((w, i) => (
              <button
                key={w.bus}
                onClick={() => {
                  setSelected(i);
                  setRunning(false);
                }}
                className={cn(
                  "min-h-11 rounded-card border p-3 text-left transition-colors",
                  i === selected
                    ? "border-subject-it bg-subject-it-soft dark:bg-subject-it/20"
                    : "border-line hover:border-ink/30 dark:border-line-dark dark:hover:border-bone/30"
                )}
              >
                <p className={cn("font-mono text-xs uppercase tracking-wide", i === selected ? "text-subject-it" : "text-ink-soft dark:text-bone-soft")}>
                  {w.title}
                </p>
                <p className="mt-1 text-sm text-ink dark:text-bone">{w.description}</p>
              </button>
            ))}
          </div>
        }
        below={<InspectPanel id={inspected} />}
      />
    </div>
  );
}
