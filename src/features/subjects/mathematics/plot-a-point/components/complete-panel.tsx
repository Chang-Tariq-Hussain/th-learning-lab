import { Button } from "@/components/ui/button";
import { quadrantOf, QUADRANT_INFO } from "../model";

interface CompletePanelProps {
  finalTarget: { x: number; y: number };
  correct: number;
  total: number;
  onReset: () => void;
}

export function CompletePanel({ finalTarget, correct, total, onReset }: CompletePanelProps) {
  const quadrant = quadrantOf(finalTarget.x, finalTarget.y);

  return (
    <div className="mx-auto flex w-full max-w-[560px] flex-col items-center gap-4 rounded-[1.75rem] border border-line bg-white/70 p-8 text-center shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04]">
      <p className="font-display text-2xl font-semibold text-ink dark:text-bone">🎉 Correct!</p>
      <p className="text-sm text-ink-soft dark:text-bone-soft">
        You successfully plotted a point in {quadrant ? QUADRANT_INFO[quadrant].title : "the plane"}.
      </p>
      <p className="font-mono text-xs text-ink-soft dark:text-bone-soft">
        Correct: {correct} / {total}
      </p>
      <Button onClick={onReset} size="lg">
        Play Again
      </Button>
    </div>
  );
}
