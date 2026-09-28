"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { Callout } from "../../osi-model-explorer/components/ui";
import { IP_CHALLENGE_SETUPS, type IpChallengeId } from "../challenges";
import { useIpLab } from "../hooks/use-ip-lab";
import { ConfigLab } from "./config-lab";

export interface IpChallengeLabHandle {
  /** Inspects the student's real configuration. */
  check: () => boolean;
}

/**
 * A self-contained lab for the interactive Challenge scenarios: it starts from the
 * scenario's broken state, lets the student edit real addresses, and grades what they built.
 */
export const IpChallengeLab = forwardRef<IpChallengeLabHandle, { challengeId: IpChallengeId }>(function IpChallengeLab({ challengeId }, ref) {
  const setup = IP_CHALLENGE_SETUPS[challengeId];
  const lab = useIpLab(setup.start);
  const hostsRef = useRef(lab.hosts);
  hostsRef.current = lab.hosts;
  useImperativeHandle(ref, () => ({ check: () => setup.check(hostsRef.current) }), [setup]);

  return (
    <div className="flex flex-col gap-4 rounded-card border border-line bg-paper p-3 dark:border-line-dark dark:bg-chalkboard sm:p-5">
      <Callout title="Your task">
        {setup.instructions}
        <span className="mt-1 block">{setup.focus}</span>
      </Callout>
      <ConfigLab lab={lab} level="beginner" />
      <div>
        <button type="button" onClick={lab.resetAll} className="min-h-[44px] rounded-full border border-line px-4 text-xs dark:border-line-dark">Restart this challenge</button>
      </div>
    </div>
  );
});
