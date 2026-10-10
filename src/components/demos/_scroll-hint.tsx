"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Horizontal-overflow hint for demos that are wider than a phone stage (≈310px at 390).
 *
 * The caller keeps its own `overflow-x-auto` element and spreads `scrollProps` on it, wraps it in a
 * `relative` box and drops `<ScrollHint show={hint} />` next to it. `hint` is true only while the
 * box actually overflows and has not been scrolled to the end (ResizeObserver + onScroll), so wide
 * stages never show it and it disappears once the reader has seen the far edge.
 */
export function useScrollHint<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [hint, setHint] = useState(false);
  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const overflow = el.scrollWidth - el.clientWidth > 1;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
    setHint(overflow && !atEnd);
  }, []);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [update]);
  return { hint, scrollProps: { ref, onScroll: update } };
}

/**
 * Narrow fade on the right edge plus a "→ スクロール" pill in the corner. The fade is deliberately
 * thin (2rem) so the last visible column of a table header is not obscured; the pill carries its own
 * background so it reads over whatever sits beneath it. Pass `className="from-background"` when the
 * scroll box is not a card.
 */
export function ScrollHint({ show, className }: { show: boolean; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-y-px right-px flex w-8 items-end justify-end bg-gradient-to-l from-card to-transparent transition-opacity",
        !show && "opacity-0",
        className,
      )}
    >
      <span className="mr-1.5 mb-1.5 rounded bg-background/90 px-1 text-[10px] leading-4 whitespace-nowrap text-muted-foreground">→ スクロール</span>
    </div>
  );
}
