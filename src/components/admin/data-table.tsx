import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  /** Column heading on wide screens; also the label on each stacked card on phones. */
  header: string;
  cell: (row: T) => ReactNode;
  /** Width from `md` up, e.g. "md:w-28". Never applied to stacked cards. */
  width?: string;
  /** Extra classes for the cell (typography etc.). Do not put widths or alignment here. */
  className?: string;
  align?: "right";
  /** Keep the content on one line from `md` up (dates, IDs). */
  nowrap?: boolean;
  /** Stacked cards: show the content without a "Header" label above it (e.g. the main text, a checkbox). */
  hideLabel?: boolean;
  /**
   * Cards layout only: from `md` up, hide this column below the given width. Phones still show it on the
   * card. The caller must show the same information elsewhere in that range (it is never silently dropped).
   */
  hideBelow?: "lg" | "xl";
}

type Layout = "cards" | "scroll";

const HIDE_BELOW: Record<NonNullable<Column<unknown>["hideBelow"]>, string> = {
  lg: "md:hidden lg:table-cell",
  xl: "md:hidden xl:table-cell",
};
const HIDE_BELOW_HEADER: Record<NonNullable<Column<unknown>["hideBelow"]>, string> = {
  lg: "hidden lg:table-cell",
  xl: "hidden xl:table-cell",
};

/**
 * Server-rendered table; paging, sorting and filtering live in the URL.
 *
 * layout="cards" (default) — for text-heavy tables. Below `md` each row becomes a card with the column
 *   headings as labels; from `md` it is a normal table. It is the same markup either way (not two copies),
 *   so a row's checkbox or buttons exist exactly once. ARIA roles keep the table semantics when the browser
 *   no longer lays the elements out as a table.
 * layout="scroll" — for narrow numeric tables. Always a table, scrolling sideways inside its own bordered
 *   box (never the page), with the first column pinned so rows stay readable.
 */
export function DataTable<T>({ caption, columns, rows, rowKey, empty, layout = "cards" }: { caption: string; columns: Column<T>[]; rows: T[]; rowKey: (row: T) => string; empty: ReactNode; layout?: Layout }) {
  const cards = layout === "cards";
  return (
    <div
      {...(cards ? {} : { role: "region", "aria-label": caption, tabIndex: 0 })}
      className={cn(
        "max-w-full",
        cards ? "md:overflow-x-auto md:rounded-xl md:border md:border-ink/10 md:dark:border-bone/15" : "overflow-x-auto rounded-xl border border-ink/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-bone/15",
      )}
    >
      <table role="table" className={cn("w-full border-collapse text-left text-sm", cards ? "block md:table md:min-w-[600px]" : "min-w-[560px]")}>
        <caption className="sr-only">{caption}</caption>
        <thead role="rowgroup" className={cn("bg-ink/[0.03] dark:bg-bone/[0.05]", cards && "sr-only md:not-sr-only md:table-header-group")}>
          <tr role="row" className={cards ? "md:table-row" : undefined}>
            {columns.map((c, i) => (
              <th
                key={c.key}
                role="columnheader"
                scope="col"
                className={cn(
                  "px-3 py-2.5 font-mono text-label font-medium uppercase tracking-wide text-ink-soft dark:text-bone-soft",
                  c.align === "right" ? "text-right" : "text-left",
                  cards && c.width,
                  cards && c.hideBelow && HIDE_BELOW_HEADER[c.hideBelow],
                  !cards && i === 0 && "sticky left-0 z-10 bg-paper dark:bg-chalkboard",
                )}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody role="rowgroup" className={cn(cards ? "block space-y-3 md:table-row-group md:space-y-0 md:divide-y md:divide-ink/10 md:dark:divide-bone/10" : "divide-y divide-ink/10 dark:divide-bone/10")}>
          {rows.length === 0 ? (
            <tr role="row" className={cards ? "block rounded-xl border border-ink/10 md:table-row md:rounded-none md:border-0 dark:border-bone/15" : undefined}>
              <td role="cell" colSpan={columns.length} className={cn("px-3 py-8 text-center text-ink-soft dark:text-bone-soft", cards && "block md:table-cell")}>{empty}</td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr
                key={rowKey(r)}
                role="row"
                className={cn("align-top", cards && "block rounded-xl border border-ink/10 bg-paper p-4 md:table-row md:rounded-none md:border-0 md:bg-transparent md:p-0 dark:border-bone/15 dark:bg-chalkboard")}
              >
                {columns.map((c, i) => (
                  <td
                    key={c.key}
                    role="cell"
                    {...(cards && !c.hideLabel ? { "data-label": c.header } : {})}
                    className={cn(
                      cards ? "text-ink [overflow-wrap:anywhere] dark:text-bone" : "text-ink break-words dark:text-bone",
                      cards
                        ? cn(
                            "block py-1.5 md:table-cell md:px-3 md:py-3",
                            !c.hideLabel && "before:mb-0.5 before:block before:font-mono before:text-label before:uppercase before:tracking-wide before:text-ink-soft before:content-[attr(data-label)] md:before:hidden dark:before:text-bone-soft",
                            c.width,
                            c.nowrap && "md:whitespace-nowrap",
                            c.align === "right" && "md:text-right",
                            c.hideBelow && HIDE_BELOW[c.hideBelow],
                          )
                        : cn("px-3 py-3", c.align === "right" && "text-right", c.nowrap && "whitespace-nowrap", i === 0 && "sticky left-0 z-10 bg-paper dark:bg-chalkboard"),
                      c.className,
                    )}
                  >
                    {c.cell(r)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

/** A distinct, helpful empty state: say what is empty, why, and what to do next. */
export function EmptyState({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-2 py-4 text-center">
      <p className="font-medium text-ink dark:text-bone">{title}</p>
      {hint ? <p className="text-helper text-ink-soft dark:text-bone-soft">{hint}</p> : null}
      {action}
    </div>
  );
}

/** Placeholder rows while a table's data loads (used by loading.tsx and Suspense fallbacks). */
export function TableSkeleton({ rows = 6, label = "Loading…" }: { rows?: number; label?: string }) {
  return (
    <div role="status" aria-busy="true" className="space-y-3">
      <span className="sr-only">{label}</span>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} aria-hidden="true" className="h-14 animate-pulse rounded-xl bg-ink/[0.06] dark:bg-bone/[0.08]" />
      ))}
    </div>
  );
}
