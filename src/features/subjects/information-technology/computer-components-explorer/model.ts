/**
 * Conceptual data model for the "Virtual Computer Hardware
 * Laboratory" (Computer Components & Hardware Explorer).
 *
 * This topic answers "what are the physical parts of a computer, and
 * how do they relate?" — a different question from the existing
 * CPU–RAM–Storage Data Flow topic, which answers "how does data
 * actually move between them during execution?" Nothing here repeats
 * that topic's instruction-cycle/bus/cache model; it links out to it
 * instead (see `DATA_FLOW_LINK` / `BOOT_PROCESS_LINK` below). Every
 * value here is a simulated/illustrative example, not a claim about
 * any specific real machine — see `HARDWARE_DISCLAIMER`.
 */

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

export type ComponentId =
  | "motherboard"
  | "cpu"
  | "cpuCooler"
  | "ram"
  | "gpu"
  | "storageM2"
  | "storageSata"
  | "psu"
  | "chipset"
  | "pcie"
  | "vrm"
  | "rearIo";

export type ComponentCategory =
  | "Processing"
  | "Memory"
  | "Storage"
  | "Motherboard"
  | "Input / Output"
  | "Power";

export interface ComponentDef {
  id: ComponentId;
  label: string;
  category: ComponentCategory;
  whatItIs: string;
  mainRole: string;
  /** Other component ids this one is most directly connected to,
   *  used for the relationship diagram and the info panel's
   *  "Connected to" list. */
  connectedTo: ComponentId[];
  keyConcepts: string[];
  /** Shown only at "technical" detail level — properties, not real
   *  measurements of the student's own machine. */
  technicalExample?: { label: string; value: string }[];
}

export const COMPONENTS: Record<ComponentId, ComponentDef> = {
  motherboard: {
    id: "motherboard",
    label: "Motherboard",
    category: "Motherboard",
    whatItIs:
      "The main circuit board every other component plugs into, directly or through a cable. It carries the electrical pathways (traces) that let components talk to each other.",
    mainRole: "Physically and electrically connects every other component into one working system.",
    connectedTo: ["cpu", "ram", "gpu", "storageM2", "storageSata", "psu", "chipset", "pcie", "rearIo"],
    keyConcepts: ["Sockets and slots", "Traces (copper pathways)", "Form factor", "Expansion"],
  },
  cpu: {
    id: "cpu",
    label: "CPU (Processor)",
    category: "Processing",
    whatItIs: "The processor that executes instructions — often called the \"brain\" of the computer, though it works closely with several other components to get anything done.",
    mainRole: "Executes instructions and performs calculations for every running program.",
    connectedTo: ["ram", "motherboard", "chipset", "cpuCooler"],
    keyConcepts: ["Cores", "Threads", "Clock speed", "Cache", "Registers", "Control Unit", "ALU"],
    technicalExample: [
      { label: "Cores", value: "8 (example)" },
      { label: "Threads", value: "16 (example)" },
      { label: "Base clock", value: "3.6 GHz (example)" },
      { label: "Cache", value: "L1/L2/L3, example only" },
    ],
  },
  cpuCooler: {
    id: "cpuCooler",
    label: "CPU Cooler",
    category: "Processing",
    whatItIs: "A heatsink and fan (or liquid loop) mounted on the CPU that pulls heat away from it while it runs.",
    mainRole: "Keeps the CPU within a safe operating temperature so it doesn't slow itself down or shut off to avoid damage.",
    connectedTo: ["cpu"],
    keyConcepts: ["Heatsink", "Thermal paste", "Thermal throttling"],
  },
  ram: {
    id: "ram",
    label: "RAM (Memory)",
    category: "Memory",
    whatItIs: "Random Access Memory — temporary, high-speed working memory installed in DIMM slots on the motherboard.",
    mainRole: "Holds the data and instructions of currently running programs so the CPU can reach them quickly.",
    connectedTo: ["cpu", "motherboard"],
    keyConcepts: ["Volatile memory", "Capacity", "Memory channels", "Modules (DIMMs)"],
    technicalExample: [
      { label: "Capacity", value: "16 GB (example)" },
      { label: "Type", value: "DDR (example)" },
      { label: "Status", value: "Installed" },
    ],
  },
  gpu: {
    id: "gpu",
    label: "GPU (Graphics Card)",
    category: "Processing",
    whatItIs: "A processor specialized for graphics and other highly parallel workloads, usually installed in a PCIe expansion slot.",
    mainRole: "Renders images for the display and accelerates parallel computation such as 3D graphics.",
    connectedTo: ["pcie", "motherboard"],
    keyConcepts: ["Parallel computation", "VRAM", "PCIe connection", "Video output"],
    technicalExample: [
      { label: "VRAM", value: "8 GB (example)" },
      { label: "Interface", value: "PCIe (example)" },
      { label: "Output", value: "HDMI / DisplayPort" },
    ],
  },
  storageM2: {
    id: "storageM2",
    label: "M.2 / NVMe Storage",
    category: "Storage",
    whatItIs:
      "A compact storage device that plugs directly into an M.2 slot on the motherboard. M.2 is a physical form factor; NVMe is a separate storage protocol many M.2 drives use over a PCIe connection — the two terms are related but not synonyms.",
    mainRole: "Persistent storage for the operating system, programs, and files, with high-speed access.",
    connectedTo: ["motherboard", "chipset"],
    keyConcepts: ["Flash storage", "Form factor vs. protocol", "PCIe/NVMe", "Persistent storage"],
  },
  storageSata: {
    id: "storageSata",
    label: "SATA Storage (SSD / HDD)",
    category: "Storage",
    whatItIs:
      "A drive connected by a SATA data cable and a separate power cable — either a solid-state drive (flash storage, no moving parts) or a traditional hard disk drive (spinning magnetic platters).",
    mainRole: "Persistent storage for the operating system, programs, and files, connected over the SATA interface.",
    connectedTo: ["motherboard", "chipset", "psu"],
    keyConcepts: ["SATA interface", "SSD vs. HDD", "Persistent storage", "Moving parts (HDD only)"],
  },
  psu: {
    id: "psu",
    label: "Power Supply Unit (PSU)",
    category: "Power",
    whatItIs: "A unit that converts wall electricity into the different, lower voltages a computer's components need.",
    mainRole: "Supplies electrical power to the motherboard and every component connected to it.",
    connectedTo: ["motherboard", "cpu", "storageSata", "gpu"],
    keyConcepts: ["Voltage conversion", "Power connectors", "Wattage"],
  },
  chipset: {
    id: "chipset",
    label: "Chipset (Platform Controller)",
    category: "Motherboard",
    whatItIs: "A controller chip on the motherboard that manages communication between the CPU and many of the motherboard's other connections.",
    mainRole: "Coordinates data traffic between the CPU and slower/peripheral components — storage, USB, and more.",
    connectedTo: ["cpu", "motherboard", "storageM2", "storageSata"],
    keyConcepts: ["Platform controller", "I/O management", "BIOS/UEFI firmware area"],
  },
  pcie: {
    id: "pcie",
    label: "PCIe Expansion Slots",
    category: "Motherboard",
    whatItIs: "High-speed expansion slots on the motherboard, most commonly used today for a graphics card, but also for other expansion cards.",
    mainRole: "Gives expansion cards, most often a GPU, a fast direct connection to the rest of the system.",
    connectedTo: ["motherboard", "gpu", "chipset"],
    keyConcepts: ["PCIe (interface, not a card itself)", "Expansion cards", "Lanes"],
  },
  vrm: {
    id: "vrm",
    label: "Power Delivery (VRM)",
    category: "Power",
    whatItIs: "The voltage regulator module — a cluster of chokes and transistors near the CPU socket that steps the motherboard's power down to what the CPU actually needs.",
    mainRole: "Regulates and delivers stable power specifically to the CPU.",
    connectedTo: ["cpu", "motherboard", "psu"],
    keyConcepts: ["Voltage regulation", "Power delivery", "Heatsink"],
  },
  rearIo: {
    id: "rearIo",
    label: "Rear I/O Panel",
    category: "Input / Output",
    whatItIs: "The cluster of external ports at the back of the case — USB, display outputs, network, and audio.",
    mainRole: "Connects the computer to input devices, output devices, networks, and peripherals.",
    connectedTo: ["motherboard", "chipset"],
    keyConcepts: ["USB", "HDMI / DisplayPort", "Ethernet", "Audio"],
  },
};

export const COMPONENT_ORDER: ComponentId[] = [
  "motherboard",
  "cpu",
  "cpuCooler",
  "ram",
  "gpu",
  "storageM2",
  "storageSata",
  "chipset",
  "pcie",
  "vrm",
  "psu",
  "rearIo",
];

export const CATEGORY_ORDER: ComponentCategory[] = [
  "Processing",
  "Memory",
  "Storage",
  "Motherboard",
  "Input / Output",
  "Power",
];

export function componentsByCategory(category: ComponentCategory): ComponentDef[] {
  return COMPONENT_ORDER.map((id) => COMPONENTS[id]).filter((c) => c.category === category);
}

// ---------------------------------------------------------------------------
// Relationship flows (section: "Component Relationships")
// ---------------------------------------------------------------------------

export interface RelationshipFlow {
  id: ComponentId;
  steps: string[];
  caveat?: string;
}

export const RELATIONSHIP_FLOWS: Partial<Record<ComponentId, RelationshipFlow>> = {
  cpu: {
    id: "cpu",
    steps: ["CPU", "RAM", "Motherboard", "I/O"],
    caveat: "A simplified teaching path — the CPU also talks to storage and the GPU, both indirectly through the motherboard/chipset.",
  },
  gpu: {
    id: "gpu",
    steps: ["CPU / System", "PCIe", "GPU", "Display"],
  },
  ram: {
    id: "ram",
    steps: ["RAM", "CPU"],
    caveat: "RAM's most important relationship is the direct, high-speed link to the CPU — it is not routed through storage.",
  },
  storageM2: {
    id: "storageM2",
    steps: ["Storage", "Motherboard interface", "System", "RAM", "CPU"],
    caveat: "Storage never feeds the CPU directly — anything it holds must be copied into RAM first.",
  },
  storageSata: {
    id: "storageSata",
    steps: ["Storage", "Motherboard interface", "System", "RAM", "CPU"],
  },
  psu: {
    id: "psu",
    steps: ["PSU", "Motherboard", "CPU / RAM / Storage / Expansion devices"],
  },
};

// ---------------------------------------------------------------------------
// Comparisons
// ---------------------------------------------------------------------------

export interface ComparisonRow {
  aspect: string;
  left: string;
  right: string;
}

export interface Comparison {
  id: string;
  title: string;
  leftLabel: string;
  rightLabel: string;
  rows: ComparisonRow[];
  note: string;
}

export const COMPARISONS: Comparison[] = [
  {
    id: "ram-vs-storage",
    title: "RAM vs. Storage",
    leftLabel: "RAM",
    rightLabel: "Storage",
    rows: [
      { aspect: "Persistence", left: "Volatile — cleared when power is lost", right: "Persistent — keeps data with power off" },
      { aspect: "Purpose", left: "Temporary working memory for active programs", right: "Long-term home for the OS, programs, and files" },
      { aspect: "Typical role", left: "Holds only what is running right now", right: "Holds everything, running or not" },
      { aspect: "Relative access", left: "Very fast to access", right: "Much slower to access than RAM" },
      { aspect: "Data retention", left: "Lost on shutdown/restart", right: "Retained across shutdown/restart" },
    ],
    note: "Neither is \"better\" — a system needs both. RAM's speed makes running programs responsive; storage's persistence keeps your files there tomorrow.",
  },
  {
    id: "hdd-vs-ssd",
    title: "HDD vs. SSD",
    leftLabel: "HDD",
    rightLabel: "SSD",
    rows: [
      { aspect: "Technology", left: "Spinning magnetic platters", right: "Flash memory chips" },
      { aspect: "Moving parts", left: "Yes — a spinning disk and moving read/write head", right: "None" },
      { aspect: "Persistence", left: "Persistent", right: "Persistent" },
      { aspect: "Typical characteristics", left: "Larger capacity per dollar, slower access", right: "Faster access, historically higher cost per GB" },
    ],
    note: "Suitability depends on the workload and budget, not a universal winner — a system can also use both for different roles.",
  },
  {
    id: "cpu-vs-gpu",
    title: "CPU vs. GPU",
    leftLabel: "CPU",
    rightLabel: "GPU",
    rows: [
      { aspect: "Design goal", left: "General-purpose processing", right: "Specialized for highly parallel workloads" },
      { aspect: "Core count", left: "Fewer, more complex cores", right: "Many simpler cores working together" },
      { aspect: "Typical workloads", left: "Everyday logic, running the OS, sequential tasks", right: "Graphics rendering, large parallel calculations" },
    ],
    note: "The two complement each other in the same system rather than competing — which one matters more depends entirely on the task.",
  },
];

// ---------------------------------------------------------------------------
// Troubleshooting
// ---------------------------------------------------------------------------

export interface TroubleshootingScenario {
  id: string;
  symptom: string;
  possibleAreas: { componentId: ComponentId; reason: string }[];
  note: string;
}

export const TROUBLESHOOTING_SCENARIOS: TroubleshootingScenario[] = [
  {
    id: "no-power",
    symptom: "Computer does not power on at all",
    possibleAreas: [
      { componentId: "psu", reason: "The power supply itself, or its connection to the wall, may have failed." },
      { componentId: "motherboard", reason: "The power cable from the PSU to the motherboard may be loose or disconnected." },
    ],
    note: "A single symptom rarely has one guaranteed cause — this list narrows down plausible areas to check, not a diagnosis.",
  },
  {
    id: "no-boot",
    symptom: "Computer powers on (fans spin, lights turn on) but does not boot",
    possibleAreas: [
      { componentId: "storageM2", reason: "The boot device may be missing, disconnected, or have no operating system installed." },
      { componentId: "ram", reason: "RAM that is not seated properly can prevent the system from getting past firmware checks." },
      { componentId: "chipset", reason: "Firmware/BIOS-UEFI settings may not be pointing at the correct boot device." },
    ],
    note: "This connects to the existing Computer Boot Process simulation — that topic explains what \"boot\" actually means step by step.",
  },
  {
    id: "no-display",
    symptom: "Computer seems to run, but there is no display output",
    possibleAreas: [
      { componentId: "gpu", reason: "A dedicated GPU may not be seated properly, or the monitor may be plugged into the wrong output." },
      { componentId: "rearIo", reason: "The video cable may be connected to a port that is not currently active." },
    ],
    note: "Monitor cabling and power are also worth checking first — the fault is not always inside the case.",
  },
];

// ---------------------------------------------------------------------------
// Build-a-Computer
// ---------------------------------------------------------------------------

export type BuildSlotId = "cpu" | "ram" | "storage" | "gpu" | "psu";

export interface BuildOption {
  id: string;
  label: string;
  compatible: boolean;
  note: string;
}

export interface BuildSlot {
  id: BuildSlotId;
  label: string;
  required: boolean;
  options: BuildOption[];
}

export const BUILD_SLOTS: BuildSlot[] = [
  {
    id: "cpu",
    label: "CPU",
    required: true,
    options: [
      { id: "cpu-match", label: "CPU matching the motherboard's socket", compatible: true, note: "A CPU only fits a socket built for its specific pin/contact layout." },
      { id: "cpu-mismatch", label: "CPU with a different socket type", compatible: false, note: "This CPU's socket does not match the motherboard — it will not physically fit." },
    ],
  },
  {
    id: "ram",
    label: "RAM",
    required: true,
    options: [
      { id: "ram-match", label: "RAM matching the motherboard's supported type", compatible: true, note: "RAM modules must match the type and generation the motherboard's slots support." },
      { id: "ram-mismatch", label: "RAM of an unsupported type", compatible: false, note: "This motherboard's slots are not designed for this RAM type." },
    ],
  },
  {
    id: "storage",
    label: "Storage",
    required: true,
    options: [
      { id: "storage-m2", label: "M.2 NVMe SSD (uses an M.2 slot)", compatible: true, note: "Requires the motherboard to have an available M.2 slot." },
      { id: "storage-sata", label: "SATA SSD/HDD (uses a SATA cable + power cable)", compatible: true, note: "Requires a free SATA port on the motherboard and a SATA power connector from the PSU." },
      { id: "storage-nointerface", label: "Storage device with no matching interface available", compatible: false, note: "This storage device requires an appropriate motherboard interface that isn't available." },
    ],
  },
  {
    id: "gpu",
    label: "GPU",
    required: false,
    options: [
      { id: "gpu-add", label: "Dedicated GPU in a PCIe slot", compatible: true, note: "Optional — many CPUs include basic built-in graphics, so a dedicated GPU is not always required." },
      { id: "gpu-none", label: "No dedicated GPU", compatible: true, note: "Valid for many everyday tasks, if the CPU has integrated graphics." },
    ],
  },
  {
    id: "psu",
    label: "Power Supply (PSU)",
    required: true,
    options: [
      { id: "psu-sufficient", label: "PSU with enough wattage for the build", compatible: true, note: "The PSU must supply enough power for every installed component, with some headroom." },
      { id: "psu-insufficient", label: "PSU with too little wattage", compatible: false, note: "An undersized PSU cannot reliably power every installed component." },
    ],
  },
];

// ---------------------------------------------------------------------------
// Camera presets (Motherboard Lab)
// ---------------------------------------------------------------------------

export type CameraPresetId = "overview" | "cpuArea" | "memoryArea" | "storageArea" | "expansionArea" | "ioArea" | "powerArea";

export const CAMERA_PRESETS: { id: CameraPresetId; label: string; focusId: ComponentId | "overview" }[] = [
  { id: "overview", label: "Full Board", focusId: "overview" },
  { id: "cpuArea", label: "CPU Area", focusId: "cpu" },
  { id: "memoryArea", label: "Memory Area", focusId: "ram" },
  { id: "storageArea", label: "Storage Area", focusId: "storageM2" },
  { id: "expansionArea", label: "Expansion Area", focusId: "gpu" },
  { id: "ioArea", label: "I/O Area", focusId: "rearIo" },
  { id: "powerArea", label: "Power Area", focusId: "vrm" },
];

// ---------------------------------------------------------------------------
// Layers & detail levels
// ---------------------------------------------------------------------------

export type BoardLayer = "basic" | "connection" | "technical";

export const LAYER_LABELS: Record<BoardLayer, string> = {
  basic: "Basic",
  connection: "Connections",
  technical: "Technical",
};

export const LAYER_DESCRIPTIONS: Record<BoardLayer, string> = {
  basic: "Major physical components only.",
  connection: "Adds the buses/links/interfaces between components.",
  technical: "Adds technical labels — socket, channels, PCIe, SATA, M.2/NVMe, USB, power connections.",
};

export type DetailLevel = "beginner" | "intermediate" | "technical";

export const DETAIL_LEVEL_LABELS: Record<DetailLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  technical: "Technical",
};

export const DETAIL_LEVEL_DESCRIPTIONS: Record<DetailLevel, string> = {
  beginner: "What is this, and what does it do?",
  intermediate: "Connections, interfaces, and data flow between components.",
  technical: "PCIe, SATA, NVMe, memory channels, CPU cache, firmware, and I/O interfaces.",
};

// ---------------------------------------------------------------------------
// Cross-links to existing simulations (do not duplicate their content)
// ---------------------------------------------------------------------------

export const DATA_FLOW_LINK = {
  href: "/dashboard/information-technology/cpu-ram-storage-data-flow",
  label: "Explore how these components exchange data",
  description: "This lab shows what the parts are and how they're connected. The CPU–RAM–Storage Data Flow simulation shows how information actually moves between them during execution.",
};

export const BOOT_PROCESS_LINK = {
  href: "/dashboard/information-technology/computer-boot-process",
  label: "See what happens when the computer starts",
  description: "Power On → Firmware → Hardware Initialization → Boot Device → Operating System — stepped through in full in the Computer Boot Process simulation.",
};

export const HARDWARE_DISCLAIMER =
  "This is an educational, simplified model of a typical desktop computer — not a reproduction of any specific commercial motherboard. Not every computer contains every component shown here, and exact layouts vary between real machines.";
