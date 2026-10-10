/*
 * The page-transition curtain (TransitionCurtain). A link into a page with a loading screen lowers
 * it over the current page before navigating; the next page's PageLoader takes over from it, so
 * the curtain itself is the transition (decided 2026-10-10, instead of view-transition morphs).
 * Same shape as the demo-ready store.
 */
const listeners = new Set<() => void>();
let down = false;

function set(v: boolean) {
  if (down === v) return;
  down = v;
  listeners.forEach((l) => l());
}

export const lowerCurtain = () => set(true);
export const liftCurtain = () => set(false);

export function subscribeCurtain(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export const curtainSnapshot = () => down;
export const curtainServerSnapshot = () => false;

/** How long the curtain takes to come down before the navigation starts. */
export const CURTAIN_IN_MS = 200;

/** Pages that show a loading screen (/c, /g). */
export const LOADER_PAGE = /^\/(c|g)\/[^/]+\/?$/;
