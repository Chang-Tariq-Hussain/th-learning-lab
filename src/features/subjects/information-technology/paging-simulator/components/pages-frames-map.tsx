"use client";

import { useMemo } from "react";
import { ArrowRight, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DETAIL_LEVEL_LABELS,
  PAGE_VS_FRAME_NOTE,
  PTE_FIELD_GLOSSARY,
  type DetailLevel,
  type MachineState,
} from "../model";

interface PagesFramesMapProps {
  machine: MachineState;
  detailLevel: DetailLevel;
  selectedPage: number | null;
  onSelectPage: (page: number | null) => void;
}

/**
 * The Beginner view (brief §2, §3, §7, §17): virtual pages on the
 * left, the page table in the middle, physical frames on the right.
 * Selecting a page lights the whole chain page → page table entry →
 * frame, and opens the page table entry inspector below.
 *
 * The three columns are a responsive grid rather than an absolutely
 * positioned diagram, so the same markup stacks vertically on a phone
 * without a separate mobile implementation. Connections are drawn as
 * chevrons between columns (and between stacked rows on small
 * screens) instead of SVG lines across the layout, which would need
 * measured coordinates and would break the moment the grid reflows.
 */
export function PagesFramesMap({ machine, detailLevel, selectedPage, onSelectPage }: PagesFramesMapProps) {
  const { entries, frames, config } = machine;
  const selectedEntry = selectedPage === null ? null : entries[selectedPage] ?? null;
  const highlightedFrame = selectedEntry?.present ? selectedEntry.frame : null;

  const residentCount = useMemo(() => frames.filter((f) => f !== null).length, [frames]);

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-ink-soft dark:text-bone-soft">
        Tap any page to trace it through the page table into physical memory. Pages that are not present in RAM have no
        frame to point at — accessing one of those is what raises a page fault.
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto_1.15fr_auto_1fr]">
        {/* ---------------- Virtual memory ---------------- */}
        <section aria-label="Virtual memory pages">
          <h3 className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-subject-it">Virtual Memory</h3>
          <p className="mb-2 text-xs text-ink-soft dark:text-bone-soft">
            Process&apos;s address space · {config.pageCount} pages × {config.pageSizeBytes} bytes
          </p>
          <ul className="flex flex-col gap-1.5">
            {entries.map((entry) => {
              const start = entry.page * config.pageSizeBytes;
              const end = start + config.pageSizeBytes - 1;
              const active = selectedPage === entry.page;
              return (
                <li key={entry.page}>
                  <button
                    onClick={() => onSelectPage(active ? null : entry.page)}
                    aria-pressed={active}
                    className={cn(
                      "w-full rounded-lg border px-3 py-2 text-left transition-colors",
                      active
                        ? "border-subject-it bg-subject-it-soft dark:bg-subject-it/20"
                        : "border-line hover:border-subject-it/50 dark:border-line-dark",
                    )}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-semibold text-ink dark:text-bone">Page {entry.page}</span>
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide",
                          entry.present
                            ? "bg-subject-it/15 text-subject-it"
                            : "bg-ink/10 text-ink-soft dark:bg-bone/10 dark:text-bone-soft",
                        )}
                      >
                        {entry.present ? "in RAM" : "not in RAM"}
                      </span>
                    </span>
                    <span className="mt-0.5 block font-mono text-[10px] text-ink-soft dark:text-bone-soft">
                      addresses {start}–{end} · {entry.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="hidden items-center justify-center lg:flex" aria-hidden>
          <ArrowRight className="h-4 w-4 text-ink-soft dark:text-bone-soft" />
        </div>
        <div className="flex justify-center lg:hidden" aria-hidden>
          <ArrowDown className="h-4 w-4 text-ink-soft dark:text-bone-soft" />
        </div>

        {/* ---------------- Page table ---------------- */}
        <section aria-label="Page table">
          <h3 className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-subject-it">Page Table</h3>
          <p className="mb-2 text-xs text-ink-soft dark:text-bone-soft">
            One per process · maps pages to frames ({DETAIL_LEVEL_LABELS[detailLevel]} detail)
          </p>
          <div className="overflow-x-auto rounded-lg border border-line dark:border-line-dark">
            <table className="w-full min-w-[220px] border-collapse text-left">
              <thead>
                <tr className="bg-ink/[0.04] dark:bg-bone/[0.06]">
                  <th scope="col" className="px-2 py-1.5 font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Page</th>
                  <th scope="col" className="px-2 py-1.5 font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Frame</th>
                  <th scope="col" className="px-2 py-1.5 font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Present</th>
                  {detailLevel !== "basic" && (
                    <>
                      <th scope="col" className="px-2 py-1.5 font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Prot</th>
                      <th scope="col" className="px-2 py-1.5 font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Ref</th>
                      <th scope="col" className="px-2 py-1.5 font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Dirty</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => {
                  const active = selectedPage === entry.page;
                  return (
                    <tr
                      key={entry.page}
                      onClick={() => onSelectPage(active ? null : entry.page)}
                      className={cn(
                        "cursor-pointer border-t border-line font-mono text-xs dark:border-line-dark",
                        active ? "bg-subject-it-soft dark:bg-subject-it/20" : "hover:bg-ink/[0.03] dark:hover:bg-bone/[0.04]",
                      )}
                    >
                      <td className="px-2 py-1.5 text-ink dark:text-bone">{entry.page}</td>
                      <td className="px-2 py-1.5 text-ink dark:text-bone">{entry.present ? entry.frame : "—"}</td>
                      <td className={cn("px-2 py-1.5", entry.present ? "text-subject-it" : "text-ink-soft dark:text-bone-soft")}>
                        {entry.present ? "Yes" : "No"}
                      </td>
                      {detailLevel !== "basic" && (
                        <>
                          <td className="px-2 py-1.5 text-[10px] text-ink-soft dark:text-bone-soft">{entry.protection === "read-only" ? "R" : "RW"}</td>
                          <td className="px-2 py-1.5 text-ink-soft dark:text-bone-soft">{entry.referenced ? "1" : "0"}</td>
                          <td className="px-2 py-1.5 text-ink-soft dark:text-bone-soft">{entry.dirty ? "1" : "0"}</td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <div className="hidden items-center justify-center lg:flex" aria-hidden>
          <ArrowRight className="h-4 w-4 text-ink-soft dark:text-bone-soft" />
        </div>
        <div className="flex justify-center lg:hidden" aria-hidden>
          <ArrowDown className="h-4 w-4 text-ink-soft dark:text-bone-soft" />
        </div>

        {/* ---------------- Physical RAM ---------------- */}
        <section aria-label="Physical RAM frames">
          <h3 className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-subject-it">Physical RAM</h3>
          <p className="mb-2 text-xs text-ink-soft dark:text-bone-soft">
            Shared hardware · {config.frameCount} frames × {config.pageSizeBytes} bytes · {residentCount}/{config.frameCount} used
          </p>
          <ul className="flex flex-col gap-1.5">
            {frames.map((page, frameIndex) => {
              const active = highlightedFrame === frameIndex;
              return (
                <li
                  key={frameIndex}
                  className={cn(
                    "rounded-lg border px-3 py-2 transition-colors",
                    active
                      ? "border-subject-it bg-subject-it-soft dark:bg-subject-it/20"
                      : page === null
                        ? "border-dashed border-line dark:border-line-dark"
                        : "border-line dark:border-line-dark",
                  )}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold text-ink dark:text-bone">Frame {frameIndex}</span>
                    <span className="font-mono text-[10px] text-ink-soft dark:text-bone-soft">
                      {page === null ? "free" : `holds page ${page}`}
                    </span>
                  </span>
                  <span className="mt-0.5 block font-mono text-[10px] text-ink-soft dark:text-bone-soft">
                    physical {frameIndex * config.pageSizeBytes}–{frameIndex * config.pageSizeBytes + config.pageSizeBytes - 1}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      {/* ---------------- Selected chain + PTE inspector ---------------- */}
      {selectedEntry ? (
        <div className="rounded-card border border-subject-it/40 bg-subject-it-soft/40 p-4 dark:bg-subject-it/10">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-subject-it">Page table entry {selectedEntry.page}</p>
          <p className="mt-2 flex flex-wrap items-center gap-2 font-mono text-xs text-ink dark:text-bone">
            <span className="rounded border border-subject-it/40 px-2 py-1">Virtual page {selectedEntry.page}</span>
            <ArrowRight className="h-3 w-3" aria-hidden />
            <span className="rounded border border-subject-it/40 px-2 py-1">Page table entry {selectedEntry.page}</span>
            <ArrowRight className="h-3 w-3" aria-hidden />
            <span className="rounded border border-subject-it/40 px-2 py-1">
              {selectedEntry.present ? `Frame ${selectedEntry.frame}` : "No frame — page fault"}
            </span>
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
            {selectedEntry.present
              ? `Page ${selectedEntry.page} is currently held in frame ${selectedEntry.frame}. An access to any address inside this page is translated into the matching address inside that frame.`
              : `Page ${selectedEntry.page} has no frame, because its present bit is clear. Accessing it raises a page fault, and the operating system loads the page before the access is retried.`}
          </p>

          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Page number</dt>
              <dd className="font-mono text-sm text-ink dark:text-bone">{selectedEntry.page}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Frame number</dt>
              <dd className="font-mono text-sm text-ink dark:text-bone">{selectedEntry.present ? selectedEntry.frame : "—"}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Present / valid</dt>
              <dd className="font-mono text-sm text-ink dark:text-bone">{selectedEntry.present ? "1" : "0"}</dd>
            </div>
            {detailLevel !== "basic" && (
              <>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Protection</dt>
                  <dd className="font-mono text-sm text-ink dark:text-bone">{selectedEntry.protection}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Referenced</dt>
                  <dd className="font-mono text-sm text-ink dark:text-bone">{selectedEntry.referenced ? "1" : "0"}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Dirty / modified</dt>
                  <dd className="font-mono text-sm text-ink dark:text-bone">{selectedEntry.dirty ? "1" : "0"}</dd>
                </div>
              </>
            )}
          </dl>

          {detailLevel === "technical" && (
            <ul className="mt-4 flex flex-col gap-2 border-t border-subject-it/30 pt-3">
              {PTE_FIELD_GLOSSARY.map((field) => (
                <li key={field.field} className="text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
                  <span className="font-medium text-ink dark:text-bone">{field.field}: </span>
                  {field.meaning}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <p className="rounded-card border border-dashed border-line px-4 py-3 text-sm text-ink-soft dark:border-line-dark dark:text-bone-soft">
          {PAGE_VS_FRAME_NOTE}
        </p>
      )}
    </div>
  );
}
