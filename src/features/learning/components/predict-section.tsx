"use client";

import { useState, type ReactNode } from "react";
import { HelpCircle } from "lucide-react";
import { useLearningProgress } from "@/hooks/use-learning-progress";
import { SectionShell } from "./section-shell";
import { Prediction, type PredictionResult } from "./prediction";
import type { PredictSectionContent } from "../types";

export interface PredictSectionProps {
  subjectSlug: string;
  topicSlug: string;
  colorToken: string;
  content: PredictSectionContent;
  /** The live simulation, passed straight through to each
   *  `Prediction` as its "run the experiment" step. */
  experiment: ReactNode;
  className?: string;
}

/** PREDICT — the full section: intro copy plus one `Prediction` per
 *  scenario in this topic's set. Marks the step complete once every
 *  scenario has been revealed, and forwards each individual result to
 *  `useLearningProgress` for performance tracking. */
export function PredictSection({ subjectSlug, topicSlug, colorToken, content, experiment, className }: PredictSectionProps) {
  const { recordPrediction, completeStep } = useLearningProgress();
  const [recordedIds, setRecordedIds] = useState<Set<string>>(new Set());

  function handleRecord(result: PredictionResult) {
    recordPrediction(subjectSlug, topicSlug, result.isCorrect);
    setRecordedIds((prev) => {
      if (prev.has(result.scenarioId)) return prev;
      const next = new Set(prev);
      next.add(result.scenarioId);
      if (next.size === content.scenarios.length) {
        completeStep(subjectSlug, topicSlug, "predict");
      }
      return next;
    });
  }

  return (
    <SectionShell icon={<HelpCircle className="h-4 w-4" strokeWidth={1.75} />} label="Predict" colorToken={colorToken} className={className}>
      {content.intro ? <p className="mb-4 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{content.intro}</p> : null}
      <div className="flex flex-col gap-4">
        {content.scenarios.map((scenario) => (
          <Prediction key={scenario.id} scenario={scenario} colorToken={colorToken} experiment={experiment} onRecord={handleRecord} />
        ))}
      </div>
    </SectionShell>
  );
}
