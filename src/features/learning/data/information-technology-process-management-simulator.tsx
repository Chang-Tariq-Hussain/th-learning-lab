import type { TopicContent } from "../types";

/**
 * Process Management Simulator — second stop of the Information
 * Technology > Operating Systems sequence (see
 * `@/features/learning-path/data/information-technology-operating-systems`).
 * Complements, but is deliberately separate from, the CPU Scheduling
 * Simulator: that topic covers HOW the CPU decides which ready
 * process runs next; this one covers WHAT a process is and how the
 * OS tracks and manages its state and resources.
 */

const creationSketch = (
  <svg viewBox="0 0 220 100" className="mx-auto h-28 w-full max-w-sm" role="img" aria-labelledby="process-creation-sketch-title">
    <title id="process-creation-sketch-title">A Parent Process creates a Child Process.</title>
    <rect x="70" y="8" width="80" height="30" rx="6" className="fill-none stroke-subject-it" strokeWidth="2" />
    <text x="110" y="27" textAnchor="middle" className="fill-ink font-mono text-[10px] dark:fill-bone">Parent Process</text>
    <line x1="110" y1="38" x2="110" y2="56" strokeWidth="1.5" className="stroke-ink/40 dark:stroke-bone/40" markerEnd="url(#arrow2)" />
    <text x="132" y="50" textAnchor="middle" className="fill-ink-soft font-mono text-[8px] dark:fill-bone-soft">creates</text>
    <rect x="70" y="60" width="80" height="30" rx="6" className="fill-none stroke-subject-it" strokeWidth="2" />
    <text x="110" y="79" textAnchor="middle" className="fill-ink font-mono text-[10px] dark:fill-bone">Child Process</text>
    <defs>
      <marker id="arrow2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" className="fill-ink/40 dark:fill-bone/40" />
      </marker>
    </defs>
  </svg>
);

export const informationTechnologyProcessManagementSimulatorContent: TopicContent = {
  subjectSlug: "information-technology",
  topicSlug: "process-management-simulator",
  title: "Process Management Simulator",
  subjectLabel: "Information Technology",
  topicLabel: "Operating Systems",
  colorToken: "it",
  simulationHref: "/dashboard/information-technology/process-management-simulator",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Define a process as a program in execution, not merely a program file stored on disk.",
      "List the process lifecycle states and describe what a process is doing (and whether it's using the CPU) in each one.",
      "Explain what a Process Control Block conceptually tracks, and why the OS needs one per process.",
      "Describe what happens during a context switch, and why it has real overhead.",
      "Explain why a process blocks on I/O and how that lets another process use the CPU meanwhile.",
    ],
    concepts: [
      {
        term: "What is a process?",
        explanation:
          "A process is a program IN EXECUTION — not just the program's file sitting on disk. The same program file can be started multiple times as multiple separate processes, each with its own state, memory, and Process Control Block.",
      },
      {
        term: "Process states",
        explanation:
          "A process moves through New (being created), Ready (waiting for CPU time), Running (executing), Waiting/Blocked (paused for something outside the CPU), and Terminated (finished or ended). Only Running uses CPU time — Waiting/Blocked specifically does not, which is easy to assume otherwise.",
      },
      {
        term: "Process Control Block (PCB)",
        explanation:
          "The operating system keeps a Process Control Block for every process — a simplified conceptual record of its ID, current state, program counter, register values, scheduling info, memory info, I/O status, and other resources. This is what lets the OS pause a process and resume it later as if nothing happened.",
      },
      {
        term: "Context switching",
        explanation:
          "Switching the CPU from one process to another means saving the running process's context (registers, program counter) into its PCB, updating its state, then loading the next process's previously saved context back into the CPU. This connects directly to CPU Scheduling: every time the scheduler picks a new process, a context switch is what actually makes the CPU start running it.",
      },
      {
        term: "Context switch overhead",
        explanation:
          "Context switching is never free — saving and restoring context and updating OS data structures all take real CPU time in which no process's actual work happens. This is one reason an extremely small Round Robin time quantum can hurt performance rather than help it.",
      },
      {
        term: "Process creation",
        explanation:
          "Operating systems provide a mechanism for one running process (a parent) to create another (a child). The exact mechanism — and how much a child initially shares with its parent — differs between operating systems, so this is taught conceptually rather than tied to one specific system's API.",
      },
      {
        term: "I/O waiting",
        explanation:
          "When a process requests something outside the CPU — a file read, a network response — it moves to Waiting/Blocked and gives up the CPU, rather than sitting there doing nothing useful. This is exactly why the OS can run a different ready process during that time instead of leaving the CPU idle.",
      },
      {
        term: "Process termination",
        explanation:
          "When a process finishes its work (or is ended some other way), it enters the Terminated state and the OS cleans up its resources — its memory, open file handles, and its Process Control Block entry.",
      },
      {
        term: "Multiple processes",
        explanation:
          "A real system runs many processes at once, each in its own state — one Running, several Ready, maybe one Blocked on I/O — and the OS tracks every one of them independently through its own PCB.",
      },
    ],
    whyItMatters:
      "Every app you have open right now is a separate process the operating system is individually tracking — pausing, resuming, and cleaning up, often dozens of times per second, without you noticing any of it. Understanding processes and their states explains real, everyday things: why a frozen app can sometimes be force-quit without crashing your whole computer, why opening many programs at once can make everything feel slower, and why a program \"hanging\" while waiting on a slow network connection doesn't necessarily mean your CPU itself is overloaded.",
    keyTerms: [
      { term: "Process", definition: "A program in execution, with its own state, memory, and PCB — distinct from the program file on disk." },
      { term: "PCB (Process Control Block)", definition: "The OS's simplified conceptual record of everything it needs to track about one process." },
      { term: "Context switch", definition: "Saving one process's execution context and loading another's, so the CPU can run a different process." },
      { term: "Blocked / Waiting", definition: "A process paused because it's waiting for something outside the CPU, such as I/O — it uses no CPU time while blocked." },
      { term: "Parent / child process", definition: "A parent process is one that creates another (child) process." },
    ],
    visualAids: [
      {
        id: "creation-sketch",
        caption: "A parent process creates a child process — the exact mechanism differs between operating systems.",
        visual: creationSketch,
      },
    ],
    misconceptions: [
      {
        id: "misconception-process-is-file-on-disk",
        misconception: "A process is simply a program stored on disk.",
        correction:
          "The file on disk is just the program — inert until it's run. A process only exists once the OS has actually started executing that program, with its own memory, state, and Process Control Block. The same file can become many separate processes if run multiple times.",
      },
      {
        id: "misconception-blocked-uses-cpu",
        misconception: "A blocked/waiting process is still quietly using some CPU time while it waits.",
        correction:
          "A blocked process uses NO CPU time at all — that's the entire point of the state. It's set aside specifically so the CPU is free to run a different, ready process instead of wasting cycles on a process that can't make progress yet.",
      },
      {
        id: "misconception-context-switch-free",
        misconception: "Switching the CPU between processes is instantaneous and has no cost.",
        correction:
          "Context switching takes real time — saving and restoring registers and the program counter, and updating OS bookkeeping, are all actual work the CPU has to do, during which no process's real work is being done.",
      },
      {
        id: "misconception-pcb-identical-everywhere",
        misconception: "Every operating system stores the exact same Process Control Block fields in the exact same layout.",
        correction:
          "This simulator's PCB is explicitly a simplified conceptual model. Real operating systems track similar categories of information — but the exact fields, their names, and how they're organized differ between systems.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Before checking in the simulator, predict how a process behaves in each situation.",
    scenarios: [
      {
        id: "it-proc-mgmt-predict-001",
        scenario: "A process is currently in the Ready state, sitting in the ready queue.",
        question: "Is this process using any CPU time right now?",
        options: [
          { id: "no", label: "No — Ready means waiting for CPU time, not using it" },
          { id: "yes", label: "Yes — Ready processes use a small amount of CPU time" },
        ],
        actualResultOptionId: "no",
        explanation: "Ready means the process has everything it needs except the CPU itself. It uses zero CPU time until the scheduler actually picks it and moves it to Running.",
        hint: "Only one state in this lifecycle actually means \"executing on the CPU right now.\"",
      },
      {
        id: "it-proc-mgmt-predict-002",
        scenario: "A running process requests to read a large file from a slow disk.",
        question: "What state does it move to?",
        options: [
          { id: "waiting", label: "Waiting / Blocked" },
          { id: "ready", label: "Ready" },
          { id: "terminated", label: "Terminated" },
        ],
        actualResultOptionId: "waiting",
        explanation: "Since the process can't continue until the disk read finishes, it moves to Waiting/Blocked and gives up the CPU — it will move back to Ready only once the I/O completes.",
        hint: "It hasn't finished its work, and it can't run without that data — which state fits both facts?",
      },
      {
        id: "it-proc-mgmt-predict-003",
        scenario: "The OS is about to switch the CPU from Process A to Process B.",
        question: "What must happen to Process A's context before Process B can start running?",
        options: [
          { id: "saved", label: "It must be saved into Process A's PCB" },
          { id: "discarded", label: "It can simply be discarded" },
        ],
        actualResultOptionId: "saved",
        explanation: "If A's context (registers, program counter) weren't saved, A could never resume correctly later — context switching always saves the outgoing process's state before loading the incoming one's.",
        hint: "How would Process A know where to pick back up later if nothing was recorded?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "In Follow a Process, click through the lifecycle diagram and use the buttons to move one process forward through valid transitions.",
      "In Process Inspector, click any of the four simultaneous processes to view its simplified conceptual PCB.",
      "In Context Switch Lab, press Start to step through the OS saving Process A's context and loading Process B's.",
      "In I/O Wait Lab, watch Process A block on I/O while Process B gets a turn on the CPU.",
      "In Identify the State, read each short scenario and pick the lifecycle state it describes.",
    ],
    tryThis: [
      "In Follow a Process, try to move a process straight from New to Running — notice the option isn't offered, and think about why.",
      "In Process Inspector, compare P1 (Running) and P3 (Waiting) — which PCB fields differ, and which stay the same?",
      "In Context Switch Lab, read every step's saved-context note before pressing Step again.",
      "In I/O Wait Lab, notice exactly when Process B starts running relative to when Process A blocks.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "it-proc-mgmt-explain-001",
        question: "Why can't a process go directly from New to Running?",
        answer: "The OS has to finish setting the process up — building its PCB and admitting it to the ready queue — before the scheduler can ever consider giving it the CPU. Ready is the intermediate step that represents \"fully set up and waiting its turn.\"",
      },
      {
        id: "it-proc-mgmt-explain-002",
        question: "Why does the OS need a PCB for every process instead of just remembering things in the CPU itself?",
        answer: "The CPU only holds ONE process's registers and program counter at a time. The moment the OS switches to a different process, that information would be lost forever unless it was copied out into the outgoing process's own PCB first — which is exactly what makes resuming a paused process possible later.",
      },
      {
        id: "it-proc-mgmt-explain-003",
        question: "Why does blocking on I/O let another process use the CPU, instead of the CPU just sitting idle?",
        answer: "Since a blocked process genuinely cannot make progress until its I/O completes, there is nothing productive for the CPU to do for it. Rather than waste that time, the scheduler hands the CPU to a different process that IS ready to run — the same ready queue and scheduling decision the CPU Scheduling Simulator explores in depth.",
      },
      {
        id: "it-proc-mgmt-explain-004",
        question: "Why is context switching considered overhead rather than free?",
        answer: "Saving and loading registers, the program counter, and updating scheduling data structures all take actual CPU cycles — cycles that aren't spent running any process's real work. An operating system that context-switches too frequently can spend a meaningful fraction of its time just switching rather than computing.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "it-process-management-simulator",
  },

  // -------------------------------------------------------------
  // CHALLENGE
  // -------------------------------------------------------------
  challenge: {
    intro: "Harder, realistic problems than ordinary Practice. Use the simulator to check your reasoning where noted.",
    scenarios: [
      {
        id: "it-proc-mgmt-challenge-001",
        title: "Predict State Transitions",
        scenario: "A process is Running when its Round Robin time quantum expires, and it still has work left to do.",
        objective: "Determine which state it moves to.",
        requiresExperiment: true,
        tools: [{ id: "follow-a-process", label: "Follow a Process" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Ready — it's preempted and returns to the queue, not finished" },
            { id: "b", label: "Waiting/Blocked — it needs to wait for the next quantum" },
            { id: "c", label: "Terminated — its time is up" },
          ],
          correctOptionId: "a",
        },
        explanation: "Being preempted isn't the same as blocking or finishing — the process still has work left and is fully able to run again, it just has to wait its turn. That's exactly the Running → Ready transition.",
        hints: ["Try this exact transition in Follow a Process — which \"Move to...\" options are offered from Running?", "Blocked is reserved for waiting on something outside the CPU, like I/O — is that what happened here?"],
      },
      {
        id: "it-proc-mgmt-challenge-002",
        title: "Identify PCB Information",
        scenario: "A classmate says the PCB only needs to store a process's ID and nothing else, since the OS can look everything up elsewhere.",
        objective: "Identify what's wrong with this claim.",
        requiresExperiment: true,
        tools: [{ id: "process-inspector", label: "Process Inspector" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "The PCB has to store the process's saved context, state, and resource info too — that's the whole point of it" },
            { id: "b", label: "The claim is correct — the PID alone is sufficient" },
            { id: "c", label: "The PCB only needs to store memory information" },
          ],
          correctOptionId: "a",
        },
        explanation: "A PID alone couldn't let the OS resume a paused process correctly — the PCB also has to hold the saved register/program-counter context, current state, and resource information (open files, I/O status), all of which the Process Inspector shows.",
        hints: ["Open Process Inspector and read through every field a PCB holds.", "Without saved context, how would a paused process resume from the right point?"],
      },
      {
        id: "it-proc-mgmt-challenge-003",
        title: "Trace a Context Switch",
        scenario: "In the Context Switch Lab, Process A is running when the interrupt fires.",
        objective: "Put these three events in the correct order: (1) Process B resumes, (2) Process A's context is saved, (3) Process B's context is loaded.",
        requiresExperiment: true,
        tools: [{ id: "context-switch-lab", label: "Context Switch Lab" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Save A's context → Load B's context → B resumes" },
            { id: "b", label: "Load B's context → Save A's context → B resumes" },
            { id: "c", label: "B resumes → Save A's context → Load B's context" },
          ],
          correctOptionId: "a",
        },
        explanation: "The outgoing process's context must be saved before anything else happens, so it isn't lost — only then can the incoming process's previously saved context be loaded and resumed.",
        hints: ["Step through the Context Switch Lab and read each step's title in order.", "Could B's context be loaded before A's is safely saved somewhere?"],
      },
      {
        id: "it-proc-mgmt-challenge-004",
        title: "Determine Why a Process Blocks",
        scenario: "A process that was Running suddenly moves to Waiting/Blocked without finishing its work or being preempted by the scheduler.",
        objective: "Identify the most likely reason.",
        requiresExperiment: true,
        tools: [{ id: "io-wait-lab", label: "I/O Wait Lab" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "It requested something outside the CPU, such as I/O, that it must wait for" },
            { id: "b", label: "Its time quantum expired" },
            { id: "c", label: "The OS randomly chose to block it" },
          ],
          correctOptionId: "a",
        },
        explanation: "Running → Waiting/Blocked specifically happens when a process requests something it can't get from the CPU alone — I/O being the classic example, as shown in the I/O Wait Lab. A quantum expiring instead sends it to Ready, not Waiting.",
        hints: ["Compare this to the Running → Ready transition caused by preemption — what's different here?", "Run the I/O Wait Lab and note exactly which step causes Process A to block."],
      },
      {
        id: "it-proc-mgmt-challenge-005",
        title: "Predict Which Process Can Run Next",
        scenario: "Four processes exist: P1 is Running, P2 and P4 are Ready, P3 is Waiting/Blocked on a network response.",
        objective: "If P1 is about to be preempted, which process(es) could the scheduler choose from?",
        requiresExperiment: true,
        tools: [{ id: "process-inspector", label: "Process Inspector" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "P2 or P4 — only Ready processes are eligible to run next" },
            { id: "b", label: "P2, P3, or P4 — any process not currently running is eligible" },
            { id: "c", label: "Only P3, since it's been waiting the longest" },
          ],
          correctOptionId: "a",
        },
        explanation: "P3 is Blocked, not Ready — it cannot run until its I/O finishes and it moves back to Ready, no matter how long it's been waiting. Only P2 and P4 are actually eligible for the scheduler to pick.",
        hints: ["Which processes in Process Inspector currently show \"Ready\" as their state?", "Being blocked and having waited a long time aren't the same as being eligible to run."],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "information-technology",
      topicSlug: "cpu-scheduling-simulator",
      label: "CPU Scheduling Simulator",
      href: "/dashboard/information-technology/cpu-scheduling-simulator",
      reason: "This topic covers WHAT a process is and how the OS tracks it; CPU Scheduling covers HOW the OS decides which ready process actually gets the CPU next.",
    },
  ],
};
