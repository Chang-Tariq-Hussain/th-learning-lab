"use client";

import { useTransition, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { fieldCls, labelCls } from "./form-styles";

export interface FilterField {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  value: string;
}

/**
 * Filters live in the URL, so views are shareable. It is still a plain GET form (works without JavaScript);
 * with JavaScript the navigation runs in a transition, so "Apply" shows a spinner until the new results arrive.
 */
export function FilterBar({ action, fields, q, qLabel, qPlaceholder, label = "Filter results" }: { action: string; fields: FilterField[]; q: string; qLabel: string; qPlaceholder: string; label?: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const active = q !== "" || fields.some((f) => f.value !== "");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const sp = new URLSearchParams();
    for (const [k, v] of new FormData(e.currentTarget).entries()) if (typeof v === "string" && v.trim() !== "") sp.set(k, v.trim());
    const qs = sp.toString();
    startTransition(() => router.push(qs ? `${action}?${qs}` : action));
  };

  return (
    <form method="get" action={action} onSubmit={onSubmit} aria-busy={pending} className="flex flex-wrap items-end gap-3" role="search" aria-label={label}>
      <div className="min-w-[200px] flex-1">
        <label htmlFor="flt-q" className={labelCls}>{qLabel}</label>
        <input id="flt-q" name="q" defaultValue={q} placeholder={qPlaceholder} className={`${fieldCls} w-full`} />
      </div>
      {fields.map((f) => (
        <div key={f.name} className="min-w-[8rem] max-sm:flex-1">
          <label htmlFor={`flt-${f.name}`} className={labelCls}>{f.label}</label>
          <select id={`flt-${f.name}`} name={f.name} defaultValue={f.value} className={`${fieldCls} w-full`}>
            <option value="">All</option>
            {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      ))}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-pine-600 px-4 text-sm font-medium text-paper hover:bg-pine-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 md:min-h-9 dark:bg-pine-500 dark:text-chalkboard"
      >
        {pending ? <Spinner /> : null}
        {pending ? "Applying…" : "Apply"}
      </button>
      {active ? <Link href={action} className="inline-flex min-h-11 items-center text-sm text-ink-soft underline md:min-h-9 dark:text-bone-soft">Clear</Link> : null}
    </form>
  );
}
