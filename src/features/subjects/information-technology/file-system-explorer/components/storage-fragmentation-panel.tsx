"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { FRAGMENTATION_NOTE, KB_PER_BLOCK, buildStorageBlocks, type StorageBlock, type VirtualFolder } from "../model";

const BLOCK_COLORS: Record<string, string> = {};
const PALETTE = ["#2563eb", "#16a34a", "#d97706", "#dc2626", "#7c3aed", "#0891b2", "#be185d", "#65a30d"];

function colorForFile(fileId: string): string {
  if (!BLOCK_COLORS[fileId]) {
    const idx = Object.keys(BLOCK_COLORS).length % PALETTE.length;
    BLOCK_COLORS[fileId] = PALETTE[idx]!;
  }
  return BLOCK_COLORS[fileId]!;
}

interface StorageFragmentationPanelProps {
  root: VirtualFolder;
}

export function StorageFragmentationPanel({ root }: StorageFragmentationPanelProps) {
  const blocks: StorageBlock[] = useMemo(() => buildStorageBlocks(root), [root]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  const fileGroups = useMemo(() => {
    const groups = new Map<string, { name: string; blockCount: number; runs: number }>();
    let lastFileId: string | null = null;
    blocks.forEach((b) => {
      if (!b.fileId) { lastFileId = null; return; }
      const existing = groups.get(b.fileId);
      if (existing) {
        existing.blockCount += 1;
        if (lastFileId !== b.fileId) existing.runs += 1;
      } else {
        groups.set(b.fileId, { name: b.fileName ?? b.fileId, blockCount: 1, runs: 1 });
      }
      lastFileId = b.fileId;
    });
    return groups;
  }, [blocks]);

  const selectedInfo = selectedFileId ? fileGroups.get(selectedFileId) : null;

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-ink-soft dark:text-bone-soft">
        Storage is divided into fixed-size blocks ({KB_PER_BLOCK} KB each in this simulator). Each colored block below belongs to one file; click a file&apos;s blocks to see whether they&apos;re stored together or split apart.
      </p>

      <div className="grid grid-cols-6 gap-1.5 rounded-card border border-line bg-ink/[0.02] p-4 sm:grid-cols-8 dark:border-line-dark dark:bg-bone/[0.03]">
        {blocks.map((b) => (
          <button
            key={b.id}
            onClick={() => b.fileId && setSelectedFileId(b.fileId === selectedFileId ? null : b.fileId)}
            title={b.status === "free" ? "Free block" : `${b.fileName} — block ${b.index}`}
            style={b.status === "used" && b.fileId ? { backgroundColor: colorForFile(b.fileId) } : undefined}
            className={cn(
              "flex aspect-square items-center justify-center rounded-sm text-[9px] font-mono text-paper transition-transform",
              b.status === "free" && "border border-dashed border-ink/20 bg-transparent text-ink-soft dark:border-bone/20 dark:text-bone-soft",
              b.fileId && selectedFileId === b.fileId && "scale-110 ring-2 ring-ink dark:ring-bone",
            )}
          >
            {b.index}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {Array.from(fileGroups.entries()).map(([fileId, info]) => (
          <button
            key={fileId}
            onClick={() => setSelectedFileId(fileId === selectedFileId ? null : fileId)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
              selectedFileId === fileId ? "border-ink dark:border-bone" : "border-line dark:border-line-dark",
            )}
          >
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: colorForFile(fileId) }} />
            {info.name}
            {info.runs > 1 && <span className="text-amber-600 dark:text-amber-400">· split</span>}
          </button>
        ))}
      </div>

      {selectedInfo && (
        <div className="rounded-card bg-ink/[0.03] p-4 text-sm dark:bg-bone/[0.05]">
          <p className="font-medium text-ink dark:text-bone">{selectedInfo.name}</p>
          <p className="mt-1 text-ink-soft dark:text-bone-soft">
            Uses {selectedInfo.blockCount} block{selectedInfo.blockCount === 1 ? "" : "s"}, stored in {selectedInfo.runs} separate run{selectedInfo.runs === 1 ? "" : "s"}.
            {selectedInfo.runs > 1
              ? " Its data is fragmented across non-adjacent storage locations."
              : " Its data sits in one contiguous run — not fragmented."}
          </p>
        </div>
      )}

      <p className="text-xs text-ink-soft dark:text-bone-soft">{FRAGMENTATION_NOTE}</p>
    </div>
  );
}
