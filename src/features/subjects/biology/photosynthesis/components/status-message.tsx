import type { PhotosynthesisState } from "../types";
import { statusMessage } from "../model";

export interface StatusMessageProps {
  state: PhotosynthesisState;
}

export function StatusMessage({ state }: StatusMessageProps) {
  return (
    <p aria-live="polite" className="text-center text-base font-medium text-ink dark:text-bone">
      {statusMessage(state)}
    </p>
  );
}
