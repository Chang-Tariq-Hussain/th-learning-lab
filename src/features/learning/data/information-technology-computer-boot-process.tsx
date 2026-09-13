import type { TopicContent } from "../types";

/**
 * Computer Boot Process — fourth and final stop of Batch 2 in the
 * Information Technology > Computer Fundamentals sequence (see
 * `@/features/learning-path/data/information-technology-computer-fundamentals`).
 * Flows through the same generic `TopicExperience` every other topic
 * uses, with `ComputerBootProcess` (a 2.5D SVG cross-section, not a
 * full 3D scene — see that component's own comments for why) supplied
 * as the Explore simulation.
 */

const sequenceSketch = (
  <svg viewBox="0 0 260 60" className="mx-auto h-16 w-full max-w-md" role="img" aria-labelledby="boot-sequence-sketch-title">
    <title id="boot-sequence-sketch-title">Power On leads to Firmware, then POST, then Hardware Init, then Boot Device, then Bootloader, then OS Loading, then Kernel, then Login/Desktop.</title>
    {["Power", "Firmware", "POST", "HW Init", "Boot Dev", "Loader", "OS Load", "Kernel", "Desktop"].map((label, i) => (
      <g key={label}>
        <circle cx={16 + i * 30} cy={26} r={9} className="fill-none stroke-subject-it" strokeWidth="2" />
        <text x={16 + i * 30} y={48} textAnchor="middle" className="fill-ink-soft font-mono text-[7px] dark:fill-bone-soft">
          {label}
        </text>
        {i < 8 && <line x1={25 + i * 30} y1={26} x2={7 + (i + 1) * 30} y2={26} strokeWidth="1.5" className="stroke-ink/30 dark:stroke-bone/30" />}
      </g>
    ))}
  </svg>
);

export const informationTechnologyComputerBootProcessContent: TopicContent = {
  subjectSlug: "information-technology",
  topicSlug: "computer-boot-process",
  title: "Computer Boot Process",
  subjectLabel: "Information Technology",
  topicLabel: "Computer Fundamentals",
  colorToken: "it",
  simulationHref: "/dashboard/information-technology/computer-boot-process",

  // -------------------------------------------------------------
  // LEARN — what am I learning?
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "List, in order, the conceptual stages a computer moves through from pressing the power button to reaching the desktop.",
      "Explain what happens and why at each stage — firmware, POST, hardware initialization, boot device selection, the bootloader, OS loading, and the kernel.",
      "Distinguish the role of firmware (BIOS/UEFI) from the role of the operating system itself.",
      "Recognize that this sequence is a representative model, and that real systems vary in their exact implementation.",
    ],
    concepts: [
      {
        term: "Firmware runs before any operating system exists",
        explanation:
          "The motherboard's firmware (BIOS, or the modern UEFI standard) is permanently stored on a chip on the motherboard itself. It's the very first software that runs — there's no operating system yet for anything else to run instead.",
      },
      {
        term: "POST checks that essential hardware is working",
        explanation:
          "Before going any further, the firmware runs a Power-On Self-Test, confirming the CPU, memory, and other essential hardware are present and responding. This catches serious hardware problems early, often with a beep code or on-screen error.",
      },
      {
        term: "The bootloader bridges firmware to the operating system",
        explanation:
          "Firmware only knows how to run a very small first program stored on a device — it doesn't know how to load a whole operating system. The bootloader (like GRUB or Windows Boot Manager) is a small, dedicated program whose only job is finding and loading the OS.",
      },
      {
        term: "The kernel takes over once the OS is loaded",
        explanation:
          "Once the operating system's files are copied into RAM, its kernel — the OS's core — starts managing hardware directly and launches the background services everything else depends on, leading up to a usable login screen or desktop.",
        formula: "\\text{Power} \\rightarrow \\text{Firmware} \\rightarrow \\text{POST} \\rightarrow \\ldots \\rightarrow \\text{Kernel} \\rightarrow \\text{Desktop}",
        formulaCaption: "The conceptual sequence this topic teaches, from power button to usable desktop",
      },
    ],
    whyItMatters:
      "Every time you turn on any computer, phone, or game console, some version of this sequence runs before you can do anything with it. Understanding it demystifies things people run into all the time — why a \"no bootable device\" message means something specific, why entering BIOS/UEFI settings happens before Windows or macOS ever starts, and why a fast-loading SSD makes a computer feel noticeably snappier to start up. It's also the foundation for understanding what actually goes wrong when a computer \"won't turn on.\"",
    keyTerms: [
      { term: "Firmware", definition: "Software permanently stored on the motherboard (BIOS or UEFI) that runs first, before any operating system." },
      { term: "POST", definition: "Power-On Self-Test — the firmware's quick check that essential hardware is present and working." },
      { term: "Bootloader", definition: "A small program that locates and loads the operating system, bridging firmware to the OS." },
      { term: "Kernel", definition: "The operating system's core, which manages hardware and starts core services once loaded." },
      { term: "POST beep/error code", definition: "A signal (audible or on-screen) the firmware uses to report a hardware problem found during POST." },
    ],
    visualAids: [
      {
        id: "sequence-sketch",
        caption: "The nine-stage conceptual sequence from Power On to Login/Desktop.",
        visual: sequenceSketch,
      },
    ],
    misconceptions: [
      {
        id: "misconception-os-runs-first",
        misconception: "The operating system is the very first thing that runs when you press the power button.",
        correction:
          "Firmware runs first, and several stages — POST, hardware initialization, boot device selection, and the bootloader — all happen before the operating system itself is even loaded into RAM.",
      },
      {
        id: "misconception-one-universal-boot-sequence",
        misconception: "Every computer, regardless of brand or operating system, boots in exactly the same way.",
        correction:
          "The overall idea holds broadly, but real systems vary: UEFI and older BIOS systems behave differently, some computers use a fast-boot path that skips parts of POST, and different operating systems use different bootloaders and init systems.",
      },
      {
        id: "misconception-bios-and-os-are-same-thing",
        misconception: "BIOS/UEFI and the operating system (like Windows or macOS) are just two names for the same software.",
        correction:
          "They're entirely different pieces of software with different jobs. Firmware (BIOS/UEFI) is permanently stored on the motherboard and only handles the earliest startup stages; the operating system is a much larger, separate piece of software loaded from storage that the firmware and bootloader hand off to.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT — what should I predict?
  // -------------------------------------------------------------
  predict: {
    intro:
      "Before checking your answer in the simulation below, predict what happens at each stage of booting — you'll only be able to verify it after locking in an answer.",
    scenarios: [
      {
        id: "it-boot-predict-001",
        scenario: "A computer has just been plugged in and the power button was just pressed.",
        question: "What is the very first software to run, before anything else?",
        options: [
          { id: "firmware", label: "The motherboard's firmware (BIOS/UEFI)" },
          { id: "os", label: "The operating system" },
          { id: "bootloader", label: "The bootloader" },
        ],
        actualResultOptionId: "firmware",
        explanation:
          "Firmware is permanently stored on the motherboard and is the very first thing that runs — no operating system exists yet for anything else to run instead.",
        hint: "Which piece of software doesn't need to be loaded from a storage device to start running?",
      },
      {
        id: "it-boot-predict-002",
        scenario: "During startup, the firmware detects that a critical memory module isn't responding.",
        question: "At which stage would this problem most likely be caught and reported?",
        options: [
          { id: "post", label: "POST (Power-On Self-Test)" },
          { id: "login", label: "Login/Desktop" },
          { id: "kernel", label: "Kernel initialization" },
        ],
        actualResultOptionId: "post",
        explanation:
          "POST is specifically the stage where the firmware checks that essential hardware, including memory, is present and responding — exactly the kind of problem it's designed to catch.",
        hint: "Which stage's whole job is checking hardware before continuing further?",
      },
      {
        id: "it-boot-predict-003",
        scenario: "The bootloader has just finished locating the operating system's files on the storage device.",
        question: "What is the very next thing that happens?",
        options: [
          { id: "os-loading", label: "The OS files are loaded into RAM" },
          { id: "post", label: "POST runs again" },
          { id: "power-on", label: "The computer restarts from Power On" },
        ],
        actualResultOptionId: "os-loading",
        explanation:
          "Once the bootloader has found the OS, the next stage is copying those files into RAM so the CPU can actually run them — the Operating System Loading stage.",
        hint: "What does any program need to happen before the CPU can run it, once it's been found on storage?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE — the guided experiment
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Pick a mode: Step Through Boot, Identify the Stage, What Comes Next?, or Boot Problems.",
      "In Step Through Boot, press Start to boot automatically, or use Step to advance one stage at a time.",
      "Use Pause and Reset to stop the animation or start over from Power On.",
      "Click any stage on the timeline at any point to inspect what happens there, why, and what's involved.",
      "Watch the diagram below the timeline — it highlights which part of the computer is active at each stage.",
    ],
    tryThis: [
      "Step through the whole sequence once slowly, reading every stage's explanation before moving on.",
      "In Identify the Stage, try to answer before reading all four choices — just from the description alone.",
      "In Boot Problems, before checking, say out loud which single stage you think each symptom points to and why.",
      "Compare the Firmware, POST, Hardware Initialization, and Boot Device Selection stages — notice they're all run by the same firmware, just doing different jobs in sequence.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN — why does this happen?
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "it-boot-explain-001",
        question: "Why does the firmware run POST before doing anything else with the hardware?",
        answer:
          "Trying to load an operating system onto hardware that's missing or broken would fail in confusing, hard-to-diagnose ways. POST catches serious problems early and reports them clearly — often through beep codes or on-screen error codes — before the system attempts anything further.",
      },
      {
        id: "it-boot-explain-002",
        question: "Why is a separate bootloader needed, instead of firmware loading the operating system directly?",
        answer:
          "Firmware is built to run only a very small first program stored on a device — it has no built-in understanding of a full, complex operating system's file structure. The bootloader exists specifically to bridge that gap: firmware hands off to it, and it knows how to find and load the actual OS.",
      },
      {
        id: "it-boot-explain-003",
        question: "Why does the operating system need to be copied into RAM before it can actually run?",
        answer:
          "Like any program, the CPU can only execute the operating system from fast working memory (RAM), not directly from slower storage. This is the same storage-to-RAM relationship covered in the CPU–RAM–Storage Data Flow topic, applied to the OS itself.",
      },
      {
        id: "it-boot-explain-004",
        question: "Why doesn't every computer follow exactly the same boot sequence?",
        answer:
          "Different computers use different firmware standards (BIOS vs. UEFI), different bootloaders, and different operating systems with different init systems — and some use a fast-boot path that skips parts of POST for speed. The overall shape of the sequence (power, firmware, hardware checks, bootloader, OS, kernel) holds broadly, but the exact implementation isn't identical everywhere.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE — can I solve a problem using this?
  // -------------------------------------------------------------
  practice: {
    // Foreign key into the quiz-engine registry — all questions live in
    // @/features/quiz-engine/data/it-computer-boot-process-quiz.ts, none duplicated here.
    quizId: "it-computer-boot-process",
  },

  // -------------------------------------------------------------
  // CHALLENGE — realistic problems, some folding in the real-world mission
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice. Some are worked out from reasoning alone; others ask you to use the simulation above to check your answer. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "it-boot-challenge-001",
        title: "The Silent Screen",
        scenario:
          "A computer powers on — fans spin, lights come on — but the screen stays completely black and the computer produces a repeating pattern of beeps.",
        objective: "Determine which stage is most likely signaling a problem, based on the beep pattern.",
        requiresExperiment: true,
        tools: [{ id: "boot-problems-mode", label: "Boot Problems mode" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "POST — beep codes are how the firmware reports a hardware self-test failure" },
            { id: "b", label: "Login/Desktop — the beeps mean a login error" },
            { id: "c", label: "Kernel initialization — the OS kernel is producing the beeps" },
          ],
          correctOptionId: "a",
        },
        explanation:
          "Beep codes right after power-on, with no display output, are the classic sign of a POST failure — the firmware detected an essential hardware problem before it could get far enough to produce any video output.",
        hints: [
          "Which stage exists specifically to check hardware before continuing?",
          "Beep codes are used precisely because the screen might not be working yet at this point — what does that tell you about how early this stage runs?",
        ],
      },
      {
        id: "it-boot-challenge-002",
        title: "Sequence Repair",
        scenario:
          "A classmate wrote down the boot sequence in the wrong order: \"Bootloader, Firmware, POST, Operating System Loading, Boot Device Selection, Kernel.\"",
        objective: "Determine which two stages in that list are swapped relative to the correct order.",
        requiresExperiment: true,
        tools: [{ id: "step-through-mode", label: "Step Through Boot mode" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Bootloader and Firmware are swapped, and Operating System Loading and Boot Device Selection are swapped" },
            { id: "b", label: "The list is already in the correct order" },
            { id: "c", label: "Only Firmware and POST are swapped" },
          ],
          correctOptionId: "a",
        },
        explanation:
          "The correct order is Firmware, POST, Boot Device Selection, Bootloader, Operating System Loading, Kernel — the classmate's list has Bootloader appearing before Firmware (should be near the end of that group, not the start) and Operating System Loading appearing before Boot Device Selection (should come after both Boot Device Selection and Bootloader).",
        hints: [
          "Use Step Through Boot to walk the real order and compare it stage by stage against the classmate's list.",
          "Firmware has to run before anything it hands off to — check which items come before their own prerequisites in the classmate's list.",
        ],
      },
      {
        id: "it-boot-challenge-003",
        title: "Diagnose the Symptom",
        scenario:
          "A computer's firmware logo appears normally, but then the screen shows: \"No bootable device found.\"",
        objective: "Identify which stage this symptom points to, and briefly explain why.",
        requiresExperiment: true,
        tools: [{ id: "boot-problems-mode", label: "Boot Problems mode" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Boot Device Selection — the firmware couldn't find any device with a valid bootloader" },
            { id: "b", label: "Power On — the power supply is failing" },
            { id: "c", label: "Login/Desktop — the user's account is missing" },
          ],
          correctOptionId: "a",
        },
        explanation:
          "This exact message means the firmware successfully ran earlier stages (it got far enough to show its logo and search for a boot device) but couldn't find any connected device containing a valid bootloader — precisely the Boot Device Selection stage's job.",
        hints: [
          "The firmware logo appearing means several earlier stages already succeeded — which stage comes right after those?",
          "What is Boot Device Selection specifically looking for?",
        ],
      },
      {
        id: "it-boot-challenge-004",
        title: "Real-World Mission: Explain the Speed-Up",
        scenario:
          "A friend upgrades their old hard drive to a new SSD (solid-state drive) and notices their computer now reaches the desktop noticeably faster after pressing the power button.",
        objective: "Use what this topic teaches about the boot sequence to explain which stage benefits most directly from a faster storage device.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Operating System Loading — reading the OS's files from storage into RAM happens faster with faster storage" },
            { id: "b", label: "Power On — faster storage makes electricity reach the motherboard faster" },
            { id: "c", label: "POST — faster storage makes the hardware self-test skip steps" },
            { id: "d", label: "Storage speed has no effect on any boot stage" },
          ],
          correctOptionId: "a",
        },
        explanation:
          "Operating System Loading is the stage where the OS's files are actually read from the storage device into RAM — a faster storage device (like an SSD) directly speeds up exactly that step, which is typically one of the most time-consuming parts of the whole boot sequence.",
        hints: [
          "Which stage in this topic's sequence specifically involves reading data off the storage device?",
          "The earlier stages (power, firmware, POST) don't depend on storage speed at all — why not?",
        ],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "information-technology",
      topicSlug: "cpu-ram-storage-data-flow",
      label: "CPU–RAM–Storage Data Flow",
      href: "/dashboard/information-technology/cpu-ram-storage-data-flow",
      reason: "The Operating System Loading stage here is the same storage-to-RAM-to-CPU relationship that topic covers in depth, applied to booting the OS itself.",
    },
  ],
};
