"use client";

import { useEffect, useRef, useState } from "react";

/** Counts up to `value` once when scrolled into view. Renders the final value on the server. */
export function CountUp({ value, ms = 1400 }: { value: number; ms?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < innerHeight) return; // already visible: keep the final value
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / ms);
        setShown(Math.round(value * (1 - Math.pow(1 - p, 4))));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    });
    io.observe(el);
    // start from zero only once we know the counter is below the fold
    raf = requestAnimationFrame(() => setShown(0));
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, ms]);
  return (
    <span ref={ref} className="tabular-nums">
      {shown}
    </span>
  );
}
