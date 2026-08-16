"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { clearStoredUsername, readStoredUsername, sanitizeUsername, writeStoredUsername } from "@/lib/user-profile";

interface UserProfileContextValue {
  /** null until the first localStorage read completes (client-only), or when there's no saved name. */
  username: string | null;
  /** false during the first render/SSR pass — matches the `mounted` pattern `ThemeToggle` already uses, so avatar/name never mismatch-flash. */
  hydrated: boolean;
  setUsername: (name: string) => void;
  resetProfile: () => void;
}

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

/**
 * Local (no backend, no auth) display-name profile, backed by
 * localStorage. This project doesn't have Zustand installed, so
 * rather than pull in a new state library for one string, this is a
 * small Context + localStorage — same footprint, zero new
 * dependencies. Mount once near the root (see `layout.tsx`).
 */
export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [username, setUsernameState] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setUsernameState(readStoredUsername());
    setHydrated(true);
  }, []);

  const setUsername = useCallback((name: string) => {
    const clean = sanitizeUsername(name);
    if (clean.length === 0) return;
    writeStoredUsername(clean);
    setUsernameState(clean);
  }, []);

  const resetProfile = useCallback(() => {
    clearStoredUsername();
    setUsernameState(null);
  }, []);

  const value = useMemo(
    () => ({ username, hydrated, setUsername, resetProfile }),
    [username, hydrated, setUsername, resetProfile],
  );

  return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>;
}

export function useUserProfile(): UserProfileContextValue {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error("useUserProfile must be used within a UserProfileProvider");
  return ctx;
}
