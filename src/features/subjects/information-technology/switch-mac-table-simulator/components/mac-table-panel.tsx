"use client";

import { FastForward, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Panel } from "../../osi-model-explorer/components/ui";
import type { SwitchLab } from "../hooks/use-switch-lab";
import { AGING_SPEEDS, AGING_TIMEOUT_SEC, REAL_DEFAULT_AGING_SEC, deviceByMac, formatPort, type AgingSpeed } from "../model";

const SMALL_BTN = "inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-xs font-medium text-ink hover:border-ink/40 disabled:cursor-not-allowed disabled:opacity-40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40";

const NOTICE_TONE = {
  good: "border-emerald-400/60 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10",
  info: "border-sky-400/60 bg-sky-50 dark:border-sky-500/40 dark:bg-sky-500/10",
  warn: "border-amber-400/60 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-500/10",
} as const;

function speedLabel(s: AgingSpeed): string {
  return s === 0 ? "Paused" : `${s}×`;
}

export function MacTablePanel({ lab }: { lab: SwitchLab }) {
  const { state, inFlight } = lab;
  const { table, highlight, notice, speed } = state;
  const rows = [...table].sort((a, b) => a.port - b.port);
  const lifetime = speed === 0 ? null : Math.round(AGING_TIMEOUT_SEC / speed);
  const lockTip = inFlight ? "Finish or cancel the current frame first" : undefined;

  return (
    <Panel title="MAC address table (dynamic entries)">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={SMALL_BTN} onClick={lab.clearTable} disabled={inFlight || table.length === 0} title={lockTip}>
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} /> Clear MAC table
          </button>
          <button type="button" className={SMALL_BTN} onClick={() => lab.skip(AGING_TIMEOUT_SEC / 2)} disabled={inFlight || table.length === 0} title={lockTip ?? `Jump the switch clock ahead ${AGING_TIMEOUT_SEC / 2} s`}>
            <FastForward className="h-3.5 w-3.5" strokeWidth={1.75} /> +{AGING_TIMEOUT_SEC / 2} s
          </button>
          <span className="ml-auto font-mono text-[11px] text-ink-soft dark:text-bone-soft">
            {table.length} {table.length === 1 ? "entry" : "entries"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[340px] text-left text-xs">
            <thead>
              <tr className="border-b border-line font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:border-line-dark dark:text-bone-soft">
                <th className="py-1.5 pr-3 font-medium">MAC address</th>
                <th className="py-1.5 pr-3 font-medium">Port</th>
                <th className="py-1.5 pr-3 font-medium">Status</th>
                <th className="py-1.5 font-medium">Age</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-ink-soft dark:text-bone-soft">
                    The table is empty — the switch hasn’t learned anything yet. Send a frame and watch the sender appear here.
                  </td>
                </tr>
              )}
              {rows.map((e) => {
                const dev = deviceByMac(e.mac);
                const hl = highlight?.mac === e.mac ? highlight.kind : null;
                const left = AGING_TIMEOUT_SEC - e.ageSec;
                const expiring = left <= AGING_TIMEOUT_SEC * 0.25;
                return (
                  <tr key={e.mac} className={cn("border-b border-line/60 transition-colors dark:border-line-dark/60", hl === "new" && "bg-emerald-50 dark:bg-emerald-500/10", hl && hl !== "new" && "bg-sky-50 dark:bg-sky-500/10")}>
                    <td className="py-2 pr-3 align-top">
                      <span className="whitespace-nowrap font-mono text-ink dark:text-bone">{e.mac}</span>
                      <span className="block text-[10px] text-ink-soft dark:text-bone-soft">
                        {dev?.name}
                        {hl === "new" && <span className="ml-1 font-semibold text-emerald-700 dark:text-emerald-300">· just learned</span>}
                        {hl && hl !== "new" && <span className="ml-1 font-semibold text-sky-700 dark:text-sky-300">· age reset</span>}
                      </span>
                    </td>
                    <td className="whitespace-nowrap py-2 pr-3 align-top font-mono text-ink dark:text-bone">{formatPort(e.port)}</td>
                    <td className="whitespace-nowrap py-2 pr-3 align-top text-ink-soft dark:text-bone-soft">Dynamic</td>
                    <td className="py-2 align-top">
                      <span className={cn("whitespace-nowrap font-mono", expiring ? "text-amber-700 dark:text-amber-300" : "text-ink dark:text-bone")}>{Math.floor(e.ageSec)}s</span>
                      <span
                        className="mt-1 block h-1 w-16 overflow-hidden rounded-full bg-ink/10 dark:bg-bone/10"
                        role="progressbar"
                        aria-label={`Age of ${e.mac}`}
                        aria-valuemin={0}
                        aria-valuemax={AGING_TIMEOUT_SEC}
                        aria-valuenow={Math.floor(e.ageSec)}
                      >
                        <span className={cn("block h-full rounded-full", expiring ? "bg-amber-500" : "bg-subject-it")} style={{ width: `${Math.min(100, (e.ageSec / AGING_TIMEOUT_SEC) * 100)}%` }} />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {notice && (
          <p role="status" className={cn("rounded-xl border px-3 py-2 text-xs leading-relaxed text-ink dark:text-bone", NOTICE_TONE[notice.tone])}>
            {notice.text}
          </p>
        )}

        <div className="border-t border-line pt-3 dark:border-line-dark">
          <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">MAC aging speed</p>
          <div className="mt-1.5 flex flex-wrap gap-2" role="radiogroup" aria-label="MAC aging speed">
            {AGING_SPEEDS.map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={speed === s}
                onClick={() => lab.setSpeed(s)}
                className={cn("min-h-[40px] min-w-[52px] rounded-full border px-3 py-1.5 text-xs font-medium transition-colors", speed === s ? "border-subject-it bg-subject-it text-paper" : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30")}
              >
                {speedLabel(s)}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-ink-soft dark:text-bone-soft">
            {lifetime === null ? "Aging is paused: entries stay in the table until you resume." : `An unused entry expires after ${AGING_TIMEOUT_SEC} simulated seconds (about ${lifetime} s of real time at ${speed}×).`} Real switches commonly wait {REAL_DEFAULT_AGING_SEC} s; any new frame from a device resets its age. The clock pauses while a frame is being processed.
          </p>
        </div>
      </div>
    </Panel>
  );
}
