import type { TopicContent } from "../types";

/**
 * CPU–RAM–Storage Data Flow — the second stop in the Information
 * Technology > Computer Fundamentals sequence (see
 * `@/features/learning-path/data/information-technology-computer-fundamentals`).
 * Authored content flowing through the same generic `TopicExperience`
 * every other subject uses, with `CpuRamStorageDataFlow` (a six-mode
 * 2D/2.5D "Computer Architecture / Instruction Execution Laboratory,"
 * with an optional lazy-loaded 3D physical-layout view — see that
 * component's own comments) supplied as the Explore simulation.
 *
 * Learn's `concepts` list is ordered beginner → intermediate →
 * advanced, matching the simulation's own Overview → Instruction
 * Execution/Memory/Cache/Buses → Full System progression, so a
 * student who stops partway through Learn has already covered
 * whichever modes they're most likely to open first.
 */

const dataFlowSketch = (
  <svg viewBox="0 0 260 120" className="mx-auto h-28 w-full max-w-xs" role="img" aria-labelledby="data-flow-sketch-title">
    <title id="data-flow-sketch-title">Storage connects to RAM, RAM connects to the CPU, and the CPU connects to Output.</title>
    <rect x="8" y="42" width="62" height="36" rx="6" className="fill-none stroke-ink/40 dark:stroke-bone/40" strokeWidth="2" />
    <text x="39" y="64" textAnchor="middle" className="fill-ink font-mono text-[10px] dark:fill-bone">Storage</text>
    <rect x="99" y="42" width="62" height="36" rx="6" className="fill-none stroke-ink/40 dark:stroke-bone/40" strokeWidth="2" />
    <text x="130" y="64" textAnchor="middle" className="fill-ink font-mono text-[10px] dark:fill-bone">RAM</text>
    <rect x="190" y="42" width="62" height="36" rx="6" className="fill-none stroke-ink/40 dark:stroke-bone/40" strokeWidth="2" />
    <text x="221" y="64" textAnchor="middle" className="fill-ink font-mono text-[10px] dark:fill-bone">CPU</text>
    <line x1="70" y1="60" x2="99" y2="60" strokeWidth="2" className="stroke-subject-it" />
    <line x1="161" y1="60" x2="190" y2="60" strokeWidth="2" className="stroke-subject-it" />
    <text x="130" y="20" textAnchor="middle" className="fill-ink-soft font-mono text-[9px] dark:fill-bone-soft">
      slow, permanent → fast, temporary → processing
    </text>
  </svg>
);

const fetchDecodeExecuteSketch = (
  <svg viewBox="0 0 260 100" className="mx-auto h-24 w-full max-w-xs" role="img" aria-labelledby="fde-sketch-title">
    <title id="fde-sketch-title">Fetch, then Decode, then Execute, in a repeating cycle.</title>
    <rect x="6" y="30" width="70" height="36" rx="18" className="fill-subject-it-soft stroke-subject-it dark:fill-subject-it/20" strokeWidth="2" />
    <text x="41" y="53" textAnchor="middle" className="fill-subject-it font-mono text-[10px] font-medium">FETCH</text>
    <rect x="95" y="30" width="70" height="36" rx="18" className="fill-none stroke-ink/40 dark:stroke-bone/40" strokeWidth="2" />
    <text x="130" y="53" textAnchor="middle" className="fill-ink font-mono text-[10px] font-medium dark:fill-bone">DECODE</text>
    <rect x="184" y="30" width="70" height="36" rx="18" className="fill-none stroke-ink/40 dark:stroke-bone/40" strokeWidth="2" />
    <text x="219" y="53" textAnchor="middle" className="fill-ink font-mono text-[10px] font-medium dark:fill-bone">EXECUTE</text>
    <line x1="76" y1="48" x2="95" y2="48" strokeWidth="2" className="stroke-ink/30 dark:stroke-bone/30" />
    <line x1="165" y1="48" x2="184" y2="48" strokeWidth="2" className="stroke-ink/30 dark:stroke-bone/30" />
    <path d="M219 66 Q219 90 41 90 Q6 90 6 66" fill="none" className="stroke-ink/20 dark:stroke-bone/20" strokeWidth="1.5" strokeDasharray="3 3" />
    <text x="130" y="85" textAnchor="middle" className="fill-ink-soft font-mono text-[8px] dark:fill-bone-soft">repeats for the next instruction</text>
  </svg>
);

export const informationTechnologyCpuRamStorageDataFlowContent: TopicContent = {
  subjectSlug: "information-technology",
  topicSlug: "cpu-ram-storage-data-flow",
  title: "CPU–RAM–Storage Data Flow",
  subjectLabel: "Information Technology",
  topicLabel: "Computer Fundamentals",
  colorToken: "it",
  simulationHref: "/dashboard/information-technology/cpu-ram-storage-data-flow",

  // -------------------------------------------------------------
  // LEARN — what am I learning?
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Explain the roles of storage, RAM, cache, and the CPU's registers, and why data passes through them in that order.",
      "Trace one instruction through the Fetch → Decode → Execute cycle, naming which component is active at each stage.",
      "Explain what a memory address is, and how the address bus, data bus, and control bus each play a different role in reading or writing one.",
      "Predict whether a repeated memory request will be a cache hit or a cache miss, and explain why.",
    ],
    concepts: [
      // --- Beginner: the four components -----------------------------
      {
        term: "Storage is slow but permanent",
        explanation:
          "Storage (an SSD or hard drive) holds the operating system, applications, and files even when the computer is completely off. It's much slower to access than RAM, which is exactly why the computer doesn't run programs directly out of it.",
      },
      {
        term: "RAM is fast but temporary",
        explanation:
          "RAM (main memory) holds whatever the CPU is actively using right now, organized into addressable locations. It's dramatically faster to read and write than storage, but everything in it disappears the instant power is lost.",
      },
      {
        term: "Registers are the CPU's own fast storage",
        explanation:
          "Registers — like the Program Counter, Instruction Register, and general-purpose registers R1/R2 — sit inside the CPU itself and hold the handful of values it's working with right this instant. They're smaller than even L1 cache, but the fastest storage in the entire system.",
      },
      {
        term: "Cache sits between RAM and the CPU",
        explanation:
          "L1, L2, and L3 cache are progressively larger, progressively slower layers built to hold copies of data the CPU has recently used (or is likely to use soon) — closer and faster to reach than RAM, so the CPU doesn't always have to wait on it.",
      },
      // --- Intermediate: addresses, buses, the cycle ------------------
      {
        term: "RAM is organized into addressable locations",
        explanation:
          "Every byte of RAM has a numbered address, the same way every house on a street has a number. The CPU doesn't ask RAM for \"the program\" in general — it asks for the specific address it needs next.",
      },
      {
        term: "Three buses, three different jobs",
        explanation:
          "In this teaching model, the address bus carries which location is being accessed, the data bus carries the actual value being transferred, and the control bus carries coordination signals like read or write. None of the three can do another's job.",
        formula: "\\text{Address Bus (which?)} + \\text{Control Bus (read/write?)} \\rightarrow \\text{Data Bus (what value?)}",
        formulaCaption: "The address and control buses set up the request; the data bus carries the result",
      },
      {
        term: "Fetch, Decode, Execute",
        explanation:
          "Every instruction goes through the same three stages: Fetch retrieves the instruction from memory/cache into the Instruction Register, Decode has the Control Unit figure out what it means, and Execute actually carries it out — often using the ALU.",
      },
      {
        term: "Reads and writes are mirror images",
        explanation:
          "A memory read sends an address out and gets data back. A memory write sends an address and data out, with no data returned. Writing to RAM changes only RAM — a separate, later save is what makes a change permanent in storage.",
      },
      // --- Advanced: cache behavior, full picture ----------------------
      {
        term: "Cache hits and cache misses",
        explanation:
          "On a cache hit, the CPU finds what it needs already sitting in L1 (or L2, or L3) and gets it back almost immediately. On a cache miss, the CPU has to check each cache level in turn and, if none of them have it, go all the way to RAM — which is why misses are slower.",
      },
      {
        term: "Why caching works at all: locality",
        explanation:
          "Caches are effective because of two patterns real programs tend to follow: temporal locality (data just used is likely to be used again soon) and spatial locality (data near an address just used is likely to be needed soon too).",
      },
    ],
    whyItMatters:
      "This layered relationship — permanent storage, temporary RAM, a cache hierarchy in between, and a CPU that only ever directly touches registers and cache — explains a huge amount of everyday computer behavior: why more RAM makes a computer feel faster, why a \"warmed up\" application responds more snappily the second time, why unsaved work is lost in a crash, and why CPU speed alone doesn't tell the whole performance story. It's also the foundation every later Information Technology topic — from operating systems to networking — assumes you already have.",
    keyTerms: [
      { term: "CPU", definition: "The processor — fetches instructions and data, executes them, and writes results back." },
      { term: "Register", definition: "A tiny, extremely fast storage slot inside the CPU itself, such as the PC, IR, R1, or R2." },
      { term: "Program Counter (PC)", definition: "Holds the address of the next instruction to fetch." },
      { term: "Instruction Register (IR)", definition: "Holds the instruction currently being decoded and executed." },
      { term: "ALU", definition: "The Arithmetic Logic Unit — performs a decoded instruction's actual calculation or comparison." },
      { term: "Cache (L1/L2/L3)", definition: "Progressively larger, slower layers of fast memory between the CPU and RAM." },
      { term: "RAM", definition: "Temporary, addressable working memory; fast, but cleared whenever the computer loses power." },
      { term: "Storage", definition: "Long-term memory (SSD/hard drive); slower than RAM, but keeps its contents with the power off." },
      { term: "Address bus / data bus / control bus", definition: "The three conceptual pathways that carry, respectively, which location, what value, and read/write coordination." },
    ],
    visualAids: [
      {
        id: "data-flow-sketch",
        caption: "Storage feeds RAM, and RAM feeds the CPU — data always gets copied into RAM before the CPU can work with it.",
        visual: dataFlowSketch,
      },
      {
        id: "fde-sketch",
        caption: "Every instruction repeats the same three-stage cycle: Fetch, Decode, Execute — then the next instruction begins.",
        visual: fetchDecodeExecuteSketch,
      },
    ],
    misconceptions: [
      {
        id: "misconception-cpu-reads-storage-directly",
        misconception: "The CPU reads a program's instructions straight from the hard drive or SSD.",
        correction:
          "Storage is far too slow for the CPU to use directly while it's running billions of instructions per second. The program is always copied into RAM first, and the CPU works from that RAM copy — not from storage.",
      },
      {
        id: "misconception-cache-is-just-more-ram",
        misconception: "Cache is just a smaller amount of the same kind of memory as RAM.",
        correction:
          "Cache is a genuinely different, faster technology built directly into (or very near) the CPU, specifically to avoid RAM's relative slowness. RAM is bigger and cheaper per byte; cache is smaller, more expensive, and much faster to access.",
      },
      {
        id: "misconception-registers-and-cache-are-the-same",
        misconception: "Registers and cache are basically the same thing with different names.",
        correction:
          "Registers are named, individual storage slots inside the CPU core (the PC, IR, R1, R2...) holding the exact values an instruction is using right now. Cache is a much larger pool of memory holding copies of recently-used data, organized by address rather than by name.",
      },
      {
        id: "misconception-address-bus-carries-data",
        misconception: "The address bus carries the actual data being read or written.",
        correction:
          "The address bus only ever carries the address — which location is being accessed. The data itself always travels on the data bus, in whichever direction the operation requires.",
      },
      {
        id: "misconception-unsaved-work-lives-in-storage",
        misconception: "Once you've typed something into a document, it's already safely stored.",
        correction:
          "While you're actively editing, your changes exist only in RAM's temporary working copy. Nothing is written to permanent storage until you explicitly save — which is why unsaved work disappears in a crash or power loss.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT — what should I predict?
  // -------------------------------------------------------------
  predict: {
    intro:
      "Before you run each experiment in the simulation below, predict the outcome — you'll only be able to run it after locking in an answer.",
    scenarios: [
      {
        id: "it-data-flow-predict-001",
        scenario: "An application is sitting on your computer, unopened.",
        question: "Where does that application's code live right now?",
        options: [
          { id: "storage", label: "Storage" },
          { id: "ram", label: "RAM" },
          { id: "cpu", label: "The CPU" },
        ],
        actualResultOptionId: "storage",
        explanation:
          "An unopened application exists only in permanent storage. Nothing is copied into RAM until the moment you actually open it.",
        hint: "Which kind of memory holds things even when they're not currently in use?",
      },
      {
        id: "it-data-flow-predict-002",
        scenario: "You've been editing a document for the last ten minutes without saving, and the power suddenly goes out.",
        question: "What happens to your last ten minutes of edits?",
        options: [
          { id: "lost", label: "They're lost — they only existed in RAM" },
          { id: "safe", label: "They're safe — they were already written to storage" },
          { id: "partially-lost", label: "Exactly half of them are recovered automatically" },
        ],
        actualResultOptionId: "lost",
        explanation:
          "Unsaved edits live only in RAM's temporary working copy. RAM's contents are cleared the instant power is lost, so anything not explicitly saved to storage before that moment is gone.",
        hint: "Which of the two memory types keeps its contents only while the power stays on?",
      },
      {
        id: "it-data-flow-predict-003",
        scenario: "In Instruction Execution mode, the CPU fetches the same instruction address a second time, right after the first fetch.",
        question: "Compared to the first fetch, will the second fetch be a cache hit or a cache miss?",
        options: [
          { id: "hit", label: "A cache hit — it should already be cached from the first fetch" },
          { id: "miss", label: "A cache miss — caching doesn't apply to instructions" },
          { id: "same-speed", label: "Neither — cache never affects speed either way" },
        ],
        actualResultOptionId: "hit",
        explanation:
          "The first fetch of any address is typically a miss (nothing's cached yet), but that access populates the cache — so a second request for the same address is usually a hit, and noticeably faster.",
        hint: "What does a cache level do with data right after it retrieves it from a slower level?",
      },
      {
        id: "it-data-flow-predict-004",
        scenario: "The CPU needs to read the value stored at a specific RAM address.",
        question: "Which travels out on the address bus?",
        options: [
          { id: "address-only", label: "Only the address — the location being requested" },
          { id: "address-and-value", label: "Both the address and the value already, just in case" },
          { id: "value-only", label: "The value that's expected to be found there" },
        ],
        actualResultOptionId: "address-only",
        explanation:
          "The address bus carries only the address — \"which location.\" The value that's stored there comes back separately, over the data bus.",
        hint: "Which bus is named after \"which location,\" and which is named after \"what value\"?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE — the guided experiment
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Start with Overview mode to see the whole architecture and click any component to read what it does; toggle the 3D view for a sense of physical layout.",
      "Switch to Instruction Execution mode, pick one of the three instructions, and press Start to watch it move through Fetch → Decode → Execute.",
      "In Memory Access mode, click a row in the address table, choose Read or Write, and press Start to watch the CPU access that exact location.",
      "In Cache mode, run \"First access\" and then \"Repeated access\" back to back and compare how many components light up in each.",
      "In Bus Explorer mode, show each of the three bus examples and notice which components are active for each one.",
      "Finish with Full System Simulation mode for the complete guided run, start to finish, at whichever speed you like.",
    ],
    tryThis: [
      "In Instruction Execution mode, compare the LOAD and ADD instructions' Fetch stages — one is a cache miss and one is a cache hit. What's different in the diagram?",
      "In Full System Simulation, count how many times data crosses between RAM and the CPU package before the result is finally saved back to storage.",
      "After running the STORE instruction, click RAM and then Storage back to back — notice the simulation is careful to distinguish \"written to RAM\" from \"saved to storage.\"",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN — why does this happen?
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "it-data-flow-explain-001",
        question: "Why is an application's code copied into RAM instead of the CPU just reading it from storage directly?",
        answer:
          "Storage (an SSD or hard drive) is dramatically slower to access than RAM. If the CPU tried to fetch every instruction directly from storage, the whole computer would run at storage speed instead of CPU speed. Copying the program into fast RAM first is what lets the CPU run it at full speed.",
      },
      {
        id: "it-data-flow-explain-002",
        question: "Why does the CPU check cache before going to RAM, instead of just going straight to RAM every time?",
        answer:
          "Cache is significantly faster to access than RAM, even though it's much smaller. Checking the small, fast cache first — and only falling back to the larger, slower RAM on a miss — means most requests get answered quickly, since real programs tend to reuse recently-accessed data and addresses.",
      },
      {
        id: "it-data-flow-explain-003",
        question: "Why does an instruction need three separate stages (Fetch, Decode, Execute) instead of just happening all at once?",
        answer:
          "Each stage does a genuinely different job: Fetch is about retrieving the right instruction, Decode is about understanding what it means, and Execute is about actually carrying it out. Splitting them keeps each one simple and gives the Control Unit a clear step at which to interpret what the CPU should do next, before committing to it.",
      },
      {
        id: "it-data-flow-explain-004",
        question: "Why does the address bus carry only an address, instead of also carrying the data in the same step?",
        answer:
          "A request has to specify \"which location\" before either side knows what data is even relevant — sending both at once would be ambiguous for a read (there's no data yet) and wasteful for identifying the target. Keeping the address separate lets the same data bus be reused for both directions, depending on whether the control bus signals a read or a write.",
      },
      {
        id: "it-data-flow-explain-005",
        question: "Why does unsaved work disappear if the power goes out, but saved files survive?",
        answer:
          "RAM only keeps its contents while it has power — that's the tradeoff for being so much faster than storage. A saved file has already been copied to storage, which keeps its contents with no power at all, so it survives; an unsaved edit that only ever existed in RAM does not.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE — can I solve a problem using this?
  // -------------------------------------------------------------
  practice: {
    // Foreign key into the quiz-engine registry — all questions live in
    // @/features/quiz-engine/data/it-cpu-ram-storage-data-flow-quiz.ts, none duplicated here.
    quizId: "it-cpu-ram-storage-data-flow",
  },

  // -------------------------------------------------------------
  // CHALLENGE — realistic problems, some folding in the real-world mission
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice. Some are worked out from reasoning alone; others ask you to use the simulation above to check your answer. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "it-data-flow-challenge-001",
        title: "The Sluggish Startup",
        scenario:
          "A student notices that a particular video-editing application takes much longer to open than a simple text editor, even on the same computer.",
        objective: "Explain, in terms of storage, RAM, and the CPU, the main reason a larger application takes longer to open.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "A larger application means more data has to be copied from storage into RAM before it can run" },
            { id: "b", label: "The CPU has to run slower for larger applications" },
            { id: "c", label: "Storage capacity shrinks every time an app is opened" },
            { id: "d", label: "Larger applications skip RAM and load straight into the CPU" },
          ],
          correctOptionId: "a",
        },
        explanation:
          "Opening any application starts with copying its code from storage into RAM. A larger, more complex application simply has more data that needs to make that same storage-to-RAM trip, which takes more time — the CPU and the fundamental process are the same either way.",
        hints: [
          "Which step happens before the CPU can start running any application at all?",
          "What's different about a larger application at that specific step, compared to a smaller one?",
        ],
      },
      {
        id: "it-data-flow-challenge-002",
        title: "Diagnosing the Crash",
        scenario:
          "A writer's computer crashes unexpectedly. Afterward, their document is missing the last 20 minutes of edits, but an earlier version they explicitly saved 25 minutes ago is intact.",
        objective: "Explain what this pattern of loss reveals about where the last 20 minutes of edits were being held.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Those 20 minutes of edits existed only in RAM, and were never written to storage" },
            { id: "b", label: "Storage itself was damaged in the crash" },
            { id: "c", label: "The CPU deleted the edits on purpose" },
            { id: "d", label: "The 25-minute-old save was also lost, but got restored automatically" },
          ],
          correctOptionId: "a",
        },
        explanation:
          "The saved version from 25 minutes ago survived because it had already been written to permanent storage. Everything typed after that only existed in RAM's temporary working copy, and RAM's contents are cleared the moment power is lost in a crash — exactly matching what the writer lost and kept.",
        hints: [
          "Which memory type is cleared by a crash, and which one isn't?",
          "The last explicit Save is the last moment the two memory types matched each other.",
        ],
      },
      {
        id: "it-data-flow-challenge-003",
        title: "Trace the Loop",
        scenario:
          "Using Full System Simulation mode above, a classmate claims a running program only moves data from storage to RAM to the CPU once, in a single straight line, start to finish.",
        objective:
          "Run Full System Simulation mode above and determine whether that claim matches what the simulation actually shows.",
        constraints: [{ id: "c1", label: "Watch the full scenario through to its final step before answering." }],
        tools: [{ id: "mode-tabs", label: "Full System Simulation mode tab" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "False — RAM and the CPU package exchange data repeatedly across the fetch/execute cycle before the result is saved" },
            { id: "b", label: "True — the simulation shows exactly one RAM-to-CPU step" },
            { id: "c", label: "False — the program skips RAM entirely and goes straight from storage to the CPU" },
          ],
          correctOptionId: "a",
        },
        explanation:
          "Full System Simulation mode deliberately shows RAM and the CPU package exchanging data repeatedly — a fetch, a decode, an execute, another fetch, and so on for each of the three instructions — before the result is finally written back to storage. It's a repeating cycle, not a single one-way trip.",
        hints: [
          "Count how many separate steps in that mode involve RAM and the CPU package together.",
          "The simulation's own explanation panel calls out the fetch/execute/write-back pattern directly — read a few steps closely.",
        ],
      },
      {
        id: "it-data-flow-challenge-004",
        title: "Hit or Miss?",
        scenario:
          "A classmate runs Cache mode's \"First access\" demo, sees it cascade through L1, L2, and L3 before reaching RAM, and concludes that cache never actually helps — the CPU ends up going to RAM anyway.",
        objective: "Use Cache mode above to determine what's missing from that conclusion, and explain it.",
        tools: [{ id: "cache-demo-toggle", label: "\"First access\" / \"Repeated access\" toggle" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "They only ran the miss demo — running \"Repeated access\" right after shows the same request answered from L1 alone, without touching RAM" },
            { id: "b", label: "They're right — cache provides no benefit in this simulation" },
            { id: "c", label: "Cache only helps if the CPU asks L3 first instead of L1" },
            { id: "d", label: "The RAM access in the first demo means the data was never cached at all" },
          ],
          correctOptionId: "a",
        },
        explanation:
          "The first request for any address is expected to miss — nothing's cached yet. The point of caching shows up on the next request: because that first miss populated the cache levels, \"Repeated access\" answers the same request from L1 alone, dramatically faster and without ever reaching RAM.",
        hints: [
          "What does a cache level do with data right after retrieving it from a slower level?",
          "Compare how many components light up in the miss demo versus the hit demo.",
        ],
      },
      {
        id: "it-data-flow-challenge-005",
        title: "Which Bus?",
        scenario:
          "A classmate is confused about why a single memory read needs three different buses instead of just one that carries everything.",
        objective: "Match each piece of information in a memory read to the correct bus, and explain why splitting them matters.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Address bus carries the location, control bus signals read/write, data bus carries the value — each is a different kind of information" },
            { id: "b", label: "All three buses carry the same information redundantly, as a safety check" },
            { id: "c", label: "The data bus alone is sufficient; address and control buses are optional extras" },
            { id: "d", label: "The control bus carries the data, and the data bus carries read/write signals" },
          ],
          correctOptionId: "a",
        },
        explanation:
          "Splitting the request into three specialized pathways means each one only ever carries one kind of information — the address bus never has to distinguish itself from data, and the control bus's read/write signal is what tells the other two how to interpret what's currently on them.",
        hints: [
          "\"Which location\" and \"what value\" are two completely different questions — should they share a wire?",
          "What role does read/write play that neither the address nor the value alone can express?",
        ],
      },
      {
        id: "it-data-flow-challenge-006",
        title: "Real-World Mission: Explain It to a Friend",
        scenario:
          "A friend who's never studied computers asks why their laptop feels much faster right after they added more RAM, even though they didn't touch the hard drive at all.",
        objective:
          "Use what this topic explains about storage, RAM, and cache to write the single most accurate one-sentence reason more RAM makes a computer feel faster.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "More RAM means more of what the CPU needs can stay ready in fast memory at once, instead of constantly waiting on slower storage" },
            { id: "b", label: "More RAM makes the CPU itself run at a higher clock speed" },
            { id: "c", label: "More RAM increases how much permanent storage the computer has" },
            { id: "d", label: "More RAM has no real effect; the feeling of speed is a placebo" },
          ],
          correctOptionId: "a",
        },
        explanation:
          "RAM is the fast memory the CPU actually works from. With more of it available, more programs and data can stay loaded and ready at once, so the computer needs to fall back on slow storage less often — which is exactly the mechanism behind the speed-up a friend would notice, not a change to the CPU or storage themselves.",
        hints: [
          "Which of the three components (storage, RAM, CPU) is what's actually being added to?",
          "What problem does having 'more fast memory available at once' solve?",
        ],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "information-technology",
      topicSlug: "cpu-architecture-instruction-cycle",
      label: "CPU Architecture & Instruction Cycle",
      href: "/dashboard/information-technology/cpu-architecture-instruction-cycle",
      reason: "See what happens inside the CPU during Fetch/Decode/Execute/Write Back — the internal execution this topic's buses and cache carry data for.",
    },
  ],
};
