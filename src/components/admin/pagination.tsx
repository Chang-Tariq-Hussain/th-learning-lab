import Link from "next/link";
import { cn } from "@/lib/utils";

export function buildQuery(base: string, params: Record<string, string | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) sp.set(k, v);
  const q = sp.toString();
  return q ? `${base}?${q}` : base;
}

export function Pagination({ base, params, page, pageCount, total, pageSize }: { base: string; params: Record<string, string | undefined>; page: number; pageCount: number; total: number; pageSize: number }) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  const link = (p: number): string => buildQuery(base, { ...params, page: p > 1 ? String(p) : undefined });
  const cls = "rounded-lg border border-ink/15 px-3 py-1.5 text-sm text-ink hover:border-pine-500 dark:border-bone/20 dark:text-bone";
  return (
    <nav aria-label="Pagination" className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-ink-soft dark:text-bone-soft">
      <p>{total === 0 ? "No results" : `Showing ${from}–${to} of ${total}`}</p>
      <div className="flex items-center gap-2">
        {page > 1 ? <Link href={link(page - 1)} className={cls} rel="prev">Previous</Link> : <span className={cn(cls, "pointer-events-none opacity-40")} aria-disabled="true">Previous</span>}
        <span aria-current="page">Page {page} of {Math.max(pageCount, 1)}</span>
        {page < pageCount ? <Link href={link(page + 1)} className={cls} rel="next">Next</Link> : <span className={cn(cls, "pointer-events-none opacity-40")} aria-disabled="true">Next</span>}
      </div>
    </nav>
  );
}
