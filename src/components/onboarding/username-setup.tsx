"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { useUserProfile } from "@/hooks/use-user-profile";
import { sanitizeUsername, USERNAME_MAX_LENGTH } from "@/lib/user-profile";
import { siteConfig } from "@/config/site";

/**
 * Shown once, full-screen, on the very first visit — before a
 * username exists in localStorage. Renders nothing once hydration
 * confirms a name is already saved, or before hydration completes (so
 * returning visitors never see a flash of this screen).
 */
export function UsernameSetup() {
  const { username, hydrated, setUsername } = useUserProfile();
  const [value, setValue] = useState("");
  const open = hydrated && !username;

  // A modal dialog: the page behind it is inert (no Tab into it, hidden from screen readers) and does not scroll.
  useEffect(() => {
    if (!open) return;
    const app = document.getElementById("learner-app");
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    app?.setAttribute("inert", "");
    return () => {
      document.body.style.overflow = previous;
      app?.removeAttribute("inert");
    };
  }, [open]);

  if (!open) return null;

  const canContinue = sanitizeUsername(value).length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canContinue) return;
    setUsername(value);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="username-setup-heading"
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-paper px-4 py-6 dark:bg-chalkboard"
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="my-auto w-full max-w-sm rounded-card border border-line bg-paper p-5 text-center shadow-card sm:p-8 dark:border-line-dark dark:bg-chalkboard"
      >
        <Logo className="mx-auto h-9 w-9 text-pine-600 dark:text-pine-300" />

        <h1 id="username-setup-heading" className="mt-5 font-display text-2xl font-medium text-ink dark:text-bone">
          Welcome to {siteConfig.name}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
          Let&apos;s personalize your learning experience.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <div className="text-left">
            <label htmlFor="username-setup-input" className="mb-1.5 block text-sm font-medium text-ink-soft dark:text-bone-soft">
              What should we call you?
            </label>
            <input
              id="username-setup-input"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter your name"
              maxLength={USERNAME_MAX_LENGTH}
              autoFocus
              className="min-h-11 w-full rounded-md border border-ink/15 bg-transparent px-3.5 py-2.5 text-base text-ink sm:text-sm focus-visible:border-pine-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-bone/20 dark:text-bone"
            />
          </div>
          <Button type="submit" variant="primary" size="md" disabled={!canContinue} className="w-full">
            Continue
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
