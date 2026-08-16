/**
 * Minimal typed event emitter. Simulations can emit domain events
 * (e.g. "collision", "reactionComplete", "populationExtinct") without
 * the framework needing to know about them in advance.
 */
export class SimulationEventEmitter<
  EventMap extends Record<string, unknown> = Record<string, unknown>
> {
  private listeners = new Map<keyof EventMap, Set<(payload: unknown) => void>>();

  on<K extends keyof EventMap>(
    event: K,
    handler: (payload: EventMap[K]) => void
  ): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    const set = this.listeners.get(event) as Set<(payload: unknown) => void>;
    const wrapped = handler as (payload: unknown) => void;
    set.add(wrapped);
    return () => set.delete(wrapped);
  }

  emit<K extends keyof EventMap>(event: K, payload: EventMap[K]): void {
    this.listeners.get(event)?.forEach((handler) => handler(payload));
  }

  clear(): void {
    this.listeners.clear();
  }
}
