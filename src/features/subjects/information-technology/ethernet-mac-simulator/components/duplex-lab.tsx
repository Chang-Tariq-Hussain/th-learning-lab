"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Callout, Panel, SectionHeading } from "../../osi-model-explorer/components/ui";

type Mode = "shared" | "switched";

/** Brief, non-simulated look at historical shared Ethernet vs. modern switched full-duplex Ethernet. */
export function DuplexLab() {
  const [mode, setMode] = useState<Mode>("shared");
  const [fired, setFired] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading title="Collisions and full-duplex Ethernet">
        A short historical note: it explains why a switch changed how Ethernet behaves. This is not a CSMA/CD simulation.
      </SectionHeading>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Ethernet era">
        {(["shared", "switched"] as Mode[]).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            onClick={() => {
              setMode(m);
              setFired(false);
            }}
            className={cn(
              "min-h-[44px] rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              mode === m ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20" : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
            )}
          >
            {m === "shared" ? "Older shared Ethernet" : "Modern switched full-duplex"}
          </button>
        ))}
      </div>

      <Panel title={mode === "shared" ? "Shared medium (bus or hub)" : "Switched, full-duplex links"}>
        {mode === "shared" ? (
          <ul className="list-disc space-y-1 pl-5 text-sm text-ink-soft dark:text-bone-soft">
            <li>All devices share the same transmission medium — a signal sent by one is heard by all.</li>
            <li>Only one device can transmit at a time (half-duplex).</li>
            <li>If two devices transmit at the same moment, their signals collide and both frames are damaged.</li>
            <li>CSMA/CD (Carrier Sense Multiple Access with Collision Detection): listen first, transmit if quiet, detect a collision, stop, wait a random time, retry.</li>
          </ul>
        ) : (
          <ul className="list-disc space-y-1 pl-5 text-sm text-ink-soft dark:text-bone-soft">
            <li>Each device has its own cable to its own switch port.</li>
            <li>Full-duplex: a link has separate paths for sending and receiving, so both can happen at once.</li>
            <li>There is no shared wire for frames to collide on, so the traditional collision problem largely disappears and CSMA/CD is not used.</li>
            <li>The switch still has to manage load — if too much traffic is aimed at one port, frames can queue or be dropped — but that is congestion, not a collision.</li>
          </ul>
        )}
      </Panel>

      <div>
        <button
          onClick={() => setFired(true)}
          className="inline-flex h-11 items-center rounded-full bg-subject-it px-5 text-sm font-medium text-paper hover:opacity-90"
        >
          PC-A and PC-C transmit at the same moment
        </button>
      </div>

      {fired &&
        (mode === "shared" ? (
          <Callout tone="bad" title="Collision!">
            Both signals overlap on the shared medium, so both frames are corrupted. Each sender detects the collision, stops, waits a random back-off time, and tries again.
          </Callout>
        ) : (
          <Callout tone="good" title="No collision">
            PC-A and PC-C each use their own full-duplex link to the switch, so both frames arrive at the switch at the same time without interfering. The switch forwards each
            one according to its MAC table.
          </Callout>
        ))}

      <p className="text-xs text-ink-soft dark:text-bone-soft">
        Collisions can still occur on any half-duplex link (for example, from a duplex mismatch), but modern wired LANs are switched and full-duplex, so collisions are
        rare. Wireless networks use a different medium-access method.
      </p>
    </div>
  );
}
