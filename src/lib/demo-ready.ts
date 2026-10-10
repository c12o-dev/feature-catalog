/*
 * Counts the demos a page waits for before it reveals itself (PageLoader, v2 loading screen).
 * A preloading Stage registers when it mounts and reports ready once its demo's chunk has arrived
 * and rendered. Same shape as the X-ray store (src/components/shell/xray.tsx).
 */
const pending = new Set<string>();
const done = new Set<string>();
const listeners = new Set<() => void>();
let snapshot = { total: 0, done: 0 };

function emit() {
  snapshot = { total: pending.size + done.size, done: done.size };
  listeners.forEach((l) => l());
}

export function registerDemo(id: string) {
  if (done.has(id) || pending.has(id)) return;
  pending.add(id);
  emit();
}

export function demoReady(id: string) {
  if (!pending.delete(id)) return;
  done.add(id);
  emit();
}

/** Clears the count on a client-side route change, before the next page registers its demos. */
export function resetDemos() {
  pending.clear();
  done.clear();
  emit();
}

export function subscribeDemos(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function demoSnapshot() {
  return snapshot;
}

const EMPTY = { total: 0, done: 0 };
export function demoServerSnapshot() {
  return EMPTY;
}
