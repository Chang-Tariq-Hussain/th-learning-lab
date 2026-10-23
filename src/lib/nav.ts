/**
 * Active-route matching shared by the learner header and the admin navigation.
 * Matches whole path segments, never substrings: `/admin/questions` is active on
 * `/admin/questions/123` but `/admin/q` is not active on `/admin/questions`, and `/dashboard` (exact)
 * is not active on every page below it.
 */
const clean = (p: string): string => {
  const path = (p.split(/[?#]/)[0] ?? "").replace(/\/+$/, "");
  return path === "" ? "/" : path;
};

export function isNavActive(pathname: string | null | undefined, href: string, exact = false): boolean {
  if (!pathname) return false;
  const here = clean(pathname);
  const target = clean(href);
  if (here === target) return true;
  if (exact || target === "/") return false;
  return here.startsWith(`${target}/`);
}
