import type { TopicContent } from "../types";

/**
 * Memory Management Simulator — third stop of the Information
 * Technology > Operating Systems sequence (see
 * `@/features/learning-path/data/information-technology-operating-systems`).
 * Connects directly to Process Management (a process's memory is
 * allocated/released exactly when it's created/terminated) and to
 * CPU–RAM–Storage Data Flow (this topic zooms into how the OS shares
 * RAM between many processes, rather than the CPU/RAM/storage
 * pipeline as a whole).
 */

const addressingSketch = (
  <svg viewBox="0 0 260 110" className="mx-auto h-28 w-full max-w-sm" role="img" aria-labelledby="addressing-sketch-title">
    <title id="addressing-sketch-title">A process&apos;s logical address is translated to a physical RAM address.</title>
    <rect x="10" y="10" width="100" height="34" rx="6" className="fill-none stroke-subject-it" strokeWidth="2" />
    <text x="60" y="24" textAnchor="middle" className="fill-ink font-mono text-[9px] dark:fill-bone">Logical address</text>
    <text x="60" y="38" textAnchor="middle" className="fill-ink-soft font-mono text-[8px] dark:fill-bone-soft">(process&apos;s own view)</text>
    <line x1="115" y1="27" x2="150" y2="27" strokeWidth="1.5" className="stroke-ink/40 dark:stroke-bone/40" markerEnd="url(#arrow3)" />
    <text x="132" y="20" textAnchor="middle" className="fill-ink-soft font-mono text-[7px] dark:fill-bone-soft">+ base</text>
    <rect x="150" y="10" width="100" height="34" rx="6" className="fill-none stroke-subject-it" strokeWidth="2" />
    <text x="200" y="24" textAnchor="middle" className="fill-ink font-mono text-[9px] dark:fill-bone">Physical address</text>
    <text x="200" y="38" textAnchor="middle" className="fill-ink-soft font-mono text-[8px] dark:fill-bone-soft">(real RAM location)</text>
    <defs>
      <marker id="arrow3" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" className="fill-ink/40 dark:fill-bone/40" />
      </marker>
    </defs>
  </svg>
);

export const informationTechnologyMemoryManagementSimulatorContent: TopicContent = {
  subjectSlug: "information-technology",
  topicSlug: "memory-management-simulator",
  title: "Memory Management Simulator",
  subjectLabel: "Information Technology",
  topicLabel: "Operating Systems",
  colorToken: "it",
  simulationHref: "/dashboard/information-technology/memory-management-simulator",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Explain why an operating system needs a memory manager when multiple processes need RAM at once.",
      "Describe fixed and variable partitioning, and identify internal fragmentation when it happens.",
      "Explain external fragmentation, and why total free memory being enough doesn't guarantee a request succeeds.",
      "Compare First Fit, Best Fit, and Worst Fit allocation strategies without claiming one is universally best.",
      "Describe the difference between a logical (virtual) address and a physical address at a beginner level.",
      "Connect memory allocation and release to a process's Create and Terminate lifecycle events.",
    ],
    concepts: [
      {
        term: "Why memory management exists",
        explanation:
          "RAM is limited, and many processes need some of it at the same time. The operating system's memory manager decides which process gets which region of RAM, and reclaims that space the moment a process no longer needs it.",
      },
      {
        term: "Allocation and deallocation",
        explanation:
          "When a process is created, the memory manager finds free space and allocates it (Request → Memory Manager → Allocation → Process). When the process terminates, that memory is released back to the free pool — visible directly in the Memory Map Lab.",
      },
      {
        term: "Fixed partitioning",
        explanation:
          "Memory is divided into equal, predefined partitions before any process is assigned. Simple, but a process smaller than its partition wastes the leftover space inside it — internal fragmentation.",
      },
      {
        term: "Variable partitioning",
        explanation:
          "Memory is allocated in exactly the size each process requests. This avoids internal fragmentation, but over time, as processes come and go, free space gets split into scattered regions — external fragmentation.",
      },
      {
        term: "Internal fragmentation",
        explanation:
          "Wasted space INSIDE an allocated block, because the block is larger than what the process actually needed. The Partitioning Lab makes this directly visible with fixed-size partitions.",
      },
      {
        term: "External fragmentation",
        explanation:
          "Free memory split into multiple separate regions, none large enough alone for a new request — even when their total would be enough. The Fragmentation Lab shows a request being denied for exactly this reason.",
      },
      {
        term: "Allocation strategies",
        explanation:
          "First Fit picks the first free region big enough; Best Fit picks the smallest region that still fits, to waste as little as possible; Worst Fit picks the largest region available, to keep remaining free space large. Each has trade-offs — none wins in every situation.",
      },
      {
        term: "Logical vs. physical addresses",
        explanation:
          "A process works with logical (virtual) addresses starting at 0, as if it had memory all to itself. The memory manager translates each logical address to the real physical RAM address where that process is actually loaded. This simulator uses the simplest possible translation — a single base address — as a conceptual model, not a specific hardware scheme.",
      },
      {
        term: "Memory pressure",
        explanation:
          "As more processes request memory, free memory shrinks. Eventually a new request may not be satisfiable at all — memory pressure. Virtual memory is one real-world way systems cope with this, but it is not implemented in this simulator.",
      },
    ],
    whyItMatters:
      "Every app on your phone or computer is quietly sharing the same limited RAM with dozens of other processes, and the operating system is constantly deciding who gets which chunk of it. This is why opening too many apps at once can slow everything down, why closing an app frees up memory for others, and why \"out of memory\" errors happen even when it looks like you have plenty of storage space left — storage and RAM are not the same thing.",
    keyTerms: [
      { term: "RAM", definition: "Volatile working memory the CPU reads from and writes to directly — cleared when power is lost, unlike storage." },
      { term: "Allocation", definition: "The memory manager assigning a specific region of RAM to a process." },
      { term: "Fragmentation", definition: "Wasted or unusable free memory — internal (inside an allocated block) or external (scattered free regions)." },
      { term: "Logical (virtual) address", definition: "An address as a process itself sees it, starting at 0 — distinct from where that data actually sits in physical RAM." },
      { term: "Memory pressure", definition: "The situation where free memory has shrunk so far that a new request can't be satisfied." },
    ],
    visualAids: [
      {
        id: "addressing-sketch",
        caption: "The memory manager translates a process's logical address to a physical RAM address.",
        visual: addressingSketch,
      },
    ],
    misconceptions: [
      {
        id: "misconception-ram-is-storage",
        misconception: "RAM is permanent storage, like a hard drive.",
        correction:
          "RAM is volatile — its contents are lost when power is removed. Permanent storage is a separate system, covered in the File System Explorer, not this simulator.",
      },
      {
        id: "misconception-one-block-everywhere",
        misconception: "Every process in every modern operating system gets one simple contiguous block of memory, exactly like this simulator shows.",
        correction:
          "This simulator teaches contiguous allocation as the foundational model because it's the clearest starting point. Many real systems use more advanced techniques such as paging or segmentation, which are not implemented here.",
      },
      {
        id: "misconception-logical-equals-physical",
        misconception: "A process's logical (virtual) addresses are always identical to the real physical addresses in RAM.",
        correction:
          "They're usually different. The memory manager translates logical addresses (which a process sees starting at 0) to physical addresses (the real location in RAM), using a base address in this simulator's simplified model.",
      },
      {
        id: "misconception-virtual-memory-is-extra-ram",
        misconception: "Virtual memory is simply extra physical RAM.",
        correction:
          "Virtual memory is a technique that extends the APPARENT amount of memory available, typically using storage as overflow — it is not literally more physical RAM, and it is not implemented in this simulator (see Memory Pressure).",
      },
      {
        id: "misconception-enough-total-free-means-fits",
        misconception: "If total free memory is bigger than a request, the request will always succeed.",
        correction:
          "Not if that free memory is split into separate regions, none large enough alone — external fragmentation. The Fragmentation Lab demonstrates exactly this case.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Before checking in the simulator, predict how memory allocation behaves in each situation.",
    scenarios: [
      {
        id: "it-mem-predict-001",
        scenario: "RAM has 500 MB of free memory total, but it's split into three separate free regions of 100 MB, 150 MB, and 250 MB.",
        question: "Can a single process requesting 300 MB be allocated?",
        options: [
          { id: "no", label: "No — no single free region is 300 MB or larger" },
          { id: "yes", label: "Yes — total free memory (500 MB) is more than enough" },
        ],
        actualResultOptionId: "no",
        explanation: "A contiguous allocation needs one free region big enough on its own. Even though the three regions add up to 500 MB, the largest single region here is only 250 MB — this is external fragmentation.",
        hint: "Try the same numbers in the Fragmentation Lab's request slider.",
      },
      {
        id: "it-mem-predict-002",
        scenario: "A process requesting 80 MB is placed into a fixed 200 MB partition, since that's the smallest partition available.",
        question: "How much memory is wasted, and what is this called?",
        options: [
          { id: "internal", label: "120 MB wasted — internal fragmentation" },
          { id: "external", label: "120 MB wasted — external fragmentation" },
          { id: "none", label: "No memory is wasted" },
        ],
        actualResultOptionId: "internal",
        explanation: "The 120 MB left unused INSIDE the partition the process was placed into is internal fragmentation — space wasted within one allocated block, not scattered across separate free regions.",
        hint: "Where exactly is the wasted space — inside one block, or spread across several?",
      },
      {
        id: "it-mem-predict-003",
        scenario: "A running process is terminated by the user.",
        question: "What happens to the memory it was using?",
        options: [
          { id: "released", label: "It's released back to the free pool" },
          { id: "kept", label: "It stays allocated to that process forever" },
        ],
        actualResultOptionId: "released",
        explanation: "Terminating a process releases its memory back to the free pool, exactly like the Memory Map Lab's \"Terminate & free\" action — and exactly like Process Management's Terminated state.",
        hint: "Which Process Management state did you already learn means the OS cleans up a process's resources?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "In Memory Map Lab, create a named process with a requested size, pick an allocation strategy, and watch it get allocated. Click any block to inspect its address range.",
      "In Partitioning Lab, toggle between Fixed and Variable partitioning and assign the same sample processes in Fixed mode to see internal fragmentation appear.",
      "In Fragmentation Lab, try different request sizes against a realistic scattered-memory scenario and see exactly when and why a request gets denied.",
      "In Allocation Strategies, compare First Fit, Best Fit, and Worst Fit side by side on the identical starting layout and request.",
      "In Memory Pressure, keep starting new processes and watch free memory shrink until a request finally fails.",
      "In Process Connection, click through Create/Running/Waiting/Terminated to see the memory event tied to each state.",
    ],
    tryThis: [
      "In Memory Map Lab, allocate several small processes, terminate one in the middle, then allocate a new bigger one — watch where it lands.",
      "In Memory Map Lab, click an allocated block and drag the logical address slider — watch the physical address change by exactly the same amount.",
      "In Partitioning Lab, try 2 partitions vs. 6 partitions with the same three sample processes — does internal fragmentation get better or worse?",
      "In Allocation Strategies, note which strategy leaves the largest single free block behind, and which leaves the most free blocks.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "it-mem-explain-001",
        question: "Why can a memory request fail even when total free memory is larger than the request?",
        answer: "Contiguous allocation needs ONE free region large enough on its own. If free memory is scattered into several smaller regions instead, none of them individually may be big enough — that's external fragmentation, demonstrated directly in the Fragmentation Lab.",
      },
      {
        id: "it-mem-explain-002",
        question: "Why does variable partitioning avoid internal fragmentation but fixed partitioning doesn't?",
        answer: "Variable partitioning allocates exactly the size each process asks for, so there's no leftover space inside its block. Fixed partitioning assigns processes into predefined, equal-size partitions decided in advance — so a process smaller than its partition always leaves the difference unused inside that partition.",
      },
      {
        id: "it-mem-explain-003",
        question: "Why doesn't the OS just always use Best Fit, since it seems to minimize waste?",
        answer: "Best Fit does minimize the leftover space from any one allocation, but repeatedly picking the \"just barely big enough\" block tends to leave behind many tiny, mostly-useless free slivers over time — a form of fragmentation of its own. No single strategy wins in every situation, which is why the Allocation Strategies lab compares them side by side rather than declaring a winner.",
      },
      {
        id: "it-mem-explain-004",
        question: "Why does a process need its own logical addresses instead of just using physical addresses directly?",
        answer: "If every process used real physical addresses directly, it would need to know exactly where in RAM it was loaded — and that location can change. Logical addresses let a process always start counting from 0 as if it had memory to itself, while the memory manager handles translating that to wherever it actually lives in physical RAM.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "it-memory-management-simulator",
  },

  // -------------------------------------------------------------
  // CHALLENGE
  // -------------------------------------------------------------
  challenge: {
    intro: "Harder, realistic problems than ordinary Practice. Use the simulator to check your reasoning where noted.",
    scenarios: [
      {
        id: "it-mem-challenge-001",
        title: "Diagnose a Denied Request",
        scenario: "RAM has 40 MB, 90 MB, and 30 MB free in three separate regions (160 MB total), and a process requests 100 MB.",
        objective: "Determine whether the request succeeds, and why.",
        requiresExperiment: true,
        tools: [{ id: "fragmentation-lab", label: "Fragmentation Lab" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Denied — no single free region reaches 100 MB, even though the total (160 MB) does" },
            { id: "b", label: "Succeeds — total free memory is enough" },
            { id: "c", label: "Denied — there isn't enough total free memory" },
          ],
          correctOptionId: "a",
        },
        explanation: "The largest single free region is only 90 MB. Contiguous allocation needs one region at least as large as the request — total free memory being enough isn't sufficient by itself. This is external fragmentation.",
        hints: ["Try these exact numbers with the request slider in the Fragmentation Lab.", "Compare the request size to the LARGEST single free block, not the total."],
      },
      {
        id: "it-mem-challenge-002",
        title: "Fixed vs. Variable Partitioning",
        scenario: "A system needs to run three processes of 60 MB, 60 MB, and 190 MB.",
        objective: "Decide which partitioning approach wastes less memory for this exact set of processes.",
        requiresExperiment: true,
        tools: [{ id: "partitioning-lab", label: "Partitioning Lab" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Variable partitioning — it allocates exactly what each process needs" },
            { id: "b", label: "Fixed partitioning — equal partitions are always more efficient" },
            { id: "c", label: "They waste exactly the same amount" },
          ],
          correctOptionId: "a",
        },
        explanation: "With such different process sizes, fixed equal-size partitions would leave a large gap inside the partitions holding the two 60 MB processes (unless partitions are sized very close to 60 MB, which then wastes space for the 190 MB process instead). Variable partitioning sizes each block exactly to its process, with zero internal fragmentation.",
        hints: ["Try assigning all three processes in Fixed mode with different partition counts.", "Internal fragmentation only happens when a process is smaller than its partition — when does that happen most here?"],
      },
      {
        id: "it-mem-challenge-003",
        title: "Predict the Allocation Decision",
        scenario: "Free regions of 60 MB, 400 MB, and 190 MB exist (in that address order), and a 100 MB process is requested.",
        objective: "Determine which free region First Fit chooses, and which region Worst Fit chooses.",
        requiresExperiment: true,
        tools: [{ id: "allocation-strategy-lab", label: "Allocation Strategies" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "First Fit → 400 MB region (first one big enough); Worst Fit → 400 MB region (largest available)" },
            { id: "b", label: "First Fit → 60 MB region; Worst Fit → 190 MB region" },
            { id: "c", label: "Both strategies always choose the same region" },
          ],
          correctOptionId: "a",
        },
        explanation: "First Fit scans in address order and picks the first free region that's big enough — the 60 MB region is too small, so it picks the 400 MB region next. Worst Fit specifically looks for the LARGEST available region regardless of order, which is also the 400 MB region here — they happen to agree in this case, but for different reasons.",
        hints: ["Run this exact scenario in the Allocation Strategies lab.", "First Fit cares about scan order; Worst Fit cares about size."],
      },
      {
        id: "it-mem-challenge-004",
        title: "Trace a Process's Memory Lifecycle",
        scenario: "A process is created, runs for a while, briefly blocks on I/O, and then terminates.",
        objective: "Identify at which point its memory is released.",
        requiresExperiment: true,
        tools: [{ id: "process-connection", label: "Process Connection" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Only at Terminated — memory stays associated with it through Running and Waiting" },
            { id: "b", label: "At Waiting — blocked processes don't need memory" },
            { id: "c", label: "Memory is released and reallocated every time it changes state" },
          ],
          correctOptionId: "a",
        },
        explanation: "A process keeps its allocated memory throughout Running and Waiting — blocking on I/O doesn't mean losing its data. Memory is only released once the process actually Terminates, matching what Process Management already taught about resource cleanup.",
        hints: ["Step through each state in the Process Connection panel and read its memory event.", "Does \"waiting for I/O\" sound like it should lose the process's data?"],
      },
      {
        id: "it-mem-challenge-005",
        title: "Design Around Memory Pressure",
        scenario: "A system is close to running out of free memory, and a new 130 MB process needs to start.",
        objective: "Identify what genuinely happens next in THIS simulator, without inventing a fix it doesn't implement.",
        requiresExperiment: true,
        tools: [{ id: "memory-pressure-lab", label: "Memory Pressure" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "The request is denied — this simulator doesn't implement virtual memory as an automatic fix" },
            { id: "b", label: "The OS automatically swaps old data to storage to make room" },
            { id: "c", label: "RAM automatically expands to fit the new process" },
          ],
          correctOptionId: "a",
        },
        explanation: "This simulator deliberately stops at \"the request is denied\" for memory pressure — it explicitly does not implement virtual memory / swapping as the fix, since that's a future topic. RAM doesn't expand on its own, and nothing here silently frees space without the student's own Terminate action.",
        hints: ["Push Memory Pressure until a request actually fails and read the message shown.", "The Learn section is explicit that virtual memory is named but not implemented here."],
      },
      {
        id: "it-mem-challenge-006",
        title: "Translate a Logical Address",
        scenario: "A process is allocated a 150 MB block starting at physical address 400 MB. The process reads its own logical address 60.",
        objective: "Calculate the physical address this actually corresponds to.",
        requiresExperiment: true,
        tools: [{ id: "memory-map-lab", label: "Memory Map Lab (inspect an allocated block)" }],
        answer: { mode: "numeric", unit: "MB", target: 460, tolerance: 0 },
        explanation: "Physical address = base address + logical address = 400 MB + 60 MB = 460 MB. This is exactly the translation the Memory Map Lab's inspector panel shows when you drag its logical-address slider on an allocated block.",
        hints: ["Physical = base + logical, using this simulator's simplified single-base-address model.", "Allocate a process and use the logical-address slider in the inspector to confirm the pattern."],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "information-technology",
      topicSlug: "process-management-simulator",
      label: "Process Management Simulator",
      href: "/dashboard/information-technology/process-management-simulator",
      reason: "Process Management covers a process's lifecycle; Memory Management covers exactly when that process's memory is allocated and released within that lifecycle.",
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "cpu-ram-storage-data-flow",
      label: "CPU–RAM–Storage Data Flow",
      href: "/dashboard/information-technology/cpu-ram-storage-data-flow",
      reason: "That topic shows RAM as one stop in the CPU/RAM/storage pipeline; this topic zooms into how the OS shares RAM between many processes at once.",
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "file-system-explorer",
      label: "File System Explorer",
      href: "/dashboard/information-technology/file-system-explorer",
      reason: "RAM (this topic) is volatile working memory; the File System Explorer covers how data is organized on persistent storage instead.",
    },
  ],
};
