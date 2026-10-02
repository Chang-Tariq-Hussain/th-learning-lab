"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Callout, Panel } from "../../osi-model-explorer/components/ui";
import { useStepPlayer } from "../../osi-model-explorer/hooks/use-step-player";
import { ITERATIVE_SEQUENCE, LIFELINE_LABEL, RECURSIVE_SEQUENCE, type Lifeline, type SeqMessage } from "../model";
import { CHIP_CLASS, LINK_STROKE, TOKEN_FILL } from "./dns-diagram";
import { StateChip } from "./parts";

type Mode = "recursive" | "iterative";

const X: Record<Lifeline, number> = { client: 48, resolver: 134, root: 220, tld: 306, auth: 392 };
const ORDER: Lifeline[] = ["client", "resolver", "root", "tld", "auth"];
const ROW0 = 84;
const ROW = 40;
const VIEW_H = ROW0 + 8 * ROW + 6;

function Sequence({ messages, upto }: { messages: SeqMessage[]; upto: number }) {
  const used = new Set<Lifeline>(messages.flatMap((m) => [m.from, m.to]));
  return (
    <svg viewBox={`0 0 440 ${VIEW_H}`} className="mx-auto h-auto w-full max-w-[600px] rounded-card border border-line bg-paper dark:border-line-dark dark:bg-chalkboard" role="img" aria-label="Sequence diagram of the messages exchanged">
      {ORDER.map((l) => (
        <g key={l} opacity={used.has(l) ? 1 : 0.35}>
          <line x1={X[l]} y1={46} x2={X[l]} y2={VIEW_H - 6} strokeDasharray="3 4" strokeWidth={1.4} className="stroke-ink/30 dark:stroke-bone/30" />
          <rect x={X[l] - 38} y={10} width={76} height={34} rx={8} strokeWidth={1.4} className={cn("fill-white dark:fill-white/[0.04]", l === "resolver" ? "stroke-subject-it" : "stroke-ink/50 dark:stroke-bone/50")} />
          <text x={X[l]} y={26} textAnchor="middle" className="fill-ink font-mono text-[11px] font-semibold dark:fill-bone">
            {LIFELINE_LABEL[l]}
          </text>
          {!used.has(l) && (
            <text x={X[l]} y={38} textAnchor="middle" className="fill-ink-soft font-mono text-[8px] dark:fill-bone-soft">
              not used
            </text>
          )}
        </g>
      ))}
      {messages.map((m, i) => {
        if (i > upto) return null;
        const y = ROW0 + i * ROW;
        const x1 = X[m.from];
        const x2 = X[m.to];
        const dir = x2 > x1 ? 1 : -1;
        const current = i === upto;
        return (
          <g key={i} opacity={current ? 1 : 0.55}>
            <line x1={x1} y1={y} x2={x2 - dir * 7} y2={y} strokeWidth={current ? 3 : 2} className={LINK_STROKE[m.kind]} />
            <polygon points={`${x2},${y} ${x2 - dir * 8},${y - 4.5} ${x2 - dir * 8},${y + 4.5}`} className={TOKEN_FILL[m.kind]} />
            <text x={(x1 + x2) / 2} y={y - 7} textAnchor="middle" strokeWidth={3} paintOrder="stroke" className="stroke-paper fill-ink font-mono text-[9.5px] font-semibold dark:stroke-chalkboard dark:fill-bone">
              {i + 1}. {m.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

const seg = "min-h-[44px] flex-1 rounded-full border px-4 text-sm font-medium transition-colors";

/** Conceptual comparison only: a sequence diagram you step through, not a protocol implementation. */
export function ModesLab() {
  const [mode, setMode] = useState<Mode>("recursive");
  const messages = mode === "recursive" ? RECURSIVE_SEQUENCE : ITERATIVE_SEQUENCE;
  const player = useStepPlayer(messages.length);
  const idx = Math.min(player.stepIndex, messages.length - 1);
  const cur = idx >= 0 ? messages[idx] : undefined;
  const btn = "min-h-[44px] rounded-full border px-4 text-sm font-medium transition-colors disabled:opacity-40";

  function choose(m: Mode) {
    setMode(m);
    player.reset();
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-2" role="radiogroup" aria-label="Resolution style">
        <button role="radio" aria-checked={mode === "recursive"} onClick={() => choose("recursive")} className={cn(seg, mode === "recursive" ? "border-subject-it bg-subject-it text-paper" : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft")}>
          Recursive: the resolver does the work
        </button>
        <button role="radio" aria-checked={mode === "iterative"} onClick={() => choose("iterative")} className={cn(seg, mode === "iterative" ? "border-subject-it bg-subject-it text-paper" : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft")}>
          Iterative: follow the referrals
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <div className="flex min-w-0 flex-col gap-3">
          <Sequence messages={messages} upto={idx} />
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Walkthrough controls">
            <button onClick={player.playPause} className={cn(btn, "border-subject-it bg-subject-it text-paper")}>
              {player.isPlaying ? "⏸ Pause" : player.stepIndex === -1 ? "▶ Play" : player.isFinished ? "▶ Replay" : "▶ Resume"}
            </button>
            <button onClick={player.stepForward} disabled={player.isFinished} className={cn(btn, "border-line text-ink dark:border-line-dark dark:text-bone")}>
              Next step ▸
            </button>
            <button onClick={player.stepBack} disabled={player.stepIndex < 0} className={cn(btn, "border-line text-ink dark:border-line-dark dark:text-bone")}>
              ◂ Back
            </button>
            <button onClick={player.reset} className={cn(btn, "border-line text-ink dark:border-line-dark dark:text-bone")}>
              ↻ Restart
            </button>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          <div className="rounded-card border border-line bg-white/60 p-3.5 dark:border-line-dark dark:bg-white/[0.03]" aria-live="polite">
            {cur ? (
              <>
                <div className="flex items-center gap-2">
                  <StateChip kind={cur.kind} />
                  <span className="font-mono text-[11px] text-ink-soft dark:text-bone-soft">
                    Message {idx + 1} of {messages.length}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{cur.text}</p>
              </>
            ) : (
              <p className="text-sm text-ink-soft dark:text-bone-soft">
                {mode === "recursive"
                  ? "Press Play. The client asks once; the resolver does everything else and returns the final answer."
                  : "Press Play. Here whoever is asking must follow every referral and ask the next server itself."}
              </p>
            )}
          </div>

          <Panel title="Side by side">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className={cn("rounded-lg border p-2.5", mode === "recursive" ? "border-subject-it" : "border-line dark:border-line-dark")}>
                <p className="flex items-center gap-1.5 font-display text-sm font-medium text-ink dark:text-bone">
                  <span className={cn("h-2 w-2 rounded-full", CHIP_CLASS.query)} aria-hidden />
                  Recursive
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">The resolver finds the final answer on behalf of the client. The client sends one question and gets one answer.</p>
                <p className="mt-1.5 text-xs text-ink-soft dark:text-bone-soft">
                  <span className="font-semibold text-ink dark:text-bone">Real use:</span> client → resolver.
                </p>
              </div>
              <div className={cn("rounded-lg border p-2.5", mode === "iterative" ? "border-subject-it" : "border-line dark:border-line-dark")}>
                <p className="flex items-center gap-1.5 font-display text-sm font-medium text-ink dark:text-bone">
                  <span className={cn("h-2 w-2 rounded-full", CHIP_CLASS.response)} aria-hidden />
                  Iterative
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">A DNS server replies with the best information or referral it has. The system asking continues the process itself.</p>
                <p className="mt-1.5 text-xs text-ink-soft dark:text-bone-soft">
                  <span className="font-semibold text-ink dark:text-bone">Real use:</span> resolver → root, TLD and authoritative servers.
                </p>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      <Callout tone="neutral" title="Both happen in one real lookup">
        The client&apos;s query to its resolver is recursive. The resolver&apos;s queries to the root, TLD and authoritative servers are iterative. That is why the Resolve tab shows referrals going back to the resolver, not servers passing the question along to each other.
      </Callout>
    </div>
  );
}
