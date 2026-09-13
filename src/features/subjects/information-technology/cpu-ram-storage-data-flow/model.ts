/**
 * Conceptual data model for the CPU–RAM–Storage Data Flow simulation.
 *
 * This is deliberately NOT a physics-style continuous simulation —
 * there's no numeric state to tweak, only a small number of discrete
 * conceptual "steps" per scenario, each describing one piece of
 * data/instruction moving between two components. That's why this
 * simulation doesn't use the shared `@/features/simulation` canvas
 * engine (built for continuous, parameter-driven physics/chemistry
 * models) — it's closer in shape to Chemistry's level-based Reaction
 * Kinetics simulation, just with a single flat step sequence instead
 * of numbered levels.
 *
 * IMPORTANT: every animated "packet" moving along the diagram
 * represents conceptual data or instructions, not a physical object
 * literally traveling through the machine — the UI says this
 * explicitly (see `DATA_FLOW_DISCLAIMER` in the component) per the
 * brief's requirement not to be "misleadingly literal."
 */

export type NodeId = "input" | "cpu" | "ram" | "storage" | "output";

export interface DataFlowNode {
  id: NodeId;
  label: string;
  /** Always-available explanation shown when the node itself is clicked. */
  description: string;
}

export const NODES: Record<NodeId, DataFlowNode> = {
  input: {
    id: "input",
    label: "Input",
    description:
      "Whatever tells the computer to do something — a click, a keystroke, a tap. Input is the starting signal for almost everything that follows in these scenarios.",
  },
  cpu: {
    id: "cpu",
    label: "CPU",
    description:
      "The processor. It fetches instructions and data from RAM, executes them (calculations, comparisons, decisions), and sends results back to RAM — over and over, extremely fast.",
  },
  ram: {
    id: "ram",
    label: "RAM",
    description:
      "Temporary working memory. RAM holds whatever the CPU is actively using right now — program code and data — so the CPU doesn't have to wait on slower storage for every single step. Everything in RAM is lost when the computer loses power.",
  },
  storage: {
    id: "storage",
    label: "Storage",
    description:
      "Long-term memory (an SSD or hard drive). Storage holds the operating system, applications, and files even when the computer is off — much slower than RAM to access, but permanent.",
  },
  output: {
    id: "output",
    label: "Output",
    description:
      "Whatever shows the result back to you — the screen redrawing, a file confirming it saved, a sound playing. Output is where a scenario's data flow becomes something you can actually see or hear.",
  },
};

/** Fixed layout, in a 760×300 viewBox, shared by every scenario's diagram. */
export const NODE_POSITIONS: Record<NodeId, { x: number; y: number; w: number; h: number }> = {
  input: { x: 300, y: 20, w: 160, h: 56 },
  storage: { x: 30, y: 172, w: 150, h: 76 },
  ram: { x: 218, y: 172, w: 150, h: 76 },
  cpu: { x: 406, y: 172, w: 150, h: 76 },
  output: { x: 594, y: 172, w: 150, h: 76 },
};

/** Every connector line the diagram draws (static background, regardless of scenario). */
export const CONNECTORS: { from: NodeId; to: NodeId }[] = [
  { from: "input", to: "cpu" },
  { from: "storage", to: "ram" },
  { from: "ram", to: "cpu" },
  { from: "cpu", to: "output" },
];

export interface DataFlowStep {
  id: string;
  from: NodeId;
  to: NodeId;
  /** Short label shown on the moving packet, e.g. "Application file". */
  packetLabel: string;
  /** What this step means, shown in the explanation panel. */
  explanation: string;
}

export interface DataFlowScenario {
  id: string;
  title: string;
  /** One-line framing shown above the diagram while this scenario is selected. */
  intro: string;
  steps: DataFlowStep[];
}

export const SCENARIOS: DataFlowScenario[] = [
  {
    id: "opening-application",
    title: "Opening an Application",
    intro: "Watch what happens, conceptually, the moment you double-click an app icon.",
    steps: [
      {
        id: "opening-application-1",
        from: "input",
        to: "cpu",
        packetLabel: "Open request",
        explanation:
          "Your double-click sends an instruction telling the CPU which application to start.",
      },
      {
        id: "opening-application-2",
        from: "storage",
        to: "ram",
        packetLabel: "Application file",
        explanation:
          "The app's code is copied from long-term storage into RAM, so it's ready for the CPU to use quickly. This copy is temporary — it disappears when the app closes.",
      },
      {
        id: "opening-application-3",
        from: "ram",
        to: "cpu",
        packetLabel: "Instructions",
        explanation: "The CPU reads the app's instructions and data out of RAM and begins executing them.",
      },
      {
        id: "opening-application-4",
        from: "cpu",
        to: "ram",
        packetLabel: "Results",
        explanation: "As the CPU computes, it writes intermediate results back into RAM.",
      },
      {
        id: "opening-application-5",
        from: "ram",
        to: "output",
        packetLabel: "Display data",
        explanation: "RAM hands the finished results to the screen, and the app appears, open and ready.",
      },
    ],
  },
  {
    id: "saving-file",
    title: "Saving a File",
    intro: "Watch what happens, conceptually, the moment you hit Save on a document you've been editing.",
    steps: [
      {
        id: "saving-file-1",
        from: "input",
        to: "ram",
        packetLabel: "Your edits",
        explanation:
          "While you type, your changes update the working copy of the document — which lives in RAM, not storage, while you're actively editing it.",
      },
      {
        id: "saving-file-2",
        from: "ram",
        to: "storage",
        packetLabel: "File data",
        explanation:
          "The moment you hit Save, RAM's working copy is written out to storage — this is the step that makes your changes survive after the computer is turned off.",
      },
      {
        id: "saving-file-3",
        from: "storage",
        to: "output",
        packetLabel: "Confirmation",
        explanation: "Storage confirms the write finished, and the app shows you a \"Saved\" message.",
      },
    ],
  },
  {
    id: "running-program",
    title: "Running a Program",
    intro: "Watch the repeating cycle a running program's instructions go through, conceptually, many times a second.",
    steps: [
      {
        id: "running-program-1",
        from: "storage",
        to: "ram",
        packetLabel: "Program code",
        explanation: "The program's instructions are loaded from storage into RAM before execution can begin.",
      },
      {
        id: "running-program-2",
        from: "ram",
        to: "cpu",
        packetLabel: "Next instruction",
        explanation: "The CPU fetches the next instruction, in order, from RAM and executes it.",
      },
      {
        id: "running-program-3",
        from: "cpu",
        to: "ram",
        packetLabel: "Updated data",
        explanation: "The result of that instruction is written back into RAM.",
      },
      {
        id: "running-program-4",
        from: "ram",
        to: "cpu",
        packetLabel: "Next instruction",
        explanation:
          "This fetch → execute → write-back cycle repeats — this is one more pass of a loop that, in a real computer, runs millions of times per second.",
      },
      {
        id: "running-program-5",
        from: "cpu",
        to: "output",
        packetLabel: "Final result",
        explanation: "Once the program's instructions finish running, the result is sent to the output for you to see.",
      },
    ],
  },
];
