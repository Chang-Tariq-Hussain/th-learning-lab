"use client";

import { cn } from "@/lib/utils";
import { pathToString, type PathStyle, type VirtualFolder, type VirtualNode } from "../model";

interface FileInspectorProps {
  root: VirtualFolder;
  pathIds: string[];
  pathStyle: PathStyle;
  onTogglePermission: (pathIds: string[], key: "read" | "write" | "execute") => void;
}

function resolveChain(root: VirtualFolder, pathIds: string[]): VirtualNode[] {
  const chain: VirtualNode[] = [root];
  let current: VirtualNode = root;
  for (const id of pathIds) {
    if (current.kind !== "folder") break;
    const next: VirtualNode | undefined = current.children.find((c) => c.id === id);
    if (!next) break;
    chain.push(next);
    current = next;
  }
  return chain;
}

export function FileInspector({ root, pathIds, pathStyle, onTogglePermission }: FileInspectorProps) {
  const chain = resolveChain(root, pathIds);
  const node = chain[chain.length - 1];

  if (!node) return null;

  return (
    <div className="rounded-card bg-ink/[0.03] p-4 dark:bg-bone/[0.05]">
      <p className="mb-1 text-xs font-mono uppercase tracking-wide text-subject-it">{node.kind === "folder" ? "Folder" : "File"}</p>
      <p className="text-sm font-medium text-ink dark:text-bone">{node.name}</p>
      <p className="mt-1 font-mono text-xs text-ink-soft dark:text-bone-soft">{pathToString(chain, pathStyle)}</p>

      {node.kind === "file" && (
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
          <span className="text-ink-soft dark:text-bone-soft">Type</span>
          <span className="text-ink dark:text-bone">{node.name.includes(".") ? node.name.slice(node.name.lastIndexOf(".")) : "No extension"}</span>
          <span className="text-ink-soft dark:text-bone-soft">Size</span>
          <span className="text-ink dark:text-bone">{node.size >= 1000 ? `${(node.size / 1000).toFixed(1)} MB` : `${node.size} KB`}</span>
          <span className="text-ink-soft dark:text-bone-soft">Created</span>
          <span className="text-ink dark:text-bone">{node.createdLabel}</span>
          <span className="text-ink-soft dark:text-bone-soft">Modified</span>
          <span className="text-ink dark:text-bone">{node.modifiedLabel}</span>
          <span className="text-ink-soft dark:text-bone-soft">Storage blocks</span>
          <span className="font-mono text-ink dark:text-bone">{node.blockIds.length || "—"}</span>
        </div>
      )}

      {node.kind === "folder" && (
        <p className="mt-3 text-sm text-ink-soft dark:text-bone-soft">{node.children.length} item{node.children.length === 1 ? "" : "s"} inside.</p>
      )}

      {node.kind === "file" && (
        <div className="mt-4">
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-ink-soft dark:text-bone-soft">Permissions</p>
          <div className="flex gap-2">
            {(["read", "write", "execute"] as const).map((perm) => (
              <button
                key={perm}
                onClick={() => onTogglePermission(pathIds, perm)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium capitalize",
                  node.permissions[perm]
                    ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "border-line text-ink-soft hover:border-ink/40 dark:border-line-dark dark:text-bone-soft",
                )}
              >
                {perm} {node.permissions[perm] ? "✓" : "✗"}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
