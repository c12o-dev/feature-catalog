"use client";

import { useState } from "react";
import { Check, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

const week = ["月", "火", "水", "木", "金", "土", "日"];
const TODAY = 3; // 0=月..6=日（2026-10-01 は木曜）

export default function StreakBadge() {
  const [doneToday, setDoneToday] = useState(false);
  const streak = 46 + (doneToday ? 1 : 0);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-orange-700 dark:bg-orange-950 dark:text-orange-300"
        aria-live="polite"
      >
        <Flame className="size-5 fill-orange-500 text-orange-500" aria-hidden />
        <span className="text-sm font-semibold tabular-nums">{streak} 日連続</span>
      </div>
      <ol className="flex flex-wrap justify-center gap-1.5" aria-label="今週の記録">
        {week.map((d, i) => {
          const done = i < TODAY || (i === TODAY && doneToday);
          const isToday = i === TODAY;
          return (
            <li key={d} className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-muted-foreground">{d}</span>
              <span
                aria-label={`${d}曜日 ${done ? "達成" : isToday ? "今日・未達成" : "未来"}`}
                className={cn(
                  "flex size-7 items-center justify-center rounded-full",
                  done ? "bg-orange-500 text-white" : "bg-muted text-muted-foreground",
                  isToday && "ring-2 ring-orange-500 ring-offset-2 ring-offset-background",
                )}
              >
                {done && <Check className="size-3.5" aria-hidden />}
              </span>
            </li>
          );
        })}
      </ol>
      <button
        type="button"
        onClick={() => setDoneToday((v) => !v)}
        aria-pressed={doneToday}
        className="rounded-md border bg-background px-3 py-1.5 text-xs hover:bg-muted"
      >
        {doneToday ? "今日の記録を取り消す" : "今日のレッスンを完了"}
      </button>
    </div>
  );
}
