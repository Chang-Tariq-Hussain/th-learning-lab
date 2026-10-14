import Link from "next/link";

export interface FilterField {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  value: string;
}

/** A plain GET form: filters live in the URL, so views are shareable and need no client JavaScript. */
export function FilterBar({ action, fields, q, qLabel, qPlaceholder }: { action: string; fields: FilterField[]; q: string; qLabel: string; qPlaceholder: string }) {
  const field = "h-9 rounded-lg border border-ink/15 bg-paper px-2 text-sm text-ink dark:border-bone/20 dark:bg-chalkboard dark:text-bone";
  const label = "mb-1 block font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft";
  const active = q !== "" || fields.some((f) => f.value !== "");
  return (
    <form method="get" action={action} className="flex flex-wrap items-end gap-3" role="search" aria-label="Filter findings">
      <div className="min-w-[200px] flex-1">
        <label htmlFor="flt-q" className={label}>{qLabel}</label>
        <input id="flt-q" name="q" defaultValue={q} placeholder={qPlaceholder} className={`${field} w-full`} />
      </div>
      {fields.map((f) => (
        <div key={f.name}>
          <label htmlFor={`flt-${f.name}`} className={label}>{f.label}</label>
          <select id={`flt-${f.name}`} name={f.name} defaultValue={f.value} className={field}>
            <option value="">All</option>
            {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      ))}
      <button type="submit" className="h-9 rounded-lg bg-pine-600 px-4 text-sm font-medium text-paper hover:bg-pine-700 dark:bg-pine-500 dark:text-chalkboard">Apply</button>
      {active ? <Link href={action} className="h-9 content-center text-sm text-ink-soft underline dark:text-bone-soft">Clear</Link> : null}
    </form>
  );
}
