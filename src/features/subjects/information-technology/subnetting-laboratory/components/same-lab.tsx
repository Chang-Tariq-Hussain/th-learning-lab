"use client";

import { useState } from "react";
import { Callout, PillButton, SectionHeading } from "../../osi-model-explorer/components/ui";
import { parseIPv4 } from "../../ip-addressing-simulator/model";
import { TextField } from "../../ip-addressing-simulator/components/parts";
import { COMPARE_PRESETS, compareSubnets } from "../model";
import { CompareCard } from "./compare-card";

const PREFIXES = [24, 25, 26, 27, 28, 29, 30];

/** Section 16: same subnet or different subnet? Predict, then see the calculation that proves it. */
export function SameLab({ initialPresetId }: { initialPresetId?: string }) {
  const preset = COMPARE_PRESETS.find((p) => p.id === initialPresetId) ?? COMPARE_PRESETS[0]!;
  const [a, setA] = useState(preset.a);
  const [b, setB] = useState(preset.b);
  const [prefix, setPrefix] = useState(preset.prefix);
  const [guess, setGuess] = useState<"yes" | "no" | null>(null);
  const [revealed, setRevealed] = useState(false);

  const pa = parseIPv4(a);
  const pb = parseIPv4(b);
  const ready = pa.ok && pb.ok;
  const same = ready ? compareSubnets(pa.value, pb.value, prefix).same : null;

  function reset() {
    setGuess(null);
    setRevealed(false);
  }
  function load(id: string) {
    const p = COMPARE_PRESETS.find((x) => x.id === id)!;
    setA(p.a);
    setB(p.b);
    setPrefix(p.prefix);
    reset();
  }

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading title="Same subnet or different subnet?">Two devices share a subnet when their addresses give the same network address under the subnet mask. Predict first, then check the calculation.</SectionHeading>
      <div className="flex flex-wrap gap-2">
        {COMPARE_PRESETS.map((p) => (
          <PillButton key={p.id} onClick={() => load(p.id)}>
            {p.label}
          </PillButton>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField id="sl-a" label="Device A address" value={a} onChange={(v) => { setA(v); reset(); }} error={pa.ok ? null : pa.reason} />
        <TextField id="sl-b" label="Device B address" value={b} onChange={(v) => { setB(v); reset(); }} error={pb.ok ? null : pb.reason} />
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Prefix (both devices)</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Prefix">
          {PREFIXES.map((p) => (
            <PillButton key={p} active={prefix === p} onClick={() => { setPrefix(p); reset(); }}>
              /{p}
            </PillButton>
          ))}
        </div>
      </div>

      {ready && (
        <>
          <CompareCard nameA="Device A" nameB="Device B" ipA={pa.value} ipB={pb.value} prefix={prefix} reveal={revealed} />
          {!revealed && (
            <div className="rounded-card border border-line p-3 dark:border-line-dark">
              <p className="text-sm font-medium text-ink dark:text-bone">Are these devices on the same subnet?</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <PillButton active={guess === "yes"} onClick={() => setGuess("yes")}>Yes, same subnet</PillButton>
                <PillButton active={guess === "no"} onClick={() => setGuess("no")}>No, different subnets</PillButton>
                <button type="button" disabled={!guess} onClick={() => setRevealed(true)} className="min-h-[44px] rounded-full border border-subject-it bg-subject-it px-4 text-xs font-medium text-paper disabled:opacity-40">
                  Show the calculation
                </button>
              </div>
            </div>
          )}
          {revealed && guess && same !== null && (
            <Callout tone={(guess === "yes") === same ? "good" : "warn"} title={(guess === "yes") === same ? "Your prediction was correct" : "Your prediction was different"}>
              {(guess === "yes") === same ? "The network addresses agree with your prediction." : "Compare the two network addresses above, then try another pair."}
            </Callout>
          )}
        </>
      )}
      <Callout title="Close numbers are not the same subnet">
        With /26, .62 and .65 are only three apart but sit on opposite sides of the boundary at .64. Always let the mask decide, not how similar the addresses look.
      </Callout>
    </div>
  );
}
