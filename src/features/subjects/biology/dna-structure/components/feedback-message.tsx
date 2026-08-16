"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { BASE_NAMES } from "../model";
import type { Base, Feedback } from "../types";

export interface FeedbackMessageProps {
  feedback: Feedback | null;
  selectedIndex: number | null;
  sequence: Base[];
  filled: (Base | null)[];
  complete: boolean;
}

/**
 * One message slot with three possible things to say, in priority
 * order: a just-answered result, the pairing for whatever's currently
 * selected, or a gentle default prompt. Never anything punitive —
 * incorrect answers get the same "try again" wording the spec asks
 * for, not an error color.
 */
export function FeedbackMessage({ feedback, selectedIndex, sequence, filled, complete }: FeedbackMessageProps) {
  let content: { tone: "correct" | "hint" | "info" | "default"; text: string };

  if (complete) {
    content = { tone: "correct", text: "Great job! You completed the strand." };
  } else if (feedback?.status === "correct") {
    const base = sequence[feedback.index]!;
    content = { tone: "correct", text: `Correct! ${base} pairs with ${filled[feedback.index]}.` };
  } else if (feedback?.status === "incorrect") {
    content = { tone: "hint", text: "Try again. Remember: A pairs with T, and C pairs with G." };
  } else if (selectedIndex !== null && filled[selectedIndex]) {
    const base = sequence[selectedIndex]!;
    const pair = filled[selectedIndex]!;
    content = { tone: "info", text: `${BASE_NAMES[base]} (${base}) pairs with ${BASE_NAMES[pair]} (${pair}).` };
  } else if (selectedIndex !== null) {
    const base = sequence[selectedIndex]!;
    content = { tone: "info", text: `Position ${selectedIndex + 1} is ${BASE_NAMES[base]} (${base}). Which base pairs with it?` };
  } else {
    content = { tone: "default", text: "Click a base to see its pair, or answer the blanks below." };
  }

  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={content.text}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2 }}
        role="status"
        className={cn(
          "flex min-h-[2.5rem] items-center justify-center gap-1.5 text-center text-sm font-medium",
          content.tone === "correct" && "text-subject-biology",
          content.tone === "hint" && "text-amber-600 dark:text-amber-400",
          content.tone === "info" && "text-ink dark:text-bone",
          content.tone === "default" && "text-ink-soft dark:text-bone-soft",
        )}
      >
        {content.tone === "correct" ? <CheckCircle2 className="h-4 w-4 shrink-0" strokeWidth={2} /> : null}
        {content.text}
      </motion.p>
    </AnimatePresence>
  );
}
