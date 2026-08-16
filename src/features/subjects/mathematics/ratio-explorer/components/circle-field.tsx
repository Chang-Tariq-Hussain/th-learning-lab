"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { OBJECT_COLORS } from "../colors";
import { gcd } from "../ratio-utils";
import { ConfettiBurst } from "./confetti-burst";
import { GroupedCircles } from "./grouped-circles";

export interface CircleFieldProps {
  blueCount: number;
  redCount: number;
  celebrating: boolean;
  confettiKey: number;
}

export function CircleField({ blueCount, redCount, celebrating, confettiKey }: CircleFieldProps) {
  const divisor = gcd(blueCount, redCount) || 1;
  const blueGroupSize = blueCount === 0 ? 1 : blueCount / divisor;
  const redGroupSize = redCount === 0 ? 1 : redCount / divisor;

  return (
    <div
      className={cn(
        "relative flex min-h-[420px] w-full flex-col gap-6 rounded-[1.75rem] border border-line bg-white/70 p-6 shadow-card backdrop-blur transition-colors duration-300 dark:border-line-dark dark:bg-white/[0.04] sm:p-8",
        celebrating && "border-subject-chemistry/40",
      )}
    >
      <ConfettiBurst triggerKey={confettiKey} />

      {/* Live ratio */}
      <div className="text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft/70 dark:text-bone-soft/70">
          Live ratio
        </p>
        <motion.p
          key={`${blueCount}-${redCount}`}
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 380, damping: 22 }}
          className="mt-1 font-display text-5xl font-medium text-ink dark:text-bone sm:text-6xl"
        >
          <span style={{ color: OBJECT_COLORS.blue.hex }}>{blueCount}</span>
          <span className="mx-3 text-ink-soft/50 dark:text-bone-soft/50">:</span>
          <span style={{ color: OBJECT_COLORS.red.hex }}>{redCount}</span>
        </motion.p>
      </div>

      {/* Blue row */}
      <div className="flex flex-col gap-2">
        <RowLabel color="blue" count={blueCount} />
        <GroupedCircles color="blue" count={blueCount} groupSize={blueGroupSize} />
      </div>

      {/* Red row */}
      <div className="flex flex-col gap-2">
        <RowLabel color="red" count={redCount} />
        <GroupedCircles color="red" count={redCount} groupSize={redGroupSize} />
      </div>

      {blueCount > 0 && redCount > 0 && divisor > 1 && (
        <p className="mt-auto text-center text-sm text-ink-soft dark:text-bone-soft">
          Grouped into {divisor} equal groups — {blueGroupSize} blue and {redGroupSize} red in each.
        </p>
      )}
    </div>
  );
}

function RowLabel({ color, count }: { color: "blue" | "red"; count: number }) {
  const { hex, label } = OBJECT_COLORS[color];
  return (
    <div className="flex items-center gap-2">
      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: hex }} />
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft dark:text-bone-soft">
        {label} circles · {count}
      </span>
    </div>
  );
}
