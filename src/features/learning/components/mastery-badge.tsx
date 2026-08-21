import { Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { resolveSubjectColors } from "@/features/subjects/subject-colors";
import type { MasteryLevel } from "../types";

const LEVEL_LABEL: Record<MasteryLevel, string> = {
  "not-started": "Not started",
  learning: "Learning",
  practicing: "Practicing",
  mastered: "Mastered",
};

export interface MasteryBadgeProps {
  level: MasteryLevel;
  colorToken: string;
  className?: string;
}

/** Reuses the existing `<Badge>` primitive, tinted by subject color
 *  (or a fixed "mastered" green, independent of subject, so mastery
 *  always reads as an achievement rather than blending into the
 *  subject's own palette). */
export function MasteryBadge({ level, colorToken, className }: MasteryBadgeProps) {
  const colors = resolveSubjectColors(colorToken);
  const mastered = level === "mastered";

  return (
    <Badge
      className={cn(
        "border-transparent",
        mastered ? "bg-pine-100 text-pine-700 dark:bg-pine-900/40 dark:text-pine-100" : cn(colors.bg, colors.text),
        className,
      )}
    >
      {mastered ? <Trophy className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" /> : null}
      {LEVEL_LABEL[level]}
    </Badge>
  );
}
