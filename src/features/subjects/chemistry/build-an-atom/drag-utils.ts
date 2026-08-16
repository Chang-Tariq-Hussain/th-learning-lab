/** Extracts viewport-relative {x, y} from whichever event type a drag gesture ends with, so drop-zone hit-testing works the same for mouse, touch, and pointer input. */
export function getClientPoint(event: MouseEvent | TouchEvent | PointerEvent): { x: number; y: number } | null {
  if ("clientX" in event) {
    return { x: event.clientX, y: event.clientY };
  }
  const touch = event.changedTouches?.[0];
  if (touch) {
    return { x: touch.clientX, y: touch.clientY };
  }
  return null;
}

export function isPointInRect(point: { x: number; y: number }, rect: DOMRect): boolean {
  return point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom;
}
