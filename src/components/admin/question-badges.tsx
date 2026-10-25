import { CHECK_LABEL, SOURCE_LABEL, STATUS_LABEL, type AnswerCheck, type QuestionStatus, type SourceType } from "@/lib/questions/types";
import { cn } from "@/lib/utils";

const pill = "inline-flex items-center whitespace-nowrap rounded-full border px-2 py-0.5 font-mono text-label font-medium";
const SOURCE: Record<SourceType, string> = {
  verified_past_paper: "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300",
  existing_bank: "border-sky-500/40 bg-sky-500/10 text-sky-800 dark:text-sky-300",
  generated: "border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-300",
  platform_authored: "border-ink/15 bg-ink/[0.04] text-ink-soft dark:border-bone/20 dark:bg-bone/[0.06] dark:text-bone-soft",
};
const STATUS: Record<QuestionStatus, string> = {
  published: "border-pine-500/40 bg-pine-500/10 text-pine-700 dark:text-pine-100",
  draft: "border-ink/15 text-ink-soft dark:border-bone/20 dark:text-bone-soft",
  in_review: "border-violet-500/40 bg-violet-500/10 text-violet-800 dark:text-violet-300",
  archived: "border-ink/10 text-ink-soft line-through dark:border-bone/15 dark:text-bone-soft",
};

export const SourceBadge = ({ source }: { source: SourceType }) => <span className={cn(pill, SOURCE[source])}>{SOURCE_LABEL[source]}</span>;
export const StatusPill = ({ status }: { status: QuestionStatus }) => <span className={cn(pill, STATUS[status])}>{STATUS_LABEL[status]}</span>;
export const CheckText = ({ check }: { check: AnswerCheck }) => (
  <span className={cn("text-helper", check === "independently_checked" ? "text-emerald-800 dark:text-emerald-300" : "text-ink-soft dark:text-bone-soft")}>{CHECK_LABEL[check]}</span>
);
