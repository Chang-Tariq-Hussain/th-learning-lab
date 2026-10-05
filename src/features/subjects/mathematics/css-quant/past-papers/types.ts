import type { Figure, ModuleId, PastPaperRef } from "../types";

/** One question exactly as it appeared on the paper (options keep their printed order A–D). */
export interface PastPaperItem {
  id: string;
  module: Exclude<ModuleId, "mixed">;
  /** Must match a generator topic id so the topic filter and statistics work. */
  topic: string;
  prompt: string;
  figure?: Figure;
  /** Exactly four options, in printed order. */
  options: readonly string[];
  /** Index (0–3) of the officially correct option. */
  correct: number;
  /** Our own worked solution — written by us, not copied from any source. */
  steps: readonly string[];
  trick: string;
  trap?: string;
  ref: Omit<PastPaperRef, "itemId">;
}
