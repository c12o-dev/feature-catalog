"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Item = { label: string; unit: string; actual: number; target: number; ranges: [number, number, number] };

const DATA: Record<"q3" | "q2", Item[]> = {
  q3: [
    { label: "売上", unit: "百万円", actual: 78, target: 80, ranges: [50, 70, 100] },
    { label: "新規ユーザー", unit: "人", actual: 1240, target: 1500, ranges: [800, 1200, 2000] },
    { label: "NPS", unit: "pt", actual: 52, target: 50, ranges: [20, 40, 60] },
  ],
  q2: [
    { label: "売上", unit: "百万円", actual: 64, target: 75, ranges: [50, 70, 100] },
    { label: "新規ユーザー", unit: "人", actual: 980, target: 1200, ranges: [800, 1200, 2000] },
    { label: "NPS", unit: "pt", actual: 41, target: 45, ranges: [20, 40, 60] },
  ],
};

const fmt = (n: number) => n.toLocaleString("ja-JP");

export default function BulletChart() {
  const [period, setPeriod] = useState<"q3" | "q2">("q3");
  const items = DATA[period];

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-medium">KPI 達成状況</div>
        <div role="radiogroup" aria-label="期間" className="inline-flex rounded-md border p-0.5 text-xs">
          {(["q2", "q3"] as const).map((p) => (
            <button
              key={p}
              type="button"
              role="radio"
              aria-checked={period === p}
              onClick={() => setPeriod(p)}
              onKeyDown={(e) => {
                if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
                  e.preventDefault();
                  const next = p === "q2" ? "q3" : "q2";
                  setPeriod(next);
                  (e.currentTarget.parentElement?.querySelector(`[data-p="${next}"]`) as HTMLElement | null)?.focus();
                }
              }}
              data-p={p}
              tabIndex={period === p ? 0 : -1}
              className={cn("rounded px-2.5 py-1", period === p ? "bg-muted font-medium" : "text-muted-foreground")}
            >
              {p === "q2" ? "Q2" : "Q3"}
            </button>
          ))}
        </div>
      </div>

      <ul className="space-y-4">
        {items.map((it) => {
          const max = it.ranges[2];
          const pct = (v: number) => `${(v / max) * 100}%`;
          const rate = Math.round((it.actual / it.target) * 100);
          const hit = it.actual >= it.target;
          return (
            <li key={it.label} className="grid gap-1.5 sm:grid-cols-[7rem_1fr] sm:items-center sm:gap-3">
              <div className="flex items-baseline justify-between gap-2 sm:block">
                <div className="text-sm font-medium">{it.label}</div>
                <div className="text-xs text-muted-foreground tabular-nums">
                  {fmt(it.actual)} / {fmt(it.target)} {it.unit}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div
                  role="img"
                  aria-label={`${it.label}: 実績 ${fmt(it.actual)}${it.unit}、目標 ${fmt(it.target)}${it.unit}、達成率 ${rate}%`}
                  className="relative h-6 flex-1 overflow-hidden rounded"
                >
                  <div className="absolute inset-y-0 left-0 bg-zinc-300 dark:bg-zinc-700" style={{ width: pct(it.ranges[0]) }} />
                  <div className="absolute inset-y-0 bg-zinc-200 dark:bg-zinc-800" style={{ left: pct(it.ranges[0]), width: pct(it.ranges[1] - it.ranges[0]) }} />
                  <div className="absolute inset-y-0 right-0 bg-zinc-100 dark:bg-zinc-900" style={{ left: pct(it.ranges[1]) }} />
                  <div
                    className="absolute inset-y-2 left-0 origin-left rounded-sm bg-foreground transition-[width] duration-500"
                    style={{ width: pct(it.actual) }}
                  />
                  <div className="absolute inset-y-0.5 w-0.5 bg-rose-600 dark:bg-rose-400" style={{ left: pct(it.target) }} />
                </div>
                <span
                  className={cn(
                    "w-12 shrink-0 text-right text-xs font-medium tabular-nums",
                    hit ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground",
                  )}
                >
                  {rate}%
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground" aria-hidden>
        <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-4 rounded-sm bg-foreground" />実績</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-3 w-0.5 bg-rose-600 dark:bg-rose-400" />目標</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="flex h-2.5 w-6 overflow-hidden rounded-sm">
            <span className="flex-1 bg-zinc-300 dark:bg-zinc-700" />
            <span className="flex-1 bg-zinc-200 dark:bg-zinc-800" />
            <span className="flex-1 bg-zinc-100 dark:bg-zinc-900" />
          </span>
          不足 / 標準 / 良好
        </span>
      </div>
    </div>
  );
}
