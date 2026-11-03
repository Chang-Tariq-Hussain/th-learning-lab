"use client";

/** Plain-language explanation of what the last edit changed, plus any shell message. Read out politely by screen readers. */
export function ChangeNote({ changes, shellMessage }: { changes: string[]; shellMessage: string | null }) {
  return (
    <div aria-live="polite" className="rounded-lg border border-dashed border-pine-500/40 bg-pine-50 px-3 py-2.5 text-sm text-pine-900 dark:border-pine-300/25 dark:bg-pine-900/20 dark:text-pine-50">
      <p className="font-medium">{changes.length > 0 ? "What just changed" : "Try it"}</p>
      {changes.length > 0 ? (
        <ul className="mt-1 flex flex-col gap-1">
          {changes.map((c) => (
            <li key={c}>{c}</li>
          ))}
          {shellMessage ? <li>{shellMessage}</li> : null}
        </ul>
      ) : (
        <p className="mt-1">Add or remove a particle, pick an element or load a preset. This box explains what changes and why.</p>
      )}
    </div>
  );
}
