"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, X } from "lucide-react";
import { mainNav, siteConfig } from "@/config/site";
import { Container } from "@/components/ui/container";
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
 * row) = 7rem. A few dashboard sidebars position themselves with
 * `sticky top-28` to sit just below that -- keep those in sync if
 * either row's height changes. Below `sm` the nav row is replaced by
 * the hamburger dropdown instead, and none of those sidebars render
 * at that width (they're `lg:block`), so there's nothing to keep in
 * sync there.
 */
export function Navbar() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === pathname || (href === "/dashboard" && pathname === "/dashboard");

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
    <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-md dark:border-line-dark dark:bg-chalkboard/85">
      {/* TOP ROW -- logo left, search + avatar far right */}
      <Container>
        <div className="flex h-16 items-center justify-between gap-3">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:focus-visible:ring-offset-chalkboard"
          >
            <Logo className="h-7 w-7 text-pine-600 dark:text-pine-300" />
            <span className="font-display text-lg font-medium tracking-tight text-ink dark:text-bone">
              {siteConfig.name}
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <HeaderSearch className="hidden w-40 sm:block md:w-56 lg:w-64" />

            <button
              type="button"
              onClick={() => setMobileSearchOpen(true)}
              aria-label="Search"
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ink/[0.06] hover:text-ink dark:text-bone-soft dark:hover:bg-bone/[0.08] dark:hover:text-bone sm:hidden"
            >
              <Search className="h-4 w-4" strokeWidth={1.75} />
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink dark:border-bone/15 dark:text-bone sm:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500"
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
            aria-label="Primary"
            className="no-scrollbar flex h-12 items-center gap-1 overflow-x-auto"
          >
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm transition-colors",
                  isActive(item.href)
                    ? "bg-ink/[0.06] text-ink dark:bg-bone/[0.08] dark:text-bone"
                    : "text-ink-soft hover:bg-ink/[0.04] hover:text-ink dark:text-bone-soft dark:hover:bg-bone/[0.06] dark:hover:text-bone",
                )}
              >
                {item.label}
              </Link>
            ))}
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
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-sm transition-colors",
                    isActive(item.href)
                      ? "bg-ink/[0.04] text-ink dark:bg-bone/[0.06] dark:text-bone"
                      : "text-ink-soft hover:bg-ink/[0.04] hover:text-ink dark:text-bone-soft dark:hover:bg-bone/[0.06] dark:hover:text-bone",
                  )}
                >
                  {item.label}
                </Link>
              ))}
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
