"use client";

import { useMemo } from "react";

const WEEKS = 26;
const DAYS = 7;

// Deterministic pseudo-random for stable SSR
function seedRandom(seed: number) {
  let x = seed;
  return () => {
    x = (x * 9301 + 49297) % 233280;
    return x / 233280;
  };
}

export default function ContributionHeatmap() {
  const cells = useMemo<number[]>(() => {
    const rng = seedRandom(42);
    return Array.from({ length: WEEKS * DAYS }, () => {
      const r = rng();
      if (r < 0.4) return 0;
      if (r < 0.65) return 1;
      if (r < 0.85) return 2;
      if (r < 0.95) return 3;
      return 4;
    });
  }, []);

  const levelClass = ["bg-muted", "bg-emerald-200 dark:bg-emerald-900", "bg-emerald-400 dark:bg-emerald-700", "bg-emerald-500 dark:bg-emerald-500", "bg-emerald-600 dark:bg-emerald-300"];
  const total = cells.reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <div className="text-sm font-medium">過去 {WEEKS} 週の活動</div>
        <div className="text-xs text-muted-foreground">{total} contributions</div>
      </div>
      <div className="overflow-x-auto">
        <div className="grid w-full min-w-[320px] max-w-2xl auto-cols-fr grid-flow-col grid-rows-7 gap-[3px]">
          {cells.map((level, i) => (
            <div
              key={i}
              className={`aspect-square w-full rounded-[2px] ${levelClass[level]}`}
              title={`Level ${level}`}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        Less
        {[0, 1, 2, 3, 4].map((l) => (
          <div key={l} className={`size-3 rounded-[2px] ${levelClass[l]}`} />
        ))}
        More
      </div>
    </div>
  );
}
