"use client";

import { Flame } from "lucide-react";

export default function StreakBadge() {
  const streak = 47;
  const week = ["月", "火", "水", "木", "金", "土", "日"];
  const today = 4; // 0=月..6=日
  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2 rounded-full bg-orange-100 dark:bg-orange-950 px-4 py-2 text-orange-700 dark:text-orange-300">
        <Flame className="size-5 fill-orange-500 text-orange-500" />
        <div className="text-sm font-semibold tabular-nums">{streak} 日連続</div>
      </div>
      <div className="flex gap-1.5">
        {week.map((d, i) => (
          <div key={d} className="flex flex-col items-center gap-1">
            <div className="text-[10px] text-muted-foreground">{d}</div>
            <div
              className={`size-7 rounded-full flex items-center justify-center text-[10px] ${
                i < today
                  ? "bg-orange-500 text-white"
                  : i === today
                  ? "bg-orange-200 dark:bg-orange-900 text-orange-700 dark:text-orange-300 ring-2 ring-orange-500"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {i <= today ? "✓" : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
