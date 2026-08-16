"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useDismiss } from "@/hooks/use-dismiss";
import { useUserProfile } from "@/hooks/use-user-profile";
import { getInitials } from "@/lib/user-profile";
import { UserAvatar } from "./user-avatar";
import { EditNameModal } from "./edit-name-modal";

export interface UserMenuProps {
  /**
   * Which edge the dropdown panel hangs from. The header renders this
   * component both on the left (mobile cluster) and the right (desktop
   * cluster), and a dropdown that always opens from its own right edge
   * would run off the left side of small screens when the trigger sits
   * near the left edge — so the caller tells us which side has room.
   */
  align?: "left" | "right";
}

/**
 * The avatar button plus its dropdown: name, Edit Name, Appearance
 * (the existing `ThemeToggle`, just given a label here), and Reset
 * Profile (asks for confirmation, then clears localStorage and
 * re-triggers the username setup screen). No account/auth — purely a
 * local display preference, per the brief.
 */
export function UserMenu({ align = "right" }: UserMenuProps) {
  const { username, resetProfile, setUsername } = useUserProfile();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const name = username ?? "";
  const initials = getInitials(name);

  const close = () => {
    setOpen(false);
    setConfirmingReset(false);
  };
  useDismiss(menuRef, open, close);

  if (!username) return null;

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Open menu for ${name}`}
        className="flex items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:focus-visible:ring-offset-chalkboard"
      >
        <UserAvatar initials={initials} />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -4 }}
            transition={{ duration: 0.12 }}
            role="menu"
            aria-label="User menu"
            className={cn(
              "absolute top-full z-50 mt-2 w-64 rounded-card border border-line bg-paper p-2 shadow-card dark:border-line-dark dark:bg-chalkboard",
              align === "left" ? "left-0" : "right-0",
            )}
          >
            <div className="flex items-center gap-3 px-2 py-2">
              <UserAvatar initials={initials} />
              <p className="truncate text-sm font-medium text-ink dark:text-bone">{name}</p>
            </div>

            <div className="my-1.5 h-px bg-line dark:bg-line-dark" />

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setEditing(true);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm text-ink-soft transition-colors hover:bg-ink/[0.04] hover:text-ink dark:text-bone-soft dark:hover:bg-bone/[0.06] dark:hover:text-bone"
            >
              <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
              Edit Name
            </button>

            <div className="flex w-full items-center justify-between rounded-md px-2.5 py-2 text-sm text-ink-soft dark:text-bone-soft">
              <span>Appearance</span>
              <ThemeToggle />
            </div>

            <div className="my-1.5 h-px bg-line dark:bg-line-dark" />

            {confirmingReset ? (
              <div className="flex flex-col gap-2 px-2.5 py-1.5">
                <p className="text-xs text-ink-soft dark:text-bone-soft">Remove your saved name from this device?</p>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmingReset(false)}
                    className="rounded-md px-2.5 py-1.5 text-xs text-ink-soft transition-colors hover:bg-ink/[0.04] hover:text-ink dark:text-bone-soft dark:hover:bg-bone/[0.06] dark:hover:text-bone"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resetProfile();
                      close();
                    }}
                    className="rounded-md bg-rose-600 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-rose-700"
                  >
                    Reset
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                role="menuitem"
                onClick={() => setConfirmingReset(true)}
                className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm text-ink-soft transition-colors hover:bg-rose-50 hover:text-rose-600 dark:text-bone-soft dark:hover:bg-rose-900/20 dark:hover:text-rose-400"
              >
                <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
                Reset Profile
              </button>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {editing ? (
        <EditNameModal
          currentName={name}
          onClose={() => setEditing(false)}
          onSave={(next) => {
            setUsername(next);
            setEditing(false);
          }}
        />
      ) : null}
    </div>
  );
}
