"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";
function subscribe(cb: () => void) {
  const m = matchMedia(QUERY);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
}
export function useReducedMotionPref() {
  return useSyncExternalStore(subscribe, () => matchMedia(QUERY).matches, () => false);
}

/** Counter that advances every `ms` while the tab is visible and motion is allowed. */
export function useTick(ms: number, enabled = true) {
  const reduced = useReducedMotionPref();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (reduced || !enabled) return;
    let id: ReturnType<typeof setInterval> | undefined;
    const start = () => {
      clearInterval(id);
      if (document.visibilityState === "visible") id = setInterval(() => setN((x) => x + 1), ms);
    };
    start();
    document.addEventListener("visibilitychange", start);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", start);
    };
  }, [ms, reduced, enabled]);
  return { n, reduced };
}
