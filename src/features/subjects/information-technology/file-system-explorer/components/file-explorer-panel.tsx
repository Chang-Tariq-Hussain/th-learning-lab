"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { PathStyle, VirtualFolder } from "../model";
import { FileTree } from "./file-tree";
import { FileInspector } from "./file-inspector";

interface FileExplorerPanelProps {
  root: VirtualFolder;
  onChange: (root: VirtualFolder) => void;
  selectedPathIds: string[];
  onSelect: (pathIds: string[]) => void;
  onTogglePermission: (pathIds: string[], key: "read" | "write" | "execute") => void;
}

export function FileExplorerPanel({ root, onChange, selectedPathIds, onSelect, onTogglePermission }: FileExplorerPanelProps) {
  const [pathStyle, setPathStyle] = useState<PathStyle>("unix");

  return (
    <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
      <FileTree root={root} onChange={onChange} selectedPathIds={selectedPathIds} onSelect={onSelect} />
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-ink dark:text-bone">Inspector</p>
          <div className="flex gap-1">
            {(["unix", "windows"] as PathStyle[]).map((s) => (
              <button
                key={s}
                onClick={() => setPathStyle(s)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize",
                  pathStyle === s
                    ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                    : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
                )}
              >
                {s === "unix" ? "Unix path" : "Windows path"}
              </button>
            ))}
          </div>
        </div>
        <FileInspector root={root} pathIds={selectedPathIds} pathStyle={pathStyle} onTogglePermission={onTogglePermission} />
      </div>
    </div>
  );
}
