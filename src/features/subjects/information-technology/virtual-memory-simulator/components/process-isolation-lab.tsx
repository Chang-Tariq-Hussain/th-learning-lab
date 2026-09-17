"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ISOLATION_NOTE, type SimProcess } from "../model";

interface ProcessIsolationLabProps {
  processes: SimProcess[];
}

type AttemptResult = { allowed: boolean; message: string } | null;

/**
 * The most important learning outcome in this simulator, given its
 * own dedicated tab: two processes can use the identical virtual
 * address value while it refers to entirely different underlying
 * memory, and a process attempting to reach into another process's
 * address space is conceptually denied.
 */
export function ProcessIsolationLab({ processes }: ProcessIsolationLabProps) {
  const [result, setResult] = useState<AttemptResult>(null);
  const [processA, processB] = processes;
  if (!processA || !processB) return null;

  const tryOwnAddress = () => {
    setResult({
      allowed: true,
      message: `${processA.name} accesses its own virtual address ${processA.isolationVirtualAddress} — allowed. It's translated to memory that actually belongs to ${processA.name}.`,
    });
  };

  const tryOtherAddress = () => {
    setResult({
      allowed: false,
      message: `${processA.name} attempts to reach into ${processB.name}'s address space at ${processB.isolationVirtualAddress} — denied. ${processA.name} has no mapping to ${processB.name}'s memory at all.`,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-ink-soft dark:text-bone-soft">
        Both processes below happen to use the exact same-looking virtual address, <span className="font-mono">{processA.isolationVirtualAddress}</span>. Watch what that address actually refers to for each one.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {[processA, processB].map((p) => (
          <div key={p.id} className="rounded-card border border-line p-4 dark:border-line-dark">
            <p className="flex items-center gap-2 text-sm font-medium text-ink dark:text-bone">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: p.color }} /> {p.name}
            </p>
            <p className="mt-2 font-mono text-sm text-ink dark:text-bone">Virtual address {p.isolationVirtualAddress}</p>
            <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">
              Refers to memory that belongs only to {p.name} — even though {processA === p ? processB.name : processA.name} uses the same-looking address for something completely different.
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-card border border-line p-4 dark:border-line-dark">
        <p className="mb-3 text-sm font-medium text-ink dark:text-bone">Access attempt experiment</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={tryOwnAddress}
            className="inline-flex h-9 items-center rounded-full bg-subject-it px-4 text-sm font-medium text-paper hover:opacity-90"
          >
            {processA.name}: access its own {processA.isolationVirtualAddress}
          </button>
          <button
            onClick={tryOtherAddress}
            className="inline-flex h-9 items-center rounded-full border border-line px-4 text-sm font-medium text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40"
          >
            {processA.name}: access {processB.name}&apos;s {processB.isolationVirtualAddress}
          </button>
        </div>

        {result && (
          <div
            className={cn(
              "mt-4 rounded-md border p-3 text-sm",
              result.allowed
                ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
                : "border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300",
            )}
          >
            <p className="font-medium">{result.allowed ? "Allowed" : "Access denied"}</p>
            <p className="mt-1">{result.message}</p>
          </div>
        )}
      </div>

      <p className="text-xs text-ink-soft dark:text-bone-soft">{ISOLATION_NOTE}</p>
    </div>
  );
}
