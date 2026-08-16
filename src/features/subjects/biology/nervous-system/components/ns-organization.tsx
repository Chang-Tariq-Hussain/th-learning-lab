"use client";

import { cn } from "@/lib/utils";
import { NS_NODES, nsNodeById } from "../nervous-model";
import type { NsNodeId } from "../types";

interface NsOrganizationProps {
  activeId: NsNodeId | null;
  onSelect: (id: NsNodeId | null) => void;
}

// Rows of the tree, top to bottom, matching the parent/child structure in the model.
const ROWS: NsNodeId[][] = [
  ["nervous-system"],
  ["cns", "pns"],
  ["brain", "spinal-cord", "somatic", "autonomic"],
  ["sympathetic", "parasympathetic"],
];

function NodeChip({
  id,
  activeId,
  onSelect,
}: {
  id: NsNodeId;
  activeId: NsNodeId | null;
  onSelect: (id: NsNodeId | null) => void;
}) {
  const node = nsNodeById(id);
  const active = activeId === id;
  return (
    <button
      type="button"
      onClick={() => onSelect(active ? null : id)}
      className={cn(
        "flex flex-col items-center rounded-xl border px-3 py-2 text-center transition-colors",
        active
          ? "border-subject-biology bg-subject-biology text-paper dark:text-chalkboard"
          : "border-ink/15 bg-white/70 text-ink hover:border-ink/30 dark:border-bone/20 dark:bg-white/[0.04] dark:text-bone dark:hover:border-bone/30",
      )}
    >
      <span className="text-xs font-semibold leading-tight">{node.label}</span>
      {node.sublabel ? (
        <span
          className={cn(
            "mt-0.5 text-[10px] font-medium",
            active ? "text-paper/80 dark:text-chalkboard/80" : "text-ink-soft dark:text-bone-soft",
          )}
        >
          {node.sublabel}
        </span>
      ) : null}
    </button>
  );
}

export function NsOrganization({ activeId, onSelect }: NsOrganizationProps) {
  const active = activeId ? nsNodeById(activeId) : null;

  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
        Nervous System Organization
      </p>

      <div className="mt-4 flex flex-col items-center gap-3">
        {ROWS.map((row, i) => (
          <div key={i} className="flex w-full flex-wrap items-center justify-center gap-2">
            {row.map((id) => (
              <NodeChip key={id} id={id} activeId={activeId} onSelect={onSelect} />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-3 min-h-[2.5rem] text-center">
        <p className="text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
          {active
            ? active.description
            : "Click a box to see what that part of the nervous system does."}
        </p>
      </div>
    </div>
  );
}
