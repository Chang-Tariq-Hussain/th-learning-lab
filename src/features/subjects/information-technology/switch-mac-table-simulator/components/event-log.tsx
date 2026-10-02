"use client";

import { memo, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Panel } from "../../osi-model-explorer/components/ui";
import { LOG_LABEL, type LogEntry, type LogKind } from "../lab-state";

const KIND_STYLE: Record<LogKind, string> = {
  sent: "bg-sky-500/15 text-sky-800 dark:text-sky-200",
  received: "bg-sky-500/15 text-sky-800 dark:text-sky-200",
  learned: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200",
  found: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200",
  unknown: "bg-violet-500/15 text-violet-800 dark:text-violet-200",
  broadcast: "bg-amber-500/20 text-amber-800 dark:text-amber-200",
  flood: "bg-violet-500/15 text-violet-800 dark:text-violet-200",
  forward: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200",
  deliver: "bg-ink/10 text-ink dark:bg-bone/10 dark:text-bone",
  expired: "bg-red-500/15 text-red-800 dark:text-red-200",
  portdown: "bg-red-500/15 text-red-800 dark:text-red-200",
  portup: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200",
  cleared: "bg-amber-500/20 text-amber-800 dark:text-amber-200",
  info: "bg-ink/10 text-ink dark:bg-bone/10 dark:text-bone",
};

/** Append-only event log. Scrolls inside its own box (never scrolls the page). */
export const EventLog = memo(function EventLog({ entries, onClear }: { entries: LogEntry[]; onClear: () => void }) {
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries.length]);

  return (
    <Panel title="Event log">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-ink-soft dark:text-bone-soft">{entries.length === 0 ? "Nothing has happened yet." : `${entries.length} event${entries.length === 1 ? "" : "s"}, oldest first`}</p>
        <button type="button" onClick={onClear} disabled={entries.length === 0} className="min-h-[36px] rounded-full border border-line px-3 py-1 text-xs font-medium text-ink hover:border-ink/40 disabled:opacity-40 dark:border-line-dark dark:text-bone">
          Clear log
        </button>
      </div>
      <ol ref={listRef} className="mt-2 max-h-72 space-y-1.5 overflow-y-auto pr-1" tabIndex={0} aria-label="Switch event log">
        {entries.map((e) => (
          <li key={e.id} className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-xs">
            <span className="font-mono text-[11px] text-ink-soft dark:text-bone-soft">{e.time}</span>
            <span className={cn("rounded-md px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide", KIND_STYLE[e.kind])}>{LOG_LABEL[e.kind]}</span>
            <span className="min-w-0 break-words text-ink dark:text-bone">{e.text}</span>
          </li>
        ))}
      </ol>
    </Panel>
  );
});
