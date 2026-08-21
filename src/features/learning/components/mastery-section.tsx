import { CheckCircle2, MinusCircle, TrendingUp, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLearningProgress } from "@/hooks/use-learning-progress";
import { computeTopicBreakdown, isTopicComplete } from "../mastery";
import { MasteryBadge } from "./mastery-badge";
import { SectionShell } from "./section-shell";
import type { TopicContent } from "../types";
import type { StepBreakdownEntry, StepStatus } from "../mastery";

const STATUS_ICON: Record<StepStatus, typeof CheckCircle2> = {
  strong: CheckCircle2,
  developing: TrendingUp,
  "needs-practice": TrendingUp,
  "not-started": MinusCircle,
};

const STATUS_STYLE: Record<StepStatus, string> = {
  strong: "text-pine-600 dark:text-pine-300",
  developing: "text-[#B8862C]",
  "needs-practice": "text-[#E0663D]",
  "not-started": "text-ink-soft dark:text-bone-soft",
};

function BreakdownRow({ entry }: { entry: StepBreakdownEntry }) {
  const Icon = STATUS_ICON[entry.status];
  return (
    <div className="flex items-start gap-3 rounded-card border border-line bg-white/60 p-3.5 dark:border-line-dark dark:bg-white/[0.03]">
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", STATUS_STYLE[entry.status])} strokeWidth={1.75} aria-hidden="true" />
      <div>
        <p className="text-sm font-medium text-ink dark:text-bone">{entry.label}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">{entry.detail}</p>
      </div>
    </div>
  );
}

export interface MasterySectionProps {
  content: TopicContent;
  className?: string;
}

/**
 * MASTERY — the topic's final section, always visible. Reads
 * `TopicProgress` for this topic (via `useLearningProgress`) and
 * shows: the overall mastery badge, a completion note, and a per-step
 * breakdown so the student can see exactly what they've done well and
 * what still needs practice, rather than a single opaque score.
 */
export function MasterySection({ content, className }: MasterySectionProps) {
  const { getTopicProgress, getMasteryLevel } = useLearningProgress();
  const progress = getTopicProgress(content.subjectSlug, content.topicSlug);
  const masteryLevel = getMasteryLevel(content.subjectSlug, content.topicSlug);
  const complete = isTopicComplete(content, progress);
  const breakdown = computeTopicBreakdown(content, progress);

  const needsPractice = breakdown.filter((entry) => entry.status === "needs-practice" || entry.status === "developing");
  const strong = breakdown.filter((entry) => entry.status === "strong");

  return (
    <SectionShell icon={<Trophy className="h-4 w-4" strokeWidth={1.75} />} label="Mastery" colorToken={content.colorToken} className={className}>
      <div className="flex flex-wrap items-center gap-3">
        <MasteryBadge level={masteryLevel} colorToken={content.colorToken} />
        <p className="text-sm text-ink-soft dark:text-bone-soft">
          {complete
            ? "You've completed every step of this topic's learning journey."
            : "Complete the remaining steps above to reach mastery."}
        </p>
      </div>

      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {breakdown.map((entry) => (
          <BreakdownRow key={entry.step} entry={entry} />
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-1 text-sm leading-relaxed">
        <p className="text-ink-soft dark:text-bone-soft">
          <span className="font-medium text-ink dark:text-bone">Doing well: </span>
          {strong.length > 0 ? strong.map((entry) => entry.label).join(", ") : "Nothing yet — start with Learn above."}
        </p>
        <p className="text-ink-soft dark:text-bone-soft">
          <span className="font-medium text-ink dark:text-bone">Needs more practice: </span>
          {needsPractice.length > 0 ? needsPractice.map((entry) => entry.label).join(", ") : "Nothing right now."}
        </p>
      </div>
    </SectionShell>
  );
}
