"use client";

import { useMemo } from "react";

function seedRandom(seed: number) {
  let x = seed;
  return () => { x = (x * 9301 + 49297) % 233280; return x / 233280; };
}

export default function CalendarHeatmap() {
  const cells = useMemo(() => {
    const rng = seedRandom(7);
    return Array.from({ length: 30 }, () => Math.floor(rng() * 5));
  }, []);
  const wd = ["日", "月", "火", "水", "木", "金", "土"];
  const cls = ["bg-muted", "bg-blue-200 dark:bg-blue-950", "bg-blue-400 dark:bg-blue-700", "bg-blue-500 dark:bg-blue-500", "bg-blue-700 dark:bg-blue-300"];
  const offset = 2;
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-7 gap-1 text-[10px] text-muted-foreground text-center">
        {wd.map((d) => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: offset }).map((_, i) => <div key={`s${i}`} />)}
        {cells.map((v, i) => (
          <div key={i} className={`aspect-square rounded ${cls[v]} flex items-center justify-center text-[10px]`}>{i + 1}</div>
        ))}
      </div>
    </div>
  );
}
