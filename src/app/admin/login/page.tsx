import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { loginAction, logoutAction } from "../actions";
import { getAdminSession, getSignedInWithoutAccess } from "@/lib/admin/auth";
import { getAdminMode } from "@/lib/admin/mode";
import { safeNextPath } from "@/lib/admin/session";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const input = "mt-1 h-10 w-full rounded-lg border border-ink/15 bg-paper px-3 text-sm text-ink dark:border-bone/20 dark:bg-chalkboard dark:text-bone";
const button = "h-10 w-full rounded-lg bg-pine-600 text-sm font-medium text-paper hover:bg-pine-700 dark:bg-pine-500 dark:text-chalkboard";

export default async function AdminLoginPage({ searchParams }: { searchParams: { error?: string; next?: string } }) {
  const mode = getAdminMode();
  const next = safeNextPath(searchParams.next);

  if (mode === "accounts") {
    if (await getAdminSession()) redirect(next);
  }
  const noAccess = mode === "accounts" ? await getSignedInWithoutAccess() : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-5 text-ink dark:bg-chalkboard dark:text-bone">
      <div className="w-full max-w-sm rounded-2xl border border-ink/10 p-6 dark:border-bone/15">
        <h1 className="font-display text-xl font-medium">Admin sign in</h1>

        {mode === "off" ? (
          <div className="mt-4 space-y-2 text-sm" role="alert">
            <p>The admin area is switched off because it is not configured.</p>
            <p className="text-ink-soft dark:text-bone-soft">
              Set <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> for account sign-in (recommended), or — temporarily —{" "}
              <code className="font-mono">ADMIN_PASSWORD</code> and <code className="font-mono">ADMIN_SESSION_SECRET</code>. See <code className="font-mono">.env.example</code>, then restart.
            </p>
          </div>
        ) : noAccess ? (
          <div className="mt-4 space-y-3 text-sm" role="alert">
            <p>{noAccess.email ? <><strong>{noAccess.email}</strong> is signed in</> : "This account is signed in"}, but it has no admin access.</p>
            <p className="text-ink-soft dark:text-bone-soft">Ask a super admin to grant you a role, or sign in with a different account.</p>
            <form action={logoutAction}><button type="submit" className={button}>Sign out</button></form>
          </div>
        ) : (
          <form action={loginAction} className="mt-4 space-y-4">
            <input type="hidden" name="next" value={next} />
            {mode === "accounts" ? (
              <div>
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <input id="email" name="email" type="email" autoComplete="username" required className={input} />
              </div>
            ) : null}
            <div>
              <label htmlFor="password" className="text-sm font-medium">{mode === "accounts" ? "Password" : "Admin password"}</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required className={input} />
            </div>
            {searchParams.error === "1" ? <p role="alert" className="text-sm text-red-600 dark:text-red-400">{mode === "accounts" ? "Email or password not accepted." : "That password was not accepted."}</p> : null}
            {searchParams.error === "noaccess" ? <p role="alert" className="text-sm text-red-600 dark:text-red-400">That account has no admin access.</p> : null}
            <button type="submit" className={button}>Sign in</button>
            {mode === "password" ? <p className="text-xs text-ink-soft dark:text-bone-soft">Temporary shared-password sign-in. Configure Supabase to use individual accounts and roles.</p> : null}
          </form>
        )}
      </div>
    </div>
  );
}
