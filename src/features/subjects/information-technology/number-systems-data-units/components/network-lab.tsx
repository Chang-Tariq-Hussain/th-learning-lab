"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { convertRate, getRateUnit, getUnit, RATE_UNITS, TRANSFER_DISCLAIMER, transferTime } from "../model";
import { Callout, Panel, SectionHeading, TextField } from "./ui-bits";

export interface NetworkLabPreset {
  speedMbps?: string;
  fileSizeMB?: string;
}

export function NetworkLab({ preset }: { preset?: NetworkLabPreset }) {
  return (
    <div className="flex flex-col gap-8">
      <SectionHeading title="Data transfer rates">
        Network and drive speeds are usually advertised in bits per second (lowercase b), but file sizes are measured in bytes (uppercase B) — an easy mix-up
        with a factor-of-8 consequence.
      </SectionHeading>
      <RateExplainer />
      <NetworkSpeedCalculator preset={preset} />
    </div>
  );
}

function RateExplainer() {
  const [mbps, setMbps] = useState("100");
  const result = convertRate(mbps, getRateUnit("Mbps"), getRateUnit("MBps"));

  return (
    <Panel title="bits vs bytes">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-card border border-line p-3 dark:border-line-dark">
          <p className="font-mono text-xs uppercase tracking-wide text-ink-soft dark:text-bone-soft">b = bits</p>
          <p className="mt-1 text-sm text-ink dark:text-bone">Kbps, Mbps, Gbps — connection speeds are usually advertised this way.</p>
        </div>
        <div className="rounded-card border border-line p-3 dark:border-line-dark">
          <p className="font-mono text-xs uppercase tracking-wide text-ink-soft dark:text-bone-soft">B = bytes</p>
          <p className="mt-1 text-sm text-ink dark:text-bone">KB/s, MB/s, GB/s — file sizes and download progress are usually shown this way.</p>
        </div>
      </div>

      <div className="mt-4">
        <TextField id="rate-mbps" label="Connection speed (Mbps)" value={mbps} onChange={setMbps} placeholder="100" />
      </div>
      {result.ok && (
        <div className="mt-3 rounded-card bg-ink/[0.03] p-3 text-center dark:bg-bone/[0.05]" aria-live="polite">
          <p className="font-mono text-sm text-ink-soft dark:text-bone-soft">{mbps || "0"} Mbps ÷ 8</p>
          <p className="mt-1 font-display text-xl font-semibold text-subject-it">
            {result.exact ? "" : "≈ "}
            {result.result} MB/s
          </p>
        </div>
      )}
      <div className="mt-4 grid gap-2 sm:grid-cols-4">
        {RATE_UNITS.map((u) => (
          <div key={u.id} className={cn("rounded-md border px-2 py-1.5 text-center font-mono text-xs", u.family === "bits" ? "border-line dark:border-line-dark" : "border-subject-it/40 bg-subject-it-soft/30 dark:bg-subject-it/10")}>
            {u.symbol}
          </div>
        ))}
      </div>
    </Panel>
  );
}

function NetworkSpeedCalculator({ preset }: { preset?: NetworkLabPreset }) {
  const [speed, setSpeed] = useState(preset?.speedMbps ?? "100");
  const [fileSize, setFileSize] = useState(preset?.fileSizeMB ?? "500");
  const [efficiency, setEfficiency] = useState(100);

  const calc = transferTime(fileSize, getUnit("MB"), speed, getRateUnit("Mbps"), efficiency);

  return (
    <Panel title="Network speed calculator">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField id="net-speed" label="Connection speed (Mbps)" value={speed} onChange={setSpeed} placeholder="100" />
        <TextField id="net-file-size" label="File size (MB)" value={fileSize} onChange={setFileSize} placeholder="500" />
      </div>

      <div className="mt-4 flex flex-col gap-1.5">
        <label className="text-xs font-medium text-ink-soft dark:text-bone-soft" htmlFor="net-efficiency">
          Real-world efficiency: {efficiency}% of the advertised speed
        </label>
        <input
          id="net-efficiency"
          type="range"
          min={10}
          max={100}
          step={5}
          value={efficiency}
          onChange={(e) => setEfficiency(Number(e.target.value))}
          className="accent-[#B45309]"
        />
      </div>

      {calc.ok ? (
        <div className="mt-4 rounded-card bg-ink/[0.03] p-4 dark:bg-bone/[0.05]" aria-live="polite">
          <div className="flex flex-col gap-1 text-center font-mono text-sm text-ink-soft dark:text-bone-soft">
            {calc.steps.map((s, i) => (
              <p key={i}>{s}</p>
            ))}
          </div>
          <p className="mt-2 text-center font-display text-2xl font-semibold text-subject-it">≈ {calc.duration}</p>
        </div>
      ) : (
        <p className="mt-3 text-sm text-rose-600 dark:text-rose-400">{calc.error}</p>
      )}

      <Callout className="mt-3">{TRANSFER_DISCLAIMER}</Callout>
    </Panel>
  );
}
