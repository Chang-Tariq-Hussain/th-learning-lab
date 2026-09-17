import type { TopicContent } from "../types";

/**
 * Virtual Memory Simulator — fourth stop of the Information
 * Technology > Operating Systems sequence, after Memory Management.
 * Deliberately stops short of pages/frames/page tables/page
 * replacement (FIFO/LRU/TLB) — those are reserved for a later Paging
 * simulation, referenced here only as a forward pointer, matching
 * `PAGING_PREVIEW_NOTE` in the simulator's model.
 */

const layerSketch = (
  <svg viewBox="0 0 260 130" className="mx-auto h-32 w-full max-w-sm" role="img" aria-labelledby="vm-layer-sketch-title">
    <title id="vm-layer-sketch-title">Process, virtual address space, OS memory management, physical RAM, and backing storage as layers.</title>
    {["Process", "Virtual Address Space", "OS / Memory Management", "Physical RAM", "Backing Storage"].map((label, i) => (
      <g key={label}>
        <rect x="20" y={8 + i * 24} width="220" height="18" rx="4" className="fill-none stroke-subject-it" strokeWidth="1.5" />
        <text x="130" y={8 + i * 24 + 13} textAnchor="middle" className="fill-ink font-mono text-[8px] dark:fill-bone">{label}</text>
        {i < 4 && (
          <line x1="130" y1={8 + i * 24 + 18} x2="130" y2={8 + (i + 1) * 24} className="stroke-ink/40 dark:stroke-bone/40" strokeWidth="1" markerEnd="url(#arrow4)" />
        )}
      </g>
    ))}
    <defs>
      <marker id="arrow4" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" className="fill-ink/40 dark:fill-bone/40" />
      </marker>
    </defs>
  </svg>
);

export const informationTechnologyVirtualMemorySimulatorContent: TopicContent = {
  subjectSlug: "information-technology",
  topicSlug: "virtual-memory-simulator",
  title: "Virtual Memory Simulator",
  subjectLabel: "Information Technology",
  topicLabel: "Operating Systems",
  colorToken: "it",
  simulationHref: "/dashboard/information-technology/virtual-memory-simulator",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Explain what virtual memory is, as a memory-management abstraction rather than 'bigger RAM.'",
      "Distinguish a process's virtual address space from physical RAM.",
      "Explain what it means for memory to be resident vs. non-resident, and what backing storage is for.",
      "Describe the conceptual steps of address translation, without page-table detail.",
      "Explain memory pressure and virtual memory overcommit, and why the two are related but different.",
      "Explain how virtual address spaces support process isolation.",
      "Describe the working set concept at a beginner level.",
    ],
    concepts: [
      {
        term: "Virtual memory (the concept)",
        explanation:
          "A memory-management abstraction that gives each process its own virtual address space, managed by the OS and hardware, while physical RAM stays a limited, shared resource underneath. It is NOT simply \"RAM pretending to be bigger.\"",
      },
      {
        term: "Virtual address space",
        explanation:
          "A process's own view of memory — code, data, heap, free (unmapped) space, and stack — that exists independently of exactly how much of it is currently backed by real physical RAM.",
      },
      {
        term: "Physical RAM",
        explanation:
          "The actual hardware memory resource, shared across every running process and the OS itself. Physical RAM capacity is fixed and limited, unlike a process's virtual address space.",
      },
      {
        term: "Resident vs. non-resident memory",
        explanation:
          "Resident memory is currently present in physical RAM. Non-resident memory belongs to a process's virtual address space but isn't currently in RAM — it still exists, just not immediately accessible without help from the OS.",
      },
      {
        term: "Backing storage",
        explanation:
          "When memory contents aren't resident, the OS may use storage as backing for virtual memory — one mechanism that can support the abstraction, not a claim that all virtual memory is \"RAM on disk.\"",
      },
      {
        term: "Address translation (simplified)",
        explanation:
          "A virtual address a process uses gets translated by OS/hardware memory-management mechanisms into wherever that data actually lives. This simulator shows the concept only — not the actual page-table lookup mechanics.",
      },
      {
        term: "Memory pressure",
        explanation:
          "As more processes request resident memory, free physical RAM shrinks — eventually a request may not be satisfiable immediately. Real systems can make room by moving some content to backing storage, but deciding what to move is a page-replacement decision covered in a later simulation.",
      },
      {
        term: "Overcommit",
        explanation:
          "Total virtual address-space demand across processes can exceed physical RAM capacity, because virtual size, resident memory, and backing-storage availability are three separate things — not because arbitrary overcommit is always safe.",
      },
      {
        term: "Process isolation",
        explanation:
          "Two processes can use the exact same-looking virtual address while it refers to completely different underlying memory — one of the most important reasons virtual address spaces exist, though virtual memory alone isn't a complete security system.",
      },
      {
        term: "Working set",
        explanation:
          "A conceptual way to describe the subset of a process's virtual address space it's actively using during a period of execution — distinct from, though related to, what's currently resident.",
      },
    ],
    whyItMatters:
      "This is why you can run a web browser with dozens of tabs, a video editor, and a dozen background apps at once on a laptop with far less RAM than all of those programs would need if every byte of them had to be in RAM simultaneously — and why switching to a idle app that hasn't been touched in a while sometimes takes a noticeable moment to \"wake up.\" Virtual memory is the abstraction that makes this possible, and it's also part of why one program crashing usually doesn't corrupt another program's data.",
    keyTerms: [
      { term: "Virtual address space", definition: "A process's own memory model, managed independently of exactly how much of it is resident in RAM." },
      { term: "Resident", definition: "Currently present and available in physical RAM." },
      { term: "Backing storage", definition: "Storage used to hold memory contents that aren't currently resident in RAM." },
      { term: "Memory pressure", definition: "The situation where free physical RAM has shrunk to the point a request can't be satisfied immediately." },
      { term: "Process isolation", definition: "Each process's virtual address space keeps its memory separate from other processes'." },
    ],
    visualAids: [
      {
        id: "vm-layer-sketch",
        caption: "Process → Virtual Address Space → OS/Memory Management → Physical RAM ↔ Backing Storage.",
        visual: layerSketch,
      },
    ],
    misconceptions: [
      {
        id: "misconception-vm-is-bigger-ram",
        misconception: "Virtual memory is just RAM pretending to be bigger.",
        correction:
          "Virtual memory is a memory-management abstraction the OS and hardware maintain — it gives each process its own address space, but it isn't literally extra RAM capacity.",
      },
      {
        id: "misconception-all-vm-on-disk",
        misconception: "All virtual memory is simply RAM stored on the disk.",
        correction:
          "Backing storage is one mechanism that can support virtual memory when content isn't resident — it doesn't mean every byte of virtual memory lives on disk at all times.",
      },
      {
        id: "misconception-vm-always-faster",
        misconception: "Virtual memory always makes programs run faster, or eliminates the need for RAM.",
        correction:
          "Virtual memory doesn't remove the need for physical RAM, and retrieving non-resident data from backing storage has real performance costs — it isn't a free performance upgrade.",
      },
      {
        id: "misconception-every-access-hits-storage",
        misconception: "Every memory access requires a storage access.",
        correction:
          "Most accesses hit memory that's already resident in RAM — the Address Translation lab shows both cases, and non-resident access is the exception this simulator specifically calls out, not the norm.",
      },
      {
        id: "misconception-entire-address-space-in-ram",
        misconception: "A process's entire virtual address space must exist physically in RAM at once.",
        correction:
          "Only the resident portion needs to be in RAM at any given moment — the rest of a process's virtual address space can be non-resident without the process failing.",
      },
      {
        id: "misconception-vm-complete-security",
        misconception: "Virtual memory alone provides complete security between processes.",
        correction:
          "Virtual address spaces support process isolation, but memory protection depends on hardware/OS mechanisms working together with this abstraction — it isn't a complete security system by itself.",
      },
      {
        id: "misconception-all-os-identical",
        misconception: "All operating systems implement virtual memory identically.",
        correction:
          "Real operating systems implement virtual memory with different mechanisms and levels of detail — this simulator shows the general concept, not any one specific implementation.",
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
        id: "it-vm-predict-001",
        scenario: "Physical RAM has 4 GB of capacity. Three processes have virtual address spaces of 4 GB, 2 GB, and 2.5 GB — a combined 8.5 GB.",
        question: "Does this necessarily mean the system has run out of usable memory?",
        options: [
          { id: "no", label: "No — only resident memory has to fit in physical RAM at once, not full virtual sizes" },
          { id: "yes", label: "Yes — total virtual demand can never exceed physical RAM" },
        ],
        actualResultOptionId: "no",
        explanation: "Virtual address-space size, resident memory, and backing-storage availability are three separate things. Total virtual demand exceeding physical RAM is a normal, expected situation — not a failure by itself.",
        hint: "Check the Memory Pressure & Overcommit tab's comparison of virtual demand vs. physical capacity.",
      },
      {
        id: "it-vm-predict-002",
        scenario: "A process accesses a virtual address whose data is currently non-resident.",
        question: "What has to happen before the access can complete?",
        options: [
          { id: "storage", label: "The system must obtain the data from backing storage" },
          { id: "fail", label: "The access simply fails permanently" },
        ],
        actualResultOptionId: "storage",
        explanation: "Non-resident data isn't gone — the system retrieves it from backing storage so the access can proceed, exactly as shown in the Address Translation lab's non-resident path.",
        hint: "Pick a non-resident region in the Address Translation lab and step through it.",
      },
      {
        id: "it-vm-predict-003",
        scenario: "Process A and Process B each reference the virtual address 0x1000.",
        question: "Do they refer to the same underlying physical memory?",
        options: [
          { id: "no", label: "No — the same-looking virtual address means something different for each process" },
          { id: "yes", label: "Yes — identical virtual addresses always point to the same memory" },
        ],
        actualResultOptionId: "no",
        explanation: "This is exactly what the Process Isolation lab demonstrates — the same virtual address value can refer to entirely separate memory for two different processes.",
        hint: "Try both access-attempt buttons in the Process Isolation lab.",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "In Virtual Memory Map, switch between processes and compare each one's virtual address space to the shared physical RAM bar. Try the detail-level selector.",
      "In Address Translation, pick a process and a resident region, then a non-resident one, and step through both with Play or Step.",
      "In Resident & Working Set, toggle between the two views for the same process and see how the coloring changes meaning.",
      "In Memory Pressure & Overcommit, keep starting processes until a request is denied, then check the overcommit comparison below it.",
      "In Process Isolation, try both access-attempt buttons and read what each one actually means.",
    ],
    tryThis: [
      "In Virtual Memory Map, switch the detail level to Advanced and see what new statistics appear.",
      "In Address Translation, compare the Step 4 description for a resident region against a non-resident one — what's different?",
      "In Memory Pressure & Overcommit, note the exact GB free right before a request finally gets denied.",
      "In Resident & Working Set, find a region that's resident but NOT part of the working set (inactive) — what would that mean in practice?",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "it-vm-explain-001",
        question: "Why can a process have a 4 GB virtual address space on a machine with only 4 GB of total physical RAM shared among several processes?",
        answer: "Because a process's virtual address space doesn't need to be entirely resident in RAM at once. Only the portions currently in use (resident) need physical RAM; the rest can be non-resident, backed by storage if and when it's needed.",
      },
      {
        id: "it-vm-explain-002",
        question: "Why doesn't accessing memory always require a trip to backing storage?",
        answer: "Most of a process's actively used memory is already resident in RAM — backing storage is only involved for the non-resident case, which the Address Translation lab treats as one branch, not the default path.",
      },
      {
        id: "it-vm-explain-003",
        question: "Why is 'virtual memory is RAM stored on disk' an oversimplification?",
        answer: "Backing storage is one mechanism that supports virtual memory when content isn't resident, but virtual memory itself is a broader memory-management abstraction the OS and hardware maintain — it doesn't mean every byte of virtual memory constantly lives on disk.",
      },
      {
        id: "it-vm-explain-004",
        question: "Why can two different processes safely use the identical-looking virtual address 0x1000 without interfering with each other?",
        answer: "Because each process has its own virtual address space with its own translation to physical memory. The value 0x1000 is only meaningful within a specific process's address space — translated independently for each process, which is exactly what supports process isolation.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "it-virtual-memory-simulator",
  },

  // -------------------------------------------------------------
  // CHALLENGE
  // -------------------------------------------------------------
  challenge: {
    intro: "Harder, realistic problems than ordinary Practice. Use the simulator to check your reasoning where noted.",
    scenarios: [
      {
        id: "it-vm-challenge-001",
        title: "Identify Virtual vs. Physical",
        scenario: "You're shown two memory diagrams: one labeled \"Process A's memory model\" with Code/Data/Heap/Stack regions, and one labeled \"shared across every running process, capacity-limited.\"",
        objective: "Classify which diagram represents virtual memory and which represents physical RAM.",
        requiresExperiment: true,
        tools: [{ id: "overview-panel", label: "Virtual Memory Map" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "\"Process A's memory model\" is virtual memory; \"shared across every process\" is physical RAM" },
            { id: "b", label: "\"Process A's memory model\" is physical RAM; \"shared across every process\" is virtual memory" },
            { id: "c", label: "Both diagrams describe the same thing" },
          ],
          correctOptionId: "a",
        },
        explanation: "A process's own memory model — its own private view with code/data/heap/stack — is its virtual address space. Physical RAM is the single, limited, shared hardware resource underneath every process.",
        hints: ["Compare the two panels side by side in Virtual Memory Map.", "Which one belongs to ONE process, and which is shared by all of them?"],
      },
      {
        id: "it-vm-challenge-002",
        title: "Follow an Address Translation",
        scenario: "A process accesses a virtual address that falls inside a region marked non-resident.",
        objective: "Put these in the correct order: (1) data obtained from backing storage, (2) address translation consulted, (3) process generates virtual address, (4) process continues, (5) residency checked.",
        requiresExperiment: true,
        tools: [{ id: "address-translation-lab", label: "Address Translation" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Generate → Translate → Check residency → Obtain from storage → Continue" },
            { id: "b", label: "Translate → Generate → Obtain from storage → Check residency → Continue" },
            { id: "c", label: "Check residency → Generate → Translate → Continue → Obtain from storage" },
          ],
          correctOptionId: "a",
        },
        explanation: "Each step depends on the one before it: the process must generate the address before it can be translated, translation happens before residency can be checked, and only a non-resident result triggers the storage step before the process continues.",
        hints: ["Pick a non-resident region and step through it one click at a time.", "You can't check residency before translation tells you what you're even checking."],
      },
      {
        id: "it-vm-challenge-003",
        title: "Determine Residency",
        scenario: "Process C has six regions: Code, Data, Heap (active), Heap (reserved, unused), Free Virtual Space, and Stack.",
        objective: "Identify which of these regions are excluded from resident/non-resident accounting entirely, and why.",
        requiresExperiment: true,
        tools: [{ id: "resident-working-set-panel", label: "Resident & Working Set" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Free Virtual Space — it's unmapped address range, not actual memory content" },
            { id: "b", label: "Heap (reserved, unused) — because it's never resident" },
            { id: "c", label: "Stack — because it's always resident" },
          ],
          correctOptionId: "a",
        },
        explanation: "Free Virtual Space represents unmapped address range within the process's address space — it isn't memory content at all, so it's excluded from resident/non-resident totals, unlike Heap (reserved, unused), which IS content, just currently non-resident.",
        hints: ["Select Process C in Resident & Working Set and check which regions show a RESIDENT/NON-RESIDENT badge at all.", "Which region represents address space that isn't backed by any actual data yet?"],
      },
      {
        id: "it-vm-challenge-004",
        title: "Manage Memory Pressure",
        scenario: "Physical RAM is 4 GB, with roughly 2.8 GB already resident across the starting processes and 0.4 GB reserved for the OS.",
        objective: "Determine approximately how many additional 0.6 GB processes can be started before a request is denied.",
        requiresExperiment: true,
        tools: [{ id: "memory-pressure-overcommit-lab", label: "Memory Pressure & Overcommit" }],
        answer: { mode: "numeric", unit: "processes", target: 1, tolerance: 0 },
        explanation: "With roughly 0.8 GB free (4 − 0.4 − 2.8), only one more 0.6 GB process fits before the next request is denied — confirm the exact number by watching the free-RAM readout as you click \"Start process.\"",
        hints: ["Watch the \"free of 4 GB\" readout after each click.", "Free RAM ÷ 0.6 GB, rounded down, tells you how many more will fit."],
      },
      {
        id: "it-vm-challenge-005",
        title: "Judge Process Isolation",
        scenario: "Process A attempts to access its own virtual address, and separately attempts to access Process B's virtual address — both look identical (0x1000).",
        objective: "Determine which attempt is allowed and which is denied, and why.",
        requiresExperiment: true,
        tools: [{ id: "process-isolation-lab", label: "Process Isolation" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Own address: allowed. Process B's address space: denied — Process A has no mapping into Process B's memory" },
            { id: "b", label: "Both are allowed, since the address value is identical" },
            { id: "c", label: "Both are denied, since virtual addresses are never trustworthy" },
          ],
          correctOptionId: "a",
        },
        explanation: "A process can only reach memory reachable through its own address space's translations. The identical-looking address value doesn't grant access to another process's memory — that's precisely what process isolation means.",
        hints: ["Try both buttons in the Process Isolation lab and read the result message for each.", "What does each process's own translation actually point to?"],
      },
      {
        id: "it-vm-challenge-006",
        title: "Identify the Working Set",
        scenario: "Process A has Code, Data, Heap (active), Heap (reserved, unused), Free Virtual Space, and Stack regions.",
        objective: "Identify which regions would typically be considered part of its current working set.",
        requiresExperiment: true,
        tools: [{ id: "resident-working-set-panel", label: "Resident & Working Set (Working Set view)" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Code, Data, Heap (active), and Stack — the regions marked ACTIVE" },
            { id: "b", label: "Every region, since the whole address space always counts as the working set" },
            { id: "c", label: "Only Heap (reserved, unused), since \"working\" implies growth" },
          ],
          correctOptionId: "a",
        },
        explanation: "The working set is the subset of a process's virtual address space it's actively using right now — in this simulator, that's exactly the regions marked ACTIVE in the Working Set view, not the entire address space.",
        hints: ["Switch to the Working Set view for Process A and read each region's badge.", "The working set is a SUBSET of the full address space, not all of it."],
      },
      {
        id: "it-vm-challenge-007",
        title: "Analyze Virtual vs. Physical Capacity",
        scenario: "Three processes have virtual sizes of 4 GB, 2 GB, and 2.5 GB (8.5 GB total), while physical RAM capacity is 4 GB.",
        objective: "Determine whether this scenario is inherently broken, and explain why or why not.",
        requiresExperiment: true,
        tools: [{ id: "memory-pressure-overcommit-lab", label: "Memory Pressure & Overcommit" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Not inherently broken — only resident memory (a smaller total) needs to fit in physical RAM at once" },
            { id: "b", label: "Broken — virtual demand can never legitimately exceed physical RAM" },
            { id: "c", label: "Broken — the OS would immediately crash all three processes" },
          ],
          correctOptionId: "a",
        },
        explanation: "This is the overcommit concept directly: virtual address-space size is not the same as resident physical memory. The system keeps running as long as actual resident demand stays manageable, even while total virtual demand exceeds capacity.",
        hints: ["Check the \"Currently resident\" figure against the 4 GB capacity in the Overcommit section.", "Which number actually has to fit inside 4 GB — the virtual total, or the resident total?"],
      },
      {
        id: "it-vm-challenge-008",
        title: "Advanced: Full Virtual Memory Trace",
        scenario: "A process accesses a virtual address whose data is currently non-resident.",
        objective: "Identify the correct full chain this access travels through, connecting the process, virtual address space, OS, physical RAM, and backing storage.",
        requiresExperiment: true,
        tools: [{ id: "address-translation-lab", label: "Address Translation" }, { id: "overview-panel", label: "Virtual Memory Map" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Process → Virtual Address → Translation (OS/Memory Management) → Residency check → Backing Storage → RAM → Process continues" },
            { id: "b", label: "Process → RAM → Backing Storage → Virtual Address → Translation → Process continues" },
            { id: "c", label: "Process → Backing Storage → Process continues (RAM and translation are skipped for non-resident data)" },
          ],
          correctOptionId: "a",
        },
        explanation: "The process generates a virtual address, which is translated, checked for residency, and — since it's non-resident — the OS retrieves the needed data from backing storage into RAM before the process can continue. Every stage in this order is required; none can be skipped.",
        hints: ["Step through a non-resident region in Address Translation from the very beginning.", "Could the system check residency before translating the address at all?"],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "information-technology",
      topicSlug: "memory-management-simulator",
      label: "Memory Management Simulator",
      href: "/dashboard/information-technology/memory-management-simulator",
      reason: "Memory Management covers how physical RAM itself is allocated and freed; Virtual Memory covers the layer above it — how a process gets an address space that doesn't have to fit entirely in that RAM.",
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "process-management-simulator",
      label: "Process Management Simulator",
      href: "/dashboard/information-technology/process-management-simulator",
      reason: "Each simulated process here has the same kind of identity introduced in Process Management.",
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "file-system-explorer",
      label: "File System Explorer",
      href: "/dashboard/information-technology/file-system-explorer",
      reason: "Backing storage in this topic is conceptually the same persistent storage that File System Explorer covers in more detail.",
    },
  ],
};
