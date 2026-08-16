"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useDismiss } from "@/hooks/use-dismiss";
import { USERNAME_MAX_LENGTH } from "@/lib/user-profile";

export interface EditNameModalProps {
  currentName: string;
  onSave: (name: string) => void;
  onClose: () => void;
}

/** Small centered modal for changing the saved display name. */
export function EditNameModal({ currentName, onSave, onClose }: EditNameModalProps) {
  const [value, setValue] = useState(currentName);
  const panelRef = useRef<HTMLDivElement>(null);
  useDismiss(panelRef, true, onClose);

  const trimmed = value.trim();
  const canSave = trimmed.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;
    onSave(trimmed);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/40 px-4 backdrop-blur-sm dark:bg-chalkboard/60">
      <motion.div
        ref={panelRef}
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-name-heading"
        className="w-full max-w-sm rounded-card border border-line bg-paper p-6 shadow-card dark:border-line-dark dark:bg-chalkboard"
      >
        <h2 id="edit-name-heading" className="font-display text-lg font-medium text-ink dark:text-bone">
          Edit Name
        </h2>
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <div>
            <label htmlFor="edit-name-input" className="sr-only">
              Your name
            </label>
            <input
              id="edit-name-input"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              maxLength={USERNAME_MAX_LENGTH}
              autoFocus
              className="w-full rounded-md border border-ink/15 bg-transparent px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:border-pine-500 focus:outline-none dark:border-bone/20 dark:text-bone dark:placeholder:text-bone-soft/50"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={!canSave}>
              Save
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
