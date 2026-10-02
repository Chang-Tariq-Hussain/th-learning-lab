"use client";

import { ChevronDown } from "lucide-react";
import { Panel } from "../../osi-model-explorer/components/ui";

const ROWS: { label: string; sw: string; rt: string }[] = [
  { label: "Layer", sw: "Layer 2 (data link)", rt: "Layer 3 (network)" },
  { label: "Looks at", sw: "MAC addresses", rt: "IP addresses" },
  { label: "Handles", sw: "Ethernet frames", rt: "IP packets" },
  { label: "Job", sw: "Forwards inside one local network", rt: "Connects different networks" },
];

/** Optional, collapsed by default: a short Switch vs Router comparison. */
export function ComparePanel() {
  return (
    <Panel title="Switch vs router">
      <details className="group">
        <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-2 text-sm font-medium text-ink dark:text-bone [&::-webkit-details-marker]:hidden">
          Compare the two in four lines
          <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" strokeWidth={1.75} aria-hidden />
        </summary>
        <table className="mt-2 w-full table-fixed border-collapse text-left text-xs">
          <caption className="sr-only">Switch compared with router</caption>
          <thead>
            <tr className="border-b border-line text-[10px] uppercase tracking-wide text-ink-soft dark:border-line-dark dark:text-bone-soft">
              <th scope="col" className="w-[22%] py-1.5 pr-2 font-medium" />
              <th scope="col" className="py-1.5 pr-2 font-medium">
                Switch
              </th>
              <th scope="col" className="py-1.5 font-medium">
                Router
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.label} className="border-b border-line/60 align-top dark:border-line-dark/60">
                <th scope="row" className="py-2 pr-2 font-mono text-[10px] font-medium uppercase tracking-wide text-ink-soft dark:text-bone-soft">
                  {r.label}
                </th>
                <td className="py-2 pr-2 text-ink dark:text-bone">{r.sw}</td>
                <td className="py-2 text-ink dark:text-bone">{r.rt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </Panel>
  );
}
