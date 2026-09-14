"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { MEMORY_CELLS, buildMemoryAccessSteps, type ComponentId, type MemoryOperation } from "../model";
import { useStepPlayer } from "../hooks/use-step-player";
import { SystemDiagram } from "./system-diagram";
import { PlaybackControls } from "./playback-controls";
import { ExplanationPanel } from "./explanation-panel";
import { InspectPanel } from "./inspect-panel";

export function MemoryAccessMode() {
  const [selectedAddress, setSelectedAddress] = useState(MEMORY_CELLS[0]!.address);
  const [operation, setOperation] = useState<MemoryOperation>("read");
  const [inspected, setInspected] = useState<ComponentId | null>(null);

  const cell = MEMORY_CELLS.find((c) => c.address === selectedAddress)!;
  const steps = useMemo(() => buildMemoryAccessSteps(cell, operation), [cell, operation]);
  const player = useStepPlayer(steps);
  const step = player.step;

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-ink-soft dark:text-bone-soft">
        RAM is organized into addressable locations — each one holds either an instruction or a data value. Click a row to
        select it, choose Read or Write, then press Start to watch the CPU access it.
      </p>

      <div className="overflow-x-auto rounded-card border border-line dark:border-line-dark">
        <table className="w-full min-w-[420px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-ink/[0.03] text-left font-mono text-xs uppercase tracking-wide text-ink-soft dark:border-line-dark dark:bg-bone/[0.05] dark:text-bone-soft">
              <th className="px-4 py-2">Address</th>
              <th className="px-4 py-2">Kind</th>
              <th className="px-4 py-2">Data</th>
              <th className="px-4 py-2">Meaning</th>
            </tr>
          </thead>
          <tbody>
            {MEMORY_CELLS.map((row) => (
              <tr
                key={row.address}
                onClick={() => setSelectedAddress(row.address)}
                className={cn(
                  "cursor-pointer border-b border-line/60 last:border-0 dark:border-line-dark/60",
                  row.address === selectedAddress ? "bg-subject-it-soft dark:bg-subject-it/15" : "hover:bg-ink/[0.03] dark:hover:bg-bone/[0.05]"
                )}
              >
                <td className="px-4 py-2 font-mono">{row.address}</td>
                <td className="px-4 py-2 capitalize">{row.kind}</td>
                <td className="px-4 py-2 font-mono">{row.value}</td>
                <td className="px-4 py-2 text-ink-soft dark:text-bone-soft">{row.label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-2" role="tablist" aria-label="Memory operation">
        {(["read", "write"] as MemoryOperation[]).map((op) => (
          <button
            key={op}
            role="tab"
            aria-selected={operation === op}
            onClick={() => setOperation(op)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium capitalize transition-colors",
              operation === op
                ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30"
            )}
          >
            {op}
          </button>
        ))}
      </div>

      <div className="rounded-card border border-line bg-paper p-2 dark:border-line-dark dark:bg-chalkboard sm:p-4">
        <SystemDiagram
          activeComponents={step?.activeComponents ?? []}
          from={step?.from}
          to={step?.to}
          packetLabel={step?.packetLabel}
          busSignal={step?.busSignal}
          stepKey={step?.id ?? "idle"}
          inspectedId={inspected}
          onInspect={setInspected}
        />
        <div className="mt-3">
          <ExplanationPanel
            activeLabel={step ? `Step ${player.stepIndex + 1} of ${steps.length}` : undefined}
            explanation={step?.explanation}
            idleText={`Press Start to watch a ${operation} of address ${selectedAddress}.`}
          />
        </div>
      </div>

      <PlaybackControls player={player} />
      <InspectPanel id={inspected} />
    </div>
  );
}
