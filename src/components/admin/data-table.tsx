import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  cell: (row: T) => ReactNode;
}

/** Plain, server-rendered table. Paging/sorting/filtering happen in the URL, never in the browser. */
export function DataTable<T>({ caption, columns, rows, rowKey, empty }: { caption: string; columns: Column<T>[]; rows: T[]; rowKey: (row: T) => string; empty: string }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-ink/10 dark:border-bone/15">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-ink/[0.03] dark:bg-bone/[0.05]">
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col" className={cn("px-3 py-2 font-mono text-[11px] font-medium uppercase tracking-wide text-ink-soft dark:text-bone-soft", c.className)}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/10 dark:divide-bone/10">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-3 py-8 text-center text-ink-soft dark:text-bone-soft">{empty}</td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={rowKey(r)} className="align-top">
                {columns.map((c) => (
                  <td key={c.key} className={cn("px-3 py-2.5 text-ink dark:text-bone", c.className)}>{c.cell(r)}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
