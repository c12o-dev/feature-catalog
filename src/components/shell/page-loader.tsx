"use client";

import { useEffect, useLayoutEffect, useState, useSyncExternalStore } from "react";
import { demoServerSnapshot, demoSnapshot, resetDemos, subscribeDemos } from "@/lib/demo-ready";
import { Xray } from "@/components/shell/xray";

/** Upper bound on the wait: on a slow connection the page shows anyway (decided 2026-10-10). */
const MAX_WAIT_MS = 4000;
let firstLoad = true;

/*
 * Loading screen for pages with demos (/c, /g, /p). It is in the static HTML, so nothing shows
 * until the page's preloading stages have loaded and painted their demos and the fonts are in;
 * scrolling afterwards no longer loads or renders demos mid-scroll. Removed from the DOM once it
 * has faded; tests and tooling wait for [data-page-loader] to disappear.
 */
export function PageLoader() {
  const { total, done } = useSyncExternalStore(subscribeDemos, demoSnapshot, demoServerSnapshot);
  const [fontsReady, setFontsReady] = useState(false);
  const [settled, setSettled] = useState(false); // stages have had a chance to register
  const [timedOut, setTimedOut] = useState(false);
  const [phase, setPhase] = useState<"shown" | "fading" | "gone">("shown");

  // a fresh count for this page (runs before the stages' effects register their demos)
  useLayoutEffect(() => resetDemos(), []);

  useEffect(() => {
    let live = true;
    document.fonts.ready.then(() => live && setFontsReady(true));
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => live && setSettled(true)));
    // on the first (full) load the cap counts from navigation start, not from when this script ran;
    // on a client-side navigation it counts from now
    const elapsed = firstLoad ? performance.now() : 0;
    firstLoad = false;
    const timer = setTimeout(() => live && setTimedOut(true), Math.max(0, MAX_WAIT_MS - elapsed));
    const main = document.getElementById("main");
    main?.setAttribute("aria-busy", "true");
    return () => {
      live = false;
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      main?.removeAttribute("aria-busy");
    };
  }, []);

  const ready = timedOut || (settled && fontsReady && done >= total);

  useEffect(() => {
    if (!ready || phase !== "shown") return;
    document.getElementById("main")?.removeAttribute("aria-busy");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const raf = requestAnimationFrame(() => setPhase(reduce ? "gone" : "fading"));
    return () => cancelAnimationFrame(raf);
  }, [ready, phase]);

  useEffect(() => {
    if (phase !== "fading") return;
    const t = setTimeout(() => setPhase("gone"), 260);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "gone") return null;
  // a sliver before any demo has registered, so the bar never looks stalled at zero
  const progress = total > 0 ? Math.max(0.08, done / total) : 0.08;
  return (
    <div
      data-page-loader
      className={`fixed inset-0 z-[90] flex flex-col items-center justify-center gap-6 bg-bg-0 [will-change:opacity] transition-opacity duration-[240ms] ${phase === "fading" ? "opacity-0" : "opacity-100"}`}
    >
      <noscript>
        <style>{"[data-page-loader]{display:none}"}</style>
      </noscript>
      <span aria-hidden className="font-serif text-6xl leading-none text-brand motion-safe:animate-pulse">
        §
      </span>
      <Xray slug="progress-bar" as="div" place="below">
        <div
          role="progressbar"
          aria-label="読み込み中"
          aria-valuemin={0}
          aria-valuemax={Math.max(total, 1)}
          aria-valuenow={done}
          className="h-0.5 w-48 overflow-hidden rounded-full bg-line-1"
        >
          {/* transform only (§3.1); no transition under reduced motion */}
          <div className="h-full w-full origin-left rounded-full bg-brand motion-safe:transition-transform motion-safe:duration-200" style={{ transform: `scaleX(${progress})` }} />
        </div>
      </Xray>
    </div>
  );
}
