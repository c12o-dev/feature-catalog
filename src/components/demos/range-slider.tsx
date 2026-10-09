"use client";

import { useState } from "react";

const MAX = 50000;
const STEP = 500;
const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;
// mock distribution of product prices (bars behind the slider)
const HIST = [3, 6, 10, 14, 12, 9, 11, 8, 6, 5, 4, 3, 3, 2, 2, 1, 2, 1, 1, 1];

const thumb =
  "absolute inset-0 h-6 w-full appearance-none bg-transparent pointer-events-none " +
  "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-grab " +
  "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-background [&::-moz-range-thumb]:cursor-grab " +
  "[&::-moz-range-track]:bg-transparent focus-visible:outline-none [&:focus-visible::-webkit-slider-thumb]:ring-2 [&:focus-visible::-webkit-slider-thumb]:ring-ring [&:focus-visible::-moz-range-thumb]:ring-2 [&:focus-visible::-moz-range-thumb]:ring-ring";

export default function RangeSlider() {
  const [min, setMin] = useState(8000);
  const [max, setMax] = useState(30000);
  const lo = (min / MAX) * 100;
  const hi = (max / MAX) * 100;
  const peak = Math.max(...HIST);

  return (
    <div className="w-full max-w-md space-y-4 rounded-lg border bg-card p-4 text-card-foreground">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium">価格</span>
        <span className="text-xs text-muted-foreground" aria-live="polite">
          <span className="tabular-nums">{HIST.filter((_, i) => ((i + 0.5) / HIST.length) * 100 >= lo && ((i + 0.5) / HIST.length) * 100 <= hi).reduce((a, b) => a + b, 0) * 12}</span> 件
        </span>
      </div>
      <div>
        <div className="flex h-12 items-end gap-px" aria-hidden>
          {HIST.map((h, i) => {
            const c = ((i + 0.5) / HIST.length) * 100;
            return <div key={i} className={`flex-1 rounded-t-sm ${c >= lo && c <= hi ? "bg-primary/60" : "bg-muted"}`} style={{ height: `${(h / peak) * 100}%` }} />;
          })}
        </div>
        <div className="relative h-6">
          <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-muted" />
          <div className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-primary" style={{ left: `${lo}%`, right: `${100 - hi}%` }} />
          <input type="range" aria-label="最低価格" aria-valuetext={yen(min)} min={0} max={MAX} step={STEP} value={min} onChange={(e) => setMin(Math.min(+e.target.value, max - STEP))} className={thumb} />
          <input type="range" aria-label="最高価格" aria-valuetext={yen(max)} min={0} max={MAX} step={STEP} value={max} onChange={(e) => setMax(Math.max(+e.target.value, min + STEP))} className={thumb} />
        </div>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="rounded-md border bg-background px-2 py-1.5">
          <div className="text-[10px] text-muted-foreground">最低</div>
          <div className="text-sm font-medium tabular-nums">{yen(min)}</div>
        </div>
        <span className="text-muted-foreground">–</span>
        <div className="rounded-md border bg-background px-2 py-1.5">
          <div className="text-[10px] text-muted-foreground">最高</div>
          <div className="text-sm font-medium tabular-nums">{max >= MAX ? `${yen(MAX)}+` : yen(max)}</div>
        </div>
      </div>
    </div>
  );
}
