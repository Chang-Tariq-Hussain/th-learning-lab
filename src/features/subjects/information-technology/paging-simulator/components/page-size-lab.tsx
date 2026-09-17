"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  ILLUSTRATIVE_ADDRESS_BITS,
  INTERNAL_FRAGMENTATION_NOTE,
  PAGE_SIZE_KB_OPTIONS,
  PAGE_SIZE_TRADEOFFS,
  analyzePageSize,
} from "../model";

/**
 * Brief §13 and §14 together, because they are the same experiment
 * seen from two angles: changing the page size changes how many pages
 * a program needs, how wide the offset field is, how many entries a
 * page table would need — and how much of the last page goes unused.
 *
 * All of it is derived arithmetic (`analyzePageSize`), so this holds
 * only two numbers in state and recomputes on demand rather than
 * storing a table of results.
 */
export function PageSizeLab() {
  const [pageSizeKB, setPageSizeKB] = useState(4);
  const [processSizeKB, setProcessSizeKB] = useState(10);

  const analysis = useMemo(() => analyzePageSize(pageSizeKB, processSizeKB), [pageSizeKB, processSizeKB]);
  const lastPageUsedKB = processSizeKB - (analysis.pagesNeeded - 1) * pageSizeKB;

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-ink-soft dark:text-bone-soft">
        Paging hands out whole pages, never partial ones. Change the page size and the program size below, and watch what
        that does to the number of pages, the address breakdown, and the space wasted inside the final page.
      </p>

      {/* ---------------- Controls ---------------- */}
      <div className="rounded-card border border-line p-4 dark:border-line-dark">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Page size</span>
            <div className="flex flex-wrap gap-1">
              {PAGE_SIZE_KB_OPTIONS.map((size) => (
                <button
                  key={size}
                  onClick={() => setPageSizeKB(size)}
                  className={cn(
                    "h-10 rounded-lg border px-3 font-mono text-xs font-medium",
                    pageSizeKB === size
                      ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                      : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
                  )}
                >
                  {size} KB
                </button>
              ))}
            </div>
          </div>
          <label className="flex flex-1 flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">
              Program needs {processSizeKB} KB
            </span>
            <input
              type="range"
              min={1}
              max={64}
              value={processSizeKB}
              onChange={(e) => setProcessSizeKB(Number.parseInt(e.target.value, 10))}
              className="h-10 w-full accent-subject-it"
              aria-label="Program size in KB"
            />
          </label>
        </div>
      </div>

      {/* ---------------- Fragmentation visual ---------------- */}
      <div className="rounded-card border border-line p-4 dark:border-line-dark">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-subject-it">Internal fragmentation</h3>
        <p className="mt-1 font-mono text-xs text-ink-soft dark:text-bone-soft">
          {analysis.pagesNeeded} pages × {pageSizeKB} KB = {analysis.allocatedKB} KB allocated for a {processSizeKB} KB program
        </p>

        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Allocated pages">
          {Array.from({ length: Math.min(analysis.pagesNeeded, 32) }, (_, i) => {
            const isLast = i === analysis.pagesNeeded - 1;
            const usedFraction = isLast ? lastPageUsedKB / pageSizeKB : 1;
            return (
              <li
                key={i}
                className="relative h-16 w-14 overflow-hidden rounded-lg border border-line dark:border-line-dark"
                title={isLast ? `Page ${i}: ${lastPageUsedKB} KB used, ${analysis.internalFragmentationKB} KB unused` : `Page ${i}: full`}
              >
                <span
                  className="absolute inset-x-0 bottom-0 bg-subject-it/30"
                  style={{ height: `${Math.max(0, Math.min(1, usedFraction)) * 100}%` }}
                  aria-hidden
                />
                {isLast && analysis.internalFragmentationKB > 0 && (
                  <span
                    className="absolute inset-x-0 top-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(180,83,9,0.35)_4px,rgba(180,83,9,0.35)_8px)]"
                    style={{ height: `${(1 - Math.max(0, Math.min(1, usedFraction))) * 100}%` }}
                    aria-hidden
                  />
                )}
                <span className="absolute inset-x-0 top-1 text-center font-mono text-[9px] text-ink dark:text-bone">P{i}</span>
              </li>
            );
          })}
          {analysis.pagesNeeded > 32 && (
            <li className="flex h-16 items-center px-2 font-mono text-[11px] text-ink-soft dark:text-bone-soft">
              +{analysis.pagesNeeded - 32} more
            </li>
          )}
        </ul>

        <p className="mt-3 text-sm text-ink dark:text-bone">
          Unused space inside the final page:{" "}
          <span className="font-mono font-semibold text-subject-it">{analysis.internalFragmentationKB} KB</span>
          {analysis.internalFragmentationKB === 0 && " — this program happens to be an exact multiple of the page size."}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">{INTERNAL_FRAGMENTATION_NOTE}</p>
      </div>

      {/* ---------------- Derived effects ---------------- */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-card border border-line p-4 dark:border-line-dark">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-subject-it">What the page size changes</h3>
          <dl className="mt-3 grid grid-cols-2 gap-3">
            {[
              { label: "Pages this program needs", value: analysis.pagesNeeded },
              { label: "Memory allocated", value: `${analysis.allocatedKB} KB` },
              { label: "Offset field", value: `${analysis.offsetBits} bits` },
              { label: "Page number field", value: `${analysis.pageNumberBits} bits` },
              { label: "Single-level page table entries", value: analysis.pageTableEntries.toLocaleString() },
              { label: "Wasted in last page", value: `${analysis.internalFragmentationKB} KB` },
            ].map((item) => (
              <div key={item.label}>
                <dt className="font-mono text-[9px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">{item.label}</dt>
                <dd className="font-mono text-sm font-semibold text-ink dark:text-bone">{item.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
            The field widths assume an illustrative {ILLUSTRATIVE_ADDRESS_BITS}-bit address. A bigger page needs more bits for
            the offset, which leaves fewer for the page number — so there are fewer pages to describe, and a single-level page
            table would need fewer entries. Real systems use multi-level page tables precisely because a flat table over a
            realistic address space would be far too large.
          </p>
        </div>

        <div className="rounded-card border border-line p-4 dark:border-line-dark">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-subject-it">The trade-off</h3>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Smaller pages</p>
              <ul className="mt-1 flex flex-col gap-1.5">
                {PAGE_SIZE_TRADEOFFS.smaller.map((item) => (
                  <li key={item} className="text-xs leading-relaxed text-ink-soft dark:text-bone-soft">• {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Larger pages</p>
              <ul className="mt-1 flex flex-col gap-1.5">
                {PAGE_SIZE_TRADEOFFS.larger.map((item) => (
                  <li key={item} className="text-xs leading-relaxed text-ink-soft dark:text-bone-soft">• {item}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
            There is no single correct page size. It is a balance between page table size, transfer cost, and wasted space —
            which is why real systems offer more than one page size rather than picking a winner.
          </p>
        </div>
      </div>
    </div>
  );
}
