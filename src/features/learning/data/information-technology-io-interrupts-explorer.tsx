import type { TopicContent } from "../types";

/**
 * I/O & Interrupts Explorer — the step between Computer Boot Process
 * and Operating Systems in the Information Technology > Computer
 * Fundamentals sequence (see
 * `@/features/learning-path/data/information-technology-computer-fundamentals`).
 * Flows through the same generic `TopicExperience` every other topic
 * uses; `IoInterruptsExplorer` (a 2D/2.5D SVG laboratory) is supplied
 * as the Explore simulation.
 *
 * Every mechanism here is taught as a simplified educational model.
 * Real interrupt handling, priority, masking, vectors, memory-mapped
 * and port-mapped I/O, and DMA vary across architectures and
 * operating systems.
 */

const journeySketch = (
  <svg viewBox="0 0 300 70" className="mx-auto h-20 w-full max-w-md" role="img" aria-labelledby="io-journey-sketch-title">
    <title id="io-journey-sketch-title">A device event travels to the controller, then raises an interrupt to the CPU, which runs the ISR and returns to the main program.</title>
    {["Device", "Controller", "IRQ", "CPU", "ISR", "Return"].map((label, i) => (
      <g key={label}>
        <rect x={4 + i * 49} y={16} width={44} height={26} rx={6} className="fill-none stroke-subject-it" strokeWidth="2" />
        <text x={26 + i * 49} y={33} textAnchor="middle" className="fill-ink font-mono text-[8px] dark:fill-bone">
          {label}
        </text>
        {i < 5 && <line x1={48 + i * 49} y1={29} x2={53 + i * 49} y2={29} strokeWidth="1.5" className="stroke-ink/40 dark:stroke-bone/40" />}
      </g>
    ))}
    <text x={150} y={62} textAnchor="middle" className="fill-ink-soft font-mono text-[8px] dark:fill-bone-soft">
      device event → interrupt → ISR → back to work
    </text>
  </svg>
);

export const informationTechnologyIoInterruptsExplorerContent: TopicContent = {
  subjectSlug: "information-technology",
  topicSlug: "io-interrupts-explorer",
  title: "I/O & Interrupts Explorer",
  subjectLabel: "Information Technology",
  topicLabel: "Computer Fundamentals",
  colorToken: "it",
  simulationHref: "/dashboard/information-technology/io-interrupts-explorer",

  learn: {
    objectives: [
      "Explain what I/O is, distinguish input from output, and describe why devices are reached through device controllers.",
      "Compare polling with interrupt-driven I/O, and trace an interrupt from the device to the ISR and back to the interrupted program.",
      "Describe interrupt priority, multiple pending interrupts, masking, nesting, and the non-maskable interrupt idea as simplified models.",
      "Explain the interrupt vector, memory-mapped vs port-mapped I/O, and how DMA reduces CPU involvement in large transfers.",
    ],
    concepts: [
      {
        term: "1. What is I/O?",
        explanation:
          "I/O (input/output) is communication between a computer system and its devices — keyboards, mice, disks, network adapters, displays, printers, and timers. Without it, a computer could compute but never receive or show anything.",
      },
      {
        term: "2. Input vs output",
        explanation:
          "Input brings data into the computer (Keyboard → CPU, Disk → Memory). Output sends data out (CPU → Display, CPU → Printer). Some devices, like storage and network adapters, do both.",
      },
      {
        term: "3. Device controllers",
        explanation:
          "Software usually doesn't manipulate a physical device directly. Each device has a controller with a status, a data buffer, and control information. The CPU talks to the controller, and the controller manages the device.",
      },
      {
        term: "4. CPU/device interaction",
        explanation:
          "To use a device, the CPU issues an I/O request to its controller, the device does its (often slow) work, data becomes available in the controller, and the request completes. The interesting question is how the CPU finds out the device is ready.",
      },
      {
        term: "5. Polling",
        explanation:
          "In polling, the CPU repeatedly checks the device's status. It is simple and predictable, but checks that find the device not ready are wasted CPU time. Polling isn't always bad — it can be a good fit when a device is almost always ready or checks are infrequent.",
      },
      {
        term: "6. Interrupts",
        explanation:
          "An interrupt is a mechanism through which a device or event requests the CPU's attention. The CPU keeps doing useful work and only responds when an interrupt request arrives.",
      },
      {
        term: "7. Interrupt Service Routine (ISR)",
        explanation:
          "The ISR is the code run to handle an interrupt — it reads data from the controller, does what's needed, and acknowledges the device.",
      },
      {
        term: "8. CPU state during interrupts",
        explanation:
          "Before running an ISR, the CPU saves where it was — the program counter, registers, and flags. After the ISR, the saved state is restored so the interrupted program continues as if nothing happened. Real entry and return details vary by architecture and OS.",
      },
      {
        term: "9. Interrupt priority",
        explanation:
          "When several interrupts are pending, a priority scheme decides which is serviced first. In this lab's simplified model, higher priority means handled first. Real priority mechanisms vary across architectures and operating systems.",
      },
      {
        term: "10. Interrupt vectors",
        explanation:
          "An interrupt number is used to look up an entry in a vector table, and that entry gives the address of the ISR: number → vector entry → ISR address → ISR. Actual implementations differ between architectures.",
      },
      {
        term: "11. Multiple interrupts",
        explanation:
          "Several devices can raise interrupts close together. The extras wait as pending interrupts until the CPU can service them — the handling order depends on the policy in use (here: priority or arrival order).",
      },
      {
        term: "12. Maskable interrupts",
        explanation:
          "Masking temporarily tells the CPU to defer certain interrupts. A masked interrupt isn't discarded — it stays pending until it becomes eligible. Exact masking behavior depends on the architecture and context.",
      },
      {
        term: "13. Non-maskable interrupt (NMI)",
        explanation:
          "An NMI is a category of interrupt designed to bypass ordinary interrupt masking, meant for critical conditions that shouldn't be ignored. It isn't tied to one universal hardware event, and exact behavior depends on the architecture.",
      },
      {
        term: "14. Memory-mapped I/O",
        explanation:
          "In memory-mapped I/O, device registers occupy addresses in the memory address space, so ordinary load and store instructions can read status or write commands. The address decides whether RAM or a device responds.",
      },
      {
        term: "15. Port-mapped I/O",
        explanation:
          "Some architectures provide a separate I/O address space (ports) accessed with dedicated instructions like IN and OUT. Others rely heavily on memory-mapped I/O — neither approach is universal.",
      },
      {
        term: "16. DMA — Direct Memory Access",
        explanation:
          "DMA lets a controller move data to or from memory with less CPU involvement during the transfer. The CPU still configures and coordinates it, and systems vary — but for large blocks the CPU is freed from copying every word.",
      },
      {
        term: "17. DMA completion interrupts",
        explanation:
          "Because the CPU isn't watching the transfer, the DMA controller raises an interrupt when it finishes. DMA and interrupts work together: start the transfer, carry on with other work, then handle one completion interrupt.",
      },
      {
        term: "18. How operating systems manage I/O",
        explanation:
          "The operating system sits between programs and devices. Device drivers talk to controllers, ISRs handle events quickly, and the OS wakes the process that was waiting for the data — so programs don't each need to manage hardware, and the system stays responsive.",
        formula: "\\text{Device event} \\rightarrow \\text{Controller} \\rightarrow \\text{Interrupt} \\rightarrow \\text{ISR} \\rightarrow \\text{Return}",
        formulaCaption: "The path a device event follows in this topic",
      },
    ],
    whyItMatters:
      "Every keystroke, mouse movement, network packet, and disk read depends on the mechanisms in this topic. Interrupts are why a computer can keep running your programs while waiting on slow devices, yet still respond immediately when you press a key. Understanding them explains why systems feel responsive, why drivers and timers matter to an operating system, and it is the foundation for how operating systems schedule processes and manage devices.",
    keyTerms: [
      { term: "I/O", definition: "Communication between a computer system and its devices." },
      { term: "Device controller", definition: "Hardware with a status, data buffer, and control information through which software communicates with a device." },
      { term: "Polling", definition: "The CPU repeatedly checks a device's status to see if it needs attention." },
      { term: "Interrupt", definition: "A mechanism through which a device or event requests the CPU's attention." },
      { term: "ISR", definition: "Interrupt Service Routine — the code executed to handle an interrupt." },
      { term: "Interrupt vector", definition: "A mechanism (often a table entry) for locating the appropriate interrupt handler." },
      { term: "Interrupt masking", definition: "Deferring certain interrupts so they are not serviced until they become eligible." },
      { term: "NMI", definition: "A category of interrupt designed to bypass ordinary interrupt masking; exact behavior depends on the architecture." },
      { term: "Memory-mapped I/O", definition: "Device registers occupy addresses in the memory address space." },
      { term: "Port-mapped I/O", definition: "Some architectures provide a separate I/O address space for device ports." },
      { term: "DMA", definition: "Lets a controller transfer data to or from memory with less CPU involvement during the transfer." },
    ],
    visualAids: [{ id: "journey-sketch", caption: "The path of one device event through the system.", visual: journeySketch }],
    misconceptions: [
      {
        id: "misconception-polling-always-bad",
        misconception: "Polling is always a bad idea and interrupts are always better.",
        correction:
          "Polling wastes CPU time when the device is usually not ready, but it can be simple, predictable, and efficient when a device is almost always ready or is checked infrequently. Interrupts have their own overhead (saving and restoring state), so neither method is universally superior.",
      },
      {
        id: "misconception-interrupt-loses-work",
        misconception: "An interrupt makes the interrupted program lose its place or its data.",
        correction:
          "The CPU saves the program's state before running the ISR and restores it afterward, so the program continues exactly where it left off — the ISR may even overwrite the registers in the meantime.",
      },
      {
        id: "misconception-dma-no-cpu",
        misconception: "With DMA, the CPU is not involved at all.",
        correction:
          "The CPU still sets up the transfer and handles the completion interrupt. DMA reduces CPU involvement during the transfer itself — it doesn't remove the CPU from the picture.",
      },
      {
        id: "misconception-masked-lost",
        misconception: "A masked interrupt is thrown away.",
        correction: "In the model used here, masking defers an interrupt — it stays pending until it becomes eligible. (Exact behavior depends on the architecture.)",
      },
    ],
  },

  predict: {
    intro: "Commit to a prediction about how the system will behave, then test it in the laboratory.",
    scenarios: [
      {
        id: "it-io-predict-001",
        scenario: "The CPU is running a program while a keyboard key is pressed. Interrupt-driven I/O is in use.",
        question: "What does the CPU do first when the interrupt request reaches it?",
        options: [
          { id: "save", label: "Saves its current state, then runs the ISR" },
          { id: "discard", label: "Discards the running program" },
          { id: "ignore", label: "Ignores it until the program finishes" },
        ],
        actualResultOptionId: "save",
        explanation: "The CPU saves where it was (PC, registers, flags), identifies the interrupt, and runs the ISR; afterwards it restores the saved state.",
        hint: "What must the CPU remember so it can come back to the program?",
      },
      {
        id: "it-io-predict-002",
        scenario: "The Timer, Network, and Keyboard interrupts all become pending together. The priority order is Timer > Network > Keyboard.",
        question: "Which interrupt is handled first?",
        options: [
          { id: "timer", label: "Timer" },
          { id: "keyboard", label: "Keyboard" },
          { id: "network", label: "Network" },
        ],
        actualResultOptionId: "timer",
        explanation: "In the priority model, the highest-priority pending interrupt is serviced first, regardless of arrival order.",
        hint: "Who is at the top of the priority list?",
      },
      {
        id: "it-io-predict-003",
        scenario: "A CPU polls a device on every tick, and the device becomes ready after 10 ticks.",
        question: "How much useful main-program work does the CPU do in the first 9 ticks?",
        options: [
          { id: "none", label: "None — every tick is a status check" },
          { id: "most", label: "Most of them" },
          { id: "half", label: "About half" },
        ],
        actualResultOptionId: "none",
        explanation: "Polling every tick (busy-waiting) means every tick before the device is ready is spent checking.",
        hint: "What is the CPU doing on each tick when it polls continuously?",
      },
      {
        id: "it-io-predict-004",
        scenario: "The Mouse interrupt is masked, and the mouse moves while a Keyboard interrupt is pending too.",
        question: "What happens to the mouse interrupt?",
        options: [
          { id: "deferred", label: "It is deferred and waits" },
          { id: "first", label: "It is handled first" },
          { id: "lost", label: "It is permanently lost" },
        ],
        actualResultOptionId: "deferred",
        explanation: "Masking defers the interrupt; it stays pending until masking is lifted.",
        hint: "Masking means “not now”, not “never”.",
      },
      {
        id: "it-io-predict-005",
        scenario: "A 512-word block is moved from a device to memory once with polling and once with DMA.",
        question: "Which leaves the CPU more time for other work?",
        options: [
          { id: "dma", label: "DMA" },
          { id: "polling", label: "Polling" },
          { id: "same", label: "They are identical" },
        ],
        actualResultOptionId: "dma",
        explanation: "With DMA the controller moves the data, so the CPU is not busy copying each word; it only sets up the transfer and handles the completion interrupt.",
        hint: "Who copies each word in each method?",
      },
    ],
  },

  explore: {
    howToUse: [
      "Choose a level: Beginner, Intermediate, or Technical. Higher levels unlock more tabs and controls.",
      "I/O Basics: tap devices to see input vs output, then issue a READ DATA request and watch the controller change.",
      "Event Lab: press a device button to generate an event, and follow it through the diagram, journey strip, timeline, CPU state, queue, and log.",
      "Polling vs Interrupts: run the same device-ready time both ways and compare the numbers.",
      "Vectors & Addressing and DMA Lab: trace an interrupt number to its ISR, try memory- and port-mapped instructions (Technical), and compare CPU-driven transfers with DMA.",
      "Guided Experiments: open any of six pre-configured experiments, then check what you observed.",
    ],
    tryThis: [
      "In the Event Lab, pause, then generate a Keyboard event and use Step to see each phase one tick at a time.",
      "Press “Burst: 4 events at once”, then reorder the priorities and burst again — what changes?",
      "Watch R1 and R2 while an ISR runs. Why does the main program still get its old values back?",
      "In the DMA Lab, set the transfer size to 1 word. Is DMA still worth it?",
    ],
  },

  explain: {
    questions: [
      {
        id: "it-io-explain-001",
        question: "Why does the CPU need to save its state before running an ISR?",
        answer:
          "The ISR uses the same registers and flags the interrupted program was using. Saving the program counter, registers, and flags lets the CPU restore them afterwards, so the interrupted program continues exactly where it left off.",
      },
      {
        id: "it-io-explain-002",
        question: "Why can interrupts make a system feel responsive?",
        answer:
          "The CPU can spend its time on useful work and respond only when a device actually needs attention, instead of repeatedly asking devices whether they are ready.",
      },
      {
        id: "it-io-explain-003",
        question: "If polling wastes CPU time, why is it still used at all?",
        answer:
          "Polling is simple and predictable. When a device is almost always ready, or checks happen infrequently, the cost is low — and interrupts have their own overhead for entering and leaving the ISR.",
      },
      {
        id: "it-io-explain-004",
        question: "Why does a system need interrupt priority?",
        answer:
          "Several interrupts can be pending at once. Priority decides which is serviced first, so time-critical events (like a timer needed for scheduling) aren't stuck behind less urgent ones. This lab's model is simplified; real mechanisms vary.",
      },
      {
        id: "it-io-explain-005",
        question: "Why is a non-maskable interrupt useful?",
        answer:
          "Some conditions are too important to ignore. An NMI is designed to bypass ordinary interrupt masking so those critical events still reach the CPU. Exact behavior depends on the architecture.",
      },
      {
        id: "it-io-explain-006",
        question: "Why does DMA help with large transfers, and why does it still need an interrupt?",
        answer:
          "Without DMA, the CPU copies each word. With DMA the controller moves the data while the CPU continues other work. Since the CPU isn't watching, the DMA controller raises a completion interrupt to tell it the transfer is done.",
      },
    ],
  },

  practice: {
    // Foreign key into the quiz-engine registry — all questions live in
    // @/features/quiz-engine/data/it-io-interrupts-explorer-practice-quiz.ts.
    quizId: "it-io-interrupts-explorer-practice",
  },

  challenge: {
    intro: "Progressively harder problems. Reason each one out first — the laboratory is there to check your answer, not to supply it.",
    scenarios: [
      {
        id: "it-io-challenge-001",
        title: "Sort the Devices",
        scenario: "A student lists five data flows: Keyboard → CPU, Mouse → CPU, CPU → Display, CPU → Printer, and Disk → Memory.",
        objective: "Identify which set contains only output flows.",
        requiresExperiment: true,
        tools: [{ id: "basics-tab", label: "I/O Basics tab" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "CPU → Display and CPU → Printer" },
            { id: "b", label: "Keyboard → CPU and Mouse → CPU" },
            { id: "c", label: "Disk → Memory and CPU → Display" },
          ],
          correctOptionId: "a",
        },
        explanation: "Output sends data from the computer to a device: the display and the printer. Keyboard, mouse, and disk-read flows bring data in.",
        hints: ["Output means Computer → Device.", "Which flows end at a device?"],
      },
      {
        id: "it-io-challenge-002",
        title: "Polling or Interrupts?",
        scenario: "A log shows: CPU: “Are you ready?” Device: “No.” CPU: “Are you ready?” Device: “No.” CPU: “Are you ready?” Device: “Yes.”",
        objective: "Name the I/O method being demonstrated and one drawback.",
        requiresExperiment: true,
        tools: [{ id: "polling-tab", label: "Polling vs Interrupts tab" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Polling — the repeated “no” answers are CPU time spent checking" },
            { id: "b", label: "Interrupt-driven I/O — the device raised an interrupt each time" },
            { id: "c", label: "DMA — the controller moves the data" },
          ],
          correctOptionId: "a",
        },
        explanation: "The CPU itself repeatedly asks the device about its status — that is polling. Each “No” is a check that did no useful work.",
        hints: ["Who initiates each exchange — the CPU or the device?"],
      },
      {
        id: "it-io-challenge-003",
        title: "Trace the Interrupt",
        scenario: "A key is pressed while the CPU runs a program with interrupt-driven I/O.",
        objective: "Choose the correct order of events.",
        requiresExperiment: true,
        tools: [{ id: "event-lab", label: "Event Lab" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Device event → controller → interrupt request → save state → identify → run ISR → restore → return" },
            { id: "b", label: "Run ISR → save state → device event → interrupt request → return" },
            { id: "c", label: "Interrupt request → run ISR → device event → restore state" },
          ],
          correctOptionId: "a",
        },
        explanation: "The event must reach the CPU as an interrupt request first; the CPU saves its state, identifies the interrupt, runs the ISR, then restores state and returns.",
        hints: ["What must exist before an ISR can run?", "State has to be saved before it can be overwritten."],
      },
      {
        id: "it-io-challenge-004",
        title: "Who Goes First?",
        scenario: "Priority order (high → low): Timer, Network, Storage, Keyboard. Keyboard, Storage, and Timer interrupts become pending at the same moment.",
        objective: "Give the order in which they are handled (priority model, no nesting).",
        requiresExperiment: true,
        tools: [{ id: "event-lab", label: "Event Lab (Intermediate)" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Timer, Storage, Keyboard" },
            { id: "b", label: "Keyboard, Storage, Timer" },
            { id: "c", label: "Storage, Timer, Keyboard" },
          ],
          correctOptionId: "a",
        },
        explanation: "Priority decides the order: Timer first, then Storage, then Keyboard — even though the keyboard was first to be pressed.",
        hints: ["Sort by the priority list, not by arrival."],
      },
      {
        id: "it-io-challenge-005",
        title: "What Gets Deferred?",
        scenario: "Masking is ON with Mouse and Printer masked. A Keyboard, a Mouse, and a Printer interrupt are pending.",
        objective: "Which interrupts are deferred?",
        requiresExperiment: true,
        tools: [{ id: "masking", label: "Masking controls (Technical)" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Mouse and Printer" },
            { id: "b", label: "Keyboard only" },
            { id: "c", label: "All three" },
          ],
          correctOptionId: "a",
        },
        explanation: "Only the masked devices are deferred; the keyboard is eligible and is handled. The deferred ones wait until masking is turned off.",
        hints: ["Which devices were selected to be masked?"],
      },
      {
        id: "it-io-challenge-006",
        title: "Follow the Vector",
        scenario: "In this lab's simulated table, vector 5 → 0x8500 (Printer ISR), vector 3 → 0x8300 (Network ISR).",
        objective: "An interrupt arrives with number 3. Where does the CPU jump?",
        requiresExperiment: true,
        tools: [{ id: "vector", label: "Vectors & Addressing tab" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "0x8300 — the Network ISR" },
            { id: "b", label: "0x8500 — the Printer ISR" },
            { id: "c", label: "Address 3 in RAM" },
          ],
          correctOptionId: "a",
        },
        explanation: "The interrupt number selects vector entry 3, which holds the ISR address 0x8300. (Real vector tables differ by architecture.)",
        hints: ["Interrupt number → vector entry → ISR address."],
      },
      {
        id: "it-io-challenge-007",
        title: "CPU-Driven or DMA?",
        scenario: "A system must (A) read a single status byte from a device once, and (B) copy a large 512-word block from a disk to memory.",
        objective: "Choose the best fit for each and the tradeoff.",
        requiresExperiment: true,
        tools: [{ id: "dma-lab", label: "DMA Lab" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "A: CPU-driven — DMA's setup cost isn't worth it. B: DMA — the CPU isn't copying every word." },
            { id: "b", label: "A: DMA. B: CPU-driven." },
            { id: "c", label: "DMA for both — it is always faster." },
          ],
          correctOptionId: "a",
        },
        explanation: "DMA has fixed setup and completion costs, so it pays off for large blocks. For a tiny transfer, simple CPU-driven I/O is cheaper. No method is universally best.",
        hints: ["Compare the 1-word and 512-word cases in the DMA Lab."],
      },
      {
        id: "it-io-challenge-008",
        title: "Complete the DMA Sequence",
        scenario: "A DMA transfer sequence: CPU starts the transfer → Device ↔ Memory → transfer completes → ??? → CPU handles completion.",
        objective: "What goes in the missing step?",
        requiresExperiment: true,
        tools: [{ id: "dma-completion", label: "DMA completion sequence (Technical)" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "The DMA controller generates an interrupt" },
            { id: "b", label: "The CPU polls every word" },
            { id: "c", label: "The device restarts the transfer" },
          ],
          correctOptionId: "a",
        },
        explanation: "The CPU isn't watching the transfer, so the DMA controller raises a completion interrupt to notify it.",
        hints: ["How does the CPU learn about completion without polling?"],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "information-technology",
      topicSlug: "cpu-architecture-instruction-cycle",
      label: "CPU Architecture & Instruction Cycle",
      href: "/dashboard/information-technology/cpu-architecture-instruction-cycle",
      reason: "The saved and restored CPU state here — PC, IR, registers, flags — is the same state that topic shows changing as each instruction executes.",
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "computer-boot-process",
      label: "Computer Boot Process",
      href: "/dashboard/information-technology/computer-boot-process",
      reason: "Startup ends with the operating system taking over the machine — including the drivers and interrupt handling explored here.",
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "cpu-scheduling-simulator",
      label: "CPU Scheduling",
      href: "/dashboard/information-technology/cpu-scheduling-simulator",
      reason: "The timer interrupt is how an operating system gets control back to decide which process runs next.",
    },
  ],
};
