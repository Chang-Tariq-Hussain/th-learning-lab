"use client";

import { createContext, useContext, useTransition, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { TableSkeleton } from "./data-table";
import { linkBtnCls } from "./form-styles";

/**
 * Pending feedback for list pages (question bank, health, audit).
 *
 * Paging, sorting and filtering only change the URL's query string. Next treats that as the same page, so
 * `loading.tsx` never shows. Instead, every control that changes the query goes through ONE transition owned here:
 *   <ListNav>   wraps the filter bar, sort links, results and pagination
 *   <NavLink>   a link that navigates inside the transition
 *   <Results>   shows a skeleton (never the empty state) while the next results load
 * Without JavaScript everything is still a normal link or GET form.
 */
interface Ctx { pending: boolean; navigate: (href: string) => void }
const ListNavContext = createContext<Ctx | null>(null);

export function useListNav(): Ctx | null {
  return useContext(ListNavContext);
}

export function ListNav({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const navigate = (href: string) => startTransition(() => router.push(href));
  return (
    <ListNavContext.Provider value={{ pending, navigate }}>
      {children}
      <span role="status" aria-live="polite" className="sr-only">{pending ? "Loading results…" : ""}</span>
    </ListNavContext.Provider>
  );
}

type NavLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

/** A normal link (new tab, copy link, middle click all still work) that shows pending state for same-page navigation. */
export function NavLink({ href, onClick, children, ...rest }: NavLinkProps) {
  const ctx = useListNav();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || !ctx || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || rest.target === "_blank") return;
    e.preventDefault();
    ctx.navigate(href);
  };
  return (
    <Link href={href} onClick={handle} aria-disabled={ctx?.pending ? true : undefined} {...rest}>
      {children}
    </Link>
  );
}

/** Table + pagination region: a skeleton while loading, so a stale or empty-looking table is never shown. */
export function Results({ children, rows = 6 }: { children: ReactNode; rows?: number }) {
  const ctx = useListNav();
  if (ctx?.pending) return <TableSkeleton rows={rows} label="Loading results…" />;
  return <>{children}</>;
}

/** Error with a retry, for a list whose data could not be loaded. */
export function ListError({ message }: { message: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <div role="alert" className="flex flex-wrap items-center gap-3 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-800 dark:text-red-300">
      <AlertTriangle aria-hidden="true" className="h-5 w-5 shrink-0" strokeWidth={1.75} />
      <p className="min-w-0 flex-1 [overflow-wrap:anywhere]">{message}</p>
      <button type="button" disabled={pending} onClick={() => startTransition(() => router.refresh())} className={`${linkBtnCls} gap-2 disabled:opacity-60`}>
        {pending ? <Spinner /> : null}
        {pending ? "Retrying…" : "Try again"}
      </button>
    </div>
  );
}
