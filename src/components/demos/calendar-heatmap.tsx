"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

function seedRandom(seed: number) {
  let x = seed;
  return () => {
    x = (x * 9301 + 49297) % 233280;
    return x / 233280;
  };
}

// October 2026 starts on a Thursday.
const OFFSET = 4;
const DAYS = 31;
const rng = seedRandom(7);
const COUNTS = Array.from({ length: DAYS }, (_, i) => {
  const weekend = (OFFSET + i) % 7 === 0 || (OFFSET + i) % 7 === 6;
  return Math.round(rng() * (weekend ? 3 : 9));
});

const LEVELS = [
  { min: 0, label: "0", cls: "bg-muted" },
  { min: 1, label: "1–2", cls: "bg-emerald-200 dark:bg-emerald-900" },
  { min: 3, label: "3–4", cls: "bg-emerald-400 dark:bg-emerald-700" },
  { min: 5, label: "5–6", cls: "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-emerald-950" },
  { min: 7, label: "7+", cls: "bg-emerald-800 text-white dark:bg-emerald-300 dark:text-emerald-950" },
];
const level = (n: number) => [...LEVELS].reverse().find((l) => n >= l.min)!;
const WD = ["日", "月", "火", "水", "木", "金", "土"];

export default function CalendarHeatmap() {
  const [sel, setSel] = useState<number | null>(null);
  const total = COUNTS.reduce((a, b) => a + b, 0);

  return (
    <div className="mx-auto w-full max-w-sm space-y-3">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium">2026年10月のコミット</span>
        <span className="text-xs text-muted-foreground tabular-nums">合計 {total} 件</span>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground" aria-hidden>
        {WD.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: OFFSET }).map((_, i) => (
          <div key={`s${i}`} aria-hidden />
        ))}
        {COUNTS.map((v, i) => {
          const l = level(v);
          return (
            <button
              key={i}
              type="button"
              onClick={() => setSel(i)}
              aria-pressed={sel === i}
              aria-label={`10月${i + 1}日 ${v} 件`}
              className={cn(
                "grid aspect-square place-items-center rounded text-[10px] tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-ring",
                l.cls,
                sel === i && "ring-2 ring-foreground ring-offset-1 ring-offset-background",
              )}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p aria-live="polite" className="text-xs text-muted-foreground">
          {sel === null ? "日付を選ぶと件数を表示" : `10月${sel + 1}日（${WD[(OFFSET + sel) % 7]}）: ${COUNTS[sel]} 件`}
        </p>
        <dl className="flex items-center gap-2 text-[10px] text-muted-foreground tabular-nums">
          <dt className="sr-only">凡例（1 日あたりの件数）</dt>
          {LEVELS.map((l) => (
            <dd key={l.label} className="flex items-center gap-0.5">
              <span className={cn("size-2.5 rounded-sm", l.cls)} aria-hidden />
              {l.label}
            </dd>
          ))}
        </dl>
      </div>
    </div>
  );
}
