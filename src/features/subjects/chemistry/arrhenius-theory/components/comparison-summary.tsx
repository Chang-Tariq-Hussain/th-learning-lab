import { FOCUS_STATEMENT, ION_COLOR } from "../arrhenius-model";

/** The spec's short bottom summary — ACID ↓ H⁺ increases / BASE ↓ OH⁻ increases, plus one focusing sentence. */
export function ComparisonSummary() {
  return (
    <div className="rounded-card border border-line bg-white/60 p-4 text-center dark:border-line-dark dark:bg-white/[0.03] sm:p-5">
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
        <div className="flex flex-col items-center gap-1">
          <span className="font-mono text-xs font-medium uppercase tracking-wide" style={{ color: ION_COLOR["h-plus"] }}>
            Acid
          </span>
          <span aria-hidden style={{ color: ION_COLOR["h-plus"] }}>
            &darr;
          </span>
          <span className="font-mono text-sm" style={{ color: ION_COLOR["h-plus"] }}>
            H⁺ increases
          </span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="font-mono text-xs font-medium uppercase tracking-wide" style={{ color: ION_COLOR["oh-minus"] }}>
            Base
          </span>
          <span aria-hidden style={{ color: ION_COLOR["oh-minus"] }}>
            &darr;
          </span>
          <span className="font-mono text-sm" style={{ color: ION_COLOR["oh-minus"] }}>
            OH⁻ increases
          </span>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{FOCUS_STATEMENT}</p>
    </div>
  );
}
