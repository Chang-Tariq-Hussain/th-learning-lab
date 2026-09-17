"use client";

import { useMemo, useState } from "react";
import { ChevronRight, ChevronDown, Folder, File as FileIcon, FolderPlus, FilePlus, Pencil, Trash2, MoveRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  searchFileSystem,
  type VirtualFolder,
  type VirtualNode,
} from "../model";

interface FileTreeProps {
  root: VirtualFolder;
  onChange: (root: VirtualFolder) => void;
  selectedPathIds: string[];
  onSelect: (pathIds: string[]) => void;
}

/** Deep-clones the tree and returns a mutator so every edit stays
 *  pure/immutable at the call site, matching the rest of the app's
 *  convention of plain functional updates over mutation. */
function cloneTree(root: VirtualFolder): VirtualFolder {
  return JSON.parse(JSON.stringify(root));
}

function findFolderByPath(root: VirtualFolder, pathIds: string[]): VirtualFolder | null {
  let current: VirtualNode = root;
  for (const id of pathIds) {
    if (current.kind !== "folder") return null;
    const next: VirtualNode | undefined = current.children.find((c) => c.id === id);
    if (!next) return null;
    current = next;
  }
  return current.kind === "folder" ? current : null;
}

function removeNode(root: VirtualFolder, pathIds: string[]): VirtualNode | null {
  if (pathIds.length === 0) return null;
  const parentPath = pathIds.slice(0, -1);
  const targetId = pathIds[pathIds.length - 1];
  const parent = findFolderByPath(root, parentPath);
  if (!parent || !targetId) return null;
  const idx = parent.children.findIndex((c) => c.id === targetId);
  if (idx === -1) return null;
  const [removed] = parent.children.splice(idx, 1);
  return removed ?? null;
}

let idCounter = 100000;
function nextId(prefix: string) {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

export function FileTree({ root, onChange, selectedPathIds, onSelect }: FileTreeProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["root"]));
  const [query, setQuery] = useState("");
  const [moveSource, setMoveSource] = useState<string[] | null>(null);

  const searchResults = useMemo(() => (query ? searchFileSystem(root, query) : []), [root, query]);
  const highlightedIds = useMemo(() => new Set(searchResults.map((r) => r.node.id)), [searchResults]);

  const toggle = (id: string) => {
    setExpanded((e) => {
      const next = new Set(e);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedFolder = (() => {
    const node = findFolderByPath(root, selectedPathIds);
    return node ?? root;
  })();
  const selectionIsFolder = selectedFolder && (selectedPathIds.length === 0 || findFolderByPath(root, selectedPathIds) !== null);

  const createFolder = () => {
    const next = cloneTree(root);
    const target = findFolderByPath(next, selectionIsFolder ? selectedPathIds : selectedPathIds.slice(0, -1));
    if (!target) return;
    target.children.push({ kind: "folder", id: nextId("folder"), name: "New Folder", children: [] });
    onChange(next);
  };

  const createFile = () => {
    const next = cloneTree(root);
    const target = findFolderByPath(next, selectionIsFolder ? selectedPathIds : selectedPathIds.slice(0, -1));
    if (!target) return;
    target.children.push({
      kind: "file",
      id: nextId("file"),
      name: "new-file.txt",
      size: 4,
      createdLabel: "Just now",
      modifiedLabel: "Just now",
      permissions: { read: true, write: true, execute: false },
      blockIds: [],
    });
    onChange(next);
  };

  const rename = () => {
    if (selectedPathIds.length === 0) return;
    const currentNode = (() => {
      let cur: VirtualNode = root;
      for (const id of selectedPathIds) {
        if (cur.kind !== "folder") return null;
        const n: VirtualNode | undefined = cur.children.find((c) => c.id === id);
        if (!n) return null;
        cur = n;
      }
      return cur;
    })();
    if (!currentNode) return;
    const newName = window.prompt("Rename to:", currentNode.name);
    if (!newName || !newName.trim()) return;
    const next = cloneTree(root);
    const parent = findFolderByPath(next, selectedPathIds.slice(0, -1));
    const target = parent?.children.find((c) => c.id === selectedPathIds[selectedPathIds.length - 1]);
    if (target) target.name = newName.trim();
    onChange(next);
  };

  const remove = () => {
    if (selectedPathIds.length === 0) return;
    const next = cloneTree(root);
    removeNode(next, selectedPathIds);
    onChange(next);
    onSelect(selectedPathIds.slice(0, -1));
  };

  const beginMove = () => {
    if (selectedPathIds.length === 0) return;
    setMoveSource(selectedPathIds);
  };

  const completeMoveHere = () => {
    if (!moveSource) return;
    const next = cloneTree(root);
    const moved = removeNode(next, moveSource);
    if (!moved) { setMoveSource(null); return; }
    const destination = findFolderByPath(next, selectedPathIds);
    if (destination && destination.kind === "folder") {
      destination.children.push(moved);
      onChange(next);
      onSelect([...selectedPathIds, moved.id]);
    }
    setMoveSource(null);
  };

  const renderNode = (node: VirtualNode, pathIds: string[], depth: number) => {
    const isSelected = selectedPathIds.join("/") === pathIds.join("/");
    const isHighlighted = query.length > 0 && highlightedIds.has(node.id);
    const isExpanded = expanded.has(node.id);

    return (
      <div key={node.id}>
        <button
          onClick={() => {
            onSelect(pathIds);
            if (node.kind === "folder") toggle(node.id);
          }}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          className={cn(
            "flex w-full items-center gap-1.5 rounded-md py-1.5 pr-2 text-left text-sm transition-colors",
            isSelected
              ? "bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
              : "text-ink hover:bg-ink/5 dark:text-bone dark:hover:bg-bone/10",
            isHighlighted && !isSelected && "bg-amber-100 dark:bg-amber-900/30",
          )}
        >
          {node.kind === "folder" ? (
            <>
              {isExpanded ? <ChevronDown className="h-3.5 w-3.5 shrink-0" /> : <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
              <Folder className="h-4 w-4 shrink-0 text-subject-it" />
            </>
          ) : (
            <>
              <span className="w-3.5 shrink-0" />
              <FileIcon className="h-4 w-4 shrink-0 text-ink-soft dark:text-bone-soft" />
            </>
          )}
          <span className="truncate">{node.name}</span>
        </button>
        {node.kind === "folder" && isExpanded && (
          <div>
            {node.children.map((child) => renderNode(child, [...pathIds, child.id], depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 rounded-md border border-line px-2.5 dark:border-line-dark">
        <Search className="h-3.5 w-3.5 shrink-0 text-ink-soft dark:text-bone-soft" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search files and folders…"
          className="h-9 w-full bg-transparent text-sm text-ink outline-none dark:text-bone"
        />
      </div>
      {query && (
        <p className="text-xs text-ink-soft dark:text-bone-soft">
          {searchResults.length === 0 ? "No matches." : `${searchResults.length} match${searchResults.length === 1 ? "" : "es"} highlighted below.`}
        </p>
      )}

      <div className="flex flex-wrap gap-1.5">
        <button onClick={createFolder} className="inline-flex h-8 items-center gap-1 rounded-full border border-line px-2.5 text-xs font-medium text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40">
          <FolderPlus className="h-3.5 w-3.5" /> New folder
        </button>
        <button onClick={createFile} className="inline-flex h-8 items-center gap-1 rounded-full border border-line px-2.5 text-xs font-medium text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40">
          <FilePlus className="h-3.5 w-3.5" /> New file
        </button>
        <button onClick={rename} disabled={selectedPathIds.length === 0} className="inline-flex h-8 items-center gap-1 rounded-full border border-line px-2.5 text-xs font-medium text-ink hover:border-ink/40 disabled:opacity-40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40">
          <Pencil className="h-3.5 w-3.5" /> Rename
        </button>
        <button onClick={remove} disabled={selectedPathIds.length === 0} className="inline-flex h-8 items-center gap-1 rounded-full border border-line px-2.5 text-xs font-medium text-ink hover:border-ink/40 disabled:opacity-40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40">
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </button>
        {moveSource ? (
          <button onClick={completeMoveHere} className="inline-flex h-8 items-center gap-1 rounded-full bg-subject-it px-2.5 text-xs font-medium text-paper hover:opacity-90">
            <MoveRight className="h-3.5 w-3.5" /> Move here
          </button>
        ) : (
          <button onClick={beginMove} disabled={selectedPathIds.length === 0} className="inline-flex h-8 items-center gap-1 rounded-full border border-line px-2.5 text-xs font-medium text-ink hover:border-ink/40 disabled:opacity-40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40">
            <MoveRight className="h-3.5 w-3.5" /> Move…
          </button>
        )}
      </div>
      {moveSource && (
        <p className="text-xs text-ink-soft dark:text-bone-soft">
          Moving <span className="font-mono">{findNodeInPath(root, moveSource, moveSource[moveSource.length - 1] ?? "")?.name ?? "item"}</span> — select a destination folder, then click &quot;Move here&quot;.
        </p>
      )}

      <div className="max-h-80 overflow-y-auto rounded-md border border-line p-1 dark:border-line-dark" role="tree" aria-label="Virtual file system">
        <button
          onClick={() => onSelect([])}
          className={cn(
            "flex w-full items-center gap-1.5 rounded-md py-1.5 px-2 text-left text-sm font-medium",
            selectedPathIds.length === 0 ? "bg-subject-it-soft text-subject-it dark:bg-subject-it/20" : "text-ink hover:bg-ink/5 dark:text-bone dark:hover:bg-bone/10",
          )}
        >
          <Folder className="h-4 w-4 text-subject-it" /> {root.name}
        </button>
        {root.children.map((child) => renderNode(child, [child.id], 1))}
      </div>
    </div>
  );
}

function findNodeInPath(root: VirtualFolder, pathIds: string[], targetId: string): VirtualNode | null {
  let current: VirtualNode = root;
  for (const id of pathIds) {
    if (current.kind !== "folder") return null;
    const next: VirtualNode | undefined = current.children.find((c) => c.id === id);
    if (!next) return null;
    current = next;
    if (id === targetId) return current;
  }
  return null;
}
