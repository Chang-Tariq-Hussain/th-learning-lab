import type { TopicContent } from "../types";

/**
 * CPU Architecture & Instruction Cycle — sits between Computer
 * Components & Hardware Explorer and CPU–RAM–Storage Data Flow in the
 * Information Technology > Computer Fundamentals sequence (see
 * `@/features/learning-path/data/information-technology-computer-fundamentals`).
 * Authored content flowing through the same generic `TopicExperience`
 * every other subject uses, with `CpuArchitectureInstructionCycle`
 * (the Virtual CPU Laboratory) supplied as the Explore simulation.
 *
 * This topic answers "what happens inside the CPU when it executes
 * one instruction?" — registers, the ALU, the Control Unit, the
 * Program Counter, and the Fetch/Decode/Execute/Write-Back cycle
 * itself. It deliberately does not re-teach the CPU–RAM–Storage Data
 * Flow topic's bus/cache/memory-hierarchy model (see that topic's
 * `relatedTopics` link back here) — this one stays inside the CPU.
 */
export const informationTechnologyCpuArchitectureInstructionCycleContent: TopicContent = {
  subjectSlug: "information-technology",
  topicSlug: "cpu-architecture-instruction-cycle",
  title: "CPU Architecture & Instruction Cycle",
  subjectLabel: "Information Technology",
  topicLabel: "Computer Fundamentals",
  colorToken: "it",
  simulationHref: "/dashboard/information-technology/cpu-architecture-instruction-cycle",

  // -------------------------------------------------------------
  // LEARN — what am I learning?
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Name the CPU's main internal parts — Control Unit, ALU, registers, Program Counter, Instruction Register, and Flags — and explain what each one does.",
      "Trace one instruction through Fetch, Decode, Execute, and Write Back, naming which part is active at each stage.",
      "Explain why the Program Counter normally increments by one, and how a branch or jump instruction changes that.",
      "Read a simple instruction like ADD R1, R2 and predict what the ALU, registers, and flags will do with it.",
    ],
    concepts: [
      // --- Beginner: the core parts ---------------------------------
      {
        term: "The CPU executes instructions in small, repeated steps",
        explanation:
          "Rather than running a whole program in one motion, the CPU processes one instruction at a time through the same repeating cycle: Fetch it, Decode it, Execute it, then Write Back the result — then move to the next instruction.",
      },
      {
        term: "The Control Unit coordinates, it doesn't calculate",
        explanation:
          "The Control Unit reads the decoded instruction and generates the signals that tell every other part of the CPU what to do this cycle — which registers to read, what the ALU should compute, whether to write a result. It's the conductor, not the orchestra.",
      },
      {
        term: "The ALU does the arithmetic and logic",
        explanation:
          "The Arithmetic Logic Unit takes two inputs, performs one operation (add, subtract, AND, OR, XOR, or compare), and produces a result. It never decides what to compute on its own — the Control Unit tells it.",
      },
      {
        term: "Registers are the CPU's own tiny, fast storage",
        explanation:
          "Registers sit inside the CPU itself and hold the handful of values an instruction is actively working with right now. This lab simulates four general-purpose registers, R0 through R3.",
      },
      // --- Intermediate: PC, IR, memory, flags, clock -----------------
      {
        term: "The Program Counter tracks what comes next",
        explanation:
          "The Program Counter (PC) holds the address of the next instruction to fetch. After each fetch it normally advances by one — an educational simplification, since real instructions vary in length — unless a branch or jump instruction sets it somewhere else.",
      },
      {
        term: "The Instruction Register holds the instruction in progress",
        explanation:
          "Once Fetch copies an instruction out of memory, it's held in the Instruction Register for the rest of that instruction's cycle, so Decode and Execute always know exactly which instruction they're working with.",
      },
      {
        term: "Flags record what the last ALU result looked like",
        explanation:
          "After an arithmetic or logic operation, the Flags register records simple facts about the result — was it zero? Negative? These flags are what a later branch instruction like BEQ checks to decide whether to jump.",
      },
      {
        term: "A clock cycle paces execution, but isn't one instruction",
        explanation:
          "This lab treats one micro-step (Fetch, Decode, Execute, or Write Back) as one clock cycle to keep the timeline concrete — but on a real CPU, clock frequency describes cycles per second, and a single instruction does not universally take exactly one cycle.",
        formula: "\\text{Frequency (Hz)} = \\text{cycles per second}",
        formulaCaption: "Clock frequency, not \"instructions per second\"",
      },
      // --- Advanced: instruction format, pipeline, cache --------------
      {
        term: "An instruction splits into an opcode and operands",
        explanation:
          "Decode separates an instruction like ADD R1, R2 into its opcode (ADD — what to do) and its operands (R1, R2 — what to do it to). This simulation uses one simplified instruction format; real architectures vary.",
      },
      {
        term: "Pipelining overlaps instructions instead of queuing them",
        explanation:
          "A pipelined CPU starts fetching the next instruction as soon as the current one moves on to Decode, rather than waiting for one instruction to fully finish before starting the next — letting several instructions be mid-flight at once.",
      },
      {
        term: "The CPU checks cache before going to RAM",
        explanation:
          "This lab doesn't simulate cache hits and misses in depth (that belongs to the CPU–RAM–Storage Data Flow topic) — but conceptually, the CPU checks a small, fast cache layer before falling back to slower RAM for instructions and data.",
      },
    ],
    whyItMatters:
      "Every program you run — a game, a spreadsheet, a web browser — ultimately becomes a long sequence of instructions like the ones in this lab, each one moving through Fetch, Decode, Execute, and Write Back. Understanding that cycle is what turns \"the CPU is the brain of the computer\" from a slogan into something you can actually trace, step by step — and it's the foundation the rest of Information Technology's Computer Fundamentals topics (data flow, binary representation, booting, operating systems) build directly on top of.",
    keyTerms: [
      { term: "Control Unit", definition: "Coordinates the CPU's other parts — generates the signals that drive each stage of instruction execution." },
      { term: "ALU", definition: "Arithmetic Logic Unit — performs arithmetic (add, subtract) and logic (AND, OR, XOR, compare) operations." },
      { term: "Register", definition: "A tiny, extremely fast storage slot inside the CPU, such as R0–R3, the PC, or the IR." },
      { term: "Program Counter (PC)", definition: "Holds the address of the next instruction to fetch." },
      { term: "Instruction Register (IR)", definition: "Holds the instruction currently being decoded and executed." },
      { term: "Opcode", definition: "The part of an instruction that says what operation to perform, e.g. ADD or STORE." },
      { term: "Operand", definition: "The part of an instruction that says what the operation applies to, e.g. R1 or an address." },
      { term: "Flags register", definition: "Records simple true/false facts (Zero, Negative, Carry, Overflow) about the last ALU result." },
      { term: "Fetch \u2192 Decode \u2192 Execute \u2192 Write Back", definition: "The repeating cycle every instruction passes through." },
      { term: "Pipeline", definition: "Overlapping the stages of several instructions so more than one is mid-execution at once." },
    ],
    misconceptions: [
      {
        id: "misconception-cpu-runs-whole-program-at-once",
        misconception: "The CPU somehow runs an entire program in one motion.",
        correction:
          "The CPU processes one instruction at a time, each moving through the same Fetch → Decode → Execute → Write Back cycle, over and over, extremely quickly — not the whole program simultaneously.",
      },
      {
        id: "misconception-alu-decides-what-to-do",
        misconception: "The ALU decides on its own what operation to perform.",
        correction:
          "The ALU only performs whatever operation the Control Unit tells it to, based on the decoded instruction. The ALU has no decision-making role of its own.",
      },
      {
        id: "misconception-pc-always-increments",
        misconception: "The Program Counter always just goes up by one, instruction after instruction.",
        correction:
          "That's true for ordinary, sequential instructions — but a branch (like BEQ) or jump instruction can set the PC to a completely different address, which is exactly how loops and conditionals are possible at this level.",
      },
      {
        id: "misconception-one-instruction-one-clock-cycle",
        misconception: "Every instruction takes exactly one clock cycle on a real CPU.",
        correction:
          "This lab's four-stage-per-instruction model is a teaching simplification. On real CPUs, different instructions can take different numbers of cycles, and modern CPUs additionally overlap instructions via pipelining.",
      },
      {
        id: "misconception-registers-same-as-cache",
        misconception: "Registers and cache are basically the same thing.",
        correction:
          "Registers are a handful of individually named, extremely fast storage slots inside the CPU core holding the exact values an instruction is using right now. Cache is a much larger pool of memory holding copies of recently used data, organized by address rather than by name.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT — what should I predict?
  // -------------------------------------------------------------
  predict: {
    intro: "Before you run each program in the lab below, predict what will happen — then run it and check.",
    scenarios: [
      {
        id: "it-cpu-arch-predict-001",
        scenario: "PC = 100, and the instruction at address 100 is LOAD R1, 5.",
        question: "What happens during the Fetch stage?",
        options: [
          { id: "fetch", label: "Memory[100] is read into the Instruction Register, and PC advances to 101" },
          { id: "execute", label: "R1 is immediately set to 5" },
          { id: "nothing", label: "Nothing — Fetch only happens for branch instructions" },
        ],
        actualResultOptionId: "fetch",
        explanation:
          "Fetch's only job is to read whatever instruction sits at the address the PC points to, load it into the Instruction Register, and advance the PC — the actual loading of 5 into R1 doesn't happen until Execute and Write Back.",
        hint: "Fetch happens before the CPU has even looked at what the instruction means.",
      },
      {
        id: "it-cpu-arch-predict-002",
        scenario: "R1 = 5 and R2 = 7, and the next instruction is ADD R1, R2.",
        question: "What will the ALU compute during Execute?",
        options: [
          { id: "12", label: "5 + 7 = 12" },
          { id: "2", label: "7 − 5 = 2" },
          { id: "35", label: "5 × 7 = 35" },
        ],
        actualResultOptionId: "12",
        explanation: "ADD Rd, Rs adds the two register values — R1 (5) plus R2 (7) — giving 12, which Write Back then stores into R1.",
        hint: "ADD only ever adds; check the two register values against the opcode.",
      },
      {
        id: "it-cpu-arch-predict-003",
        scenario: "R1 = 5 and R2 = 5, and the next instruction is BEQ R1, R2, 110.",
        question: "What happens to the Program Counter?",
        options: [
          { id: "jump", label: "It's set to 110, because R1 equals R2" },
          { id: "sequential", label: "It just advances by one, as usual" },
          { id: "zero", label: "It's reset to 0" },
        ],
        actualResultOptionId: "jump",
        explanation: "BEQ branches only when its two registers are equal. Since R1 and R2 are both 5, the branch is taken and PC is set to 110.",
        hint: "BEQ stands for \"branch if equal\" — check whether the condition holds.",
      },
      {
        id: "it-cpu-arch-predict-004",
        scenario: "The next instruction is STORE R1, 200, where R1 currently holds 12.",
        question: "What ends up in simulated memory address 200?",
        options: [
          { id: "12", label: "12 — the value in R1" },
          { id: "200", label: "200 — the address itself" },
          { id: "unchanged", label: "Nothing — STORE only affects registers" },
        ],
        actualResultOptionId: "12",
        explanation: "STORE writes the value currently held in the named register (12, in R1) to the given memory address (200) during Write Back.",
        hint: "STORE Rd, addr — which of the two operands is the value, and which is the destination?",
      },
      {
        id: "it-cpu-arch-predict-005",
        scenario: "R1 = 6 and R2 = 3, and the next instruction is CMP R1, R2.",
        question: "What does Write Back do after this instruction's Execute stage?",
        options: [
          { id: "nothing", label: "Nothing to R1 or R2 — only the Flags were updated, during Execute" },
          { id: "writes-r1", label: "It writes the comparison result into R1" },
          { id: "writes-r2", label: "It writes the comparison result into R2" },
        ],
        actualResultOptionId: "nothing",
        explanation:
          "CMP computes a subtraction purely to update the Flags register — it never writes a result back into either register, which is what distinguishes it from SUB.",
        hint: "CMP and SUB compute the same thing internally — but only one of them changes a register.",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE — the guided experiment
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Start on the CPU Lab tab with the Addition scenario loaded, and press Start — watch the timeline move through Fetch, Decode, Execute, and Write Back for each instruction.",
      "Click any part of the CPU diagram — the Control Unit, ALU, Registers, PC, IR — to read what it does in the Component Inspector.",
      "Switch the detail level from Beginner to Intermediate to reveal the Program Counter, Instruction Register, Flags, and Clock; switch to Technical to see binary values and the CPU Bus.",
      "Load the Conditional Branch scenario and step through it slowly — watch the Program Counter skip an instruction when the branch is taken.",
      "Open the Execution Log and click an earlier cycle to jump straight back to it without replaying the whole run.",
      "Switch to the Pipeline (Advanced) tab to see how several instructions would overlap across the same stages instead of running one at a time.",
    ],
    tryThis: [
      "Load the Memory Store scenario and compare the Execute and Write Back stages of its STORE instruction — what changes between them?",
      "Write your own three-instruction program in the editor (e.g. LOAD R0, 9 / LOAD R1, 4 / SUB R0, R1) and predict the final register values before running it.",
      "Run the Conditional Branch scenario and count exactly how many total cycles it takes — then explain why the skipped instruction adds zero cycles.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN — why does this happen?
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "it-cpu-arch-explain-001",
        question: "Why does the CPU split instruction execution into four separate stages instead of doing it all at once?",
        answer:
          "Each stage has a genuinely different job: Fetch retrieves the instruction, Decode figures out what it means, Execute actually carries it out, and Write Back records the result. Splitting them keeps each stage simple, gives the Control Unit clear points at which to coordinate, and is also what makes pipelining possible later — you can't overlap stages that were never separated in the first place.",
      },
      {
        id: "it-cpu-arch-explain-002",
        question: "Why doesn't the ALU decide what operation to run?",
        answer:
          "The ALU is a general-purpose calculator — it can add, subtract, or perform a logic operation, but has no way to know which one an instruction called for. That decision comes from Decode reading the instruction's opcode, and the Control Unit then telling the ALU which specific operation to run this cycle.",
      },
      {
        id: "it-cpu-arch-explain-003",
        question: "Why does CMP not write to a register, even though it computes a subtraction just like SUB does?",
        answer:
          "CMP's entire purpose is to update the Flags register so a later branch instruction can check the result — not to keep the subtracted value itself. Writing it to a register would overwrite data the program might still need, for no benefit, since only the flags matter for a comparison.",
      },
      {
        id: "it-cpu-arch-explain-004",
        question: "Why does the Program Counter update during Fetch instead of waiting until the instruction finishes?",
        answer:
          "Advancing the PC during Fetch means the CPU already knows where the next instruction is the moment it needs it — it doesn't have to pause and recompute that address later. A branch or jump instruction can still override this default during Execute, which is exactly how the PC ends up somewhere other than \"the next address\" when needed.",
      },
      {
        id: "it-cpu-arch-explain-005",
        question: "Why is treating \"one clock cycle equals one micro-step\" called out as a simplification?",
        answer:
          "Real CPUs don't uniformly spend one clock cycle per Fetch/Decode/Execute/Write Back step — some operations take longer, some are combined, and pipelining lets several instructions' stages overlap in the same cycle. This lab's one-micro-step-per-cycle model keeps the timeline easy to follow, at the cost of not being a literal cycle count for any real processor.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE — can I solve a problem using this?
  // -------------------------------------------------------------
  practice: {
    // Foreign key into the quiz-engine registry — all questions live in
    // @/features/quiz-engine/data/it-cpu-architecture-instruction-cycle-practice-quiz.ts, none duplicated here.
    quizId: "it-cpu-architecture-instruction-cycle-practice",
  },

  // -------------------------------------------------------------
  // CHALLENGE — realistic problems, some folding in the real-world mission
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice. Some are worked out from reasoning alone; others ask you to use the lab above to check your answer. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "it-cpu-arch-challenge-001",
        title: "Name the Parts",
        scenario: "A classmate can describe what the CPU does in general, but can't name which internal part is responsible for which job.",
        objective: "Match \"performs arithmetic and logic\" to the correct CPU part.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "The ALU" },
            { id: "b", label: "The Control Unit" },
            { id: "c", label: "The Program Counter" },
            { id: "d", label: "The Instruction Register" },
          ],
          correctOptionId: "a",
        },
        explanation:
          "The Arithmetic Logic Unit is specifically the part built to perform arithmetic (add, subtract) and logic (AND, OR, XOR, compare) operations. The Control Unit coordinates but doesn't calculate; the PC and IR are storage, not computation.",
        hints: ["Which part's name literally describes what it does?", "The Control Unit tells this part what to do — it doesn't do the math itself."],
      },
      {
        id: "it-cpu-arch-challenge-002",
        title: "Order the Cycle",
        scenario: "A study guide lists the four stages of instruction execution out of order.",
        objective: "Put Fetch, Decode, Execute, and Write Back into their correct order.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Fetch \u2192 Decode \u2192 Execute \u2192 Write Back" },
            { id: "b", label: "Decode \u2192 Fetch \u2192 Write Back \u2192 Execute" },
            { id: "c", label: "Execute \u2192 Fetch \u2192 Decode \u2192 Write Back" },
            { id: "d", label: "Fetch \u2192 Execute \u2192 Decode \u2192 Write Back" },
          ],
          correctOptionId: "a",
        },
        explanation:
          "The instruction has to be retrieved before it can be understood (Decode), understood before it can be carried out (Execute), and carried out before its result can be recorded (Write Back) — each stage depends on the one before it.",
        hints: ["You can't decode an instruction you haven't fetched yet.", "The result being written back has to come from somewhere — which stage produces it?"],
      },
      {
        id: "it-cpu-arch-challenge-003",
        title: "Trace the Registers",
        scenario: "Using the CPU Lab above, load the Addition scenario (LOAD R1, 5 / LOAD R2, 7 / ADD R1, R2) and run it all the way through.",
        objective: "Determine the final value of R1 after the full program finishes.",
        tools: [{ id: "register-panel", label: "Register panel" }],
        answer: { mode: "numeric", target: 12, tolerance: 0 },
        explanation: "R1 is loaded with 5, then ADD R1, R2 adds R2's 7 to it during Execute and writes 12 back into R1 — the simulation's Register panel should show R1 = 12 at the end.",
        hints: ["Run the program to completion and read R1's final value directly off the Register panel.", "ADD writes its result into the first register named, not the second."],
      },
      {
        id: "it-cpu-arch-challenge-004",
        title: "Skip or No Skip?",
        scenario: "Using the CPU Lab above, load the Conditional Branch scenario and step through it one cycle at a time.",
        objective: "Determine whether the instruction LOAD R3, 99 actually executes during this run.",
        constraints: [{ id: "c1", label: "Step through the whole program before answering — don't guess from the source alone." }],
        tools: [{ id: "execution-log", label: "Execution Log" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "No — the branch is taken because R1 equals R2, so the PC jumps past it" },
            { id: "b", label: "Yes — every instruction in the program always executes" },
            { id: "c", label: "No — LOAD instructions never execute after a branch" },
          ],
          correctOptionId: "a",
        },
        explanation:
          "R1 and R2 both equal 5, so BEQ's condition is true and the branch is taken, setting the PC straight to the address of LOAD R3, 1 — the Execution Log shows no Fetch/Decode/Execute/Write Back cycles for the skipped LOAD R3, 99 at all.",
        hints: ["Check the target address in the BEQ instruction against where the log's next Fetch actually happens.", "A skipped instruction never appears in the Execution Log at all — it isn't fetched."],
      },
      {
        id: "it-cpu-arch-challenge-005",
        title: "Predict the ALU Result",
        scenario: "R0 = 6 and R1 = 9, and the next instruction is XOR R0, R1.",
        objective: "Determine the value that Write Back stores into R0.",
        constraints: [{ id: "c1", label: "Work this out from the operation itself, or check it by building this instruction in the lab above." }],
        answer: { mode: "numeric", target: 15, tolerance: 0 },
        explanation: "XOR compares the two values bit by bit: 6 (0110) XOR 9 (1001) = 15 (1111), since every corresponding bit differs — that result is what Write Back stores into R0.",
        hints: ["Switch to Technical detail level to see the binary breakdown the ALU panel shows for logic operations.", "XOR sets each output bit to 1 exactly where the two input bits differ."],
      },
      {
        id: "it-cpu-arch-challenge-006",
        title: "Read the Pipeline Table",
        scenario: "Using the Pipeline (Advanced) tab above with the Pipeline Demo scenario's four instructions loaded.",
        objective: "Determine which pipeline stage the second instruction occupies during the very same cycle the first instruction reaches Execute.",
        tools: [{ id: "pipeline-table", label: "Pipeline table" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Decode" },
            { id: "b", label: "Fetch" },
            { id: "c", label: "Write Back" },
            { id: "d", label: "It isn't running yet" },
          ],
          correctOptionId: "a",
        },
        explanation:
          "In the overlapping pipeline model, instruction 2 always trails instruction 1 by exactly one stage — so at the cycle where instruction 1 is in Execute, instruction 2 is one stage behind, in Decode, rather than waiting for instruction 1 to finish entirely.",
        hints: ["Read straight down the pipeline table's column for that cycle.", "Every instruction in this table is offset from the one before it by exactly one stage."],
      },
      {
        id: "it-cpu-arch-challenge-007",
        title: "Real-World Mission: Explain the Slowdown",
        scenario:
          "A friend read that clock speed \"went up\" on their new laptop's CPU but says their video editor still doesn't feel proportionally faster, and asks why more cycles per second didn't mean proportionally more done.",
        objective: "Use what this topic explains about the instruction cycle to give the single most accurate one-sentence explanation.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Clock speed is cycles per second, not instructions per second — instructions can take a different number of cycles, and other bottlenecks (like RAM or storage speed) can limit real-world performance too" },
            { id: "b", label: "Clock speed has nothing to do with CPU performance at all" },
            { id: "c", label: "Every instruction always takes exactly one cycle, so more cycles should always mean proportionally more work" },
            { id: "d", label: "Video editors specifically ignore clock speed" },
          ],
          correctOptionId: "a",
        },
        explanation:
          "This lab's own Clock Cycle disclaimer applies directly here: a higher clock frequency means more cycles happen per second, but since instructions don't uniformly cost one cycle each, and other parts of the system (memory, storage, software) can be the actual bottleneck, a faster clock alone doesn't guarantee proportionally faster real-world results.",
        hints: ["Reread the Clock disclaimer shown under the CPU Lab.", "What else, besides the CPU's clock, could be slowing down a video editor?"],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "information-technology",
      topicSlug: "computer-components-explorer",
      label: "Computer Components & Hardware Explorer",
      href: "/dashboard/information-technology/computer-components-explorer",
      reason: "See the CPU as a physical chip on the motherboard before diving into what happens logically inside it.",
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "cpu-ram-storage-data-flow",
      label: "CPU\u2013RAM\u2013Storage Data Flow",
      href: "/dashboard/information-technology/cpu-ram-storage-data-flow",
      reason: "See how the CPU, RAM, and storage exchange data — the buses and cache this instruction cycle depends on.",
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "binary-data-representation",
      label: "Binary & Data Representation",
      href: "/dashboard/information-technology/binary-data-representation",
      reason: "See how the register values and ALU results in this lab are really represented in binary.",
    },
  ],
};
