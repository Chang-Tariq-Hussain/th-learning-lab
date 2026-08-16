"use client";

import type { ReactNode } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { simplifyRatio } from "../ratio-utils";
import type { RatioChallenge } from "../challenges";

export interface ExplanationPanelProps {
  blueCount: number;
  redCount: number;
  challenge: RatioChallenge | null;
  celebrating: boolean;
  onStartPractice: () => void;
  onNewChallenge: () => void;
  onStopPractice: () => void;
}

export function ExplanationPanel({
  blueCount,
  redCount,
  challenge,
  celebrating,
  onStartPractice,
  onNewChallenge,
  onStopPractice,
}: ExplanationPanelProps) {
  const hasObjects = blueCount > 0 && redCount > 0;
  const simplified = simplifyRatio(blueCount, redCount);

  return (
    <div className="flex flex-col gap-4">
      {/* What is a ratio */}
      <Panel>
        <PanelTitle>What is a ratio?</PanelTitle>
        <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
          A ratio compares two quantities — here, how many blue circles there are next to how many red circles.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink dark:text-bone">
          {hasObjects ? (
            <>
              You have <Amount color="#3D5AFE">{blueCount}</Amount> blue and{" "}
              <Amount color="#E0524F">{redCount}</Amount> red — a ratio of{" "}
              <strong className="font-semibold">
                {blueCount} : {redCount}
              </strong>
              .
            </>
          ) : (
            "Add at least one blue and one red circle to see a ratio."
          )}
        </p>
      </Panel>

      {/* Simplification */}
      {hasObjects && (
        <Panel>
          <PanelTitle>Simplifying</PanelTitle>
          {simplified.alreadySimplest ? (
            <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
              <strong className="font-semibold text-ink dark:text-bone">
                {blueCount} : {redCount}
              </strong>{" "}
              is already in its simplest form — 1 is the only number that divides both evenly.
            </p>
          ) : (
            <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
              <strong className="font-semibold text-ink dark:text-bone">
                {blueCount} : {redCount}
              </strong>{" "}
              simplifies to{" "}
              <strong className="font-semibold text-subject-math">
                {simplified.a} : {simplified.b}
              </strong>{" "}
              because {simplified.divisor} is the largest number that divides both {blueCount} and {redCount}{" "}
              evenly.
            </p>
          )}
        </Panel>
      )}

      {/* Practice mode */}
      <Panel>
        <PanelTitle>Practice</PanelTitle>
        {!challenge ? (
          <>
            <p className="mb-4 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
              Try matching a target ratio by adding and removing circles.
            </p>
            <Button size="sm" onClick={onStartPractice} className="w-full">
              Start a challenge
            </Button>
          </>
        ) : (
          <>
            <div
              role="status"
              className={cn(
                "mb-4 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition-colors duration-300",
                celebrating
                  ? "bg-subject-chemistry-soft text-subject-chemistry dark:bg-subject-chemistry/15"
                  : "bg-subject-math-soft text-subject-math dark:bg-subject-math/15",
              )}
            >
              {celebrating ? (
                <>
                  <CheckCircle2 className="h-4 w-4 shrink-0" strokeWidth={2} />
                  That matches — nice work!
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 shrink-0" strokeWidth={2} />
                  Make a ratio of {challenge.a} : {challenge.b}
                </>
              )}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={onNewChallenge} className="flex-1">
                New challenge
              </Button>
              <Button size="sm" variant="ghost" onClick={onStopPractice}>
                Stop
              </Button>
            </div>
          </>
        )}
      </Panel>
    </div>
  );
}

function Panel({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[1.5rem] border border-line bg-white/70 p-5 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04]">
      {children}
    </div>
  );
}

function PanelTitle({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft dark:text-bone-soft">
      {children}
    </p>
  );
}

function Amount({ color, children }: { color: string; children: ReactNode }) {
  return (
    <strong className="font-semibold" style={{ color }}>
      {children}
    </strong>
  );
}
