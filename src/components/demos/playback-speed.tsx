"use client";

import { useRef, useState } from "react";
import { Gauge } from "lucide-react";
import { cn } from "@/lib/utils";

const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
const DURATION = 12 * 60 + 30; // 12:30
const POSITION = 4 * 60 + 10;

function mmss(s: number) {
  const r = Math.round(s);
  return `${Math.floor(r / 60)}:${String(r % 60).padStart(2, "0")}`;
}

export default function PlaybackSpeed() {
  const [v, setV] = useState(1);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const remaining = (DURATION - POSITION) / v;

  const onKey = (e: React.KeyboardEvent, i: number) => {
    let n = i;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") n = Math.min(speeds.length - 1, i + 1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = Math.max(0, i - 1);
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = speeds.length - 1;
    else return;
    e.preventDefault();
    setV(speeds[n]);
    refs.current[n]?.focus();
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-3 rounded-lg border bg-card p-4">
      <div>
        <p className="text-sm font-medium">第 3 回 デザインシステム入門</p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary" style={{ width: `${(POSITION / DURATION) * 100}%` }} />
        </div>
        <div className="mt-1 flex justify-between text-xs text-muted-foreground tabular-nums">
          <span>{mmss(POSITION)}</span>
          <span aria-live="polite">残り {mmss(remaining)}（{v}× 換算）</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Gauge className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        <div role="radiogroup" aria-label="再生速度" className="flex flex-1 flex-wrap gap-1">
          {speeds.map((s, i) => {
            const on = v === s;
            return (
              <button
                key={s}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                type="button"
                role="radio"
                aria-checked={on}
                tabIndex={on ? 0 : -1}
                onClick={() => setV(s)}
                onKeyDown={(e) => onKey(e, i)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs tabular-nums transition-colors",
                  on ? "bg-primary text-primary-foreground" : "border bg-background hover:bg-muted",
                )}
              >
                {s}×
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
