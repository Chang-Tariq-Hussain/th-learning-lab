"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CoffmanConditionsLab } from "./components/coffman-conditions-lab";
import { ResourceGraphLab } from "./components/resource-graph-lab";
import { DeadlockCreationLab } from "./components/deadlock-creation-lab";
import { BankersAlgorithmLab } from "./components/bankers-algorithm-lab";
import { PreventionLab } from "./components/prevention-lab";
import { DetectionRecoveryLab } from "./components/detection-recovery-lab";

type TabMode = "beginner" | "graph" | "creation" | "bankers" | "prevention" | "detection";

const TABS: { id: TabMode; label: string; blurb: string }[] = [
  {
    id: "beginner",
    label: "Beginner",
    blurb: "The minimal two-process deadlock, and the four Coffman conditions it depends on — toggle any one off.",
  },
  {
    id: "graph",
    label: "Resource Graph",
    blurb: "Build your own Resource Allocation Graph: add processes and resources, request, allocate, and release.",
  },
  {
    id: "creation",
    label: "Deadlock Lab",
    blurb: "Watch a deadlock form one action at a time, then reset and try a different order.",
  },
  {
    id: "bankers",
    label: "Safety Analysis",
    blurb: "Safe vs unsafe vs deadlocked, the Banker's Algorithm safety check, and the resource request experiment.",
  },
  {
    id: "prevention",
    label: "Prevention",
    blurb: "Experiment with breaking each of the four necessary conditions.",
  },
  {
    id: "detection",
    label: "Detection & Recovery",
    blurb: "Run the detection algorithm on a live scenario, then try terminating or preempting to recover.",
  },
];

/**
 * The "Operating Systems Deadlock Laboratory" — 2D/2.5D throughout,
 * same convention as the Paging Simulator: deadlocks are a relational,
 * graph-shaped concept, so plain SVG communicates it more clearly than
 * 3D hardware would. All simulation arithmetic lives in `model.ts` as
 * pure functions; nothing here calls a server, and no simulation data
 * is held outside this tree's own React state.
 */
export function DeadlockSimulator() {
  const [tab, setTab] = useState<TabMode>("beginner");
  const activeTab = TABS.find((t) => t.id === tab)!;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Deadlock Laboratory mode">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              tab === t.id
                ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p className="text-sm text-ink-soft dark:text-bone-soft">{activeTab.blurb}</p>

      <div className="rounded-card border border-line bg-paper p-3 dark:border-line-dark dark:bg-chalkboard sm:p-5">
        {tab === "beginner" && <CoffmanConditionsLab />}
        {tab === "graph" && <ResourceGraphLab />}
        {tab === "creation" && <DeadlockCreationLab />}
        {tab === "bankers" && <BankersAlgorithmLab />}
        {tab === "prevention" && <PreventionLab />}
        {tab === "detection" && <DetectionRecoveryLab />}
      </div>

      <p className="text-xs text-ink-soft dark:text-bone-soft">
        A deadlock is not the same thing as starvation: a starved process is repeatedly passed over but can still eventually
        run, while a deadlocked process can never run again without outside intervention. It is also not the same as
        livelock, where processes keep changing state in response to each other without ever making progress — busy, but
        stuck all the same.
      </p>
    </div>
  );
}
