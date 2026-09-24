"use client";

import { Pause, Play, RotateCcw, StepBack, StepForward } from "lucide-react";
import { cn } from "@/lib/utils";
import { ENCAPSULATION_SIMPLIFICATION_NOTE, ENCAPSULATION_STAGES, getLayer, type DetailLevel, type OsiLayerNumber } from "../model";
import { useStepPlayer, type PlaySpeed } from "../hooks/use-step-player";
import { Callout, Panel, SectionHeading } from "./ui";

type Phase = "idle" | "encapsulating" | "transmitting" | "decapsulating";

interface FlowFrame {
  phase: Phase;
  layer: OsiLayerNumber | null;
  pduName: string;
  headers: OsiLayerNumber[]; // which of 4 (Transport), 3 (Network), 2 (Data Link) headers are currently wrapped on
  description: string;
  side: "sender" | "wire" | "receiver";
}

/** Encapsulation stages 7,4,3,2,1 -> frames 0..4; a transmit frame;
 *  then the mirror image for decapsulation, 1,2,3,4,7 -> frames 6..10. */
const FRAMES: FlowFrame[] = [
  { phase: "encapsulating", layer: 7, pduName: "Data", headers: [], description: ENCAPSULATION_STAGES[0]!.description, side: "sender" },
  { phase: "encapsulating", layer: 4, pduName: "Segment", headers: [4], description: ENCAPSULATION_STAGES[1]!.description, side: "sender" },
  { phase: "encapsulating", layer: 3, pduName: "Packet", headers: [4, 3], description: ENCAPSULATION_STAGES[2]!.description, side: "sender" },
  { phase: "encapsulating", layer: 2, pduName: "Frame", headers: [4, 3, 2], description: ENCAPSULATION_STAGES[3]!.description, side: "sender" },
  { phase: "encapsulating", layer: 1, pduName: "Bits", headers: [4, 3, 2], description: ENCAPSULATION_STAGES[4]!.description, side: "sender" },
  { phase: "transmitting", layer: null, pduName: "Bits", headers: [4, 3, 2], description: "The bits travel across the physical medium — cable, fiber, or radio — to Computer B.", side: "wire" },
  { phase: "decapsulating", layer: 1, pduName: "Bits", headers: [4, 3, 2], description: "Computer B's Physical layer receives the raw bits and passes them up as a Frame.", side: "receiver" },
  { phase: "decapsulating", layer: 2, pduName: "Packet", headers: [4, 3], description: "The Data Link header and trailer are checked and removed, revealing a Packet.", side: "receiver" },
  { phase: "decapsulating", layer: 3, pduName: "Segment", headers: [4], description: "The Network header is removed, revealing a Segment.", side: "receiver" },
  { phase: "decapsulating", layer: 4, pduName: "Data", headers: [], description: "The Transport header is removed, revealing the original Data.", side: "receiver" },
  { phase: "decapsulating", layer: 7, pduName: "Data", headers: [], description: "The Application layer receives the Data — the same message Computer A's application created.", side: "receiver" },
];

const HEADER_COLORS: Record<number, string> = {
  4: getLayer(4).accent,
  3: getLayer(3).accent,
  2: getLayer(2).accent,
};

function PduBlock({ frame }: { frame: FlowFrame }) {
  const hasDataLink = frame.headers.includes(2);
  const hasNetwork = frame.headers.includes(3);
  const hasTransport = frame.headers.includes(4);
  return (
    <div className="flex items-center justify-center gap-0.5" aria-label={`Current data unit: ${frame.pduName}`}>
      {hasDataLink && (
        <span className="rounded-l-md px-2 py-3 font-mono text-[10px] font-semibold text-white" style={{ backgroundColor: HEADER_COLORS[2] }}>
          DL hdr
        </span>
      )}
      {hasNetwork && (
        <span className="px-2 py-3 font-mono text-[10px] font-semibold text-white" style={{ backgroundColor: HEADER_COLORS[3] }}>
          Net hdr
        </span>
      )}
      {hasTransport && (
        <span className="px-2 py-3 font-mono text-[10px] font-semibold text-white" style={{ backgroundColor: HEADER_COLORS[4] }}>
          Trans hdr
        </span>
      )}
      <span
        className={cn(
          "bg-ink px-4 py-3 font-mono text-[11px] font-semibold text-paper dark:bg-bone dark:text-chalkboard",
          !hasDataLink && "rounded-l-md rounded-r-md",
        )}
      >
        DATA
      </span>
      {hasDataLink && (
        <span className="rounded-r-md px-2 py-3 font-mono text-[10px] font-semibold text-white" style={{ backgroundColor: HEADER_COLORS[2] }}>
          trailer
        </span>
      )}
    </div>
  );
}

export function EncapsulationLab({ level }: { level: DetailLevel }) {
  const player = useStepPlayer(FRAMES.length);
  const frame = player.stepIndex >= 0 ? FRAMES[player.stepIndex] : null;
  const pduFrame: FlowFrame = frame ?? { phase: "idle", layer: null, pduName: "Data", headers: [], description: "Press Play to send data from Computer A to Computer B, layer by layer.", side: "sender" };

  const speeds: PlaySpeed[] = [0.5, 1, 1.5, 2];

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading title="Encapsulation and decapsulation">
        Watch data get wrapped in a header at every layer on its way down (encapsulation), travel across the
        physical medium, then get unwrapped one header at a time on the way back up (decapsulation).
      </SectionHeading>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className={cn("rounded-card border p-3 text-center transition-colors", pduFrame.side === "sender" ? "border-subject-it bg-subject-it-soft dark:bg-subject-it/20" : "border-line dark:border-line-dark")}>
          <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Computer A</p>
          <p className="mt-1 text-sm font-medium text-ink dark:text-bone">Sender — encapsulating</p>
        </div>
        <div className={cn("rounded-card border p-3 text-center transition-colors", pduFrame.side === "wire" ? "border-subject-it bg-subject-it-soft dark:bg-subject-it/20" : "border-line dark:border-line-dark")}>
          <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">The medium</p>
          <p className="mt-1 text-sm font-medium text-ink dark:text-bone">Cable / fiber / radio</p>
        </div>
        <div className={cn("rounded-card border p-3 text-center transition-colors", pduFrame.side === "receiver" ? "border-subject-it bg-subject-it-soft dark:bg-subject-it/20" : "border-line dark:border-line-dark")}>
          <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Computer B</p>
          <p className="mt-1 text-sm font-medium text-ink dark:text-bone">Receiver — decapsulating</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 rounded-card border border-line bg-white/60 p-6 dark:border-line-dark dark:bg-white/[0.03]">
        <PduBlock frame={pduFrame} />
        <p className="font-mono text-xs uppercase tracking-wide text-subject-it">
          {pduFrame.layer ? `Layer ${pduFrame.layer} · ${getLayer(pduFrame.layer).name}` : "In transit"} — currently a{" "}
          <span className="font-semibold">{pduFrame.pduName}</span>
        </p>
        <p className="max-w-xl text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{pduFrame.description}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={player.playPause}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-subject-it px-5 text-sm font-medium text-paper hover:opacity-90"
        >
          {player.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {player.playLabel}
        </button>
        <button
          onClick={player.stepBack}
          disabled={player.stepIndex < 0}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium text-ink hover:border-ink/40 disabled:opacity-40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40"
        >
          <StepBack className="h-4 w-4" />
          Back
        </button>
        <button
          onClick={player.stepForward}
          disabled={player.isFinished}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium text-ink hover:border-ink/40 disabled:opacity-40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40"
        >
          <StepForward className="h-4 w-4" />
          Step
        </button>
        <button
          onClick={player.reset}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
        <div className="ml-auto flex items-center gap-1 rounded-full border border-line p-1 dark:border-line-dark" role="group" aria-label="Playback speed">
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => player.setSpeed(s)}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                player.speed === s ? "bg-subject-it text-paper" : "text-ink-soft hover:bg-ink/5 dark:text-bone-soft dark:hover:bg-bone/10",
              )}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>

      <Panel title="Step">
        <p className="text-sm text-ink-soft dark:text-bone-soft">
          Step {Math.max(0, player.stepIndex + 1)} of {FRAMES.length}
          {player.stepIndex === -1 && " — not started"}
        </p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink/10 dark:bg-bone/10">
          <div
            className="h-full rounded-full bg-subject-it transition-all"
            style={{ width: `${((player.stepIndex + 1) / FRAMES.length) * 100}%` }}
          />
        </div>
      </Panel>

      {level !== "beginner" && (
        <Callout tone="neutral" title="Terminology varies by protocol">
          {ENCAPSULATION_SIMPLIFICATION_NOTE}
        </Callout>
      )}
    </div>
  );
}
