import { redirect } from "next/navigation";

/**
 * Admin mutations are server actions that finish with a redirect carrying one message. The message is only
 * ever produced AFTER the database/server has answered, so "ok" always means the change was confirmed.
 *   ok    — the change was made
 *   info  — nothing wrong, nothing changed (or work continues in the background)
 *   warn  — partly done
 *   error — nothing was changed
 */
export type FlashKind = "ok" | "info" | "warn" | "error";

export const FLASH_PARAMS = ["ok", "info", "warn", "error", "err"] as const;

export const GENERIC_FAILURE = "Something went wrong and nothing was changed. Please try again.";

export function flashUrl(path: string, kind: FlashKind, message: string, max = 300): string {
  return `${path}${path.includes("?") ? "&" : "?"}${kind}=${encodeURIComponent(message.slice(0, max))}`;
}

export function flashRedirect(path: string, kind: FlashKind, message: string, max = 300): never {
  return redirect(flashUrl(path, kind, message, max));
}

/** redirect(), notFound() and friends work by throwing; they must never be mistaken for failures. */
function isFrameworkSignal(e: unknown): boolean {
  const digest = typeof e === "object" && e !== null && "digest" in e ? String((e as { digest: unknown }).digest) : "";
  return /^(NEXT_|DYNAMIC_SERVER_USAGE|BAILOUT_TO_CLIENT_SIDE_RENDERING)/.test(digest);
}

/**
 * Runs a server action body so an unexpected throw (network failure, parse error…) becomes a clear error
 * message instead of an error page. Detail goes to the server log only — never to the browser.
 * Pass `onFail` to keep what the person typed (see the draft helpers); it must itself redirect.
 */
export async function guardAction(returnTo: string, run: () => Promise<void>, onFail?: (message: string) => never): Promise<void> {
  try {
    await run();
  } catch (e) {
    if (isFrameworkSignal(e)) throw e;
    console.error("[admin] unexpected action failure:", e);
    if (onFail) onFail(GENERIC_FAILURE);
    flashRedirect(returnTo, "error", GENERIC_FAILURE);
  }
}
