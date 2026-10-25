import { linkBtnPrimaryCls } from "@/components/admin/form-styles";
import { SubmitButton } from "@/components/admin/submit-button";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { loginAction, logoutAction } from "../actions";
import { getAdminSession, getSignedInWithoutAccess } from "@/lib/admin/auth";
import { getAdminMode } from "@/lib/admin/mode";
import { safeNextPath } from "@/lib/admin/session";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const input = "mt-1 w-full min-h-11 rounded-lg border border-ink/15 bg-paper px-3 text-base text-ink md:text-sm dark:border-bone/20 dark:bg-chalkboard dark:text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500";
const buttonCls = "w-full";

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
        ) : noAccess?.unavailable ? (
          <div className="mt-4 space-y-3 text-sm" role="alert">
            <p>We couldn&apos;t check your admin access because the database didn&apos;t respond.</p>
            <p className="text-ink-soft dark:text-bone-soft">You are still signed in{noAccess.email ? <> as <strong>{noAccess.email}</strong></> : null}. Try again in a moment.</p>
            <a href={`/admin/login?next=${encodeURIComponent(next)}`} className={`${linkBtnPrimaryCls} w-full justify-center`}>Try again</a>
            <form action={logoutAction}><SubmitButton variant="secondary" className={buttonCls} pendingLabel="Signing out…">Sign out</SubmitButton></form>
          </div>
        ) : noAccess ? (
          <div className="mt-4 space-y-3 text-sm" role="alert">
            <p>{noAccess.email ? <><strong>{noAccess.email}</strong> is signed in</> : "This account is signed in"}, but it has no admin access.</p>
            <p className="text-ink-soft dark:text-bone-soft">Ask a super admin to grant you a role, or sign in with a different account.</p>
            <form action={logoutAction}><SubmitButton variant="primary" className={buttonCls} pendingLabel="Signing out…">Sign out</SubmitButton></form>
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
              <input id="password" name="password" type="password" autoComplete="current-password" required className={input} aria-invalid={searchParams.error === "1" ? true : undefined} aria-describedby={searchParams.error === "1" ? "login-error" : undefined} />
            </div>
            {searchParams.error === "1" ? <p id="login-error" role="alert" className="text-sm text-red-700 dark:text-red-300">{mode === "accounts" ? "Email or password not accepted." : "That password was not accepted."}</p> : null}
            {searchParams.error === "unavailable" ? <p role="alert" className="text-sm text-red-700 dark:text-red-300">We couldn&apos;t reach the database to check your access. Nothing was changed; try again in a moment.</p> : null}
            {searchParams.error === "noaccess" ? <p role="alert" className="text-sm text-red-700 dark:text-red-300">That account has no admin access.</p> : null}
            <SubmitButton variant="primary" className={buttonCls} pendingLabel="Signing in…">Sign in</SubmitButton>
            {mode === "password" ? <p className="text-helper text-ink-soft dark:text-bone-soft">Temporary shared-password sign-in. Configure Supabase to use individual accounts and roles.</p> : null}
          </form>
        )}
      </div>
    </div>
  );
}
