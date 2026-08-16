import type { RespirationState } from "../types";
import { statusMessage } from "../model";

export interface StatusMessageProps {
  state: RespirationState;
}

export function StatusMessage({ state }: StatusMessageProps) {
  return (
    <p aria-live="polite" className="text-center text-base font-medium text-ink dark:text-bone">
      {statusMessage(state)}
    </p>
  );
}
