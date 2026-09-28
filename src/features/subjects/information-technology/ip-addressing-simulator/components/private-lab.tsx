"use client";

import { useState } from "react";
import { Callout, PillButton, SectionHeading } from "../../osi-model-explorer/components/ui";
import { PRIVATE_RANGES, SPECIAL_ADDRESSES, classifyIPv4, parseIPv4 } from "../model";
import { Advanced, Chip, TextField } from "./parts";

const TRY = ["10.20.30.40", "172.16.5.9", "172.32.0.1", "192.168.0.15", "8.8.8.8", "127.0.0.1", "169.254.4.4"];

/** Sections 14-16: private vs. public, special addresses (Advanced), and a note that classful addressing is historical. */
export function PrivateLab() {
  const [text, setText] = useState("172.20.1.5");
  const parsed = parseIPv4(text);
  const cls = parsed.ok ? classifyIPv4(parsed.value) : null;
  const tone = cls?.scope === "Private" ? "info" : cls?.scope === "Public" ? "good" : "warn";

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading title="Public and private IPv4 addresses">
        Not every IPv4 address is public. Three ranges are reserved for private networks: many organizations and homes reuse them internally. Public addresses are globally unique and routable on the internet. This is conceptual: NAT is not covered here.
      </SectionHeading>

      <div className="overflow-x-auto rounded-card border border-line dark:border-line-dark" tabIndex={0} aria-label="Private IPv4 ranges table">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="bg-ink/[0.03] text-xs text-ink-soft dark:bg-bone/[0.05] dark:text-bone-soft"><tr><th className="p-2">Private range</th><th className="p-2">Covers</th><th className="p-2">Note</th></tr></thead>
          <tbody className="text-ink dark:text-bone">
            {PRIVATE_RANGES.map((r) => (
              <tr key={r.cidr} className="border-t border-line dark:border-line-dark">
                <td className="p-2 font-mono">{r.cidr}</td>
                <td className="p-2 font-mono text-xs">{r.cidr === "10.0.0.0/8" ? "10.0.0.0 – 10.255.255.255" : r.cidr === "172.16.0.0/12" ? "172.16.0.0 – 172.31.255.255" : "192.168.0.0 – 192.168.255.255"}</td>
                <td className="p-2 text-xs">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 rounded-card border border-line p-3 dark:border-line-dark">
        <TextField id="pv-ip" label="Test an address" value={text} onChange={setText} error={parsed.ok ? null : parsed.reason} className="max-w-xs" />
        <div className="flex flex-wrap gap-2">{TRY.map((t) => <PillButton key={t} active={t === text} onClick={() => setText(t)}>{t}</PillButton>)}</div>
        {cls && (
          <div aria-live="polite" className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2"><Chip tone={tone}>{cls.scope}</Chip><Chip>{cls.label}</Chip>{cls.range && <Chip>{cls.range}</Chip>}</div>
            <p className="text-sm text-ink-soft dark:text-bone-soft">{cls.explanation}</p>
          </div>
        )}
      </div>

      <Callout title="Private does not mean secure, and public does not mean reachable">
        &quot;Private&quot; only means the address is reserved for use inside networks and is not routed on the public internet. It says nothing about security. Whether a public address is reachable also depends on routing and firewalls.
      </Callout>

      <Advanced title="Special IPv4 addresses">
        {SPECIAL_ADDRESSES.map((s) => (
          <div key={s.address} className="rounded-card border border-line p-2 dark:border-line-dark">
            <p className="font-mono text-sm text-ink dark:text-bone">{s.address} <span className="font-sans text-xs text-subject-it">· {s.name}</span></p>
            <p className="mt-1 text-xs">{s.meaning}</p>
          </div>
        ))}
      </Advanced>

      <Advanced title="Historical note: Class A, B and C">
        <p><strong>Historical.</strong> Early IPv4 fixed the network/host split by the first bits of the address (Class A, B, C). That scheme was replaced in the 1990s by <strong>CIDR</strong>, which uses a prefix length such as /24 and lets networks be any size. Modern addressing uses prefix length, which is why this lab always shows /prefix and never treats a class as the mask.</p>
      </Advanced>
    </div>
  );
}
