"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ISOLATION_FRAME_COUNT, ISOLATION_NOTE, ISOLATION_PROCESSES } from "../model";

/**
 * Brief §16: a deliberately small demonstration that page 0 of one
 * process and page 0 of another are different pages, mapped through
 * different page tables, into different frames. Scoped to that single
 * point — this is not a security simulator, and it says so.
 */
export function ProcessIsolationLab() {
  const [selected, setSelected] = useState<{ processId: string; page: number } | null>(null);

  const selectedProcess = ISOLATION_PROCESSES.find((p) => p.id === selected?.processId);
  const selectedMapping = selectedProcess?.mapping.find((m) => m.page === selected?.page);
  const frameOwners = new Map<number, { name: string; color: string; page: number }>();
  for (const process of ISOLATION_PROCESSES) {
    for (const mapping of process.mapping) {
      frameOwners.set(mapping.frame, { name: process.name, color: process.color, page: mapping.page });
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-ink-soft dark:text-bone-soft">
        Both processes below have a page 0 and a page 1. Tap any of them and follow the arrow: the same page number lands in a
        completely different frame depending on whose page table did the translating.
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto_1fr]">
        <div className="flex flex-col gap-4">
          {ISOLATION_PROCESSES.map((process) => (
            <section key={process.id} className="rounded-card border border-line p-4 dark:border-line-dark">
              <h3 className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: process.color }}>
                <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: process.color }} aria-hidden />
                {process.name} · own page table
              </h3>
              <ul className="mt-3 flex flex-col gap-1.5">
                {process.mapping.map((mapping) => {
                  const active = selected?.processId === process.id && selected.page === mapping.page;
                  return (
                    <li key={mapping.page}>
                      <button
                        onClick={() => setSelected(active ? null : { processId: process.id, page: mapping.page })}
                        aria-pressed={active}
                        className={cn(
                          "flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left transition-colors",
                          active ? "bg-subject-it-soft dark:bg-subject-it/20" : "border-line dark:border-line-dark",
                        )}
                        style={active ? { borderColor: process.color } : undefined}
                      >
                        <span className="font-mono text-xs font-semibold text-ink dark:text-bone">
                          Virtual Page {mapping.page}
                        </span>
                        <span className="font-mono text-[11px] text-ink-soft dark:text-bone-soft">→ frame {mapping.frame}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>

        <div className="hidden items-center justify-center lg:flex" aria-hidden>
          <ArrowRight className="h-4 w-4 text-ink-soft dark:text-bone-soft" />
        </div>

        <section aria-label="Shared physical RAM" className="rounded-card border border-line p-4 dark:border-line-dark">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-subject-it">Shared Physical RAM</h3>
          <ul className="mt-3 flex flex-col gap-1.5">
            {Array.from({ length: ISOLATION_FRAME_COUNT }, (_, frameIndex) => {
              const owner = frameOwners.get(frameIndex);
              const active = selectedMapping?.frame === frameIndex;
              return (
                <li
                  key={frameIndex}
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-lg border px-3 py-2",
                    owner ? "border-line dark:border-line-dark" : "border-dashed border-line dark:border-line-dark",
                  )}
                  style={active ? { borderColor: selectedProcess?.color, backgroundColor: `${selectedProcess?.color}1A` } : undefined}
                >
                  <span className="font-mono text-xs font-semibold text-ink dark:text-bone">Frame {frameIndex}</span>
                  <span className="font-mono text-[11px] text-ink-soft dark:text-bone-soft">
                    {owner ? `${owner.name} · page ${owner.page}` : "free"}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <div className="rounded-card border border-dashed border-line px-4 py-3 dark:border-line-dark">
        {selectedProcess && selectedMapping ? (
          <p className="text-sm leading-relaxed text-ink dark:text-bone">
            <span className="font-mono font-semibold" style={{ color: selectedProcess.color }}>
              {selectedProcess.name}
            </span>{" "}
            page {selectedMapping.page} → frame {selectedMapping.frame}. The other process&apos;s page {selectedMapping.page}{" "}
            maps somewhere else entirely, so neither process can reach the other&apos;s memory just by using the same page
            number. Per-process page tables are what makes that true.
          </p>
        ) : (
          <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{ISOLATION_NOTE}</p>
        )}
      </div>

      <p className="text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
        This connects paging to process isolation, and stops there. Real memory protection also depends on protection bits and
        hardware enforcement working together with these mappings — paging alone is not a complete security mechanism.
      </p>
    </div>
  );
}
