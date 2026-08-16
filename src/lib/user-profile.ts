/**
 * Local, non-authenticated user profile — just a display name kept in
 * localStorage so the header can say "Welcome back". No accounts, no
 * server, nothing sensitive; see `UserProfileProvider` for the React
 * side of this.
 */

export const USERNAME_STORAGE_KEY = "learning-platform-username";
export const USERNAME_MAX_LENGTH = 30;

/** Trims, collapses internal whitespace, and caps length. Returns "" for anything that's only whitespace. */
export function sanitizeUsername(raw: string): string {
  return raw.trim().replace(/\s+/g, " ").slice(0, USERNAME_MAX_LENGTH);
}

/** Reads and validates the stored username. Returns null for missing, empty, whitespace-only, or corrupt values. */
export function readStoredUsername(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USERNAME_STORAGE_KEY);
    if (typeof raw !== "string") return null;
    const clean = sanitizeUsername(raw);
    return clean.length > 0 ? clean : null;
  } catch {
    // Storage can throw in private-browsing modes or when disabled.
    return null;
  }
}

export function writeStoredUsername(name: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(USERNAME_STORAGE_KEY, sanitizeUsername(name));
  } catch {
    // Ignore — worst case the name just doesn't persist this session.
  }
}

export function clearStoredUsername(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(USERNAME_STORAGE_KEY);
  } catch {
    // Ignore.
  }
}

/** "Tariq Hussain" -> "TH", "Ahmed" -> "A". Falls back to "?" for an empty string. */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 1).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}
