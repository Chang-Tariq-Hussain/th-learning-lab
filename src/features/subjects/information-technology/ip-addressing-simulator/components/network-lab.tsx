"use client";

import { useState } from "react";
import { Callout, Panel, SectionHeading } from "../../osi-model-explorer/components/ui";
import { ROLE_EXPLANATION, ROLE_LABEL, addressRole, analyze, formatIPv4, levelPrefixMessage, parseIPv4, parseMask, prefixLimits, toOctets, type DetailLevel } from "../model";
import { BinaryAddress, BitLegend, Chip, TextField } from "./parts";

/** Sections 6-8 and 18: network address (AND), broadcast, usable range, address capacity. */
export function NetworkLab({ level }: { level: DetailLevel }) {
  const [ipText, setIpText] = useState("192.168.1.25");
  const [maskText, setMaskText] = useState("/24");
  const ip = parseIPv4(ipText);
  const mask = parseMask(maskText);
  const lim = prefixLimits(level);
  const outOfLevel = mask.ok && (mask.prefix < lim.min || mask.prefix > lim.max);
  const ready = ip.ok && mask.ok && !outOfLevel;
  const info = ready ? analyze(ip.value, mask.prefix) : null;
  const role = info ? addressRole(info) : null;

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading title="Find the network, broadcast, and host range">
        Enter an address and a mask (either /24 or 255.255.255.0). Nothing is hidden: each result is shown as a bitwise calculation you can check.
      </SectionHeading>
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField id="nw-ip" label="IPv4 address" value={ipText} onChange={setIpText} error={ip.ok ? null : ip.reason} />
        <TextField id="nw-mask" label="Subnet mask or /prefix" value={maskText} onChange={setMaskText} error={mask.ok ? (outOfLevel ? levelPrefixMessage(level) : null) : mask.reason} />
      </div>

      {info && ip.ok && mask.ok && (
        <>
          <Panel title="Step 1 · Network address = IP AND mask">
            <div className="flex flex-col gap-3">
              <BinaryAddress value={ip.value} prefix={mask.prefix} label="IP address" />
              <BinaryAddress value={info.mask} prefix={mask.prefix} label="AND  Mask" />
              <BinaryAddress value={info.network} prefix={mask.prefix} label="=  Network address (host bits forced to 0)" />
              <BitLegend />
              <div className="overflow-x-auto">
                <table className="w-full min-w-[420px] text-left font-mono text-xs">
                  <thead>
                    <tr className="text-ink-soft dark:text-bone-soft"><th className="py-1 pr-2">Octet</th><th className="pr-2">IP</th><th className="pr-2">AND mask</th><th>= Network</th></tr>
                  </thead>
                  <tbody className="text-ink dark:text-bone">
                    {[0, 1, 2, 3].map((i) => (
                      <tr key={i} className="border-t border-line dark:border-line-dark">
                        <td className="py-1 pr-2">{i + 1}</td>
                        <td className="pr-2">{toOctets(ip.value)[i]}</td>
                        <td className="pr-2">{toOctets(info.mask)[i]}</td>
                        <td>{toOctets(info.network)[i]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="font-mono text-sm text-ink dark:text-bone">
                {formatIPv4(ip.value)} AND {formatIPv4(info.mask)} = <strong>{formatIPv4(info.network)}</strong>
              </p>
            </div>
          </Panel>

          <Panel title="Step 2 · Broadcast address = network with all host bits set to 1">
            <div className="flex flex-col gap-3">
              <BinaryAddress value={info.broadcast} prefix={mask.prefix} label="Broadcast" />
              <p className="font-mono text-sm text-ink dark:text-bone">
                {formatIPv4(info.network)} OR {formatIPv4(info.wildcard)} = <strong>{formatIPv4(info.broadcast)}</strong>
                {level === "technical" && <span className="text-ink-soft dark:text-bone-soft"> (the second value, {formatIPv4(info.wildcard)}, is the wildcard: the mask with its bits flipped)</span>}
              </p>
              <p className="text-sm text-ink-soft dark:text-bone-soft">
                A broadcast address is used to send to every device on this network at once. Because it means &quot;everyone here&quot;, it is never given to a single device.
              </p>
            </div>
          </Panel>

          <Panel title="Step 3 · Usable host range">
            {info.kind === "ordinary" ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[420px] text-left text-sm">
                  <thead className="text-xs text-ink-soft dark:text-bone-soft"><tr><th className="py-1 pr-3">Role</th><th className="pr-3">Address</th><th>Meaning</th></tr></thead>
                  <tbody className="text-ink dark:text-bone">
                    <tr className="border-t border-line dark:border-line-dark"><td className="py-1.5 pr-3"><Chip tone="warn">■ Network</Chip></td><td className="pr-3 font-mono">{formatIPv4(info.network)}</td><td>Names the network. Not assignable.</td></tr>
                    <tr className="border-t border-line dark:border-line-dark"><td className="py-1.5 pr-3"><Chip tone="good">● First host</Chip></td><td className="pr-3 font-mono">{formatIPv4(info.firstHost)}</td><td>Lowest assignable address.</td></tr>
                    <tr className="border-t border-line dark:border-line-dark"><td className="py-1.5 pr-3"><Chip tone="good">● Last host</Chip></td><td className="pr-3 font-mono">{formatIPv4(info.lastHost)}</td><td>Highest assignable address.</td></tr>
                    <tr className="border-t border-line dark:border-line-dark"><td className="py-1.5 pr-3"><Chip tone="bad">▲ Broadcast</Chip></td><td className="pr-3 font-mono">{formatIPv4(info.broadcast)}</td><td>Means &quot;all devices here&quot;. Not assignable.</td></tr>
                  </tbody>
                </table>
              </div>
            ) : info.kind === "point-to-point" ? (
              <p className="text-sm text-ink-soft dark:text-bone-soft">A /31 has only 2 addresses and is used on point-to-point links; both addresses are usable and the network/broadcast rule above does not apply.</p>
            ) : (
              <p className="text-sm text-ink-soft dark:text-bone-soft">A /32 is a single address that identifies exactly one interface. There is no network/host range to list.</p>
            )}
            {role && (
              <p className="mt-3 rounded-card border border-line p-2 text-sm text-ink dark:border-line-dark dark:text-bone" aria-live="polite">
                <strong>{formatIPv4(ip.value)}</strong> is a <strong>{ROLE_LABEL[role]}</strong>. {ROLE_EXPLANATION[role]}
              </p>
            )}
          </Panel>

          <Panel title="Address capacity">
            <p className="font-mono text-sm text-ink dark:text-bone">IPv4 = 32 bits · Network bits = {info.networkBits} · Host bits H = 32 − {info.networkBits} = <strong>{info.hostBits}</strong></p>
            <p className="mt-1 font-mono text-sm text-ink dark:text-bone">Addresses = 2^H = 2^{info.hostBits} = <strong>{info.totalAddresses.toLocaleString()}</strong></p>
            <p className="mt-1 font-mono text-sm text-ink dark:text-bone">Ordinary usable hosts = 2^H − 2 = <strong>{info.kind === "ordinary" ? info.usableHosts.toLocaleString() : "special case"}</strong></p>
            <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">Why −2? The all-0s host value is the network address and the all-1s host value is the broadcast address. Exceptions exist: /31 (2 usable, point-to-point links) and /32 (a single host address). Adding one host bit doubles the addresses, so the pattern is worth understanding rather than memorizing.</p>
          </Panel>
        </>
      )}
      {level === "beginner" && <Callout title="Beginner mode">Special cases such as /31 and /32 behave differently and are not needed here. They appear in Technical mode.</Callout>}
    </div>
  );
}
