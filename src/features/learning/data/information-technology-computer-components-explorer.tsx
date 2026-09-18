import type { TopicContent } from "../types";

/**
 * GLE content for the Computer Components & Hardware Explorer topic.
 * Reuses the existing pipeline/components unchanged — this file only
 * supplies data. `practice.quizId` points at the 15-question
 * practice bank; the 30-question full bank
 * (`it-computer-components-explorer`) is registered separately in
 * the quiz-engine and reachable via Practice Mode's subject browsing,
 * mirroring the Paging Simulator's practice/quiz split.
 */
export const informationTechnologyComputerComponentsExplorerContent: TopicContent = {
  subjectSlug: "information-technology",
  topicSlug: "computer-components-explorer",
  title: "Computer Components & Hardware Explorer",
  subjectLabel: "Information Technology",
  topicLabel: "Computer Components & Hardware Explorer",
  colorToken: "it",
  simulationHref: "/dashboard/information-technology/computer-components-explorer",

  learn: {
    objectives: [
      "Name the major physical components of a typical desktop computer and what each one does",
      "Explain how the CPU, RAM, GPU, storage, and motherboard connect to and depend on each other",
      "Distinguish RAM from storage, HDD from SSD, and CPU from GPU by purpose rather than just by name",
      "Reason about which component(s) are plausibly involved in a simple hardware symptom",
    ],
    whyItMatters:
      "Every other Information Technology topic — how data moves, how the machine boots, how the operating system manages resources — assumes you already know what the physical pieces are and how they fit together. This is that foundation.",
    concepts: [
      {
        term: "The motherboard connects everything",
        explanation: "Every other component plugs into the motherboard — directly into a socket or slot, or indirectly through a cable — which carries the electrical pathways that let them all communicate.",
      },
      {
        term: "CPU vs. RAM vs. storage",
        explanation: "The CPU executes instructions; RAM is fast, volatile working memory for what's running right now; storage is slower but persistent, holding everything whether it's running or not.",
      },
      {
        term: "The GPU handles parallel work",
        explanation: "A GPU is a processor built for highly parallel workloads like graphics rendering, connected through a PCIe expansion slot rather than sharing the CPU's socket.",
      },
      {
        term: "Form factor vs. protocol",
        explanation: "M.2 describes a drive's physical shape and connector; NVMe describes the protocol some M.2 (and other) drives use to communicate. They're related ideas, not interchangeable terms.",
      },
      {
        term: "Power flows from the PSU outward",
        explanation: "The PSU converts wall electricity into the voltages the system needs, feeding the motherboard, which distributes power to the CPU, RAM, storage, and any expansion devices.",
      },
      {
        term: "Categories, not a checklist",
        explanation: "Components fall into a handful of categories — Processing, Memory, Storage, Motherboard, Input/Output, and Power — but not every real computer contains every component in every category.",
      },
    ],
    keyTerms: [
      { term: "Motherboard", definition: "The main circuit board that every other component connects to, directly or through a cable." },
      { term: "CPU", definition: "The processor that executes instructions and performs calculations." },
      { term: "RAM", definition: "Volatile, high-speed working memory for currently running programs." },
      { term: "Storage", definition: "Persistent memory (SSD/HDD/M.2) that keeps data even with the power off." },
      { term: "GPU", definition: "A processor specialized for graphics and other highly parallel workloads." },
      { term: "PSU", definition: "The power supply unit — converts wall electricity into the voltages components need." },
      { term: "PCIe", definition: "A high-speed expansion interface, most often used today for a graphics card." },
      { term: "M.2 vs. NVMe", definition: "M.2 is a physical form factor; NVMe is a separate storage protocol many M.2 drives use. Related, not synonyms." },
    ],
    misconceptions: [
      {
        id: "ram-storage-same",
        misconception: "RAM and storage are basically the same thing, just different sizes.",
        correction: "They differ in purpose and persistence, not just capacity: RAM is volatile working memory for what's running right now; storage is persistent and keeps data with the power off.",
      },
      {
        id: "m2-is-nvme",
        misconception: "M.2 and NVMe mean the same thing.",
        correction: "M.2 is a physical form factor/connector; NVMe is a storage protocol a device can use. An M.2 drive isn't automatically NVMe, and NVMe isn't only found on M.2 drives.",
      },
      {
        id: "every-pc-identical",
        misconception: "Every computer contains every component shown in a diagram like this.",
        correction: "Real machines vary — a laptop, for instance, may have no dedicated GPU or no user-accessible SATA bay. This lab shows commonly-found components, not a required checklist.",
      },
      {
        id: "one-cause",
        misconception: "A hardware symptom like \"no display\" always has exactly one cause.",
        correction: "A symptom usually narrows things down to a few plausible areas to check, not a single guaranteed diagnosis.",
      },
    ],
  },

  predict: {
    intro: "Before exploring the 3D lab, commit to a prediction about how these components relate — then check yourself.",
    scenarios: [
      {
        id: "predict-ram-vs-storage-speed",
        scenario: "A program you just opened needs its data available to the CPU as fast as possible while it's running.",
        question: "Where does that data end up living while the program runs?",
        options: [
          { id: "ram", label: "Copied into RAM" },
          { id: "storage", label: "Read directly from storage each time" },
          { id: "gpu", label: "Copied into the GPU's VRAM" },
        ],
        actualResultOptionId: "ram",
        explanation: "RAM is far faster to access than storage, so the CPU works from a copy of the data that's been loaded into RAM, not directly from storage.",
        hint: "Which component's whole purpose is temporary, high-speed working memory?",
      },
      {
        id: "predict-gpu-path",
        scenario: "A dedicated graphics card is installed and rendering a game.",
        question: "Which interface carries data between the system and the GPU?",
        options: [
          { id: "pcie", label: "PCIe" },
          { id: "sata", label: "SATA" },
          { id: "usb", label: "USB" },
        ],
        actualResultOptionId: "pcie",
        explanation: "Dedicated GPUs connect through a PCIe expansion slot — a high-speed interface built for exactly this kind of throughput.",
        hint: "Think about which motherboard slot is used for expansion cards.",
      },
      {
        id: "predict-m2-nvme",
        scenario: "You see a drive advertised as \"M.2\" with no mention of NVMe anywhere.",
        question: "Can you assume it uses the NVMe protocol?",
        options: [
          { id: "no", label: "No — M.2 is a form factor; NVMe is a separate protocol" },
          { id: "yes", label: "Yes — M.2 always means NVMe" },
          { id: "unrelated", label: "No — M.2 and NVMe are unrelated" },
        ],
        actualResultOptionId: "no",
        explanation: "M.2 describes a drive's physical shape/connector, not its protocol. Some M.2 drives use NVMe over PCIe; others use SATA. They're related terms, not synonyms.",
        hint: "One of these terms describes a physical shape. The other describes a communication protocol.",
      },
      {
        id: "predict-no-power",
        scenario: "You press the power button and absolutely nothing happens — no fans, no lights.",
        question: "Which area is most worth checking first?",
        options: [
          { id: "psu", label: "The PSU and its connection to the wall/motherboard" },
          { id: "gpu", label: "The GPU's VRAM" },
          { id: "storage", label: "The storage device's file system" },
        ],
        actualResultOptionId: "psu",
        explanation: "No power at all points toward the power path first — the PSU itself or its connection — rather than components (like the GPU or storage) that only matter once the system is already powered.",
        hint: "Nothing turns on at all — which single component is responsible for turning everything on in the first place?",
      },
    ],
  },

  explore: {
    howToUse: [
      "Start in the 3D Hardware Lab: rotate, pan, and zoom the motherboard, or jump straight to an area with a camera preset.",
      "Click or tap any part to open its inspector panel, and switch the Learning Mode between Beginner, Intermediate, and Technical for more or less detail.",
      "Toggle the Layer control to add the Connections (trace lines) or Technical labels on top of the base view.",
      "Switch tabs to browse the full Component Library by category, trace Relationships between components, Compare RAM/Storage, HDD/SSD, and CPU/GPU, try Build-a-Computer, or work through Troubleshooting scenarios.",
    ],
    tryThis: [
      "Find the CPU, then use its inspector to list everything it's directly connected to.",
      "Use the Expansion Area camera preset and identify what's installed in the primary PCIe slot.",
      "In Relationships, compare the CPU's flow and the Storage flow — where do they end up meeting?",
      "In Build-a-Computer, deliberately pick a mismatched CPU and read the resulting message.",
      "In Troubleshooting, pick \"no display\" and reason about the likely areas before revealing them.",
    ],
  },

  explain: {
    questions: [
      {
        id: "why-ram-fast",
        question: "Why is RAM so much faster to access than storage?",
        answer: "RAM is built and connected specifically for very fast, direct access by the CPU, at the cost of losing its contents without power. Storage trades that speed for persistence — it keeps data indefinitely but takes much longer to read from and write to.",
      },
      {
        id: "why-cpu-needs-ram",
        question: "Why can't the CPU just work directly out of storage?",
        answer: "Storage's access speed is far too slow for the CPU to use it as working memory during execution. The system copies what's needed into RAM first, and the CPU works from that fast copy instead.",
      },
      {
        id: "why-gpu-separate",
        question: "Why does a computer need a separate GPU instead of just using the CPU for graphics?",
        answer: "Rendering graphics involves doing the same kind of calculation across huge numbers of pixels/vertices at once. GPUs are built with many simpler cores optimized for exactly that kind of parallel work, while CPUs favor fewer, more flexible cores suited to general-purpose logic.",
      },
      {
        id: "why-m2-nvme-different",
        question: "Why does it matter that M.2 and NVMe aren't the same thing?",
        answer: "Because a drive's physical form factor (M.2) and the protocol it speaks (NVMe or otherwise) are two independent choices. Assuming they're identical can lead to buying or expecting the wrong kind of drive for a given motherboard slot.",
      },
      {
        id: "why-no-single-cause",
        question: "Why doesn't a symptom like \"won't boot\" point to just one component?",
        answer: "Several different failures can produce the same visible symptom — a missing boot device, unseated RAM, and a firmware setting can all prevent booting in similar-looking ways. Troubleshooting narrows down plausible areas rather than jumping to a single diagnosis from one clue.",
      },
    ],
  },

  practice: {
    quizId: "it-computer-components-explorer-practice",
  },

  challenge: {
    intro: "Apply what you've learned to realistic, reasoning-based problems using the Hardware Lab.",
    scenarios: [
      {
        id: "challenge-identify-components",
        title: "Identify the Motherboard's Major Components",
        scenario: "You're handed an unlabeled motherboard photo (represented here by the 3D lab) and asked to identify its major parts before a build.",
        objective: "Use the 3D Hardware Lab to correctly identify at least 6 distinct components by inspecting them.",
        tools: [{ id: "camera-presets", label: "Camera presets (Full Board, CPU Area, Memory Area, Storage Area, Expansion Area, I/O Area, Power Area)" }],
        hints: [
          "Start with the Full Board preset to see the overall layout before zooming in.",
          "Use each camera preset in turn — each one is centered on a different component.",
        ],
        answer: { mode: "interactive", instructions: "Click at least 6 different components in the 3D Hardware Lab and open each one's inspector panel.", verifyLabel: "I've inspected 6+ components" },
        explanation: "A motherboard's major components — CPU, RAM, storage, chipset, PCIe/GPU, power delivery, and rear I/O — are each in a predictable general area, which is exactly what the camera presets are built around.",
        requiresExperiment: true,
      },
      {
        id: "challenge-match-function",
        title: "Match Component to Function",
        scenario: "A friend is building their first PC and keeps mixing up what each part actually does.",
        objective: "Correctly match \"executes instructions,\" \"temporary working memory,\" and \"persistent storage\" to the right components.",
        answer: {
          mode: "choice",
          options: [
            { id: "correct", label: "CPU executes instructions, RAM is temporary memory, storage is persistent" },
            { id: "swap-ram-storage", label: "RAM is persistent, storage is temporary memory" },
            { id: "cpu-is-memory", label: "The CPU is where programs are stored long-term" },
          ],
          correctOptionId: "correct",
        },
        explanation: "The CPU executes instructions; RAM is temporary/volatile working memory; storage is where data persists when the power is off. Mixing these up is one of the most common beginner misconceptions.",
        hints: ["Revisit the RAM vs. Storage comparison if you're unsure."],
      },
      {
        id: "challenge-connect-interfaces",
        title: "Connect Components with the Right Interface",
        scenario: "You're planning a build with an M.2 NVMe SSD, a SATA HDD, and a dedicated GPU.",
        objective: "Identify which motherboard interface each device needs.",
        answer: {
          mode: "choice",
          options: [
            { id: "correct", label: "M.2 slot for the SSD, SATA port + power cable for the HDD, PCIe slot for the GPU" },
            { id: "wrong-1", label: "All three connect through PCIe" },
            { id: "wrong-2", label: "The GPU connects through the M.2 slot" },
          ],
          correctOptionId: "correct",
        },
        explanation: "Each device type has a matching interface: M.2 slots for compact NVMe drives, SATA ports (plus a separate power cable) for SATA drives, and PCIe slots for the GPU.",
        hints: ["Open the Component Library's Storage and Motherboard categories."],
      },
      {
        id: "challenge-build-basic",
        title: "Build a Basic Working Computer",
        scenario: "Assemble a minimum viable build: everything genuinely required, nothing extra assumed.",
        objective: "Complete the Build-a-Computer lab with an all-compatible result using only required slots (GPU optional).",
        tools: [{ id: "build-slots", label: "Build-a-Computer slots: CPU, RAM, Storage, GPU (optional), PSU" }],
        answer: { mode: "interactive", instructions: "Fill every required slot in Build a Computer with a compatible option.", verifyLabel: "My build shows \"This build is compatible\"" },
        explanation: "A minimum working build needs a matching CPU, supported RAM, a storage device with an available interface, and a sufficiently powerful PSU — a dedicated GPU is optional if the CPU has integrated graphics.",
        requiresExperiment: true,
      },
      {
        id: "challenge-diagnose-no-boot",
        title: "Diagnose a Simulated \"Powers On, Won't Boot\" Problem",
        scenario: "A computer's fans spin and lights come on, but it never reaches the operating system.",
        objective: "Identify a plausible component involved, using the Troubleshooting lab.",
        answer: {
          mode: "choice",
          options: [
            { id: "correct", label: "The boot device, RAM seating, or firmware boot settings" },
            { id: "wrong-audio", label: "The rear audio ports" },
            { id: "wrong-gpu-vram", label: "The GPU's VRAM capacity" },
          ],
          correctOptionId: "correct",
        },
        explanation: "\"Powers on but won't boot\" specifically implicates the boot path — the boot device, RAM, or firmware settings — not unrelated components like audio ports or VRAM capacity.",
        hints: ["Open the Troubleshooting tab and select the matching symptom."],
      },
      {
        id: "challenge-ram-vs-storage",
        title: "Distinguish RAM from Persistent Storage",
        scenario: "A program crashes and the user loses unsaved work, but their previously saved files are all still there after restarting.",
        objective: "Explain why the unsaved work was lost but the saved files weren't.",
        answer: {
          mode: "choice",
          options: [
            { id: "correct", label: "Unsaved work only existed in volatile RAM; saved files were written to persistent storage" },
            { id: "wrong-1", label: "Both were in RAM, and RAM never loses data" },
            { id: "wrong-2", label: "Both were in storage, and storage sometimes fails randomly" },
          ],
          correctOptionId: "correct",
        },
        explanation: "Unsaved changes exist only in RAM until they're explicitly written (saved) to persistent storage. A crash before saving loses whatever hadn't been written yet, while anything already saved to storage survives.",
        hints: ["Think about what \"volatile\" means for RAM."],
      },
      {
        id: "challenge-storage-interface",
        title: "Identify Appropriate Storage Interfaces",
        scenario: "A motherboard has one free M.2 slot and two free SATA ports, and you need to install two SSDs.",
        objective: "Decide which interface each SSD should use, given only one M.2 slot is free.",
        answer: {
          mode: "choice",
          options: [
            { id: "correct", label: "One SSD in the M.2 slot; the other as a SATA SSD in a free SATA port" },
            { id: "wrong-1", label: "Both must use the M.2 slot simultaneously" },
            { id: "wrong-2", label: "Neither can be installed unless both are M.2" },
          ],
          correctOptionId: "correct",
        },
        explanation: "SSDs come in both M.2 and SATA form factors. With only one M.2 slot free, the second drive can still be installed as a SATA SSD using a free SATA port and a power cable.",
        hints: ["Recall that SSD refers to the storage technology (flash), not the interface it connects through."],
      },
      {
        id: "challenge-io-path",
        title: "Trace a Simple Input → Processing → Output Path",
        scenario: "You press a key on the keyboard and a character appears on the monitor.",
        objective: "Put the following in the correct order: Output (monitor), Input (keyboard), Processing (CPU).",
        answer: {
          mode: "choice",
          options: [
            { id: "correct", label: "Input → Processing → Output" },
            { id: "wrong-1", label: "Output → Input → Processing" },
            { id: "wrong-2", label: "Processing → Output → Input" },
          ],
          correctOptionId: "correct",
        },
        explanation: "Input devices (like a keyboard) send data in, the CPU processes it, and the result reaches an output device (like a monitor) — the same Input → Processing → Output path every I/O interaction follows.",
        hints: ["Which device physically starts the sequence — the one you touch, or the one you look at?"],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "information-technology",
      topicSlug: "cpu-ram-storage-data-flow",
      label: "CPU–RAM–Storage Data Flow",
      href: "/dashboard/information-technology/cpu-ram-storage-data-flow",
      reason: "See how information actually moves between these same components during execution.",
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "computer-boot-process",
      label: "Computer Boot Process",
      href: "/dashboard/information-technology/computer-boot-process",
      reason: "See what happens to this hardware, step by step, from power-on to a working desktop.",
    },
  ],
};
