"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Panel } from "../../osi-model-explorer/components/ui";
import type { LogKind } from "../model";
import type { LogEntry } from "../hooks/use-ethernet-lab";

const KIND_DOT: Record<LogKind, string> = {
  frame: "bg-sky-500",
  switch: "bg-subject-it",
  learn: "bg-emerald-500",
  forward: "bg-emerald-500",
  flood: "bg-violet-500",
  receive: "bg-emerald-500",
  discard: "bg-red-400",
  info: "bg-ink/40 dark:bg-bone/40",
};

/** Ethernet event log — append-only, scrolls inside its own box. */
export function EventLog({ entries, onClear }: { entries: LogEntry[]; onClear: () => void }) {
  const endRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [entries.length]);

  return (
    <Panel title="Ethernet event log">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-ink-soft dark:text-bone-soft">{entries.length === 0 ? "Nothing has happened yet." : `${entries.length} event${entries.length === 1 ? "" : "s"}`}</p>
        <button
          onClick={onClear}
          disabled={entries.length === 0}
          className="rounded-full border border-line px-3 py-1 text-xs font-medium text-ink hover:border-ink/40 disabled:opacity-40 dark:border-line-dark dark:text-bone"
        >
          Clear log
        </button>
      </div>
      <ol className="mt-2 max-h-64 space-y-2 overflow-y-auto pr-1" aria-live="polite">
        {entries.map((e) => (
          <li key={e.id} className="flex gap-2 text-xs">
            <span className={cn("mt-1 h-2 w-2 shrink-0 rounded-full", KIND_DOT[e.kind])} aria-hidden />
            <div className="min-w-0">
              <p className="font-medium text-ink dark:text-bone">{e.text}</p>
              {e.detail && <p className="whitespace-pre-line break-words font-mono text-[11px] text-ink-soft dark:text-bone-soft">{e.detail}</p>}
            </div>
          </li>
        ))}
        <li ref={endRef} aria-hidden />
      </ol>
    </Panel>
  );
}
