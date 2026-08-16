"use client";

import { useState } from "react";
import { LevelNav } from "./components/level-nav";
import { Level1Rate } from "./components/level-1-rate";
import { Level2Collisions } from "./components/level-2-collisions";
import { Level3Successful } from "./components/level-3-successful";
import { Level4Concentration } from "./components/level-4-concentration";
import { Level5Temperature } from "./components/level-5-temperature";
import { Level6SurfaceArea } from "./components/level-6-surface-area";
import { Level7Progress } from "./components/level-7-progress";
import { Level8Compare } from "./components/level-8-compare";
import { Level9Catalyst } from "./components/level-9-catalyst";
import { Level10Experiment } from "./components/level-10-experiment";
import { Level11Challenge } from "./components/level-11-challenge";
import { LEVELS } from "./model";

const LEVEL_COMPONENTS = [
  Level1Rate,
  Level2Collisions,
  Level3Successful,
  Level4Concentration,
  Level5Temperature,
  Level6SurfaceArea,
  Level7Progress,
  Level8Compare,
  Level9Catalyst,
  Level10Experiment,
  Level11Challenge,
];

/**
 * Reaction Kinetics — Understanding Reaction Rates.
 *
 * An eleven-level walkthrough of collision theory: what reaction rate is,
 * why some collisions succeed and others don't, and how concentration,
 * temperature, surface area, and catalysts each change that rate. Every
 * level shares the same particle-chamber engine (see hooks/use-reaction-chamber),
 * so only one concept is on screen at a time — matching the app's existing
 * Next Concept / Back / Reset navigation pattern.
 */
export function ReactionKinetics() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  const CurrentLevel = LEVEL_COMPONENTS[levelIndex] ?? LEVEL_COMPONENTS[0]!;

  const handleNext = () => setLevelIndex((i) => Math.min(i + 1, LEVELS.length - 1));
  const handleBack = () => setLevelIndex((i) => Math.max(i - 1, 0));
  const handleReset = () => {
    setLevelIndex(0);
    setResetKey((k) => k + 1);
  };

  return (
    <div className="flex flex-col gap-6">
      <LevelNav levelIndex={levelIndex} onNext={handleNext} onBack={handleBack} onReset={handleReset} />
      <div key={`${levelIndex}-${resetKey}`}>
        <CurrentLevel />
      </div>
    </div>
  );
}
