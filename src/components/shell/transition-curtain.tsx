"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { CURTAIN_IN_MS, LOADER_PAGE, curtainServerSnapshot, curtainSnapshot, liftCurtain, lowerCurtain, subscribeCurtain } from "@/lib/curtain";

/** If the next page never takes over, don't leave the screen covered. */
const GIVE_UP_MS = 8000;

const trim = (p: string) => p.replace(/\/$/, "") || "/";

/*
 * A plain link into a page with a loading screen first lowers this curtain over the current page
 * (fades in, CURTAIN_IN_MS), then navigates; the new page's PageLoader appears beneath it and lifts it.
 * Other navigations (⌘K, back/forward, modified clicks) go straight to the loader.
 */
export function TransitionCurtain() {
  const router = useRouter();
  const down = useSyncExternalStore(subscribeCurtain, curtainSnapshot, curtainServerSnapshot);

  useEffect(() => {
    // capture phase on document: runs before React's onClick, so next/link sees defaultPrevented
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target instanceof Element ? e.target.closest("a[href]") : null;
      if (!(a instanceof HTMLAnchorElement) || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href);
      if (url.origin !== location.origin || !LOADER_PAGE.test(url.pathname) || trim(url.pathname) === trim(location.pathname)) return;
      e.preventDefault();
      lowerCurtain();
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setTimeout(() => router.push(url.pathname + url.search + url.hash), reduce ? 150 : CURTAIN_IN_MS);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  useEffect(() => {
    if (!down) return;
    const t = setTimeout(liftCurtain, GIVE_UP_MS);
    return () => clearTimeout(t);
  }, [down]);

  if (!down) return null;
  return (
    <div
      aria-hidden
      data-page-loader="curtain"
      className="loader-fade fixed inset-0 z-[200] bg-bg-0 opacity-100 starting:opacity-0"
      style={{ transition: `opacity ${CURTAIN_IN_MS}ms cubic-bezier(0.65, 0, 0.35, 1)` }}
    />
  );
}
