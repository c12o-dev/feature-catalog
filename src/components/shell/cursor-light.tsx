"use client";

import { useEffect, useRef } from "react";

/**
 * Soft light that follows the pointer, tinted by the category under it (nearest
 * `[data-hue]`). Desktop pointers only, off under reduced motion. Decorative.
 */
export function CursorLight() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = matchMedia("(pointer: fine)").matches;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let x = 0;
    let y = 0;
    let hue = "";
    const apply = () => {
      raf = 0;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
    };
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onOver = (e: PointerEvent) => {
      const h = (e.target as Element | null)?.closest<HTMLElement>("[data-hue]")?.dataset.hue ?? "75";
      if (h !== hue) {
        hue = h;
        document.documentElement.style.setProperty("--tint-hue", h);
      }
    };
    if (fine && !reduce) window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);
  return <div ref={ref} aria-hidden className="ambient" />;
}
