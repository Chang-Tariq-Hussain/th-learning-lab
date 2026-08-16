/**
 * The spec's "very small connection" to Photosynthesis — plain text,
 * not a second equation renderer or a second simulation, just a
 * two-line contrast plus one sentence tying them together.
 */
export function ConnectionNote() {
  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-2 rounded-[1.75rem] border border-line bg-white/60 px-6 py-5 text-center dark:border-line-dark dark:bg-white/[0.03]">
      <div className="flex flex-col gap-1 text-xs text-ink-soft dark:text-bone-soft sm:flex-row sm:gap-6">
        <p>
          <span className="font-medium text-ink dark:text-bone">Photosynthesis: </span>
          CO&#8322; + Water + Light &rarr; Glucose + O&#8322;
        </p>
        <p>
          <span className="font-medium text-ink dark:text-bone">Cellular Respiration: </span>
          Glucose + O&#8322; &rarr; Energy + CO&#8322; + Water
        </p>
      </div>
      <p className="text-sm font-medium text-subject-biology">
        Photosynthesis and cellular respiration are connected.
      </p>
    </div>
  );
}
