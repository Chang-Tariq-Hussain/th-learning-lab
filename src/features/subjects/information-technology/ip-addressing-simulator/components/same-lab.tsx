"use client";

import { useState } from "react";
import { Callout, PillButton, SectionHeading } from "../../osi-model-explorer/components/ui";
import { SAME_NETWORK_PRESETS, compareNetworks, formatIPv4, parseIPv4, parseMask } from "../model";
import { BinaryAddress, Chip, TextField } from "./parts";

/** Section 9: same network or different network? Predict first, then reveal the reasoning. */
export function SameLab() {
  const [aIp, setAIp] = useState("192.168.1.10");
  const [aMask, setAMask] = useState("/24");
  const [bIp, setBIp] = useState("192.168.1.20");
  const [bMask, setBMask] = useState("/24");
  const [guess, setGuess] = useState<"yes" | "no" | null>(null);
  const [revealed, setRevealed] = useState(false);

  const a = parseIPv4(aIp);
  const b = parseIPv4(bIp);
  const ma = parseMask(aMask);
  const mb = parseMask(bMask);
  const ready = a.ok && b.ok && ma.ok && mb.ok;
  const cmp = ready ? compareNetworks(a.value, ma.prefix, b.value, mb.prefix) : null;

  const reset = () => {
    setGuess(null);
    setRevealed(false);
  };
  const load = (id: string) => {
    const p = SAME_NETWORK_PRESETS.find((x) => x.id === id)!;
    setAIp(p.aIp); setAMask(p.aMask); setBIp(p.bIp); setBMask(p.bMask);
    reset();
  };

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading title="Same network or different network?">Two hosts are on the same IP network when their network addresses are equal. Pick or type two hosts, commit to a prediction, then see the calculation.</SectionHeading>
      <div className="flex flex-wrap gap-2">
        {SAME_NETWORK_PRESETS.map((p) => (
          <PillButton key={p.id} onClick={() => load(p.id)}>{p.label}</PillButton>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid grid-cols-2 gap-2 rounded-card border border-line p-3 dark:border-line-dark">
          <p className="col-span-2 font-mono text-xs font-semibold text-ink dark:text-bone">PC A</p>
          <TextField id="sm-a-ip" label="IP address" value={aIp} onChange={(v) => { setAIp(v); reset(); }} error={a.ok ? null : a.reason} className="col-span-2 sm:col-span-1" />
          <TextField id="sm-a-mask" label="Mask / prefix" value={aMask} onChange={(v) => { setAMask(v); reset(); }} error={ma.ok ? null : ma.reason} className="col-span-2 sm:col-span-1" />
        </div>
        <div className="grid grid-cols-2 gap-2 rounded-card border border-line p-3 dark:border-line-dark">
          <p className="col-span-2 font-mono text-xs font-semibold text-ink dark:text-bone">PC B</p>
          <TextField id="sm-b-ip" label="IP address" value={bIp} onChange={(v) => { setBIp(v); reset(); }} error={b.ok ? null : b.reason} className="col-span-2 sm:col-span-1" />
          <TextField id="sm-b-mask" label="Mask / prefix" value={bMask} onChange={(v) => { setBMask(v); reset(); }} error={mb.ok ? null : mb.reason} className="col-span-2 sm:col-span-1" />
        </div>
      </div>

      {cmp && a.ok && b.ok && ma.ok && mb.ok && (
        <>
          <div className="rounded-card border border-line p-3 dark:border-line-dark">
            <p className="text-sm font-medium text-ink dark:text-bone">Are these devices on the same IP network?</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <PillButton active={guess === "yes"} onClick={() => setGuess("yes")}>Yes, same network</PillButton>
              <PillButton active={guess === "no"} onClick={() => setGuess("no")}>No, different networks</PillButton>
              <button type="button" disabled={!guess} onClick={() => setRevealed(true)} className="min-h-[36px] rounded-full border border-subject-it bg-subject-it px-4 py-1.5 text-xs font-medium text-paper disabled:opacity-40">Show the reasoning</button>
            </div>
          </div>

          {revealed && (
            <div className="flex flex-col gap-3 rounded-card border border-line p-3 dark:border-line-dark" aria-live="polite">
              <p className="font-mono text-xs uppercase text-ink-soft dark:text-bone-soft">Reasoning</p>
              <div className="grid gap-1 font-mono text-sm text-ink dark:text-bone">
                <p>Network A = {formatIPv4(a.value)} AND {formatIPv4(cmp.a.mask)} = <strong>{formatIPv4(cmp.a.network)}</strong></p>
                <p>Network B = {formatIPv4(b.value)} AND {formatIPv4(cmp.b.mask)} = <strong>{formatIPv4(cmp.b.network)}</strong></p>
              </div>
              <BinaryAddress value={cmp.a.network} prefix={ma.prefix} label="Network A in binary" />
              <BinaryAddress value={cmp.b.network} prefix={mb.prefix} label="Network B in binary" />
              <div className="flex flex-wrap items-center gap-2">
                <Chip tone={cmp.same ? "good" : "bad"}>{cmp.same ? "✓ Same network" : "✕ Different networks"}</Chip>
                {guess && <Chip tone={(guess === "yes") === cmp.same ? "good" : "warn"}>{(guess === "yes") === cmp.same ? "Your prediction was correct" : "Your prediction was different"}</Chip>}
              </div>
              <p className="text-sm text-ink-soft dark:text-bone-soft">
                {cmp.same
                  ? "The network addresses are equal, so the addresses are in the same IP network and can communicate directly without a router."
                  : "The network addresses differ, so they are in different IP networks. Traffic between them needs a router."}
              </p>
              {cmp.masksDiffer && (
                <Callout tone="warn" title="The two masks are different">
                  A uses /{ma.prefix} and B uses /{mb.prefix}, so each host may reach a different conclusion: A thinks B is {cmp.sameFromA ? "local" : "remote"}, and B thinks A is {cmp.sameFromB ? "local" : "remote"}. Mismatched masks cause confusing, one-sided problems.
                </Callout>
              )}
            </div>
          )}
        </>
      )}
      <Callout title="Don't compare by eye">
        192.168.1.10 and 192.168.2.20 look similar, yet they are different networks under /24 and the same network under /16. Always let the mask decide.
      </Callout>
    </div>
  );
}
