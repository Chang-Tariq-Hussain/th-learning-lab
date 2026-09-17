"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { FileExplorerPanel } from "./components/file-explorer-panel";
import { PathsExtensionsPanel } from "./components/paths-extensions-panel";
import { StorageFragmentationPanel } from "./components/storage-fragmentation-panel";
import { FileOperationsLab } from "./components/file-operations-lab";
import { FILE_SYSTEM_DISCLAIMER, createInitialFileSystem, type VirtualFile, type VirtualFolder, type VirtualNode } from "./model";

type TabMode = "explorer" | "paths" | "storage" | "operations";

const TABS: { id: TabMode; label: string; blurb: string }[] = [
  {
    id: "explorer",
    label: "File Explorer",
    blurb: "Navigate, create, rename, move, and delete files and folders in a virtual file system, and inspect metadata and permissions.",
  },
  {
    id: "paths",
    label: "Paths & Extensions",
    blurb: "See how file paths are built, compare Unix-style and Windows-style syntax, and look up common file extensions.",
  },
  {
    id: "storage",
    label: "Storage & Fragmentation",
    blurb: "See which storage blocks each file actually occupies — and which files are split across non-adjacent blocks.",
  },
  {
    id: "operations",
    label: "File Operations",
    blurb: "Step through what happens, stage by stage, when a file is opened, saved, or deleted.",
  },
];

/**
 * The "File System Laboratory" — entirely self-contained virtual file
 * system (never touches the student's real files), 2D throughout per
 * brief guidance. Connects to, but doesn't duplicate, the
 * CPU–RAM–Storage Data Flow simulation: that topic shows storage as
 * one stop in a bigger pipeline; this topic zooms into how a file
 * system organizes what's actually on it.
 */
export function FileSystemExplorer() {
  const [tab, setTab] = useState<TabMode>("explorer");
  const [root, setRoot] = useState<VirtualFolder>(() => createInitialFileSystem());
  const [selectedPathIds, setSelectedPathIds] = useState<string[]>([]);

  const togglePermission = (pathIds: string[], key: "read" | "write" | "execute") => {
    setRoot((prev) => {
      const next: VirtualFolder = JSON.parse(JSON.stringify(prev));
      const target = resolveFile(next, pathIds);
      if (target) target.permissions[key] = !target.permissions[key];
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="File System Laboratory mode">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              tab === t.id
                ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p className="text-sm text-ink-soft dark:text-bone-soft">{TABS.find((t) => t.id === tab)!.blurb}</p>

      <div className="rounded-card border border-line bg-paper p-3 dark:border-line-dark dark:bg-chalkboard sm:p-5">
        {tab === "explorer" && (
          <FileExplorerPanel
            root={root}
            onChange={setRoot}
            selectedPathIds={selectedPathIds}
            onSelect={setSelectedPathIds}
            onTogglePermission={togglePermission}
          />
        )}
        {tab === "paths" && <PathsExtensionsPanel />}
        {tab === "storage" && <StorageFragmentationPanel root={root} />}
        {tab === "operations" && <FileOperationsLab />}
      </div>

      <p className="text-xs text-ink-soft dark:text-bone-soft">{FILE_SYSTEM_DISCLAIMER}</p>
    </div>
  );
}

function resolveFile(root: VirtualFolder, pathIds: string[]): VirtualFile | null {
  let node: VirtualNode = root;
  for (const id of pathIds) {
    if (node.kind !== "folder") return null;
    const next: VirtualNode | undefined = node.children.find((c) => c.id === id);
    if (!next) return null;
    node = next;
  }
  return node.kind === "file" ? node : null;
}
