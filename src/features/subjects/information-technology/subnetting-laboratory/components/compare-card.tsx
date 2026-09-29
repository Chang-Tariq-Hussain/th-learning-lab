"use client";

import { Callout } from "../../osi-model-explorer/components/ui";
import { formatIPv4, ipBinary } from "../../ip-addressing-simulator/model";
import { Chip } from "../../ip-addressing-simulator/components/parts";
import { compareSubnets, pow2 } from "../model";
import { SplitBits } from "./split-bits";

function dotted(bits: string): string {
  return bits.match(/.{1,8}/g)?.join(".") ?? "";
}

function prefixBits(ip: number, prefix: number): string {
  return dotted(ipBinary(ip).replace(/\./g, "").slice(0, prefix));
}

/** Sections 15-16: two devices, their addresses, and the calculation that proves same vs. different subnet. */
export function CompareCard({ nameA, nameB, ipA, ipB, prefix, reveal = true }: { nameA: string; nameB: string; ipA: number; ipB: number; prefix: number; reveal?: boolean }) {
  const c = compareSubnets(ipA, ipB, prefix);
  const netBitsA = prefixBits(ipA, prefix);
  const netBitsB = prefixBits(ipB, prefix);
  const hostBits = 32 - prefix;

  return (
    <div className="flex flex-col gap-3 rounded-card border border-line p-3 dark:border-line-dark" aria-live="polite">
      <div className="grid gap-3 sm:grid-cols-2">
        <Device name={nameA} ip={ipA} prefix={prefix} />
        <Device name={nameB} ip={ipB} prefix={prefix} />
      </div>
      {reveal && (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <Chip tone={c.same ? "good" : "bad"}>{c.same ? "✓ Same subnet" : "✕ Different subnets"}</Chip>
            {c.numberA !== null && c.numberB !== null && (
              <span className="text-xs text-ink-soft dark:text-bone-soft">
                {c.same ? `Both in subnet ${c.numberA} of their /24` : `Subnet ${c.numberA} and subnet ${c.numberB} of the same /24`}
              </span>
            )}
          </div>
          <div className="grid gap-1 font-mono text-sm text-ink dark:text-bone">
            <p className="break-words">{nameA}: {formatIPv4(ipA)} AND {formatIPv4(c.a.mask)} = <strong>{formatIPv4(c.a.network)}</strong></p>
            <p className="break-words">{nameB}: {formatIPv4(ipB)} AND {formatIPv4(c.b.mask)} = <strong>{formatIPv4(c.b.network)}</strong></p>
            <p>{formatIPv4(c.a.network)} {c.same ? "=" : "≠"} {formatIPv4(c.b.network)} → {c.same ? "same subnet" : "different subnets"}</p>
          </div>
          <SplitBits orig={prefix} next={prefix} value={ipA} label={`${nameA} in binary`} showDecimal={false} />
          <SplitBits orig={prefix} next={prefix} value={ipB} label={`${nameB} in binary`} showDecimal={false} />
          <p className="text-sm text-ink-soft dark:text-bone-soft">
            The first {prefix} bits are the network portion. {nameA}: <span className="break-all font-mono text-ink dark:text-bone">{netBitsA}</span>; {nameB}: <span className="break-all font-mono text-ink dark:text-bone">{netBitsB}</span>. {c.same ? "They match exactly, so both devices sit in the same block." : "They differ, so the devices sit in different blocks."} Each /{prefix} block holds {pow2(hostBits)} = {(2 ** hostBits).toLocaleString()} addresses.
          </p>
          {(c.issueA || c.issueB) && (
            <Callout tone="warn" title="Address problem">
              {c.issueA && <span className="block">{nameA}: {c.issueA}</span>}
              {c.issueB && <span className="block">{nameB}: {c.issueB}</span>}
            </Callout>
          )}
        </>
      )}
    </div>
  );
}

function Device({ name, ip, prefix }: { name: string; ip: number; prefix: number }) {
  return (
    <div className="rounded-card border border-line p-2.5 dark:border-line-dark">
      <p className="text-xs text-ink-soft dark:text-bone-soft">{name}</p>
      <p className="break-all font-mono text-base text-ink dark:text-bone">{formatIPv4(ip)}/{prefix}</p>
    </div>
  );
}
