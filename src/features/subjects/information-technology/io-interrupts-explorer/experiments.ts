import type { Level } from "./model";
import type { EventLabPreset } from "./components/event-lab";
import type { PollingLabPreset } from "./components/polling-lab";
import type { DmaLabPreset } from "./components/dma-lab";

export type TabId = "basics" | "events" | "polling" | "addressing" | "dma" | "experiments";

export interface LabPreset {
  event?: EventLabPreset;
  polling?: PollingLabPreset;
  dma?: DmaLabPreset;
}

export interface Experiment {
  id: string;
  title: string;
  level: Level;
  tab: TabId;
  goal: string;
  steps: string[];
  observe: string;
  check: { question: string; options: string[]; correct: number; explanation: string };
  preset: LabPreset;
}

export const EXPERIMENTS: Experiment[] = [
  {
    id: "exp-polling",
    title: "Experiment 1 — Polling",
    level: "beginner",
    tab: "polling",
    goal: "Handle a device event using polling and observe how many CPU checks it costs.",
    steps: ["Polling mode is selected with the CPU checking every tick.", "Press Run and watch the CPU ask “Are you ready?” repeatedly.", "Note the CPU checks and how little useful work is done before the device is ready."],
    observe: "Before the device is ready, every tick is a check — the CPU does no useful work.",
    check: {
      question: "While the device wasn't ready yet, what was the CPU doing in polling mode?",
      options: ["Repeatedly checking the device's status", "Waiting for an interrupt signal", "Transferring data with DMA"],
      correct: 0,
      explanation: "Polling means the CPU itself keeps checking whether the device needs attention.",
    },
    preset: { polling: { method: "polling", pollEvery: 1 } },
  },
  {
    id: "exp-interrupt",
    title: "Experiment 2 — Interrupt",
    level: "beginner",
    tab: "polling",
    goal: "Run the same event with interrupt-driven I/O and compare CPU activity with polling.",
    steps: ["Interrupt mode is selected with the same device-ready time.", "Press Run and watch the CPU keep doing useful work until the interrupt arrives.", "Compare the totals with the “Same scenario, both methods” table."],
    observe: "The CPU does useful work while waiting, but pays a small overhead to enter and leave the ISR.",
    check: {
      question: "Which is true of the interrupt-mode run?",
      options: ["The CPU did far more useful work before the event, at the cost of some interrupt overhead", "The CPU checked the device on every tick", "There was no overhead at all"],
      correct: 0,
      explanation: "Interrupt entry costs a few ticks (save, identify, restore), but the CPU wasn't busy checking beforehand.",
    },
    preset: { polling: { method: "interrupt" } },
  },
  {
    id: "exp-multiple",
    title: "Experiment 3 — Multiple interrupts",
    level: "intermediate",
    tab: "events",
    goal: "Trigger keyboard, timer, disk, and network events together and observe priority.",
    steps: ["The lab starts paused with the default priority order (Timer highest).", "Press “Burst: 4 events at once”. Arrival order is Keyboard, Network, Storage, Timer.", "Press Resume and watch which interrupt the CPU handles first in the queue and log.", "Try reordering priorities or switching to first come, first served, then burst again."],
    observe: "The CPU handles the pending interrupts by priority, not arrival order.",
    check: {
      question: "With the default priorities, which of the four burst events is handled first?",
      options: ["Timer", "Keyboard", "Network"],
      correct: 0,
      explanation: "Timer has the highest priority in the default order, so it goes first even though it arrived last.",
    },
    preset: { event: { startPaused: true } },
  },
  {
    id: "exp-masking",
    title: "Experiment 4 — Interrupt masking",
    level: "technical",
    tab: "events",
    goal: "Mask low-priority interrupts and observe them being deferred.",
    steps: ["Masking is ON with Mouse and Printer masked.", "Press Move Mouse, Printer Ready, then Press Keyboard.", "Watch the Mouse and Printer stay “Masked / deferred” while the Keyboard is handled.", "Switch masking OFF and watch the deferred interrupts get handled."],
    observe: "Masked interrupts wait in the pending list; unmasking makes them eligible again.",
    check: {
      question: "What happens to a masked device's interrupt request?",
      options: ["It is deferred, not lost — it waits until masking is off", "It is permanently discarded", "It is handled first"],
      correct: 0,
      explanation: "In this model masking defers the request; it stays pending until it becomes eligible.",
    },
    preset: { event: { config: { maskingOn: true, masked: ["mouse", "printer"] } } },
  },
  {
    id: "exp-dma",
    title: "Experiment 5 — DMA",
    level: "intermediate",
    tab: "dma",
    goal: "Transfer a large block with CPU-driven I/O and with DMA and compare CPU availability.",
    steps: ["The lab starts on CPU-driven (polling) with 512 words.", "Note “CPU available for other work”.", "Switch CPU involvement to DMA and compare.", "Finally set the size to 1 word and compare again."],
    observe: "For a large block, DMA frees most of the CPU's time; for a tiny block, its setup cost may not pay off.",
    check: {
      question: "Why does DMA leave the CPU with more available time on a large transfer?",
      options: ["A DMA controller moves the data, so the CPU isn't copying each word", "DMA makes the device faster", "The CPU is no longer involved at all"],
      correct: 0,
      explanation: "The CPU still sets up the transfer and handles completion, but it doesn't copy every word.",
    },
    preset: { dma: { method: "polling", words: 512 } },
  },
  {
    id: "exp-dma-completion",
    title: "Experiment 6 — DMA completion",
    level: "technical",
    tab: "dma",
    goal: "Watch a DMA transfer complete and notify the CPU through an interrupt.",
    steps: ["Scroll to “DMA completion interrupt”.", "Press Play sequence and read each step.", "Notice the CPU is free during the transfer and only interrupted at the end."],
    observe: "DMA completion is reported to the CPU with an interrupt — DMA and interrupts work together.",
    check: {
      question: "How does the CPU learn that a DMA transfer has finished?",
      options: ["The DMA controller raises an interrupt", "The CPU polls every word", "It doesn't need to know"],
      correct: 0,
      explanation: "The completion interrupt lets the CPU do other work during the transfer and respond only when it's done.",
    },
    preset: { dma: { method: "dma", words: 128 } },
  },
];
