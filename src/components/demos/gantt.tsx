"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Task = { id: string; name: string; start: number; len: number; progress: number; deps: string[]; milestone?: boolean };

// Day 0 = 2026-10-01 (Thu)
const tasks: Task[] = [
  { id: "research", name: "リサーチ", start: 0, len: 3, progress: 100, deps: [] },
  { id: "design", name: "設計", start: 3, len: 3, progress: 80, deps: ["research"] },
  { id: "build", name: "実装", start: 6, len: 5, progress: 30, deps: ["design"] },
  { id: "qa", name: "QA", start: 11, len: 2, progress: 0, deps: ["build"] },
  { id: "release", name: "リリース", start: 13, len: 1, progress: 0, deps: ["qa"], milestone: true },
];

const DAYS = 14;
const ROW = 40; // px per row
const TODAY = 7; // 10/8
const WEEK = ["木", "金", "土", "日", "月", "火", "水"];
const pct = (d: number) => `${(d / DAYS) * 100}%`;
const dateLabel = (d: number) => `10/${d + 1}`;

export default function Gantt() {
  const [selected, setSelected] = useState<string>("build");
  const [scrolledToEnd, setScrolledToEnd] = useState(false);
  const sel = tasks.find((t) => t.id === selected)!;
  const index = Object.fromEntries(tasks.map((t, i) => [t.id, i]));

  return (
    <div className="w-full space-y-3">
      {/* Below sm the 560px chart overflows its stage: fade the right edge and hint until scrolled to the end. */}
      <div className="relative">
        <div
          onScroll={(e) => {
            const el = e.currentTarget;
            setScrolledToEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
          }}
          className="overflow-x-auto rounded-lg border bg-card"
        >
          <div className="grid min-w-[560px]" style={{ gridTemplateColumns: "6rem 1fr" }}>
            {/* header */}
            <div className="sticky left-0 z-20 border-b border-r bg-card px-3 py-2 text-xs font-medium text-muted-foreground">タスク</div>
            <div className="relative grid border-b" style={{ gridTemplateColumns: `repeat(${DAYS}, 1fr)` }}>
              {Array.from({ length: DAYS }, (_, d) => (
                <div key={d} className={cn("py-1 text-center text-[10px] leading-tight tabular-nums", d === TODAY ? "font-semibold text-foreground" : "text-muted-foreground")}>
                  <div>{d + 1}</div>
                  <div>{WEEK[d % 7]}</div>
                </div>
              ))}
            </div>
  
            {/* names */}
            <ul className="sticky left-0 z-20 border-r bg-card">
              {tasks.map((t) => (
                <li key={t.id} className="flex items-center truncate px-3 text-xs" style={{ height: ROW }}>
                  {t.name}
                </li>
              ))}
            </ul>
  
            {/* timeline */}
            <div className="relative" style={{ height: ROW * tasks.length }}>
              {/* weekend shading + grid */}
              {Array.from({ length: DAYS }, (_, d) => (
                <div
                  key={d}
                  aria-hidden
                  className={cn("absolute inset-y-0 border-l border-border/50", (d % 7 === 2 || d % 7 === 3) && "bg-muted/50")}
                  style={{ left: pct(d), width: pct(1) }}
                />
              ))}
              {/* today */}
              <div aria-hidden className="absolute inset-y-0 z-10 w-px bg-rose-500 dark:bg-rose-400" style={{ left: pct(TODAY + 0.5) }}>
                <span className="absolute -top-0.5 left-1 whitespace-nowrap rounded bg-rose-700 px-1 text-[9px] text-white dark:bg-rose-400 dark:text-rose-950">今日</span>
              </div>
              {/* dependency connectors */}
              <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 ${DAYS} ${tasks.length * ROW}`} preserveAspectRatio="none">
                {tasks.flatMap((t) =>
                  t.deps.map((dep) => {
                    const from = tasks[index[dep]];
                    const x1 = from.start + from.len;
                    const y1 = index[dep] * ROW + ROW / 2;
                    const x2 = t.start + (t.milestone ? 0.5 : 0);
                    const y2 = index[t.id] * ROW + ROW / 2;
                    const xm = x1 + (x2 - x1) / 2;
                    return (
                      <path
                        key={`${dep}-${t.id}`}
                        d={`M${x1} ${y1} H${xm} V${y2} H${x2}`}
                        fill="none"
                        className="stroke-muted-foreground/50"
                        strokeWidth={1.25}
                        vectorEffect="non-scaling-stroke"
                      />
                    );
                  }),
                )}
              </svg>
              {/* bars */}
              {tasks.map((t, i) => {
                const active = t.id === selected;
                const label = `${t.name} ${dateLabel(t.start)}〜${dateLabel(t.start + t.len - 1)}、進捗 ${t.progress}%`;
                return t.milestone ? (
                  <button
                    key={t.id}
                    type="button"
                    aria-label={`${t.name}（マイルストーン）${dateLabel(t.start)}`}
                    aria-pressed={active}
                    onClick={() => setSelected(t.id)}
                    className={cn(
                      "absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[2px] bg-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active && "ring-2 ring-ring ring-offset-2 ring-offset-card",
                    )}
                    style={{ left: pct(t.start + 0.5), top: i * ROW + ROW / 2 }}
                  />
                ) : (
                  <button
                    key={t.id}
                    type="button"
                    aria-label={label}
                    aria-pressed={active}
                    onClick={() => setSelected(t.id)}
                    className={cn(
                      "absolute overflow-hidden rounded-md bg-primary/25 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring",
                      active && "ring-2 ring-ring ring-offset-1 ring-offset-card",
                    )}
                    style={{ left: `calc(${pct(t.start)} + 2px)`, width: `calc(${pct(t.len)} - 4px)`, top: i * ROW + 10, height: ROW - 20 }}
                  >
                    <span className="absolute inset-y-0 left-0 bg-primary" style={{ width: `${t.progress}%` }} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-px right-px flex w-16 items-end justify-end rounded-r-lg bg-gradient-to-l from-card via-card/80 to-transparent pb-1.5 pr-2 transition-opacity sm:hidden",
            scrolledToEnd && "opacity-0",
          )}
        >
          <span className="text-[10px] text-muted-foreground">→ スクロール</span>
        </div>
      </div>

      <div aria-live="polite" className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-lg border bg-card px-3 py-2 text-sm">
        <span className="font-medium">{sel.name}</span>
        <span className="text-xs text-muted-foreground tabular-nums">
          {sel.milestone ? dateLabel(sel.start) : `${dateLabel(sel.start)}〜${dateLabel(sel.start + sel.len - 1)}（${sel.len} 日）`}
          {!sel.milestone && ` · 進捗 ${sel.progress}%`}
          {sel.deps.length > 0 && ` · 先行: ${sel.deps.map((d) => tasks[index[d]].name).join("、")}`}
        </span>
      </div>
    </div>
  );
}
