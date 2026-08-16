"use client";

import { useEffect, useRef, useState } from "react";
import {
  PLACEMENT_CHALLENGES,
  type Quadrant,
} from "./coordinate-model";
import { CoordinatePlane } from "./components/coordinate-plane";
import { Readouts } from "./components/readouts";
import { SelectionInfo } from "./components/selection-info";
import { Controls } from "./components/controls";
import { PlacementChallenge } from "./components/placement-challenge";
import { QuadrantChallenge } from "./components/quadrant-challenge";
import { LearningPanel } from "./components/learning-panel";

const INITIAL_POINT = { x: 3, y: 4 };
const ADVANCE_DELAY_MS = 1300;

type Selection = { type: "quadrant"; quadrant: Quadrant } | { type: "origin" } | null;

export function CoordinatePlaneExplorer() {
  const [point, setPoint] = useState(INITIAL_POINT);
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null);
  const [showGuides, setShowGuides] = useState(true);
  const [selection, setSelection] = useState<Selection>(null);

  const [placementStep, setPlacementStep] = useState(0);
  const [placementSolved, setPlacementSolved] = useState(false);
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [quadrantAnswered, setQuadrantAnswered] = useState<Quadrant | null>(null);

  const target = placementStep < PLACEMENT_CHALLENGES.length ? PLACEMENT_CHALLENGES[placementStep] ?? null : null;

  // Detects arrival at the current placement target. Depends only on
  // `point` (not `placementStep`) so it fires once per arrival, not
  // whenever a new target happens to already match the point.
  useEffect(() => {
    if (!target || placementSolved) return;
    if (point.x !== target.x || point.y !== target.y) return;

    setPlacementSolved(true);
    advanceTimeoutRef.current = setTimeout(() => {
      setPlacementSolved(false);
      setPlacementStep((s) => s + 1);
    }, ADVANCE_DELAY_MS);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [point]);

  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
    };
  }, []);

  const handlePointChange = (x: number, y: number) => setPoint({ x, y });

  const handleResetPoint = () => setPoint(INITIAL_POINT);

  const handleQuadrantClick = (quadrant: Quadrant) => setSelection({ type: "quadrant", quadrant });
  const handleOriginClick = () => setSelection({ type: "origin" });

  const handleQuadrantAnswer = (quadrant: Quadrant) => setQuadrantAnswered(quadrant);
  const handleQuadrantRestart = () => setQuadrantAnswered(null);

  const handlePlacementRestart = () => {
    if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
    setPlacementStep(0);
    setPlacementSolved(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="mx-auto aspect-square w-full max-w-[560px] rounded-[1.75rem] border border-line bg-white/70 p-3 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04] sm:p-5">
        <CoordinatePlane
          point={point}
          onPointChange={handlePointChange}
          onQuadrantClick={handleQuadrantClick}
          onOriginClick={handleOriginClick}
          onHoverChange={setHover}
          showGuides={showGuides}
          target={target}
        />
      </div>

      <Readouts point={point} hover={hover} />

      <SelectionInfo selection={selection} />

      <Controls onReset={handleResetPoint} showGuides={showGuides} onToggleGuides={() => setShowGuides((v) => !v)} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PlacementChallenge step={placementStep} solved={placementSolved} onRestart={handlePlacementRestart} />
        <QuadrantChallenge answered={quadrantAnswered} onAnswer={handleQuadrantAnswer} onRestart={handleQuadrantRestart} />
      </div>

      <LearningPanel />
    </div>
  );
}
