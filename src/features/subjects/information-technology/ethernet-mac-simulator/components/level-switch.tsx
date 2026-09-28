"use client";

import { cn } from "@/lib/utils";
import { DETAIL_LEVEL_LABELS, type DetailLevel } from "../model";

const LEVELS: DetailLevel[] = ["beginner", "intermediate", "technical"];

const BLURBS: Record<DetailLevel, string> = {
  beginner: "MAC addresses, Ethernet frames, source and destination, the switch, and unicast vs. broadcast.",
  intermediate: "Adds MAC learning, the switch's MAC table, unknown destinations, frame fields, and broadcast behaviour.",
  technical: "Adds EtherType, the FCS, full-duplex Ethernet, historical collisions, interface addressing, and detailed forwarding rules.",
};

/** Same look as the OSI level switch, with blurbs written for this simulation. */
export function LevelSwitch({ level, onChange }: { level: DetailLevel; onChange: (level: DetailLevel) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Detail level">
        {LEVELS.map((l) => (
          <button
            key={l}
            role="radio"
            aria-checked={level === l}
            onClick={() => onChange(l)}
            className={cn(
              "min-h-[36px] rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              level === l ? "border-subject-it bg-subject-it text-paper" : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30",
            )}
          >
            {DETAIL_LEVEL_LABELS[l]}
          </button>
        ))}
      </div>
      <p className="text-xs text-ink-soft dark:text-bone-soft">{BLURBS[level]}</p>
    </div>
  );
}
