"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type Item = { name: string; v: number; color: string };
type Rect = Item & { x: number; y: number; w: number; h: number };

// ストレージ使用量 (GB)。color は 1 色相の濃淡で、値が大きいほど濃い。
const data: Item[] = [
  { name: "動画", v: 48, color: "bg-teal-700 text-white dark:bg-teal-600" },
  { name: "写真", v: 31, color: "bg-teal-600 text-white dark:bg-teal-700" },
  { name: "アプリ", v: 18, color: "bg-teal-500 text-white dark:bg-teal-800" },
  { name: "書類", v: 12, color: "bg-teal-400 text-teal-950 dark:bg-teal-900 dark:text-teal-50" },
  { name: "音楽", v: 9, color: "bg-teal-300 text-teal-950 dark:bg-teal-900/80 dark:text-teal-50" },
  { name: "メール", v: 5, color: "bg-teal-200 text-teal-950 dark:bg-teal-950 dark:text-teal-100" },
  { name: "その他", v: 3, color: "bg-teal-100 text-teal-900 dark:bg-teal-950/70 dark:text-teal-100" },
];

const W = 160;
const H = 100;

/** Squarified treemap: area of each rect is proportional to its value. */
function squarify(items: Item[], x: number, y: number, w: number, h: number): Rect[] {
  const total = items.reduce((s, i) => s + i.v, 0);
  const scale = (w * h) / total;
  const nodes = items.map((i) => ({ ...i, a: i.v * scale }));
  const out: Rect[] = [];
  const worst = (row: number[], side: number) => {
    const s = row.reduce((a, b) => a + b, 0);
    const max = Math.max(...row);
    const min = Math.min(...row);
    return Math.max((side * side * max) / (s * s), (s * s) / (side * side * min));
  };
  let row: typeof nodes = [];
  let rest = nodes.slice();
  while (rest.length) {
    const side = Math.min(w, h);
    const next = rest[0];
    const cur = row.map((r) => r.a);
    if (row.length === 0 || worst(cur, side) >= worst([...cur, next.a], side)) {
      row.push(next);
      rest = rest.slice(1);
      if (rest.length) continue;
    }
    // lay out the row along the shorter side
    const s = row.reduce((a, r) => a + r.a, 0);
    if (w >= h) {
      const cw = s / h;
      let cy = y;
      row.forEach((r) => {
        const rh = r.a / cw;
        out.push({ name: r.name, v: r.v, color: r.color, x, y: cy, w: cw, h: rh });
        cy += rh;
      });
      x += cw;
      w -= cw;
    } else {
      const ch = s / w;
      let cx = x;
      row.forEach((r) => {
        const rw = r.a / ch;
        out.push({ name: r.name, v: r.v, color: r.color, x: cx, y, w: rw, h: ch });
        cx += rw;
      });
      y += ch;
      h -= ch;
    }
    row = [];
  }
  return out;
}

export default function Treemap() {
  const rects = useMemo(() => squarify([...data].sort((a, b) => b.v - a.v), 0, 0, W, H), []);
  const total = data.reduce((s, d) => s + d.v, 0);
  const [active, setActive] = useState<string | null>(null);
  const cur = rects.find((r) => r.name === active);

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-sm font-medium">ストレージの内訳</p>
        <p className="text-xs text-muted-foreground tabular-nums">合計 {total} GB / 128 GB</p>
      </div>
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-card" role="list" aria-label="ストレージの内訳（面積が使用量に比例）">
        {rects.map((r) => {
          const small = r.w < 22 || r.h < 18;
          return (
            <div
              key={r.name}
              role="listitem"
              className="absolute p-px"
              style={{ left: `${(r.x / W) * 100}%`, top: `${(r.y / H) * 100}%`, width: `${(r.w / W) * 100}%`, height: `${(r.h / H) * 100}%` }}
            >
              <button
                type="button"
                onMouseEnter={() => setActive(r.name)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(r.name)}
                onBlur={() => setActive(null)}
                onClick={() => setActive(r.name)}
                aria-label={`${r.name} ${r.v} GB（${Math.round((r.v / total) * 100)}%）`}
                className={cn(
                  "flex size-full flex-col justify-end overflow-hidden rounded-[5px] p-1.5 text-left outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                  r.color,
                  active && active !== r.name && "opacity-60",
                )}
              >
                {!small && (
                  <>
                    <span className="truncate text-xs font-semibold">{r.name}</span>
                    <span className="truncate text-[10px] opacity-80 tabular-nums">{r.v} GB</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
      <p className="h-4 text-xs text-muted-foreground tabular-nums" aria-live="polite">
        {cur ? `${cur.name}: ${cur.v} GB（全体の ${Math.round((cur.v / total) * 100)}%）` : "セルにカーソルを合わせると詳細を表示"}
      </p>
    </div>
  );
}
