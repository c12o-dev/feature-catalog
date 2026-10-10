"use client";

import { useEffect, useLayoutEffect, useState, useSyncExternalStore } from "react";
import { demoServerSnapshot, demoSnapshot, resetDemos, subscribeDemos } from "@/lib/demo-ready";

/** Upper bound on the wait: on a slow connection the page shows anyway (decided 2026-10-10). */
const MAX_WAIT_MS = 4000;

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
    const timer = setTimeout(() => live && setTimedOut(true), MAX_WAIT_MS);
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
  return (
    <div
      data-page-loader
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-[90] flex flex-col items-center justify-center gap-5 bg-bg-0 transition-opacity duration-[240ms] ${phase === "fading" ? "opacity-0" : "opacity-100"}`}
    >
      <noscript>
        <style>{"[data-page-loader]{display:none}"}</style>
      </noscript>
      <span aria-hidden className="font-serif text-6xl leading-none text-brand motion-safe:animate-pulse">
        §
      </span>
      <span className="font-mono text-[11px] tracking-[0.18em] text-fg-3 uppercase">
        読み込み中{total > 0 ? ` ${done} / ${total}` : ""}
      </span>
    </div>
  );
}
