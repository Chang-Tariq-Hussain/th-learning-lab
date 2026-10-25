import { NavLink } from "./list-nav";
import { cn } from "@/lib/utils";
import { linkBtnCls } from "./form-styles";

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
  const cls = `${linkBtnCls} min-w-[5.5rem] text-ink dark:text-bone`;
  return (
    <nav aria-label="Pagination" className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-ink-soft dark:text-bone-soft">
      <p>{total === 0 ? "No results" : `Showing ${from}–${to} of ${total}`}</p>
      <div className="flex items-center gap-2">
        {page > 1 ? <NavLink href={link(page - 1)} className={cls} rel="prev">Previous</NavLink> : <span className={cn(cls, "pointer-events-none opacity-40")} aria-disabled="true">Previous</span>}
        <span aria-current="page">Page {page} of {Math.max(pageCount, 1)}</span>
        {page < pageCount ? <NavLink href={link(page + 1)} className={cls} rel="next">Next</NavLink> : <span className={cn(cls, "pointer-events-none opacity-40")} aria-disabled="true">Next</span>}
      </div>
    </nav>
  );
}
