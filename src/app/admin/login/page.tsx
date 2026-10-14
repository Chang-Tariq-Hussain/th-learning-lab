import type { Metadata } from "next";
import { loginAction } from "../actions";
import { getAdminConfig } from "@/lib/admin/session";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function AdminLoginPage({ searchParams }: { searchParams: { error?: string; next?: string } }) {
  const configured = getAdminConfig() !== null;
  const input = "mt-1 h-10 w-full rounded-lg border border-ink/15 bg-paper px-3 text-sm text-ink dark:border-bone/20 dark:bg-chalkboard dark:text-bone";
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-5 text-ink dark:bg-chalkboard dark:text-bone">
      <div className="w-full max-w-sm rounded-2xl border border-ink/10 p-6 dark:border-bone/15">
        <h1 className="font-display text-xl font-medium">Admin sign in</h1>
        {!configured ? (
          <div className="mt-4 space-y-2 text-sm" role="alert">
            <p>The admin area is switched off because it is not configured.</p>
            <p className="text-ink-soft dark:text-bone-soft">
              Set <code className="font-mono">ADMIN_PASSWORD</code> (12+ characters) and <code className="font-mono">ADMIN_SESSION_SECRET</code> (32+ random characters) in the environment — see <code className="font-mono">.env.example</code> — then restart.
            </p>
          </div>
        ) : (
          <form action={loginAction} className="mt-4 space-y-4">
            <input type="hidden" name="next" value={searchParams.next ?? ""} />
            <div>
              <label htmlFor="password" className="text-sm font-medium">Admin password</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required className={input} />
            </div>
            {searchParams.error === "1" ? <p role="alert" className="text-sm text-red-600 dark:text-red-400">That password was not accepted.</p> : null}
            <button type="submit" className="h-10 w-full rounded-lg bg-pine-600 text-sm font-medium text-paper hover:bg-pine-700 dark:bg-pine-500 dark:text-chalkboard">Sign in</button>
          </form>
        )}
      </div>
    </div>
  );
}
