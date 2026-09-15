"use client";

import { Plus, RotateCcw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SimProcess } from "../model";

const MAX_PROCESSES = 6;
const MIN_PROCESSES = 2;

export interface ProcessEditorProps {
  processes: SimProcess[];
  onChange: (processes: SimProcess[]) => void;
  onResetToDefault: () => void;
  showPriority: boolean;
  className?: string;
}

function nextProcessId(processes: SimProcess[]): string {
  let n = processes.length + 1;
  const used = new Set(processes.map((p) => p.id));
  while (used.has(`P${n}`)) n += 1;
  return `P${n}`;
}

function clampField(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, Math.round(value)));
}

/**
 * A small, bounded (2-6 process) table students can edit directly —
 * arrival time, burst time, and priority — that backs the "build your
 * own process set" interactive experiment. Kept deliberately simple
 * (plain number inputs, no drag-and-drop) so the cognitive load stays
 * on scheduling, not on the editor itself.
 */
export function ProcessEditor({ processes, onChange, onResetToDefault, showPriority, className }: ProcessEditorProps) {
  const updateProcess = (id: string, patch: Partial<SimProcess>) => {
    onChange(processes.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const addProcess = () => {
    if (processes.length >= MAX_PROCESSES) return;
    const id = nextProcessId(processes);
    onChange([...processes, { id, arrivalTime: 0, burstTime: 4, priority: 3 }]);
  };

  const removeProcess = (id: string) => {
    if (processes.length <= MIN_PROCESSES) return;
    onChange(processes.filter((p) => p.id !== id));
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-ink dark:text-bone">Process Set</p>
        <div className="flex items-center gap-2">
          <button
            onClick={onResetToDefault}
            className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line px-3 text-xs font-medium text-ink-soft hover:border-ink/40 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/40"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
          <button
            onClick={addProcess}
            disabled={processes.length >= MAX_PROCESSES}
            className="inline-flex h-8 items-center gap-1.5 rounded-full bg-subject-it px-3 text-xs font-medium text-paper hover:opacity-90 disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Process
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-card border border-line dark:border-line-dark">
        <table className="w-full min-w-[440px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-ink/[0.03] text-left text-xs uppercase tracking-wide text-ink-soft dark:border-line-dark dark:bg-bone/[0.05] dark:text-bone-soft">
              <th className="px-3 py-2 font-medium">Process</th>
              <th className="px-3 py-2 font-medium">Arrival</th>
              <th className="px-3 py-2 font-medium">Burst</th>
              {showPriority && <th className="px-3 py-2 font-medium">Priority</th>}
              <th className="px-3 py-2 font-medium sr-only">Remove</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-0 dark:border-line-dark">
                <td className="px-3 py-2 font-mono font-medium text-subject-it">{p.id}</td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={p.arrivalTime}
                    onChange={(e) => updateProcess(p.id, { arrivalTime: clampField(Number(e.target.value), 0, 30) })}
                    aria-label={`${p.id} arrival time`}
                    className="h-8 w-16 rounded-md border border-line bg-paper px-2 text-ink dark:border-line-dark dark:bg-chalkboard dark:text-bone"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={p.burstTime}
                    onChange={(e) => updateProcess(p.id, { burstTime: clampField(Number(e.target.value), 1, 20) })}
                    aria-label={`${p.id} burst time`}
                    className="h-8 w-16 rounded-md border border-line bg-paper px-2 text-ink dark:border-line-dark dark:bg-chalkboard dark:text-bone"
                  />
                </td>
                {showPriority && (
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min={1}
                      max={9}
                      value={p.priority}
                      onChange={(e) => updateProcess(p.id, { priority: clampField(Number(e.target.value), 1, 9) })}
                      aria-label={`${p.id} priority`}
                      className="h-8 w-16 rounded-md border border-line bg-paper px-2 text-ink dark:border-line-dark dark:bg-chalkboard dark:text-bone"
                    />
                  </td>
                )}
                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => removeProcess(p.id)}
                    disabled={processes.length <= MIN_PROCESSES}
                    aria-label={`Remove ${p.id}`}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full text-ink-soft hover:bg-ink/[0.06] disabled:opacity-30 dark:text-bone-soft dark:hover:bg-bone/[0.08]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-ink-soft dark:text-bone-soft">
        Arrival and burst are in simple time units (not real seconds).
        {showPriority && " Lower priority number = higher priority (Priority 1 runs before Priority 5)."}
      </p>
    </div>
  );
}
