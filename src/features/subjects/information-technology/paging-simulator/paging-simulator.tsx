"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { PagesFramesMap } from "./components/pages-frames-map";
import { AddressTranslationLab } from "./components/address-translation-lab";
import { DemandPagingLab } from "./components/demand-paging-lab";
import { ReplacementLab } from "./components/replacement-lab";
import { PageSizeLab } from "./components/page-size-lab";
import { TlbLab } from "./components/tlb-lab";
import { ProcessIsolationLab } from "./components/process-isolation-lab";
import {
  DEFAULT_CONFIG,
  DETAIL_LEVEL_DESCRIPTIONS,
  DETAIL_LEVEL_LABELS,
  PAGE_SIZE_OPTIONS,
  PAGING_DISCLAIMER,
  VIRTUAL_MEMORY_LINK_NOTE,
  createMachine,
  type Algorithm,
  type DetailLevel,
  type MachineState,
} from "./model";

type TabMode = "map" | "translation" | "fault" | "replacement" | "pagesize" | "tlb" | "isolation";

const TABS: { id: TabMode; label: string; blurb: string }[] = [
  {
    id: "map",
    label: "Pages & Frames",
    blurb: "See virtual pages, the page table, and physical frames side by side — and trace any page through all three.",
  },
  {
    id: "translation",
    label: "Address Translation",
    blurb: "Split a virtual address into page number and offset, then step it all the way to a physical address.",
  },
  {
    id: "fault",
    label: "Page Faults & Demand Paging",
    blurb: "Request a page that is not in RAM and watch the operating system handle the fault.",
  },
  {
    id: "replacement",
    label: "Reference String & Replacement",
    blurb: "Run a reference string through FIFO, LRU, or Optimal and count the page faults.",
  },
  {
    id: "pagesize",
    label: "Page Size & Fragmentation",
    blurb: "Change the page size and see what it does to page counts, address fields, and wasted space.",
  },
  {
    id: "tlb",
    label: "TLB",
    blurb: "Cache recent translations and watch the number of page table lookups fall.",
  },
  {
    id: "isolation",
    label: "Process Isolation",
    blurb: "See why the same virtual page number means different physical memory in two different processes.",
  },
];

/**
 * The "Operating System Paging Laboratory" — 2D/2.5D throughout (no
 * three.js), per brief guidance: paging is an abstract mapping
 * process, so spatial relationships between pages, page table entries,
 * and frames carry the meaning better than 3D hardware would.
 *
 * One `MachineState` is shared by the Pages & Frames, Address
 * Translation, and Demand Paging tabs, so a page loaded in one is
 * genuinely loaded in the others. The Reference String, Page Size,
 * and TLB labs are self-contained, which keeps their experiments from
 * disturbing that shared machine. All simulation arithmetic lives in
 * `model.ts` as pure functions — nothing here calls a server, and no
 * simulation data is held in global state.
 */
export function PagingSimulator() {
  const [tab, setTab] = useState<TabMode>("map");
  const [detailLevel, setDetailLevel] = useState<DetailLevel>("basic");
  const [pageSizeBytes, setPageSizeBytes] = useState(DEFAULT_CONFIG.pageSizeBytes);
  const [machine, setMachine] = useState<MachineState>(() => createMachine(DEFAULT_CONFIG));
  const [algorithm, setAlgorithm] = useState<Algorithm>("fifo");
  const [selectedPage, setSelectedPage] = useState<number | null>(null);

  const commit = useCallback((next: MachineState) => setMachine(next), []);

  const resetMachine = useCallback(
    (size = pageSizeBytes) => {
      setMachine(createMachine({ ...DEFAULT_CONFIG, pageSizeBytes: size }));
      setSelectedPage(null);
    },
    [pageSizeBytes],
  );

  const activeTab = TABS.find((t) => t.id === tab)!;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Paging Laboratory mode">
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

      {/* Shared configuration — only meaningful for the three tabs that
          share the machine, so it is hidden on the self-contained ones
          rather than showing controls that do nothing. */}
      {(tab === "map" || tab === "translation" || tab === "fault" || tab === "tlb") && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Detail level:</span>
            {(Object.keys(DETAIL_LEVEL_LABELS) as DetailLevel[]).map((level) => (
              <button
                key={level}
                onClick={() => setDetailLevel(level)}
                title={DETAIL_LEVEL_DESCRIPTIONS[level]}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium",
                  detailLevel === level ? "border-ink dark:border-bone" : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
                )}
              >
                {DETAIL_LEVEL_LABELS[level]}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Page size:</span>
            {PAGE_SIZE_OPTIONS.map((size) => (
              <button
                key={size}
                onClick={() => {
                  setPageSizeBytes(size);
                  resetMachine(size);
                }}
                className={cn(
                  "rounded-full border px-3 py-1 font-mono text-xs font-medium",
                  pageSizeBytes === size ? "border-ink dark:border-bone" : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
                )}
              >
                {size} B
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-card border border-line bg-paper p-3 dark:border-line-dark dark:bg-chalkboard sm:p-5">
        {tab === "map" && (
          <PagesFramesMap machine={machine} detailLevel={detailLevel} selectedPage={selectedPage} onSelectPage={setSelectedPage} />
        )}
        {tab === "translation" && (
          <AddressTranslationLab
            machine={machine}
            algorithm={algorithm}
            onChangeAlgorithm={setAlgorithm}
            onCommit={commit}
            onHighlightPage={setSelectedPage}
          />
        )}
        {tab === "fault" && (
          <DemandPagingLab
            machine={machine}
            algorithm={algorithm}
            onChangeAlgorithm={setAlgorithm}
            onCommit={commit}
            onReset={() => resetMachine()}
          />
        )}
        {tab === "replacement" && <ReplacementLab />}
        {tab === "pagesize" && <PageSizeLab />}
        {tab === "tlb" && <TlbLab machine={machine} />}
        {tab === "isolation" && <ProcessIsolationLab />}
      </div>

      <p className="text-xs text-ink-soft dark:text-bone-soft">{VIRTUAL_MEMORY_LINK_NOTE}</p>
      <p className="text-xs text-ink-soft dark:text-bone-soft">{PAGING_DISCLAIMER}</p>
    </div>
  );
}
