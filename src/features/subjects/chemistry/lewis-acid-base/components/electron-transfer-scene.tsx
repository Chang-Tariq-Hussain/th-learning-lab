"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ACID_COLOR, BASE_COLOR, ELECTRON_PAIR_COLOR, type LewisReaction } from "../model";

interface ElectronTransferSceneProps {
  reaction: LewisReaction;
  stepIndex: number;
}

const ROLE_COLOR = { acid: ACID_COLOR, base: BASE_COLOR };

/**
 * Two molecule pills (left/right, matching the equation's written
 * order) plus one electron-pair chip that travels from whichever
 * side is the Lewis base to whichever side is the Lewis acid. Which
 * side donates depends on the reaction — for NH₃ + BF₃ that's
 * left→right, for H⁺ + NH₃ it's right→left.
 */
export function ElectronTransferScene({ reaction, stepIndex }: ElectronTransferSceneProps) {
  const { left, right } = reaction;
  const donorSide = left.role === "base" ? "left" : "right";
  const donor = donorSide === "left" ? left : right;
  const acceptor = donorSide === "left" ? right : left;
  const donorX = donorSide === "left" ? 25 : 75;
  const acceptorX = donorSide === "left" ? 75 : 25;

  const lonePairVisible = stepIndex <= 1;
  const lonePairHighlighted = stepIndex === 1;
  const pairInFlight = stepIndex === 1 || stepIndex === 2;
  const pairAtAcceptor = stepIndex >= 2;
  const bondFormed = stepIndex >= 3;
  const showFinalTags = stepIndex >= 4;

  return (
    <div className="relative h-52 w-full overflow-hidden rounded-card border border-line bg-white/40 dark:border-line-dark dark:bg-white/[0.02] sm:h-56">
      {/* Equation reminder */}
      <p className="absolute left-1/2 top-3 -translate-x-1/2 whitespace-nowrap font-mono text-xs text-ink-soft/70 dark:text-bone-soft/60">
        {reaction.equation}
      </p>

      {/* Bond line between the two pills once the coordinate bond has formed */}
      <AnimatePresence>
        {bondFormed ? (
          <motion.div
            key="bond"
            initial={{ opacity: 0, scaleX: 0.6 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute top-1/2 h-0.5 -translate-y-1/2"
            style={{ left: "32%", right: "32%", background: ELECTRON_PAIR_COLOR }}
          />
        ) : null}
      </AnimatePresence>

      {/* Left / right molecule pills */}
      {(["left", "right"] as const).map((side) => {
        const data = side === "left" ? left : right;
        const x = side === "left" ? 25 : 75;
        const isDonor = side === donorSide;
        const color = ROLE_COLOR[data.role];

        return (
          <div
            key={side}
            className="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
            style={{ left: `${x}%` }}
          >
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 font-mono text-sm font-semibold sm:h-20 sm:w-20 sm:text-base"
              style={{ borderColor: color, color, background: `${color}14` }}
            >
              {data.formula}

              {/* Lone pair dots on the donor, before it has been transferred */}
              <AnimatePresence>
                {isDonor && lonePairVisible ? (
                  <motion.div
                    key="lone-pair"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, scale: lonePairHighlighted ? 1.3 : 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute -top-2 right-0 flex gap-0.5"
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: ELECTRON_PAIR_COLOR }} />
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: ELECTRON_PAIR_COLOR }} />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {showFinalTags ? (
                <motion.span
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-full px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide"
                  style={{ background: `${color}1f`, color }}
                >
                  {isDonor ? "Lewis Base" : "Lewis Acid"}
                </motion.span>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}

      {/* Electron-pair chip travelling from base to acid */}
      <AnimatePresence>
        {pairInFlight ? (
          <motion.div
            key="electron-pair"
            className={cn(
              "absolute top-1/2 flex h-8 min-w-8 -translate-x-1/2 items-center justify-center gap-0.5 rounded-full px-1.5 shadow"
            )}
            style={{ background: ELECTRON_PAIR_COLOR }}
            initial={{ left: `${donorX}%`, top: "20%", opacity: 0, scale: 0.6 }}
            animate={{
              left: `${pairAtAcceptor ? acceptorX : donorX}%`,
              top: "20%",
              opacity: 1,
              scale: [0.6, 1.15, 1],
            }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ left: { duration: 0.9, ease: "easeInOut" }, opacity: { duration: 0.25 }, scale: { duration: 0.4 } }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-paper" />
            <span className="h-1.5 w-1.5 rounded-full bg-paper" />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Donor / acceptor helper labels, shown while the pair is mid-flight */}
      {stepIndex === 1 || stepIndex === 2 ? (
        <p className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] text-ink-soft/70 dark:text-bone-soft/60">
          {donor.formula} donates electron pair &rarr; {acceptor.formula} accepts electron pair
        </p>
      ) : null}

      {/* Bond caption once formed */}
      {bondFormed ? (
        <p className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] text-ink-soft/70 dark:text-bone-soft/60">
          {reaction.bondCaption}
        </p>
      ) : null}
    </div>
  );
}
