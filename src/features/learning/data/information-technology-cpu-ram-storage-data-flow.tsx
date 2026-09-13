import type { TopicContent } from "../types";

/**
 * CPU–RAM–Storage Data Flow — the second stop in the Information
 * Technology > Computer Fundamentals sequence (see
 * `@/features/learning-path/data/information-technology-computer-fundamentals`).
 * First topic in the new Information Technology subject; introduces
 * no new GLE infrastructure — this is authored content flowing
 * through the same generic `TopicExperience` every other subject
 * uses, with `CpuRamStorageDataFlow` (a 2D/2.5D animated diagram, not
 * 3D — see that component's own comments for why) supplied as the
 * Explore simulation.
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
      "Explain the different roles storage, RAM, and the CPU each play when a computer does something.",
      "Trace where data lives at each stage of opening an application, saving a file, and running a program.",
      "Explain why programs are copied into RAM before the CPU can use them, rather than run directly from storage.",
      "Distinguish RAM's temporary, power-dependent memory from storage's permanent memory.",
    ],
    concepts: [
      {
        term: "Storage is slow but permanent",
        explanation:
          "Storage (an SSD or hard drive) holds the operating system, applications, and files even when the computer is completely off. It's much slower to access than RAM, which is exactly why the computer doesn't run programs directly out of it.",
      },
      {
        term: "RAM is fast but temporary",
        explanation:
          "RAM (working memory) holds whatever the CPU is actively using right now. It's dramatically faster to read and write than storage, but everything in it disappears the instant power is lost — which is why unsaved work vanishes if a computer crashes.",
      },
      {
        term: "The CPU only ever talks to RAM",
        explanation:
          "The CPU fetches instructions and data from RAM, executes them, and writes results back to RAM — it never reads directly from storage. Anything storage holds has to be copied into RAM first before the CPU can use it.",
        formula: "\\text{Storage} \\rightarrow \\text{RAM} \\leftrightarrow \\text{CPU}",
        formulaCaption: "Data moves one way in from storage, then back and forth between RAM and the CPU",
      },
      {
        term: "Saving reverses the direction",
        explanation:
          "While you're editing, your changes live only in RAM's working copy. Saving is the deliberate act of copying that working copy back out to storage, which is what makes the change survive after the computer is turned off.",
      },
    ],
    whyItMatters:
      "This one relationship — slow permanent storage, fast temporary RAM, and a CPU that only ever talks to RAM — explains a huge amount of everyday computer behavior: why more RAM makes a computer feel faster, why unsaved work is lost in a crash, why a large file takes a moment to open, and why closing an app that's \"frozen\" doesn't destroy your files on disk. Understanding this data flow is the foundation everything else in computing builds on.",
    keyTerms: [
      { term: "CPU", definition: "The processor — fetches instructions and data from RAM, executes them, and writes results back." },
      { term: "RAM", definition: "Temporary working memory; fast to access, but cleared whenever the computer loses power." },
      { term: "Storage", definition: "Long-term memory (SSD/hard drive); slower than RAM, but keeps its contents with the power off." },
      { term: "Loading", definition: "Copying data or a program from storage into RAM so it's ready for the CPU to use." },
      { term: "Saving", definition: "Copying RAM's working copy of something back out to storage, so the change becomes permanent." },
    ],
    visualAids: [
      {
        id: "data-flow-sketch",
        caption:
          "Storage feeds RAM, and RAM feeds the CPU — data always gets copied into RAM before the CPU can work with it.",
        visual: dataFlowSketch,
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
        id: "misconception-more-ram-means-more-storage",
        misconception: "RAM and storage are just two names for the same kind of memory, and more of either does the same thing.",
        correction:
          "They solve different problems. Storage capacity is about how many files and apps you can keep on the computer at all. RAM capacity is about how much can be actively in use by the CPU at once, without the computer having to constantly swap things in and out.",
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
  // (Doubles as the brief's "Experiment Mode": commit to an answer
  // for each stage of the storage → RAM → CPU chain before revealing it.)
  // -------------------------------------------------------------
  predict: {
    intro:
      "Before you run each scenario in the simulation below, predict where the data is at each stage — you'll only be able to run the animation after locking in an answer.",
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
        scenario: "You double-click that application's icon to open it.",
        question: "Before the CPU can start running the application, where does it first get copied to?",
        options: [
          { id: "ram", label: "RAM" },
          { id: "output", label: "Straight to the screen" },
          { id: "stays-storage", label: "It stays in storage — the CPU reads it from there" },
        ],
        actualResultOptionId: "ram",
        explanation:
          "The application's code is copied from storage into RAM first. The CPU only ever works from RAM, never directly from storage.",
        hint: "Storage is too slow for the CPU to use directly — what does storage hand the application off to first?",
      },
      {
        id: "it-data-flow-predict-003",
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
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE — the guided experiment
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Pick a scenario tab: Opening an Application, Saving a File, or Running a Program.",
      "Press Start and watch the data packet move between Storage, RAM, the CPU, and Output, one step at a time.",
      "Read the explanation panel under the diagram after each step — it says exactly what that piece of data represents.",
      "Use Step instead of Start to advance one step at a time at your own pace, and Reset to start the scenario over.",
      "Click any component in the diagram at any point to read what it does, independent of the current step.",
    ],
    tryThis: [
      "Compare the Opening an Application and Saving a File scenarios — which steps are mirror images of each other?",
      "In the Running a Program scenario, notice how many times data moves back and forth between RAM and the CPU before Output appears — that repeating exchange is the core of how any program runs.",
      "After finishing a scenario, click Storage and then RAM back to back and compare their descriptions in your own words.",
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
        question: "Why does data keep moving back and forth between RAM and the CPU while a program runs, instead of moving once and stopping?",
        answer:
          "A running program is a long sequence of individual instructions. The CPU fetches one instruction from RAM, executes it, writes any result back to RAM, then fetches the next instruction — and repeats that cycle, extremely fast, for as long as the program keeps running.",
      },
      {
        id: "it-data-flow-explain-003",
        question: "Why does saving a file involve writing to storage, when the file was already \"on the screen\" the whole time?",
        answer:
          "What you see on screen and what the app is working with both come from RAM's temporary working copy, not from storage. Storage isn't updated until you explicitly save — that's the one step that copies RAM's current version back out to permanent memory.",
      },
      {
        id: "it-data-flow-explain-004",
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
          "Using the Running a Program scenario in the simulation above, a classmate claims a program only moves data from storage to RAM to the CPU once, in a single straight line, from start to finish.",
        objective:
          "Run the Running a Program scenario above and determine whether that claim matches what the simulation actually shows.",
        constraints: [
          { id: "c1", label: "Watch the full scenario through to its final Output step before answering." },
        ],
        tools: [{ id: "scenario-picker", label: "Running a Program scenario tab" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "False — RAM and the CPU exchange data repeatedly before Output appears" },
            { id: "b", label: "True — the simulation shows exactly one RAM-to-CPU step" },
            { id: "c", label: "False — the program skips RAM entirely and goes straight from storage to the CPU" },
          ],
          correctOptionId: "a",
        },
        explanation:
          "The Running a Program scenario deliberately shows RAM and the CPU exchanging data more than once — a fetch, an execute, a write-back, and another fetch — before Output appears, representing the repeating cycle a real program's instructions go through, not a single one-way trip.",
        hints: [
          "Count how many separate arrows or steps involve RAM and the CPU together in that scenario.",
          "The simulation's own explanation panel calls this out directly at one of the steps — what does it say?",
        ],
      },
      {
        id: "it-data-flow-challenge-004",
        title: "Real-World Mission: Explain It to a Friend",
        scenario:
          "A friend who's never studied computers asks why their laptop feels much faster right after they added more RAM, even though they didn't touch the hard drive at all.",
        objective:
          "Use what the Storage → RAM → CPU relationship above explains to write the single most accurate one-sentence reason more RAM makes a computer feel faster.",
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

  relatedTopics: [],
};
