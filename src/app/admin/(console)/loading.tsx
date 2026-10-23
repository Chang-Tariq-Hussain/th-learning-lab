import { TableSkeleton } from "@/components/admin/data-table";

/** Shown while an admin page's data loads, so the content area is never blank or showing a false empty state. */
export default function AdminLoading() {
  return (
    <div className="space-y-5" role="status" aria-busy="true">
      <span className="sr-only">Loading…</span>
      <div aria-hidden="true" className="space-y-2">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-ink/[0.06] dark:bg-bone/[0.08]" />
        <div className="h-4 w-full max-w-md animate-pulse rounded bg-ink/[0.06] dark:bg-bone/[0.08]" />
      </div>
      <TableSkeleton rows={6} label="Loading the table…" />
    </div>
  );
}
