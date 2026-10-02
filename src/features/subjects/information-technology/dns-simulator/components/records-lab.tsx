"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Panel } from "../../osi-model-explorer/components/ui";
import { RECORD_INFO, ZONES, type DetailLevel, type RecordType, type ZoneRecord } from "../model";

const TYPES: RecordType[] = ["A", "AAAA", "CNAME", "MX", "NS", "TXT"];
const ZONE = ZONES["example.com"]!;

function meaning(r: ZoneRecord): string {
  switch (r.type) {
    case "CNAME":
      return `${r.name} is an alias for ${r.value}`;
    case "MX": {
      const [prio, host] = r.value.split(" ");
      return `mail for ${r.name} goes to ${host} (priority ${prio})`;
    }
    case "TXT":
      return `${r.name} publishes the text ${r.value}`;
    case "NS":
      return `${r.name} is run by the name server ${r.value}`;
    default:
      return `${r.name} → ${r.value}`;
  }
}

/** Pick a record type, or a row of the example zone, and see what it maps and when it is used. */
export function RecordsLab({ level }: { level: DetailLevel }) {
  const [idx, setIdx] = useState(0);
  const rec = ZONE.records[idx] ?? ZONE.records[0]!;
  const info = RECORD_INFO.find((r) => r.type === rec.type) ?? RECORD_INFO[0]!;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Record type">
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setIdx(Math.max(0, ZONE.records.findIndex((r) => r.type === t)))}
            aria-pressed={rec.type === t}
            className={cn("min-h-[44px] min-w-[56px] rounded-full border px-4 font-mono text-sm font-semibold transition-colors", rec.type === t ? "border-subject-it bg-subject-it text-paper" : "border-line text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone")}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2 md:items-start">
        <Panel title={`${info.type} record: ${info.maps}`}>
          <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{info.beginner}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2" aria-label="Name maps to value">
            <span className="min-w-0 break-all rounded-lg border border-line bg-white px-2.5 py-1.5 font-mono text-sm text-ink dark:border-line-dark dark:bg-white/[0.04] dark:text-bone">{rec.name}</span>
            <span className="flex items-center gap-1 font-mono text-xs font-semibold text-subject-it">
              <span aria-hidden>──</span>
              {rec.type}
              <span aria-hidden>→</span>
            </span>
            <span className="min-w-0 break-all rounded-lg border border-subject-it bg-subject-it-soft px-2.5 py-1.5 font-mono text-sm text-ink dark:bg-subject-it/15 dark:text-bone">{rec.value}</span>
          </div>
          <p className="mt-2 text-sm text-ink dark:text-bone">{meaning(rec)}</p>
          {rec.type === "CNAME" && <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">The resolver then looks up example.com, which has the A record 93.184.216.34. That is the address the client receives.</p>}

          <dl className="mt-3 grid grid-cols-[auto,1fr] gap-x-3 gap-y-1 border-t border-line pt-3 text-sm dark:border-line-dark">
            <dt className="text-ink-soft dark:text-bone-soft">Name</dt>
            <dd className="break-all font-mono text-ink dark:text-bone">{rec.name}</dd>
            <dt className="text-ink-soft dark:text-bone-soft">Type</dt>
            <dd className="font-mono text-ink dark:text-bone">{rec.type}</dd>
            <dt className="text-ink-soft dark:text-bone-soft">TTL</dt>
            <dd className="font-mono text-ink dark:text-bone">{rec.ttl} seconds</dd>
            <dt className="text-ink-soft dark:text-bone-soft">Value</dt>
            <dd className="break-all font-mono text-ink dark:text-bone">{rec.value}</dd>
          </dl>
          <p className="mt-3 text-sm text-ink-soft dark:text-bone-soft">
            <span className="font-semibold text-ink dark:text-bone">Used for: </span>
            {info.usedFor}
          </p>
          {level !== "beginner" && <p className="mt-2 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">{info.technical}</p>}
        </Panel>

        <Panel title="An example zone: example.com (tap a row)">
          <ul className="flex flex-col gap-1.5">
            {ZONE.records.map((r, i) => (
              <li key={`${r.name}-${r.type}-${i}`}>
                <button onClick={() => setIdx(i)} aria-pressed={idx === i} className={cn("flex min-h-[44px] w-full items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left transition-colors", idx === i ? "border-subject-it bg-subject-it-soft/60 dark:bg-subject-it/15" : "border-line hover:border-ink/30 dark:border-line-dark dark:hover:border-bone/30")}>
                  <span className="w-14 shrink-0 font-mono text-xs font-bold text-subject-it">{r.type}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block break-all font-mono text-xs text-ink dark:text-bone">{r.name}</span>
                    <span className="block break-all font-mono text-xs text-ink-soft dark:text-bone-soft">{r.value}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">These records live on the authoritative server. This is a teaching example, not a real DNS server.</p>
        </Panel>
      </div>
    </div>
  );
}
