"use client";

import { useMemo, useState } from "react";
import { LAYER_ID_ITEMS, getLayer, type OsiLayerNumber } from "../model";
import { Callout, LayerPicker, Panel, SectionHeading } from "./ui";

/** Small Fisher–Yates shuffle so each attempt sees the items in a
 *  different order, without ever mutating the source array. */
function shuffled<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

export function LayerIdChallenge() {
  const [order] = useState(() => shuffled(LAYER_ID_ITEMS));
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<OsiLayerNumber | null>(null);
  const [score, setScore] = useState({ correct: 0, attempted: 0 });

  const item = order[index];
  const isLast = index === order.length - 1;

  const isCorrect = useMemo(() => (item && chosen != null ? chosen === item.correctLayer : null), [item, chosen]);

  function choose(layer: OsiLayerNumber) {
    if (chosen != null || !item) return;
    setChosen(layer);
    setScore((s) => ({ correct: s.correct + (layer === item.correctLayer ? 1 : 0), attempted: s.attempted + 1 }));
  }

  function next() {
    setChosen(null);
    setIndex((i) => (i + 1 < order.length ? i + 1 : 0));
  }

  if (!item) return null;

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading title="Layer identification challenge">
        Read the scenario, then click the OSI layer it belongs to.
      </SectionHeading>

      <Panel title={`Scenario ${index + 1} of ${order.length}`}>
        <p className="text-base text-ink dark:text-bone">{item.statement}</p>
      </Panel>

      <LayerPicker value={chosen} onChange={choose} disabled={chosen != null} correctLayer={chosen != null ? item.correctLayer : null} />

      {chosen != null && (
        <Callout tone={isCorrect ? "good" : "bad"} title={isCorrect ? "Correct" : `Not quite — it's Layer ${item.correctLayer} (${getLayer(item.correctLayer).name})`}>
          {item.explanation}
        </Callout>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-soft dark:text-bone-soft">
          Score: {score.correct}/{score.attempted}
        </p>
        {chosen != null && (
          <button
            onClick={next}
            className="rounded-full bg-subject-it px-4 py-2 text-sm font-medium text-paper hover:opacity-90"
          >
            {isLast ? "Start over" : "Next scenario"}
          </button>
        )}
      </div>
    </div>
  );
}
