"use client";

import { useState } from "react";
import {
  CAPACITY_DISCLAIMER,
  getUnit,
  labelToBytes,
  RAM_PRESETS,
  reportedShortfallPercent,
  STORAGE_PRESETS,
  STORAGE_SCENARIOS,
  storageTotal,
  type StorageScenario,
} from "../model";
import { Btn, Callout, Panel, SectionHeading, TextField } from "./ui-bits";

export interface MemoryStorageLabPreset {
  scenarioId?: string;
}

export function MemoryStorageLab({ preset }: { preset?: MemoryStorageLabPreset }) {
  return (
    <div className="flex flex-col gap-8">
      <SectionHeading title="Memory &amp; storage laboratory">
        Connect data units to the RAM and drives a computer actually has, and see why the number an operating system reports can differ from the number on
        the label.
      </SectionHeading>
      <MemorySizeLab />
      <StorageSizeLab />
      <StorageCalculator initialScenario={preset?.scenarioId} />
    </div>
  );
}

function MemorySizeLab() {
  const [gb, setGb] = useState(8);
  const bytes = labelToBytes(gb, "GB", "decimal");
  const gib = reportedShortfallPercent(bytes);

  return (
    <Panel title="Memory size lab — RAM">
      <div className="flex flex-wrap gap-2">
        {RAM_PRESETS.map((v) => (
          <Btn key={v} pressed={gb === v} onClick={() => setGb(v)}>
            {v} GB
          </Btn>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-card bg-ink/[0.03] p-3 dark:bg-bone/[0.05]">
          <p className="text-[11px] text-ink-soft dark:text-bone-soft">Advertised (decimal bytes)</p>
          <p className="font-mono text-lg font-semibold text-ink dark:text-bone">{bytes.toLocaleString()} bytes</p>
        </div>
        <div className="rounded-card bg-ink/[0.03] p-3 dark:bg-bone/[0.05]">
          <p className="text-[11px] text-ink-soft dark:text-bone-soft">Binary equivalent</p>
          <p className="font-mono text-lg font-semibold text-subject-it">
            ≈ {(gb * (1 - gib / 100)).toFixed(2)} GiB
          </p>
        </div>
      </div>
      <Callout className="mt-3">
        Advertised RAM capacity is usually a decimal figure, but operating systems typically report memory in binary (GiB) units — that alone accounts for
        most of the gap you&apos;ll see. On top of that, real systems reserve some memory for firmware and hardware, so the usable amount an OS reports can be a
        little lower still. {CAPACITY_DISCLAIMER}
      </Callout>
    </Panel>
  );
}

function StorageSizeLab() {
  const [presetId, setPresetId] = useState(STORAGE_PRESETS[2]!.id);
  const preset = STORAGE_PRESETS.find((p) => p.id === presetId) ?? STORAGE_PRESETS[2]!;
  const bytes = labelToBytes(preset.value, preset.unit, "decimal");
  const shortfall = reportedShortfallPercent(bytes);
  const powerUnit = preset.unit === "GB" ? getUnit("GiB") : getUnit("TiB");
  const binaryValue = Number(bytes) / Number(powerUnit.bits / BigInt(8));

  return (
    <Panel title="Storage size lab">
      <div className="flex flex-wrap gap-2">
        {STORAGE_PRESETS.map((p) => (
          <Btn key={p.id} pressed={presetId === p.id} onClick={() => setPresetId(p.id)}>
            {p.label}
          </Btn>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-card bg-ink/[0.03] p-3 text-center dark:bg-bone/[0.05]">
          <p className="text-[11px] text-ink-soft dark:text-bone-soft">Label (decimal)</p>
          <p className="font-mono text-base font-semibold text-ink dark:text-bone">
            {preset.value} {preset.unit} = {bytes.toLocaleString()} B
          </p>
        </div>
        <div className="rounded-card bg-ink/[0.03] p-3 text-center dark:bg-bone/[0.05]">
          <p className="text-[11px] text-ink-soft dark:text-bone-soft">As reported by an OS using binary units</p>
          <p className="font-mono text-base font-semibold text-subject-it">
            ≈ {binaryValue.toFixed(2)} {powerUnit.symbol}
          </p>
        </div>
        <div className="rounded-card bg-ink/[0.03] p-3 text-center dark:bg-bone/[0.05]">
          <p className="text-[11px] text-ink-soft dark:text-bone-soft">Apparent shortfall</p>
          <p className="font-mono text-base font-semibold text-amber-600 dark:text-amber-400">≈ {shortfall.toFixed(1)}%</p>
        </div>
      </div>
      <Callout className="mt-3">
        A drive labeled “{preset.label}” is not missing storage — it is exactly {preset.value} {preset.unit} in the decimal sense the label uses. It looks
        smaller in some operating systems only because those tools display the same byte count using binary-style units, and the file system and formatting
        also use a little space. {CAPACITY_DISCLAIMER}
      </Callout>
    </Panel>
  );
}

function StorageCalculator({ initialScenario }: { initialScenario?: string }) {
  const [scenarioId, setScenarioId] = useState(initialScenario ?? "photos");
  const scenario = STORAGE_SCENARIOS.find((s) => s.id === scenarioId) ?? STORAGE_SCENARIOS[0]!;
  const [size, setSize] = useState(scenario.size);
  const [unitId, setUnitId] = useState(scenario.unit);
  const [count, setCount] = useState(scenario.count);

  const changeScenario = (s: StorageScenario) => {
    setScenarioId(s.id);
    setSize(s.size);
    setUnitId(s.unit);
    setCount(s.count);
  };

  const unit = getUnit(unitId);
  const result = storageTotal(size, unit, count);

  return (
    <Panel title="Storage calculator">
      <div className="flex flex-wrap gap-2">
        {STORAGE_SCENARIOS.map((s) => (
          <Btn key={s.id} pressed={scenarioId === s.id} onClick={() => changeScenario(s)}>
            {s.label}
          </Btn>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <TextField id="storage-calc-size" label={`File size (${unit.symbol})`} value={size} onChange={setSize} placeholder="5" />
        <TextField id="storage-calc-count" label="Number of files" value={count} onChange={setCount} placeholder="1000" />
        <div className="flex flex-col justify-end">
          <p className="text-xs text-ink-soft dark:text-bone-soft">{scenario.note}</p>
        </div>
      </div>

      {result.ok ? (
        <div className="mt-4 rounded-card bg-ink/[0.03] p-3 text-center dark:bg-bone/[0.05]" aria-live="polite">
          <p className="text-xs text-ink-soft dark:text-bone-soft">{result.steps[0]}</p>
          <p className="mt-1 font-display text-xl font-semibold text-subject-it">
            ≈ {result.totalInUnit} (≈ {result.human})
          </p>
        </div>
      ) : (
        <p className="mt-3 text-sm text-rose-600 dark:text-rose-400">{result.error}</p>
      )}
    </Panel>
  );
}
