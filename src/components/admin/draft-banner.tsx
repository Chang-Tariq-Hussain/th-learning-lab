import { discardDraftAction } from "@/app/admin/(console)/questions/actions";

/** Shown above a form that was refilled from a failed save. */
export function DraftBanner({ returnTo, stale }: { returnTo: string; stale?: boolean }) {
  return (
    <div role="status" className="flex flex-wrap items-center gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
      <p>
        The save did not go through, so the form below is refilled with <strong>your unsaved edits</strong>.
        {stale ? " If someone else changed this question, saving again will replace their change with yours." : ""}
      </p>
      <form action={discardDraftAction}><input type="hidden" name="to" value={returnTo} />
        <button className="rounded-lg border border-ink/15 px-3 py-1 text-xs hover:border-pine-500 dark:border-bone/20">Discard my edits</button></form>
    </div>
  );
}
