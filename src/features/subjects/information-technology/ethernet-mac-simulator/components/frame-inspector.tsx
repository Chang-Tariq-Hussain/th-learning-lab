"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Panel } from "../../osi-model-explorer/components/ui";
import { FIELD_INFO, FIELD_ORDER, frameSizeBytes, locationLabel, statusLabel, type DetailLevel, type FieldId, type LabDevice, type Transmission } from "../model";
import { fieldValue } from "./frame-view";

/**
 * Frame Inspector: every field of the selected frame plus where it is and
 * what state it is in. Collapsible on small screens (always open from md up).
 */
export function FrameInspector({
  tx,
  stepIndex,
  devices,
  selected,
  onSelect,
  level,
}: {
  tx: Transmission | null;
  stepIndex: number;
  devices: LabDevice[];
  selected: FieldId | null;
  onSelect: (id: FieldId) => void;
  level: DetailLevel;
}) {
  const [open, setOpen] = useState(true);
  const filled = tx && stepIndex >= 0 ? tx.steps[Math.min(stepIndex, tx.steps.length - 1)]!.filled : [];

  return (
    <Panel>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between font-mono text-[10px] uppercase tracking-wide text-ink-soft md:pointer-events-none dark:text-bone-soft"
      >
        <span>Frame inspector</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform md:hidden", open && "rotate-180")} aria-hidden />
      </button>

      <div className={cn("mt-2", !open && "hidden md:block")}>
        {!tx ? (
          <p className="text-sm text-ink-soft dark:text-bone-soft">No frame yet. Send some data and inspect the frame here.</p>
        ) : (
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-xs">
            {FIELD_ORDER.map((id) => {
              const on = filled.includes(id);
              return (
                <div key={id} className="contents">
                  <dt>
                    <button onClick={() => onSelect(id)} className={cn("text-left font-medium underline-offset-2 hover:underline", selected === id ? "text-subject-it" : "text-ink dark:text-bone")}>
                      {FIELD_INFO[id].label}
                    </button>
                  </dt>
                  <dd className="break-all font-mono text-ink-soft dark:text-bone-soft">{on ? fieldValue(tx.frame, id) : "—"}</dd>
                </div>
              );
            })}
            {level === "technical" && (
              <div className="contents">
                <dt className="font-medium text-ink dark:text-bone">Frame size</dt>
                <dd className="font-mono text-ink-soft dark:text-bone-soft">{frameSizeBytes(tx.frame.payload)} bytes (educational)</dd>
              </div>
            )}
            <div className="contents">
              <dt className="font-medium text-ink dark:text-bone">Current location</dt>
              <dd className="text-ink-soft dark:text-bone-soft">{locationLabel(tx, stepIndex, devices)}</dd>
            </div>
            <div className="contents">
              <dt className="font-medium text-ink dark:text-bone">Status</dt>
              <dd className="text-ink-soft dark:text-bone-soft">{statusLabel(tx, stepIndex)}</dd>
            </div>
          </dl>
        )}
      </div>
    </Panel>
  );
}
