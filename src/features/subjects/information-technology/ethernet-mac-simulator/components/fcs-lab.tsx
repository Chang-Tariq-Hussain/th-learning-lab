"use client";

import { useMemo, useState } from "react";
import { Callout, Panel, SectionHeading } from "../../osi-model-explorer/components/ui";
import type { EthernetLab } from "../hooks/use-ethernet-lab";
import { DEFAULT_ETHER_TYPE, buildFrame, computeFcs, corruptPayload } from "../model";

function hexBytes(text: string): string {
  return Array.from(new TextEncoder().encode(text))
    .map((b) => b.toString(16).toUpperCase().padStart(2, "0"))
    .join(" ");
}

/** FCS demo: the sender computes a check value, noise may damage the frame, the receiver recomputes and compares. */
export function FcsLab({ lab }: { lab: EthernetLab }) {
  const [payload, setPayload] = useState("Hello");
  const [damaged, setDamaged] = useState(false);
  const a = lab.devices.find((d) => d.id === "a")!;
  const b = lab.devices.find((d) => d.id === "b")!;
  const text = payload === "" ? "Hello" : payload;

  const sent = useMemo(() => buildFrame("fcs-demo", b.mac, a.mac, DEFAULT_ETHER_TYPE, text), [a.mac, b.mac, text]);
  const receivedPayload = damaged ? corruptPayload(text) : text;
  const recomputed = computeFcs(sent.dst, sent.src, sent.etherType, receivedPayload);
  const ok = recomputed === sent.fcs;

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading title="Frame Check Sequence (FCS)">
        The FCS helps detect certain errors in a received Ethernet frame. The sender calculates it from the frame&apos;s contents; the receiver calculates it again and
        compares.
      </SectionHeading>

      <Panel title="Sender">
        <label className="flex flex-col gap-1 text-xs font-medium text-ink dark:text-bone">
          Payload
          <input
            className="h-11 w-full rounded-xl border border-line bg-paper px-3 text-sm text-ink dark:border-line-dark dark:bg-chalkboard dark:text-bone"
            value={payload}
            maxLength={40}
            onChange={(e) => setPayload(e.target.value)}
          />
        </label>
        <p className="mt-3 text-xs text-ink-soft dark:text-bone-soft">Calculated over: destination MAC, source MAC, EtherType, payload</p>
        <p className="mt-1 font-mono text-sm text-ink dark:text-bone">
          FCS = <span className="font-semibold">0x{sent.fcs}</span>
        </p>
      </Panel>

      <label className="flex min-h-[44px] items-center gap-2 text-sm text-ink dark:text-bone">
        <input type="checkbox" checked={damaged} onChange={(e) => setDamaged(e.target.checked)} className="h-4 w-4" />
        Flip one bit in transit (electrical noise)
      </label>

      <Panel title="Receiver">
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-xs">
          <dt className="font-medium text-ink dark:text-bone">Payload bytes sent</dt>
          <dd className="break-all font-mono text-ink-soft dark:text-bone-soft">{hexBytes(text)}</dd>
          <dt className="font-medium text-ink dark:text-bone">Payload bytes received</dt>
          <dd className="break-all font-mono text-ink-soft dark:text-bone-soft">{hexBytes(receivedPayload)}</dd>
          <dt className="font-medium text-ink dark:text-bone">FCS in frame</dt>
          <dd className="font-mono text-ink-soft dark:text-bone-soft">0x{sent.fcs}</dd>
          <dt className="font-medium text-ink dark:text-bone">FCS recalculated</dt>
          <dd className="font-mono text-ink-soft dark:text-bone-soft">0x{recomputed}</dd>
        </dl>
      </Panel>

      {ok ? (
        <Callout tone="good" title="FCS matches — the frame is accepted">
          The recalculated value equals the FCS in the frame, so the receiver treats the frame as undamaged and passes the payload up.
        </Callout>
      ) : (
        <Callout tone="bad" title="FCS mismatch — the frame is discarded">
          The values differ, so the frame was damaged somewhere along the way. Ethernet does not repair it or ask for a resend; it simply drops the frame, and any recovery is
          left to higher layers.
        </Callout>
      )}

      <Callout tone="neutral" title="Keep in mind">
        The FCS is a 32-bit CRC. It detects many accidental errors but cannot correct them, it can (rarely) miss some, and it is not a security feature — anyone can
        recalculate a valid FCS for a modified frame. This lab computes a real CRC-32 over the simplified frame fields; the real wire format has a few extra details.
      </Callout>
    </div>
  );
}
