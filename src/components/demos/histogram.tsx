"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/utils";

// 400 deterministic test scores (roughly normal around 52) via a seeded PRNG + Box–Muller.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(1001);
const SCORES = Array.from({ length: 400 }, () => {
  const z = Math.sqrt(-2 * Math.log(rand() || 1e-9)) * Math.cos(2 * Math.PI * rand());
  return Math.max(0, Math.min(99.9, 52 + z * 16));
});

const WIDTHS = [5, 10, 20] as const;
const H = 200;

function binsOf(width: number) {
  const n = Math.ceil(100 / width);
  const bins = Array.from({ length: n }, (_, i) => ({ from: i * width, to: (i + 1) * width, count: 0 }));
  for (const s of SCORES) bins[Math.min(n - 1, Math.floor(s / width))].count++;
  return bins.map((b) => ({ ...b, label: `${b.from}` }));
}

export default function Histogram() {
  const [width, setWidth] = useState<(typeof WIDTHS)[number]>(10);
  const bins = binsOf(width);
  const mean = SCORES.reduce((a, b) => a + b, 0) / SCORES.length;

  return (
    <div className="w-full space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-medium text-foreground">
          模試の得点分布{" "}
          <span className="text-xs font-normal text-muted-foreground tabular-nums">
            n=400 · 平均 {mean.toFixed(1)}
          </span>
        </div>
        <div
          role="radiogroup"
          aria-label="階級の幅"
          className="inline-flex rounded-md border bg-muted p-0.5 text-xs text-foreground"
          onKeyDown={(e) => {
            if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
            e.preventDefault();
            const i = WIDTHS.indexOf(width);
            const n = WIDTHS[(i + (e.key === "ArrowRight" ? 1 : WIDTHS.length - 1)) % WIDTHS.length];
            setWidth(n);
            e.currentTarget.querySelector<HTMLButtonElement>(`[data-w="${n}"]`)?.focus();
          }}
        >
          {WIDTHS.map((w) => (
            <button
              key={w}
              type="button"
              role="radio"
              data-w={w}
              aria-checked={width === w}
              tabIndex={width === w ? 0 : -1}
              onClick={() => setWidth(w)}
              className={cn("rounded px-2 py-1 tabular-nums", width === w ? "bg-background font-medium shadow-xs" : "text-muted-foreground")}
            >
              {w} 点幅
            </button>
          ))}
        </div>
      </div>
      <div style={{ height: H }}>
        <ResponsiveContainer width="100%" height={H} initialDimension={{ width: 320, height: H }}>
          {/* barCategoryGap 0: adjacent bins touch, because the variable is continuous */}
          <BarChart data={bins} barCategoryGap={0} margin={{ top: 4, right: 4, bottom: 4, left: -16 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="label"
              tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: "var(--border)" }}
              interval={width === 5 ? 1 : 0}
            />
            <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip
              cursor={{ fill: "var(--muted)", opacity: 0.6 }}
              labelFormatter={(_, p) => {
                const b = p?.[0]?.payload as { from: number; to: number } | undefined;
                return b ? `${b.from}〜${b.to} 点` : "";
              }}
              formatter={(v) => [`${v} 人`, "度数"]}
              contentStyle={{ background: "var(--popover)", color: "var(--popover-foreground)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
            />
            <Bar dataKey="count" fill="var(--chart-1)" stroke="var(--card)" strokeWidth={1} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-muted-foreground">横軸は得点（階級の下限）、縦軸は人数。階級の幅を変えると分布の見え方が変わります。</p>
    </div>
  );
}
