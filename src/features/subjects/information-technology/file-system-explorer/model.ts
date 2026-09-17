/**
 * Conceptual model for the File System Explorer (the "File System
 * Laboratory").
 *
 * Everything here is a self-contained virtual file system — nothing
 * touches the student's real computer. Structure and content are
 * fictional but realistic, matching how a simplified Unix-style tree
 * is commonly taught.
 *
 * This connects to, but does not duplicate:
 *  - CPU–RAM–Storage Data Flow: that topic shows storage as one stop
 *    in the CPU/RAM/storage pipeline; this topic zooms into how the
 *    file system organizes what's ON storage.
 *  - Memory Management Simulator: the Open/Save flows below refer to
 *    data moving into/out of RAM, without re-teaching allocation.
 *
 * IMPORTANT accuracy notes, surfaced directly in the UI:
 *  - This is explicitly a SIMPLIFIED FILE SYSTEM MODEL, not a
 *    reproduction of NTFS, ext4, APFS, or any other specific real
 *    file system.
 *  - Deleting a file does not claim to immediately erase its
 *    underlying bytes — only that the file system's own bookkeeping
 *    is updated and the space is made available for reuse.
 *  - Opening a file does not claim the entire file is always loaded
 *    into RAM at once.
 *  - File extensions are shown as a hint to file type, never as a
 *    guarantee of a file's actual contents or safety.
 */

// ---------------------------------------------------------------------------
// Virtual file system tree
// ---------------------------------------------------------------------------

export interface FilePermissions {
  read: boolean;
  write: boolean;
  execute: boolean;
}

export interface VirtualFile {
  kind: "file";
  id: string;
  name: string;
  /** Size, in KB. */
  size: number;
  createdLabel: string;
  modifiedLabel: string;
  permissions: FilePermissions;
  /** Storage block ids this file's data occupies — see `storage.ts`-style
   *  data below. Populated by `assignStorageBlocks`. */
  blockIds: string[];
}

export interface VirtualFolder {
  kind: "folder";
  id: string;
  name: string;
  children: VirtualNode[];
}

export type VirtualNode = VirtualFile | VirtualFolder;

let idCounter = 0;
function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

function file(name: string, size: number, opts?: Partial<Pick<VirtualFile, "permissions" | "createdLabel" | "modifiedLabel">>): VirtualFile {
  return {
    kind: "file",
    id: nextId("file"),
    name,
    size,
    createdLabel: opts?.createdLabel ?? "Earlier this week",
    modifiedLabel: opts?.modifiedLabel ?? "Earlier this week",
    permissions: opts?.permissions ?? { read: true, write: true, execute: false },
    blockIds: [],
  };
}

function folder(name: string, children: VirtualNode[]): VirtualFolder {
  return { kind: "folder", id: nextId("folder"), name, children };
}

/** A fresh copy of the starting virtual file system. A function
 *  (not a constant) so every simulator session gets independent,
 *  non-shared node ids and can be reset cleanly. */
export function createInitialFileSystem(): VirtualFolder {
  return folder("/", [
    folder("Users", [
      folder("Student", [
        folder("Documents", [
          file("report.txt", 12),
          file("essay-draft.docx", 48),
          file("budget.csv", 6),
        ]),
        folder("Pictures", [
          file("vacation.jpg", 2400),
          file("profile-photo.png", 850),
        ]),
        folder("Downloads", [
          file("installer.exe", 15200, { permissions: { read: true, write: true, execute: true } }),
          file("song.mp3", 4100),
          file("notes.pdf", 320),
        ]),
      ]),
    ]),
    folder("Programs", [
      file("editor.exe", 22000, { permissions: { read: true, write: false, execute: true } }),
      file("browser.exe", 48000, { permissions: { read: true, write: false, execute: true } }),
    ]),
    folder("System", [
      file("kernel.sys", 9800, { permissions: { read: true, write: false, execute: true } }),
      file("config.sys", 4, { permissions: { read: true, write: false, execute: false } }),
    ]),
  ]);
}

// ---------------------------------------------------------------------------
// Path helpers
// ---------------------------------------------------------------------------

/** Finds a node by walking a path of node ids from the root down —
 *  the same "breadcrumb trail" the tree UI keeps as it navigates. */
export function findNodeByPath(root: VirtualFolder, pathIds: string[]): VirtualNode | null {
  let current: VirtualNode = root;
  for (const id of pathIds) {
    if (current.kind !== "folder") return null;
    const next: VirtualNode | undefined = current.children.find((c) => c.id === id);
    if (!next) return null;
    current = next;
  }
  return current;
}

/** Builds the human-readable Unix-style path string for a chain of
 *  nodes from root to the target (inclusive). */
export function pathToString(nodes: VirtualNode[], style: PathStyle = "unix"): string {
  const names = nodes.map((n) => n.name).filter((n) => n !== "/");
  if (style === "unix") {
    return "/" + names.join("/");
  }
  return "C:\\" + names.join("\\");
}

export type PathStyle = "unix" | "windows";

export const PATH_STYLE_EXAMPLES: Record<PathStyle, string> = {
  unix: "/Users/Student/Documents/report.txt",
  windows: "C:\\Users\\Student\\Documents\\report.txt",
};

// ---------------------------------------------------------------------------
// File extensions
// ---------------------------------------------------------------------------

export interface ExtensionInfo {
  extension: string;
  typicalContent: string;
  note: string;
}

export const EXTENSION_REFERENCE: ExtensionInfo[] = [
  { extension: ".txt", typicalContent: "Plain text", note: "No formatting — just characters." },
  { extension: ".docx", typicalContent: "Word processor document", note: "Text plus formatting, images, styles." },
  { extension: ".csv", typicalContent: "Comma-separated tabular data", note: "Plain text, structured as rows and columns." },
  { extension: ".jpg / .png", typicalContent: "Image", note: "Compressed (.jpg) or lossless (.png) pixel data." },
  { extension: ".mp3", typicalContent: "Compressed audio", note: "Audio data, not readable as text." },
  { extension: ".pdf", typicalContent: "Portable document", note: "Fixed-layout text/graphics for consistent viewing." },
  { extension: ".exe", typicalContent: "Executable program", note: "Machine code the OS can run directly." },
  { extension: ".sys", typicalContent: "System file", note: "Used internally by the operating system." },
];

export const EXTENSION_DISCLAIMER =
  "An extension is a naming convention and a hint to the operating system about how to open a file — it does not guarantee what the file actually contains, and it does not by itself make a file safe or unsafe to run.";

// ---------------------------------------------------------------------------
// Storage blocks (conceptual — not tied to any specific file system)
// ---------------------------------------------------------------------------

export interface StorageBlock {
  id: string;
  index: number;
  status: "free" | "used";
  fileId?: string;
  fileName?: string;
}

export const TOTAL_STORAGE_BLOCKS = 24;
export const KB_PER_BLOCK = 500;

/** Assigns storage blocks to every file in the tree, in a fixed,
 *  deliberately non-contiguous pattern for a couple of files — so
 *  the Storage & Fragmentation tab has something real to show
 *  without requiring the student to have done anything first. */
export function buildStorageBlocks(root: VirtualFolder): StorageBlock[] {
  const blocks: StorageBlock[] = Array.from({ length: TOTAL_STORAGE_BLOCKS }, (_, i) => ({
    id: `storage-${i}`,
    index: i,
    status: "free",
  }));

  const allFiles: VirtualFile[] = [];
  const walk = (node: VirtualNode) => {
    if (node.kind === "file") allFiles.push(node);
    else node.children.forEach(walk);
  };
  walk(root);

  // Deterministic assignment: most files get contiguous runs sized
  // by how many blocks their KB size needs; a couple are
  // deliberately split into two runs to demonstrate fragmentation.
  let cursor = 0;
  const fragmentedNames = new Set(["vacation.jpg", "song.mp3"]);
  for (const f of allFiles) {
    const blocksNeeded = Math.max(1, Math.ceil(f.size / KB_PER_BLOCK));
    if (cursor + blocksNeeded > TOTAL_STORAGE_BLOCKS) continue; // demo dataset always fits

    if (fragmentedNames.has(f.name) && blocksNeeded > 1) {
      const firstRun = Math.ceil(blocksNeeded / 2);
      for (let i = 0; i < firstRun; i++) {
        const block = blocks[cursor]!;
        block.status = "used";
        block.fileId = f.id;
        block.fileName = f.name;
        f.blockIds.push(block.id);
        cursor++;
      }
      cursor += 1; // leave a gap, forcing the rest elsewhere
      const secondRun = blocksNeeded - firstRun;
      for (let i = 0; i < secondRun && cursor < TOTAL_STORAGE_BLOCKS; i++) {
        const block = blocks[cursor]!;
        block.status = "used";
        block.fileId = f.id;
        block.fileName = f.name;
        f.blockIds.push(block.id);
        cursor++;
      }
    } else {
      for (let i = 0; i < blocksNeeded; i++) {
        const block = blocks[cursor]!;
        block.status = "used";
        block.fileId = f.id;
        block.fileName = f.name;
        f.blockIds.push(block.id);
        cursor++;
      }
    }
  }
  return blocks;
}

export const FRAGMENTATION_NOTE =
  "A file's data can conceptually be stored across multiple, non-adjacent storage locations depending on the file system and how free space was available when it was written — not every file system behaves identically, and this is a simplified illustration rather than a specific format's real layout.";

// ---------------------------------------------------------------------------
// File system organization (simplified model)
// ---------------------------------------------------------------------------

export interface OrganizationConcept {
  id: string;
  title: string;
  description: string;
}

export const ORGANIZATION_CONCEPTS: OrganizationConcept[] = [
  { id: "directory-entries", title: "Directory entries", description: "A record linking a file's name (as shown in the tree) to where its information is stored." },
  { id: "file-metadata", title: "File metadata", description: "Size, type, timestamps, and permissions — kept separately from the file's actual content." },
  { id: "allocation-info", title: "Allocation information", description: "Which storage blocks actually hold this file's data — see the Storage & Fragmentation tab." },
  { id: "free-space-info", title: "Free-space information", description: "A record of which storage blocks are currently unused, so the file system knows where new data can go." },
];

export const ORGANIZATION_DISCLAIMER =
  "Simplified File System Model. Real file systems such as NTFS, ext4, and APFS implement these same general ideas very differently from each other and from this simulator — this shows the kind of information every file system tracks, not an exact structure any one of them uses.";

// ---------------------------------------------------------------------------
// File operations: Open / Save / Delete
// ---------------------------------------------------------------------------

export interface OperationStep {
  id: string;
  title: string;
  description: string;
}

export const OPEN_FILE_STEPS: OperationStep[] = [
  { id: "open-1", title: "User opens a file", description: "The user or an application requests to open a specific file, identified by its path." },
  { id: "open-2", title: "OS / file system locates it", description: "The file system looks up the file's directory entry to find its metadata and allocation information." },
  { id: "open-3", title: "Identify storage locations", description: "The file system determines exactly which storage blocks hold the file's data (see Storage & Fragmentation)." },
  { id: "open-4", title: "Read data from storage", description: "The needed data is read from persistent storage. The OS/application may read only the portions actually needed right now, not necessarily the whole file at once." },
  { id: "open-5", title: "Move data into memory", description: "The data that's read is placed into RAM — connecting to the Memory Management Simulator's allocated process memory." },
  { id: "open-6", title: "Application uses the data", description: "The requesting application now works with the data from RAM, not directly from storage." },
];

export const SAVE_FILE_STEPS: OperationStep[] = [
  { id: "save-1", title: "Application has data to save", description: "The application holds data in memory (RAM) that the user wants to persist." },
  { id: "save-2", title: "Request sent to the OS", description: "The application asks the operating system to write this data to a specific file path." },
  { id: "save-3", title: "File system finds space", description: "If the file is new or growing, the file system finds free storage blocks for the data (its own allocation step, similar in spirit to Memory Management's allocation)." },
  { id: "save-4", title: "Data written to storage", description: "The data is written to those storage blocks. Buffering and caching mean the exact moment data is fully persisted can vary." },
  { id: "save-5", title: "Directory entry updated", description: "The file's metadata and allocation information are updated to reflect the new or changed data." },
];

export const DELETE_FILE_STEPS: OperationStep[] = [
  { id: "delete-1", title: "User deletes a file", description: "The user requests that a file be removed." },
  { id: "delete-2", title: "Directory entry removed", description: "The file system removes (or marks removed) the directory entry connecting the name to its data." },
  { id: "delete-3", title: "Storage blocks marked free", description: "The blocks that held the file's data are marked as available for reuse in the free-space information." },
  { id: "delete-4", title: "Underlying bytes may still exist", description: "The actual bytes are not necessarily erased immediately — they simply aren't tracked as belonging to a file anymore, and may be overwritten later when that space is reused." },
];

export const OPEN_LOAD_DISCLAIMER =
  "Opening a file does not always mean the entire file is loaded into RAM at once — the OS or application may read only the portions currently needed.";

export const DELETE_DISCLAIMER =
  "Deleting a file updates the file system's own bookkeeping and frees its storage space for reuse — it does not claim the underlying bytes are immediately, physically erased.";

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

export interface SearchResult {
  node: VirtualNode;
  pathIds: string[];
  pathNames: string[];
}

export function searchFileSystem(root: VirtualFolder, query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results: SearchResult[] = [];

  const walk = (node: VirtualNode, pathIds: string[], pathNames: string[]) => {
    if (node.name.toLowerCase().includes(q)) {
      results.push({ node, pathIds, pathNames });
    }
    if (node.kind === "folder") {
      node.children.forEach((child) => walk(child, [...pathIds, child.id], [...pathNames, child.name]));
    }
  };
  root.children.forEach((child) => walk(child, [child.id], [child.name]));
  return results;
}

// ---------------------------------------------------------------------------
// Misc
// ---------------------------------------------------------------------------

export const FILE_SYSTEM_DISCLAIMER =
  "Simplified educational model. This virtual file system is entirely self-contained and never accesses your real computer's files — real file systems track and organize data with more detail and nuance than shown here, and specifics vary between systems.";
