"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { FollowAProcess } from "./components/follow-a-process";
import { ProcessInspector } from "./components/process-inspector";
import { ContextSwitchLab } from "./components/context-switch-lab";
import { IoWaitLab } from "./components/io-wait-lab";
import { IdentifyState } from "./components/identify-state";
import { PROCESS_MANAGEMENT_DISCLAIMER } from "./model";

type LabMode = "follow" | "inspector" | "context-switch" | "io-wait" | "identify";

const LAB_MODES: { id: LabMode; label: string; blurb: string }[] = [
  {
    id: "follow",
    label: "Follow a Process",
    blurb: "Manually advance one process through New → Ready → Running → Waiting/Blocked → Terminated.",
  },
  {
    id: "inspector",
    label: "Process Inspector",
    blurb: "Several processes exist at once — click one to inspect its simplified conceptual PCB.",
  },
  {
    id: "context-switch",
    label: "Context Switch Lab",
    blurb: "Step through the OS saving one process's context and loading another's.",
  },
  {
    id: "io-wait",
    label: "I/O Wait Lab",
    blurb: "Watch a process block on I/O while another process gets a turn on the CPU.",
  },
  {
    id: "identify",
    label: "Identify the State",
    blurb: "Quick-fire: read a short situation and name the lifecycle state it describes.",
  },
];

export function ProcessManagementSimulator() {
  const [mode, setMode] = useState<LabMode>("follow");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Process Management Laboratory mode">
        {LAB_MODES.map((m) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={mode === m.id}
            onClick={() => setMode(m.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              mode === m.id
                ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>
      <p className="text-sm text-ink-soft dark:text-bone-soft">{LAB_MODES.find((m) => m.id === mode)!.blurb}</p>

      <div className="rounded-card border border-line bg-paper p-3 dark:border-line-dark dark:bg-chalkboard sm:p-5">
        {mode === "follow" && <FollowAProcess />}
        {mode === "inspector" && <ProcessInspector />}
        {mode === "context-switch" && <ContextSwitchLab />}
        {mode === "io-wait" && <IoWaitLab />}
        {mode === "identify" && <IdentifyState />}
      </div>

      <p className="text-xs text-ink-soft dark:text-bone-soft">{PROCESS_MANAGEMENT_DISCLAIMER}</p>
    </div>
  );
}
