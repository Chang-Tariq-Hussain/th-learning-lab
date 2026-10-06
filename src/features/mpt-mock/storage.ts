import type { AnswerMap } from "./engine";

export interface StoredSession {
  mockId: string;
  startedAt: number; // epoch ms
  endsAt: number; // epoch ms, fixed at start so the clock never resets
  answers: AnswerMap;
  marked: Record<string, true>;
  current: number;
  submittedAt: number | null;
  autoSubmitted: boolean;
}

const KEY = "th-mpt-mock-session-v1";

export function loadSession(mockId: string): StoredSession | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSession;
    return parsed && parsed.mockId === mockId ? parsed : null;
  } catch {
    return null;
  }
}

export function saveSession(s: StoredSession): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* storage unavailable: the exam still works in memory */
  }
}

export function clearSession(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
