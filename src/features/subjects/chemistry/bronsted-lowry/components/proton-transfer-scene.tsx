"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ACID_COLOR, BASE_COLOR, PROTON_COLOR, type Reaction } from "../model";

interface ProtonTransferSceneProps {
  reaction: Reaction;
  stepIndex: number;
}

const ROLE_COLOR = { acid: ACID_COLOR, base: BASE_COLOR };

/**
 * Two molecule pills (left/right, matching the equation's written
 * order) plus one H⁺ chip that travels from whichever side is the
 * donor to whichever side is the acceptor. Which side donates
 * depends on the reaction — for HCl + H₂O that's left→right, for
 * NH₃ + H₂O it's right→left, which is exactly the point the second
 * example is meant to make.
 */
export function ProtonTransferScene({ reaction, stepIndex }: ProtonTransferSceneProps) {
  const { left, right } = reaction;
  const donorSide = left.role === "acid" ? "left" : "right";
  const donor = donorSide === "left" ? left : right;
  const acceptor = donorSide === "left" ? right : left;
  const donorX = donorSide === "left" ? 25 : 75;
  const acceptorX = donorSide === "left" ? 75 : 25;

  const showProducts = stepIndex >= 3;
  const showFinalTags = stepIndex >= 4;
  const protonVisible = stepIndex === 1 || stepIndex === 2;
  const protonAtAcceptor = stepIndex >= 2;

  return (
    <div className="relative h-52 w-full overflow-hidden rounded-card border border-line bg-white/40 dark:border-line-dark dark:bg-white/[0.02] sm:h-56">
      {/* Equation reminder */}
      <p className="absolute left-1/2 top-3 -translate-x-1/2 whitespace-nowrap font-mono text-xs text-ink-soft/70 dark:text-bone-soft/60">
        {reaction.equation}
      </p>

      {/* Left / right molecule pills */}
      {(["left", "right"] as const).map((side) => {
        const data = side === "left" ? left : right;
        const x = side === "left" ? 25 : 75;
        const isDonor = side === donorSide;
        const label = showProducts ? data.product : data.formula;
        const color = ROLE_COLOR[data.role];

        return (
          <div
            key={side}
            className="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
            style={{ left: `${x}%` }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.3 }}
                className="flex h-16 w-16 items-center justify-center rounded-full border-2 font-mono text-sm font-semibold sm:h-20 sm:w-20 sm:text-base"
                style={{ borderColor: color, color, background: `${color}14` }}
              >
                {label}
              </motion.div>
            </AnimatePresence>

            <AnimatePresence>
              {showFinalTags ? (
                <motion.span
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-full px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide"
                  style={{ background: `${color}1f`, color }}
                >
                  {isDonor ? "Acid" : "Base"}
                </motion.span>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}

      {/* H+ proton chip */}
      <AnimatePresence>
        {protonVisible ? (
          <motion.div
            key="proton"
            className={cn("absolute top-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full font-mono text-xs font-bold text-paper shadow")}
            style={{ background: PROTON_COLOR }}
            initial={{ left: `${donorX}%`, top: "20%", opacity: 0, scale: 0.6 }}
            animate={{
              left: `${protonAtAcceptor ? acceptorX : donorX}%`,
              top: "20%",
              opacity: 1,
              scale: [0.6, 1.15, 1],
            }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ left: { duration: 0.9, ease: "easeInOut" }, opacity: { duration: 0.25 }, scale: { duration: 0.4 } }}
          >
            H⁺
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Donor / acceptor helper labels, shown while the proton is mid-flight */}
      {stepIndex === 1 || stepIndex === 2 ? (
        <p className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] text-ink-soft/70 dark:text-bone-soft/60">
          {donor.formula} donates H⁺ &rarr; {acceptor.formula} accepts H⁺
        </p>
      ) : null}
    </div>
  );
}
