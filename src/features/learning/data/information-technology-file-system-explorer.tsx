import type { TopicContent } from "../types";

/**
 * File System Explorer — fourth stop of the Information Technology >
 * Operating Systems sequence, after Memory Management. Connects to
 * Memory Management (Open File moves data into RAM) and to
 * CPU–RAM–Storage Data Flow (that topic shows storage as one stop in
 * a bigger pipeline; this topic zooms into how a file system
 * organizes what's actually on it) without duplicating either.
 */

const pathStructureSketch = (
  <svg viewBox="0 0 260 100" className="mx-auto h-24 w-full max-w-sm" role="img" aria-labelledby="path-structure-title">
    <title id="path-structure-title">A file path is built from root, directories, and a filename with extension.</title>
    <text x="15" y="30" className="fill-subject-it font-mono text-[11px]">/</text>
    <text x="30" y="30" className="fill-ink font-mono text-[11px] dark:fill-bone">Users</text>
    <text x="75" y="30" className="fill-ink-soft font-mono text-[11px] dark:fill-bone-soft">/</text>
    <text x="82" y="30" className="fill-ink font-mono text-[11px] dark:fill-bone">Student</text>
    <text x="140" y="30" className="fill-ink-soft font-mono text-[11px] dark:fill-bone-soft">/</text>
    <text x="147" y="30" className="fill-emerald-600 font-mono text-[11px] dark:fill-emerald-400">report.txt</text>
    <line x1="15" y1="42" x2="15" y2="55" className="stroke-ink/30 dark:stroke-bone/30" strokeWidth="1" />
    <text x="15" y="68" className="fill-ink-soft font-mono text-[8px] dark:fill-bone-soft">root</text>
    <line x1="147" y1="42" x2="147" y2="55" className="stroke-ink/30 dark:stroke-bone/30" strokeWidth="1" />
    <text x="147" y="68" className="fill-ink-soft font-mono text-[8px] dark:fill-bone-soft">filename.extension</text>
  </svg>
);

export const informationTechnologyFileSystemExplorerContent: TopicContent = {
  subjectSlug: "information-technology",
  topicSlug: "file-system-explorer",
  title: "File System Explorer",
  subjectLabel: "Information Technology",
  topicLabel: "Operating Systems",
  colorToken: "it",
  simulationHref: "/dashboard/information-technology/file-system-explorer",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Explain what a file system does: organizing files and directories on persistent storage so the OS can find them again.",
      "Read and construct file paths, and recognize the difference between Unix-style and Windows-style syntax.",
      "Explain what a file extension typically indicates, and why it isn't a guarantee of a file's actual contents.",
      "Describe how a file's data can be split across multiple, non-adjacent storage blocks — file fragmentation.",
      "Trace what happens, step by step, when a file is opened, saved, or deleted.",
      "Describe a simplified permission model (read/write/execute) for a file.",
    ],
    concepts: [
      {
        term: "Files and directories",
        explanation:
          "A file holds actual data (text, an image, a program). A directory (folder) doesn't hold data itself — it holds entries that organize files and other directories into a tree, so both people and the OS can navigate and find things.",
      },
      {
        term: "Paths",
        explanation:
          "A path describes exactly where a file or folder sits in that tree, from the root down: root → directory → subdirectory → filename. The same underlying idea is written differently by different operating systems — this simulator shows both Unix-style (/Users/Student/report.txt) and Windows-style (C:\\Users\\Student\\report.txt).",
      },
      {
        term: "File extensions",
        explanation:
          "The part of a filename after the last dot (like .txt or .jpg) is a hint the OS and applications use to guess a file's type. It's a naming convention, not a guarantee — renaming a file doesn't change what's actually inside it.",
      },
      {
        term: "File metadata",
        explanation:
          "Information ABOUT a file — its size, type, path, timestamps, and permissions — kept separately from the file's actual content, so the OS can answer questions about a file without reading through all of its data.",
      },
      {
        term: "Storage blocks and file allocation",
        explanation:
          "Persistent storage is divided into fixed-size blocks. A file's data occupies however many blocks it needs. If those blocks are next to each other, the file is stored contiguously; if not, the file is fragmented across separate locations.",
      },
      {
        term: "File system organization (simplified model)",
        explanation:
          "Every file system tracks roughly the same four kinds of information — directory entries, file metadata, allocation information, and free-space information — even though real file systems like NTFS, ext4, and APFS implement these very differently from each other.",
      },
      {
        term: "Open / Save / Delete",
        explanation:
          "Opening a file means the OS locates it, finds its storage blocks, and reads the needed data into RAM for an application to use — not necessarily the whole file at once. Saving writes data from RAM back to storage and updates the file's directory entry. Deleting removes the directory entry and frees its storage blocks for reuse — it doesn't claim the underlying bytes are immediately erased.",
      },
      {
        term: "File permissions",
        explanation:
          "A simplified read/write/execute model: read lets you view a file's contents, write lets you change them, and execute lets you run it as a program. Real permission systems vary between operating systems and file systems, and this simulator doesn't attempt cybersecurity-level depth.",
      },
    ],
    whyItMatters:
      "Every time you save a document, drag a file into a different folder, or double-click something to open it, a file system is quietly doing this exact work behind the scenes — finding space, tracking where your data lives, and updating its own records so it can find that file again later. Understanding this also explains real, sometimes confusing behavior: why a large deleted file doesn't instantly free up visible space, why a renamed file extension can trick an OS into misreading a file, and why very fragmented storage can make a slow computer feel even slower.",
    keyTerms: [
      { term: "Path", definition: "The full route to a file or folder through the directory tree, from the root." },
      { term: "Extension", definition: "The suffix after the last dot in a filename, used as a hint to file type." },
      { term: "Metadata", definition: "Information about a file — size, type, timestamps, permissions — separate from its actual content." },
      { term: "Fragmentation", definition: "A file's data stored across multiple, non-adjacent storage blocks instead of one contiguous run." },
      { term: "Permissions", definition: "Rules controlling who can read, write, or execute a file." },
    ],
    visualAids: [
      {
        id: "path-structure-sketch",
        caption: "A path is built from the root, through directories, to a filename with its extension.",
        visual: pathStructureSketch,
      },
    ],
    misconceptions: [
      {
        id: "misconception-one-fs-everywhere",
        misconception: "Every file system uses identical allocation structures.",
        correction:
          "NTFS, ext4, APFS, and others all implement directory entries, metadata, allocation, and free-space tracking very differently. This simulator's Storage & Fragmentation view is a simplified illustration, not any one real format's actual layout.",
      },
      {
        id: "misconception-delete-erases",
        misconception: "Deleting a file always immediately, physically destroys its underlying data.",
        correction:
          "Deleting typically removes the file system's own record of the file and frees its storage blocks for reuse — the bytes may still physically exist until that space is overwritten by something else later.",
      },
      {
        id: "misconception-open-loads-whole-file",
        misconception: "Opening a file always loads the entire file into RAM at once.",
        correction:
          "The OS or application may read only the portions of a file it currently needs, rather than pulling the whole thing into RAM immediately — especially for very large files.",
      },
      {
        id: "misconception-extension-guarantees-contents",
        misconception: "A file's extension guarantees what's actually inside it.",
        correction:
          "An extension is just a naming hint. Renaming report.txt to report.exe doesn't turn it into a real program — and a file's actual contents could be mislabeled, intentionally or not.",
      },
      {
        id: "misconception-one-os-structure-universal",
        misconception: "One specific operating system's file structure (like C:\\ drives) applies universally.",
        correction:
          "Path syntax is a convention of the operating system, not a universal law — Unix-like systems (Linux, macOS) use a single root (/) with forward slashes, while Windows uses drive letters and backslashes.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Before checking in the simulator, predict what happens in each situation.",
    scenarios: [
      {
        id: "it-fs-predict-001",
        scenario: "A file named vacation-photo.txt actually contains image data, not text, because someone renamed it.",
        question: "Does changing the file's extension to .txt change what's actually stored inside the file?",
        options: [
          { id: "no", label: "No — only the name changes; the actual data inside is unchanged" },
          { id: "yes", label: "Yes — the file's contents are converted to match the new extension" },
        ],
        actualResultOptionId: "no",
        explanation: "An extension is a naming hint, not a conversion. Renaming a file only changes its name — the OS or an application might misinterpret it based on the new extension, but the underlying bytes never change just from a rename.",
        hint: "Check the Paths & Extensions tab's note about what an extension actually guarantees.",
      },
      {
        id: "it-fs-predict-002",
        scenario: "A large video file is deleted from the virtual file system.",
        question: "What happens to the storage space it used?",
        options: [
          { id: "freed", label: "It's marked as free and available for reuse" },
          { id: "unusable", label: "It stays permanently unusable, since it once held data" },
        ],
        actualResultOptionId: "freed",
        explanation: "Deleting updates the file system's own bookkeeping — the directory entry is removed and the storage blocks it used are marked free, ready to be reused for new data.",
        hint: "Try the Delete step-through in File Operations.",
      },
      {
        id: "it-fs-predict-003",
        scenario: "An application opens a very large file to read just its first few lines.",
        question: "Does the OS have to load the entire file into RAM to do this?",
        options: [
          { id: "no", label: "No — it can read only the needed portion" },
          { id: "yes", label: "Yes — opening a file always loads the whole thing into RAM" },
        ],
        actualResultOptionId: "no",
        explanation: "The OS/application can read only the portions of a file currently needed, rather than always pulling the entire file into RAM — this simulator is explicit that \"opening\" doesn't mean \"load everything.\"",
        hint: "Check the Open File step-through's note in File Operations.",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "In File Explorer, click through folders, create a new file or folder, rename or delete something, and inspect its metadata and permissions on the right.",
      "Use the search box in File Explorer to find a file by name across the whole tree.",
      "In Paths & Extensions, switch between Unix-style and Windows-style path syntax for the same example file, and look up common extensions in the reference table.",
      "In Storage & Fragmentation, click on a file's colored blocks to see whether its data is stored together or split into separate runs.",
      "In File Operations, step through Open File, Save File, and Delete File one stage at a time.",
    ],
    tryThis: [
      "In File Explorer, create a folder, move an existing file into it, then check that file's updated path in the inspector.",
      "In File Explorer, toggle a file's Execute permission off and on and think about what that would mean for a real program file.",
      "In Storage & Fragmentation, find a file marked \"split\" and count how many separate runs its blocks are stored in.",
      "In File Operations, compare the Open File and Save File sequences — which steps are mirror images of each other?",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "it-fs-explain-001",
        question: "Why does a file system need both directory entries AND separate metadata, instead of just one record per file?",
        answer: "Directory entries link a name to a file's location; metadata (size, timestamps, permissions) describes properties of the file itself. Keeping them logically separate — even if stored near each other — is what lets the OS answer quick questions (\"how big is this file?\") without needing to read through the file's actual data.",
      },
      {
        id: "it-fs-explain-002",
        question: "Why can a file end up fragmented across separate storage blocks instead of one contiguous run?",
        answer: "As files are created, grown, and deleted over time, free space on storage becomes scattered — similar in spirit to external fragmentation in memory. When a file needs more space than the next contiguous free run can offer, the file system stores the rest of its data elsewhere, splitting it into multiple runs.",
      },
      {
        id: "it-fs-explain-003",
        question: "Why doesn't deleting a file immediately make that storage space show up as securely erased?",
        answer: "Deletion typically only updates the file system's own bookkeeping — removing the directory entry and marking the blocks free — which is fast. Actually overwriting every byte would be much slower and isn't needed just to reuse the space, so the old data can, in principle, remain until something else is written into those blocks.",
      },
      {
        id: "it-fs-explain-004",
        question: "Why is Unix-style and Windows-style path syntax different for essentially the same idea?",
        answer: "Both describe a route through a directory tree from some starting point to a file, but the conventions differ: Unix-like systems use one shared root (/) and forward slashes, while Windows uses drive letters (like C:\\) and backslashes. Same underlying structure, different notation — a convention of the operating system, not a difference in what a path fundamentally represents.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "it-file-system-explorer",
  },

  // -------------------------------------------------------------
  // CHALLENGE
  // -------------------------------------------------------------
  challenge: {
    intro: "Harder, realistic problems than ordinary Practice. Use the simulator to check your reasoning where noted.",
    scenarios: [
      {
        id: "it-fs-challenge-001",
        title: "Find a File From Its Path",
        scenario: "You're told a file lives at /Users/Student/Documents/budget.csv.",
        objective: "Navigate to that exact file using File Explorer, and confirm what folder directly contains it.",
        requiresExperiment: true,
        tools: [{ id: "file-explorer", label: "File Explorer" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Documents" },
            { id: "b", label: "Student" },
            { id: "c", label: "Users" },
          ],
          correctOptionId: "a",
        },
        explanation: "Reading the path from the end backwards: budget.csv sits directly inside Documents, which sits inside Student, which sits inside Users. The immediate parent folder of a file is always the last directory named before the filename in its path.",
        hints: ["Expand Users → Student → Documents in the tree.", "The folder listed immediately before the filename in a path is always its direct parent."],
      },
      {
        id: "it-fs-challenge-002",
        title: "Determine the Correct Path",
        scenario: "A file named notes.pdf sits inside the Downloads folder, which sits inside Student, which sits inside Users, which sits at the root.",
        objective: "Write out the correct Unix-style path to this file.",
        requiresExperiment: true,
        tools: [{ id: "paths-extensions", label: "Paths & Extensions" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "/Users/Student/Downloads/notes.pdf" },
            { id: "b", label: "/Downloads/Student/Users/notes.pdf" },
            { id: "c", label: "Users/Student/Downloads/notes.pdf" },
          ],
          correctOptionId: "a",
        },
        explanation: "Unix-style paths start with a leading / for the root, then list directories from outermost to innermost, ending with the filename: /Users/Student/Downloads/notes.pdf.",
        hints: ["Confirm this exact file's real location and path in File Explorer's inspector.", "Order matters: root first, then outer folder to inner folder, filename last."],
      },
      {
        id: "it-fs-challenge-003",
        title: "Move a File Into the Correct Directory",
        scenario: "essay-draft.docx currently sits in Documents, but it should be organized alongside other downloaded files instead.",
        objective: "Use File Explorer's Move action to relocate it into the Downloads folder, then confirm its new path.",
        requiresExperiment: true,
        tools: [{ id: "file-explorer", label: "File Explorer" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "/Users/Student/Downloads/essay-draft.docx" },
            { id: "b", label: "/Users/Student/Documents/essay-draft.docx (unchanged)" },
            { id: "c", label: "/Downloads/essay-draft.docx (Student and Users dropped)" },
          ],
          correctOptionId: "a",
        },
        explanation: "Moving a file into Downloads makes Downloads its new direct parent — its path updates to reflect the new location while everything above Downloads (Users/Student) stays the same: /Users/Student/Downloads/essay-draft.docx.",
        hints: ["Select the file first, then click \"Move…\", pick Downloads, then \"Move here.\"", "After moving, check the Inspector's path line for the file's new full path."],
      },
      {
        id: "it-fs-challenge-004",
        title: "Identify Which Files Occupy a Storage Region",
        scenario: "You're looking at the Storage & Fragmentation view and want to know which file, if any, is split across non-adjacent blocks.",
        objective: "Identify a file in the current layout whose blocks are NOT all contiguous.",
        requiresExperiment: true,
        tools: [{ id: "storage-fragmentation", label: "Storage & Fragmentation" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "vacation.jpg or song.mp3 — both are marked \"split\"" },
            { id: "b", label: "report.txt — it's the smallest file" },
            { id: "c", label: "No files are ever split in this simulator" },
          ],
          correctOptionId: "a",
        },
        explanation: "The Storage & Fragmentation view deliberately shows a couple of larger files (vacation.jpg and song.mp3) stored in more than one separate run of blocks, labeled \"split\" in the legend — a realistic illustration of file fragmentation, not something every file experiences.",
        hints: ["Look for the \"· split\" label next to a file's name in the legend below the storage grid.", "Click a file's chip to highlight exactly which blocks belong to it."],
      },
      {
        id: "it-fs-challenge-005",
        title: "Trace an Open File Operation",
        scenario: "An application requests to open a file that already exists in the virtual file system.",
        objective: "Put these stages in the correct order: (1) read data from storage, (2) locate the file via its directory entry, (3) move data into memory, (4) application uses the data.",
        requiresExperiment: true,
        tools: [{ id: "file-operations", label: "File Operations — Open File" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Locate → Read from storage → Move into memory → Application uses it" },
            { id: "b", label: "Read from storage → Locate → Application uses it → Move into memory" },
            { id: "c", label: "Move into memory → Locate → Read from storage → Application uses it" },
          ],
          correctOptionId: "a",
        },
        explanation: "The file system first has to find where the file's data actually is (locate), before it can read that data, before that data can be placed into RAM, before an application can finally use it — each stage depends on the one before it.",
        hints: ["Step through the Open File flow in File Operations in order.", "You can't read data from storage before you know WHERE that data is."],
      },
      {
        id: "it-fs-challenge-006",
        title: "Advanced: Trace the Full Cross-System Path",
        scenario: "A student clicks to open a text file on a simulated computer.",
        objective: "Identify the correct full chain this request travels through, connecting File System, Storage, Memory, and the application.",
        requiresExperiment: true,
        tools: [{ id: "file-operations", label: "File Operations" }, { id: "memory-map-lab", label: "Memory Management Simulator (Memory Map Lab)" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "User → Application → OS → File System → Storage → Memory → CPU/Application" },
            { id: "b", label: "User → Storage → CPU → File System → Application" },
            { id: "c", label: "User → Memory → File System → Storage → Application" },
          ],
          correctOptionId: "a",
        },
        explanation: "The request starts with the user acting through an application, which asks the OS; the OS's file system locates and reads the data from storage; that data is placed into memory (RAM); and only then does the CPU/application actually work with it. This mirrors exactly what File Operations' Open File steps show, connected outward to Memory Management.",
        hints: ["Re-read every step's description in Open File, in order.", "Which comes first: the file system finding the data, or memory receiving it?"],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "information-technology",
      topicSlug: "memory-management-simulator",
      label: "Memory Management Simulator",
      href: "/dashboard/information-technology/memory-management-simulator",
      reason: "Opening a file moves its data into RAM, allocated exactly the way Memory Management describes.",
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "cpu-ram-storage-data-flow",
      label: "CPU–RAM–Storage Data Flow",
      href: "/dashboard/information-technology/cpu-ram-storage-data-flow",
      reason: "That topic shows storage as one stop in the CPU/RAM/storage pipeline; this topic zooms into how a file system organizes what's actually on it.",
    },
  ],
};
