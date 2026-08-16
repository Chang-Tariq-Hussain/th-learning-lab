import { ARRHENIUS_ACID_DEFINITION, ARRHENIUS_BASE_DEFINITION, ION_COLOR } from "../arrhenius-model";

/** The core Arrhenius definitions, shown together so students see the acid/base contrast side by side. */
export function ArrheniusExplanation() {
  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03] sm:p-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">Arrhenius Theory</p>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-card border border-line p-3 dark:border-line-dark">
          <p className="font-display text-sm font-medium" style={{ color: ION_COLOR["h-plus"] }}>
            Arrhenius Acid
          </p>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{ARRHENIUS_ACID_DEFINITION}</p>
        </div>
        <div className="rounded-card border border-line p-3 dark:border-line-dark">
          <p className="font-display text-sm font-medium" style={{ color: ION_COLOR["oh-minus"] }}>
            Arrhenius Base
          </p>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{ARRHENIUS_BASE_DEFINITION}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-sm">
        <span>
          Acid <span className="text-ink-soft dark:text-bone-soft">&rarr;</span>{" "}
          <strong style={{ color: ION_COLOR["h-plus"] }}>H⁺</strong>
        </span>
        <span>
          Base <span className="text-ink-soft dark:text-bone-soft">&rarr;</span>{" "}
          <strong style={{ color: ION_COLOR["oh-minus"] }}>OH⁻</strong>
        </span>
      </div>
    </div>
  );
}
