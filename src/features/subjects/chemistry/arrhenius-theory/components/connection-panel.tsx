import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ION_COLOR } from "../arrhenius-model";

const POINTS = [
  { text: "Acids → more H⁺", color: ION_COLOR["h-plus"] },
  { text: "Bases → more OH⁻", color: ION_COLOR["oh-minus"] },
  { text: "pH helps describe how acidic or basic an aqueous solution is.", color: ION_COLOR.spectator },
];

/** Ties this simulation back to Acids & Bases — The Basics, without re-teaching the pH scale. */
export function ConnectionPanel() {
  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03] sm:p-5">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">What did we learn?</p>
        <Link
          href="/dashboard/chemistry/acids-bases-basics"
          className="flex items-center gap-1 text-xs font-medium text-subject-chemistry transition-colors hover:text-pine-700 dark:hover:text-pine-300"
        >
          Open pH scale
          <ArrowRight className="h-3 w-3" strokeWidth={2} />
        </Link>
      </div>

      <ul className="mt-3 space-y-1.5">
        {POINTS.map((point) => (
          <li key={point.text} className="flex items-start gap-2 text-sm text-ink-soft dark:text-bone-soft">
            <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: point.color }} />
            {point.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
