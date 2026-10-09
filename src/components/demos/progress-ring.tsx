"use client";

import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const GOAL = 10000;

export default function ProgressRing() {
  const [steps, setSteps] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setSteps(7200), 100);
    return () => clearTimeout(t);
  }, []);

  const pct = Math.min(100, Math.round((steps / GOAL) * 100));
  const r = 40;
  const c = 2 * Math.PI * r;
  const done = pct >= 100;

  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <div
        role="progressbar"
        aria-label="今日の歩数目標"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-valuetext={`${pct}%（${steps.toLocaleString("ja-JP")} / ${GOAL.toLocaleString("ja-JP")} 歩）`}
        className="relative size-32"
      >
        <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden>
          <circle cx="50" cy="50" r={r} className="fill-none stroke-muted" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r={r}
            className="fill-none stroke-emerald-500 transition-[stroke-dashoffset] duration-700 ease-out dark:stroke-emerald-400"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c - (pct / 100) * c}
          />
        </svg>
        <div className="absolute inset-0 grid place-content-center text-center">
          <span className="text-2xl font-semibold tabular-nums">
            {pct}
            <span className="text-sm text-muted-foreground">%</span>
          </span>
        </div>
      </div>
      <div className="space-y-2">
        <div>
          <div className="text-sm font-medium">今日の歩数</div>
          <div className="text-xs text-muted-foreground tabular-nums">
            {steps.toLocaleString("ja-JP")} / {GOAL.toLocaleString("ja-JP")} 歩
          </div>
          <div aria-live="polite" className="h-4 text-xs text-emerald-600 dark:text-emerald-400">
            {done ? "目標達成！" : ""}
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="icon-sm" variant="outline" aria-label="1,000 歩減らす" onClick={() => setSteps((s) => Math.max(0, s - 1000))}>
            <Minus />
          </Button>
          <Button size="icon-sm" variant="outline" aria-label="1,000 歩増やす" onClick={() => setSteps((s) => Math.min(GOAL, s + 1000))}>
            <Plus />
          </Button>
        </div>
      </div>
    </div>
  );
}
