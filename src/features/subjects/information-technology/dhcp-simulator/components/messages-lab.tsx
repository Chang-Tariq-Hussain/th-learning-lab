"use client";

import { useMemo } from "react";
import { Callout, SectionHeading } from "../../osi-model-explorer/components/ui";
import { DORA_KINDS, MESSAGE_INFO, buildMessage, initialState, makeXid, type DetailLevel } from "../model";
import { MessageInspector } from "./message-inspector";

/** The four DORA messages for one example exchange, without running anything. */
export function MessagesLab({ level }: { level: DetailLevel }) {
  const messages = useMemo(() => {
    const pool = initialState().pool;
    const xid = makeXid(1);
    return DORA_KINDS.map((kind) => buildMessage({ kind, clientId: "pc1", xid, ip: kind === "discover" ? null : "192.168.1.100", pool }));
  }, []);
  return (
    <div className="flex flex-col gap-5">
      <SectionHeading title="The four DORA messages">
        One example exchange for PC-01. Pick a message, then click a field. Use the level switch at the top to show more or fewer fields.
      </SectionHeading>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {DORA_KINDS.map((k) => (
          <div key={k} className="rounded-card border border-line bg-white/60 p-3 dark:border-line-dark dark:bg-white/[0.03]">
            <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">{MESSAGE_INFO[k].who}</p>
            <p className="mt-1 text-sm font-semibold text-ink dark:text-bone">{MESSAGE_INFO[k].label}</p>
          </div>
        ))}
      </div>
      <MessageInspector messages={messages} currentIndex={0} level={level} />
      <Callout tone="warn" title="DHCP Request ≠ ARP Request">
        A DHCP Request asks a DHCP server for an address and settings (UDP, port 67). An ARP request asks the LAN &quot;who has this IP address?&quot; to learn a MAC address. The names look alike; the jobs are different.
      </Callout>
    </div>
  );
}
