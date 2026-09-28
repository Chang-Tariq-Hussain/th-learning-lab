"use client";

import { cn } from "@/lib/utils";
import { Panel } from "../../osi-model-explorer/components/ui";
import {
  BROADCAST_MAC,
  FIELD_INFO,
  FIELD_ORDER,
  deviceByMac,
  type DetailLevel,
  type EthernetFrame,
  type FieldId,
  type LabDevice,
} from "../model";

const FIELD_TONE: Record<FieldId, string> = {
  dst: "border-emerald-400/70 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10",
  src: "border-sky-400/70 bg-sky-50 dark:border-sky-500/40 dark:bg-sky-500/10",
  type: "border-line bg-white/60 dark:border-line-dark dark:bg-white/[0.03]",
  payload: "border-line bg-white/60 dark:border-line-dark dark:bg-white/[0.03]",
  fcs: "border-line bg-white/60 dark:border-line-dark dark:bg-white/[0.03]",
};

export function fieldValue(frame: EthernetFrame, id: FieldId): string {
  switch (id) {
    case "dst":
      return frame.dst;
    case "src":
      return frame.src;
    case "type":
      return frame.etherType;
    case "payload":
      return frame.payload;
    case "fcs":
      return `0x${frame.fcs}`;
  }
}

function ownerLabel(mac: string, devices: LabDevice[]): string {
  if (mac === BROADCAST_MAC) return "Broadcast — every device on the LAN";
  const dev = deviceByMac(devices, mac);
  return dev ? dev.name : "unknown interface";
}

/**
 * The simplified Ethernet frame, drawn as a stack of clickable fields.
 * `filled` lets the step-by-step mode reveal the frame one field at a time.
 */
export function FrameView({
  frame,
  devices,
  filled,
  selected,
  onSelect,
  level,
}: {
  frame: EthernetFrame;
  devices: LabDevice[];
  filled: FieldId[];
  selected: FieldId | null;
  onSelect: (id: FieldId) => void;
  level: DetailLevel;
}) {
  const isBroadcast = frame.dst === BROADCAST_MAC;
  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl border border-sky-400/70 bg-sky-50 p-3 dark:border-sky-500/40 dark:bg-sky-500/10">
          <p className="font-mono text-[10px] uppercase tracking-wide text-sky-700 dark:text-sky-300">Who sent it? — Source MAC</p>
          <p className="mt-1 break-all font-mono text-sm font-semibold text-ink dark:text-bone">{filled.includes("src") ? frame.src : "—"}</p>
          <p className="text-xs text-ink-soft dark:text-bone-soft">{filled.includes("src") ? ownerLabel(frame.src, devices) : "not added yet"}</p>
        </div>
        <div className={cn("rounded-xl border p-3", isBroadcast ? "border-amber-400/70 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-500/10" : "border-emerald-400/70 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10")}>
          <p className={cn("font-mono text-[10px] uppercase tracking-wide", isBroadcast ? "text-amber-700 dark:text-amber-300" : "text-emerald-700 dark:text-emerald-300")}>Who is it for? — Destination MAC</p>
          <p className="mt-1 break-all font-mono text-sm font-semibold text-ink dark:text-bone">{filled.includes("dst") ? frame.dst : "—"}</p>
          <p className="text-xs text-ink-soft dark:text-bone-soft">{filled.includes("dst") ? ownerLabel(frame.dst, devices) : "not added yet"}</p>
        </div>
      </div>

      <div className="rounded-xl border border-line p-2 dark:border-line-dark" role="group" aria-label="Simplified Ethernet frame fields">
        <p className="px-1 pb-2 font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">
          Educational simplified Ethernet frame — click a field
        </p>
        <div className="flex flex-col gap-1.5">
          {FIELD_ORDER.map((id) => {
            const info = FIELD_INFO[id];
            const on = filled.includes(id);
            return (
              <button
                key={id}
                onClick={() => onSelect(id)}
                aria-pressed={selected === id}
                className={cn(
                  "flex min-h-[44px] w-full flex-col items-start gap-0.5 rounded-lg border px-3 py-2 text-left transition-all sm:flex-row sm:items-center sm:justify-between",
                  on ? FIELD_TONE[id] : "border-dashed border-line opacity-60 dark:border-line-dark",
                  selected === id && "ring-2 ring-subject-it",
                )}
              >
                <span className="text-xs font-medium text-ink dark:text-bone">
                  {info.label}
                  {level === "technical" && <span className="ml-2 font-mono text-[10px] text-ink-soft dark:text-bone-soft">{info.size}</span>}
                </span>
                <span className="max-w-full break-all font-mono text-xs text-ink dark:text-bone">{on ? fieldValue(frame, id) : "—"}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function FieldExplainer({ field, level }: { field: FieldId | null; level: DetailLevel }) {
  if (!field) {
    return (
      <Panel>
        <p className="text-sm text-ink-soft dark:text-bone-soft">Select any field of the frame to see what it is for.</p>
      </Panel>
    );
  }
  const info = FIELD_INFO[field];
  return (
    <Panel title={`${info.label} · ${info.size}`}>
      <p className="text-sm text-ink dark:text-bone">{info.purpose}</p>
      {level === "technical" && <p className="mt-2 text-sm text-ink-soft dark:text-bone-soft">{info.technical}</p>}
    </Panel>
  );
}
