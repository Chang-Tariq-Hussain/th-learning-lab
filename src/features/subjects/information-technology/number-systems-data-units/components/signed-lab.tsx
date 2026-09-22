"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { fromTwosComplement, parseSignedDecimal, signedRange, toTwosComplement, wrapStep, type SignedWidth } from "../model";
import { BitRow, Callout, Panel, SectionHeading, TextField } from "./ui-bits";

export interface SignedLabPreset {
  value?: number;
  bits?: SignedWidth;
}

export function SignedLab({ preset }: { preset?: SignedLabPreset }) {
  const bits: SignedWidth = preset?.bits ?? 8;
  const { min, max } = signedRange(bits);

  return (
    <div className="flex flex-col gap-8">
      <SectionHeading title="Signed integers — two's complement">
        So far every value has been unsigned (zero or positive). Two&apos;s complement is how most computers represent negative numbers: the leftmost bit is the
        sign bit, worth a negative place value.
      </SectionHeading>
      <Callout>
        This is an advanced concept, kept intentionally small: how the sign bit and the negative place value work, not a full arithmetic/overflow emulator.
      </Callout>

      <Panel title={`${bits}-bit signed range`}>
        <p className="text-center font-mono text-lg text-ink dark:text-bone">
          {min.toString()} to +{max.toString()}
        </p>
      </Panel>

      <DecimalToTwos />
      <TwosToDecimal bits={bits} />
      <WrapDemo />
    </div>
  );
}

function DecimalToTwos() {
  const [input, setInput] = useState("-5");
  const parsed = parseSignedDecimal(input);
  const result = parsed.ok ? toTwosComplement(parsed.value, 8) : null;

  return (
    <Panel title="Decimal → 8-bit two's complement">
      <TextField id="signed-decimal-input" label="Signed decimal value" value={input} onChange={setInput} error={!parsed.ok ? parsed.error : result && !result.ok ? result.error : null} placeholder="-5" />
      {result?.ok && (
        <div className="mt-4">
          <BitRow bits={result.pattern.split("")} places={["-128", "64", "32", "16", "8", "4", "2", "1"]} />
          <div className="mt-3 flex flex-col gap-1 text-sm text-ink-soft dark:text-bone-soft">
            {result.steps.map((s, i) => (
              <p key={i}>{s}</p>
            ))}
          </div>
        </div>
      )}
    </Panel>
  );
}

function TwosToDecimal({ bits }: { bits: SignedWidth }) {
  const [pattern, setPattern] = useState<string[]>(() => "11111011".slice(0, bits).padStart(bits, "1").split(""));
  const value = fromTwosComplement(pattern.join(""));
  const toggle = (i: number) => setPattern((prev) => prev.map((b, idx) => (idx === i ? (b === "1" ? "0" : "1") : b)));
  const signBitPlace = -(2 ** (bits - 1));

  return (
    <Panel title="Toggle bits → signed decimal">
      <BitRow bits={pattern} onToggle={toggle} places={[String(signBitPlace), ...Array.from({ length: bits - 1 }, (_, i) => String(2 ** (bits - 2 - i)))]} />
      <div className="mt-4 rounded-card bg-ink/[0.03] p-3 text-center dark:bg-bone/[0.05]" aria-live="polite">
        <p className="font-mono text-xs text-ink-soft dark:text-bone-soft">
          {pattern[0] === "1" ? "Sign bit is 1 → negative" : "Sign bit is 0 → positive or zero"}
        </p>
        <p className="mt-1 font-display text-2xl font-semibold text-subject-it">{value.toString()}₁₀</p>
      </div>
    </Panel>
  );
}

function WrapDemo() {
  const [pattern, setPattern] = useState("01111111"); // max positive 8-bit
  const value = fromTwosComplement(pattern);

  const step = (delta: 1 | -1) => setPattern((p) => wrapStep(p, delta));

  return (
    <Panel title="Why the range has edges">
      <p className="text-sm text-ink-soft dark:text-bone-soft">
        Add 1 past the top of the range, or subtract 1 past the bottom, and the pattern wraps to the opposite end — the same way an odometer rolls over.
      </p>
      <div className="mt-4 flex flex-col items-center gap-3">
        <BitRow bits={pattern.split("")} />
        <p className="font-display text-xl font-semibold text-subject-it">{value}₁₀</p>
        <div className="flex gap-2">
          <button onClick={() => step(-1)} className={cn("rounded-full border border-line px-4 py-2 text-sm font-medium hover:border-ink/30 dark:border-line-dark dark:hover:border-bone/30")}>
            −1
          </button>
          <button onClick={() => step(1)} className={cn("rounded-full border border-line px-4 py-2 text-sm font-medium hover:border-ink/30 dark:border-line-dark dark:hover:border-bone/30")}>
            +1
          </button>
        </div>
      </div>
    </Panel>
  );
}
