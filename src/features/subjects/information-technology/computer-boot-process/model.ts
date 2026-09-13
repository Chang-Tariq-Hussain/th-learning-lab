/**
 * Conceptual model for the Computer Boot Process simulation (the
 * "Computer Startup Laboratory").
 *
 * Like `cpu-ram-storage-data-flow`, this is a small, fixed sequence of
 * discrete conceptual stages rather than a continuous numeric
 * simulation — no `@/features/simulation` canvas engine needed.
 *
 * IMPORTANT accuracy note, surfaced directly in the UI (see
 * `BOOT_SEQUENCE_DISCLAIMER`): this sequence is a representative,
 * beginner-friendly model. Real systems vary — UEFI vs. legacy BIOS,
 * fast boot paths that skip parts of POST, different bootloaders, and
 * different init systems all exist. The brief is explicit that no
 * single sequence should be presented as universal.
 */

export type BootStageId =
  | "power-on"
  | "firmware"
  | "post"
  | "hardware-init"
  | "boot-device"
  | "bootloader"
  | "os-loading"
  | "kernel"
  | "login-desktop";

export interface BootStage {
  id: BootStageId;
  order: number;
  label: string;
  /** Short phrase shown on the timeline/diagram. */
  shortLabel: string;
  /** What is happening at this stage. */
  whatHappens: string;
  /** Why this stage exists / why it happens. */
  whyItHappens: string;
  /** The component or software primarily responsible. */
  component: string;
  /** What happens immediately next (omitted for the final stage). */
  whatComesNext?: string;
}

export const BOOT_STAGES: BootStage[] = [
  {
    id: "power-on",
    order: 0,
    label: "Power On",
    shortLabel: "Power On",
    whatHappens:
      "Pressing the power button lets electricity reach the motherboard and its components. The power supply confirms stable power before anything else is allowed to start.",
    whyItHappens:
      "Every other stage depends on stable power. Starting components before power is stable could cause errors or damage, so the system waits for a clean, steady power signal first.",
    component: "Power supply unit (PSU) and motherboard",
    whatComesNext: "Once power is stable, the motherboard's firmware begins running.",
  },
  {
    id: "firmware",
    order: 1,
    label: "Firmware Starts (BIOS/UEFI)",
    shortLabel: "Firmware",
    whatHappens:
      "The motherboard runs its built-in firmware — either the older BIOS or the modern UEFI standard. This is the very first software that executes, stored on a chip on the motherboard itself, not on the hard drive.",
    whyItHappens:
      "The computer needs some initial instructions before an operating system exists to give it any. Firmware is permanently stored on the motherboard specifically so there's always something ready to run the instant power is available.",
    component: "Motherboard firmware (BIOS or UEFI)",
    whatComesNext: "The firmware immediately begins the Power-On Self-Test.",
  },
  {
    id: "post",
    order: 2,
    label: "POST (Power-On Self-Test)",
    shortLabel: "POST",
    whatHappens:
      "The firmware runs a quick self-test, checking that essential hardware — the CPU, memory, and basic controllers — are present and responding correctly.",
    whyItHappens:
      "Loading an operating system onto broken or missing hardware would fail in confusing ways. POST catches serious hardware problems early, often signaling them with beep codes or on-screen error codes before anything else is attempted.",
    component: "Firmware (BIOS/UEFI)",
    whatComesNext: "If POST passes, the firmware moves on to initializing the rest of the hardware.",
  },
  {
    id: "hardware-init",
    order: 3,
    label: "Hardware Initialization",
    shortLabel: "Hardware Init",
    whatHappens:
      "The firmware detects and prepares attached hardware — storage drives, keyboard and mouse, graphics, and other peripherals — so they're ready to be used.",
    whyItHappens:
      "Hardware has to be recognized and set into a known, working state before anything can use it. This is also when the firmware builds its picture of what storage devices are actually available to boot from.",
    component: "Firmware (BIOS/UEFI)",
    whatComesNext: "With hardware ready, the firmware decides which device to boot from.",
  },
  {
    id: "boot-device",
    order: 4,
    label: "Boot Device Selection",
    shortLabel: "Boot Device",
    whatHappens:
      "The firmware looks through a configured list of storage devices — an internal SSD, a USB drive, a network location — to find one that contains a valid bootloader.",
    whyItHappens:
      "An operating system could potentially live on more than one connected device. The firmware needs a defined order to check, so it consistently picks the right one instead of guessing.",
    component: "Firmware (BIOS/UEFI) boot order settings",
    whatComesNext: "Once a valid boot device is found, its bootloader is handed control.",
  },
  {
    id: "bootloader",
    order: 5,
    label: "Bootloader",
    shortLabel: "Bootloader",
    whatHappens:
      "A small program stored at the start of the boot device — such as GRUB or Windows Boot Manager — takes over. It locates the operating system's files and prepares to load them.",
    whyItHappens:
      "Firmware itself only knows how to start the very first small program on a device; it doesn't know how to load a full operating system. The bootloader is a dedicated go-between whose only job is bridging firmware to the OS.",
    component: "Bootloader software (e.g. GRUB, Windows Boot Manager)",
    whatComesNext: "The bootloader begins loading the operating system's core files.",
  },
  {
    id: "os-loading",
    order: 6,
    label: "Operating System Loading",
    shortLabel: "OS Loading",
    whatHappens:
      "The bootloader reads the operating system's core files from storage into RAM, getting everything ready that's needed to start running the OS itself.",
    whyItHappens:
      "Like any program, the operating system has to be copied into fast working memory before it can actually run — the CPU can't execute it directly from storage.",
    component: "Bootloader, handing off to the operating system",
    whatComesNext: "Once loaded, the operating system's kernel takes over and starts initializing.",
  },
  {
    id: "kernel",
    order: 7,
    label: "Kernel / System Initialization",
    shortLabel: "Kernel Init",
    whatHappens:
      "The kernel — the operating system's core — starts managing the CPU, memory, and devices directly, and begins starting the background services the rest of the system depends on.",
    whyItHappens:
      "Everything above this point was preparation. The kernel is what actually turns raw hardware into a usable computer, handing out CPU time and memory to every program that will run from here on.",
    component: "Operating system kernel (e.g. Linux kernel, Windows NT kernel)",
    whatComesNext: "With core services running, the system becomes ready for a user to log in.",
  },
  {
    id: "login-desktop",
    order: 8,
    label: "Login / Desktop",
    shortLabel: "Login/Desktop",
    whatHappens:
      "The system presents a login screen or, once signed in, the desktop — the point where the computer is fully ready for the user to start working.",
    whyItHappens:
      "This is the handoff from \"the system starting itself\" to \"the system serving the user,\" and marks a working boot from power button to usable computer.",
    component: "Login manager / desktop environment",
  },
];

export const BOOT_SEQUENCE_DISCLAIMER =
  "This is a representative, beginner-friendly sequence, not a universal one. Real systems vary — UEFI systems and older BIOS systems behave differently, some computers use a fast-boot path that skips parts of POST, and different operating systems use different bootloaders and init systems. The overall idea — power, firmware, hardware checks, finding and running a bootloader, then loading the OS — holds broadly, but the exact steps are not identical on every machine.";

export function getStageByOrder(order: number): BootStage {
  return BOOT_STAGES[Math.max(0, Math.min(BOOT_STAGES.length - 1, order))]!;
}

// ---------------------------------------------------------------------------
// Experiment 4 — Boot Problem Concept scenarios
// ---------------------------------------------------------------------------

export interface BootProblemScenario {
  id: string;
  title: string;
  symptom: string;
  affectedStageId: BootStageId;
  explanation: string;
}

export const BOOT_PROBLEM_SCENARIOS: BootProblemScenario[] = [
  {
    id: "hardware-check-problem",
    title: "Hardware Check Problem",
    symptom:
      "The computer powers on, but immediately produces a series of beeps (or an on-screen error code) and never gets any further.",
    affectedStageId: "post",
    explanation:
      "This pattern points to POST — the Power-On Self-Test. POST is specifically the stage that checks essential hardware like the CPU and memory, and it's designed to stop and signal a problem (via beep codes or error codes) rather than continue with something broken.",
  },
  {
    id: "boot-device-unavailable",
    title: "Boot Device Unavailable",
    symptom:
      "The screen shows a message like \"No bootable device found\" shortly after the firmware's logo screen.",
    affectedStageId: "boot-device",
    explanation:
      "This matches the Boot Device Selection stage. The firmware finished checking hardware but couldn't find any connected device with a valid bootloader on it — often because a drive is disconnected, failed, or not set as a boot option.",
  },
  {
    id: "os-not-found",
    title: "Operating System Not Found",
    symptom:
      "The firmware finds a bootable device and starts a bootloader, but then shows an error saying the operating system's files can't be found or are corrupted.",
    affectedStageId: "os-loading",
    explanation:
      "This falls between the Bootloader and Operating System Loading stages: the bootloader itself started successfully, but it couldn't locate or read the actual operating system files it was expecting to load next.",
  },
];

/** Purely educational framing — never a real diagnostic tool. */
export const BOOT_PROBLEM_DISCLAIMER =
  "These are simplified, educational scenarios meant to connect a symptom to a stage — not a real troubleshooting guide for an actual computer.";
