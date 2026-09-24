"use client";

import { useMemo, useState } from "react";
import { TROUBLESHOOTING_CASES, getLayer, type OsiLayerNumber } from "../model";
import { Callout, LayerPicker, Panel, SectionHeading } from "./ui";

export function TroubleshootingLab() {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<OsiLayerNumber | null>(null);
  const [score, setScore] = useState({ correct: 0, attempted: 0 });

  const item = TROUBLESHOOTING_CASES[index]!;
  const isLast = index === TROUBLESHOOTING_CASES.length - 1;
  const isCorrect = useMemo(() => (chosen != null ? chosen === item.correctLayer : null), [chosen, item]);

  function choose(layer: OsiLayerNumber) {
    if (chosen != null) return;
    setChosen(layer);
    setScore((s) => ({ correct: s.correct + (layer === item.correctLayer ? 1 : 0), attempted: s.attempted + 1 }));
  }

  function next() {
    setChosen(null);
    setIndex((i) => (i + 1 < TROUBLESHOOTING_CASES.length ? i + 1 : 0));
  }

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading title="Troubleshooting: which layer is likely at fault?">
        This is a conceptual exercise, not a real diagnostic tool — the goal is to practice mapping a symptom to the
        OSI layer it most likely belongs to.
      </SectionHeading>

      <Panel title={item.title}>
        <p className="text-base text-ink dark:text-bone">{item.symptom}</p>
      </Panel>

      <LayerPicker value={chosen} onChange={choose} disabled={chosen != null} correctLayer={chosen != null ? item.correctLayer : null} />

      {chosen != null && (
        <Callout tone={isCorrect ? "good" : "bad"} title={isCorrect ? "Correct" : `Most likely Layer ${item.correctLayer} (${getLayer(item.correctLayer).name})`}>
          {item.explanation}
        </Callout>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-soft dark:text-bone-soft">
          Case {index + 1} of {TROUBLESHOOTING_CASES.length} · Score: {score.correct}/{score.attempted}
        </p>
        {chosen != null && (
          <button onClick={next} className="rounded-full bg-subject-it px-4 py-2 text-sm font-medium text-paper hover:opacity-90">
            {isLast ? "Start over" : "Next case"}
          </button>
        )}
      </div>
    </div>
  );
}
