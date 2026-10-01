"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { Callout } from "../../osi-model-explorer/components/ui";
import { DHCP_CHALLENGE_SETUPS, type DhcpChallengeId } from "../challenges";
import { useDhcpLab, type DhcpLab } from "../hooks/use-dhcp-lab";
import { CLIENT_META, activeLeaseOf } from "../model";
import { AddressMap, PoolEditor } from "./pool-lab";
import { ActionButton } from "./parts";
import { RunPanel } from "./run-panel";

export interface DhcpChallengeLabHandle {
  /** Inspects the student's real server configuration, lease table and clients. */
  check: () => boolean;
}

function LeaseActions({ lab }: { lab: DhcpLab }) {
  const id = lab.selectedId;
  const lease = activeLeaseOf(lab.saved, id);
  const can = !!lease && lease.status === "leased" && !(lab.run && !lab.player.isFinished);
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-card border border-line p-3 dark:border-line-dark">
      <span className="text-sm text-ink dark:text-bone">{CLIENT_META[id].name} (selected):</span>
      <ActionButton tone="good" disabled={!can} onClick={() => lab.startRenew(id, "auto")}>
        Renew lease
      </ActionButton>
      <ActionButton tone="warn" disabled={!can} onClick={() => lab.startRelease(id, "auto")}>
        Release lease
      </ActionButton>
    </div>
  );
}

/**
 * A self-contained lab for the interactive Challenge scenarios: it starts from the scenario's own broken state, lets the
 * student change the server and run DHCP, and grades what actually happened.
 */
export const DhcpChallengeLab = forwardRef<DhcpChallengeLabHandle, { challengeId: DhcpChallengeId }>(function DhcpChallengeLab({ challengeId }, ref) {
  const setup = DHCP_CHALLENGE_SETUPS[challengeId];
  const lab = useDhcpLab(setup.start);
  const stateRef = useRef({ saved: lab.saved, lastCompleted: lab.lastCompleted });
  stateRef.current = { saved: lab.saved, lastCompleted: lab.lastCompleted };
  useImperativeHandle(ref, () => ({ check: () => setup.check(stateRef.current) }), [setup]);

  return (
    <div className="flex flex-col gap-4 rounded-card border border-line bg-paper p-3 dark:border-line-dark dark:bg-chalkboard sm:p-5">
      <Callout title="Your task">
        {setup.instructions}
        <span className="mt-1 block">{setup.focus}</span>
      </Callout>
      {setup.tools === "pool" ? (
        <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
          <PoolEditor lab={lab} />
          <AddressMap state={lab.state} />
        </div>
      ) : (
        <>
          <RunPanel lab={lab} level="beginner" />
          <LeaseActions lab={lab} />
          <PoolEditor lab={lab} />
        </>
      )}
      <div>
        <button type="button" onClick={() => lab.load(setup.start())} className="min-h-[44px] rounded-full border border-line px-4 text-xs dark:border-line-dark">
          Restart this challenge
        </button>
      </div>
    </div>
  );
});
