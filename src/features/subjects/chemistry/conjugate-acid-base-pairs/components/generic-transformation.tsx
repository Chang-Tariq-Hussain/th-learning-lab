import { ACID_COLOR, BASE_COLOR } from "../model";

/** The two generic patterns every specific pair below is an example of — shown once, up top, so the specific examples read as "here's that same pattern again." */
export function GenericTransformation() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="rounded-card border border-line bg-white/60 p-4 text-center dark:border-line-dark dark:bg-white/[0.03]">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">Acid &rarr; Conjugate Base</p>
        <div className="mt-3 flex flex-col items-center gap-1 font-mono text-sm">
          <span className="rounded-full border-2 px-4 py-1.5 font-semibold" style={{ borderColor: ACID_COLOR, color: ACID_COLOR }}>
            HA
          </span>
          <span className="text-ink-soft dark:text-bone-soft">&darr; remove H⁺</span>
          <span className="rounded-full border-2 px-4 py-1.5 font-semibold" style={{ borderColor: BASE_COLOR, color: BASE_COLOR }}>
            A⁻
          </span>
        </div>
      </div>

      <div className="rounded-card border border-line bg-white/60 p-4 text-center dark:border-line-dark dark:bg-white/[0.03]">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">Base &rarr; Conjugate Acid</p>
        <div className="mt-3 flex flex-col items-center gap-1 font-mono text-sm">
          <span className="rounded-full border-2 px-4 py-1.5 font-semibold" style={{ borderColor: BASE_COLOR, color: BASE_COLOR }}>
            B
          </span>
          <span className="text-ink-soft dark:text-bone-soft">&darr; add H⁺</span>
          <span className="rounded-full border-2 px-4 py-1.5 font-semibold" style={{ borderColor: ACID_COLOR, color: ACID_COLOR }}>
            BH⁺
          </span>
        </div>
      </div>
    </div>
  );
}
