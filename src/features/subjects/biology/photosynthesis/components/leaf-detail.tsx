import { X } from "lucide-react";

export interface LeafDetailProps {
  onClose: () => void;
}

/**
 * The spec's "optional" leaf zoom, implemented as the simplest thing
 * that satisfies it: an inline card with the same four-line summary,
 * not a modal/overlay system. No new state beyond a single boolean in
 * the parent.
 */
export function LeafDetail({ onClose }: LeafDetailProps) {
  return (
    <div className="flex w-full max-w-md flex-col gap-3 rounded-[1.75rem] border border-line bg-white/70 p-6 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04]">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-lg font-medium text-ink dark:text-bone">Inside the leaf</h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close leaf detail"
          className="rounded-full p-1 text-ink-soft/70 transition-colors hover:bg-ink/[0.04] hover:text-ink dark:text-bone-soft/70 dark:hover:bg-bone/[0.06] dark:hover:text-bone"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
      <div className="flex flex-col items-center gap-1 text-center text-sm text-ink-soft dark:text-bone-soft">
        <span>Light + CO&#8322; + Water</span>
        <span className="text-subject-biology">↓</span>
        <span className="font-medium text-ink dark:text-bone">Photosynthesis</span>
        <span className="text-subject-biology">↓</span>
        <span>Glucose + Oxygen</span>
      </div>
    </div>
  );
}
