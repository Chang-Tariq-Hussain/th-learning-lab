"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CpuDiagram } from "./components/cpu-diagram";
import { ComponentInspector } from "./components/component-inspector";
import { RegisterPanel } from "./components/register-panel";
import { AluPanel } from "./components/alu-panel";
import { FlagsPanel } from "./components/flags-panel";
import { MemoryPanel } from "./components/memory-panel";
import { ProgramEditor } from "./components/program-editor";
import { ExecutionLog } from "./components/execution-log";
import { ClockPanel } from "./components/clock-panel";
import { PlaybackControls } from "./components/playback-controls";
import { PipelineMode } from "./components/pipeline-mode";
import { useStepPlayer } from "./hooks/use-step-player";
import {
  ARCHITECTURE_DISCLAIMER,
  BINARY_LINK,
  CLOCK_DISCLAIMER,
  COMPONENTS_LINK,
  DATA_FLOW_LINK,
  DETAIL_LEVELS,
  DETAIL_LEVEL_DESCRIPTIONS,
  DETAIL_LEVEL_LABELS,
  INITIAL_FLAGS,
  INITIAL_REGISTERS,
  SCENARIOS,
  compileProgram,
  simulateProgram,
  type CpuPartId,
  type DetailLevel,
} from "./model";

type LabTab = "simulator" | "pipeline";

/**
 * The "Virtual CPU Laboratory" — CPU Architecture & Instruction Cycle.
 * 2D throughout (per spec, 3D adds nothing to understanding internal
 * execution flow). Reuses the same Beginner/Intermediate/Technical
 * detail-level convention as the Paging Simulator and the same
 * scenario + step-player pattern as CPU–RAM–Storage Data Flow, but
 * models something neither of those does: a real, if small, fetch →
 * decode → execute → write-back interpreter running an
 * editable/compiled instruction stream, plus a separate Pipeline
 * Advanced Mode. See `model.ts`'s header comment for exactly how this
 * differs from the sibling Computer Fundamentals simulations.
 */
export function CpuArchitectureInstructionCycle() {
  const [tab, setTab] = useState<LabTab>("simulator");
  const [detailLevel, setDetailLevel] = useState<DetailLevel>("beginner");
  const [source, setSource] = useState(SCENARIOS[0]!.source);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(SCENARIOS[0]!.id);
  const [selectedPart, setSelectedPart] = useState<CpuPartId | null>(null);

  const compiled = useMemo(() => compileProgram(source), [source]);
  const steps = useMemo(() => simulateProgram(compiled.instructions), [compiled.instructions]);
  const player = useStepPlayer(steps);

  // Any manual edit to the source detaches it from the scenario button
  // that was selected (unless it happens to still match verbatim).
  useEffect(() => {
    const match = SCENARIOS.find((s) => s.source === source);
    setActiveScenarioId(match ? match.id : null);
  }, [source]);

  const showBinary = detailLevel === "technical";
  const step = player.step;

  const registers = step ? step.registersAfter : INITIAL_REGISTERS;
  const previousRegisters = step ? step.registersBefore : undefined;
  const flags = step ? step.flagsAfter : INITIAL_FLAGS;
  const previousFlags = step ? step.flagsBefore : undefined;
  const activeParts = step ? step.activeParts : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Virtual CPU Laboratory mode">
        {(
          [
            { id: "simulator" as const, label: "CPU Lab" },
            { id: "pipeline" as const, label: "Pipeline (Advanced)" },
          ]
        ).map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              tab === t.id
                ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Detail level:</span>
        {DETAIL_LEVELS.map((level) => (
          <button
            key={level}
            onClick={() => setDetailLevel(level)}
            title={DETAIL_LEVEL_DESCRIPTIONS[level]}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium",
              detailLevel === level ? "border-ink dark:border-bone" : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
            )}
          >
            {DETAIL_LEVEL_LABELS[level]}
          </button>
        ))}
      </div>

      <div className="rounded-card border border-line bg-paper p-3 dark:border-line-dark dark:bg-chalkboard sm:p-5">
        {tab === "simulator" ? (
          <div className="flex flex-col gap-6">
            <ProgramEditor
              source={source}
              onChangeSource={setSource}
              activeScenarioId={activeScenarioId}
              onSelectScenario={(id) => {
                const scenario = SCENARIOS.find((s) => s.id === id);
                if (scenario) {
                  setSource(scenario.source);
                  setActiveScenarioId(id);
                }
              }}
              errors={compiled.errors}
              instructionCount={compiled.instructions.length}
            />

            <PlaybackControls player={player} totalSteps={steps.length} />

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
              <CpuDiagram
                detailLevel={detailLevel}
                activeParts={activeParts}
                selectedPart={selectedPart}
                onSelectPart={setSelectedPart}
              />
              <div className="flex flex-col gap-4">
                <ComponentInspector selectedPart={selectedPart} />
                {detailLevel !== "beginner" && <ClockPanel cycle={step?.cycle ?? 0} stage={step?.stage} />}
              </div>
            </div>

            <RegisterPanel registers={registers} previous={previousRegisters} changedRegister={step?.changedRegister} showBinary={showBinary} />

            <div className="grid gap-4 sm:grid-cols-2">
              <AluPanel alu={step?.alu} stage={step?.stage} showBinary={showBinary} />
              {detailLevel !== "beginner" && <FlagsPanel flags={flags} previous={previousFlags} />}
            </div>

            {step ? (
              <div className="rounded-card border border-subject-it/40 bg-subject-it-soft/60 p-4 text-sm leading-relaxed text-ink dark:bg-subject-it/10 dark:text-bone">
                {step.explanation}
              </div>
            ) : (
              <p className="text-sm text-ink-soft dark:text-bone-soft">Press Start to step through Fetch → Decode → Execute → Write Back for this program.</p>
            )}

            {detailLevel !== "beginner" && (
              <MemoryPanel instructions={compiled.instructions} step={step} />
            )}

            <ExecutionLog steps={steps} currentIndex={player.stepIndex} onSelect={player.goTo} />
          </div>
        ) : (
          <PipelineMode instructions={compiled.instructions} />
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[COMPONENTS_LINK, DATA_FLOW_LINK, BINARY_LINK].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-card border border-line bg-paper p-3 text-xs transition-colors hover:border-subject-it dark:border-line-dark dark:bg-chalkboard"
          >
            <span className="font-medium text-ink dark:text-bone">{link.label}</span>
            <p className="mt-1 text-ink-soft dark:text-bone-soft">{link.description}</p>
          </Link>
        ))}
      </div>

      <div className="space-y-1">
        <p className="text-xs text-ink-soft dark:text-bone-soft">{ARCHITECTURE_DISCLAIMER}</p>
        <p className="text-xs text-ink-soft dark:text-bone-soft">{CLOCK_DISCLAIMER}</p>
      </div>
    </div>
  );
}
