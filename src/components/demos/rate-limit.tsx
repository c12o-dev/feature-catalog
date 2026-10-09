"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LIMIT = 60;
const START_USED = 52;
const WINDOW_SEC = 10;

export default function RateLimit() {
  const [used, setUsed] = useState(START_USED);
  const [resetIn, setResetIn] = useState(WINDOW_SEC);
  const secRef = useRef(WINDOW_SEC);
  const labelId = useId();
  const remaining = LIMIT - used;
  const pct = (used / LIMIT) * 100;
  const exhausted = remaining <= 0;

  useEffect(() => {
    const id = window.setInterval(() => {
      const wrapped = secRef.current <= 1;
      secRef.current = wrapped ? WINDOW_SEC : secRef.current - 1;
      setResetIn(secRef.current);
      if (wrapped) setUsed(0);
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const tone = exhausted
    ? "bg-red-600 dark:bg-red-500"
    : pct > 80
      ? "bg-amber-500 dark:bg-amber-400"
      : "bg-emerald-600 dark:bg-emerald-500";

  return (
    <div className="mx-auto w-full max-w-sm space-y-3 rounded-lg border bg-card p-4">
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span id={labelId} className="font-medium">
          API 残量
        </span>
        <span className="text-xs text-muted-foreground tabular-nums">
          残り {remaining} / {LIMIT} 回
        </span>
      </div>
      <div
        role="progressbar"
        aria-labelledby={labelId}
        aria-valuemin={0}
        aria-valuemax={LIMIT}
        aria-valuenow={used}
        aria-valuetext={`${LIMIT} 回中 ${used} 回使用、残り ${remaining} 回`}
        className="h-2 overflow-hidden rounded-full bg-muted"
      >
        <div
          className={cn("h-full w-full origin-left transition-transform duration-300", tone)}
          style={{ transform: `scaleX(${pct / 100})` }}
        />
      </div>
      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="tabular-nums">リセットまで {resetIn} 秒</span>
        <code className="font-mono text-[11px]">X-RateLimit-Remaining: {remaining}</code>
      </div>
      <p
        aria-live="polite"
        className={cn("min-h-4 text-xs", exhausted ? "text-red-600 dark:text-red-400" : "text-muted-foreground")}
      >
        {exhausted ? "429 Too Many Requests — リセットまでお待ちください" : pct > 80 ? "上限が近づいています" : ""}
      </p>
      <Button size="sm" className="w-full" disabled={exhausted} onClick={() => setUsed((u) => Math.min(LIMIT, u + 1))}>
        リクエストを送信
      </Button>
    </div>
  );
}
