"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, X } from "lucide-react";
import { mainNav, siteConfig } from "@/config/site";
import { Container } from "@/components/ui/container";
import { NAV_ICONS } from "@/components/layout/nav-icons";
import { navIconActive, navIconCls, navIconInactive, navLinkActive, navLinkBase, navLinkInactive } from "@/components/layout/nav-styles";
import { isNavActive } from "@/lib/nav";
import { Logo } from "@/components/layout/logo";
import { HeaderSearch } from "@/components/layout/header-search";
import { MobileSearchModal } from "@/components/layout/mobile-search-modal";
import { UserMenu } from "@/components/layout/user-menu";
import { cn } from "@/lib/utils";

/**
 * Global header, split into two stacked rows so each row only has to
 * hold one job:
 *  - Top row: logo on the far left, search + avatar on the far right.
 *    Every screen size keeps the same three elements in the same
 *    place -- nothing here moves or duplicates across breakpoints.
 *  - Bottom row: the primary nav links (`mainNav`), horizontally
 *    scrollable so nothing gets clipped. Visible from `sm` up.
 *
 * Below `sm` the bottom row hides and a hamburger button appears in
 * the top row instead, opening a dropdown with the same nav links
 * stacked vertically -- a scrollable link row is awkward to use one
 * thumb at a time on the narrowest phones, so that width gets the
 * classic hamburger pattern instead. The hamburger button and the
 * dropdown share the same `sm:hidden` breakpoint as the bottom nav
 * row's `hidden sm:block`, so exactly one of the two is ever visible.
 *
 * The search field follows the same idea: a real input box from `sm`
 * up, and an icon (opening `MobileSearchModal`) below it. The icon
 * button and the modal share the exact same `sm:hidden` breakpoint on
 * purpose: previously they were out of sync (the icon showed up to
 * `xl`, but the modal hid itself at `md`), so tapping the icon on a
 * medium screen opened a modal that had `display: none` -- invisible,
 * unclosable, and still holding `document.body`'s scroll lock. Keeping
 * both in lockstep here is what actually fixes that.
 *
 * Combined header height (sm and up) is 4rem (top row) + 3rem (nav
 * row) = 7rem. The `#simulations` anchor on dashboard subject pages
 * uses `scroll-mt-28` (7rem) to sit just below that when scrolled to
 * -- keep that in sync if either row's height changes.
 */
export function Navbar() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navRowRef = useRef<HTMLElement>(null);

  // Whole-segment matching: Physics stays active on every page below /dashboard/physics, and the
  // Dashboard item is active on the dashboard home only.
  const isActive = (item: { href: string; exact?: boolean }) => isNavActive(pathname, item.href, item.exact);

  // Choosing a page closes the mobile menu.
  useEffect(() => setMenuOpen(false), [pathname]);

  // Keep the active item visible in the scrollable row: on every route change, and when the row's width changes
  // (rotating a tablet, resizing the window) because that can push the active item out of view.
  useEffect(() => {
    const row = navRowRef.current;
    if (!row) return;
    const reveal = () => {
      const active = row.querySelector<HTMLElement>('[aria-current="page"]');
      if (!active || row.scrollWidth <= row.clientWidth) return;
      const a = active.getBoundingClientRect();
      const r = row.getBoundingClientRect();
      if (a.left < r.left) row.scrollLeft -= r.left - a.left;
      else if (a.right > r.right) row.scrollLeft += a.right - r.right;
    };
    reveal();
    // The row's own box rarely changes when its content does (a web font swapping in widens the items
    // without resizing the row), so watch the items too and re-check once fonts have loaded.
    const ro = new ResizeObserver(reveal);
    ro.observe(row);
    Array.from(row.children).forEach((child) => ro.observe(child));
    let cancelled = false;
    document.fonts?.ready.then(() => { if (!cancelled) reveal(); });
    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, [pathname]);

  // Mobile menu: Escape (focus returns to the menu button) and a tap outside the header both close it.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [menuOpen]);

  // The hamburger dropdown only makes sense below `sm` (see the
  // component doc comment) -- if the viewport is resized past that
  // breakpoint while it's open, close it rather than leaving it open
  // but unreachable.
  useEffect(() => {
    if (!menuOpen) return;
    const handleResize = () => {
      if (window.innerWidth >= 640) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuOpen]);

  return (
    <header ref={headerRef} className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-md dark:border-line-dark dark:bg-chalkboard/85">
      {/* TOP ROW -- logo left, search + avatar far right */}
      <Container className="px-4 sm:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          <Link
            href="/"
            aria-label={siteConfig.name}
            className="flex min-h-11 min-w-0 shrink items-center gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:focus-visible:ring-offset-chalkboard"
          >
            <Logo className="h-7 w-7 shrink-0 text-pine-600 dark:text-pine-300" />
            {/* Below 360px the header has room for the mark only; the link keeps its accessible name. */}
            <span className="hidden truncate font-display text-base font-medium tracking-tight text-ink min-[360px]:inline min-[400px]:text-lg dark:text-bone">
              {siteConfig.name}
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-1 sm:gap-3">
            <HeaderSearch className="hidden w-40 sm:block md:w-56 lg:w-64" />

            <button
              type="button"
              onClick={() => setMobileSearchOpen(true)}
              aria-label="Search"
              className="flex h-11 w-11 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ink/[0.06] hover:text-ink dark:text-bone-soft dark:hover:bg-bone/[0.08] dark:hover:text-bone sm:hidden"
            >
              <Search className="h-4 w-4" strokeWidth={1.75} />
            </button>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 text-ink dark:border-bone/15 dark:text-bone sm:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500"
            >
              {menuOpen ? <X className="h-4 w-4" strokeWidth={1.75} /> : <Menu className="h-4 w-4" strokeWidth={1.75} />}
            </button>

            <UserMenu />
          </div>
        </div>
      </Container>

      {/* BOTTOM ROW -- primary nav, horizontally scrollable, sm and up */}
      <div className="hidden border-t border-line dark:border-line-dark sm:block">
        <Container>
          <nav
            ref={navRowRef}
            aria-label="Primary"
            className="no-scrollbar flex h-12 items-center gap-1 overflow-x-auto"
          >
            {mainNav.map((item) => {
              const active = isActive(item);
              const Icon = NAV_ICONS[item.icon];
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(navLinkBase, "min-h-11 shrink-0 whitespace-nowrap py-1.5 lg:min-h-0", active ? navLinkActive : navLinkInactive)}
                >
                  <Icon aria-hidden="true" strokeWidth={1.75} className={cn(navIconCls, active ? navIconActive : navIconInactive)} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </Container>
      </div>

      {/* HAMBURGER DROPDOWN -- primary nav, stacked, below sm only */}
      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-line dark:border-line-dark sm:hidden"
          >
            <Container className="flex flex-col gap-1 py-3">
              {mainNav.map((item) => {
                const active = isActive(item);
                const Icon = NAV_ICONS[item.icon];
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(navLinkBase, "min-h-11 py-2.5", active ? navLinkActive : navLinkInactive)}
                  >
                    <Icon aria-hidden="true" strokeWidth={1.75} className={cn(navIconCls, active ? navIconActive : navIconInactive)} />
                    {item.label}
                  </Link>
                );
              })}
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {mobileSearchOpen ? <MobileSearchModal onClose={() => setMobileSearchOpen(false)} /> : null}
      </AnimatePresence>
    </header>
  );
}
