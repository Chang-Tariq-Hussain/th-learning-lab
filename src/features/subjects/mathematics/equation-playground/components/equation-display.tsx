"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { EquationChallenge } from "../equations";
import { ConfettiBurst } from "./confetti-burst";

export type CheckStatus = "idle" | "correct" | "incorrect";

export interface EquationDisplayProps {
  challenge: EquationChallenge;
  sliderValue: number;
  status: CheckStatus;
  confettiKey: number;
}

const STATUS_RING: Record<CheckStatus, string> = {
  idle: "ring-subject-math/30",
  correct: "ring-[#2E9E5B]",
  incorrect: "ring-[#E0524F]",
};

/**
 * The centerpiece: one equation, with the box replaced live by whatever
 * the slider is currently set to. Never shows a "hint" or solves
 * anything — the box is just the slider's current value, exactly as
 * dragged, no matter how far from the answer.
 */
export function EquationDisplay({ challenge, sliderValue, status, confettiKey }: EquationDisplayProps) {
  const left = challenge.a === "box" ? sliderValue : challenge.a;
  const right = challenge.b === "box" ? sliderValue : challenge.b;

  return (
    <div
      className={cn(
        "relative flex w-full max-w-xl items-center justify-center overflow-visible rounded-card border border-line bg-white/70 px-6 py-10 shadow-card ring-4 ring-inset transition-colors duration-300 dark:border-line-dark dark:bg-white/[0.03] sm:px-10 sm:py-14",
        STATUS_RING[status],
      )}
    >
      <ConfettiBurst triggerKey={confettiKey} />
      <motion.div
        animate={status === "correct" ? { scale: [1, 1.08, 1] } : { scale: 1 }}
        transition={{ duration: 0.45 }}
        className="flex flex-wrap items-center justify-center gap-3 font-display text-4xl font-semibold text-ink dark:text-bone sm:gap-4 sm:text-6xl"
      >
        <Slot isBox={challenge.a === "box"} value={left} status={status} />
        <span className="text-ink-soft dark:text-bone-soft">{challenge.operator}</span>
        <Slot isBox={challenge.b === "box"} value={right} status={status} />
        <span className="text-ink-soft dark:text-bone-soft">=</span>
        <span>{challenge.result}</span>
      </motion.div>
    </div>
  );
}

function Slot({ isBox, value, status }: { isBox: boolean; value: number; status: CheckStatus }) {
  if (!isBox) return <span>{value}</span>;

  return (
    <span
      className={cn(
        "flex h-[1.4em] min-w-[1.4em] items-center justify-center rounded-2xl border-2 px-2 transition-colors duration-200",
        status === "idle" &&
          "border-subject-math/50 bg-subject-math-soft text-subject-math dark:border-subject-math/40 dark:bg-subject-math/15 dark:text-[#B9A6F5]",
        status === "correct" &&
          "border-[#2E9E5B] bg-[#2E9E5B]/10 text-[#1F7A4C] dark:bg-[#2E9E5B]/20 dark:text-[#7FD9A8]",
        status === "incorrect" &&
          "border-[#E0524F] bg-[#E0524F]/10 text-[#C23B38] dark:bg-[#E0524F]/20 dark:text-[#F0918F]",
      )}
    >
      {value}
    </span>
  );
}
