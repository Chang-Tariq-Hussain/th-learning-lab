import type { TopicContent } from "../types";

/**
 * CPU Scheduling Simulator — first stop of the new Information
 * Technology > Operating Systems sequence (see
 * `@/features/learning-path/data/information-technology-operating-systems`).
 * Flows through the same generic `TopicExperience` every other topic
 * uses, unmodified, with `CpuSchedulingSimulator` supplied as the
 * Explore simulation.
 */

const queueSketch = (
  <svg viewBox="0 0 280 90" className="mx-auto h-24 w-full max-w-md" role="img" aria-labelledby="cpu-scheduling-sketch-title">
    <title id="cpu-scheduling-sketch-title">
      A Ready Queue holding P2, P3, and P4 feeds a Scheduler, which sends one process at a time into the CPU.
    </title>
    <rect x="4" y="30" width="150" height="30" rx="6" className="fill-none stroke-ink/40 dark:stroke-bone/40" strokeWidth="1.5" />
    <text x="79" y="20" textAnchor="middle" className="fill-ink-soft font-mono text-[8px] dark:fill-bone-soft">READY QUEUE</text>
    {["P2", "P3", "P4"].map((label, i) => (
      <g key={label}>
        <rect x={12 + i * 48} y={36} width="40" height="18" rx="4" className="fill-none stroke-subject-it" strokeWidth="1.5" />
        <text x={32 + i * 48} y="48" textAnchor="middle" className="fill-ink font-mono text-[9px] dark:fill-bone">{label}</text>
      </g>
    ))}
    <line x1="156" y1="45" x2="196" y2="45" strokeWidth="1.5" className="stroke-ink/40 dark:stroke-bone/40" markerEnd="url(#arrow)" />
    <text x="176" y="38" textAnchor="middle" className="fill-ink-soft font-mono text-[7px] dark:fill-bone-soft">Scheduler</text>
    <rect x="200" y="20" width="64" height="50" rx="8" className="fill-none stroke-subject-it" strokeWidth="2" />
    <text x="232" y="40" textAnchor="middle" className="fill-ink-soft font-mono text-[8px] dark:fill-bone-soft">CPU</text>
    <text x="232" y="56" textAnchor="middle" className="fill-ink font-mono text-[10px] font-semibold dark:fill-bone">P1</text>
    <defs>
      <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" className="fill-ink/40 dark:fill-bone/40" />
      </marker>
    </defs>
  </svg>
);

export const informationTechnologyCpuSchedulingSimulatorContent: TopicContent = {
  subjectSlug: "information-technology",
  topicSlug: "cpu-scheduling-simulator",
  title: "CPU Scheduling Simulator",
  subjectLabel: "Information Technology",
  topicLabel: "Operating Systems",
  colorToken: "it",
  simulationHref: "/dashboard/information-technology/cpu-scheduling-simulator",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Explain why an operating system needs a scheduling algorithm at all, and what the ready queue represents.",
      "Describe how First-Come First-Served, Shortest Job First, Round Robin, and Priority Scheduling each choose the next process.",
      "Distinguish preemptive scheduling from non-preemptive scheduling, and identify which of the four algorithms is preemptive.",
      "Read a Gantt chart and compute Completion, Turnaround, Waiting, and Response time for a process.",
      "Explain starvation and describe aging as one way to reduce it.",
    ],
    concepts: [
      {
        term: "Process and CPU",
        explanation:
          "A CPU (or CPU core) can only actively execute one process's instructions at any given instant. When several processes are all ready to run at once, something has to decide the order — that decision-maker is the scheduler.",
      },
      {
        term: "The ready queue",
        explanation:
          "Every process that has arrived and is prepared to run, but isn't currently running, sits in the ready queue. Scheduling is really the question of \"which process leaves the ready queue next, and for how long?\"",
      },
      {
        term: "First-Come, First-Served (FCFS)",
        explanation:
          "The simplest rule: whichever process arrived earliest runs first, uninterrupted, until it finishes. Simple and fair by arrival order, but a long process at the front makes every process behind it wait — sometimes called the \"convoy effect.\"",
      },
      {
        term: "Shortest Job First (SJF)",
        explanation:
          "Among the processes that have arrived, the one with the smallest total burst time runs next, uninterrupted. This minimizes average waiting time in theory, but requires knowing burst times in advance — real systems can only estimate them.",
      },
      {
        term: "Round Robin",
        explanation:
          "Every ready process gets a fixed slice of CPU time — the time quantum — before being sent to the back of the queue if it isn't finished. This is the one PREEMPTIVE algorithm covered here: the OS can interrupt a running process even if it hasn't finished or blocked.",
        formula: "\\text{Time Quantum} = q \\;\\Rightarrow\\; P_1 \\to P_2 \\to P_3 \\to P_1 \\to \\ldots",
        formulaCaption: "Round Robin rotates through the ready queue in fixed slices of size q.",
      },
      {
        term: "Priority Scheduling",
        explanation:
          "Each process has a priority number; the arrived process with the best priority runs next, uninterrupted, once started. This simulator uses the convention that a LOWER number means HIGHER priority (Priority 1 beats Priority 5) — the UI states this convention explicitly wherever priority appears.",
      },
      {
        term: "Preemptive vs. non-preemptive",
        explanation:
          "Non-preemptive: once a process starts running, it keeps the CPU until it finishes or blocks itself (FCFS, SJF, and this simulator's Priority Scheduling all work this way). Preemptive: the OS can take the CPU back from a running process before it's done (Round Robin works this way, based on the time quantum expiring).",
      },
      {
        term: "The Gantt chart",
        explanation:
          "A Gantt chart lays the CPU's timeline out visually — which process ran, and for how long, in order. It's the single clearest way to see the difference between what FCFS, SJF, Round Robin, and Priority Scheduling actually do with the same process set.",
      },
      {
        term: "Scheduling metrics",
        explanation:
          "Turnaround Time (how long a process took overall), Waiting Time (how much of that was spent not running), and Response Time (how long until it first got the CPU) are the standard ways to measure how well a schedule serves its processes.",
        formula: "\\text{Turnaround} = \\text{Completion} - \\text{Arrival}, \\quad \\text{Waiting} = \\text{Turnaround} - \\text{Burst}",
        formulaCaption: "The two core formulas used throughout this simulator.",
      },
      {
        term: "Starvation",
        explanation:
          "Under Priority Scheduling (and some other algorithms), a process can wait indefinitely if a steady stream of higher-priority processes keeps arriving — it's technically always \"about to run,\" but never actually does. This is starvation.",
      },
      {
        term: "Aging",
        explanation:
          "One common fix for starvation: gradually improve a waiting process's effective priority the longer it waits, so it eventually outranks new arrivals. This simulator models aging as a simple fixed rate — real schedulers use more sophisticated versions.",
      },
    ],
    whyItMatters:
      "Every multitasking device you use — phone, laptop, game console — runs many more processes than it has CPU cores. Whether an app feels instantly responsive, whether background tasks slow down what you're doing, and whether every program eventually gets its turn all come down to scheduling decisions like the ones this simulator lets you experiment with directly.",
    keyTerms: [
      { term: "Burst time", definition: "How much CPU time a process needs in total to complete its work." },
      { term: "Ready queue", definition: "The set of processes that have arrived and are waiting for their turn on the CPU." },
      { term: "Time quantum", definition: "The fixed slice of CPU time Round Robin gives each process before moving to the next." },
      { term: "Preemption", definition: "The OS taking the CPU away from a running process before it finished or blocked on its own." },
      { term: "Starvation", definition: "A process waiting indefinitely because other processes keep being chosen ahead of it." },
      { term: "Aging", definition: "Gradually raising a waiting process's effective priority over time to prevent starvation." },
    ],
    visualAids: [
      {
        id: "queue-sketch",
        caption: "The ready queue feeds the scheduler, which decides which process the CPU runs next.",
        visual: queueSketch,
      },
    ],
    misconceptions: [
      {
        id: "misconception-one-best-algorithm",
        misconception: "One of these four scheduling algorithms is simply \"the best\" one.",
        correction:
          "Each optimizes for something different — FCFS is simple and predictable, SJF minimizes average waiting time (if burst times are known), Round Robin is fair and responsive for interactive systems, and Priority Scheduling lets important work go first. The right choice depends on what the system needs.",
      },
      {
        id: "misconception-rr-non-preemptive",
        misconception: "Round Robin is non-preemptive, since every process eventually gets its full burst time anyway.",
        correction:
          "Round Robin is preemptive — the OS actively interrupts a running process the instant its time quantum expires, even if it still has work left, and only returns to it later after other processes have had their turn.",
      },
      {
        id: "misconception-priority-always-preemptive",
        misconception: "Priority Scheduling always preempts a running process the instant a higher-priority one arrives.",
        correction:
          "That's true only for PREEMPTIVE priority scheduling. This simulator implements non-preemptive priority scheduling: once a process starts running, it keeps the CPU until it finishes, even if a higher-priority process arrives in the meantime.",
      },
      {
        id: "misconception-shorter-quantum-always-better",
        misconception: "A smaller time quantum in Round Robin is always better because it feels more responsive.",
        correction:
          "A very small quantum increases how often context switches happen, and each context switch has real overhead — too small a quantum can spend more time switching between processes than actually running them.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Before checking in the simulator, predict what each algorithm will do with a small process set.",
    scenarios: [
      {
        id: "it-cpu-sched-predict-001",
        scenario: "P1 arrives at time 0 with a burst of 6. P2 arrives at time 1 with a burst of 2.",
        question: "Under FCFS, which process finishes first?",
        options: [
          { id: "p1", label: "P1 — it arrived first" },
          { id: "p2", label: "P2 — it has the shorter burst" },
        ],
        actualResultOptionId: "p1",
        explanation: "FCFS only looks at arrival order. P1 arrived first, so it runs to completion before P2 ever gets the CPU, even though P2's job is much shorter.",
        hint: "FCFS doesn't consider burst time at all — what's the one thing it looks at?",
      },
      {
        id: "it-cpu-sched-predict-002",
        scenario: "The same two processes — P1 (arrival 0, burst 6) and P2 (arrival 1, burst 2) — are scheduled with SJF instead.",
        question: "Does SJF's result differ from FCFS here?",
        options: [
          { id: "yes", label: "Yes — P2 runs before P1 finishes" },
          { id: "no", label: "No — the order is identical to FCFS" },
        ],
        actualResultOptionId: "no",
        explanation: "This simulator's SJF is non-preemptive: since P1 already started at time 0 (before P2 even arrived), P1 keeps running to completion. SJF only compares burst times among processes that have arrived and aren't already running.",
        hint: "Is P1 already running by the time P2 arrives at time 1?",
      },
      {
        id: "it-cpu-sched-predict-003",
        scenario: "Three processes are in the ready queue under Round Robin with a time quantum of 2: P1 (burst 5), P2 (burst 3), P3 (burst 1).",
        question: "How many separate CPU bursts will P1 need in total to finish its 5 units of work?",
        options: [
          { id: "3", label: "3 bursts (2 + 2 + 1)" },
          { id: "1", label: "1 burst (5 straight through)" },
        ],
        actualResultOptionId: "3",
        explanation: "With quantum 2, P1 runs 2 units, gets preempted, runs another 2 (3 units remaining after the first slice), gets preempted again, then finishes its last 1 unit on a third turn.",
        hint: "If the quantum is smaller than the burst, does the process finish in one turn?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "In the Scheduling Lab tab, pick an algorithm and (for Round Robin) set a time quantum.",
      "Edit the process set's arrival times, burst times, and priorities, or reset to the default set.",
      "Press Play or Step on the Gantt chart to watch the CPU, Ready Queue, and metrics update together.",
      "Switch to Compare Algorithms to run all four algorithms on the same process set side by side.",
      "Switch to Starvation Lab to see a low-priority process wait indefinitely, then toggle aging to fix it.",
    ],
    tryThis: [
      "Run the default process set through all four algorithms and compare each one's average waiting time.",
      "In Round Robin, try quantum 1, then quantum 10 — notice how the schedule changes between many tiny slices and effectively FCFS.",
      "Give one process a very large burst time and see how it affects FCFS versus SJF differently.",
      "In the Starvation Lab, watch P1's waiting time with aging off, then turn aging on and see how much it improves.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "it-cpu-sched-explain-001",
        question: "Why can FCFS make a short process wait a long time?",
        answer: "FCFS only orders by arrival — if a long process happens to arrive first, every process behind it (however short) has to wait for the entire long burst to finish before getting a turn. This is sometimes called the convoy effect.",
      },
      {
        id: "it-cpu-sched-explain-002",
        question: "Why is Round Robin considered fairer for interactive systems than FCFS or SJF?",
        answer: "Because it's preemptive with a fixed quantum, no single process can hold the CPU indefinitely — every ready process is guaranteed to get a turn within a bounded amount of time, which keeps the whole system feeling responsive rather than letting one long job block everyone else.",
      },
      {
        id: "it-cpu-sched-explain-003",
        question: "Why does this simulator implement Priority Scheduling as non-preemptive rather than preemptive?",
        answer: "To keep the model simple and clearly demonstrate one specific, common variant. Non-preemptive priority scheduling only checks priority when the CPU becomes free, whereas a preemptive version would also need to constantly re-check every new arrival against the currently running process — a more complex rule this beginner lab intentionally leaves out.",
      },
      {
        id: "it-cpu-sched-explain-004",
        question: "Why does starvation happen under plain Priority Scheduling but aging fix it?",
        answer: "Without aging, a low-priority process's priority number never changes, so any steady stream of higher-priority arrivals can keep cutting in front of it forever. Aging counteracts this by improving the waiting process's effective priority the longer it waits, so eventually it becomes the best choice even against fresh high-priority arrivals.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "it-cpu-scheduling-simulator",
  },

  // -------------------------------------------------------------
  // CHALLENGE
  // -------------------------------------------------------------
  challenge: {
    intro: "Harder, realistic problems than ordinary Practice. Use the Scheduling Lab to check your reasoning where noted.",
    scenarios: [
      {
        id: "it-cpu-sched-challenge-001",
        title: "Predict the Order",
        scenario: "P1 (arrival 0, burst 4), P2 (arrival 0, burst 2), P3 (arrival 0, burst 6) all arrive at the same time.",
        objective: "Determine the execution order under Shortest Job First.",
        requiresExperiment: true,
        tools: [{ id: "sjf-mode", label: "SJF algorithm in the Scheduling Lab" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "P2, then P1, then P3" },
            { id: "b", label: "P1, then P2, then P3" },
            { id: "c", label: "P3, then P2, then P1" },
          ],
          correctOptionId: "a",
        },
        explanation: "With all three arrived at once, SJF always picks the shortest remaining job first: P2 (2), then P1 (4), then P3 (6).",
        hints: ["SJF compares burst times among everything currently arrived.", "Sort the three burst times from smallest to largest."],
      },
      {
        id: "it-cpu-sched-challenge-002",
        title: "Build the Gantt Chart",
        scenario: "P1 (arrival 0, burst 3), P2 (arrival 1, burst 3), P3 (arrival 2, burst 3) are scheduled under Round Robin with a time quantum of 2.",
        objective: "Determine which process is running during time units 4–6 on the Gantt chart.",
        requiresExperiment: true,
        tools: [{ id: "round-robin-mode", label: "Round Robin algorithm, quantum 2" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "P2" },
            { id: "b", label: "P1" },
            { id: "c", label: "P3" },
          ],
          correctOptionId: "a",
        },
        explanation: "P1 runs 0–2, P2 runs 2–4 (using its full first quantum), then P3 arrives during that and gets queued; from 4–6 P3 runs first as the next in line after P2, but reasoning through the full order is exactly what running it in the simulator confirms — use the Scheduling Lab to trace this step by step and check your own working against the Gantt chart shown.",
        hints: ["Set this exact process set and quantum in the Scheduling Lab and step through it.", "Track the queue's order carefully — a new arrival joins the back of the queue, not the front."],
      },
      {
        id: "it-cpu-sched-challenge-003",
        title: "Calculate Waiting Time",
        scenario: "A single process P1 arrives at time 0 with a burst of 5, and runs alone (no other processes).",
        objective: "Calculate P1's waiting time under any non-preemptive algorithm.",
        requiresExperiment: false,
        answer: { mode: "numeric", target: 0, tolerance: 0 },
        explanation: "With no other processes and no preemption, P1 starts immediately at time 0 and runs straight through to completion at time 5. Turnaround = 5 − 0 = 5, and Waiting = Turnaround − Burst = 5 − 5 = 0.",
        hints: ["Waiting Time = Turnaround Time − Burst Time.", "If nothing else is competing for the CPU, when does P1 start running?"],
      },
      {
        id: "it-cpu-sched-challenge-004",
        title: "Compare the Algorithms",
        scenario: "Using the default process set (P1–P4, mixed arrivals and bursts), open Compare Algorithms.",
        objective: "Identify which algorithm produces the lowest average waiting time for this specific process set.",
        requiresExperiment: true,
        tools: [{ id: "compare-mode", label: "Compare Algorithms tab" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Whichever algorithm the Compare Algorithms tab actually shows as lowest for this process set" },
            { id: "b", label: "FCFS always wins on average waiting time" },
            { id: "c", label: "Round Robin always wins on average waiting time" },
          ],
          correctOptionId: "a",
        },
        explanation: "There's no universal winner — the answer depends on the specific arrival times and burst times in the process set. That's exactly why Compare Algorithms exists: to make the trade-off visible rather than asserted.",
        hints: ["Open Compare Algorithms with the default process set and read the four average waiting times directly.", "Don't assume — the correct answer for THIS process set is whatever the simulator actually computes."],
      },
      {
        id: "it-cpu-sched-challenge-005",
        title: "Identify Preemption",
        scenario: "A student claims: \"In this simulator, a process that starts running always finishes its entire burst without interruption, no matter which algorithm is chosen.\"",
        objective: "Determine whether this claim is true.",
        requiresExperiment: true,
        tools: [{ id: "round-robin-mode", label: "Round Robin algorithm" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "False — Round Robin can interrupt a running process before it finishes" },
            { id: "b", label: "True — every algorithm here runs a process to completion once started" },
          ],
          correctOptionId: "a",
        },
        explanation: "The claim is false for Round Robin specifically: it's the one preemptive algorithm in this simulator, and it interrupts a running process the instant its time quantum expires if the process still has work left.",
        hints: ["Which of the four algorithms is labeled \"Preemptive\" in the simulator's UI?", "Set a burst time larger than the time quantum and watch what happens."],
      },
      {
        id: "it-cpu-sched-challenge-006",
        title: "Identify Starvation",
        scenario: "Open the Starvation Lab with aging turned off.",
        objective: "Explain why P1 ends up with such a large waiting time compared to the other processes.",
        requiresExperiment: true,
        tools: [{ id: "starvation-lab", label: "Starvation Lab tab" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "P1 has the lowest (worst) priority, and higher-priority processes keep arriving and cutting in front of it" },
            { id: "b", label: "P1 arrived last, so it's naturally scheduled last" },
            { id: "c", label: "P1 has the shortest burst time, so SJF is skipping it" },
          ],
          correctOptionId: "a",
        },
        explanation: "P1 arrives first but has priority 5 (the worst in the set). As long as processes with better priority numbers keep arriving, non-preemptive Priority Scheduling keeps choosing them over P1 every time the CPU frees up — this is starvation.",
        hints: ["Check P1's priority number against the other processes in the Starvation Lab.", "Remember: lower number = higher priority in this simulator."],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "information-technology",
      topicSlug: "process-management-simulator",
      label: "Process Management Simulator",
      href: "/dashboard/information-technology/process-management-simulator",
      reason: "This topic covers HOW the CPU decides which ready process runs next; Process Management covers WHAT a process is and how the OS tracks its state while that decision happens.",
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "cpu-ram-storage-data-flow",
      label: "CPU–RAM–Storage Data Flow",
      href: "/dashboard/information-technology/cpu-ram-storage-data-flow",
      reason: "Scheduling decides WHEN a process gets the CPU; this topic covers what the CPU actually does with RAM and storage once it's running.",
    },
  ],
};
