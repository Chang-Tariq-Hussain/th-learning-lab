import { Book, DoorClosed, Pencil, Table2, Wine, type LucideIcon } from "lucide-react";
import type { FamiliarObject } from "../measurement-model";

/** Shared icon lookup for the small set of familiar objects used across levels. */
export const OBJECT_ICONS: Record<FamiliarObject["icon"], LucideIcon> = {
  pencil: Pencil,
  book: Book,
  table: Table2,
  bottle: Wine,
  door: DoorClosed,
};
