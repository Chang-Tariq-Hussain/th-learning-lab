"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Callout, Panel, SectionHeading } from "@/features/subjects/information-technology/osi-model-explorer/components/ui";
import { TCPIP_LAYERS, getTcpIpLayer, type LayerQuestion, type TcpIpLayerId } from "../model";

function shuffled<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

function TcpIpLayerPicker({
  value,
  onChange,
  disabled,
  correct,
}: {
  value: TcpIpLayerId | null;
  onChange: (id: TcpIpLayerId) => void;
  disabled?: boolean;
  correct: TcpIpLayerId | null;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="Choose a TCP/IP layer">
      {TCPIP_LAYERS.map((l) => {
        const chosen = value === l.id;
        const isCorrect = correct != null && l.id === correct;
        const isWrong = correct != null && chosen && l.id !== correct;
        return (
          <button
            key={l.id}
            onClick={() => onChange(l.id)}
            disabled={disabled}
            className={cn(
              "flex min-h-[56px] flex-col items-center justify-center gap-0.5 rounded-xl border px-3 py-2 text-xs font-medium transition-colors disabled:cursor-default",
              isCorrect && "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
              isWrong && "border-red-500 bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300",
              !isCorrect && !isWrong && chosen && "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20",
              !isCorrect && !isWrong && !chosen && "border-line text-ink dark:border-line-dark dark:text-bone",
            )}
          >
            <span className="font-mono text-sm">{l.number}</span>
            <span className="text-center">{l.name}</span>
          </button>
        );
      })}
    </div>
  );
}

interface LayerQuizLabProps {
  heading: string;
  intro: string;
  items: LayerQuestion[];
  itemLabel: string; // "Scenario" | "Case"
  shuffle?: boolean;
}

/**
 * One reusable "pick the responsible layer" activity, used for both
 * the Layer Responsibility experiment and the conceptual
 * Troubleshooting view — same mechanic, different content.
 */
export function LayerQuizLab({ heading, intro, items, itemLabel, shuffle }: LayerQuizLabProps) {
  const [order] = useState(() => (shuffle ? shuffled(items) : items));
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<TcpIpLayerId | null>(null);
  const [score, setScore] = useState({ correct: 0, attempted: 0 });

  const item = order[index];
  const isLast = index === order.length - 1;
  const isCorrect = useMemo(() => (item && chosen != null ? chosen === item.correct : null), [item, chosen]);

  if (!item) return null;

  function choose(id: TcpIpLayerId) {
    if (chosen != null || !item) return;
    setChosen(id);
    setScore((s) => ({ correct: s.correct + (id === item.correct ? 1 : 0), attempted: s.attempted + 1 }));
  }

  function next() {
    setChosen(null);
    setIndex((i) => (i + 1 < order.length ? i + 1 : 0));
  }

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading title={heading}>{intro}</SectionHeading>

      <Panel title={item.title ?? `${itemLabel} ${index + 1} of ${order.length}`}>
        <p className="text-base text-ink dark:text-bone">{item.prompt}</p>
      </Panel>

      <TcpIpLayerPicker value={chosen} onChange={choose} disabled={chosen != null} correct={chosen != null ? item.correct : null} />

      {chosen != null && (
        <Callout tone={isCorrect ? "good" : "bad"} title={isCorrect ? "Correct" : `Not quite — most likely ${getTcpIpLayer(item.correct).name}`}>
          {item.explanation}
        </Callout>
      )}

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-ink-soft dark:text-bone-soft">
          {itemLabel} {index + 1} of {order.length} · Score: {score.correct}/{score.attempted}
        </p>
        {chosen != null && (
          <button onClick={next} className="rounded-full bg-subject-it px-4 py-2 text-sm font-medium text-paper hover:opacity-90">
            {isLast ? "Start over" : `Next ${itemLabel.toLowerCase()}`}
          </button>
        )}
      </div>
    </div>
  );
}
