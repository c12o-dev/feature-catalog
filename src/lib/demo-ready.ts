/*
 * Counts the demos a page waits for before it reveals itself (PageLoader, v2 loading screen).
 * A preloading Stage registers when it mounts and reports ready once its demo's chunk has arrived
 * and rendered. Same shape as the X-ray store (src/components/shell/xray.tsx).
 */
const pending = new Set<string>();
const done = new Set<string>();
const listeners = new Set<() => void>();
let generation = 0; // which page the count belongs to (see PageLoader)
let issued = 0;
let snapshot = { total: 0, done: 0, generation };

function emit() {
  snapshot = { total: pending.size + done.size, done: done.size, generation };
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

/** A new generation number for a page's loading screen (no store change, safe during render). */
export function nextGeneration() {
  return ++issued;
}

/** Starts a fresh count owned by `gen`, before the page's stages register their demos. */
export function resetDemos(gen: number) {
  pending.clear();
  done.clear();
  generation = gen;
  emit();
}

export function subscribeDemos(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function demoSnapshot() {
  return snapshot;
}

const EMPTY = { total: 0, done: 0, generation: 0 };
export function demoServerSnapshot() {
  return EMPTY;
}
