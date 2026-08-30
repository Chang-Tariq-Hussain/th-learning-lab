"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Check, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDismiss } from "@/hooks/use-dismiss";
import { getThemeDefinition, lightThemes, darkThemes, type ThemeDefinition } from "@/config/themes";

/**
 * Was a simple Light/Dark toggle; now a compact theme picker (Light,
 * Soft Light, Solarized Light, GitHub Light, Dark, Midnight, Dracula,
 * Nord, Monokai, One Dark — see `src/config/themes.ts`). Same trigger
 * button size/shape and the same `next-themes` `theme`/`setTheme`
 * this always used, so persistence and every other consumer of theme
 * state are unaffected — only what happens when you click it, and
 * what opens, has changed.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Avoid hydration mismatch: theme is only known client-side.
  useEffect(() => setMounted(true), []);

  useDismiss(wrapperRef, open, () => setOpen(false));

  const activeId = mounted ? resolvedTheme : undefined;
  const isDark = getThemeDefinition(activeId)?.type === "dark";

  const renderOption = (option: ThemeDefinition) => {
    const selected = option.id === activeId;
    return (
      <button
        key={option.id}
        type="button"
        role="menuitemradio"
        aria-checked={selected}
        onClick={() => {
          setTheme(option.id);
          setOpen(false);
        }}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm text-ink-soft transition-colors hover:bg-ink/[0.04] hover:text-ink dark:text-bone-soft dark:hover:bg-bone/[0.06] dark:hover:text-bone",
          selected && "text-ink dark:text-bone"
        )}
      >
        <span
          aria-hidden="true"
          className="h-3.5 w-3.5 shrink-0 rounded-full border border-ink/10 dark:border-bone/15"
          style={{
            background: `linear-gradient(135deg, ${option.previewFrom} 50%, ${option.previewTo} 50%)`,
          }}
        />
        <span className="flex-1 truncate">{option.name}</span>
        {selected ? <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={2} /> : null}
      </button>
    );
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Choose theme"
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink-soft transition-colors hover:border-ink/30 hover:text-ink dark:border-bone/15 dark:text-bone-soft dark:hover:border-bone/30 dark:hover:text-bone",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:focus-visible:ring-offset-chalkboard",
          className
        )}
      >
        {mounted ? (
          isDark ? (
            <Moon className="h-4 w-4" strokeWidth={1.75} />
          ) : (
            <Sun className="h-4 w-4" strokeWidth={1.75} />
          )
        ) : (
          <span className="h-4 w-4" />
        )}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -4 }}
            transition={{ duration: 0.12 }}
            role="menu"
            aria-label="Theme"
            className="absolute right-0 top-full z-50 mt-2 max-h-80 w-52 overflow-y-auto rounded-card border border-line bg-paper p-2 shadow-card dark:border-line-dark dark:bg-chalkboard"
          >
            <p className="px-2.5 pb-1 pt-1 font-mono text-[0.6875rem] uppercase tracking-[0.15em] text-ink-soft/70 dark:text-bone-soft/70">
              Light
            </p>
            {lightThemes.map(renderOption)}

            <div className="my-1.5 h-px bg-line dark:bg-line-dark" />

            <p className="px-2.5 pb-1 pt-1 font-mono text-[0.6875rem] uppercase tracking-[0.15em] text-ink-soft/70 dark:text-bone-soft/70">
              Dark
            </p>
            {darkThemes.map(renderOption)}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
