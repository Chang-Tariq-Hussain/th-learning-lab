/** Success / error banners driven by ?ok= / ?error= (set by server actions after a redirect). */
export function Flash({ ok, error }: { ok?: string; error?: string }) {
  return (
    <>
      {ok ? <p role="status" className="rounded-lg border border-pine-500/40 bg-pine-500/10 px-3 py-2 text-sm">{ok}</p> : null}
      {error ? <p role="alert" className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">{error}</p> : null}
    </>
  );
}
