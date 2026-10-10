"use client";

import { useEffect, useRef, useState } from "react";

export default function ScrollDriven() {
  const ref = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const el = ref.current!;
    // start a little way in so the progress bar is visible before anyone scrolls
    el.scrollTop = (el.scrollHeight - el.clientHeight) * 0.25;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setPct((el.scrollTop / max) * 100);
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="rounded-md border bg-background overflow-hidden">
      <div className="h-1 bg-muted"><div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-[width]" style={{ width: `${pct}%` }} /></div>
      <div ref={ref} role="region" aria-label="スクロール領域" tabIndex={0} className="h-44 overflow-y-auto p-3 text-sm space-y-2">
        {Array.from({ length: 20 }, (_, i) => <p key={i}>スクロールすると上部のバーが進みます — 段落 {i + 1}</p>)}
      </div>
    </div>
  );
}
