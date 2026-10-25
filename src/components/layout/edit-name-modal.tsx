"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { USERNAME_MAX_LENGTH } from "@/lib/user-profile";

export interface EditNameModalProps {
  currentName: string;
  onSave: (name: string) => void;
  onClose: () => void;
}

/** Small centered modal for changing the saved display name. */
export function EditNameModal({ currentName, onSave, onClose }: EditNameModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  // Portalled to <body>: inside the header (backdrop-blur) a fixed overlay would be sized to the header, not the screen.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (mounted) return <ModalBody {...{ currentName, onSave, onClose }} />;
  return null;
}

function ModalBody({ currentName, onSave, onClose }: EditNameModalProps) {
  const [value, setValue] = useState(currentName);
  const panelRef = useRef<HTMLDivElement>(null);
  useModal(panelRef, onClose);

  const trimmed = value.trim();
  const canSave = trimmed.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;
    onSave(trimmed);
  };

  return createPortal(
    <div onPointerDown={(e) => { if (e.target === e.currentTarget) onClose(); }} className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-ink/40 px-4 py-6 backdrop-blur-sm dark:bg-chalkboard/60">
      <motion.div
        ref={panelRef}
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-name-heading"
        className="my-auto w-full max-w-sm rounded-card border border-line bg-paper p-5 shadow-card sm:p-6 dark:border-line-dark dark:bg-chalkboard"
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
              className="min-h-11 w-full rounded-md border border-ink/15 bg-transparent px-3.5 py-2.5 text-base text-ink focus-visible:border-pine-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 sm:text-sm dark:border-bone/20 dark:text-bone"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={!canSave}>
              Save
            </Button>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body,
  );
}
