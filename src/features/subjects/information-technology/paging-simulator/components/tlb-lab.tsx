"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { TLB_CAPACITY, TLB_NOTE, createTlb, tlbAccess, type MachineState, type TlbState } from "../model";

interface TlbLabProps {
  machine: MachineState;
}

/**
 * Brief §15: the TLB as an advanced concept, kept to hit/miss
 * behaviour and the count of page table lookups it avoids — not a
 * hardware-level CPU model. The cached rows show a page number and a
 * frame number only, never page contents, because that distinction is
 * the single most commonly muddled thing about a TLB (see `TLB_NOTE`).
 *
 * This lab reads the page table but never writes it: it holds only
 * its own small `TlbState`, so experimenting here cannot disturb the
 * demand-paging experiment on another tab.
 */
export function TlbLab({ machine }: TlbLabProps) {
  const [tlb, setTlb] = useState<TlbState>(createTlb);
  const [narrative, setNarrative] = useState<string[]>([]);
  const [lastHit, setLastHit] = useState<boolean | null>(null);

  const access = (page: number) => {
    const result = tlbAccess(tlb, page, machine.entries);
    setTlb(result.next);
    setNarrative(result.narrative);
    setLastHit(result.hit);
  };

  const total = tlb.hits + tlb.misses;
  const hitRate = total === 0 ? 0 : tlb.hits / total;

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-ink-soft dark:text-bone-soft">
        Every translation needs a page table lookup, and that lookup is itself a memory access. The TLB is a small cache of
        recent translations that lets the hardware skip it. Access the same page twice in a row and watch what changes.
      </p>

      <div className="rounded-card border border-line p-4 dark:border-line-dark">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">
          Translate a page — tap the same one twice to see a hit
        </p>
        <div className="flex flex-wrap gap-1.5">
          {machine.entries.map((entry) => (
            <button
              key={entry.page}
              onClick={() => access(entry.page)}
              className={cn(
                "min-w-[62px] rounded-lg border px-3 py-2 text-center",
                tlb.entries.some((e) => e.page === entry.page)
                  ? "border-subject-it bg-subject-it-soft dark:bg-subject-it/20"
                  : "border-line dark:border-line-dark",
              )}
            >
              <span className="block font-mono text-xs font-semibold text-ink dark:text-bone">Page {entry.page}</span>
              <span className="block font-mono text-[9px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">
                {tlb.entries.some((e) => e.page === entry.page) ? "in TLB" : entry.present ? "in RAM" : "not in RAM"}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <section aria-label="TLB contents" className="rounded-card border border-line p-4 dark:border-line-dark">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-subject-it">
            TLB · {tlb.entries.length}/{TLB_CAPACITY} cached translations
          </h3>
          <table className="mt-3 w-full border-collapse text-left font-mono text-xs">
            <thead>
              <tr className="bg-ink/[0.04] dark:bg-bone/[0.06]">
                <th scope="col" className="px-2 py-1.5 text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Page</th>
                <th scope="col" className="px-2 py-1.5 text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Frame</th>
              </tr>
            </thead>
            <tbody>
              {tlb.entries.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-2 py-3 text-ink-soft dark:text-bone-soft">TLB is empty — every access will miss.</td>
                </tr>
              ) : (
                [...tlb.entries]
                  .sort((a, b) => b.usedAt - a.usedAt)
                  .map((entry) => (
                    <tr key={entry.page} className="border-t border-line dark:border-line-dark">
                      <td className="px-2 py-1.5 text-ink dark:text-bone">{entry.page}</td>
                      <td className="px-2 py-1.5 text-ink dark:text-bone">{entry.frame}</td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
          <p className="mt-3 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">{TLB_NOTE}</p>
        </section>

        <section aria-label="Translation path" className="flex flex-col gap-3">
          <div
            className={cn(
              "min-h-[140px] rounded-card border p-4",
              lastHit === true
                ? "border-subject-it/60 bg-subject-it-soft/40 dark:bg-subject-it/10"
                : lastHit === false
                  ? "border-amber-500/50 bg-amber-500/5"
                  : "border-line dark:border-line-dark",
            )}
          >
            {narrative.length > 0 ? (
              <>
                <p className="font-mono text-[11px] uppercase tracking-wide text-subject-it">
                  {lastHit ? "TLB hit — page table skipped" : "TLB miss — page table consulted"}
                </p>
                <ol className="mt-2 flex flex-col gap-1.5">
                  {narrative.map((line, i) => (
                    <li key={i} className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
                      <span className="font-mono text-[10px] text-subject-it">{i + 1}. </span>
                      {line}
                    </li>
                  ))}
                </ol>
              </>
            ) : (
              <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
                CPU → TLB lookup → hit? → frame. On a miss, the page table is consulted instead, and the translation it
                produces is then cached in the TLB.
              </p>
            )}
          </div>

          <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { label: "TLB hits", value: tlb.hits },
              { label: "TLB misses", value: tlb.misses },
              { label: "Page table lookups", value: tlb.pageTableLookups },
              { label: "Hit rate", value: `${Math.round(hitRate * 100)}%` },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border border-line px-3 py-2 dark:border-line-dark">
                <dt className="font-mono text-[9px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">{stat.label}</dt>
                <dd className="font-mono text-base font-semibold text-ink dark:text-bone">{stat.value}</dd>
              </div>
            ))}
          </dl>

          <button
            onClick={() => {
              setTlb(createTlb());
              setNarrative([]);
              setLastHit(null);
            }}
            className="inline-flex h-9 w-fit items-center gap-1.5 rounded-full border border-line px-4 text-xs font-medium text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset TLB
          </button>
          <p className="text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
            Notice the page table lookup counter only rises on a miss. That gap between total accesses and page table lookups
            is the entire benefit of the TLB.
          </p>
        </section>
      </div>
    </div>
  );
}
