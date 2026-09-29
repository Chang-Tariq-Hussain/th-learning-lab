"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { Callout } from "../../osi-model-explorer/components/ui";
import { ARP_CHALLENGE_SETUPS, type ArpChallengeId } from "../challenges";
import { useArpLab } from "../hooks/use-arp-lab";
import { RunPanel } from "./run-panel";

export interface ArpChallengeLabHandle {
  /** Inspects the student's real ARP caches and last completed run. */
  check: () => boolean;
}

/**
 * A self-contained lab for the interactive Challenge scenarios: it starts from the scenario's own
 * cache state, lets the student send data and edit caches, and grades what actually happened.
 */
export const ArpChallengeLab = forwardRef<ArpChallengeLabHandle, { challengeId: ArpChallengeId }>(function ArpChallengeLab({ challengeId }, ref) {
  const setup = ARP_CHALLENGE_SETUPS[challengeId];
  const lab = useArpLab(setup.start);
  const stateRef = useRef({ saved: lab.savedCaches, lastCompleted: lab.lastCompleted });
  stateRef.current = { saved: lab.savedCaches, lastCompleted: lab.lastCompleted };
  useImperativeHandle(ref, () => ({ check: () => setup.check(stateRef.current) }), [setup]);

  return (
    <div className="flex flex-col gap-4 rounded-card border border-line bg-paper p-3 dark:border-line-dark dark:bg-chalkboard sm:p-5">
      <Callout title="Your task">
        {setup.instructions}
        <span className="mt-1 block">{setup.focus}</span>
      </Callout>
      <RunPanel lab={lab} level="beginner" scenarios={["custom"]} hidePicker allowRemove />
      <div>
        <button
          type="button"
          onClick={() => {
            lab.resetToInit(setup.start());
          }}
          className="min-h-[44px] rounded-full border border-line px-4 text-xs dark:border-line-dark"
        >
          Restart this challenge
        </button>
      </div>
    </div>
  );
});
