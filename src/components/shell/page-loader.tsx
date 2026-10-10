"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { demoServerSnapshot, demoSnapshot, nextGeneration, resetDemos, subscribeDemos } from "@/lib/demo-ready";
import { curtainSnapshot, liftCurtain } from "@/lib/curtain";
import { Xray } from "@/components/shell/xray";

/** Upper bound on the wait: on a slow connection the page shows anyway (decided 2026-10-10). */
const MAX_WAIT_MS = 4000;
let firstLoad = true;

/*
 * Beats of the reveal: loading → done → a beat → the page (decided 2026-10-10, about 1.4s from
 * "ready" to the end of the page's entrance). Nothing is instant on purpose:
 *   complete  the bar runs to 100%, the § stops pulsing, and it holds
 *   out       the § and bar lift away; the curtain fades a little after them
 *   gap       the screen is clear for a beat before the page's own entrance starts
 *             (globals.css holds .fade-up/.rise-char while [data-page-loader] exists)
 */
const BEATS = { minShown: 600, fill: 200, hold: 250, contentOut: 240, curtainDelay: 120, curtainOut: 360, gap: 80 };
/** Reduced motion: no movement, short crossfades, short holds (globals.css shortens the fades). */
const REDUCED = { minShown: 600, fill: 0, hold: 80, contentOut: 150, curtainDelay: 0, curtainOut: 150, gap: 80 };
const EASE_IN = "cubic-bezier(0.32, 0, 0.67, 0)";
const EASE_IN_OUT = "cubic-bezier(0.65, 0, 0.35, 1)";

type Phase = "loading" | "complete" | "out" | "gap" | "gone";
const NEXT = { loading: "complete", complete: "out", out: "gap", gap: "gone" } as const;

/*
 * Loading screen for pages with demos (/c, /g, /p). It is in the static HTML, so nothing shows
 * until the page's preloading stages have loaded and painted their demos and the fonts are in;
 * scrolling afterwards no longer loads or renders demos mid-scroll. Removed from the DOM once it
 * has faded; tests and tooling wait for [data-page-loader] to disappear.
 */
export function PageLoader() {
  const [gen] = useState(nextGeneration);
  // arriving through the transition curtain: it is already covering the screen, so take over from it
  const [handoff] = useState(curtainSnapshot);
  const { total, done, generation } = useSyncExternalStore(subscribeDemos, demoSnapshot, demoServerSnapshot);
  // Until this page's count has started, the store may still hold the previous page's "30 / 30".
  const counting = generation === gen;
  const [fontsReady, setFontsReady] = useState(false);
  const [settled, setSettled] = useState(false); // stages have had a chance to register
  const [timedOut, setTimedOut] = useState(false);
  const [phase, setPhase] = useState<Phase>("loading");
  const shownAt = useRef(0);

  // a fresh count for this page (runs before the stages' effects register their demos)
  useLayoutEffect(() => resetDemos(gen), [gen]);
  useLayoutEffect(() => {
    if (handoff) liftCurtain();
  }, [handoff]);

  useEffect(() => {
    let live = true;
    document.fonts.ready.then(() => live && setFontsReady(true));
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => live && setSettled(true)));
    // on the first (full) load the screen has been up since navigation start (static HTML), and the
    // cap counts from there, not from when this script ran; on a client-side navigation, from now
    shownAt.current = firstLoad ? 0 : performance.now();
    firstLoad = false;
    const timer = setTimeout(() => live && setTimedOut(true), Math.max(0, shownAt.current + MAX_WAIT_MS - performance.now()));
    const main = document.getElementById("main");
    main?.setAttribute("aria-busy", "true");
    return () => {
      live = false;
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      main?.removeAttribute("aria-busy");
    };
  }, []);

  const ready = timedOut || (counting && settled && fontsReady && done >= total);

  useEffect(() => {
    if (phase === "gone" || (phase === "loading" && !ready)) return;
    const b = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? REDUCED : BEATS;
    const wait = {
      // never flash: the screen stays up at least minShown
      loading: Math.max(0, shownAt.current + b.minShown - performance.now()),
      complete: b.fill + b.hold,
      out: Math.max(b.contentOut, b.curtainDelay + b.curtainOut),
      gap: b.gap,
    }[phase];
    if (phase === "loading") document.getElementById("main")?.removeAttribute("aria-busy");
    const t = setTimeout(() => setPhase(NEXT[phase]), wait);
    return () => clearTimeout(t);
  }, [phase, ready]);

  if (phase === "gone") return null;
  const leaving = phase === "out" || phase === "gap";
  // a sliver before any demo has registered, so the bar never looks stalled at zero
  const progress = phase !== "loading" ? 1 : counting && total > 0 ? Math.max(0.08, done / total) : 0.08;
  return (
    <div
      data-page-loader
      className={`loader-fade fixed inset-0 z-[200] flex items-center justify-center bg-bg-0 [will-change:opacity] ${leaving ? "pointer-events-none opacity-0" : "opacity-100"}`}
      style={{ transition: `opacity ${BEATS.curtainOut}ms ${EASE_IN_OUT} ${BEATS.curtainDelay}ms` }}
    >
      <noscript>
        <style>{"[data-page-loader]{display:none}"}</style>
      </noscript>
      <div
        className={`loader-fade flex flex-col items-center gap-6 ${handoff ? "animate-[loader-in_240ms_ease-out_backwards]" : ""} ${leaving ? "opacity-0 motion-safe:-translate-y-2" : ""}`}
        style={{ transition: `opacity ${BEATS.contentOut}ms ${EASE_IN}, translate ${BEATS.contentOut}ms ${EASE_IN}` }}
      >
        <span aria-hidden className={`font-serif text-6xl leading-none text-brand ${phase === "loading" ? "motion-safe:animate-pulse" : ""}`}>
          §
        </span>
        <Xray slug="progress-bar" as="div" place="below">
          <div
            role="progressbar"
            aria-label="読み込み中"
            aria-valuemin={0}
            aria-valuemax={Math.max(total, 1)}
            aria-valuenow={phase !== "loading" ? Math.max(total, 1) : done}
            className="h-0.5 w-48 overflow-hidden rounded-full bg-line-1"
          >
            {/* transform only (§3.1); no transition under reduced motion */}
            <div
              className={`h-full w-full origin-left rounded-full bg-brand ${counting || phase !== "loading" ? "motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out" : ""}`}
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>
        </Xray>
      </div>
    </div>
  );
}
