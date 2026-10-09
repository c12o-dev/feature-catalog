"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";

const opts = [
  { v: "day", label: "日", total: "1,284", bars: [3, 5, 4, 6, 8, 7, 5] },
  { v: "week", label: "週", total: "8,930", bars: [6, 7, 5, 8, 9, 7, 8] },
  { v: "month", label: "月", total: "37,412", bars: [4, 6, 7, 6, 8, 9, 10] },
  { v: "year", label: "年", total: "421,067", bars: [5, 5, 6, 7, 7, 8, 9] },
] as const;

export default function SegmentedControl() {
  const name = useId();
  const [v, setV] = useState<(typeof opts)[number]["v"]>("week");
  const cur = opts.find((o) => o.v === v)!;

  return (
    <div className="w-full max-w-xs space-y-3">
      <fieldset>
        <legend className="sr-only">集計期間</legend>
        <div className="grid grid-cols-4 rounded-lg bg-muted p-1">
          {opts.map((o) => (
            <label key={o.v} className="relative">
              <input
                type="radio"
                name={name}
                value={o.v}
                checked={v === o.v}
                onChange={() => setV(o.v)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "block cursor-pointer rounded-md px-3 py-1 text-center text-sm transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-ring/60",
                  v === o.v ? "bg-background font-medium text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {o.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="rounded-md border bg-card p-3">
        <div className="text-xs text-muted-foreground">訪問数（{cur.label}）</div>
        <div aria-live="polite" className="text-xl font-semibold tabular-nums">{cur.total}</div>
        <div className="mt-2 flex h-12 items-end gap-1" aria-hidden>
          {cur.bars.map((b, i) => (
            <div key={i} className="flex-1 rounded-sm bg-primary/70 transition-[height]" style={{ height: `${b * 10}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
