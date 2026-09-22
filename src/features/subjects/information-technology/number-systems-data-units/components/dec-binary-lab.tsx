"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, StepForward } from "lucide-react";
import { cn } from "@/lib/utils";
import { bitsArrayToDecimal, divisionResult, divisionSteps, formatBig, placeValueBreakdown, type DivisionStep } from "../model";
import { Btn, BitRow, Panel, SectionHeading, SegmentedChoice, TextField } from "./ui-bits";

export interface DecBinaryLabPreset {
  sub?: "toBinary" | "toDecimal";
  decimal?: number;
  bits?: string;
}

const MAX_DECIMAL = 1023;

export function DecBinaryLab({ preset }: { preset?: DecBinaryLabPreset }) {
  const [sub, setSub] = useState<"toBinary" | "toDecimal">(preset?.sub ?? "toBinary");

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading title="Decimal ↔ Binary">
        Two directions, two techniques: repeated division turns decimal into binary one remainder at a time, and each bit&apos;s place value turns binary back
        into decimal.
      </SectionHeading>
      <SegmentedChoice
        label="Direction"
        value={sub}
        onChange={setSub}
        options={[
          { id: "toBinary", label: "Decimal → Binary" },
          { id: "toDecimal", label: "Binary → Decimal" },
        ]}
      />
      {sub === "toBinary" ? <DecimalToBinary initial={preset?.decimal} /> : <BinaryToDecimal initialBits={preset?.bits} />}
    </div>
  );
}

function DecimalToBinary({ initial }: { initial?: number }) {
  const [input, setInput] = useState(String(initial ?? 13));
  const [committed, setCommitted] = useState(Math.min(Math.max(initial ?? 13, 0), MAX_DECIMAL));
  const [steps, setSteps] = useState<DivisionStep[]>(() => divisionSteps(committed, 2));
  const [shown, setShown] = useState(0); // how many steps are revealed
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const commit = (raw: string) => {
    const n = Number.parseInt(raw, 10);
    const clamped = Number.isFinite(n) ? Math.min(Math.max(n, 0), MAX_DECIMAL) : 0;
    setCommitted(clamped);
    setSteps(divisionSteps(clamped, 2));
    setShown(0);
    setPlaying(false);
  };

  useEffect(() => {
    if (!playing) return;
    timer.current = setInterval(() => {
      setShown((s) => {
        if (s >= steps.length) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 800);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing, steps.length]);

  useEffect(() => {
    if (shown >= steps.length && timer.current) {
      clearInterval(timer.current);
    }
  }, [shown, steps.length]);

  const done = shown >= steps.length;
  const revealed = steps.slice(0, shown);

  return (
    <div className="flex flex-col gap-5">
      <TextField
        id="decimal-to-binary-input"
        label={`Type a decimal number to convert (0–${MAX_DECIMAL})`}
        value={input}
        onChange={setInput}
        onSubmit={() => commit(input)}
        error={null}
      />
      <div className="flex flex-wrap gap-2">
        <Btn variant="solid" onClick={() => commit(input)}>
          Convert
        </Btn>
      </div>

      <Panel title={`Repeated division by 2 — converting ${committed}`}>
        <div className="flex flex-wrap gap-2">
          <Btn onClick={() => setShown((s) => Math.min(s + 1, steps.length))} disabled={done}>
            <StepForward className="h-3.5 w-3.5" strokeWidth={1.75} /> Step
          </Btn>
          <Btn onClick={() => setPlaying((p) => !p)} disabled={done && !playing}>
            {playing ? (
              <>
                <Pause className="h-3.5 w-3.5" strokeWidth={1.75} /> Pause
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" strokeWidth={1.75} /> Play
              </>
            )}
          </Btn>
          <Btn
            onClick={() => {
              setShown(0);
              setPlaying(false);
            }}
          >
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} /> Reset
          </Btn>
        </div>

        <div className="mt-4 flex flex-col gap-1.5 font-mono text-sm">
          {revealed.map((s, i) => (
            <div
              key={i}
              className={cn(
                "rounded-md px-2.5 py-1.5 transition-colors",
                i === revealed.length - 1 ? "bg-subject-it-soft text-ink dark:bg-subject-it/20 dark:text-bone" : "text-ink-soft dark:text-bone-soft",
              )}
            >
              {s.dividend} ÷ 2 = {s.quotient} remainder <span className="font-semibold text-subject-it">{s.remainder}</span>
            </div>
          ))}
          {!done && revealed.length === 0 && <p className="text-ink-soft dark:text-bone-soft">Press Step or Play to begin.</p>}
        </div>

        {done && steps.length > 0 && (
          <div className="mt-4 rounded-card bg-ink/[0.03] p-3 text-center dark:bg-bone/[0.05]" aria-live="polite">
            <p className="text-xs text-ink-soft dark:text-bone-soft">Read the remainders from bottom to top:</p>
            <p className="mt-1 font-mono text-2xl font-semibold text-subject-it">{divisionResult(steps)}₂</p>
            <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">
              {committed}₁₀ = {divisionResult(steps)}₂
            </p>
          </div>
        )}
      </Panel>
    </div>
  );
}

function BinaryToDecimal({ initialBits }: { initialBits?: string }) {
  const width = 8;
  const [bits, setBits] = useState<string[]>(() => (initialBits ?? "00001101").padStart(width, "0").split(""));
  const [lastToggled, setLastToggled] = useState<number | null>(null);
  const [prevDecimal, setPrevDecimal] = useState<number | null>(null);

  const decimal = bitsArrayToDecimal(bits);
  const parts = placeValueBreakdown(bits.join(""), "binary");

  const toggle = (i: number) => {
    setPrevDecimal(decimal);
    setLastToggled(i);
    setBits((prev) => prev.map((b, idx) => (idx === i ? (b === "1" ? "0" : "1") : b)));
  };

  return (
    <div className="flex flex-col gap-5">
      <Panel title="Toggle bits, watch the decimal value">
        <BitRow bits={bits} onToggle={toggle} highlightIndex={lastToggled} places={parts.map((p) => formatBig(p.place))} />
        <div className="mt-4 rounded-card bg-ink/[0.03] p-3 text-center dark:bg-bone/[0.05]" aria-live="polite">
          <p className="font-mono text-xs text-ink-soft dark:text-bone-soft">
            {parts.filter((p) => p.digitValue).map((p) => formatBig(p.place)).join(" + ") || "0"}
          </p>
          <p className="mt-1 font-display text-2xl font-semibold text-subject-it">
            {prevDecimal !== null && prevDecimal !== decimal ? (
              <>
                <span className="text-ink-soft line-through dark:text-bone-soft">{prevDecimal}</span> → {decimal}
              </>
            ) : (
              decimal
            )}
            ₁₀
          </p>
        </div>
      </Panel>
    </div>
  );
}
