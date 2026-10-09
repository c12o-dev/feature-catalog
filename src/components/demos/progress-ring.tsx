"use client";

import { useEffect, useState } from "react";

export default function ProgressRing() {
  const [v, setV] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setV(72), 100);
    return () => clearTimeout(t);
  }, []);

  const r = 40;
  const c = 2 * Math.PI * r;

  return (
    <div className="flex items-center justify-center gap-8">
      <svg width="120" height="120" viewBox="0 0 100 100" className="-rotate-90">
        <circle cx="50" cy="50" r={r} className="fill-none stroke-muted" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={r}
          className="fill-none stroke-emerald-500 transition-[stroke-dashoffset] duration-1000 ease-out"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (v / 100) * c}
        />
      </svg>
      <div>
        <div className="text-3xl font-semibold tabular-nums">{v}<span className="text-base text-muted-foreground">%</span></div>
        <div className="text-xs text-muted-foreground">Daily goal</div>
      </div>
    </div>
  );
}
